import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid2"; // Use Grid2
import {
  Paper,
  Typography,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import db, { addBuild, getBuilds, deleteBuild, Build } from "../db";

const Dashboard: React.FC = () => {
  const [builds, setBuilds] = useState<Build[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [buildToDelete, setBuildToDelete] = useState<number | null>(null);
  const [editingBuildId, setEditingBuildId] = useState<number | null>(null);
  const [newBuildName, setNewBuildName] = useState("");

  useEffect(() => {
    const fetchBuilds = async () => {
      const data = await getBuilds();
      setBuilds(data);
    };

    fetchBuilds();
  }, []);

  const handleAddBuild = async () => {
    await addBuild(`Build ${builds.length + 1}`, []);
    const updatedBuilds = await getBuilds();
    setBuilds(updatedBuilds);
  };

  const handleDialogOpen = (id: number) => {
    setBuildToDelete(id);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setBuildToDelete(null);
  };

  const confirmDelete = async () => {
    if (buildToDelete !== null) {
      await deleteBuild(buildToDelete);
      const updatedBuilds = await getBuilds();
      setBuilds(updatedBuilds);
      handleDialogClose();
    }
  };
  const handleEditBuild = async (id: number) => {
    const buildToEdit = builds.find((build) => build.id === id);
    if (buildToEdit) {
      setEditingBuildId(id);
      setNewBuildName(buildToEdit.name);
    }
  };

  const saveEditBuild = async () => {
    if (editingBuildId !== null) {
      const updatedBuilds = builds.map((build) =>
        build.id === editingBuildId ? { ...build, name: newBuildName } : build
      );
      setBuilds(updatedBuilds);
      await db.builds.put({
        id: editingBuildId,
        name: newBuildName,
        productionChains:
          builds.find((build) => build.id === editingBuildId)
            ?.productionChains || [],
      });
      setEditingBuildId(null); // Reset editing mode
      setNewBuildName(""); // Clear the input field
    }
  };


  const cancelEditBuild = () => {
    setEditingBuildId(null);
    setNewBuildName("");
  };

  return (
    <Grid container spacing={3}>
      {/* Dialog for Editing Builds */}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Delete Build</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this build? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={confirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Button to Add New Build */}
      <Grid sx={{ gridColumn: { xs: "span 12" } }}>
        <Button variant="contained" onClick={handleAddBuild}>
          Add New Build
        </Button>
      </Grid>

      {/* Builds List */}
      {builds.map((build) => (
        <Grid
          key={build.id}
          sx={{
            gridColumn: { xs: "span 12", sm: "span 6", md: "span 4" },
          }}
        >
          <Paper elevation={3} sx={{ padding: 2 }}>
            {editingBuildId === build.id ? (
              <>
                <input
                  type="text"
                  value={newBuildName}
                  onChange={(e) => setNewBuildName(e.target.value)}
                  style={{ marginBottom: "8px", padding: "4px", width: "100%" }}
                />
                <Button
                  onClick={saveEditBuild}
                  variant="contained"
                  sx={{ marginRight: 1 }}
                >
                  Save
                </Button>
                <Button onClick={cancelEditBuild} variant="outlined">
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Typography variant="h6">{build.name}</Typography>
                <Typography>
                  Production Chains: {build.productionChains.length}
                </Typography>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Details</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {build.productionChains.map((chain) => (
                      <div key={chain.id}>
                        {chain.name} - {chain.rate} items/min
                      </div>
                    ))}
                  </AccordionDetails>
                </Accordion>
                <Button
                  onClick={() => handleEditBuild(build.id!)}
                  variant="outlined"
                  sx={{ marginTop: 1, marginRight: 1 }}
                >
                  Edit
                </Button>
                <IconButton
                  color="error"
                  onClick={() => handleDialogOpen(build.id!)}
                  sx={{ marginTop: 1 }}
                >
                  <DeleteIcon />
                </IconButton>
              </>
            )}
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default Dashboard;
