import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const phoneRegex =
  /^(?:\(?305\)?|\(?786\)?)?[-. ]?[2-9][0-9]{2}[-. ]?[0-9]{4}$/; // Regular expression for Miami phone numbers

function App() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    date: null,
    phone: "",
  });

  const [errors, setErrors] = useState({});
  const [openModal, setOpenModal] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    // Update form data and validate in a single state update
    setFormData((prevData) => {
      const newData = { ...prevData, [name]: value };
      return newData;
    });
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: validateField(name, value),
    }));
  };

  const handleDateChange = (newValue) => {
    // Update form data and validate in a single state update
    setFormData((prevData) => ({ ...prevData, date: newValue }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      date: validateField("date", newValue),
    }));
  };

  const validateField = (field, value) => {
    switch (field) {
      case "email":
        return emailRegex.test(value) ? "" : "Invalid email format";
      case "date":
        return value ? "" : "Date is required";
      case "name":
        return value ? "" : "This field is required";
      case "phone":
        return phoneRegex.test(value) ? "" : "Invalid Miami phone number"; // Validate phone using the regex
      default:
        return "";
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Validate all fields before submission
    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    setErrors(newErrors);

    if (Object.values(newErrors).every((error) => error === "")) {
      setOpenModal(true);
    } else {
      console.log("Form has errors:", newErrors);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={!!errors.name}
          helperText={errors.name}
          required
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
          required
          fullWidth
          margin="normal"
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Date"
            value={formData.date}
            onChange={handleDateChange}
            renderInput={(params) => (
              <TextField
                {...params}
                name="date"
                error={!!errors.date}
                helperText={errors.date}
                required
                fullWidth
                margin="normal"
              />
            )}
          />
        </LocalizationProvider>
        <TextField
          label="Phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          error={!!errors.phone}
          helperText={errors.phone}
          required
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </form>

      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Submitted Data</DialogTitle>
        <DialogContent>
          <pre>{JSON.stringify(formData, null, 2)}</pre>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default App;
