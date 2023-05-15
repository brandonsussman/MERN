import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

import axios from 'axios';

const SearchBar = () => {
  const [data, setData] = useState(null);
  const [search, setSearch] = useState(""); // Initialize search state as an empty string
  const navigate = useNavigate();
  useEffect(() => {
    if (search !== "") { // Check if search is not empty
      axios.get('http://localhost:8000/questionnaires', {
          params: {
            search: search
          }
        })
        .then((response) => setData(response.data))
        .catch(error => {
          console.error(error);
        });
    }
  }, [search]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSearch(event.target.elements.search.value);
  };

  const handleClick = (surveyId) => {

  
    navigate({
        pathname: `/questionnaire`,
        search: `?id=${surveyId}`
      });
  };

  return (
    <div>
      <h1>{search || "Hello"}</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </form>
      {data && data.length > 0 ? (
        <ul>
          {data.map((survey) => (
            <li key={survey._id} onClick={() => handleClick(survey._id)}>
              {survey.title}
            </li>
          ))}
        </ul>
      ) : (
        <p>No surveys found.</p>
      )}
    </div>
  );
};

export default SearchBar;
