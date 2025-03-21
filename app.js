const express = require('express')
const app = express()

const mongoose = require('mongoose')
const bodyParser = require('body-parser')
app.use(bodyParser.json())

// Hiding secrets!
require('dotenv/config')

// Rate limiter: taken from https://www.npmjs.com/package/express-rate-limit
const rateLimit = require('express-rate-limit')

const limiter = rateLimit({
	windowMs: 1 * 60 * 1000, // 1 minute
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 1 minutes).
	standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	// store: ... , // Redis, Memcached, etc. See below.
})

// Apply the rate limiting middleware to all requests.
app.use(limiter)

// Authentication -- registration and login
const authRoute = require('./routes/auth')
app.use('/api/auth', authRoute)

// Listing users -- testing, should be removed in prod
const usersRoute = require('./routes/users')
app.use('/api/users', usersRoute)

// Creating and viewing posts
const postsRoute = require('./routes/posts')
app.use('/api/posts', postsRoute)

app.use('/', (req,res) => {
  res.send('home')
})

const dbconnect = async () => {
  await mongoose.connect(process.env.DB_CONNECTOR)
  console.log("Connected to Database")
}
dbconnect()
  .catch((err) => console.error(err))

app.listen(3000,() => {
  console.log('Server is running!')
})