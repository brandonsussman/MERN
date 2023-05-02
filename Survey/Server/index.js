// Require necessary modules
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('./models/user');
const Questionnaire = require('./models/questionnaire');
const fs = require('fs');
const path = require('path');
const os = require('os');
const json2csv = require('json2csv').parse;
const cors = require("cors");
const app = express();
// Enable cross-origin requests
app.use(cors());
// Set up Express app

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up Mongoose
mongoose.connect('mongodb+srv://user:Ib7FxrfWpq6UjT9z@practice.0eesrlz.mongodb.net/surveyDB?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });
 

// Define endpoint


app.get('/export-answers', async (req, res, next) => {
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




app.get('/questionnaire', async (req, res) => {
  try {
    const questionnaire = await Questionnaire.findOne();
   

    res.json(questionnaire);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.post('/register', (req, res, next) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password)
  });
  user.save()
    .then((savedUser) => {
      res.send('Registration successful.');
    })
    .catch((error) => {
      next(error);
    });
});



app.get('/check-login', (req, res) => {
  const token = req.headers.authorization;
  if (!token) {
    res.status(401).json({ message: 'Authorization header missing' });
  } else {
    jwt.verify(token, 'my_secret_key', (err, decoded) => {
      if (err) {
        res.status(401).json({ message: 'Invalid token' });
      } else {
        res.status(200).json({ message: 'Token is valid', decoded: decoded });
      }
    });
  }
});

app.post('/login', (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        res.status(401).send('Invalid email or password.');
      }
      if (!bcrypt.compareSync(req.body.password, user.password)) {
        res.status(401).send('Invalid email or password.');
      }
      const token = jwt.sign({ userId: user._id }, 'my_secret_key');
      res.send({ token: token });
    })
    .catch((error) => {
      next(error);
    });
});

app.post('/surveys', (req, res, next) => {
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
            
         user.answer=answerArray;
           
            
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

app.get('/surveys', (req, res, next) => {
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


// Start server
app.listen(8000, () => {
  console.log('Server started on port 8000');
});