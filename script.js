const apikey = "e39fe191";
const movieinput = document.getElementById("movieinput");
const searchbtn = document.getElementById("searchbtn");
const movieresult = document.getElementById("movieresult");

async function getmovies() {
    const moviename = movieinput.value.trim();

    if (moviename === "") {
        alert("Please write a movie name");
        return;
    }

    movieresult.innerHTML = "<h3 style='text-align:center; width:100%;'>Searching...</h3>";

    try {
        const response = await fetch(`https://www.omdbapi.com/?s=${moviename}&apikey=${apikey}`);
        const data = await response.json();

        if (data.Response === "True") {

            const moviePromises = data.Search.slice(0, 8).map(async (movie) => {
                try {
                    const detailRes = await fetch(`https://www.omdbapi.com/?i=${movie.imdbID}&apikey=${apikey}`);
                    return await detailRes.json();
                } catch (e) {
                    return movie; 
                }
            });

            const allMovieDetails = await Promise.all(moviePromises);
            movieresult.innerHTML = ""; 

            allMovieDetails.forEach(movie => {
                const poster = (movie.Poster && movie.Poster !== "N/A") ? movie.Poster : "https://via.placeholder.com/300x450?text=No+Poster";
                const rating = movie.imdbRating ? movie.imdbRating : "N/A";

                movieresult.innerHTML += `
                    <div class="movie-card">
                        <img src="${poster}">
                        <h3>${movie.Title}</h3>
                        <div class="movie-info">
                            <span class="rating">⭐ ${rating}</span>
                            <span class="year">${movie.Year}</span>
                        </div>
                    </div>
                `;
            });
        } else {
            movieresult.innerHTML = `<h2 style="text-align: center; width: 100%; color: #888;">Oops! Movie not found.</h2>`;
        }
    } catch (error) {
        console.log("Error:", error);
        movieresult.innerHTML = `<h3 style='text-align:center; color:red;'>Network Error! Please try again.</h3>`;
    }
}


searchbtn.addEventListener("click", getmovies);
movieinput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") getmovies();
});

window.onload = () => {
    movieinput.value = "avatar"; 
    getmovies();
    movieinput.value = ""; 
};