// Filename: src/pages/ProductionPlanner.tsx

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Box, Card, CardContent, Grid, TextField, Select, MenuItem, Button, Typography, IconButton } from '@mui/material';
import { TreeView } from '@mui/x-tree-view/TreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DeleteIcon from '@mui/icons-material/Delete';
import { ProductionNode } from '../components/ProductionNode';
import { ProductionTreeNode } from '../types/productionTypes';
import { Recipe, Item } from '../db/types';
import { updateProductionNode } from '../utils/calculateRates';
import { useStaticData } from '../hooks/useStaticData';

// Error boundary component
class TreeErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('TreeView error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 2, color: 'error.main' }}>
          <Typography>Something went wrong with the tree view. Please refresh the page.</Typography>
        </Box>
      );
    }

    return this.props.children;
  }
}

// Memoized Tree Item component to prevent unnecessary re-renders
const MemoizedTreeItem = React.memo(({ 
  node, 
  recipes, 
  alternateRecipes,
  onNodeUpdate,
  onNodeDelete,
  findAlternateRecipes,
  isRoot = false 
}: {
  node: ProductionTreeNode;
  recipes: Recipe[];
  alternateRecipes: Recipe[];
  onNodeUpdate: (nodeId: string, updates: Partial<ProductionTreeNode>) => void;
  onNodeDelete: (nodeId: string) => void;
  findAlternateRecipes: (itemId: string, currentRecipeId?: string) => Recipe[];
  isRoot?: boolean;
}) => {
  // Memoize handlers to prevent new references on every render
  const handleUpdate = useCallback((updates: Partial<ProductionTreeNode>) => {
    onNodeUpdate(node.id, updates);
  }, [node.id, onNodeUpdate]);

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onNodeDelete(node.id);
  }, [node.id, onNodeDelete]);

  // Memoize the node object to prevent unnecessary re-renders
  const stableNode = useMemo(() => ({
    ...node,
    inputs: node.inputs || []
  }), [
    node.id,
    node.recipeId,
    node.producerCount,
    node.producerType.multiplier,
    node.actualRate,
    node.excessRate,
    node.targetRate,
    node.machineClock
  ]);

  return (
    <TreeItem
      nodeId={node.id}
      expandIcon={<ChevronRightIcon />}
      collapseIcon={<ExpandMoreIcon />}
      label={
        <Box sx={{ position: 'relative' }}>
          {isRoot && (
            <IconButton 
              onClick={handleDelete}
              size="small"
              sx={{ 
                position: 'absolute',
                left: -36,
                top: '10%',
                zIndex: 1,
                p: 0.5,
                bgcolor: 'action.hover',
                '&:hover': { 
                  bgcolor: 'action.selected',
                  color: 'error.main'
                }
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
          <Box sx={{ flexGrow: 1 }}>
            <ProductionNode
              node={stableNode}
              recipes={recipes}
              alternateRecipes={alternateRecipes}
              onUpdate={handleUpdate}
            />
          </Box>
        </Box>
      }
    >
      {stableNode.inputs
        ?.filter(input => input && !input.isByproduct)
        .map(input => (
          <MemoizedTreeItem
            key={input.id}
            node={input}
            recipes={recipes}
            alternateRecipes={findAlternateRecipes(input.name, input.recipeId)}
            onNodeUpdate={onNodeUpdate}
            onNodeDelete={onNodeDelete}
            findAlternateRecipes={findAlternateRecipes}
          />
        ))}
    </TreeItem>
  );
});

MemoizedTreeItem.displayName = 'MemoizedTreeItem';

export const ProductionPlanner: React.FC = () => {
  const { 
    items, 
    recipes, 
    loading, 
    error,
    getRecipe,
    getRecipesForItem 
  } = useStaticData();

  const [expanded, setExpanded] = useState<string[]>([]);
  const [productionTree, setProductionTree] = useState<ProductionTreeNode[]>([]);
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [selectedRecipe, setSelectedRecipe] = useState<string>('');
  const [targetRate, setTargetRate] = useState<number>(1);

  // Memoize produceable items to avoid recalculation
  const produceableItems = useMemo(() => 
    items.filter((item: Item) => getRecipesForItem(item.id).length > 0),
    [items, getRecipesForItem]
  );

  // Memoize available recipes for selected item
  const availableRecipes = useMemo(() => 
    selectedItem ? getRecipesForItem(selectedItem) : [],
    [selectedItem, getRecipesForItem]
  );

  // Keep track of valid node IDs
  const [validNodeIds, setValidNodeIds] = useState<Set<string>>(new Set());

  // Update valid node IDs whenever the tree changes
  useEffect(() => {
    const collectNodeIds = (nodes: ProductionTreeNode[]): Set<string> => {
      const ids = new Set<string>();
      const processNode = (node: ProductionTreeNode) => {
        if (node && node.id) {
          ids.add(node.id);
          if (node.inputs) {
            node.inputs.forEach(processNode);
          }
        }
      };
      nodes.forEach(processNode);
      return ids;
    };

    const newValidIds = collectNodeIds(productionTree);
    setValidNodeIds(newValidIds);

    // Clean up expanded state
    setExpanded(prev => prev.filter(id => newValidIds.has(id)));
  }, [productionTree]);

  const handleNodeExpand = (_event: React.SyntheticEvent, itemIds: string[]) => {
    setExpanded(itemIds);
  };

  // Helper to find path from root to target node
  const findNodePath = useCallback((nodes: ProductionTreeNode[], targetId: string): string[] | null => {
    for (const node of nodes) {
      if (node.id === targetId) {
        return [node.id];
      }
      if (node.inputs) {
        const childPath = findNodePath(node.inputs, targetId);
        if (childPath) {
          return [node.id, ...childPath];
        }
      }
    }
    return null;
  }, []);

  // Pure function to update a node and its children
  const updateNodeAndRates = useCallback((node: ProductionTreeNode, changes: Partial<ProductionTreeNode>): ProductionTreeNode => {
    // Create new node with changes
    const updatedNode = {
      ...node,
      ...changes,
      // Create new inputs array if it exists
      inputs: node.inputs ? [...node.inputs] : undefined
    };
    
    // Calculate new rates for this node and its subtree
    return updateProductionNode(updatedNode, recipes);
  }, [recipes]);

  // Pure function to update tree following a path
  const updateTreeAlongPath = useCallback((
    nodes: ProductionTreeNode[],
    path: string[],
    targetId: string,
    changes: Partial<ProductionTreeNode>
  ): ProductionTreeNode[] => {
    if (!path.length) return nodes;

    return nodes.map(node => {
      // If this is our target node, apply changes and update rates
      if (node.id === targetId) {
        return updateNodeAndRates(node, changes);
      }

      // Check if this node is in the path to the target
      const isInPath = path.includes(node.id);
      
      // If node has inputs, we need to check them for updates
      if (node.inputs?.length) {
        let anyChildUpdated = false;
        const updatedInputs = node.inputs.map(input => {
          const updatedInput = updateTreeAlongPath(
            [input],
            path,
            targetId,
            changes
          )[0];
          
          if (updatedInput !== input) {
            anyChildUpdated = true;
          }
          return updatedInput;
        });

        // Only create new node reference if this node is in the path
        // or if any of its children were updated
        if (isInPath || anyChildUpdated) {
          const newNode = {
            ...node,
            inputs: updatedInputs
          };
          // Recalculate rates for this node since children changed
          return updateProductionNode(newNode, recipes);
        }
      }

      // Return original node if no changes were needed
      return node;
    });
  }, [recipes, updateNodeAndRates]);

  const handleNodeUpdate = useCallback((nodeId: string, updates: Partial<ProductionTreeNode>) => {
    setProductionTree(prevTree => {
      // Find the path from root to target node
      const path = findNodePath(prevTree, nodeId);
      if (!path) return prevTree;

      // Update the tree with new references along the path
      const updatedTree = updateTreeAlongPath(prevTree, path, nodeId, updates);

      // Return new tree reference
      return updatedTree;
    });
  }, [findNodePath, updateTreeAlongPath]);

  const handleNodeDelete = useCallback((nodeId: string) => {
    setProductionTree(prev => prev.filter(node => node.id !== nodeId));
  }, []);

  const findAlternateRecipes = useCallback((itemId: string, currentRecipeId?: string): Recipe[] => {
    // Find all recipes that produce this item as their primary output
    const alternates = recipes.filter((recipe: Recipe) => {
      const mainOutput = Object.entries(recipe.out)[0];
      return mainOutput[0] === itemId;
    });

    // If we have a current recipe and it's not in the alternates, add it
    if (currentRecipeId) {
      const currentRecipe = recipes.find(r => r.id === currentRecipeId);
      if (currentRecipe && !alternates.some(r => r.id === currentRecipeId)) {
        alternates.push(currentRecipe);
      }
    }

    return alternates;
  }, [recipes]);

  // Function to get all node IDs recursively
  const getAllNodeIds = useCallback((nodes: ProductionTreeNode[]): string[] => {
    return nodes.reduce((acc: string[], node) => {
      acc.push(node.id);
      if (node.inputs) {
        acc.push(...getAllNodeIds(node.inputs));
      }
      return acc;
    }, []);
  }, []);

  const handleAddNode = useCallback(() => {
    const recipe = getRecipe(selectedRecipe);
    if (!recipe) return;

    const timestamp = Date.now();
    const rootNodeId = `node-${timestamp}`;

    // Create the root node
    const newNode: ProductionTreeNode = {
      id: rootNodeId,
      recipeId: recipe.id,
      name: selectedItem,
      producerType: {
        ...recipe.producers[0],
        multiplier: 1
      },
      producerCount: 1,
      isByproduct: false,
      targetRate,
      actualRate: 0,
      excessRate: 0,
      efficiency: 100,
      machineClock: 100,
      inputs: []
    };

    // Create input nodes recursively with optimized lookup
    const createInputNodes = (
      recipe: Recipe, 
      parentRate: number,
      parentNodeId: string,
      processedItems: Set<string> = new Set()
    ): ProductionTreeNode[] => {
      const nodes: ProductionTreeNode[] = [];
      let nodeCounter = 0;

      const inputs = Object.entries(recipe.in).map(([id, quantity]) => ({ id, quantity }));
      for (const input of inputs) {
        if (processedItems.has(input.id)) continue;

        const inputRecipes = getRecipesForItem(input.id);
        if (!inputRecipes.length) continue;

        const inputRecipe = inputRecipes[0];
        const mainOutput = Object.entries(recipe.out)[0];
        const inputRate = (input.quantity / mainOutput[1]) * parentRate;
        processedItems.add(input.id);

        const newNodeId = `${parentNodeId}-${nodeCounter++}`;
        const inputNode: ProductionTreeNode = {
          id: newNodeId,
          recipeId: inputRecipe.id,
          name: input.id,
          producerType: {
            ...inputRecipe.producers[0],
            multiplier: 1
          },
          producerCount: 1,
          isByproduct: false,
          targetRate: inputRate,
          actualRate: 0,
          excessRate: 0,
          efficiency: 100,
          machineClock: 100,
          inputs: []
        };

        inputNode.inputs = createInputNodes(
          inputRecipe, 
          inputRate,
          newNodeId,
          processedItems
        );
        nodes.push(inputNode);
      }

      // Add byproducts
      const outputs = Object.entries(recipe.out);
      const mainOutputId = outputs[0][0];
      for (const [id, quantity] of outputs) {
        if (id !== mainOutputId) {
          const byproductId = `${parentNodeId}-byproduct-${nodeCounter++}`;
          nodes.push({
            id: byproductId,
            recipeId: recipe.id,
            name: id,
            producerType: {
              ...recipe.producers[0],
              multiplier: 1
            },
            producerCount: 0,
            isByproduct: true,
            targetRate: 0,
            actualRate: 0,
            excessRate: 0,
            efficiency: 100,
            machineClock: 0,
            inputs: []
          });
        }
      }

      return nodes;
    };

    newNode.inputs = createInputNodes(recipe, targetRate, rootNodeId);
    const updatedNode = updateProductionNode(newNode, recipes);
    
    setProductionTree(prev => [...prev, updatedNode]);
    
    // Collect all node IDs to expand
    const expandedNodes = new Set<string>();
    const addNodeToExpanded = (node: ProductionTreeNode) => {
      if (node.id) expandedNodes.add(node.id);
      node.inputs?.forEach(addNodeToExpanded);
    };
    addNodeToExpanded(updatedNode);
    
    setExpanded(prev => [...new Set([...prev, ...expandedNodes])]);
  }, [selectedRecipe, selectedItem, targetRate, recipes, getRecipe, getRecipesForItem]);

  // Memoize the tree rendering to prevent unnecessary re-renders
  const renderTree = useMemo(() => (
    <TreeErrorBoundary>
      <TreeView
        aria-label="production chain"
        defaultExpandIcon={<ChevronRightIcon />}
        defaultCollapseIcon={<ExpandMoreIcon />}
        expanded={expanded}
        onNodeToggle={handleNodeExpand}
      >
        {productionTree.map(node => (
          <MemoizedTreeItem
            key={node.id}
            node={node}
            recipes={recipes}
            alternateRecipes={findAlternateRecipes(node.name, node.recipeId)}
            onNodeUpdate={handleNodeUpdate}
            onNodeDelete={handleNodeDelete}
            findAlternateRecipes={findAlternateRecipes}
            isRoot
          />
        ))}
      </TreeView>
    </TreeErrorBoundary>
  ), [productionTree, expanded, recipes, findAlternateRecipes, handleNodeUpdate, handleNodeDelete]);

  if (loading) {
    return (
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
        <Typography>Loading production data...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Failed to load production data. Please check your connection and try again.
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
          Error: {error.message}
        </Typography>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Reload Page
        </Button>
      </Box>
    );
  }

  if (!items.length || !recipes.length) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body1" sx={{ mb: 2 }}>
          No production data found. Please check that data.json is properly configured.
        </Typography>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Reload Page
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      {/* Add Production Node Form */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <Select
                fullWidth
                value={selectedItem}
                onChange={(e) => {
                  const itemId = e.target.value as string;
                  setSelectedItem(itemId);
                  // Auto-select first available recipe
                  const firstRecipe = recipes.find((recipe: Recipe) => 
                    Object.keys(recipe.out).includes(itemId)
                  );
                  if (firstRecipe) {
                    setSelectedRecipe(firstRecipe.id);
                  } else {
                    setSelectedRecipe('');
                  }
                }}
                displayEmpty
                size="small"
              >
                <MenuItem value="" disabled>Select Item</MenuItem>
                {produceableItems.map((item: Item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Select
                fullWidth
                value={selectedRecipe}
                onChange={(e) => setSelectedRecipe(e.target.value as string)}
                disabled={!selectedItem}
                displayEmpty
                size="small"
              >
                <MenuItem value="" disabled>Select Recipe</MenuItem>
                {availableRecipes.map((recipe: Recipe) => (
                  <MenuItem key={recipe.id} value={recipe.id}>
                    {recipe.name}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                type="number"
                label="Target Rate"
                value={targetRate}
                onChange={(e) => setTargetRate(Math.max(0.1, Number(e.target.value)))}
                size="small"
                inputProps={{ min: 0.1, step: 0.1 }}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleAddNode}
                disabled={!selectedRecipe || targetRate <= 0}
              >
                Add Node
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Production Tree */}
      {renderTree}
    </Box>
  );
};

export default ProductionPlanner;
