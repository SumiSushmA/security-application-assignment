import React, { useState, useEffect } from "react";
import {
  Box,
  Stack,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useSnackbar } from "notistack";
import ApiRequest from "@/utils/apiRequest";
import CreateCategory from "@/views/create/CreateCategory";

const CategoryComponent = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [categories, setCategories] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [editCategoryId, setEditCategoryId] = useState("");

  const fetchCategories = async () => {
    try {
      const response = await ApiRequest.get("/category");
      setCategories(response?.data?.data?.categories || []);
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpenDialog = (category) => {
    setSelectedCategory(category);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedCategory(null);
    setOpenDialog(false);
  };

  const handleDelete = async () => {
    try {
      await ApiRequest.delete(`/category/${selectedCategory._id}`);
      setCategories(
        categories.filter((category) => category._id !== selectedCategory._id)
      );
      enqueueSnackbar("Category deleted successfully", { variant: "success" });
      handleCloseDialog();
      fetchCategories();
    } catch (error) {
      console.log(error);
      enqueueSnackbar("Failed to delete category", { variant: "error" });
    }
  };

  const handleOpenEditDialog = (category) => {
    setSelectedCategory(category);
    setEditCategoryName(category.name);
    setEditCategoryId(category._id); // Assuming category._id is available
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setSelectedCategory(null);
    setEditCategoryName("");
    setEditCategoryId("");
    setOpenEditDialog(false);
  };

  const handleEditCategory = async () => {
    try {
      const updatedCategory = { name: editCategoryName };
      await ApiRequest.patch(`/category/${editCategoryId}`, updatedCategory);
      enqueueSnackbar("Category updated successfully", { variant: "success" });
      fetchCategories();
      handleCloseEditDialog();
    } catch (error) {
      console.log(error);
      enqueueSnackbar("Failed to update category", { variant: "error" });
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <Box sx={{ padding: 2 }}>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h5" color="#008268" pb={2} gutterBottom>
          Category
        </Typography>
        <Typography color="primary">
          Total Categories: {categories.length}
        </Typography>
      </Stack>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="category table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Actions</TableCell>
              <TableCell>Edit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category._id}>
                <TableCell>{category.name}</TableCell>
                <TableCell>
                  {new Date(category.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleOpenDialog(category)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
                <TableCell>
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={() => handleOpenEditDialog(category)}
                  >
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {selectedCategory && (
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth
          PaperProps={{ sx: { p: "8px" } }}
        >
          <DialogTitle id="alert-dialog-title">{"Delete Category"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete
              <span style={{ fontWeight: "bold" }}>
                {" "}
                {selectedCategory.name}
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
      {selectedCategory && (
        <Dialog
          open={openEditDialog}
          onClose={handleCloseEditDialog}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Edit Category</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="categoryName"
              label="Category Name"
              type="text"
              fullWidth
              value={editCategoryName}
              onChange={(e) => setEditCategoryName(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEditDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={handleEditCategory} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default CategoryComponent;
