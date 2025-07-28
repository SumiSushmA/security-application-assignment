import React, { useState, useEffect } from "react";
import { Box, Typography, Stack } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { useSnackbar } from "notistack";

import ApiRequest from "@/utils/apiRequest";

const QuestionsComponent = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [questions, setQuestions] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const fetchQuestions = async () => {
    try {
      const response = await ApiRequest.get("/question");
      const sortedQuestions = response?.data?.data?.questions.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      setQuestions(sortedQuestions || []);
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpenDialog = (question) => {
    setSelectedQuestion(question);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedQuestion(null);
    setOpenDialog(false);
  };

  const handleDelete = async () => {
    try {
      await ApiRequest.delete(`/question/${selectedQuestion._id}`);
      setQuestions(questions.filter((q) => q._id !== selectedQuestion._id));
      enqueueSnackbar("Question deleted successfully", { variant: "success" });
      handleCloseDialog();
      fetchQuestions();
    } catch (error) {
      console.log(error);
      enqueueSnackbar("Failed to delete question", { variant: "error" });
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  return (
    <Box sx={{ padding: 2 }}>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h5" color="#008268" pb={2} gutterBottom>
          Questions
        </Typography>
        <Typography color="primary">
          Total Questions: {questions.length}
        </Typography>
      </Stack>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="question table">
          <TableHead>
            <TableRow>
              <TableCell>Question Title</TableCell>
              <TableCell>Options</TableCell>
              <TableCell>Correct Option</TableCell>
              <TableCell>Cover Image</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Quiz</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {questions.map((question) => (
              <TableRow key={question._id}>
                <TableCell>{question.questionTitle}</TableCell>
                <TableCell>{question.options.join(", ")}</TableCell>
                <TableCell>{question.correct_option}</TableCell>
                <TableCell>
                  {question.coverImage && (
                    <img
                      src={question.coverImage}
                      alt="Cover Image"
                      style={{ maxWidth: 100, maxHeight: 100 }}
                    />
                  )}
                </TableCell>
                <TableCell>{question?.quiz?.category?.name}</TableCell>{" "}
                <TableCell>{question?.quiz?.title}</TableCell>{" "}
                <TableCell>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleOpenDialog(question)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {selectedQuestion && (
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth
          PaperProps={{ sx: { p: "8px" } }}
        >
          <DialogTitle id="alert-dialog-title">{"Delete Question"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete the question:{" "}
              <span style={{ fontWeight: "bold" }}>
                {selectedQuestion.questionTitle}
              </span>
              ?
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

export default QuestionsComponent;
