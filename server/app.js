const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
    res.send('Hello World!')
})


const sampleMovie = {
    "Title": "Toy Story",
    "Year": "1995",
    "Rated": "G",
    "Released": "22 Nov 1995",
    "Runtime": "81 min",
    "Genre": "Animation, Adventure, Comedy, Family, Fantasy",
    "Director": "John Lasseter",
    "Writer": "John Lasseter (original story by), Pete Docter (original story by), Andrew Stanton (original story by), Joe Ranft (original story by), Joss Whedon (screenplay by), Andrew Stanton (screenplay by), Joel Cohen (screenplay by), Alec Sokolow (screenplay by)",
    "Actors": "Tom Hanks, Tim Allen, Don Rickles, Jim Varney",
    "Plot": "A cowboy doll is profoundly threatened and jealous when a new spaceman figure supplants him as top toy in a boy's room.",
    "Language": "English",
    "Country": "USA",
    "Awards": "Nominated for 3 Oscars. Another 27 wins & 20 nominations.",
    "Poster": "https://m.media-amazon.com/images/M/MV5BMDU2ZWJlMjktMTRhMy00ZTA5LWEzNDgtYmNmZTEwZTViZWJkXkEyXkFqcGdeQXVyNDQ2OTk4MzI@._V1_SX300.jpg",
    "Ratings": [
        {
            "Source": "Internet Movie Database",
            "Value": "8.3/10"
        },
        {
            "Source": "Rotten Tomatoes",
            "Value": "100%"
        },
        {
            "Source": "Metacritic",
            "Value": "95/100"
        }
    ],
    "Metascore": "95",
    "imdbRating": "8.3",
    "imdbVotes": "864,385",
    "imdbID": "tt0114709",
    "Type": "movie",
    "DVD": "20 Mar 2001",
    "BoxOffice": "N/A",
    "Production": "Buena Vista",
    "Website": "N/A",
    "Response": "True"
};

const movieResponse = {
    success: true,
    data:
        { movie: sampleMovie }
}
app.get('/movie', (req, res) => {
    res.send(movieResponse);
})


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})