import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import DownloadAnswers from './DownloadAnswers';
import '../CSS/UserSurveySearch.css';

function UserSurveySearch() {
  const token = Cookies.get('token');
  const [search, setSearch] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSearchBar, setShowSearchBar] = useState(false);

  const fetchData = async (searchQuery) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get('http://localhost:8000/questionnaires', {
        params: {
          search: searchQuery
        },
        headers: {
          authorization: token
        }
      });
      setData(response.data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  const handleShowSurveys = () => {
    setShowSearchBar(true);
    fetchData(search);
  };

  const handleHideSurveys = () => {
    setShowSearchBar(false);
    setSearch('');
    setData([]);
    setLoading(false);
    setError(null);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    fetchData(search);
  };

  return (
    <div className="user-survey-search-container">
      {showSearchBar ? (
        <div className="search-bar-container">
          <form onSubmit={handleSearch}>
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} />
            <button type="submit">Search</button>
          </form>
          <button onClick={handleHideSurveys}>Hide Surveys</button>
        </div>
      ) : (
        <button onClick={handleShowSurveys}>Show Surveys</button>
      )}

      <div className="results-container">
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>Error: {error.message}</div>
        ) : (
          <ul className="survey-list">
            {data.map((item) => (
              <li key={item._id}>
                {item.title}
                <sup>{item.answers.length} Answers</sup>
                {item.answers.length > 0 ? (
                  <DownloadAnswers questionnaireId={item._id}></DownloadAnswers>
                ) : (
                  <></>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default UserSurveySearch;
