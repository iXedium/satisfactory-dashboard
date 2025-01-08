import { useState, useCallback } from 'react';
import { Recipe } from '../db/types';
import { ProductionTreeNode, ProductionRate } from '../types/productionTypes';
import { calculateProductionChain } from '../utils/productionCalculator';
import { calculateMachineEfficiency } from '../utils/rateCalculator';

export const useProductionChain = (recipes: Recipe[]) => {
  const [nodes, setNodes] = useState<ProductionTreeNode[]>([]);
  const [history, setHistory] = useState<ProductionTreeNode[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const addToHistory = useCallback((newNodes: ProductionTreeNode[]) => {
    setHistory(prev => [...prev.slice(0, historyIndex + 1), newNodes]);
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  const addNode = useCallback((recipe: Recipe, targetRate: number) => {
    const productionChain = calculateProductionChain(recipe, targetRate, recipes);
    setNodes(prev => {
      const newNodes = [...prev, productionChain];
      addToHistory(newNodes);
      return newNodes;
    });
  }, [recipes, addToHistory]);

  const deleteNode = useCallback((nodeId: string) => {
    setNodes(prev => {
      const newNodes = prev.filter(node => node.id !== nodeId);
      addToHistory(newNodes);
      return newNodes;
    });
  }, [addToHistory]);

  const updateNode = useCallback((nodeId: string, updates: Partial<ProductionTreeNode>) => {
    setNodes(prev => {
      const newNodes = prev.map(node =>
        node.id === nodeId ? { ...node, ...updates } : node
      );
      addToHistory(newNodes);
      return newNodes;
    });
  }, [addToHistory]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
      setNodes(history[historyIndex - 1]);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
      setNodes(history[historyIndex + 1]);
    }
  }, [history, historyIndex]);

  return {
    nodes,
    addNode,
    deleteNode,
    updateNode,
    undo,
    redo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1
  };
};
