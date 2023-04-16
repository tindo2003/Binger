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
app.use(bodyParser.json())

app.post('/signup', routes.signup)

app.listen(config.server_port, () => {
  console.log(
    `Server running at http://${config.server_host}:${config.server_port}/`,
  )
})

module.exports = app
