const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['text', 'date', 'range', 'radio', 'select'],
    required: true
  },
  min: {
    type: Number,
    min: 0,
    validate: {
      validator: function() {
        return this.type === 'range';
      },
      message: 'min value only applicable to range type'
    }
  },
  max: {
    type: Number,
    min: 0,
    validate: {
      validator: function() {
        return this.type === 'range';
      },
      message: 'max value only applicable to range type'
    }
  },
  step: {
    type: Number,
    min: 1,
    validate: {
      validator: function() {
        return this.type === 'range';
      },
      message: 'step value only applicable to range type'
    }
  },
  options: [{
    text: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true
    }
  }],
  order: {
    type: Number,
    required: true
  }
});

const questionnaireSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  questions: [questionSchema]
});

const Questionnaire= mongoose.model('Questionnaire', questionnaireSchema,'questionnaire');

module.exports = Questionnaire;
