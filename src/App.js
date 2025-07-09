import React, { useState, useRef } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import './App.css';

// List of API keys
const apiKeys = [
  "AIzaSyCETBi_6UT5zVuu6JvjcuQU4l8IiPHCxxM",
  "AIzaSyBA1j_5Pb_5kG-4_Xi3pp6YG1DzZIvS8RE",
  "AIzaSyAwuWBNxTzqog_lkHz4X-sRMDbFHOvQZBY",
  "AIzaSyAxrDqHcwX0UCoGiURzxHCgdKiiF71pu6A",
  "AIzaSyDY9wjuzr7N4TXDF6f93JUzDOId6iZhha0",
  "AIzaSyBivWqCDftV_7k7kUjyzI1fkkAriD1-KGE",
  "AIzaSyAYfcTAFba5mn5LXw4UNNfnBvQEgmNbAos",
  "AIzaSyDDmY_b_6PRACvQRi53wRt4Gc2Q4gjCtlE",
  "AIzaSyD2ihzKvPnTsl3lKyfeHjPC_vlxG2fRtpo",
  "AIzaSyAbwbpRpY_ITqQWYAPvjZkGUxtmDoh9ncU",
  "AIzaSyDLr_RJsint0j4WPumQikOlHPHcsia1Hbo",
  "AIzaSyCK4BvP93-uppDkJJUMeHCud30PGYfn9Ic",
  "AIzaSyDTsv7eS31kT3LsvoiuYNe_Le0DGpubJaM",
  "AIzaSyDEzWnUzDQmYw-UxItuiz7QVQi7RvXMiTw",
  "AIzaSyC4RfSMGmwqDsV6JsZO47CEEVL3d_pIYSo",
  "AIzaSyCA0gtQoTztkO7wkAyN5q8UpESfCGzLM48",
  "AIzaSyBknxTViPKyADxmeZpdnRV4J4PyrgFWeFM",
  "AIzaSyC5gv15479xiPka5pH4iYgphdPyrFKDuz4",
  "AIzaSyAXYXTHiNKJFgcn2jwnRtmme8F723Z6P6o",
  "AIzaSyDM3sIaO5riFJ1_b85X4HLY5-KWZNwYoOQ",
  "AIzaSyCyKGZcs5MYwfGiNcKzFQPo2t2rb3g13q8",
  "AIzaSyCcZqDMBa8FcAdBxqE1o6YYvzlygmpBx14",
  "AIzaSyDZSf7H6TrRkp80Y6u6OZD-iJcYRS3S_4s",
  "AIzaSyAZHSiYkHnrNNtHVEZoEQWyDqG526adaGc",
  "AIzaSyArvzUuVG-TxNqeflFknBL1JlHfa5Y2Kww",
  "AIzaSyB3G86VV04dQp-WO9UuQ0Sbgel7_guJC2U",
  "AIzaSyAGt_AHHj4dyhAJTN7h1BiBE8b92_wUVA8",
  "AIzaSyA-9-lTQTWdNM43YdOXMQwGKDy0SrMwo6c",
  "AIzaSyCPa7adSphGkR_PWc5MCDpqH_lhydjLbdo"
];

function App() {
  const [ingredients, setIngredients] = useState('');
  const [region, setRegion] = useState('Any Region');
  const [foodType, setFoodType] = useState('Local Ghanaian Food');
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const keyIndex = useRef(0);

  const generateRecipe = async () => {
    setLoading(true);
    setError(null);
    setRecipe(null);

    let success = false;
    while (keyIndex.current < apiKeys.length && !success) {
      try {
        const apiKey = apiKeys[keyIndex.current];
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
          You are an expert Ghanaian chef. Create a recipe based on the following details:
          
          **Available Ingredients:** ${ingredients}
          **Ghanaian Region:** ${region}
          **Food Type:** ${foodType}

          Please provide a detailed recipe with a creative dish name, a list of ingredients with quantities, step-by-step instructions, prep time, cook time, and serving suggestions.
          Format the output as a JSON object with the following keys: "dishName", "ingredients" (as an array of strings), "instructions" (as an array of strings), "prepTime", "cookTime", "servingSuggestions".
          Ensure the output is a clean JSON object without any markdown formatting.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = await response.text();
        
        const cleanedText = text.replace(/^```json\n/, '').replace(/\n```$/, '');
        const parsedRecipe = JSON.parse(cleanedText);

        setRecipe(parsedRecipe);
        success = true;

      } catch (err) {
        console.error(`Error with key index ${keyIndex.current}:`, err);
        keyIndex.current++; // Move to the next key
      }
    }

    if (!success) {
      setError('Failed to generate recipe. All API keys failed.');
    }

    setLoading(false);
  };

  return (
    <div className="container-fluid app-container">
      <div className="row">
        <div className="col-md-4 sidebar">
          <h1 className="app-title">Asanka</h1>
          <p className="app-subtitle">Your AI Ghanaian Culinary Guide</p>
          
          <div className="form-group">
            <label htmlFor="ingredients">Enter Your Ingredients</label>
            <textarea 
              className="form-control" 
              id="ingredients" 
              rows="5"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="e.g., tomatoes, onions, chicken, rice"
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="region">Select Region</label>
            <select 
              className="form-control" 
              id="region"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
            >
              <option>Any Region</option>
              <option>Greater Accra</option>
              <option>Ashanti/Brong-Ahafo/Eastern</option>
              <option>Volta</option>
              <option>Northern/Upper East/Upper West</option>
              <option>Central/Western/Western North/Ahafo</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="foodType">Select Food Type</label>
            <select 
              className="form-control" 
              id="foodType"
              value={foodType}
              onChange={(e) => setFoodType(e.target.value)}
            >
              <option>Local Ghanaian Food</option>
              <option>General/Fusion Food</option>
            </select>
          </div>

          <button 
            className="btn btn-primary btn-block"
            onClick={generateRecipe}
            disabled={loading}
          >
            {loading ? 'Generating...' : (recipe ? 'Generate Another Recipe' : 'Generate Recipe')}
          </button>
        </div>
        <div className="col-md-8 recipe-output">
          {loading && (
            <div className="placeholder-text">
              <h3>Generating your recipe...</h3>
              <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          )}
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          {recipe && (
            <div>
              <h2>{recipe.dishName}</h2>
              <div className="row">
                <div className="col-md-6">
                  <h4>Ingredients</h4>
                  <ul>
                    {recipe.ingredients.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="col-md-6">
                  <p><strong>Prep Time:</strong> {recipe.prepTime}</p>
                  <p><strong>Cook Time:</strong> {recipe.cookTime}</p>
                </div>
              </div>
              <h4>Instructions</h4>
              <ol>
                {recipe.instructions.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
              <p><strong>Serving Suggestions:</strong> {recipe.servingSuggestions}</p>
            </div>
          )}
          {!loading && !recipe && !error && (
             <div className="placeholder-text">
              <h3>Your generated recipe will appear here.</h3>
              <p>Enter your ingredients and preferences to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;