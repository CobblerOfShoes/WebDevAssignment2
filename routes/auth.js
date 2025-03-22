const express = require('express')
const router = express.Router()

const bcryptjs = require('bcryptjs')
const jsonwebtoken = require('jsonwebtoken')

const User = require('../models/User')
const {registerValidation, loginValidation} = require('../validations/validation')

// Register a new user (POST)
router.post('/register', async(req,res) => {
  // Validate user input
  const {error} = registerValidation(req.body)
  if (error) {
    return res.status(400).send({message:error['details'][0]['message']})
  }
  
  // Check if email is in database
  const userExists = await User.findOne({email:req.body.email})
  if (userExists) {
    return res.status(400).send({message:'User with that email already exists.'})
  }

  // Encrypt the given password
  const salt = await bcryptjs.genSalt(10)
  const hashedPassword = await bcryptjs.hash(req.body.password, salt)

  // Create and store the new user
  try {
    const user = new User({
      name:req.body.name,
      email:req.body.email,
      password:hashedPassword
    })

    const savedUser = await user.save()
    return res.send(savedUser)
  } catch (error) {
    return res.status(400).send({message:error})
  }
})

// Login as an existing user (POST)
router.post('/login', async(req,res) => {
  // Since email is our unique identifier, require email but not name
  const {error} = loginValidation(req.body)
  if (error) {
    return res.status(400).send({'error':error['details'][0]['message']})
  }
  
  // Check if user exists
  const user = await User.findOne({email:req.body.email})
  if (!user) {
    return res.status(400).send({message:'User with that email does not exist.'})
  }

  // Check user given password against database
  const passwordValidation = await bcryptjs.compare(req.body.password, user.password)
  if (!passwordValidation) {
    return res.status(400).send({message:'Incorrect password.'})
  }

  // Generate an auth-token
  try {
    const token = jsonwebtoken.sign({_id:user._id}, process.env.TOKEN_SECRET)
    return res.header('auth-token', token).send({'auth-token':token})
  } catch (error) {
    return res.status(400).send({message:error})
  }
})

module.exports = router