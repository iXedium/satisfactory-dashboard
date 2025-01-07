// Filename: src/pages/ProductionPlanner.tsx

import React, { FC, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  Grid,
} from "@mui/material";
import ProductionNode from "../components/ProductionNode";
import { Item, Recipe } from "../db/types"; // Adjust the import path as necessary

interface ProductionPlannerProps {
  items: Item[]; // Array of items
  recipes: Recipe[]; // Array of recipes
}

const ProductionPlanner: FC<ProductionPlannerProps> = ({
  items = [],
  recipes = [],
}) => {
  const [selectedItem, setSelectedItem] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState("");
  const [productionRate, setProductionRate] = useState(1);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // Simulate fetching data
    const fetchData = async () => {
      setLoading(true);
      // Fetch items and recipes
      setLoading(false);
    };
    fetchData();
  }, []);

  const [nodes, setNodes] = useState<
    {
      id: string;
      recipeId: string;
      name: string;
      producerType: string;
      producerCount: number;
      isByproduct: boolean;
    }[]
  >([]);

  const handleAddNode = () => {
    const item = items.find((i) => i.id === selectedItem);
    const recipe = recipes.find((r) => r.id === selectedRecipe);

    if (!item || !recipe || productionRate <= 0) {
      alert("Please select valid inputs and set a production rate.");
      return;
    }

    const newNode = {
      id: `${recipe.id}-${nodes.length}`,
      recipeId: recipe.id,
      name: recipe.name,
      producerType: recipe.producers[0], // Assuming the first producer type
      producerCount: productionRate,
      isByproduct: false,
    };

    setNodes((prevNodes) => [...prevNodes, newNode]);
  };
  
  if (loading) {
    return <Typography>Loading...</Typography>;
  }


  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Production Planner
      </Typography>

      {/* Add Production Chain Panel */}
      <Box sx={{ mb: 4, border: "1px solid", padding: 2, borderRadius: 2 }}>
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
              {items?.map((item: Item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
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
                .filter((r) => r.itemId === selectedItem)
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
      </Box>

      {/* Render Production Nodes */}
      <Box>
        {nodes.map((node) => (
          <ProductionNode
            key={node.id}
            id={node.id}
            recipeId={node.recipeId}
            name={node.name}
            producerType={node.producerType}
            producerCount={node.producerCount}
            isByproduct={node.isByproduct}
          />
        ))}
      </Box>
    </Box>
  );
};

export default ProductionPlanner;
