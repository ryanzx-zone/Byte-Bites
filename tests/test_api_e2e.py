import os
RUN_LIVE = os.environ.get("RUN_LIVE_TESTS", "") == "1"
if not RUN_LIVE:
    os.environ["SPOONACULAR_API_KEY"] = "test_key"
    
import pytest
from backend.app import app
import requests

@pytest.fixture
def client():
    app.config["TESTING"] = True
    return app.test_client()

class DummyResponse:
    def __init__(self, payload, status_code=200):
        self._payload = payload
        self.status_code = status_code

    def raise_for_status(self):
        if not (200 <= self.status_code < 300):
            raise Exception(f"Status {self.status_code}")

    def json(self):
        return self._payload

# 1: Search route without query returns bad request
def test_search_no_query(client):
    res = client.get("/recipes/search")
    assert res.status_code == 400
    assert res.get_json().get("error")

# 2: Successful search returns a list of recipes
def test_search_success(monkeypatch, client):
    sample = {"results": [{"id": 1, "title": "Test Soup"}]}
    monkeypatch.setattr(
        "requests.get",
        lambda url, params=None, timeout=None: DummyResponse(sample)
    )
    res = client.get("/recipes/search?q=soup")
    assert res.status_code == 200
    data = res.get_json()
    assert isinstance(data["results"], list)
    assert data["results"][0]["title"] == "Test Soup"

# 3: Retrieving a recipe by id returns correct title
def test_get_recipe(monkeypatch, client):
    sample = {"id": 42, "title": "Fresh Bread"}
    monkeypatch.setattr(
        "requests.get",
        lambda url, params=None, timeout=None: DummyResponse(sample)
    )
    res = client.get("/get-recipe/42")
    assert res.status_code == 200
    assert res.get_json()["title"] == "Fresh Bread"
    
# 4: Search results include nutrition data
def test_search_includes_nutrition_info(monkeypatch, client):
    sample = {
        "results": [
            {
                "id": 1,
                "title": "Test Dish",
                "nutrition": {
                    "nutrients": [
                        {"name": "Calories", "amount": 150, "unit": "kcal"},
                        {"name": "Fat", "amount": 5, "unit": "g"}
                    ]
                }
            }
        ]
    }
    monkeypatch.setattr(
        "requests.get",
        lambda url, params=None, timeout=None: DummyResponse(sample)
    )
    res = client.get("/recipes/search?q=test")
    assert res.status_code == 200
    data = res.get_json()
    assert "nutrition" in data["results"][0]
    nutrients = data["results"][0]["nutrition"]["nutrients"]
    assert any(n["name"] == "Calories" for n in nutrients)

# 5: Search handles multiple ingredients query
def test_search_multiple_results(monkeypatch, client):
    sample = {
        "results": [
            {"id": 1, "title": "Dish One"},
            {"id": 2, "title": "Dish Two"},
            {"id": 3, "title": "Dish Three"}
        ]
    }
    monkeypatch.setattr(
        "requests.get",
        lambda url, params=None, timeout=None: DummyResponse(sample)
    )
    res = client.get("/recipes/search?q=apple,banana,carrot")
    assert res.status_code == 200
    data = res.get_json()
    assert len(data["results"]) == 3
    
# 6: Search for single ingredient returns exactly one item
def test_search_single_ingredient(monkeypatch, client):
    sample = {
        "results": [
            {"id": 10, "title": "Hearty Soup"}
        ]
    }
    monkeypatch.setattr(
        "requests.get",
        lambda url, params=None, timeout=None: DummyResponse(sample)
    )
    res = client.get("/recipes/search?q=soup")
    assert res.status_code == 200
    data = res.get_json()
    assert len(data["results"]) == 1
    assert data["results"][0]["title"] == "Hearty Soup"
    
# 7a: Preparation‐time filter < 30 mins
def test_cook_time_less_than_30(monkeypatch, client):
    captured = {}
    def fake_get(url, params=None, timeout=None):
        captured['params'] = params
        return DummyResponse({'results': []})
    monkeypatch.setattr('requests.get', fake_get)
    res = client.get('/recipes/search?q=test&cook_time=<30')
    assert res.status_code == 200
    assert captured['params']['maxReadyTime'] == 30

# 7b: Preparation‐time filter 30‐60 mins
def test_cook_time_between_30_and_60(monkeypatch, client):
    captured = {}
    def fake_get(url, params=None, timeout=None):
        captured['params'] = params
        return DummyResponse({'results': []})
    monkeypatch.setattr('requests.get', fake_get)
    res = client.get('/recipes/search?q=test&cook_time=30-60')
    assert res.status_code == 200
    assert captured['params']['minReadyTime'] == 30 and captured['params']['maxReadyTime'] == 60

# 7c: Preparation‐time filter > 60 mins
def test_cook_time_greater_than_60(monkeypatch, client):
    captured = {}
    def fake_get(url, params=None, timeout=None):
        captured['params'] = params
        return DummyResponse({'results': []})
    monkeypatch.setattr('requests.get', fake_get)
    res = client.get('/recipes/search?q=test&cook_time=>60')
    assert res.status_code == 200
    assert captured['params']['minReadyTime'] == 60

# 8: Diet and cuisine filters
def test_diet_and_cuisine_filters(monkeypatch, client):
    captured = {}
    def fake_get(url, params=None, timeout=None):
        captured['params'] = params
        return DummyResponse({'results': []})
    monkeypatch.setattr('requests.get', fake_get)
    res = client.get('/recipes/search?q=test&dietary=vegan,vegetarian&cuisines=italian')
    assert res.status_code == 200
    assert captured['params']['diet'] == 'vegan'
    assert captured['params']['cuisine'] == 'italian'

# 9: Invalid recipe id handling
def test_get_recipe_invalid_id(monkeypatch, client):
    monkeypatch.setattr('requests.get', lambda url, params=None, timeout=None: DummyResponse({}, 404))
    res = client.get('/get-recipe/9999')
    assert res.status_code == 500
    assert 'error' in res.get_json()

# 10: Timeout handling
def test_search_timeout(monkeypatch, client):
    def fake_get(url, params=None, timeout=None):
        raise requests.exceptions.Timeout('timeout')
    monkeypatch.setattr('requests.get', fake_get)
    res = client.get('/recipes/search?q=test')
    assert res.status_code == 500
    assert res.get_json().get('error') == 'Spoonacular request failed'
