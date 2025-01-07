import { RichTreeView, TreeItem2 } from "@mui/x-tree-view";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Paper,
  IconButton,
  Collapse,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { useState, useEffect } from "react";
import db, { Item, Recipe } from "../db";

const ProductionPlanner = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedItemId, setSelectedItemId] = useState("");
  const [selectedRecipeId, setSelectedRecipeId] = useState("");
  const [productionRate, setProductionRate] = useState(1);
  const [isPanelOpen, setIsPanelOpen] = useState(true);

  // Fetch items on component mount
  useEffect(() => {
    const loadItems = async () => {
      const itemList = await db.items.toArray();
      setItems(itemList);
    };
    loadItems();
  }, []);

  // Fetch recipes when an item is selected
  useEffect(() => {
    const loadRecipes = async () => {
      if (selectedItemId) {
        const recipeList = await db.recipes.where("itemId").equals(selectedItemId).toArray();
        setRecipes(recipeList);
        setSelectedRecipeId(""); // Reset recipe selection
      } else {
        setRecipes([]);
      }
    };
    loadRecipes();
  }, [selectedItemId]);

  const handleAddToChain = () => {
    if (selectedItemId && selectedRecipeId && productionRate > 0) {
      console.log({
        selectedItem: items.find(item => item.id === selectedItemId),
        selectedRecipe: recipes.find(recipe => recipe.id === selectedRecipeId),
        productionRate
      });
    }
  };

  const treeItems = [
    {
      id: "1",
      label: "Iron Production",
      children: [
        {
          id: "2",
          label: "Iron Ingot",
        },
      ],
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Production Planner
      </Typography>

      <Paper 
        sx={{ 
          p: 2, 
          mb: 3, 
          bgcolor: "background.paper",
          borderRadius: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Add Production Chain
          </Typography>
          <IconButton onClick={() => setIsPanelOpen(!isPanelOpen)}>
            {isPanelOpen ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>

        <Collapse in={isPanelOpen}>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Select Item</InputLabel>
              <Select
                value={selectedItemId}
                label="Select Item"
                onChange={(e) => setSelectedItemId(e.target.value)}
              >
                {items.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Select Recipe</InputLabel>
              <Select
                value={selectedRecipeId}
                label="Select Recipe"
                onChange={(e) => setSelectedRecipeId(e.target.value)}
                disabled={!selectedItemId}
              >
                {recipes.map((recipe) => (
                  <MenuItem key={recipe.id} value={recipe.id}>
                    {`${recipe.name} - ${recipe.time}s`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Production Rate"
              type="number"
              value={productionRate}
              onChange={(e) => setProductionRate(Math.max(1, Number(e.target.value)))}
              inputProps={{ min: 1 }}
              sx={{ width: 150 }}
            />

            <Button
              variant="contained"
              onClick={handleAddToChain}
              disabled={!selectedItemId || !selectedRecipeId || productionRate < 1}
            >
              Add to Chain
            </Button>
          </Box>
        </Collapse>
      </Paper>

      <RichTreeView
        aria-label="production chain tree"
        defaultExpandedItems={["1"]}
        items={treeItems}
        sx={{
          height: 400,
          maxWidth: 400,
          overflowY: "auto",
          flexGrow: 1,
        }}
      >
        <TreeItem2 itemId="1" label="Iron Production">
          <TreeItem2 itemId="2" label="Iron Ingot" />
        </TreeItem2>
      </RichTreeView>
    </Box>
  );
};

export default ProductionPlanner;
