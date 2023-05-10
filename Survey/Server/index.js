// Require necessary modules
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('./models/user');
const Questionnaire = require('./models/questionnaire');
const fs = require('fs');
const path = require('path');
const userRouter = require('./routes/userRoutes');
const answerRouter = require('./routes/answerRoutes');
const surveyRouter = require('./routes/surveyRoutes');
const os = require('os');
const json2csv = require('json2csv').parse;
const cors = require("cors");
const app = express();
// Enable cross-origin requests
app.use(cors());
// Set up Express app

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(userRouter);
app.use(answerRouter);
app.use(surveyRouter);
// Set up Mongoose
mongoose.connect('mongodb+srv://user:Ib7FxrfWpq6UjT9z@practice.0eesrlz.mongodb.net/surveyDB?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });



// Start server
app.listen(8000, () => {
  console.log('Server started on port 8000');
});