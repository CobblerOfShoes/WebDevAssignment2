const mongoose = require('mongoose')

const User = require('../models/User')

const PostSchema = mongoose.Schema({
  title: {
    type:String,
    required:true,
    min:1,
    max:100
  },
  description: {
    type:String,
    required:true,
    min:1,
    max:500
  },
  likes: {
    type:Number,
    default:0
  },
  createdBy: {
    type:mongoose.Schema.Types.ObjectId,
    ref:User,
    required:true   
  },
  createdAt: {
    type:Date,
    default:Date.now
  }
})

module.exports = mongoose.model('posts', PostSchema)