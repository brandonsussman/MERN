import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
const SearchBar = () => {
  const token = Cookies.get('token');
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    try {
      
      axios.get('http://localhost:8000/questionnairesAnswered', {
          params: {
            search: search
          }, headers:{
            authorization: token
          }
        })
        .then((response) => setData(response.data))

        .catch(error => {
          console.error(error);
        });
    }
    catch(error){
      
    }
  };

  const handleClick = (surveyId) => {
    navigate({
      pathname: `/questionnaire`,
      search: `?id=${surveyId}`
    });
  };

  return (
    <div>
      <h1>Browse Surveys Here</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      {data.length > 0 ? (
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
