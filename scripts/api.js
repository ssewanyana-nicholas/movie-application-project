const apiKey = '41e23e1524b7cb3d0c1b15b816308624';
const url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=en-US&page=1`;

const gridViewButton = document.getElementById('gridView');
const listViewButton = document.getElementById('listView');
const searchInput = document.getElementById('searchInput');
const moviesContainer = document.querySelector('.movies-container');

let moviesData = [];

// Toggle views between grid and list


gridViewButton.addEventListener('click', () => {
    moviesContainer.style.display = 'grid'; // Make the container visible
    moviesContainer.classList.add('gridView'); // Apply the grid-view style
    moviesContainer.classList.remove('listView'); // Remove list-view style
});

listViewButton.addEventListener('click', () => {
    moviesContainer.style.display = 'block'; // Make the container visible
    moviesContainer.classList.add('listView'); // Apply the list-view style
    moviesContainer.classList.remove('gridView'); // Remove grid-view style
});

// Fetch movies data
async function fetchMovies(query = '') {
    showLoading(true);
    const fetchUrl = query ?
        `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}&language=en-US&page=1` : url;

    try {
        const response = await fetch(fetchUrl);
        if (!response.ok) {
            throw new Error('Failed to fetch movie data.');
        }

        const data = await response.json();
        moviesData = data.results;
        displayMovies(moviesData);
    } catch (error) {
        displayError(error);
    } finally {
        showLoading(false);
    }
}

// Display movies on the page
function displayMovies(movies) {
    moviesContainer.innerHTML = ''; // Clear existing movies
    if (movies.length === 0) {
        moviesContainer.innerHTML = `<p>No movies found matching your query.</p>`;
        return;
    }

    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.className = 'movie-card';
        movieCard.addEventListener('click', () => showMovieDetails(movie));

        const poster = document.createElement('img');
        poster.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        poster.alt = `${movie.title} Poster`;
        poster.className = 'movie-poster';

        const title = document.createElement('h3');
        title.textContent = movie.title;
        title.className = 'movie-title';

        const rank = document.createElement('p');
        rank.textContent = `Rank: ${movie.vote_average}`;
        rank.className = 'movie-rank';

        movieCard.appendChild(poster);
        movieCard.appendChild(title);
        movieCard.appendChild(rank);
        moviesContainer.appendChild(movieCard);
    });
}

// Show loading indicator
function showLoading(isLoading) {
    if (isLoading) {
        moviesContainer.innerHTML = '<p>Loading movies...</p>';
    }
}

// Handle errors
function displayError(error) {
    console.error('Error fetching movies:', error);
    moviesContainer.innerHTML = `<p style="color: red;">${error.message}</p>`;
}

// Show movie details in a modal
function showMovieDetails(movie) {
    const modal = document.createElement('div');
    modal.className = 'movie-modal';

    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.className = 'close-button';
    closeButton.addEventListener('click', () => modal.remove());

    const movieTitle = document.createElement('h2');
    movieTitle.textContent = movie.title;

    const movieDescription = document.createElement('p');
    movieDescription.textContent = movie.overview || 'No description available';

    const movieYear = document.createElement('p');
    movieYear.textContent = `Year: ${movie.release_date || 'N/A'}`;

    const movieDirector = document.createElement('p');
    movieDirector.textContent = `Director: ${movie.director || 'N/A'}`;

    const movieRating = document.createElement('p');
    movieRating.textContent = `Rating: ${movie.vote_average || 'N/A'}`;

    const imdbLink = document.createElement('a');
    imdbLink.href = `https://www.themoviedb.org/movie/${movie.id}`;
    imdbLink.target = '_blank';
    imdbLink.textContent = 'View on TMDb';

    const poster = document.createElement('img');
    poster.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    poster.alt = `${movie.title} Poster`;
    poster.className = 'movie-poster-modal';

    modalContent.appendChild(closeButton);
    modalContent.appendChild(poster);
    modalContent.appendChild(movieTitle);
    modalContent.appendChild(movieDescription);
    modalContent.appendChild(movieYear);
    modalContent.appendChild(movieRating);
    modalContent.appendChild(imdbLink);

    modal.appendChild(modalContent);
    document.body.appendChild(modal);
}

// Event listener for search input
searchInput.addEventListener('input', (event) => {
    const query = event.target.value;
    fetchMovies(query); // Fetch movies based on the search query
});

// Initial fetch for top rated movies
fetchMovies();
