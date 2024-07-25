import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

function App() {
  const [movies, setMovies] = useState([]);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(
          `https://freetestapi.com/api/v1/movies?limit=${limit}`
        );
        setMovies(response.data);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchMovies();
  }, [limit]);

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Movie List
      </Typography>

      <FormControl sx={{ mb: 2 }}>
        <InputLabel id="limit-label">Movies per Page</InputLabel>
        <Select
          labelId="limit-label"
          id="limit-select"
          value={limit}
          label="Movies per Page"
          onChange={handleLimitChange}
        >
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={20}>20</MenuItem>
          <MenuItem value={50}>50</MenuItem>
          <MenuItem value={100}>100</MenuItem>
        </Select>
      </FormControl>

      <Grid container spacing={3}>
        {movies.map((movie) => (
          <Grid item key={movie.id} xs={12} sm={6} md={4}>
            <Card>
              <CardMedia
                component="img"
                height="250"
                image={movie.poster}
                alt={movie.title}
              />
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  {movie.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Year: {movie.year}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Genres: {movie.genre.join(", ")}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default App;
