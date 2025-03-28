// API Key and Base URL
const API_KEY = "e07d2f3f"; // Replace with your actual OMDb API key
const BASE_URL = "https://www.omdbapi.com/";

// DOM Elements
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const moviesGrid = document.getElementById("movies-grid");
const loader = document.getElementById("loader");
const resultsHeading = document.getElementById("results-heading");
const resultsCount = document.getElementById("results-count");
const noResults = document.getElementById("no-results");
const movieDetails = document.getElementById("movie-details");
const movieDetailsContent = document.getElementById("movie-details-content");
const backButton = document.getElementById("back-button");
const resultsContainer = document.getElementById("results-container");

// Event Listeners
searchForm.addEventListener("submit", handleSearch);
backButton.addEventListener("click", showSearchResults);
document.addEventListener("DOMContentLoaded", () => {
  searchInput.focus();
});

// Search Handler
async function handleSearch(e) {
  e.preventDefault();
  const searchTerm = searchInput.value.trim();

  if (!searchTerm) return;

  // Show loader
  showLoader();

  try {
    const response = await fetch(
      `${BASE_URL}?apikey=${API_KEY}&s=${searchTerm}&type=movie`
    );
    const data = await response.json();

    // Hide loader
    hideLoader();

    if (data.Response === "True") {
      displayMovies(data.Search, searchTerm);
    } else {
      showNoResults();
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    hideLoader();
    showNoResults();
  }
}

// Display Movies
function displayMovies(movies, searchTerm) {
  // Clear previous results
  moviesGrid.innerHTML = "";

  // Update UI elements
  hideNoResults();
  showResultsHeading();
  resultsCount.textContent = `Found ${movies.length} results for "${searchTerm}"`;

  // Create movie cards
  movies.forEach((movie) => {
    const movieCard = document.createElement("div");
    movieCard.classList.add("movie-card");
    movieCard.dataset.id = movie.imdbID;

    const posterUrl =
      movie.Poster !== "N/A"
        ? movie.Poster
        : "https://via.placeholder.com/300x450?text=No+Poster";

    movieCard.innerHTML = `
            <img class="movie-poster" src="${posterUrl}" alt="${movie.Title} poster">
            <div class="movie-info">
                <h3 class="movie-title">${movie.Title}</h3>
                <p class="movie-year">${movie.Year}</p>
            </div>
        `;

    movieCard.addEventListener("click", () => fetchMovieDetails(movie.imdbID));
    moviesGrid.appendChild(movieCard);
  });
}

// Fetch Movie Details
async function fetchMovieDetails(movieId) {
  showLoader();

  try {
    const response = await fetch(
      `${BASE_URL}?apikey=${API_KEY}&i=${movieId}&plot=full`
    );
    const movie = await response.json();

    hideLoader();

    if (movie.Response === "True") {
      displayMovieDetails(movie);
    } else {
      alert("Error retrieving movie details. Please try again.");
      showSearchResults();
    }
  } catch (error) {
    console.error("Error fetching movie details:", error);
    hideLoader();
    alert("Error retrieving movie details. Please try again.");
    showSearchResults();
  }
}

// Display Movie Details
function displayMovieDetails(movie) {
  // Hide results, show details
  resultsContainer.classList.add("hidden");
  movieDetails.classList.remove("hidden");

  // Get poster URL (or placeholder if no poster)
  const posterUrl =
    movie.Poster !== "N/A"
      ? movie.Poster
      : "https://via.placeholder.com/300x450?text=No+Poster";

  // Generate ratings HTML
  let ratingsHTML = "";
  if (movie.Ratings && movie.Ratings.length > 0) {
    ratingsHTML = '<div class="movie-details-section"><h3>Ratings</h3><ul>';
    movie.Ratings.forEach((rating) => {
      ratingsHTML += `<li>${rating.Source}: ${rating.Value}</li>`;
    });
    ratingsHTML += "</ul></div>";
  }

  // Build details HTML
  movieDetailsContent.innerHTML = `
        <div class="movie-details-container">
            <div class="movie-poster-wrapper">
                <img class="movie-poster-large" src="${posterUrl}" alt="${
    movie.Title
  } poster">
            </div>
            <div class="movie-details-info">
                <h2 class="movie-details-title">${movie.Title}</h2>
                
                <div class="movie-details-meta">
                    <span>${movie.Year}</span>
                    <span>${
                      movie.Rated !== "N/A" ? movie.Rated : "Not Rated"
                    }</span>
                    <span>${movie.Runtime}</span>
                </div>
                
                <div class="movie-details-section">
                    <h3>Genre</h3>
                    <p>${movie.Genre}</p>
                </div>
                
                <div class="movie-details-section">
                    <h3>Plot</h3>
                    <p class="movie-details-plot">${
                      movie.Plot !== "N/A" ? movie.Plot : "Plot not available."
                    }</p>
                </div>
                
                <div class="movie-details-section">
                    <h3>Cast</h3>
                    <p>${
                      movie.Actors !== "N/A"
                        ? movie.Actors
                        : "Cast information not available."
                    }</p>
                </div>
                
                <div class="movie-details-section">
                    <h3>Director</h3>
                    <p>${
                      movie.Director !== "N/A"
                        ? movie.Director
                        : "Director information not available."
                    }</p>
                </div>
                
                ${ratingsHTML}
                
                ${
                  movie.Awards !== "N/A"
                    ? `
                <div class="movie-details-section">
                    <h3>Awards</h3>
                    <p>${movie.Awards}</p>
                </div>`
                    : ""
                }
            </div>
        </div>
    `;

  // Scroll to top
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// UI Helper Functions
function showLoader() {
  loader.classList.remove("hidden");
}

function hideLoader() {
  loader.classList.add("hidden");
}

function showResultsHeading() {
  resultsHeading.classList.remove("hidden");
}

function hideResultsHeading() {
  resultsHeading.classList.add("hidden");
}

function showNoResults() {
  noResults.classList.remove("hidden");
  hideResultsHeading();
}

function hideNoResults() {
  noResults.classList.add("hidden");
}

function showSearchResults() {
  movieDetails.classList.add("hidden");
  resultsContainer.classList.remove("hidden");
}
