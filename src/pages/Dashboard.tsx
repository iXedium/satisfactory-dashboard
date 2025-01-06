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
import { addBuild, getBuilds, deleteBuild, Build } from "../db";

const Dashboard: React.FC = () => {
  const [builds, setBuilds] = useState<Build[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [buildToDelete, setBuildToDelete] = useState<number | null>(null);

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

  return (
    <Grid container spacing={3}>
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
      <Grid sx={{ gridColumn: { xs: "span 12" } }}>
        <Button variant="contained" onClick={handleAddBuild}>
          Add New Build
        </Button>
      </Grid>
      {builds.map((build) => (
        <Grid
          key={build.id}
          sx={{
            gridColumn: { xs: "span 12", sm: "span 6", md: "span 4" },
          }}
        >
          <Paper elevation={3} sx={{ padding: 2 }}>
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
            <IconButton
              color="error"
              onClick={() => handleDialogOpen(build.id!)}
              sx={{ marginTop: 1 }}
            >
              <DeleteIcon />
            </IconButton>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default Dashboard;
