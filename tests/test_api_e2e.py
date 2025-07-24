import os

RUN_LIVE = os.environ.get("RUN_LIVE_TESTS", "") == "1"
if not RUN_LIVE:
    os.environ["SPOONACULAR_API_KEY"] = "test_key"

import pytest
from backend.app import app

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

def test_search_no_query(client):
    res = client.get("/recipes/search")
    assert res.status_code == 400
    assert res.get_json().get("error")

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

def test_get_recipe(monkeypatch, client):
    sample = {"id": 42, "title": "Fresh Bread"}
    monkeypatch.setattr(
        "requests.get",
        lambda url, params=None, timeout=None: DummyResponse(sample)
    )
    res = client.get("/get-recipe/42")
    assert res.status_code == 200
    assert res.get_json()["title"] == "Fresh Bread"

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

@pytest.mark.skipif(not RUN_LIVE, reason="Skipping live Spoonacular API tests")
def test_live_search_smoke(client):
    """Real network call through your Flask endpoint → Spoonacular → back."""
    res = client.get("/recipes/search?q=chicken")
    assert res.status_code == 200, f"Expected 200, got {res.status_code}"
    data = res.get_json()
    assert isinstance(data.get("results"), list) and len(data["results"]) > 0
    first = data["results"][0]
    assert "id" in first and "title" in first and "nutrition" in first
