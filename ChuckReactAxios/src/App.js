import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css"; // Import CSS file for styling

function App() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [joke, setJoke] = useState(null);
  const [iconUrl, setIconUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "https://api.chucknorris.io/jokes/categories"
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchJoke = async () => {
    setIsLoading(true);
    try {
      const url = selectedCategory
        ? `https://api.chucknorris.io/jokes/random?category=${selectedCategory}`
        : "https://api.chucknorris.io/jokes/random";

      const response = await axios.get(url);
      setJoke(response.data.value);
      setIconUrl(response.data.icon_url);
    } catch (error) {
      console.error("Error fetching joke:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  return (
    <div className="App">
      <h1>Chuck Norris Jokes</h1>

      <div className="controls">
        <label htmlFor="categorySelect">Category:</label>
        <select
          id="categorySelect"
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <button onClick={fetchJoke} disabled={isLoading}>
          {isLoading ? "Loading..." : "Get a Random Joke"}
        </button>
      </div>

      {joke && (
        <div className="joke-container">
          <img src={iconUrl} alt="Chuck Norris Icon" className="icon" />
          <p>{joke}</p>
        </div>
      )}
    </div>
  );
}

export default App;
