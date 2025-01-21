// Filename: src/pages/ProductionPlanner.tsx

import React, { useState, useCallback } from 'react';
import { Box, Card, CardContent, Grid, TextField, Select, MenuItem, Button } from '@mui/material';
import { TreeView } from '@mui/x-tree-view/TreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { ProductionNode } from '../components/ProductionNode';
import { ProductionTreeNode } from '../types/productionTypes';
import { Recipe, Item } from '../db/types';
import { updateProductionNode } from '../utils/calculateRates';
import { useRecipes } from '../hooks/useRecipes';
import { useItems } from '../hooks/useItems';

export const ProductionPlanner: React.FC = () => {
  const { recipes, loading: recipesLoading } = useRecipes();
  const { items, loading: itemsLoading } = useItems();
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
    return recipes.filter((recipe: Recipe) => 
      recipe.outputs.some((output: { id: string; quantity: number }) => output.id === itemId)
    );
  }, [recipes]);

  const handleAddNode = () => {
    const recipe = recipes.find((recipe: Recipe) => recipe.id === selectedRecipe);
    if (!recipe) return;

    const newNode: ProductionTreeNode = {
      id: `node-${Date.now()}`,
      recipeId: recipe.id,
      name: recipe.name,
      producerType: recipe.producers[0],
      producerCount: 1,
      isByproduct: false,
      targetRate,
      actualRate: 0,
      excessRate: 0,
      efficiency: 100,
      inputs: []
    };

    const updatedNode = updateProductionNode(newNode, recipes);
    setProductionTree(prev => [...prev, updatedNode]);
  };

  const renderTree = (node: ProductionTreeNode) => (
    <TreeItem
      key={node.id}
      itemId={node.id}
      label={
        <ProductionNode
          node={node}
          recipes={recipes}
          alternateRecipes={findAlternateRecipes(node.name)}
          onUpdate={(updates) => handleNodeUpdate(node.id, updates)}
        />
      }
    >
      {node.inputs?.filter(input => !input.isByproduct).map(input => renderTree(input))}
    </TreeItem>
  );

  if (recipesLoading || itemsLoading) {
    return <Box>Loading...</Box>;
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
                  setSelectedItem(e.target.value as string);
                  setSelectedRecipe('');
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
        slots={{
          expandIcon: ChevronRightIcon,
          collapseIcon: ExpandMoreIcon,
        }}
        expandedItems={expanded}
        onExpandedItemsChange={handleNodeExpand}
      >
        {productionTree.map(node => renderTree(node))}
      </TreeView>
    </Box>
  );
};

export default ProductionPlanner;
