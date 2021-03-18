var mongoose = require('mongoose')
var Event = require('./event').schema
var userSchema = new mongoose.Schema({
  username : String,
  googleId: String,
  email : String,
  picture: String,
  evs: [Event],
    password: String,
  role : {type : String , default : 'Client'},
  isActive:{type:Boolean,default: false}

});

const User = mongoose.model('User',userSchema)
module.exports = User;
