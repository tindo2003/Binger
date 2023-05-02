const mysql = require('mysql')
const config = require('../config.json')

const connection = mysql.createConnection({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db,
})
connection.connect((err) => err && console.log(err))

const signUp = async function (
  userId,
  username,
  password,
  email,
  firstName,
  lastName,
) {
  try {
    const res = await connection.query(
      `INSERT INTO Users (userid, username, password, email, first_name, last_name)
              VALUES ('${userId}', '${username}', '${password}', '${email}', '${firstName}', '${lastName}');`,
    )
    return true
  } catch (erorr) {
    console.log(error)
    return false
  }
}

const logIn = function (username, password) {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT password, userid FROM Users WHERE username = '${username}' LIMIT 1;`,
      (err, data) => {
        console.log(data)
        if (err) {
          return reject(err)
        } else {
          if (data[0].password === password.toString()) {
            console.log('password matched!')
            resolve(data[0].userid)
          }
        }
      },
    )
  })
}

const getUserByUserId = async function (userid) {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT * FROM Users
      WHERE userid = '${userid}';`,
      (err, data) => {
        if (err || data.length === 0) {
          console.log(err)
          return reject(err)
        } else {
          resolve(data[0])
        }
      },
    )
  })
}

module.exports = {
  signUp,
  getUserByUserId,
  logIn,
}
