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
  
  router.post('/surveys', (req, res, next) => {
    const survey = req.body.answer;
  
    const answerArray = Object.entries(survey).map(([key, value]) => ({
  
      answer: value.value,
      question: value.order
    }));
    answerArray.sort((a, b) => a.question - b.question);
  
    console.log('Client Token:', req.headers.authorization);
    jwt.verify(req.headers.authorization, 'my_secret_key', (error, decoded) => {
      if (error) {
        console.log('Token:', req.headers.authorization);
        console.log('Decoded Token:', decoded);
        console.log('Error:', error);
        res.status(401).send('Unauthorized.');
  
      } else {
        console.log('Decoded Token:', decoded);
        User.findById(decoded.userId)
          .then((user) => {
            if (!user) {
              res.status(404).send('User not found.');
            }
  
  
            else {
  
              user.answer = answerArray;
  
  
              console.log(user);
  
            }
  
            user.save()
              .then((savedUser) => {
                res.send('Survey completed successfully.');
              })
              .catch((error) => {
                next(error);
              });
          })
          .catch((error) => {
            next(error);
          });
      }
    });
  });
  
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
