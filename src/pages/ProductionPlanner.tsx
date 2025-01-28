// Filename: src/pages/ProductionPlanner.tsx

import React, { useState, useCallback } from 'react';
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
import { useRecipes } from '../hooks/useRecipes';
import { useItems } from '../hooks/useItems';
import { resetDatabase } from "../db";

export const ProductionPlanner: React.FC = () => {
  const { recipes, loading: recipesLoading, error: recipesError } = useRecipes();
  const { items, loading: itemsLoading, error: itemsError } = useItems();
  const [expanded, setExpanded] = useState<string[]>([]);
  const [productionTree, setProductionTree] = useState<ProductionTreeNode[]>([]);
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [selectedRecipe, setSelectedRecipe] = useState<string>('');
  const [targetRate, setTargetRate] = useState<number>(1);

  const handleNodeExpand = (_event: React.SyntheticEvent, itemIds: string[]) => {
    setExpanded(itemIds);
  };

  const handleNodeUpdate = useCallback((nodeId: string, updates: Partial<ProductionTreeNode>) => {
    setProductionTree(prevTree => {
      const updateNode = (nodes: ProductionTreeNode[]): ProductionTreeNode[] => {
        return nodes.map(node => {
          if (node.id === nodeId) {
            const updatedNode = { ...node, ...updates };
            // Recalculate the entire subtree when a node is updated
            return updateProductionNode(updatedNode, recipes);
          }
          if (node.inputs) {
            return { ...node, inputs: updateNode(node.inputs) };
          }
          return node;
        });
      };
      return updateNode(prevTree);
    });
  }, [recipes]);

  const findAlternateRecipes = useCallback((itemId: string): Recipe[] => {
    // Find all recipes that produce this item as their primary output
    return recipes.filter((recipe: Recipe) => 
      recipe.outputs.some(output => output.id === itemId)
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

  // Update handleAddNode to expand all nodes by default
  const handleAddNode = () => {
    const recipe = recipes.find((recipe: Recipe) => recipe.id === selectedRecipe);
    if (!recipe) return;

    // Create the root node
    const newNodeId = `node-${Date.now()}`;
    const newNode: ProductionTreeNode = {
      id: newNodeId,
      recipeId: recipe.id,
      name: selectedItem, // Use the selected item ID instead of recipe name
      producerType: recipe.producers[0],
      producerCount: 1,
      isByproduct: false,
      targetRate,
      actualRate: 0,
      excessRate: 0,
      efficiency: 100,
      inputs: []
    };

    // Create input nodes recursively
    const createInputNodes = (recipe: Recipe, parentRate: number): ProductionTreeNode[] => {
      return recipe.inputs.map(input => {
        // Calculate required input rate based on recipe ratios
        const inputRate = (input.quantity / recipe.outputs[0].quantity) * parentRate;
        
        // Find a recipe that produces this input
        const inputRecipe = recipes.find(r => 
          r.outputs.some(output => output.id === input.id)
        );
        
        if (!inputRecipe) return null;

        const inputNode: ProductionTreeNode = {
          id: `node-${Date.now()}-${input.id}`,
          recipeId: inputRecipe.id,
          name: input.id,
          producerType: inputRecipe.producers[0],
          producerCount: 1,
          isByproduct: false,
          targetRate: inputRate,
          actualRate: 0,
          excessRate: 0,
          efficiency: 100,
          inputs: []
        };

        // Recursively create inputs for this node
        inputNode.inputs = createInputNodes(inputRecipe, inputRate);
        return inputNode;
      }).filter(Boolean) as ProductionTreeNode[];
    };

    // Create the full production chain
    newNode.inputs = createInputNodes(recipe, targetRate);

    // Update rates throughout the chain
    const updatedNode = updateProductionNode(newNode, recipes);
    setProductionTree(prev => [...prev, updatedNode]);
    
    // Expand all nodes in the tree
    const allNodeIds = getAllNodeIds([updatedNode]);
    setExpanded(prev => [...new Set([...prev, ...allNodeIds])]);
  };

  // Add delete node functionality
  const handleDeleteNode = (nodeId: string) => {
    setProductionTree(prev => prev.filter(node => node.id !== nodeId));
  };

  const renderTree = (node: ProductionTreeNode, isRoot: boolean = false) => (
    <TreeItem
      key={node.id}
      nodeId={node.id}
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
      {node.inputs?.filter(input => !input.isByproduct).map(input => renderTree(input))}
    </TreeItem>
  );

  if (recipesLoading || itemsLoading) {
    return (
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
        <div>Loading data...</div>
      </Box>
    );
  }

  if (itemsError || recipesError) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Error loading data. This may be due to a database version mismatch.
        </Typography>
        <Button variant="contained" color="error" onClick={resetDatabase} sx={{ mr: 1 }}>
          Reset Database
        </Button>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </Box>
    );
  }

  if (!items.length || !recipes.length) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body1" sx={{ mb: 2 }}>
          No items or recipes found in database. The database may need to be reset.
        </Typography>
        <Button variant="contained" color="error" onClick={resetDatabase} sx={{ mr: 1 }}>
          Reset Database
        </Button>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </Box>
    );
  }

  // Filter items that have recipes
  const produceableItems = items.filter((item: Item) => 
    recipes.some((recipe: Recipe) => 
      recipe.outputs.some((output: { id: string; quantity: number }) => output.id === item.id)
    )
  );

  // Get available recipes for selected item
  const availableRecipes = selectedItem ? 
    recipes.filter((recipe: Recipe) => 
      recipe.outputs.some((output: { id: string; quantity: number }) => output.id === selectedItem)
    ) : 
    [];

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
                    recipe.outputs.some(output => output.id === itemId)
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
      <TreeView
        aria-label="production chain"
        defaultExpandIcon={<ChevronRightIcon />}
        defaultCollapseIcon={<ExpandMoreIcon />}
        expanded={expanded}
        onNodeToggle={handleNodeExpand}
      >
        {productionTree.map(node => renderTree(node, true))}
      </TreeView>
    </Box>
  );
};

export default ProductionPlanner;
