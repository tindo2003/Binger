// import JWT
const jwt = require('jsonwebtoken')

// import the env variables
require('dotenv').config()

// import DB function
const { getUserByUserId } = require('../model/DBOperations')

/**
 * Create a JWT containing the username
 * @param {*} userid
 * @returns the token
 */
const authenticateUser = (userid) => {
  try {
    const token = jwt.sign({ userid: userid }, process.env.KEY, {
      expiresIn: '3600s',
    })
    // console.log('token', token)
    console.log('authenticated?')
    return token
  } catch (err) {
    console.log('error', err.message)
  }
}

/**
 * Verify a token. Check if the user is valid
 * @param {*} token
 * @returns true if the user is valid
 */
const verifyUser = async (token) => {
  try {
    // decoded contains the paylod of the token
    const decoded = jwt.verify(token, process.env.KEY)
    console.log('payload', decoded)
    // check that the payload contains a valid user
    const user = await getUserByUserId(decoded.userid)
    console.log(user)
    if (!user) {
      // user is undefined
      console.log('User can not be verified')
      return user
    }
    return user
  } catch (err) {
    // invalid token
    console.log('lmaooooo', err.message)
    return false
  }
}

module.exports = { authenticateUser, verifyUser }
