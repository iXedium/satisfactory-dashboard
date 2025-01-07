import ProductionNode from "../components/ProductionNode";
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
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  ListItemIcon,
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
  const [expandedNodes, setExpandedNodes] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});


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
      const selectedRecipe = recipes.find(recipe => recipe.id === selectedRecipeId);
      if (selectedRecipe) {
        setExpandedNodes([selectedRecipe.id]);
      }
      console.log({
        selectedItem: items.find(item => item.id === selectedItemId),
        selectedRecipe,
        productionRate
      });
    }
  };

//   const getItemName = (itemId: string) => {
//     return items.find(item => item.id === itemId)?.name || itemId;
//   };
const getItemName = (id: string): string => {
  const itemNames: Record<string, string> = {
    "magnetic-field-generator": "Magnetic Field Generator",
    "neural-quantum-processor": "Neural Quantum Processor",
    "superposition-oscillator": "Superposition Oscillator",
    "excited-photonic-matter": "Excited Photonic Matter",
    "ai-expansion-server": "AI Expansion Server",
    "dark-matter-residue": "Dark Matter Residue",
  };
  return itemNames[id] || id;
};



//   const selectedRecipe = recipes.find(recipe => recipe.id === selectedRecipeId);

  const selectedRecipe = {
    id: "ai-expansion-server",
    name: "AI Expansion Server",
    time: 15,
    inputs: [
      { id: "magnetic-field-generator", quantity: 1 },
      { id: "neural-quantum-processor", quantity: 1 },
      { id: "superposition-oscillator", quantity: 1 },
      { id: "excited-photonic-matter", quantity: 25 },
    ],
    outputs: [
      { id: "ai-expansion-server", quantity: 1 },
      { id: "dark-matter-residue", quantity: 25 },
    ],
  };

  const handleToggle = (nodeId: string) => {
    setExpanded((prev) => ({ ...prev, [nodeId]: !prev[nodeId] }));
  };


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
              onChange={(e) =>
                setProductionRate(Math.max(1, Number(e.target.value)))
              }
              inputProps={{ min: 1 }}
              sx={{ width: 150 }}
            />

            <Button
              variant="contained"
              onClick={handleAddToChain}
              disabled={
                !selectedItemId || !selectedRecipeId || productionRate < 1
              }
            >
              Add to Chain
            </Button>
          </Box>
        </Collapse>
      </Paper>

      <Box
        sx={{
          border: "1px solid #ccc",
          padding: 2,
          borderRadius: 2,
          maxWidth: 600,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Production Chain
        </Typography>
        <List>
          {/* Root Node */}
          <ListItem
            component="button" // Define the underlying element as a button
            onClick={() => handleToggle("root")}
            sx={{
              textAlign: "left", // Ensure text alignment for button
              width: "100%", // Make button full-width for better appearance
              border: "none", // Remove default border
              background: "none", // Ensure no background
              padding: "8px 16px", // Adjust padding
            }}
          >
            <ListItemText
              primary={`${selectedRecipe.name} (Time: ${selectedRecipe.time}s)`}
            />
          </ListItem>

          <Collapse in={!!expanded["root"]} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {/* Inputs Section */}
              <ListItem
                component="button" // Make the input/output section clickable
                onClick={() => handleToggle("inputs")}
                sx={{
                  textAlign: "left",
                  width: "100%",
                  border: "none",
                  background: "none",
                  padding: "8px 16px",
                }}
              >
                <ListItemText primary="Inputs" />
              </ListItem>

              <Collapse in={!!expanded["inputs"]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {selectedRecipe.inputs.map((input) => (
                    <ListItem key={input.id} sx={{ pl: 4 }}>
                      <ListItemText
                        primary={`${getItemName(input.id)} (x${
                          input.quantity
                        })`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Collapse>

              {/* Outputs Section */}
              <ListItem
                component="button" // Make the input/output section clickable
                onClick={() => handleToggle("inputs")}
                sx={{
                  textAlign: "left",
                  width: "100%",
                  border: "none",
                  background: "none",
                  padding: "8px 16px",
                }}
              >
                <ListItemText primary="Outputs" />
              </ListItem>

              <Collapse in={!!expanded["outputs"]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {selectedRecipe.outputs.map((output) => (
                    <ListItem key={output.id} sx={{ pl: 4 }}>
                      <ListItemText
                        primary={`${getItemName(output.id)} (x${
                          output.quantity
                        })`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </List>
          </Collapse>
        </List>
      </Box>
    </Box>
  );
};
// const ProductionPlanner = () => {
//   const sampleNode = {
//     id: "node-001",
//     recipeId: "ai-expansion-server",
//     name: "AI Expansion Server",
//     producerType: "Quantum Encoder",
//     producerCount: 2,
//     isByproduct: false,
//   };

//   return (
//     <Box sx={{ padding: 3 }}>
//       <Typography variant="h4" gutterBottom>
//         Production Planner
//       </Typography>

//       {/* Production Node */}
//       <ProductionNode
//         id={sampleNode.id}
//         recipeId={sampleNode.recipeId}
//         name={sampleNode.name}
//         producerType={sampleNode.producerType}
//         producerCount={sampleNode.producerCount}
//         isByproduct={sampleNode.isByproduct}
//       />
//     </Box>
//   );
// };


export default ProductionPlanner;
