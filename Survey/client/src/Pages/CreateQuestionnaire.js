import React, { useState } from 'react';

import axios from 'axios';
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

  const handleOptionChange = (index, optionIndex, e) => {
    const newQuestions = [...questions];
    newQuestions[index].options[optionIndex].text = e.target.value;
    setQuestions(newQuestions);
  };
  
  

  const handleAddQuestion = () => {
    const newQuestions = [...questions, { text: '', type: 'text', options: [] }];
    setQuestions(newQuestions);
  };

  const handleRemoveQuestion = (index) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

  const handleAddOption = (questionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.push({ text: ''});
    setQuestions(newQuestions);
  };

  const handleRemoveOption = (questionIndex, optionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.splice(optionIndex, 1);
    setQuestions(newQuestions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const questionnaire = { title, questions };
    const json = JSON.stringify(questionnaire);
    console.log(json);

    axios.post('http://localhost:8000/questionnaire', questionnaire)
    .then((response) => {
      console.log('Questionnaire created successfully:', response.data);
      // Perform any additional actions after creating the questionnaire
    })
    .catch((error) => {
      console.error('Failed to create questionnaire:', error);
      // Handle the error condition
    });

  };
  return (
    
        <div>
            <h2>{title}</h2>
    <form onSubmit={handleSubmit}>
      {questions.map((question, index) => (
        <div key={index}>
          <p>{question.text}</p>
          <select value={question.type} onChange={(e) => handleTypeChange(e, index)}>
            <option value="text">Text</option>
            <option value="date">Date</option>
            <option value="range">Range</option>
            <option value="radio">Radio</option>
            <option value="select">Select</option>
          </select>
          {question.type === 'text' && (
            <input type="text" name={index} value={question.text} onChange={(e) => handleQuestionChange(e, index)} />
          )}
          {question.type === 'date' && (
            <input type="text" name={index} value={question.text} onChange={(e) => handleQuestionChange(e, index)} />
          )}
          {question.type === 'range' && (
            <input
              type="text"
              name={index}
              min={question.min}
              max={question.max}
              step={question.step}
              value={question.text}
              onChange={(e) => handleQuestionChange(e, index)}
            />
          )}
          {question.type === 'radio' && (
            <div>
              {question.options.map((option, optionIndex) => (
                <label key={optionIndex}>
                  <input
                    type="text"
                    key={index}
                    value=""
                 
                    onChange={() => handleOptionChange(index, optionIndex)}
                  />
                  {option.text}
                </label>
              ))}
            </div>
          )}
          {question.type === 'select' && (
            <input type="text" name={index} onChange={(e) => handleQuestionChange(e, index)}>
           
            </input>
          )}
          <button type="button" onClick={() => handleRemoveQuestion(index)}>
            Remove Question
          </button>
          {question.type === 'radio' || question.type === 'select' ? (
            <button type="button" onClick={() => handleAddOption(index)}>
              Add Option
            </button>
          ) : null}
          {question.options.map((option, optionIndex) => (
            <div key={optionIndex}>
              {question.type === 'radio' && (
                <input type="text" onChange={(e) => handleOptionChange(index, optionIndex, e)} />
              )}
              {question.type === 'select' && (
                <input type="text"  onChange={(e) => handleOptionChange(index, optionIndex, e)} />
              )}
           
              <button type="button" onClick={() => handleRemoveOption(index, optionIndex)}>
                Remove Option
              </button>
            </div>
          ))}
        </div>
      ))}
            <button type="button" onClick={handleAddQuestion}>
              Add Question
            </button>
            <br />
            <label>
              Survey Title:
              <input type="text" value={title} onChange={handleTitleChange} />
            </label>
            <br />
            <button type="submit">Submit</button>
          </form>
        </div>
      );
      }
export default CreateQuestionnaire;
