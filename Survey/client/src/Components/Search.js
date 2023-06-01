import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../CSS/SearchBar.css';

const SearchBar = () => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const navigate = useNavigate();

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
      // Handle error
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
            {data.map((survey) => (
              <li
                key={survey._id}
                onClick={() => handleClick(survey._id)}
                className="search-bar__survey-item"
              >
                {survey.title}
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
