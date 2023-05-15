
import { useState, useEffect } from "react";
import axios from 'axios';
const SearchBar= () => {
  const [data, setData] = useState(null);
  const [search, setSearch] = useState(null); 

  useEffect(() => {
    if (search !== null && search !== "") {
        axios.get('http://localhost:8000/questionnaires', {
            params: {
              search: search
            }
          })
          .then((response) => setData(response.data))
          
            .catch(error => {
              // Handle any errors
              console.error(error);
            });
    }
  }, [search]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSearch(event.target.elements.search.value);
  };

  return (
    <div>
    <h1>{search||"Hello"}</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="search"
          value={search|| ""}
          onChange={(event) => setSearch(event.target.value)}
        />
       
      </form>
      {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : null}
    </div>
  );
};

export default SearchBar;
