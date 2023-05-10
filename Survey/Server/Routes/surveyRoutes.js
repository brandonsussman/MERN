const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const os = require('os');
const json2csv = require('json2csv').parse;
const cors = require('cors');
const Questionnaire = require('../models/questionnaire');
const User = require('../models/user');

const router = express.Router();

// Enable cross-origin requests
router.use(cors());

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get('/questionnaire', async (req, res) => {
  try {
    const questionnaire = await Questionnaire.findOne();


    res.json(questionnaire);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
  
 // Assuming you have already imported the necessary modules and models

 router.post('/surveys', async (req, res, next) => {
  try {
    console.log('Client Token:', req.headers.authorization);
    const decoded = jwt.verify(req.headers.authorization, 'my_secret_key');

    console.log('Decoded Token:', decoded);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).send('User not found.');
    }

    const survey = req.body.answer;
    const answerArray = Object.entries(survey).map(([key, value]) => ({
      answer: value.value,
      question: value.order
    }));
    answerArray.sort((a, b) => a.question - b.question);

    const questionnaire = await Questionnaire.findById(req.body.questionnaireId);
    if (!questionnaire) {
      return res.status(404).json({ message: 'Questionnaire not found.' });
    }

    const questionnaireId = questionnaire._id;
    const userId = decoded.userId;
    const answers = answerArray;

    const answerDocuments = answers.map((answer) => ({
      answer: answer.answer,
      question: answer.question,
    }));

    questionnaire.answers.push({ userId, answers: answerDocuments });
    await questionnaire.save();

    res.status(201).json({ message: 'Answers stored successfully.' });
  } catch (error) {
    console.error('Error storing answers:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Rest of the code remains the same

  
  
  router.get('/surveys', (req, res, next) => {
    const token = req.headers.authorization;
    jwt.verify(token, 'my_secret_key', (error, decoded) => {
      if (error) {
        console.log('Error:', error);
        res.status(401).send('Unauthorized.');
      } else {
        User.findById(decoded.userId)
          .then((user) => {
            if (!user) {
              res.status(404).send('User not found.');
            } else {
              res.json(user.answer);
            }
          })
          .catch((error) => {
            next(error);
          });
      }
    });
  });

  module.exports=router;
