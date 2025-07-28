import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Avatar,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ApiRequest from "@/utils/apiRequest";
import { useSnackbar } from "notistack";

const ScoreComponent = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [scores, setScores] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedScore, setSelectedScore] = useState(null);
  console.log(scores);

  const fetchScores = async () => {
    try {
      const response = await ApiRequest.get("/score");
      setScores(response?.data?.data?.scores || []);
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpenDialog = (score) => {
    setSelectedScore(score);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedScore(null);
    setOpenDialog(false);
  };

  const handleDelete = async () => {
    try {
      await ApiRequest.delete(`/score/${selectedScore._id}`);
      setScores(scores.filter((score) => score._id !== selectedScore._id));
      enqueueSnackbar("Score deleted successfully", { variant: "success" });
      handleCloseDialog();
    } catch (error) {
      console.log(error);
      enqueueSnackbar("Failed to delete score", { variant: "error" });
    }
  };

  useEffect(() => {
    fetchScores();
  }, []);

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" color="#008268" pb={2} gutterBottom>
        Scores
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="score table">
          <TableHead>
            <TableRow>
              <TableCell>Avatar</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Quiz</TableCell>
              <TableCell>Score</TableCell>
              <TableCell>Correct Answers</TableCell>
              <TableCell>Wrong Answers</TableCell>
              <TableCell>Unattempted</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {scores.map((score) => (
              <TableRow key={score._id}>
                <TableCell>
                  <Avatar
                    alt={score?.user?.fullname}
                    src={score?.user?.avatar}
                  />
                </TableCell>
                <TableCell>{score?.user?.fullname}</TableCell>
                <TableCell>
                  {score?.quiz?.category?.name || "Undefined"}
                </TableCell>{" "}
                <TableCell>{score?.quiz?.title || "undefined"}</TableCell>{" "}
                {/* Update here */}
                <TableCell>{score.score}</TableCell>
                <TableCell>{score.correctAnswers}</TableCell>
                <TableCell>{score.wrongAnswers}</TableCell>
                <TableCell>{score.notAnswered}</TableCell>
                <TableCell>
                  {new Date(score.createdAt).toLocaleString()}
                </TableCell>
                <TableCell>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleOpenDialog(score)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {selectedScore && (
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth
          PaperProps={{ sx: { p: "8px" } }}
        >
          <DialogTitle id="alert-dialog-title">{"Delete Score"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete the score?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              variant="outlined"
              onClick={handleCloseDialog}
              color="primary"
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleDelete}
              color="error"
              autoFocus
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default ScoreComponent;
