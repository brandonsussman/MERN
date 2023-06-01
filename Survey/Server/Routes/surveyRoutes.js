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

router.use(cors());

router.use(express.json());
router.use(express.urlencoded({ extended: true }));



const verifyTokenReturnUser = async (token) => {
  try {
    const decoded = jwt.verify(token, 'my_secret_key');
    const user = await User.findById(decoded.userId);
    if (!user) {
      return Promise.reject(new Error('User not found.'));
    }
    return user;
  } catch (error) {
    return Promise.reject(error);
  }
};

const searchQuestionnaires = async ({search, creator,answeredBy}={}) => {
  try {
    query = {};

    if(search){

    query.title={ $regex: search, $options: "i" };
  

    }
    if (creator) {
      query.creator = creator;
      console.log(query);
    }
    if(answeredBy){
    

      query["answers.userId"] = answeredBy;

    }
    

    const questionnaires = await Questionnaire.find(query);
    

    return questionnaires;
  } catch (err) {
    
    throw new Error(err.message);
  }
};
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
    const token = req.headers.authorization;
    const user = await verifyTokenReturnUser(token);
     
    const { title, questions } = req.body.questionnaire;
    const questionnaire = new Questionnaire({
      creator: user._id,
      title: title,
      questions: questions
    });

    const newQuestionnaire = await questionnaire.save();
    res.status(201).json(newQuestionnaire);
  } catch (error) {
   
   console.log(error);
    res.status(401).send('Unauthorized.');
  }
});


router.get('/questionnaires', async (req, res) => {
  try {
    
    if (req.headers.authorization) {
      const token = req.headers.authorization;
      
      const user = await verifyTokenReturnUser(token);
     
      res.json(await searchQuestionnaires({search:req.query.search,creator:user._id}));
    } else {
      res.json(await searchQuestionnaires({search:req.query.search}));
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log(err);
  }
});
  

router.get('/questionnairesAnswered', async (req, res) => {
  try {
    
    if (req.headers.authorization) {
      
      const token = req.headers.authorization;
      const user = await verifyTokenReturnUser(token);
      const search = req.query.search;
       console.log(user._id);
      
      res.json(await searchQuestionnaires({search:search,answeredBy:user._id}));
    } 
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log(err);
  }
});


  module.exports=router;
