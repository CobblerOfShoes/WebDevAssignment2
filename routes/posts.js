const express = require('express')
const router = express.Router()

const Post =  require('../models/Post')

const {postValidation} = require('../validations/validation')

const verifyToken = require('../verifyToken')

// View all posts (GET)
router.get('/', async(req,res) => {
  try {
    const posts = await Post.find()
    res.send(posts)
  } catch(error) {
    res.status(400).send({message:error})
  }
})

// Make a post (verification required) (POST)
router.post('/', verifyToken, async(req,res) => {
  // Validate user input
  const {error} = postValidation(req.body)
  if (error) {
    return res.status(400).send({message:error['details'][0]['message']})
  }
  
  // Get user Id of poster
  const userId = req.user._id

  // Create and upload post
  try {
    const postData = new Post({
      title:req.body.title,
      description:req.body.description,
      createdBy:userId,
      createdAt:req.body.createdAt
    })
    const postToSave = await postData.save()
    res.send(postToSave)
  } catch(error) {
    res.status(400).send({message:error.message})
  }
})

// View a specific post (GET)
router.get('/:id', async(req,res) => {
  try {
    const getPostById = await Post.findById(req.params.id)
    res.send(getPostById)
  } catch(error) {
    res.status(400).send({message:error})
  }
})

// Update a post (verification required) (PUT)
router.put('/:id', verifyToken, async(req,res) => {
  // Validate user input
  const {error} = postValidation(req.body)
  if (error) {
    return res.status(400).send({message:error['details'][0]['message']})
  }

  // Get the post
  let currentPost  // NOTE: I wanted to do const, but it is block level and not accessible outside try-catch
  let postOwner
  try {
    currentPost = await Post.findById(req.params.id)
    postOwner = currentPost.createdBy
  } catch (error) {
    return res.status(400).send({message:error})
  }
  
  // Get the current user by Id
  const currUserId = req.user._id
  const userOwnsPost = (currUserId == postOwner)

  // Ensure current user owns post
  if (!userOwnsPost) {
    return res.status(401).send('Access denied.')
  }

  // Update the post with user given info
  try {
    currentPost.title = req.body.title
    currentPost.description = req.body.description
    currentPost.save()
    return res.send(currentPost)
  } catch (error) {
    return res.status(400).send({message:error})
  }
})

// Delete a post (verification required) (DELETE)
router.delete('/:id', verifyToken, async(req,res) => {
  // Get the post
  let currentPost  // NOTE: I wanted to do const, but it is block level and not accessible outside try-catch
  let postOwner
  try {
    currentPost = await Post.findById(req.params.id)
    postOwner = currentPost.createdBy
  } catch (error) {
    return res.status(400).send({message:error})
  }
  
  // Get the current user by Id
  const currUserId = req.user._id
  const userOwnsPost = (currUserId == postOwner)

  if (!userOwnsPost) {
    return res.status(401).send('Access denied.')
  }
  
  // Delete the post if owned by current user
  try {
    const deletePostById = await Post.deleteOne({_id:req.params.id})
    res.send(deletePostById)
  } catch(error) {
    res.send({message:error})
  }
})

// Like a post (verification required) (POST)
router.post('/:id/like', verifyToken, async(req,res) => {
  // In theory, a user should only be able to like a post once
  // That can be a project for another time though :)
  console.log('Hello')
  try {
    const updatePostById = await Post.updateOne(
      {_id:req.params.id},
      {$inc:{
        likes: 1
      }}
    )
    res.send(updatePostById)
  } catch(error) {
    console.log(error)
    res.status(400).send({message:error})
  }
})

module.exports = router