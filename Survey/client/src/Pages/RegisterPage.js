import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../CSS/LoginPage.css';
import Menu from '../Components/Menu.js';

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = (event) => {
    event.preventDefault();
    axios.post('http://localhost:8000/register', { name: name, email: email, password: password })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      <Menu></Menu>
      <div className="login-page">
        <h1 className="login-page__title">Registration</h1>
        <form className="login-page__form" onSubmit={handleRegister}>
          <label>
            Name:
            <input type="text" value={name} onChange={(event) => setName(event.target.value)} />
          </label>
          <br />
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
          <button type="submit" className="login-page__button">Register</button>
        </form>
        <Link to="/login" className="login-page__register-link">
          <button className="login-page__register-button">Login</button>
        </Link>
      </div>
    </div>
  );
}

export default RegisterPage;
