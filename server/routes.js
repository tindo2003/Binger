const mysql = require('mysql')
const config = require('./config.json')
const { v4: uuidv4 } = require('uuid')
const SHA256 = require('crypto-js/sha256')

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
  console.log(data.email)
  connection.query(
    `INSERT INTO Users (userid, username, password, email, first_name, last_name)
  VALUES ('${userId}', '${username}', '${password}', '${email}', '${firstName}', '${lastName}');`,
    (err, data) => {
      if (err || data.length === 0) {
        // data will be a list of Song object(s)
        console.log('The error is', err)
        res.json({ success: 'False' })
      } else {
        console.log(data)
        res.json({ success: 'True' })
      }
    },
  )
}

module.exports = {
  signup,
}
