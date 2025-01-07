// Filename: src/db/populateDatabase.ts

import db from "./index";
import { Item, Recipe } from "./types"; // Import types

// Fetch data dynamically from JSON file
const fetchData = async () => {
  const response = await fetch("/data.json");
  return await response.json();
};

const populateDatabase = async () => {
  try {
    // Fetch JSON data
    const data = await fetchData();

    // Clear existing data
    await db.items.clear();
    await db.recipes.clear();

    // Populate items
    const items: Item[] = data.items.map((item: Item) => ({
      id: item.id,
      name: item.name,
      category: item.category,
    }));
    await db.items.bulkAdd(items);

    // Populate recipes
    const recipes: Recipe[] = data.recipes.map((recipe: any) => ({
      id: recipe.id,
      itemId: Object.keys(recipe.out || {})[0] || "", // Ensure a valid string or empty string
      name: recipe.name || "Unknown Recipe", // Provide a fallback for name
      time: recipe.time || 1, // Default to 1 second if time is missing
      inputs: Object.entries(recipe.in || {}).map(([id, quantity]) => ({
        id,
        quantity,
      })), // Default to an empty array if no inputs
      outputs: Object.entries(recipe.out || {}).map(([id, quantity]) => ({
        id,
        quantity,
      })), // Default to an empty array if no outputs
      producers: recipe.producers || [], // Default to an empty array
    }));

    await db.recipes.bulkAdd(recipes);

    console.log("Database population complete!");
  } catch (error) {
    console.error("Error populating database:", error);
  }
};

populateDatabase();
