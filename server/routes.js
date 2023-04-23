const db = require('./model/DBOperations')
const { v4: uuidv4 } = require('uuid')
const SHA256 = require('crypto-js/sha256')
const { authenticateUser, verifyUser } = require('./utils/auth')

const mysql = require('mysql')
const config = require('./config.json')


const connection = mysql.createConnection({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db
});
connection.connect((err) => err && console.log(err));




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
      res.status(400).json({ error: "can't log in" })
    })
}

const authenticated = async function (req, res) {
  verifyUser(req.headers.authorization)
    .then((result) => {
      if (result) {
        res.status(200).json({ success: true })
      } else {
        res.status(400).json({ success: false })
      }
    })
    .catch((err) => {
      console.log(err)
      res.status(400)
    })
}


// Query test data format 

const testURL = `http://${config.server_host}:${config.server_port}/netflix?type=Movie&country=United States&rating=R&listedIn=Dramas`

const simpleTest = async function(req, res) {
  const type = req.query.type ?? '%';
  const title = req.query.title ?? '';     // need to include null
  const director = req.query.director ?? '%';       // need to include null
  const cast = req.query.cast ?? '%';           // need to include null

  
  connection.query(`
  SELECT *
  FROM Netflix
  WHERE type LIKE '%${type}%' AND
  title LIKE '%${title}%'
  ORDER BY release_year DESC;
`, (err, data) => {
  if (err || data.length === 0) {
    
    res.json([]);
  } else {
    res.json(data);
    console.log(type);
    console.log(title);
  }
});
}

// Route /netflix: Search the Netflix listings
const search_netflix = async function(req, res) {

  const type = req.query.type ?? '';
  const title = req.query.title ?? '';
  const director = req.query.director ?? '';
  const cast = req.query.cast ?? '';
  const country = req.query.country ?? '';       // all countries case? handled in the View
  const releaseYearMin = req.query.releaseYearMin ?? 1900;
  const releaseYearMax = req.query.releaseYearMax ?? 2023;
  const rating = req.query.rating ?? '';
  const durationMin = req.query.durationMin ?? 0;
  const durationMax = req.query.durationMax ?? 650;
  const listedIn = req.query.listedIn ?? '';       // all genres case? handled in the View

  // Variables to enable entries with null values for certain fields to display in results 
  // when the fields aren't specified by the user in their search
  let directorNull;
  let castNull;
  let countryNull;
  let ratingNull;


  if (director === '') {
    directorNull = 'OR director IS NULL)';
  } else {
    directorNull = ')';
  }
  if (cast === '') {
    castNull = 'OR cast IS NULL)';
  } else {
    castNull = ')';
  }
  if (country === '') {
    countryNull = 'OR country IS NULL)';
  } else {
    countryNull = ')';
  }
  if (rating === '') {
    ratingNull = 'OR rating IS NULL)';
  } else {
    ratingNull = ')';
  }

  connection.query(`
    SELECT *
    FROM Netflix
    WHERE type LIKE '%${type}%' AND 
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
  `, (err, data) => {
    if (err || data.length === 0) {
      res.json([]);
    } else {
      res.json(data);
    }
  });   
}


// Route /streamtop: Top rated movies on the four streaming platforms (IMDb data)
const streamTopTen = async function(req, res) {

  const service = req.query.service         // streaming platform in question

  connection.query(`
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
  `, (err, data) => {
    if (err || data.length === 0) {
      res.json([]);
    } else {
      res.json(data);
    }
  });   
}




// Test code





module.exports = {
  signup,
  login,
  authenticated,
  simpleTest,
  search_netflix,
  streamTopTen,
}
