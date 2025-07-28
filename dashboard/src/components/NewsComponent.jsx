import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
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
  Snackbar,
  Stack,
  Fab,
  Pagination,
  Button,
  TextField,
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
  coverImage: Yup.mixed(),
});

const NewsComponent = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [news, setNews] = useState([]);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
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
      coverImage: null,
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("description", values.description);
        if (values.coverImage) {
          formData.append("coverImage", values.coverImage);
        }

        let response;
        if (isUpdateMode) {
          response = await ApiRequest.patch(
            `/news/${selectedNews._id}`,
            formData
          );
          handleSnackbarOpen("News updated successfully", "success");
        } else {
          response = await ApiRequest.post("/news", formData);
          handleSnackbarOpen("News created successfully", "success");
        }
        resetForm();
        fetchNews();
        setIsUpdateMode(false);
        setOpenCreateDialog(false);
      } catch (error) {
        console.error(
          isUpdateMode ? "Error updating news:" : "Error creating news:",
          error
        );
        handleSnackbarOpen(
          `Failed to ${isUpdateMode ? "update" : "create"} news`,
          "error"
        );
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await ApiRequest.get("/news");
      setNews(response?.data?.data?.news || []);
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };

  const handleDelete = async () => {
    if (!selectedNews) return;

    try {
      await ApiRequest.delete(`/news/${selectedNews._id}`);
      setNews(news.filter((item) => item._id !== selectedNews._id));
      fetchNews();
      setOpenDeleteDialog(false);
      handleSnackbarOpen("News deleted successfully", "success");
    } catch (error) {
      console.error("Error deleting news:", error);
      handleSnackbarOpen("Failed to delete news", "error");
    }
  };

  const handleOpenCreateDialog = () => {
    formik.resetForm();
    setIsUpdateMode(false);
    setOpenCreateDialog(true);
  };

  const handleOpenDeleteDialog = (item) => {
    setSelectedNews(item);
    setOpenDeleteDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedNews(null);
    setOpenCreateDialog(false);
    setOpenDeleteDialog(false);
  };

  const handleEditNews = (newsItem) => {
    setSelectedNews(newsItem);
    formik.setValues({
      title: newsItem.title,
      description: newsItem.description,
      coverImage: null,
    });
    setIsUpdateMode(true);
    setOpenCreateDialog(true);
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
  const currentNews = news.slice(indexOfFirstItem, indexOfLastItem);

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
        News
      </Typography>
      <Stack direction="column" spacing={3}>
        {/* Floating Action Button for Creating News */}
        <Fab
          color="primary"
          aria-label="add"
          sx={{ position: "fixed", bottom: 16, right: 16 }}
          onClick={handleOpenCreateDialog}
        >
          <AddIcon />
        </Fab>

        {/* News Grid */}
        <Grid container spacing={2}>
          {currentNews.map((item) => (
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
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      {item.description.trim().substring(0, 100) + "..."}
                    </Typography>
                  </CardContent>
                  <CardContent sx={{ flex: "1 0 auto", overflow: "hidden" }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: 2,
                      }}
                    >
                      <Image
                        src={item.coverImage}
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
                      onClick={() => handleEditNews(item)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      aria-label="delete"
                      onClick={() => handleOpenDeleteDialog(item)}
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
            count={Math.ceil(news.length / itemsPerPage)}
            page={currentPage}
            onChange={(event, page) => paginate(page)}
            color="primary"
          />
        </Box>
      </Stack>

      {/* Create/Update News Dialog */}
      <Dialog
        open={openCreateDialog}
        onClose={handleCloseDialog}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          {isUpdateMode ? "Update News" : "Create News"}
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
            <input
              accept="image/*"
              id="coverImage"
              name="coverImage"
              type="file"
              onChange={(event) =>
                formik.setFieldValue("coverImage", event.currentTarget.files[0])
              }
              style={{ display: "none" }}
            />
            <label htmlFor="coverImage">
              <Button variant="contained" component="span">
                Upload Image
              </Button>
            </label>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={formik.handleSubmit}
            disabled={loading}
            color="primary"
            variant="contained"
          >
            {isUpdateMode ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete News?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this news item?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleDelete} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NewsComponent;
