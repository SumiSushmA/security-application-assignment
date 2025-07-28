"use client";
import ApiRequest from "@/utils/apiRequest";
import React, { useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSnackbar } from "notistack";
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
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

const UserView = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  const fetchUsers = async () => {
    try {
      const response = await ApiRequest.get("/user");
      setUsers(response?.data?.data?.users?.role_user || []);
      setAdmins(response?.data?.data?.admin?.role_admin || []);
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpenDialog = (user) => {
    setSelectedUser(user);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedUser(null);
    setOpenDialog(false);
  };

  const handleDelete = async () => {
    try {
      await ApiRequest.delete(`/user/${selectedUser._id}`);
      if (tabValue === 0) {
        setUsers(users.filter((user) => user._id !== selectedUser._id));
      } else {
        setAdmins(admins.filter((admin) => admin._id !== selectedUser._id));
      }
      enqueueSnackbar("User deleted successfully", { variant: "success" });
      handleCloseDialog();
      fetchUsers();
    } catch (error) {
      console.log(error);
      enqueueSnackbar("Failed to delete user", { variant: "error" });
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const renderTableRows = (data) => {
    return data.map((user) => (
      <TableRow key={user._id}>
        <TableCell>
          <Avatar alt={user.fullname} src={user.avatar} />
        </TableCell>
        <TableCell>{user.fullname || "N/A"}</TableCell>
        <TableCell>{user.email}</TableCell>
        <TableCell>{user.phNumber || "N/A"}</TableCell>
        <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
        <TableCell>
          <IconButton
            edge="end"
            aria-label="delete"
            onClick={() => handleOpenDialog(user)}
          >
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" color="#008268" pb={2} gutterBottom>
        Users and Admins
      </Typography>
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        aria-label="user and admin tabs"
      >
        <Tab label="Users" />
        <Tab label="Admins" />
      </Tabs>
      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table sx={{ minWidth: 650 }} aria-label="user table">
          <TableHead>
            <TableRow>
              <TableCell>Avatar</TableCell>
              <TableCell>Full Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tabValue === 0 ? renderTableRows(users) : renderTableRows(admins)}
          </TableBody>
        </Table>
      </TableContainer>
      {selectedUser && (
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth
          PaperProps={{ sx: { p: "8px" } }}
        >
          <DialogTitle id="alert-dialog-title">{"Delete User"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete
              <span style={{ fontWeight: "bold" }}>
                {" "}
                {selectedUser.fullname || selectedUser.email}
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

export default UserView;
