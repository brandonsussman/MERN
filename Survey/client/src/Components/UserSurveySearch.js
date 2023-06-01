import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import DownloadAnswers from './DownloadAnswers';

function UserSurveySearch() {
  const [search, setSearch] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const token = Cookies.get('token');

  const useFetchData = (url) => {
    const fetchData = async (search) => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(url, {
          params: {
            search: search
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

    return { fetchData, loading, error };
  };

  const { fetchData } = useFetchData('http://localhost:8000/questionnaires');

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

  return (
    <div>
      {showSearchBar ? (
        <div>
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} />
          <button onClick={() => fetchData(search)}>Search</button>
          <button onClick={handleHideSurveys}>Hide Surveys</button>
        </div>
      ) : (
        <button onClick={handleShowSurveys}>Show Surveys</button>
      )}

      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error.message}</div>
      ) : (
        <ul>
          {data.map((item) => (
            <li key={item._id}>
              {item.title}
              <DownloadAnswers questionnaireId={item._id}></DownloadAnswers>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default UserSurveySearch;
