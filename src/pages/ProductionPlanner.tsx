// Filename: src/pages/ProductionPlanner.tsx

import { FC, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { TreeView } from '@mui/x-tree-view/TreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ProductionNode from "../components/ProductionNode";
import { Item, Recipe } from "../db/types";
import { getAllItems, getAllRecipes } from "../db/index";
import { calculateProductionChain } from "../utils/productionCalculator";
import { ProductionTreeNode } from "../types/productionTypes";
import { useProductionChain } from '../hooks/useProductionChain';

const ProductionPlanner: FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedItem, setSelectedItem] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState("");
  const [productionRate, setProductionRate] = useState(1);
  const [loading, setLoading] = useState(true);
  const [expandedNodes, setExpandedNodes] = useState<string[]>(['root']);

  const {
    nodes,
    addNode,
    deleteNode,
    updateNode,
    undo,
    redo,
    canUndo,
    canRedo
  } = useProductionChain(recipes);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [itemsData, recipesData] = await Promise.all([
          getAllItems(),
          getAllRecipes()
        ]);
        setItems(itemsData);
        setRecipes(recipesData);
      } catch (error) {
        console.error("Error loading data:", error);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (nodes.length > 0) {
      const getAllNodeIds = (node: ProductionTreeNode): string[] => {
        const ids = [node.id];
        if (node.inputs && node.inputs.length > 0) {
          node.inputs.forEach(input => {
            ids.push(...getAllNodeIds(input));
          });
        }
        return ids;
      };

      // Get all node IDs and add them to expanded state
      const allIds = nodes.flatMap(node => getAllNodeIds(node));
      setExpandedNodes(prev => [...new Set([...prev, ...allIds])]);
    } else {
      // Reset expanded nodes when there are no nodes
      setExpandedNodes([]);
    }
  }, [nodes]);

  const handleAddNode = () => {
    const recipe = recipes.find((r) => r.id === selectedRecipe);
    if (!recipe || productionRate <= 0) {
      alert("Please select valid inputs and set a production rate.");
      return;
    }
    addNode(recipe, productionRate);
  };

  const handleDeleteNode = (nodeId: string) => deleteNode(nodeId);
  const handleRateChange = (nodeId: string, newRate: number) => {
    updateNode(nodeId, { targetRate: newRate });
  };
  const handleRecipeChange = (nodeId: string, newRecipeId: string) => {
    const newRecipe = recipes.find(r => r.id === newRecipeId);
    if (!newRecipe) return;
    updateNode(nodeId, { 
      recipeId: newRecipeId, 
      name: newRecipe.name 
    });
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  const renderTree = (node: ProductionTreeNode) => (
    <TreeItem
      key={node.id}
      itemId={node.id}
      label={
        <Card variant="outlined" sx={{ mb: 1 }}>
          <CardContent>
            <ProductionNode
              id={node.id}
              recipeId={node.recipeId}
              name={node.name}
              producerType={node.producerType}
              producerCount={node.producerCount}
              isByproduct={node.isByproduct}
              targetRate={node.targetRate}
              actualRate={node.actualRate}
              excessRate={node.excessRate}
              efficiency={node.efficiency}
              onDelete={handleDeleteNode}
              onRateChange={handleRateChange}
              onRecipeChange={handleRecipeChange}
              alternateRecipes={recipes
                .filter((r) => r.outputs.some(output => output.id === node.recipeId))
                .map((r) => ({ id: r.id, name: r.name }))}
              machineIcon={node.producerType.icon}
            />
          </CardContent>
        </Card>
      }
    >
      {node.inputs?.map(input => renderTree(input))}
    </TreeItem>
  );

  // Filter items that have at least one recipe
  const produceableItems = items.filter(item => 
    recipes.some(recipe => recipe.outputs.some(output => output.id === item.id))
  );

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Production Planner
      </Typography>

      {/* Add Production Chain Panel */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={2}>
            {/* Item Selection */}
            <Grid item xs={4}>
              <TextField
                select
                label="Select Item"
                value={selectedItem}
                onChange={(e) => setSelectedItem(e.target.value)}
                fullWidth
              >
                {produceableItems.map((item: Item) => (
                  <MenuItem key={item.id} value={item.id}>
                    <Box display="flex" alignItems="center" gap={1}>
                      {item.icon && (
                        <img 
                          src={`/icons/${item.icon}.webp`} 
                          alt={item.name} 
                          style={{ width: 20, height: 20 }} 
                        />
                      )}
                      {item.name}
                    </Box>
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Recipe Selection */}
            <Grid item xs={4}>
              <TextField
                select
                label="Select Recipe"
                value={selectedRecipe}
                onChange={(e) => setSelectedRecipe(e.target.value)}
                fullWidth
              >
                {recipes
                  .filter((r) => r.outputs.some(output => output.id === selectedItem))
                  .map((recipe) => (
                    <MenuItem key={recipe.id} value={recipe.id}>
                      {recipe.name}
                    </MenuItem>
                  ))}
              </TextField>
            </Grid>

            {/* Production Rate */}
            <Grid item xs={2}>
              <TextField
                type="number"
                label="Production Rate"
                value={productionRate}
                onChange={(e) => setProductionRate(Number(e.target.value))}
                fullWidth
              />
            </Grid>

            {/* Add to Chain Button */}
            <Grid item xs={2}>
              <Button variant="contained" onClick={handleAddNode} fullWidth>
                Add to Chain
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Render Production Nodes */}
      <TreeView
        aria-label="production chain"
        expandedItems={expandedNodes}
        slots={{
          collapseIcon: ExpandMoreIcon,
          expandIcon: ChevronRightIcon
        }}
        onExpandedItemsChange={(event: React.SyntheticEvent, itemIds: string[]) => setExpandedNodes(itemIds)}
        sx={{ flexGrow: 1, overflowY: 'auto' }}
      >
        {nodes.map(node => renderTree(node))}
      </TreeView>
    </Box>
  );
};

export default ProductionPlanner;
