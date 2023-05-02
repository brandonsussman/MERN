const mongoose = require('mongoose');

// Define survey schema
const surveySchema = new mongoose.Schema({

    
      answer:{ type: String,
        required: true},
      question:{type: Number,
        required: true}
    
    
  }
);

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
    
  },
  
  answer: 
  {type:[surveySchema]},

});

// Define user model
const User = mongoose.model('User', userSchema,'users');

module.exports = User;