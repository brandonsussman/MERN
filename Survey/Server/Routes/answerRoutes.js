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


router.post('/answer', async (req, res, next) => {
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

router.get('/answer', (req, res, next) => {
    const token = req.headers.authorization;
    jwt.verify(token, 'my_secret_key', (error, decoded) => {
      if (error) {
        console.log('Error:', error);
        res.status(401).send('Unauthorized');
      } else {
        User.findById(decoded.userId)
          .then((user) => {
            if (!user) {
              res.status(404).send('Error Finding User');
            } else {
              res.json(true);
            }
          })
          .catch((error) => {
            next(error);
          });
      }
    });
  });

router.get('/export-answers', async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
      res.status(401).json({ message: 'Authorization header missing' });
    } else {
      try {
        const decoded = await jwt.verify(token, 'my_secret_key');
        const user = await User.findById(decoded.userId);
        if (!user) {
          res.status(404).json({ message: 'User not found' });
        } else if (!user.answer || user.answer.length === 0) {
          res.status(404).json({ message: `${user.name} has no answers`});
        } else {
          const fields = ['question', 'answer'];
          const csvData = json2csv(user.answer, { fields });
          const filename = `${user.name}_answers.csv`;
          const filepath = path.join(os.tmpdir(), filename);
          fs.writeFileSync(filepath, csvData);
          res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
          res.set('Content-Type', 'text/csv');
          res.status(200).send(csvData);
          fs.unlinkSync(filepath);
        }
      } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
      }
    }
  });
  
module.exports =router;