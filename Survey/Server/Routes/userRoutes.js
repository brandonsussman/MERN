const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res, next) => {
  try {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, 10)
    });

    const existingUser = await User.findOne({ email:req.body.email });
    if (existingUser) {
      return res.status(409).send('Email is already taken.');
    }else
    {
    await user.save();
    
    res.send('Registration successful.');
    }
  } catch (error) {
    next(error);
  }
});


router.get('/check-login', (req, res) => {
  
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


router.post('/login', (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        res.status(401).send('Invalid email or password');
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



module.exports = router;
