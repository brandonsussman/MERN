
import React from 'react';
import { Link } from 'react-router-dom';
import Menu from './..//Menu.js';
import SearchBar from '../Components/Search';
function HomePage() {
  return (
    <div>
      <Menu></Menu>
      <div>
      <div>
<SearchBar></SearchBar>
      </div>
      <Link to="/login"><button>Login</button></Link>
      <Link to="/register"><button>Register</button></Link>
      </div>
    </div>
  );
}

export default HomePage;