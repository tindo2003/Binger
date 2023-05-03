const db = require('./model/DBOperations')
const { v4: uuidv4 } = require('uuid')
const SHA256 = require('crypto-js/sha256')
const { authenticateUser, verifyUser } = require('./utils/auth')

const mysql = require('mysql')
const config = require('./config.json')
const { default: axios } = require('axios')

const connection = mysql.createConnection({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db,
})
connection.connect((err) => err && console.log(err))

const signup = async function (req, res) {
  const userId = uuidv4()
  const data = req.body
  console.log(data)
  const username = data['username']
  const email = data['email']
  const password = SHA256(data['password'])
  const firstName = data['firstName']
  const lastName = data['lastName']

  const result = await db.signUp(
    userId,
    username,
    password,
    email,
    firstName,
    lastName,
  )
  console.log(result)
  if (result) {
    res.json({ success: true })
  } else {
    res.json({ success: false })
  }
}

const login = async function (req, res) {
  // query the database to get the user id
  db.logIn(req.body.username, SHA256(req.body.password))
    .then((userId) => {
      const token = authenticateUser(userId)
      res.status(200).json({ apptoken: token })
    })
    .catch((err) => {
      console.log(err)
      res.status(400).json({ error: "can't log in" })
    })
}

/* 
    This returns a user information if the user is logged in
*/
const authenticated = async function (req, res) {
  console.log('calling verifyuser 62')
  verifyUser(req.headers.authorization)
    .then((result) => {
      if (result) {
        res.status(200).json({ info: result, success: true })
      } else {
        // res.status(205).json({ success: false })
      }
    })
    .catch((err) => {
      console.log('the error is', err)
      res.status(400)
    })
}

// Query test data format

const testURL = `http://${config.server_host}:${config.server_port}/netflix?type=Movie&country=United States&rating=R&listedIn=Dramas`

const simpleTest = async function (req, res) {
  const type = req.query.type ?? '%'
  const title = req.query.title ?? '' // need to include null
  const director = req.query.director ?? '%' // need to include null
  const cast = req.query.cast ?? '%' // need to include null

  connection.query(
    `
  SELECT *
  FROM Netflix
  WHERE type LIKE '%${type}%' AND
  title LIKE '${title}%'
  ORDER BY release_year DESC;
`,
    (err, data) => {
      if (err || data.length === 0) {
        res.json([])
      } else {
        res.json(data)
        console.log(type)
        console.log(title)
      }
    },
  )
}

// Route: GET /movie/:title
// Pull up the movie card for the given movie

const movie = async function (req, res) {
  connection.query(
    `
      SELECT * FROM Movies WHERE original_title = '${req.params.title}' LIMIT 1;
  `,
    (err, data) => {
      if (err || data.length === 0) {
        console.log(err)
        res.json({})
      } else {
        res.json(data[0])
      }
    },
  )
}

