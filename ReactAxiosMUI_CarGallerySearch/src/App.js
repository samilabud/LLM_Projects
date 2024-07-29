import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Modal,
} from "@mui/material";

const years = Array.from(
  new Array(20),
  (val, index) => new Date().getFullYear() - index
);
const prices = [5000, 10000, 15000, 20000, 25000, 30000];

const API_URL = `https://freetestapi.com/api/v1/cars`;

function App() {
  const [filters, setFilters] = useState({
    query: "",
    year: "",
    price: "",
  });
  const [results, setResults] = useState([]);
  const [error, setError] = useState(false);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const handleFilterChange = useCallback((event) => {
    const { name, value } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  }, []);

  const fetchData = useCallback(async () => {
    setError(false);
    setLoading(true);

    try {
      const apiUrl = `${API_URL}?search=${filters.query}`;
      const response = await axios.get(apiUrl);
      const filteredResults = response.data.filter((car) => {
        const matchesPrice = !filters.price || car.price <= filters.price;
        const matchesYear =
          !filters.year || car.year === parseInt(filters.year);
        return matchesPrice && matchesYear;
      });
      setResults(filteredResults);
    } catch (err) {
      setError(true);
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      setSearched(true);
      fetchData();
    },
    [fetchData]
  );

  const handleShowAll = useCallback(async () => {
    setError(false);

    try {
      const response = await axios.get(API_URL);
      setResults(response.data);
    } catch (err) {
      setError(true);
      console.error("Error fetching data:", err);
    }
  }, []);

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setSelectedImage("");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: 3,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Car Search
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", gap: 2, mb: 3 }}
      >
        <TextField
          label="Search"
          variant="outlined"
          name="query"
          value={filters.query}
          onChange={handleFilterChange}
        />

        <FormControl>
          <InputLabel id="year-label">Year</InputLabel>
          <Select
            labelId="year-label"
            id="year"
            name="year"
            value={filters.year}
            onChange={handleFilterChange}
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="">Any</MenuItem>
            {years.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl>
          <InputLabel id="price-label">Max Price</InputLabel>
          <Select
            labelId="price-label"
            id="price"
            name="price"
            value={filters.price}
            onChange={handleFilterChange}
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="">Any</MenuItem>
            {prices.map((price) => (
              <MenuItem key={price} value={price}>
                {price}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button variant="contained" type="submit">
          Search
        </Button>
      </Box>

      <Button variant="outlined" onClick={handleShowAll}>
        Show All Cars
      </Button>

      {loading && <CircularProgress sx={{ mt: 2 }} />}

      {error && (
        <Typography variant="body1" color="error" sx={{ mb: 2 }}>
          Error: Unable to fetch results. Please try again later.
        </Typography>
      )}

      {results.length > 0 ? (
        <Grid container spacing={3}>
          {results.map((car) => (
            <Grid item xs={12} sm={6} md={4} key={car.id}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image={car.image}
                  alt={`${car.make} ${car.model}`}
                  onClick={() => handleImageClick(car.image)}
                  sx={{ cursor: "pointer" }}
                />
                <CardContent>
                  <Typography variant="h6">
                    {car.year} {car.make} {car.model}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Color: {car.color}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Mileage: {car.mileage} miles
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Price: ${car.price}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Fuel Type: {car.fuelType}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Transmission: {car.transmission}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Engine: {car.engine}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Horsepower: {car.horsepower} hp
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Features: {car.features.join(", ")}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Owners: {car.owners}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        !error &&
        searched && (
          <Typography variant="body1" color="error">
            No cars found matching your criteria.
          </Typography>
        )
      )}

      <Modal open={modalOpen} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <img
            src={selectedImage}
            alt="Car"
            style={{ width: "100%", height: "auto" }}
          />
        </Box>
      </Modal>
    </Box>
  );
}

export default App;
