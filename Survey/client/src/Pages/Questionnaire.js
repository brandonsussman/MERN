import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

const MyForm = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
 
  const [formData, setFormData] = useState({});
  const [questions, setQuestions] = useState([]);
  const [questionnaireId, setQuestionnaireId] = useState(searchParams.get('id'));
  useEffect(() => {
    console.log(questionnaireId);
    axios.get('http://localhost:8000/questionnaire',
    { params: { questionnaireId: questionnaireId }})
      .then((response) => {
        setQuestionnaireId(response.data._id);
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
              defaultValues[question.id] = { value: " ", order: question.order };
              break;
            case 'date':

              defaultValues[question.id] = { value: new Date().toISOString().substr(0, 10), order: question.order };
              break;
            case 'range':
              defaultValues[question.id] = { value: question.min, order: question.order };
              break;
            case 'radio':
              defaultValues[question.id] = { value: question.options[0].value, order: question.order };
              break;
            case 'select':
              defaultValues[question.id] = { value: question.options[0].value, order: question.order };
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
        console.log(response.data);
        if (response.data) {
          // Ask user if they want to overwrite their current answers
          if (window.confirm('You already have existing answers. Do you want to overwrite them?')) {
            // If user confirms, submit new answers to database
            axios.post('http://localhost:8000/answer', { answer: formData }, { headers: headers })
              .then((response) => {
                console.log(response.data);
              })
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
    <form onSubmit={handleSubmit}>
      <h1>{questions.title}</h1>

      {questions.map((question) => {
        switch (question.type) {
          case 'text':
            return (
              <div key={question.id}>
                <label htmlFor={question.id}>{question.text}</label>
                <input type="text" name={question.id} onChange={(event) => handleChange(event, question.order)} />
              </div>
            );
          case 'date':
            return (
              <div key={question.id}>
                <label htmlFor={question.id}>{question.text}</label>
                <input type="date" name={question.id} onChange={(event) => handleChange(event, question.order)} />
              </div>
            );
          case 'range':
            return (
              <div key={question.id}>
                <label htmlFor={question.id}>{question.text}</label>
                <input type="range" name={question.id} min={question.min} max={question.max} step={question.step} onChange={(event) => handleChange(event, question.order)} />
              </div>
            );
          case 'radio':
            return (
              <div key={question.id}>
                <p>{question.text}</p>
                {question.options.map((option) => (
                  <div key={option.value}>
                    <label htmlFor={option.value}>{option.text}</label>
                    <input type="radio" name={question.id} value={option.value} id={option.value} onChange={(event) => handleChange(event, question.order)} />
                  </div>
                ))}
              </div>
            );
          case 'select':
            return (
              <div key={question.id}>
                <label htmlFor={question.id}>{question.text}</label>
                <select name={question.id} onChange={(event) => handleChange(event, question.order)}>
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
      <button type="submit">Submit</button>
    </form>
  );

};

export default MyForm;