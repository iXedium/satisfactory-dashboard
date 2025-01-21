import { useState, useEffect } from 'react';
import { Recipe } from '../db/types';
import { getAllRecipes } from '../db';

export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const data = await getAllRecipes();
        setRecipes(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch recipes'));
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  return { recipes, loading, error };
} 