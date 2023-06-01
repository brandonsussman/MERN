import { useState,useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';

const SearchBar = () => {
  const token = Cookies.get('token');
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    try {
      axios.get('http://localhost:8000/questionnairesAnswered', {
          params: {
            search: search
          },
          headers: {
            authorization: token
          }
        })
        .then((response) => {
          console.log(response);
          setData(response.data);
        })
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

  const handleToggleSearch = () => {
    setShowSearch(prevState => !prevState);
    setSearch("");
    setData([]);
  };

  useEffect(() => {
    if (showSearch) {
      handleSubmit({ preventDefault: () => {} });
    }
  }, [showSearch]);

  return (
    <div>
      {showSearch ? (
        <div>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <button type="submit">Search</button>
          </form>
          <button onClick={handleToggleSearch}>Hide</button>
        </div>
      ) : (
        <button onClick={handleToggleSearch}>Show Surveys</button>
      )}

      {data.length > 0 && (
        <ul>
          {data.map((survey) => (
            <li key={survey._id} onClick={() => handleClick(survey._id)}>
              {survey.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
