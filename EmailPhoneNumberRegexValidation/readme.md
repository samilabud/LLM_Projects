# React Form with Validation and Modal

This React application provides a form for collecting user information including name, email, date, and phone number. The form validates the inputs and displays error messages for invalid fields. Upon successful submission, the form data is displayed in a modal dialog.

## Features

- **Form Validation**: Includes validation for name, email, date, and phone number fields.
- **Regular Expressions**: Uses regex to validate email format and Miami phone numbers.
- **Date Picker**: Integrates `@mui/x-date-pickers` for date selection.
- **Modal Dialog**: Displays submitted form data in a modal dialog upon successful submission.

## Installation

To run this application, ensure you have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed. Then, follow these steps:

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/react-form-validation-modal.git
    cd react-form-validation-modal
    ```

2. Install the dependencies:
    ```sh
    npm install
    ```

3. Start the development server:
    ```sh
    npm start
    ```

4. Open your browser and navigate to `http://localhost:3000` to see the application in action.

## Dependencies

This project uses the following dependencies:

- `react`
- `@mui/material`
- `@mui/x-date-pickers`
- `dayjs`

## Code Overview

### State Management

The component uses the `useState` hook to manage form data and error states:

```javascript
const [formData, setFormData] = useState({
  name: "",
  email: "",
  date: null,
  phone: "",
});
const [errors, setErrors] = useState({});
const [openModal, setOpenModal] = useState(false);
```

### Form Handling

The `handleChange` and `handleDateChange` functions update the form data and validate fields:

```javascript
const handleChange = (event) => {
  const { name, value } = event.target;
  setFormData((prevData) => ({ ...prevData, [name]: value }));
  setErrors((prevErrors) => ({
    ...prevErrors,
    [name]: validateField(name, value),
  }));
};

const handleDateChange = (newValue) => {
  setFormData((prevData) => ({ ...prevData, date: newValue }));
  setErrors((prevErrors) => ({
    ...prevErrors,
    date: validateField("date", newValue),
  }));
};
```

### Validation

The `validateField` function checks each field against the corresponding validation rule:

```javascript
const validateField = (field, value) => {
  switch (field) {
    case "email":
      return emailRegex.test(value) ? "" : "Invalid email format";
    case "date":
      return value ? "" : "Date is required";
    case "name":
      return value ? "" : "This field is required";
    case "phone":
      return phoneRegex.test(value) ? "" : "Invalid Miami phone number";
    default:
      return "";
  }
};
```

### Submission

The `handleSubmit` function validates all fields before allowing the form to be submitted:

```javascript
const handleSubmit = (event) => {
  event.preventDefault();
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
```

### Modal Dialog

The modal dialog is displayed upon successful form submission and shows the form data:

```javascript
<Dialog open={openModal} onClose={handleCloseModal}>
  <DialogTitle>Submitted Data</DialogTitle>
  <DialogContent>
    <pre>{JSON.stringify(formData, null, 2)}</pre>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCloseModal}>Close</Button>
  </DialogActions>
</Dialog>
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## Author

[Samil Abud](https://github.com/samilabud)
