
const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const os = require('os');
const json2csv = require('json2csv').parse;
const cors = require('cors');
const Questionnaire = require('../models/questionnaire');


const router = express.Router();


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