import { useState, useEffect } from 'react';
import { Item } from '../db/types';
import db from '../db';

// Cache for items
let itemsCache: Item[] | null = null;
let itemMapCache: Map<string, Item> | null = null;

export const useItems = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadItems = async () => {
      try {
        // Use cache if available
        if (itemsCache) {
          setItems(itemsCache);
          setLoading(false);
          return;
        }

        // Use Dexie's collection caching
        const collection = await db.items.toCollection();
        
        // Cache the entire collection in memory
        itemsCache = await collection.toArray();
        
        // Create and cache the item map
        itemMapCache = new Map();
        itemsCache.forEach(item => {
          itemMapCache!.set(item.id, item);
        });

        setItems(itemsCache);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, []);

  // Expose the item map for efficient lookups
  const getItem = (itemId: string): Item | undefined => {
    return itemMapCache?.get(itemId);
  };

  return { items, loading, error, getItem };
}; 