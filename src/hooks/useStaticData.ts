import { useState, useEffect } from 'react';
import { Recipe, Item } from '../db/types';

interface StaticData {
  items: Item[];
  recipes: Recipe[];
  itemsMap: Map<string, Item>;
  recipesMap: Map<string, Recipe>;
  recipesByOutput: Map<string, Recipe[]>;
}

let staticData: StaticData | null = null;
let loadPromise: Promise<StaticData> | null = null;

function validateItem(item: any): item is Item {
  return (
    typeof item === 'object' &&
    item !== null &&
    typeof item.id === 'string' &&
    typeof item.name === 'string'
  );
}

const isValidRecipe = (recipe: unknown): recipe is Recipe => {
  if (!recipe || typeof recipe !== 'object') return false;

  const r = recipe as any;
  if (!r.id || !r.name || !r.producers || !r.time || !r.in || !r.out) return false;
  if (!Array.isArray(r.producers)) return false;
  if (typeof r.time !== 'number') return false;
  if (typeof r.in !== 'object' || typeof r.out !== 'object') return false;
  if (Object.keys(r.out).length === 0) return false;

  // Convert producer strings to Producer objects
  r.producers = r.producers.map((p: string) => ({
    type: p,
    multiplier: 1,
  }));

  // Convert in/out objects to arrays for UI compatibility
  r.inputs = Object.entries(r.in).map(([id, quantity]) => ({ id, quantity }));
  r.outputs = Object.entries(r.out).map(([id, quantity]) => ({ id, quantity }));

  return true;
};

async function loadStaticData(): Promise<StaticData> {
  if (staticData) return staticData;
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    try {
      console.log('Fetching data.json...');
      const response = await fetch('/data.json');
      if (!response.ok) {
        throw new Error(`Failed to load data: ${response.statusText}`);
      }

      const jsonData = await response.json();
      console.log('Received data:', jsonData);

      // Validate top-level structure
      if (!jsonData || typeof jsonData !== 'object') {
        throw new Error('Invalid JSON data: expected an object');
      }

      if (!Array.isArray(jsonData.items)) {
        throw new Error('Invalid data structure: items is not an array');
      }

      if (!Array.isArray(jsonData.recipes)) {
        throw new Error('Invalid data structure: recipes is not an array');
      }

      // Validate individual items and recipes
      const validItems = (jsonData.items as any[]).filter(item => {
        const isValid = validateItem(item);
        if (!isValid) {
          console.warn('Invalid item:', item);
        }
        return isValid;
      });

      const validRecipes = (jsonData.recipes as any[]).filter(recipe => {
        const isValid = isValidRecipe(recipe);
        if (!isValid) {
          console.warn('Invalid recipe:', recipe);
        }
        return isValid;
      });

      console.log(`Found ${validItems.length} valid items out of ${jsonData.items.length}`);
      console.log(`Found ${validRecipes.length} valid recipes out of ${jsonData.recipes.length}`);

      if (validItems.length === 0) {
        throw new Error('No valid items found in data');
      }

      if (validRecipes.length === 0) {
        throw new Error('No valid recipes found in data');
      }

      // Create efficient lookup maps
      const itemsMap = new Map<string, Item>();
      const recipesMap = new Map<string, Recipe>();
      const recipesByOutput = new Map<string, Recipe[]>();

      // Process items
      validItems.sort((a, b) => a.name.localeCompare(b.name));
      validItems.forEach(item => {
        itemsMap.set(item.id, item);
      });

      // Process recipes and create output lookup
      validRecipes.forEach(recipe => {
        recipesMap.set(recipe.id, recipe);
        recipe.outputs.forEach(output => {
          const recipes = recipesByOutput.get(output.id) || [];
          recipes.push(recipe);
          recipesByOutput.set(output.id, recipes);
        });
      });

      staticData = {
        items: validItems,
        recipes: validRecipes,
        itemsMap,
        recipesMap,
        recipesByOutput,
      };

      console.log('Static data loaded successfully');
      return staticData;
    } catch (err) {
      console.error('Error loading static data:', err);
      loadPromise = null; // Allow retry on failure
      throw err;
    }
  })();

  return loadPromise;
}

export const useStaticData = () => {
  const [data, setData] = useState<StaticData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const loadedData = await loadStaticData();
        if (mounted) {
          setData(loadedData);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          console.error('Failed to load static data:', err);
          setError(err as Error);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  return {
    items: data?.items || [],
    recipes: data?.recipes || [],
    loading,
    error,
    getItem: (id: string) => data?.itemsMap.get(id),
    getRecipe: (id: string) => data?.recipesMap.get(id),
    getRecipesForItem: (id: string) => data?.recipesByOutput.get(id) || [],
  };
}; 