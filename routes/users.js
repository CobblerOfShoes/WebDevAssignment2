const express = require('express')
const router = express.Router()

const User =  require('../models/User')

// List all users (GET)
router.get('/', async(req,res) => {
  try {
    const users = await User.find()
    res.send(users) 
  } catch (error) {
    res.send({message:error})
  }
})

module.exports = router