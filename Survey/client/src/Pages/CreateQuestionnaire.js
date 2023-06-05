import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import '../CSS/CreateQuestionnaire.css';
import Menu from '../Components/Menu.js';
function CreateQuestionnaire() {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleTypeChange = (e, index) => {
    const newQuestions = [...questions];
    newQuestions[index].type = e.target.value;
    setQuestions(newQuestions);
  };

  const handleQuestionChange = (e, index) => {
    const newQuestions = [...questions];
    newQuestions[index].text = e.target.value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (questionIndex, optionIndex, e) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex].text = e.target.value;
    newQuestions[questionIndex].options[optionIndex].value = e.target.value;
    setQuestions(newQuestions);
  };
  const handleRangeOptionChange = (option, index, e) => {
    const newQuestions = [...questions];
    newQuestions[index][option] = e.target.value;
    setQuestions(newQuestions);
  };
  const handleAddQuestion = () => {
    const newQuestion = { text: '', type: 'text', options: [], order: questions.length};
    const newQuestions = [...questions, newQuestion];
    setQuestions(newQuestions);
  };

  const handleRemoveQuestion = (index) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    // Update the order of the remaining questions
    newQuestions.forEach((question, i) => {
      question.order = i + 1;
    });
    setQuestions(newQuestions);
  };

  const handleAddOption = (questionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.push({ text: '' });
    setQuestions(newQuestions);
  };

  const handleRemoveOption = (questionIndex, optionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.splice(optionIndex, 1);
    setQuestions(newQuestions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() === '' || questions.some((question) => question.text.trim() === '')) {
      window.alert('Please fill in all fields');
      return;
    }

    if (questions.length === 0) {
      window.alert('Please add at least one question');
      return;
    }
    const token = Cookies.get('token');

    const headers = {
      Authorization: token
    };
    const questionnaire = { title, questions };

    axios
      .post('http://localhost:8000/questionnaire', {questionnaire:questionnaire},{headers:headers})
      .then((response) => {
        window.alert('Questionnaire created successfully:', response.data);
        // Perform any additional actions after creating the questionnaire
      })
      .catch((error) => {

        console.log(questionnaire.questions);
        console.error('Failed to create questionnaire:', error);
        // Handle the error condition
      });
  };


  return (
    <div>
      <Menu></Menu>
      <h2>Create Your Survey Below</h2>
    <div className="create-questionnaire">
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="survey-title">Survey Title:</label>
          <input
            id="survey-title"
            type="text"
            value={title}
            onChange={handleTitleChange}
            className="form-control"
          />
        </div>
  
        {questions.map((question, index) => (
          <div key={index} className="question">
            <div className="question"></div>
            <div className="form-group">
            <label htmlFor={`type-${index}`}>Type:</label>
              <select
                id={`type-${index}`}
                value={question.type}
                onChange={(e) => handleTypeChange(e, index)}
                className="form-control"
              >
                <option value="text">Text</option>
                <option value="date">Date</option>
                <option value="range">Range</option>
                <option value="radio">Radio</option>
                <option value="select">Select</option>
              </select>
              <label htmlFor={`question-${index}`}>Question:</label>
              <input
                id={`question-${index}`}
                type="text"
                value={question.text}
                onChange={(e) => handleQuestionChange(e, index)}
                className="form-control"
              />
  
              <button
                type="button"
                onClick={() => handleRemoveQuestion(index)}
                className="btn btn-danger"
              >
                X
              </button>
              
            </div>
  
            
  
            {question.type === 'range' && (
              <div className="range-options">
                <div className="form-group">
                  <label htmlFor={`min-${index}`}>Min:</label>
                  <input
                    id={`min-${index}`}
                    type="text"
                    value={question.min}
                    onChange={(e) => handleRangeOptionChange('min', index, e)}
                    className="form-control"
                  />
                </div>
  
                <div className="form-group">
                  <label htmlFor={`max-${index}`}>Max:</label>
                  <input
                    id={`max-${index}`}
                    type="text"
                    value={question.max}
                    onChange={(e) => handleRangeOptionChange('max', index, e)}
                    className="form-control"
                  />
                </div>
  
                <div className="form-group">
                  <label htmlFor={`step-${index}`}>Step:</label>
                  <input
                    id={`step-${index}`}
                    type="text"
                    value={question.step}
                    onChange={(e) => handleRangeOptionChange('step', index, e)}
                    className="form-control"
                  />
                </div>
              </div>
            )}
  
            {(question.type === 'radio' || question.type === 'select') && (
              <div className="options">
                {question.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="option">
                    <div className="form-group">
                      <label htmlFor={`option-${index}-${optionIndex}`}>Option:</label>
                      <input
                        id={`option-${index}-${optionIndex}`}
                        type="text"
                        value={option.text}
                        onChange={(e) => handleOptionChange(index, optionIndex, e)}
                        className="form-control"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(index, optionIndex)}
                        className="btn btn-danger"
                      >
                       X
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleAddOption(index)}
                  className="btn btn-secondary"
                >
                  Add Option
                </button>
              </div>
            )}
          </div>
        ))}
  
        <button type="button" onClick={handleAddQuestion} className="btn btn-primary">
          Add Question
        </button>
  
        <button type="submit" className="btn btn-success">
          Submit
        </button>
      </form>
    </div>
    </div>

  );
  
  
  
      }
export default CreateQuestionnaire;
