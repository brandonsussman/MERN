const mongoose = require('mongoose');


// Define user schema with surveys subdocument
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    
  }

});

// Define user model
const User = mongoose.model('User', userSchema,'users');

module.exports = User;