const toggleLike = async function (req, res) {
  console.log('calling verifyUser line 127')
  verifyUser(req.headers.authorization)
    .then((user) => {
      if (!user) {
        console.log('User is not logged in')
        res.status(400).json({ error: 'user not logged in' })

        
      }

      const userId = user.userid;

      let movieid = req.params.movieid;

      

      console.log(movieid)

      //checks if the user has already liked the movie

      
         
          connection.query(
            `SELECT * 
                          FROM FavMovies2
                          WHERE user_id = '${userId}' AND movieid = ${movieid}`,
            (err, data) => {
              if (err) {
                console.log('error checking if user has liked movie', err)
                res
                  .status(400)
                  .json({ error: 'error checking if user has liked movie' })
                
              } else {
                if (data.length === 0) {
                  console.log('liked the movie')
                  //user has not liked the movie yet
                  console.log(movieid);
                  connection.query(
                    `INSERT INTO FavMovies2 (user_id, movieid) VALUES ('${userId}', ${movieid})`,
                    (err, data) => {
                      if (err) {
                        console.log("error adding movie to user's favorites", err)
                        res
                          .status(400)
                          .json({ error: "error adding movie to user's favorites" })
                        
                      }
                      res.status(200).json({ success: true, likeStatus: true })
                    },
                  )
                } else {
                  //user has already liked the movie
                  console.log('disliked the movie')
                  connection.query(
                    `DELETE FROM FavMovies2 WHERE user_id = '${userId}' AND movieid = '${movieid}'`,
                    (err, data) => {
                      if (err) {
                        console.log(
                          "error removing movie from user's favorites",
                          err,
                        )
                        res.status(400).json({
                          error: "error removing movie from user's favorites",
                        })
                        
                      }
                      res.status(200).json({ success: true, likeStatus: false })
                    },
                  )
                }
              }
            },
          )
        })}


        
      
      


      /*connection.query(
        `SELECT * 
                      FROM FavMovies
                      WHERE userid = '${userId}' AND movieid = ${movieid}`,
        (err, data) => {
          if (err) {
            console.log('error checking if user has liked movie', err)
            res
              .status(400)
              .json({ error: 'error checking if user has liked movie' })
            return
          } else {
            if (data.length === 0) {
              console.log('liked the movie')
              //user has not liked the movie yet
              connection.query(
                `INSERT INTO FavMovies (userid, movieid) VALUES ('${userId}', ${movieid})`,
                (err, data) => {
                  if (err) {
                    console.log("error adding movie to user's favorites", err)
                    res
                      .status(400)
                      .json({ error: "error adding movie to user's favorites" })
                  }
                  res.status(200).json({ success: true, likeStatus: true })
                },
              )
            } else {
              //user has already liked the movie
              console.log('disliked the movie')
              connection.query(
                `DELETE FROM FavMovies WHERE userid = '${userId}' AND movieid = '${movieid}'`,
                (err, data) => {
                  if (err) {
                    console.log(
                      "error removing movie from user's favorites",
                      err,
                    )
                    res.status(400).json({
                      error: "error removing movie from user's favorites",
                    })
                  }
                  res.status(200).json({ success: true, likeStatus: false })
                },
              )
            }
          }
        },
      )
    })
    .catch((error) => {
      res.status(400).json({ success: false })*/
    
  //const user = {"userId": "0efdfc13-e650-4b17-8d77-2787df08b4bc"};


const toggleLikeShow = async function (req, res) {
  console.log('calling verify user 202')
  verifyUser(req.headers.authorization).then((user) => {
    if (!user) {
      console.log('User is not logged in')
      res.status(400).json({ error: 'user not logged in' })

      
    }
    const userId = user.userid

    const showTitle = req.params.showTitle

    console.log(showTitle)

    connection.query(
      `SELECT * FROM FavShows WHERE userid = '${userId}' AND show_title = '${showTitle}'`,
      (err, data) => {
        if (err) {
          res.status(400)
          
        } else {
          // the user has not liked this show
          if (data.length === 0) {
            connection.query(
              `INSERT INTO FavShows (userid, show_title) VALUES ('${userId}', '${showTitle}')`,
              (err, data) => {
                if (err) {
                  console.log(err)
                  console.log('error when inserting into FavShows table')
                  res.status(400).send({})
                } else {
                  res.status(200).send({ success: true })
                }
              },
            )
          } else {
            // the user liked this show
            connection.query(
              `DELETE FROM FavShows
              WHERE userid = '${userId}' AND show_title = '${showTitle}';`,
              (err, data) => {
                if (err) {
                  console.log(err)
                  console.log('error when inserting into FavShows table')
                  res.status(400).send({})
                } else {
                  res.status(200).send({ success: true })
                }
              },
            )
          }
        }
      },
    )
  })
}




