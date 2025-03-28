// App.jsx
import React, { useState } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, child } from "firebase/database";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const mealTypes = ["breakfast", "lunch", "dinner"];

export default function App() {
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [mealType, setMealType] = useState("breakfast");
  const [loading, setLoading] = useState(false);

  const spinWheel = async () => {
    setLoading(true);
    const dbRef = ref(db);
    try {
      const snapshot = await get(child(dbRef, `meals/${mealType}`));
      if (snapshot.exists()) {
        const meals = snapshot.val();
        const keys = Object.keys(meals);
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        setSelectedMeal(meals[randomKey]);
      }
    } catch (error) {
      console.error("Error fetching meals:", error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-4">🍽 Spinwheel Meal Picker</h1>

      <select
        className="mb-4 p-2 border rounded"
        value={mealType}
        onChange={(e) => setMealType(e.target.value)}
      >
        {mealTypes.map((type) => (
          <option key={type} value={type}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </option>
        ))}
      </select>

      <button
        onClick={spinWheel}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Spinning..." : "Spin the Wheel"}
      </button>

      {selectedMeal && (
        <div className="mt-6 bg-white shadow rounded p-4 w-full max-w-md">
          <h2 className="text-xl font-semibold mb-2">{selectedMeal.name}</h2>
          <p><strong>Calories:</strong> {selectedMeal.nutritionalInfo.calories}</p>
          <p><strong>Protein:</strong> {selectedMeal.nutritionalInfo.protein}</p>
          <p><strong>Carbs:</strong> {selectedMeal.nutritionalInfo.carbs}</p>
          <p><strong>Fat:</strong> {selectedMeal.nutritionalInfo.fat}</p>
          <p><strong>Estimated Cost:</strong> ${selectedMeal.estimatedCost.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
}
