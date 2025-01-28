import { useState, useEffect } from 'react';
import { Recipe } from '../db/types';
import db from '../db';

// Cache for recipes
let recipesCache: Recipe[] | null = null;
let recipeMapCache: Map<string, Recipe> | null = null;

export const useRecipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadRecipes = async () => {
      try {
        // Use cache if available
        if (recipesCache) {
          setRecipes(recipesCache);
          setLoading(false);
          return;
        }

        // Use Dexie's collection caching
        const collection = await db.recipes.toCollection();
        
        // Cache the entire collection in memory
        recipesCache = await collection.toArray();
        
        // Create and cache the recipe map
        recipeMapCache = new Map();
        recipesCache.forEach(recipe => {
          recipe.outputs.forEach(output => {
            if (!recipeMapCache!.has(output.id)) {
              recipeMapCache!.set(output.id, recipe);
            }
          });
        });

        setRecipes(recipesCache);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    loadRecipes();
  }, []);

  // Expose the recipe map for efficient lookups
  const getRecipeForItem = (itemId: string): Recipe | undefined => {
    return recipeMapCache?.get(itemId);
  };

  return { recipes, loading, error, getRecipeForItem };
}; 