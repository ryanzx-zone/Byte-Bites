from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv

# Load API key from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

SPOONACULAR_API_KEY = os.getenv("SPOONACULAR_API_KEY")

@app.route('/')
def home():
    return "Flask server is running!"

@app.route('/recipes/search', methods=['GET'])
def search_recipes():
    query = request.args.get('q')
    
    if not query:
        return jsonify({'error': 'Missing search query'}), 400

    url = "https://api.spoonacular.com/recipes/complexSearch"
    params = {
        "query": query,
        "number": 10,
        "apiKey": SPOONACULAR_API_KEY
    }

    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        return jsonify(response.json())
    except requests.RequestException as e:
        return jsonify({'error': 'Spoonacular request failed', 'details': str(e)}), 500

@app.route('/get-recipe/<int:recipe_id>')
def get_recipe(recipe_id):
    if not SPOONACULAR_API_KEY:
        return jsonify({'error': 'API key not configured'}), 500

    url = f"https://api.spoonacular.com/recipes/{recipe_id}/information"
    params = {"apiKey": SPOONACULAR_API_KEY}

    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        return jsonify(response.json())
    except requests.RequestException as e:
        return jsonify({'error': 'Failed to fetch recipe details', 'details': str(e)}), 500    

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
