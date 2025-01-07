import React, { useEffect, useRef, useState } from "react";
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
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SettingsIcon from "@mui/icons-material/Settings";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import db, { addBuild, getBuilds, deleteBuild, Build } from "../db";
import { alpha } from "@mui/material/styles";

const Dashboard: React.FC = () => {
  const [builds, setBuilds] = useState<Build[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [buildToDelete, setBuildToDelete] = useState<number | null>(null);
  const [editingBuildId, setEditingBuildId] = useState<number | null>(null);
  const [editingBuildName, setEditingBuildName] = useState<string>("");
  const inputRef = useRef<HTMLInputElement | null>(null); // Create a ref for the input

  useEffect(() => {
    const fetchBuilds = async () => {
      const data = await getBuilds();
      setBuilds(data);
    };
    fetchBuilds();
  }, []);

  // useEffect(() => {
  //   console.log(inputRef.current); // Log the ref value
  // }, [editingBuildId]); // Log whenever editingBuildId changes

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
      if (dialogOpen) {
        handleDialogClose();
      }
    }
  };

  const handleDelete = async (id: number, event: React.MouseEvent) => {
    if (event.shiftKey) {
      await deleteBuild(id);
      const updatedBuilds = await getBuilds();
      setBuilds(updatedBuilds);
    } else {
      handleDialogOpen(id);
    }
  };

  const confirmEdit = async (id: number) => {
    if (id !== null) {
      await db.builds.update(id, { name: editingBuildName });
      const updatedBuilds = await getBuilds();
      setBuilds(updatedBuilds);
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
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: (theme) => theme.palette.background.paper,
              border: (theme) =>
                `1.5px dashed ${alpha(theme.palette.text.primary, 0.3)}`,
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
                border: (theme) =>
                  `1.5px solid ${alpha(theme.palette.text.primary, 0.3)}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease-in-out",
                color: (theme) => alpha(theme.palette.text.primary, 0.3),
              }}
            >
              <AddIcon sx={{ fontSize: 32 }} />
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
                {/* <IconButton
                  size="small"
                  onClick={() => {
                    setEditingBuildId(build.id!);
                    setEditingBuildName(build.name);
                  }}
                  sx={{
                    color: "text.secondary",
                    bgcolor: "action.hover",
                    backdropFilter: "blur(8px)",
                    "&:hover": {
                      color: "secondary.main",
                      bgcolor: "action.selected",
                    },
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton> */}
                <IconButton
                  size="small"
                  onClick={(event) => handleDelete(build.id!, event)}
                  sx={{
                    color: "text.secondary",
                    bgcolor: "action.hover",
                    backdropFilter: "blur(8px)",
                    "&:hover": {
                      color: "error.main",
                      bgcolor: "action.selected",
                    },
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>

              <CardContent sx={{ p: 2.5 }}>
                <Typography variant="h6" gutterBottom>
                  {editingBuildId === build.id ? (
                    <TextField
                      size="small" // Make the TextField smaller
                      inputRef={inputRef}
                      sx={{
                        "& .MuiInputBase-root": {
                          height: "30px", // Set a specific height
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderRadius: "4px", // Optional: adjust border radius
                        },
                      }}
                      value={editingBuildName}
                      onChange={(e) => setEditingBuildName(e.target.value)}
                      onFocus={() => {
                        setTimeout(() => {
                          console.log("inputRef.current", inputRef.current);
                          if (inputRef.current) {
                            inputRef.current.select(); // Select the text when focused
                          }
                        }, 0); // Delay selection to the next event loop
                      }} // Select the text when the input is focused
                      onBlur={() => {
                        confirmEdit(build.id!); // Call confirmEdit on blur
                        setEditingBuildId(null); // Exit editing mode
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          confirmEdit(build.id!); // Call confirmEdit on Enter
                          setEditingBuildId(null); // Exit editing mode
                        } else if (e.key === "Escape") {
                          setEditingBuildId(null); // Exit editing mode
                        }
                      }}
                      autoFocus
                    />
                  ) : (
                    <span
                      onClick={() => {
                        setEditingBuildId(build.id!);
                        setEditingBuildName(build.name);
                      }}
                    >
                      {build.name}
                    </span>
                  )}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Production Chain
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <SettingsIcon sx={{ color: "primary.main" }} />
                    <ArrowRightAltIcon sx={{ color: "text.secondary" }} />
                    <PrecisionManufacturingIcon
                      sx={{ color: "primary.main" }}
                    />
                    <ArrowRightAltIcon sx={{ color: "text.secondary" }} />
                    <ElectricBoltIcon sx={{ color: "primary.main" }} />
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Efficiency
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={98}
                    sx={{
                      height: 8,
                      bgcolor: (theme) =>
                        alpha(theme.palette.text.primary, 0.05),
                      borderRadius: 1,
                      "& .MuiLinearProgress-bar": {
                        bgcolor: "primary.main",
                        borderRadius: 1,
                      },
                    }}
                  />
                  <Typography
                    variant="body2"
                    color="primary"
                    sx={{ mt: 0.5, textAlign: "right" }}
                  >
                    98%
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Production Rate
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={75}
                    sx={{
                      height: 8,
                      bgcolor: (theme) =>
                        alpha(theme.palette.text.primary, 0.05),
                      borderRadius: 1,
                      "& .MuiLinearProgress-bar": {
                        bgcolor: "secondary.main",
                        borderRadius: 1,
                      },
                    }}
                  />
                  <Typography
                    variant="body2"
                    color="secondary"
                    sx={{ mt: 0.5, textAlign: "right" }}
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
            bgcolor: "background.paper",
            border: (theme) =>
              `1px solid ${alpha(theme.palette.text.primary, 0.06)}`,
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
    </Box>
  );
};

export default Dashboard;
