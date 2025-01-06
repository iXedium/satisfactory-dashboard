import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Fade,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SettingsIcon from "@mui/icons-material/Settings";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import db, { addBuild, getBuilds, deleteBuild, Build } from "../db";

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
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item>
          <Card
            onClick={handleAddBuild}
            sx={{
              width: 280,
              minHeight: 220,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(27, 38, 49, 0.4)",
              border: "1px dashed rgba(255, 255, 255, 0.1)",
              cursor: "pointer",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                borderColor: "primary.main",
                "& .add-icon": {
                  borderColor: "primary.main",
                  color: "primary.main",
                  transform: "scale(1.1)",
                },
              },
            }}
          >
            <Box
              className="add-icon"
              sx={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease-in-out",
                color: "rgba(255, 255, 255, 0.3)",
              }}
            >
              <AddIcon sx={{ fontSize: 24 }} />
            </Box>
          </Card>
        </Grid>

        {builds.map((build) => (
          <Grid key={build.id} item>
            <Card
              sx={{
                width: 280,
                minHeight: 220,
                position: "relative",
                transition: "transform 0.2s ease-in-out",
                "&:hover": {
                  transform: "translateY(-4px)",
                  "& .card-actions": {
                    opacity: 1,
                    visibility: "visible",
                    transform: "translateY(0)",
                  },
                },
              }}
            >
              <Box
                className="card-actions"
                sx={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  display: "flex",
                  gap: 1,
                  opacity: 0,
                  visibility: "hidden",
                  transform: "translateY(-8px)",
                  transition: "all 0.2s ease-in-out",
                  zIndex: 1,
                }}
              >
                <IconButton
                  size="small"
                  onClick={() => {/* Handle edit */}}
                  sx={{ 
                    color: "text.secondary",
                    background: "rgba(42, 62, 80, 0.6)",
                    backdropFilter: "blur(8px)",
                    "&:hover": {
                      color: "secondary.main",
                      background: "rgba(42, 62, 80, 0.8)",
                    }
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleDialogOpen(build.id!)}
                  sx={{ 
                    color: "text.secondary",
                    background: "rgba(42, 62, 80, 0.6)",
                    backdropFilter: "blur(8px)",
                    "&:hover": {
                      color: "error.main",
                      background: "rgba(42, 62, 80, 0.8)",
                    }
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
              
              <CardContent sx={{ p: 2.5 }}>
                <Typography variant="h6" gutterBottom>
                  {build.name}
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Production Chain
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                    <SettingsIcon sx={{ color: "primary.main", opacity: 0.8 }} />
                    <ArrowRightAltIcon sx={{ color: "text.secondary" }} />
                    <PrecisionManufacturingIcon sx={{ color: "primary.main", opacity: 0.8 }} />
                    <ArrowRightAltIcon sx={{ color: "text.secondary" }} />
                    <ElectricBoltIcon sx={{ color: "primary.main", opacity: 0.8 }} />
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Efficiency
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={98}
                    sx={{
                      height: 8,
                      bgcolor: "rgba(255, 255, 255, 0.05)",
                      borderRadius: 1,
                      "& .MuiLinearProgress-bar": {
                        bgcolor: "primary.main",
                        opacity: 0.8,
                        borderRadius: 1,
                      },
                    }}
                  />
                  <Typography
                    variant="body2"
                    color="primary"
                    sx={{ mt: 0.5, textAlign: "right", opacity: 0.8 }}
                  >
                    98%
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Production Rate
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={75}
                    sx={{
                      height: 8,
                      bgcolor: "rgba(255, 255, 255, 0.05)",
                      borderRadius: 1,
                      "& .MuiLinearProgress-bar": {
                        bgcolor: "secondary.main",
                        opacity: 0.8,
                        borderRadius: 1,
                      },
                    }}
                  />
                  <Typography
                    variant="body2"
                    color="secondary"
                    sx={{ mt: 0.5, textAlign: "right", opacity: 0.8 }}
                  >
                    45/min
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: "#1B2631",
            border: "1px solid rgba(255, 255, 255, 0.06)",
          },
        }}
      >
        <DialogTitle>Delete Build</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "text.secondary" }}>
            Are you sure you want to delete this build? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button
            onClick={handleDialogClose}
            variant="outlined"
            color="inherit"
            sx={{ minWidth: 100 }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            variant="contained"
            color="error"
            sx={{ minWidth: 100 }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;
