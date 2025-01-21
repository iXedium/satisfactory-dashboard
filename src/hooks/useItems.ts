import { useState, useEffect } from 'react';
import { Item } from '../db/types';
import { getAllItems } from '../db';

export function useItems() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await getAllItems();
        setItems(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch items'));
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  return { items, loading, error };
} 