const recommender = async function (req, res) {
  // const user = await verifyUser(req.headers.authorization);

  verifyUser(req.headers.authorization).then((user) => {
   //user = { userId: '006d3fd9-7657-46af-9937-0d370351b599' }
  if (!user) {
    res.status(400).json({ error: 'user not logged in' })
    
  } else{
   const userId = user.userid
   //console.log("user",user);

  queryAsync(`SELECT * FROM FavMovies2 WHERE user_id = ?`, [userId])
    .then((data) => {
      const movieIds = data.map((movie) => movie.movieid)
      
      if(movieIds.length === 0) {
        res.status(200).json({ success: true, similarMovies: [], message:"no likes from user" });
        
      }else{

      console.log('movieIds', movieIds)

      // Get movies also liked by the similar users
      return queryAsync(
        `
      SELECT fm2.movieid, COUNT(fm2.user_id) as mutualLikeCount
      FROM FavMovies2 as fm1
      JOIN FavMovies2 as fm2 ON fm1.user_id = fm2.user_id
      WHERE fm1.movieid IN (SELECT movieid FROM FavMovies2 WHERE user_id = ?) AND fm1.user_id != ? AND fm2.movieid NOT IN (SELECT movieid FROM FavMovies2 WHERE user_id = ?)
      GROUP BY fm2.movieid
      ORDER BY mutualLikeCount DESC
    `,
        [userId, userId, userId],
      )}
    })
    .then((data) => {
      
      const movieIds = data.map((movie) => movie.movieid)
      
      if (movieIds.length === 0) {
        res.status(200).json({ success: true, data: [], message: "no recommendations to be made" })
        
      } else{
      connection.query(
        `SELECT id, original_title 
                      FROM Movies
                      WHERE id IN (?)`,
        [movieIds],
        (err, movieNames) => {
          if (err) {
            console.log('error getting movie titles', err)
            res.status(400).json({ error: 'error getting movie titles' })
            
          }

          // Create a mapping of movieIds to movieNames
          const movieNameMap = new Map(
            movieNames.map((movie) => [movie.id, movie.original_title]),
          )

          // Update data with movie names
          const updatedData = data.map((movie) => {
            return {
              ...movie,
              movieName: movieNameMap.get(movie.movieid),
            }
          })

          updatedData.sort((a, b) => b.mutualLikeCount - a.mutualLikeCount)

          const ret = updatedData.slice(0, 10)

          res.status(200).json({ success: true, similarMovies: ret })
        },
      )}
    })
    .catch((err) => {
      console.log(err)
    
    })} 
  })
}

