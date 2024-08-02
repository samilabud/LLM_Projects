import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [limit, setLimit] = useState(30); // Default limit
  const [sortField, setSortField] = useState("name"); // Default sort field
  const [sortOrder, setSortOrder] = useState("asc"); // Default sort order

  // Debounce search function
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchMovies();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, limit, sortField, sortOrder]);

  const fetchMovies = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://freetestapi.com/api/v1/movies?search=${searchTerm}&limit=${limit}&sort=${sortField}&order=${sortOrder}`
      );
      const data = await response.json();
      setMovies(data);
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handleSortChange = (field, order) => {
    setSortField(field);
    setSortOrder(order);
  };

  return (
    <div style={{ padding: "20px" }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Autocomplete
            freeSolo
            id="search-movies"
            options={[]}
            getOptionLabel={(option) => option}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search Movies"
                variant="outlined"
                onChange={handleSearchChange}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel id="limit-label">Results Limit</InputLabel>
            <Select
              labelId="limit-label"
              id="limit-select"
              value={limit}
              label="Results Limit"
              onChange={handleLimitChange}
            >
              <MenuItem value={30}>30</MenuItem>
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={100}>100</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <ButtonGroup
            variant="contained"
            aria-label="outlined primary button group"
          >
            <Button
              onClick={() => handleSortChange("name", "asc")}
              color={
                sortField === "name" && sortOrder === "asc"
                  ? "primary"
                  : "secondary"
              }
            >
              Name Asc
            </Button>
            <Button
              onClick={() => handleSortChange("name", "desc")}
              color={
                sortField === "name" && sortOrder === "desc"
                  ? "primary"
                  : "secondary"
              }
            >
              Name Desc
            </Button>
            <Button
              onClick={() => handleSortChange("year", "asc")}
              color={
                sortField === "year" && sortOrder === "asc"
                  ? "primary"
                  : "secondary"
              }
            >
              Year Asc
            </Button>
            <Button
              onClick={() => handleSortChange("year", "desc")}
              color={
                sortField === "year" && sortOrder === "desc"
                  ? "primary"
                  : "secondary"
              }
            >
              Year Desc
            </Button>
          </ButtonGroup>
        </Grid>
        <Grid item xs={12}>
          {isLoading ? (
            <CircularProgress />
          ) : (
            <Grid container spacing={2}>
              {movies.map((movie) => (
                <Grid item xs={12} sm={6} md={4} key={movie.id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" component="div">
                        {movie.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Year: {movie.year}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
