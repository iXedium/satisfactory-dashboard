import Dexie from "dexie";
import { Item, Recipe as RecipeType } from "./types";

// Interfaces for existing and new tables
export interface ProductionChain {
  id: number;
  name: string;
  rate: number; // Represents production rate (e.g., items per minute)
}

export interface Build {
  id?: number;
  name: string;
  productionChains: ProductionChain[];
}

// Fix the type export
export type { Item };  // Changed from export { Item }
export interface Recipe extends RecipeType {}

// Database class with new tables
class AppDatabase extends Dexie {
  builds!: Dexie.Table<Build, number>;
  items!: Dexie.Table<Item, string>;
  recipes!: Dexie.Table<Recipe, string>;

  constructor() {
    super("SatisfactoryDashboard");
    
    // Delete the database if schema version mismatch
    this.on('blocked', () => {
      this.delete().then(() => console.log("Database deleted due to version mismatch"));
    });

    // Current schema version
    this.version(11).stores({
      builds: "++id,name",
      items: "id, name, category",
      recipes: "id, itemId, name",
    });
  }
}

const db = new AppDatabase();

// Function to reset database
export const resetDatabase = async () => {
  await db.delete();
  window.location.reload();
};

export default db;

// Build utility functions
export const addBuild = async (
  name: string,
  productionChains: ProductionChain[]
) => {
  return await db.builds.add({ name, productionChains });
};

export const getBuilds = async () => {
  return await db.builds.reverse().toArray();
};

export const deleteBuild = async (id: number) => {
  return await db.builds.delete(id);
};

// Item utility functions
export const addItems = async (items: Item[]) => {
  return await db.items.bulkAdd(items);
};

export const getItems = async () => {
  return await db.items.toArray();
};

// Recipe utility functions
export const addRecipes = async (recipes: Recipe[]) => {
  return await db.recipes.bulkAdd(recipes);
};

export const getRecipesByItemId = async (itemId: string) => {
  return await db.recipes.where("itemId").equals(itemId).toArray();
};

// Add these new query functions
export const getAllItems = async () => {
  return await db.items.toArray();
};

export const getAllRecipes = async () => {
  return await db.recipes.toArray();
};
