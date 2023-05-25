
import React from 'react';
import { Link } from 'react-router-dom';
import Menu from './..//Menu.js';
import SearchBar from '../Components/Search';
function HomePage() {
  return (
    <div>
      <Menu></Menu>
      <h1>Welcome to My App</h1>
      <p>Please login or register to continue</p>
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