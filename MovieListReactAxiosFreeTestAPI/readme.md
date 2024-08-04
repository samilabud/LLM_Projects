# Movie List App

This is a simple React application that fetches and displays a list of movies using the `axios` library and Material-UI components.

## Features

- Fetches movie data from an API.
- Displays movie data in a grid layout.
- Allows the user to select the number of movies displayed per page.

## Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm start
   ```

## Usage

- The app fetches movie data from `https://freetestapi.com/api/v1/movies`.
- You can select the number of movies displayed per page using the dropdown menu.

## Components

- **App**: The main component that handles state and API calls.
- **Material-UI Components**: 
  - `Box`, `Typography`, `Grid`, `Card`, `CardMedia`, `CardContent`, `FormControl`, `InputLabel`, `Select`, `MenuItem` are used for layout and styling.

## Code Overview

The main logic of the app is contained within the `App` component:

- **State Management**:
  - `movies`: An array to hold the fetched movie data.
  - `limit`: A number to determine the number of movies to fetch.

- **useEffect Hook**:
  - Fetches movie data from the API whenever the `limit` state changes.

- **handleLimitChange Function**:
  - Updates the `limit` state based on user input.

- **Rendering**:
  - A dropdown menu to select the number of movies per page.
  - A grid layout to display movie cards.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Material-UI](https://mui.com/) for providing the UI components.
- [axios](https://axios-http.com/) for making HTTP requests.
- [FreeTestAPI](https://freetestapi.com/) for providing the movie data.

## Contact

If you have any questions or feedback, feel free to reach out.
