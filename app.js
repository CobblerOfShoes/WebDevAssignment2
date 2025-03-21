const express = require('express')
const app = express()

const mongoose = require('mongoose')
const bodyParser = require('body-parser')
app.use(bodyParser.json())

require('dotenv/config')

const authRoute = require('./routes/auth')
app.use('/api/auth', authRoute)

const usersRoute = require('./routes/users')
app.use('/api/users', usersRoute)

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