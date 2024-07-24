import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import {
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
} from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarFilterButton />
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

function Dashboard() {
  const [currentId, setCurrentId] = useState(1);
  const [users, setUsers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState("add"); // 'add' or 'edit'
  const [editedUser, setEditedUser] = useState({
    id: null,
    name: "",
    email: "",
    age: "",
    country: "",
    isActive: false,
    registrationDate: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("/data.json"); // Replace with your API endpoint
      const dataWithDateObjects = response.data.map((item) => ({
        ...item,
        registrationDate: new Date(item.registrationDate),
      }));
      setUsers(dataWithDateObjects);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleEditClick = (params) => {
    setDialogMode("edit");
    setEditedUser(params.row);
    setOpenDialog(true);
  };

  const handleDeleteClick = (id) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setEditedUser({
      id: null,
      name: "",
      email: "",
      age: "",
      country: "",
      isActive: false,
      registrationDate: "",
    });
  };

  const handleInputChange = (event) => {
    setEditedUser({
      ...editedUser,
      [event.target.name]: event.target.value,
    });
  };

  const handleCheckboxChange = (event) => {
    setEditedUser({
      ...editedUser,
      isActive: event.target.checked,
    });
  };

  const handleSubmit = async () => {
    try {
      if (dialogMode === "add") {
        const newId = currentId + 1;
        const newUser = {
          ...editedUser,
          id: newId,
          registrationDate: new Date(editedUser.registrationDate),
        };
        setUsers([...users, newUser]);
        setCurrentId(newId);
      } else {
        setUsers(
          users.map((user) => (user.id === editedUser.id ? editedUser : user))
        );
      }
      handleDialogClose();
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70, hideable: false },
    { field: "name", headerName: "Name", width: 200, editable: true },
    { field: "email", headerName: "Email", width: 250, editable: true },
    {
      field: "age",
      headerName: "Age",
      type: "number",
      width: 100,
      editable: true,
    },
    {
      field: "country",
      headerName: "Country",
      width: 150,
      editable: true,
      type: "singleSelect",
      valueOptions: ["USA", "Canada", "UK", "Germany", "France"],
    },
    {
      field: "isActive",
      headerName: "Active",
      width: 100,
      editable: true,
      type: "boolean",
    },
    {
      field: "registrationDate",
      headerName: "Registration Date",
      width: 200,
      editable: true,
      type: "date",
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <button
          onClick={() => handleDeleteClick(params.row.id)}
          style={{ color: "red" }}
        >
          Delete
        </button>
      ),
    },
  ];

  return (
    <div style={{ height: 400, width: "100%" }}>
      <Button
        onClick={() => {
          setDialogMode("add");
          setOpenDialog(true);
        }}
      >
        Add User
      </Button>

      <DataGrid
        rows={users}
        columns={columns}
        components={{
          Toolbar: CustomToolbar,
        }}
        onRowEditCommit={(params) => handleEditClick(params)}
        onRowClick={(params) => {
          if (params.field === "__check__" && params.row.id) {
            handleDeleteClick(params.row.id);
          }
        }}
      />

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>
          {dialogMode === "add" ? "Add User" : "Edit User"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            name="name"
            value={editedUser.name}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            name="email"
            value={editedUser.email}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Age"
            type="number"
            fullWidth
            name="age"
            value={editedUser.age}
            onChange={handleInputChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="country-select-label">Country</InputLabel>
            <Select
              labelId="country-select-label"
              id="country-select"
              name="country"
              value={editedUser.country}
              onChange={handleInputChange}
            >
              <MenuItem value="USA">USA</MenuItem>
              <MenuItem value="Canada">Canada</MenuItem>
              <MenuItem value="UK">UK</MenuItem>
              <MenuItem value="Germany">Germany</MenuItem>
              <MenuItem value="France">France</MenuItem>
            </Select>
          </FormControl>
          <FormControlLabel
            control={
              <Checkbox
                checked={editedUser.isActive}
                onChange={handleCheckboxChange}
                name="isActive"
              />
            }
            label="Active"
          />
          <TextField
            margin="dense"
            label="Registration Date"
            type="date"
            fullWidth
            name="registrationDate"
            value={editedUser.registrationDate}
            onChange={handleInputChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleSubmit}>
            {dialogMode === "add" ? "Add" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Dashboard;
