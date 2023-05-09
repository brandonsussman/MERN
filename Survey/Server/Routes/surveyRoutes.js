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


//searchSurvey