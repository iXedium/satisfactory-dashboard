import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid2";
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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FactoryIcon from "@mui/icons-material/Factory";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import db, { addBuild, getBuilds, deleteBuild, Build } from "../db";

const Dashboard: React.FC = () => {
  const [builds, setBuilds] = useState<Build[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBuildId, setEditingBuildId] = useState<number | null>(null);
  const [newBuildName, setNewBuildName] = useState("");
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
      setEditingBuildId(null);
      setNewBuildName("");
    }
  };

  const cancelEditBuild = () => {
    setEditingBuildId(null);
    setNewBuildName("");
  };

  return (
    <Grid container spacing={3} sx={{ p: { xs: 2, sm: 3 } }}>
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: "#1A1D24",
            border: "1px solid rgba(255, 255, 255, 0.06)",
          },
        }}
      >
        <DialogTitle>Delete Build</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "text.secondary" }}>
            Are you sure you want to delete this build? This action cannot be
            undone.
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

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card
            elevation={0}
            sx={{
              height: 240,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px dashed rgba(255, 255, 255, 0.06)",
              background: "transparent",
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
              "&:active": {
                transform: "scale(0.98)",
              },
            }}
            onClick={handleAddBuild}
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
          <Grid key={build.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card
              elevation={0}
              sx={{
                height: 240,
                position: "relative",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  transform: "translateY(-4px)",
                },
              }}
            >
              {editingBuildId === build.id ? (
                <CardContent sx={{ height: "100%", p: 2.5 }}>
                  <input
                    type="text"
                    value={newBuildName}
                    onChange={(e) => setNewBuildName(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      border: "1px solid rgba(255, 255, 255, 0.06)",
                      background: "rgba(0, 0, 0, 0.2)",
                      color: "#E0E0E0",
                      fontSize: "1rem",
                      outline: "none",
                      marginBottom: "16px",
                    }}
                    autoFocus
                  />
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button onClick={saveEditBuild} variant="contained" fullWidth>
                      Save
                    </Button>
                    <Button
                      onClick={cancelEditBuild}
                      variant="outlined"
                      color="inherit"
                      fullWidth
                    >
                      Cancel
                    </Button>
                  </Box>
                </CardContent>
              ) : (
                <>
                  <Box
                    sx={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      display: "flex",
                      gap: 1,
                      zIndex: 1,
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={() => handleEditBuild(build.id!)}
                      sx={{
                        color: "text.secondary",
                        "&:hover": { color: "primary.main" },
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDialogOpen(build.id!)}
                      sx={{
                        color: "text.secondary",
                        "&:hover": { color: "error.main" },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>

                  <CardContent sx={{ height: "100%", p: 2.5 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 2,
                        color: "text.primary",
                        fontWeight: 600,
                      }}
                    >
                      {build.name}
                    </Typography>

                    <Box sx={{ mb: 3 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "text.secondary",
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <FactoryIcon sx={{ fontSize: 18 }} />
                        Production Chain
                      </Typography>

                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box
                          sx={{
                            p: 0.5,
                            borderRadius: 1,
                            bgcolor: "rgba(78, 204, 163, 0.1)",
                          }}
                        >
                          <FactoryIcon
                            sx={{ fontSize: 18, color: "primary.main" }}
                          />
                        </Box>
                        <ArrowRightAltIcon sx={{ color: "text.secondary" }} />
                        <Box
                          sx={{
                            p: 0.5,
                            borderRadius: 1,
                            bgcolor: "rgba(255, 255, 255, 0.05)",
                          }}
                        >
                          <FactoryIcon
                            sx={{ fontSize: 18, color: "text.secondary" }}
                          />
                        </Box>
                        <ArrowRightAltIcon sx={{ color: "text.secondary" }} />
                        <Box
                          sx={{
                            p: 0.5,
                            borderRadius: 1,
                            bgcolor: "rgba(255, 255, 255, 0.05)",
                          }}
                        >
                          <FactoryIcon
                            sx={{ fontSize: 18, color: "text.secondary" }}
                          />
                        </Box>
                      </Box>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 0.5,
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Efficiency
                        </Typography>
                        <Typography variant="body2" color="primary.main">
                          98%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={98}
                        sx={{
                          height: 6,
                          bgcolor: "rgba(78, 204, 163, 0.1)",
                          "& .MuiLinearProgress-bar": {
                            bgcolor: "primary.main",
                          },
                        }}
                      />
                    </Box>

                    <Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 0.5,
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Production Rate
                        </Typography>
                        <Typography variant="body2" color="primary.main">
                          45/min
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={75}
                        sx={{
                          height: 6,
                          bgcolor: "rgba(78, 204, 163, 0.1)",
                          "& .MuiLinearProgress-bar": {
                            bgcolor: "primary.main",
                          },
                        }}
                      />
                    </Box>
                  </CardContent>
                </>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default Dashboard;
