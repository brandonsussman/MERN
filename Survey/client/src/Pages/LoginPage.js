import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import '../CSS/LoginPage.css';
import Menu from '../Components/Menu.js';


function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault();
    axios.post('http://localhost:8000/login', { email: email, password: password })
      .then((response) => {
        const { token } = response.data;
        Cookies.set('token', token);
        console.log(token);
        console.log(Cookies.get('token'));
        navigate('/');
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
    <Menu></Menu>
    <div className="login-page">
    
      <h1 className="login-page__title">Login</h1>
      <form className="login-page__form" onSubmit={handleLogin}>
        <label>
          Email:
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
        <br />
        <label>
          Password:
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>
        <br />
        <button type="submit" className="login-page__button">Login</button>
      </form>

      <Link to="/register" className="login-page__register-link">
        <button className="login-page__register-button">Register</button>
      </Link>
    </div>
   </div>
  );
}

export default LoginPage;
