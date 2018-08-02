const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  handle: {
    type: String,
    required: true,
    max: 40
  },
  steamid: {
    type: String
  },
  interests: {
    type: [String],
    required: true
  },
  bio: {
    type: String
  },
  games: [{
    title: {
    type: String,
    required: true
  },
  platform: {
    type: String,
    required: true
  }
  }],
  anime: [],
  webseries: [],
  tvseries: [],
  manga: [],
  comics: [],
  books: [],
  sports: [],

});

module.exports = Profile = mongoose.model('profile', ProfileSchema);
