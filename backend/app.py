import os, logging, traceback
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from aws_lambda_wsgi import response

# structured logging
logging.basicConfig(level=logging.INFO, format="%(levelname)s %(message)s")
log = logging.getLogger(__name__)

# Flask app setup
app = Flask(__name__)
CORS(app)

# env var check
SPOONACULAR_API_KEY = os.environ.get("SPOONACULAR_API_KEY")
if not SPOONACULAR_API_KEY:
    log.error("SPOONACULAR_API_KEY missing")
    raise RuntimeError("SPOONACULAR_API_KEY missing — check template.yaml")

@app.route("/")
def home():
    return "Flask server is running!"

@app.route("/recipes/search", methods=["GET"])
def search_recipes():
    q = request.args.get("q")
    if not q:
        return jsonify(error="Missing search query"), 400

    params = {
        "query": q,
        "number": 10,
        "apiKey": SPOONACULAR_API_KEY,
        "addRecipeInformation": True,
        "addRecipeNutrition": True  # INCLUDE nutrition info
    }

    cook = request.args.get("cook_time")
    if cook == "<30":
        params["maxReadyTime"] = 30
    elif cook == "30-60":
        params.update(minReadyTime=30, maxReadyTime=60)
    elif cook == ">60":
        params["minReadyTime"] = 60

    diet = request.args.get("dietary")
    if diet:
        allowed = {"vegan", "vegetarian", "gluten free", "keto", "paleo"}
        picks = [d for d in map(str.strip, diet.lower().split(",")) if d in allowed]
        if picks:
            params["diet"] = picks[0]

    cuisine = request.args.get("cuisines")
    if cuisine:
        params["cuisine"] = cuisine

    log.info("→ Spoonacular GET complexSearch %s", params)
    try:
        r = requests.get(
            "https://api.spoonacular.com/recipes/complexSearch",
            params=params,
            timeout=15
        )
        r.raise_for_status()
        return jsonify(r.json())
    except Exception as e:
        log.error(traceback.format_exc())
        return jsonify(error="Spoonacular request failed", detail=str(e)), 500

@app.route("/get-recipe/<int:recipe_id>")
def get_recipe(recipe_id):
    url = f"https://api.spoonacular.com/recipes/{recipe_id}/information"
    log.info("→ Spoonacular GET %s", url)
    try:
        r = requests.get(url, params={"apiKey": SPOONACULAR_API_KEY, "includeNutrition": True}, timeout=15)
        r.raise_for_status()
        return jsonify(r.json())
    except Exception as e:
        log.error(traceback.format_exc())
        return jsonify(error="Failed to fetch recipe details", detail=str(e)), 500

def handler(event, context):
    return response(app, event, context)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)


