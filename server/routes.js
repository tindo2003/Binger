const db = require('./model/DBOperations')
const { v4: uuidv4 } = require('uuid')
const SHA256 = require('crypto-js/sha256')
const { authenticateUser, verifyUser } = require('./utils/auth')

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

module.exports = {
  signup,
  login,
  authenticated,
}
