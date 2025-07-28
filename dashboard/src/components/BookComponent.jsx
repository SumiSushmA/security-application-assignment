import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  Paper,
  Snackbar,
  Stack,
  Fab,
  Pagination,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { useFormik } from "formik";
import * as Yup from "yup";
import ApiRequest from "@/utils/apiRequest";
import { useSnackbar } from "notistack";
import Image from "next/image";
import CircularProgress from "@mui/material/CircularProgress";

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  author: Yup.string().required("Author is required"),
  publication: Yup.string().required("Publication is required"),
  edition: Yup.string().required("Edition is required"),
  coverImage: Yup.mixed().required("Image is required"),
});

const BookComponent = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [books, setBooks] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarVariant, setSnackbarVariant] = useState("success");
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6); // Number of items per page

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      author: "",
      publication: "",
      edition: "",
      coverImage: null,
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("description", values.description);
        formData.append("author", values.author);
        formData.append("publication", values.publication);
        formData.append("edition", values.edition);
        formData.append("coverImage", values.coverImage);

        let response;
        if (isUpdateMode) {
          response = await ApiRequest.patch(
            `/book/${selectedBook._id}`,
            formData
          );
          handleSnackbarOpen("Book updated successfully", "success");
        } else {
          response = await ApiRequest.post("/book", formData);
          handleSnackbarOpen("Book created successfully", "success");
        }

        const updatedBook = response.data.data.book; // Assuming the response structure returns the updated or newly created book object

        // Update books state based on whether it's an update or create operation
        if (isUpdateMode) {
          setBooks(
            books.map((book) =>
              book._id === updatedBook._id ? updatedBook : book
            )
          );
        } else {
          setBooks([...books, updatedBook]);
        }

        resetForm();
        setIsUpdateMode(false);
        setOpenDialog(false);
      } catch (error) {
        console.error(
          isUpdateMode ? "Error updating book:" : "Error creating book:",
          error
        );
        handleSnackbarOpen(
          `Failed to ${isUpdateMode ? "update" : "create"} book`,
          "error"
        );
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await ApiRequest.get("/book");
      setBooks(response?.data?.data?.books || []);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await ApiRequest.delete(`/book/${id}`);
      setBooks(books.filter((item) => item._id !== id));
      setDeleteDialogOpen(false);
      handleSnackbarOpen("Book deleted successfully", "success");
    } catch (error) {
      console.error("Error deleting book:", error);
      handleSnackbarOpen("Failed to delete book", "error");
    }
  };

  const handleOpenDialog = () => {
    setSelectedBook(null);
    setOpenDialog(true);
    formik.resetForm();
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleEditBook = (book) => {
    setSelectedBook(book);
    formik.setValues({
      title: book.title,
      description: book.description,
      author: book.author,
      publication: book.publication,
      edition: book.edition,
      coverImage: null, // Reset cover image when updating
    });
    setIsUpdateMode(true);
    setOpenDialog(true);
  };

  const handleSnackbarOpen = (message, variant) => {
    setSnackbarMessage(message);
    setSnackbarVariant(variant);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBooks = books.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Box sx={{ p: 3 }}>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        key={snackbarMessage}
        severity={snackbarVariant}
      />
      <Typography variant="h4" pl={2}>
        Book
      </Typography>
      <Stack direction="column" spacing={3}>
        {/* Floating Action Button for Creating Book */}
        <Fab
          color="primary"
          aria-label="add"
          sx={{ position: "fixed", bottom: 16, right: 16 }}
          onClick={handleOpenDialog}
        >
          <AddIcon />
        </Fab>

        {/* Books Grid */}
        <Grid container spacing={2}>
          {currentBooks.map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={4} key={item._id}>
              <Paper
                elevation={3}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Card
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                  }}
                >
                  <CardHeader title={item.title} />
                  <CardContent sx={{ flex: "1 0 auto", overflow: "hidden" }}>
                    <Typography variant="body2" color="text.secondary">
                      Author: {item.author}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Publication: {item.publication}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Edition: {item.edition}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: 2,
                      }}
                    >
                      <Image
                        src={item.coverImage || "/public/book.png"}
                        alt={item.title}
                        width={400}
                        height={250}
                        style={{ objectFit: "cover" }}
                      />
                    </Box>
                  </CardContent>
                  <CardActions sx={{ justifyContent: "flex-end" }}>
                    <IconButton
                      aria-label="edit"
                      onClick={() => handleEditBook(item)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      aria-label="delete"
                      onClick={() => {
                        setSelectedBook(item);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Pagination */}
        <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
          <Pagination
            count={Math.ceil(books.length / itemsPerPage)}
            page={currentPage}
            onChange={(event, page) => paginate(page)}
            color="primary"
          />
        </Box>
      </Stack>

      {/* Create/Update Book Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          {isUpdateMode ? "Update Book" : "Create Book"}
        </DialogTitle>
        <DialogContent>
          <form onSubmit={formik.handleSubmit}>
            <TextField
              fullWidth
              name="title"
              label="Title"
              value={formik.values.title}
              onChange={formik.handleChange}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              multiline
              rows={4}
              name="description"
              label="Description"
              value={formik.values.description}
              onChange={formik.handleChange}
              error={
                formik.touched.description && Boolean(formik.errors.description)
              }
              helperText={
                formik.touched.description && formik.errors.description
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              name="author"
              label="Author"
              value={formik.values.author}
              onChange={formik.handleChange}
              error={formik.touched.author && Boolean(formik.errors.author)}
              helperText={formik.touched.author && formik.errors.author}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              name="publication"
              label="Publication"
              value={formik.values.publication}
              onChange={formik.handleChange}
              error={
                formik.touched.publication && Boolean(formik.errors.publication)
              }
              helperText={
                formik.touched.publication && formik.errors.publication
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              name="edition"
              label="Edition"
              value={formik.values.edition}
              onChange={formik.handleChange}
              error={formik.touched.edition && Boolean(formik.errors.edition)}
              helperText={formik.touched.edition && formik.errors.edition}
              sx={{ mb: 2 }}
            />
            <input
              accept="image/*"
              id="contained-button-file"
              multiple
              type="file"
              hidden
              onChange={(event) => {
                formik.setFieldValue(
                  "coverImage",
                  event.currentTarget.files[0]
                );
              }}
            />
            <label htmlFor="contained-button-file">
              <Button variant="contained" component="span">
                Upload Book Image
              </Button>
            </label>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={formik.handleSubmit}
            disabled={loading}
            variant="contained"
            color="primary"
          >
            {loading ? <CircularProgress size={24} /> : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this book?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleDelete(selectedBook._id);
            }}
            color="primary"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BookComponent;
