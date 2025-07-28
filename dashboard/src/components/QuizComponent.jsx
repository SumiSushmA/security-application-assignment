import React, { useState, useEffect } from "react";
import { Box, Stack, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
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
import TextField from "@mui/material/TextField";
import { useSnackbar } from "notistack";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

import ApiRequest from "@/utils/apiRequest";

const QuizComponent = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [quizzes, setQuizzes] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [editQuizTitle, setEditQuizTitle] = useState("");
  const [editQuizDescription, setEditQuizDescription] = useState("");
  const [editQuizCategory, setEditQuizCategory] = useState("");
  const [editQuizDuration, setEditQuizDuration] = useState(0);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchQuizzes();
    fetchCategories();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await ApiRequest.get("/quiz");

      console.log(response);
      setQuizzes(response?.data?.data?.quizs || []);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await ApiRequest.get("/category");
      setCategories(response?.data?.data?.categories || []);
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpenDialog = (quiz) => {
    setSelectedQuiz(quiz);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedQuiz(null);
    setOpenDialog(false);
  };

  const handleDelete = async () => {
    try {
      await ApiRequest.delete(`/quiz/${selectedQuiz._id}`);
      setQuizzes(quizzes.filter((quiz) => quiz._id !== selectedQuiz._id));
      enqueueSnackbar("Quiz deleted successfully", { variant: "success" });
      handleCloseDialog();
    } catch (error) {
      console.log(error);
      enqueueSnackbar("Failed to delete quiz", { variant: "error" });
    }
  };

  const handleOpenEditDialog = (quiz) => {
    setSelectedQuiz(quiz);
    setEditQuizTitle(quiz.title);
    setEditQuizDescription(quiz.description);
    setEditQuizCategory(quiz?.category?._id);
    setEditQuizDuration(quiz.duration);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setSelectedQuiz(null);
    setEditQuizTitle("");
    setEditQuizDescription("");
    setEditQuizCategory("");
    setEditQuizDuration(0);
    setOpenEditDialog(false);
  };

  const handleEditQuiz = async (values) => {
    try {
      const updatedQuiz = {
        title: values.editQuizTitle,
        description: values.editQuizDescription,
        category: values.editQuizCategory,
        duration: values.editQuizDuration,
      };
      await ApiRequest.patch(`/quiz/${selectedQuiz._id}`, updatedQuiz);
      enqueueSnackbar("Quiz updated successfully", { variant: "success" });
      fetchQuizzes();
      handleCloseEditDialog();
    } catch (error) {
      console.log(error);
      enqueueSnackbar("Failed to update quiz", { variant: "error" });
    }
  };

  const validationSchema = Yup.object().shape({
    editQuizTitle: Yup.string().required("Title is required"),
    editQuizDescription: Yup.string().required("Description is required"),
    editQuizCategory: Yup.string().required("Category is required"),
    editQuizDuration: Yup.number()
      .required("Duration is required")
      .min(1, "Duration must be greater than 0"),
  });

  return (
    <Box sx={{ padding: 2 }}>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h5" color="#008268" pb={2} gutterBottom>
          Quizzes
        </Typography>
        <Typography color="primary">Total Quizzes: {quizzes.length}</Typography>
      </Stack>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="quiz table">
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {quizzes.map((quiz) => (
              <TableRow key={quiz._id}>
                <TableCell>{quiz.title}</TableCell>
                <TableCell>{quiz.description}</TableCell>
                <TableCell>{quiz?.category?.name}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={2}>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleOpenDialog(quiz)}
                    >
                      <DeleteIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      onClick={() => handleOpenEditDialog(quiz)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {selectedQuiz && (
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth
          PaperProps={{ sx: { p: "8px" } }}
        >
          <DialogTitle id="alert-dialog-title">{"Delete Quiz"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete{" "}
              <span style={{ fontWeight: "bold" }}>{selectedQuiz.title}</span>?
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
      {selectedQuiz && (
        <Dialog
          open={openEditDialog}
          onClose={handleCloseEditDialog}
          aria-labelledby="form-dialog-title"
        >
          <Formik
            initialValues={{
              editQuizTitle: editQuizTitle,
              editQuizDescription: editQuizDescription,
              editQuizCategory: editQuizCategory,
              editQuizDuration: editQuizDuration,
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => handleEditQuiz(values)}
          >
            {({ errors, touched, setFieldValue, initialValues }) => (
              <Form>
                <DialogTitle id="form-dialog-title">Edit Quiz</DialogTitle>
                <DialogContent>
                  <Field
                    as={TextField}
                    autoFocus
                    margin="dense"
                    id="editQuizTitle"
                    name="editQuizTitle"
                    label="Title"
                    type="text"
                    fullWidth
                    error={
                      touched.editQuizTitle && Boolean(errors.editQuizTitle)
                    }
                    helperText={touched.editQuizTitle && errors.editQuizTitle}
                  />
                  <Field
                    as={TextField}
                    margin="dense"
                    id="editQuizDescription"
                    name="editQuizDescription"
                    label="Description"
                    type="text"
                    fullWidth
                    error={
                      touched.editQuizDescription &&
                      Boolean(errors.editQuizDescription)
                    }
                    helperText={
                      touched.editQuizDescription && errors.editQuizDescription
                    }
                  />
                  <Field
                    as={TextField}
                    select
                    margin="dense"
                    id="editQuizCategory"
                    name="editQuizCategory"
                    label="Category"
                    fullWidth
                    SelectProps={{
                      native: true,
                    }}
                    error={
                      touched.editQuizCategory &&
                      Boolean(errors.editQuizCategory)
                    }
                    helperText={
                      touched.editQuizCategory && errors.editQuizCategory
                    }
                    onChange={(e) => {
                      setFieldValue("editQuizCategory", e.target.value);
                    }}
                  >
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </Field>
                  <Field
                    as={TextField}
                    margin="dense"
                    id="editQuizDuration"
                    name="editQuizDuration"
                    label="Duration (in minutes)"
                    type="number"
                    fullWidth
                    error={
                      touched.editQuizDuration &&
                      Boolean(errors.editQuizDuration)
                    }
                    helperText={
                      touched.editQuizDuration && errors.editQuizDuration
                    }
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseEditDialog} color="primary">
                    Cancel
                  </Button>
                  <Button type="submit" color="primary">
                    Save
                  </Button>
                </DialogActions>
              </Form>
            )}
          </Formik>
        </Dialog>
      )}
    </Box>
  );
};

export default QuizComponent;