function queryAsync(sql, params) {
  return new Promise((resolve, reject) => {
    connection.query(sql, params, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

function getFavoriteMovies(req, res) {
  console.log('calling verify user 343')
  verifyUser(req.headers.authorization).then((user) => {
    // user is not logged in
    if (!user) {
      res.status(400).send({ success: false })
    }
    const userid = user.userid
    connection.query(
      `SELECT * \
      FROM FavMovies2 F JOIN Movies ON F.movieid = Movies.id \
      WHERE F.user_id = '${userid}';`,
      (err, data) => {
        if (err) {
          res.status(400)
          console.log('line 357', err)
        } else {
          res.status(200).send({ data: data })
        }
      },
    )
  })
}

// Route: GET /show/:title
// Pull up the show card for the given show
// Related query can pull up providers that display a given movie/show
const show = async function (req, res) {
  connection.query(
    `
    WITH shows AS ((SELECT *
      FROM Netflix
      WHERE Type = 'TV Show')
      UNION ALL
      (SELECT *
      FROM Amazon
      WHERE Type = 'TV Show')
      UNION ALL
      (SELECT *
      FROM Hulu
      WHERE Type = 'TV Show')
      UNION ALL
      (SELECT *
      FROM Disney WHERE Type = 'TV Show'))
      SELECT * FROM shows WHERE title = '${req.params.title}' LIMIT 1;
  `,
    (err, data) => {
      if (err || data.length === 0) {
        console.log(err)
        res.json({})
      } else {
        res.json(data[0])
      }
    },
  )
}

// Route: GET /stream_movie/:title
// Pull up the show card for the given show
// Related query can pull up providers that display a given movie/show
const stream_movie = async function (req, res) {
  connection.query(
    `
    WITH shows AS ((SELECT *
      FROM Netflix
      WHERE Type LIKE 'Movie')
      UNION ALL
      (SELECT *
      FROM Amazon
      WHERE Type LIKE 'Movie')
      UNION ALL
      (SELECT *
      FROM Hulu
      WHERE Type LIKE 'Movie')
      UNION ALL
      (SELECT *
      FROM Disney WHERE Type LIKE 'Movie'))
      SELECT * FROM shows s JOIN Movies m ON s.title=m.original_title AND s.release_year=SUBSTRING(m.modified_release_year, 1, 4) WHERE s.title = '${req.params.title}' LIMIT 1;
  `,
    (err, data) => {
      if (err || data.length === 0) {
        console.log(err)
        res.json({})
      } else {
        res.json(data[0])
      }
    },
  )
}

// Route: GET /services/:title
// For the show card final field. Query to see what services offer a given show
const servicesShow = async function (req, res) {
  connection.query(
    `
  WITH Amazon_named AS (SELECT title, 'Amazon' AS provider FROM Amazon WHERE type = '${req.query.type}'),
  Hulu_named AS (SELECT title, 'Hulu' AS provider FROM Hulu WHERE type = '${req.query.type}'),
  Netflix_named AS (SELECT title, 'Netflix' AS provider FROM Netflix WHERE type = '${req.query.type}'),
  Disney_named AS (SELECT title, 'Disney' AS provider FROM Disney WHERE type = '${req.query.type}'),
  all_providers AS (SELECT * FROM Amazon_named
                             UNION ALL
                             SELECT * FROM Hulu_named
                                      UNION ALL
                                      SELECT * FROM Netflix_named
                                               UNION ALL
                                               SELECT * FROM Disney_named)
SELECT provider
FROM all_providers
WHERE title='${req.params.title}';
  `,
    (err, data) => {
      if (err || data.length === 0) {
        console.log(err)
        res.json({})
      } else {
        res.json(data)
      }
    },
  )
}

// Route /search_shows: Search the show listings from the four streaming platforms
const search_shows = async function (req, res) {
  const netflix = req.query.netflix === 'true' ?? false
  const disney = req.query.disney === 'true' ?? false
  const amazon = req.query.amazon === 'true' ?? false
  const hulu = req.query.hulu === 'true' ?? false

  const selectedPlatforms = []
  if (netflix) selectedPlatforms.push('Netflix')
  if (disney) selectedPlatforms.push('Disney')
  if (amazon) selectedPlatforms.push('Amazon')
  if (hulu) selectedPlatforms.push('Hulu')

  // const stream = req.query.stream ?? 'Netflix';
  const title = req.query.title ?? ''
  const director = req.query.director ?? ''
  const cast = req.query.cast ?? ''
  const country = req.query.country ?? '' // all countries case? handled in the View
  const releaseYearMin = req.query.releaseYearMin ?? 1900
  const releaseYearMax = req.query.releaseYearMax ?? 2023
  const rating = req.query.rating ?? ''
  const durationMin = req.query.durationMin ?? 1
  const durationMax = req.query.durationMax ?? 34
  const listedIn = req.query.listedIn ?? '' // all genres case? handled in the View

  // Variables to enable entries with null values for certain fields to display in results
  // when the fields aren't specified by the user in their search
  let directorNull
  let castNull
  let countryNull
  let ratingNull

  if (director === '') {
    directorNull = 'OR director IS NULL)'
  } else {
    directorNull = ')'
  }
  if (cast === '') {
    castNull = 'OR cast IS NULL)'
  } else {
    castNull = ')'
  }
  if (country === '') {
    countryNull = 'OR country IS NULL)'
  } else {
    countryNull = ')'
  }
  if (rating === '') {
    ratingNull = 'OR rating IS NULL)'
  } else {
    ratingNull = ')'
  }
  let unionQuery

  unionQuery = selectedPlatforms
    .map(
      (platform) => `SELECT *
    FROM ${platform}
    WHERE type LIKE 'TV Show' AND
          title LIKE '${title}%' AND
          (director LIKE '%${director}%' ${directorNull} AND
          (cast LIKE '%${cast}%' ${castNull} AND
          (country LIKE '%${country}%' ${countryNull} AND
          release_year >= ${releaseYearMin} AND
          release_year <= ${releaseYearMax} AND
          (rating LIKE '%${rating}%' ${ratingNull} AND
          duration >= ${durationMin} AND
          duration <= ${durationMax} AND
          listed_in LIKE '%${listedIn}%'`,
    )
    .join(' UNION ALL ')
  const query = `SELECT * FROM (${unionQuery}) AS Combined ORDER BY release_year DESC`
  console.log('buffer')
  console.log(query)
  connection.query(query, (err, data) => {
    if (err || data.length === 0) {
      // console.log(rating);
      res.json([])
    } else {
      res.json(data)
    }
  })

  /*
  connection.query(`
    SELECT *
    FROM ${stream}
    WHERE type LIKE 'TV Show' AND
          title LIKE '%${title}%' AND
          (director LIKE '%${director}%' ${directorNull} AND
          (cast LIKE '%${cast}%' ${castNull} AND
          (country LIKE '%${country}%' ${countryNull} AND
          release_year >= ${releaseYearMin} AND
          release_year <= ${releaseYearMax} AND
          (rating LIKE '%${rating}%' ${ratingNull} AND
          duration >= ${durationMin} AND
          duration <= ${durationMax} AND
          listed_in LIKE '%${listedIn}%'
    ORDER BY release_year DESC;
  , */
}

// Route /imdb Search the IMDB movies_metadata table
const imdb = async function (req, res) {
  const budgetMin = req.query.budgetMin ?? 0
  const budgetMax = req.query.budgetMax ?? 400000000
  const genres = req.query.genres ? JSON.parse(req.query.genres) : []
  const originalLanguage = req.query.originalLanguage ?? ''
  const overview = req.query.overview ?? ''
  const original_title = req.query.original_title ?? ''
  let releaseYearMax = req.query.releaseYearMax ?? 2020
  let releaseYearMin = req.query.releaseYearMin ?? 1874

  // Variables to enable entries with null values for certain fields to display in results
  // when the fields aren't specified by the user in their search
  let oLNull
  let overviewNull
  let oTNull
  releaseYearMax = releaseYearMax + '-12-31'
  releaseYearMin = releaseYearMin + '-01-01'
  console.log(releaseYearMin)

  if (originalLanguage === '') {
    oLNull = 'OR original_language IS NULL)'
  } else {
    oLNull = ')'
  }
  if (overview === '') {
    overviewNull = 'OR overview IS NULL)'
  } else {
    overviewNull = ')'
  }
  if (original_title === '') {
    oTNull = 'OR original_title IS NULL)'
  } else {
    oTNull = ')'
  }
  let genreConditions = 'AND'
  // genre query
  if (genres.length > 0) {
    genreConditions = genres
      .map((genre) => `(genres LIKE '%${genre}%')`)
      .join(' AND ')
    genreConditions = ' AND' + genreConditions + ' AND '
    // conditions.push(`(${genreConditions})`);
  }
  const query = `SELECT *
  FROM Movies
  WHERE budget >= ${budgetMin} AND
        budget <= ${budgetMax}
        ${genreConditions}
        (original_language LIKE '%${originalLanguage}%' ${oLNull} AND
        (overview LIKE '%${overview}%' ${overviewNull} AND
        (original_title LIKE '${original_title}%' ${oTNull} AND
        modified_release_year BETWEEN '${releaseYearMin}' AND '${releaseYearMax}'
        
  ORDER BY modified_release_year DESC;`
  console.log(query);

  connection.query(query ,
    (err, data) => {
      if (err || data.length === 0) {
        res.json([])
      } else {
        res.json(data)
      }
    },
  )
}

const search_movies = async function (req, res) {
  /*const {
    netflix,
    disney,
    amazon,
    hulu,
  } = req.query;*/

  const netflix = req.query.netflix === 'true' ?? false
  const disney = req.query.disney === 'true' ?? false
  const amazon = req.query.amazon === 'true' ?? false
  const hulu = req.query.hulu === 'true' ?? false

  const title = req.query.title ?? ''
  const director = req.query.director ?? ''
  const cast = req.query.cast ? JSON.parse(req.query.cast) : []
  const releaseYearMin = req.query.releaseYearMin ?? 1900
  const releaseYearMax = req.query.releaseYearMax ?? 2023
  const rating = req.query.rating ?? ''
  const budgetMin = req.query.budgetMin ?? 0
  const budgetMax = req.query.budgetMax ?? 400000000
  const genres = req.query.genres ? JSON.parse(req.query.genres) : []
  const originalLanguage = req.query.originalLanguage ?? ''

  const conditions = [`(title LIKE '${title}%')`]

  if (director) {
    conditions.push(`(director LIKE '%${director}%')`)
  }
  console.log(cast)
  if (cast.length > 0) {
    const castConditions = cast
      .map((name) => `(cast LIKE '%${name}%')`)
      .join(' AND ')
    conditions.push(`(${castConditions})`)
  }

  if (rating) {
    conditions.push(`(rating LIKE '%${rating}%')`)
  }

  conditions.push(`(release_year >= ${releaseYearMin})`)
  conditions.push(`(release_year <= ${releaseYearMax})`)

  const selectedPlatforms = []
  if (netflix) selectedPlatforms.push('Netflix')
  if (disney) selectedPlatforms.push('Disney')
  if (amazon) selectedPlatforms.push('Amazon')
  if (hulu) selectedPlatforms.push('Hulu')

  let genreConditions = ''
  // genre query
  if (genres.length > 0) {
    genreConditions = genres
      .map((genre) => `(genres LIKE '%${genre}%')`)
      .join(' AND ')
    genreConditions = ' AND' + genreConditions
    // conditions.push(`(${genreConditions})`);
  }
  let languageConditions;

  if (originalLanguage === '') {
    languageConditions = '';
  } else {
    languageConditions = ` AND original_language = '${originalLanguage}'`
  }


  const unionQuery = selectedPlatforms
    .map((platform) => `SELECT * FROM ${platform} WHERE type = 'Movie'`)
    .join(' UNION ALL ')

  const query = `WITH Combined AS(
    SELECT title, director, cast, release_year, rating, description
    FROM (
      ${unionQuery}
    ) AS PreCombined
    WHERE ${conditions.join(' AND ')}
    
  ), Moovie AS (
    SELECT original_title, budget, genres, original_language, modified_release_year
    FROM Movies
    WHERE budget <= ${budgetMax} AND budget >= ${budgetMin}  ${genreConditions}  ${languageConditions}
  )
  SELECT c.title, m.budget, m.genres, m.original_language, c.description, c.release_year, c.director, c.cast, c.rating
    FROM Combined c JOIN Moovie m ON c.title = m.original_title AND c.release_year = SUBSTRING(m.modified_release_year,1,4)
    ORDER BY c.release_year DESC;`

  console.log(query)

  connection.query(query, (err, data) => {
    if (err || data.length === 0) {
      res.json([])
    } else {
      res.json(data)
    }
  })

  //res.json(query);
}

// Route /streamtop: Top rated movies on the four streaming platforms (IMDb data)
const streamTopTen = async function (req, res) {
  const service = req.query.service // streaming platform in question

  connection.query(
    `
    WITH ratengs AS (SELECT movieId, COUNT(*) as ratingsCount, ROUND(AVG(rating), 2) as average
    FROM Ratings
    GROUP BY movieId),
    nin AS (SELECT movieId, average
    FROM ratengs
    WHERE ratingsCount>=10)
    SELECT n.movieId, m.original_title AS Title, n.average AS AverageRating
    FROM nin n JOIN Movies m ON n.movieId = m.id JOIN StreamableMovies s ON s.title = m.original_title JOIN ${service} p ON p.title = s.title
    ORDER BY n.average DESC
    LIMIT 10;
  `,
    (err, data) => {
      if (err || data.length === 0) {
        res.json([])
      } else {
        res.json(data)
      }
    },
  )
}

const topHundred = async function (req, res) {
  connection.query(
    `SELECT Movies.id, Movies.original_title AS Title, AVG(Ratings.rating) as AverageRating
    FROM Movies
    JOIN Ratings ON Ratings.movieId = Movies.id
    GROUP BY Movies.id
    ORDER BY AverageRating DESC
    LIMIT 100;
    `,
    (err, data) => {
      if (err || data.length === 0) {
        res.json([])
      } else {
        res.json(data)
      }
    },
  )
}

const getFavoriteShows = async function (req, res) {
  console.log('calling verify users 774')
  verifyUser(req.headers.authorization).then((user) => {
    // user is not logged in
    if (!user) {
      res.status(400).send({ success: false })
    }
    const userid = user.userid
    connection.query(
      `SELECT show_title FROM FavShows WHERE userid='${userid}'`,
      (err, data) => {
        if (err) {
          res.status(400)
          console.log(err)
        } else {
          const promises = data.map((item) => {
            show_title = item.show_title

            return axios
              .get(`http://localhost:8080/show/${show_title}`)
              .then((response) => {
                // console.log(response.data)
                return response.data
              })
              .catch((error) => {
                console.log('i got an error')
                // Handle error
                console.error(error)
              })
          })

          Promise.all(promises)
            .then((results) => {
              // Handle array of responses from all promises
              // console.log('Results:', results)
              res.status(200).send(results)
            })
            .catch((error) => {
              // Handle errors from any promise
              console.error(error)
              res.status(500).json({ error: 'Internal server error' })
            })
        }
      },
    )
  })
}

// Test code

module.exports = {
  signup,
  login,
  authenticated,
  simpleTest,
  movie,
  show,
  stream_movie,
  servicesShow,
  search_shows,
  streamTopTen,
  imdb,
  search_movies,
  toggleLike,
  recommender,
  topHundred,
  getFavoriteMovies,
  toggleLikeShow,
  getFavoriteShows,
}
