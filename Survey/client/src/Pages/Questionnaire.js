import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import Menu from './..//Menu.js';
import '../CSS/Questionnaire.css'
const MyForm = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
 const [title,setTitle]=useState("");
  const [formData, setFormData] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [questionnaireId, setQuestionnaireId] = useState(searchParams.get('id'));
  useEffect(() => {
    console.log(questionnaireId);
    axios.get('http://localhost:8000/questionnaire',
    { params: { questionnaireId: questionnaireId }})
      .then((response) => {
        setQuestionnaireId(response.data._id);
         setTitle(response.data.title);
        const orderedQuestions = response.data.questions.map((question, index) => {
          return {
            ...question,
            order: index
          };
        });
        setQuestions(orderedQuestions);

        // Create an object with default values for each question
        const defaultValues = {};
        orderedQuestions.forEach((question) => {
          switch (question.type) {
            case 'text':
              defaultValues[question._id] = { value: " ", order: question.order };
              break;
            case 'date':

              defaultValues[question._id] = { value: new Date().toISOString().substr(0, 10), order: question.order };
              break;
            case 'range':
              defaultValues[question._id] = { value: question.min, order: question.order };
              break;
            case 'radio':
              defaultValues[question._id] = { value: question.options[0].value, order: question.order };
              break;
            case 'select':
              defaultValues[question._id] = { value: question.options[0].value, order: question.order };
              break;
            default:
              break;
          }
        });

        setFormData(defaultValues);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleChange = (event, order) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: { ...prevFormData[name], value: value ? value : null, order },
    }));
  };

  const handleSubmit = (event) => {
   
    event.preventDefault();
    const token = Cookies.get('token');

    const headers = {
      Authorization: token
    };

    axios.get('http://localhost:8000/answer', { params: { questionnaireId: questionnaireId }, headers: headers })
      .then((response) => {

        // Check if answers already exist in the database
     
        if (response.data) {
          // Ask user if they want to overwrite their current answers
          if (window.confirm('You already have existing answers. Do you want to overwrite them?')) {
            // If user confirms, submit new answers to database
            axios.post('http://localhost:8000/answer', {questionnaireId: questionnaireId, answer: formData }, { headers: headers })

              .catch((error) => {
                console.error("error", error);
              });
          } else {
            // If user cancels, do not submit new answers to database
            console.log('Survey submission cancelled.');
          }
        } else {
          // If no answers exist in the database, submit new answers
          axios.post('http://localhost:8000/answer', { answer: formData, questionnaireId: questionnaireId }, { headers: headers })
            .then((response) => {
              console.log(response.data);
            })
            .catch((error) => {
              console.error(error);
            });
        }
      })
      .catch((error) => {
        if (error.response.status === 401) {
          alert("please login to submit answers");
        } else {
          console.error(error);
        }
      });
  };



  return (
    <div>
            <Menu></Menu>
    <form className="survey-form" onSubmit={handleSubmit}>
      <h1 className="survey-title">{title}</h1>
  
      {questions.map((question) => {
        switch (question.type) {
          case 'text':
            return (
              <div key={question._id} className="form-group">
                <label htmlFor={question._id} className="question-label">{question.text}</label>
                <input type="text" name={question._id} className="text-input" onChange={(event) => handleChange(event, question.order)} />
              </div>
            );
          case 'date':
            return (
              <div key={question._id} className="form-group">
                <label htmlFor={question._id} className="question-label">{question.text}</label>
                <input type="date" name={question._id} className="date-input" onChange={(event) => handleChange(event, question.order)} />
              </div>
            );
          case 'range':
            return (
              <div key={question._id} className="form-group">
                <label htmlFor={question._id} className="question-label">{question.text}</label>
                <input type="range" name={question._id} min={question.min} max={question.max} step={question.step} className="range-input" onChange={(event) => handleChange(event, question.order)} />
              </div>
            );
          case 'radio':
            return (
              <div key={question._id} className="form-group">
                <p className="question-label">{question.text}</p>
                {question.options.map((option) => (
                  <div key={option.value} className="radio-option">
                    <label htmlFor={option.value} className="option-label">{option.text}</label>
                    <input type="radio" name={question._id} value={option.value} id={option.value} onChange={(event) => handleChange(event, question.order)} />
                  </div>
                ))}
              </div>
            );
          case 'select':
            return (
              <div key={question._id} className="form-group">
                <label htmlFor={question._id} className="question-label">{question.text}</label>
                <select name={question._id} className="select-input" onChange={(event) => handleChange(event, question.order)}>
                  {question.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.text}
                    </option>
                  ))}
                </select>
              </div>
            );
          default:
            return null;
        }
      })}
      <button type="submit" className="submit-button">Submit</button>
    </form>
    </div>
  );
  

};

export default MyForm;