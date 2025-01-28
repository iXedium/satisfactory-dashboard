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

  const handleNodeUpdate = useCallback((nodeId: string, updates: Partial<ProductionTreeNode>) => {
    // Keep track of the current expanded state before the update
    const wasExpanded = new Set(expanded);

    setProductionTree(prevTree => {
      const updateNode = (nodes: ProductionTreeNode[], parentId: string = ''): ProductionTreeNode[] => {
        return nodes.map(node => {
          if (!node || !node.id) return node;

          if (node.id === nodeId) {
            const updatedNode = { ...node, ...updates };
            
            // If recipe changed, we need to rebuild the input chain
            if (updates.recipeId && updates.recipeId !== node.recipeId) {
              const recipe = getRecipe(updates.recipeId);
              if (!recipe) return updatedNode;

              // Create new input nodes with unique IDs based on parent
              const timestamp = Date.now();
              let nodeCounter = 0;

              const createInputNodes = (
                recipe: Recipe, 
                parentRate: number,
                parentNodeId: string,
                processedItems: Set<string> = new Set()
              ): ProductionTreeNode[] => {
                const nodes: ProductionTreeNode[] = [];

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

                return nodes;
              };

              // Replace the input chain with new nodes
              updatedNode.inputs = createInputNodes(recipe, updatedNode.targetRate, updatedNode.id);

              // If this branch was expanded, keep it expanded
              if (wasExpanded.has(nodeId)) {
                // Collect all new node IDs
                const newIds = new Set<string>();
                const collectNewIds = (node: ProductionTreeNode) => {
                  if (node.id) newIds.add(node.id);
                  node.inputs?.forEach(collectNewIds);
                };
                collectNewIds(updatedNode);
                
                // Update expanded state to include all new nodes
                setExpanded(prev => [...new Set([...prev, ...newIds])]);
              }
            }

            // Update rates for this node and its inputs
            return updateProductionNode(updatedNode, recipes);
          }

          if (node.inputs) {
            return { ...node, inputs: updateNode(node.inputs, node.id) };
          }
          return node;
        }).filter(Boolean);
      };
      return updateNode(prevTree);
    });
  }, [recipes, getRecipe, getRecipesForItem, expanded]);

  const findAlternateRecipes = useCallback((itemId: string): Recipe[] => {
    // Find all recipes that produce this item as their primary output
    return recipes.filter((recipe: Recipe) => 
      Object.keys(recipe.out).includes(itemId)
    );
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

  // Add delete node functionality
  const handleDeleteNode = (nodeId: string) => {
    setProductionTree(prev => prev.filter(node => node.id !== nodeId));
  };

  const renderTree = (node: ProductionTreeNode, isRoot: boolean = false) => {
    if (!node || !node.id || !node.name || !validNodeIds.has(node.id)) return null;

    return (
      <TreeItem
        key={`tree-${node.id}`}
        nodeId={node.id}
        disabled={false}
        expandIcon={<ChevronRightIcon />}
        collapseIcon={<ExpandMoreIcon />}
        label={
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <Box sx={{ flexGrow: 1 }}>
              <ProductionNode
                node={node}
                recipes={recipes}
                alternateRecipes={findAlternateRecipes(node.name)}
                onUpdate={(updates) => handleNodeUpdate(node.id, updates)}
              />
            </Box>
            {isRoot && (
              <IconButton 
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteNode(node.id);
                }}
                size="small"
                sx={{ ml: 1 }}
              >
                <DeleteIcon />
              </IconButton>
            )}
          </Box>
        }
      >
        {node.inputs?.filter(input => input && !input.isByproduct && validNodeIds.has(input.id)).map(input => renderTree(input))}
      </TreeItem>
    );
  };

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
      <TreeErrorBoundary>
        <TreeView
          aria-label="production chain"
          defaultExpandIcon={<ChevronRightIcon />}
          defaultCollapseIcon={<ExpandMoreIcon />}
          expanded={expanded}
          onNodeToggle={handleNodeExpand}
        >
          {productionTree.map(node => renderTree(node, true))}
        </TreeView>
      </TreeErrorBoundary>
    </Box>
  );
};

export default ProductionPlanner;
