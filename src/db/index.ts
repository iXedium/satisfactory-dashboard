import Dexie from "dexie";

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

export interface Item {
  id: string;
  name: string;
  category: string;
}

export interface Recipe {
  id: string;
  itemId: string;
  name: string;
  time: number; // Time to produce in seconds
  inputs: { id: string; quantity: number }[];
  outputs: { id: string; quantity: number }[];
  producers: string[];
}

// Database class with new tables
class AppDatabase extends Dexie {
  builds!: Dexie.Table<Build, number>;
  items!: Dexie.Table<Item, string>;
  recipes!: Dexie.Table<Recipe, string>;

  constructor() {
    super("SatisfactoryDashboard");
    this.version(1).stores({
      builds: "++id,name", // Auto-increment ID and name as indexed fields
      items: "id, name, category", // Index on id, name, and category
      recipes: "id, itemId, name", // Index on id, itemId, and name
    });
  }
}

const db = new AppDatabase();
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
