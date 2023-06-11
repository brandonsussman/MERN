import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../CSS/SearchBar.css';

const SearchBar = () => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [creatorEmails, setCreatorEmails] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/questionnaires', {
          params: {
            search: search
          }
        });
        setData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [search]);

  useEffect(() => {
    const fetchCreatorEmails = async () => {
      const emails = await getCreatorEmails();
      setCreatorEmails(emails);
    };

    fetchCreatorEmails();
  }, [data]);

  const getCreatorEmails = async () => {
    const promises = data.map(async (survey) => {
      try {
        const response = await axios.get('http://localhost:8000/user-email', {
          params: {
            userId: survey.creator
          }
        });
        return response.data.email;
      } catch (error) {
        console.error(error);
        return "";
      }
    });

    const emails = await Promise.all(promises);
    return emails;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    try {
      axios.get('http://localhost:8000/questionnaires', {
        params: {
          search: search
        }
      })
      .then((response) => setData(response.data))
      .catch(error => {
        console.error(error);
      });
    } catch(error) {
      console.error(error);
    }
  };

  const handleClick = (surveyId) => {
    navigate({
      pathname: `/questionnaire`,
      search: `?id=${surveyId}`
    });
  };

  return (
    <div className="search-bar">
      <h1 className="search-bar__title">Browse Surveys Here</h1>
      <form className="search-bar__form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="search-bar__input"
        />
        <button type="submit" className="search-bar__button">Search</button>
      </form>
      <div className="search-bar__survey-container">
        {data.length > 0 ? (
          <ul className="search-bar__survey-list">
            {data.map((survey, index) => (
              <li
                key={survey._id}
                onClick={() => handleClick(survey._id)}
                className="search-bar__survey-item"
              >
                {survey.title} created by {creatorEmails[index]}
              </li>
            ))}
          </ul>
        ) : (
          <p className="search-bar__no-survey">No surveys found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
