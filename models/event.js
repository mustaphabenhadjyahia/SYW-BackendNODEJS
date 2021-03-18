var mongoose = require('mongoose')
var User = require('./user')
var Product = require('./Product').schema
var eventSchema = new mongoose.Schema({
  title: String,
  location: String,
  description: String,
  startDate: Date,
  endDate: Date,
  user :{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User', default:null
  },
  outfit : [Product],
});

const Event = mongoose.model('Event',eventSchema)
module.exports = Event;
