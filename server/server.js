const mysql = require('mysql')
const express = require('express')
const cors = require('cors')
const config = require('./config')
const routes = require('./routes')
const bodyParser = require('body-parser')

const app = express()
app.use(
  cors({
    origin: '*',
  }),
)
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.post('/signup', routes.signup)
app.post('/login', routes.login)
app.get('/authenticated', routes.authenticated)
app.get('/show/:title', routes.show)
app.get('/movie/:title', routes.movie)
app.get('/services/:title', routes.servicesShow)
app.get('/search_shows', routes.search_shows)
app.get('/streamtop', routes.streamTopTen)
app.get('/movietop', routes.topHundred)
app.get('/imdb', routes.imdb)
app.get('/stream_movie/:title', routes.stream_movie)
app.get('/search_movies', routes.search_movies)

app.get('/toggleLike/:movieid', routes.toggleLike)
app.get('/toggleLikeShow/:showTitle', routes.toggleLikeShow)

app.get('/getFavoriteMovies', routes.getFavoriteMovies)
app.get('/getFavoriteShows', routes.getFavoriteShows)

app.get('/getRecommendations', routes.recommender)

// Test route : remove later
app.get('/simple', routes.simpleTest)

app.listen(config.server_port, () => {
  console.log(
    `Server running at http://${config.server_host}:${config.server_port}/`,
  )
})

module.exports = app
