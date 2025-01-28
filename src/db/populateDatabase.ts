// Filename: src/db/populateDatabase.ts

import db from "./index";
import { Item, Recipe } from "./types"; // Import types

// Fetch data dynamically from JSON file
const fetchData = async (retries = 3): Promise<any> => {
  console.log("Fetching data from data.json...");
  try {
    const response = await fetch("/data.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (!data.items || !data.recipes) {
      throw new Error("Invalid data structure: missing items or recipes");
    }
    console.log("Data fetched successfully:", {
      itemCount: data.items?.length || 0,
      recipeCount: data.recipes?.length || 0
    });
    return data;
  } catch (error) {
    if (retries > 0) {
      console.log(`Retrying fetch... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return fetchData(retries - 1);
    }
    throw error;
  }
};

const populateDatabase = async () => {
  try {
    // Check if database is already populated
    const existingItems = await db.items.count();
    const existingRecipes = await db.recipes.count();
    
    if (existingItems > 0 && existingRecipes > 0) {
      console.log("Database already populated:", { existingItems, existingRecipes });
      return;
    }

    // Fetch JSON data
    const data = await fetchData();

    // Clear existing data
    console.log("Clearing existing database...");
    await db.items.clear();
    await db.recipes.clear();

    // Populate items
    const items: Item[] = data.items.map((item: Item) => ({
      id: item.id,
      name: item.name,
      category: item.category,
    }));
    console.log(`Adding ${items.length} items to database...`);
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
    console.log(`Adding ${recipes.length} recipes to database...`);
    await db.recipes.bulkAdd(recipes);

    console.log("Database population complete!");
    
    // Verify population
    const itemCount = await db.items.count();
    const recipeCount = await db.recipes.count();
    console.log("Database verification:", { itemCount, recipeCount });

    if (itemCount === 0 || recipeCount === 0) {
      throw new Error("Database population failed: no items or recipes found after population");
    }
  } catch (error) {
    console.error("Error populating database:", error);
    // Clear the database if population failed
    await db.items.clear();
    await db.recipes.clear();
    throw error;
  }
};

// Export for manual triggering if needed
export { populateDatabase };

// Auto-populate when imported
populateDatabase().catch(error => {
  console.error("Failed to populate database:", error);
  // You might want to show an error UI here
});
