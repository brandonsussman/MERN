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
    const questionnaire = await Questionnaire.findOne({_id:req.query.questionnaireId});


    res.json(questionnaire);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/questionnaire', async (req, res) => {
  try {
   
    const { title, questions } = req.body;
console.log(title);
console.log(questions);
    const questionnaire = new Questionnaire({
      title:title,
      questions:questions
    });

    const newQuestionnaire = await questionnaire.save();
    res.status(201).json(newQuestionnaire);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

router.get('/questionnaires', async (req, res) => {
  try {
    const questionnaire = await Questionnaire.find({
      title: {
        $regex: req.query.search,
        $options: "i" // optional case-insensitive flag
      }
    },'title')


    res.json(questionnaire);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
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
