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

    // Password validation regex pattern
  const passwordRegex = /^(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;

  if (!passwordRegex.test(password)) {
    alert('Password should be at least 8 characters long and contain at least one special character (!@#$%^&*)');
    return;
  }
    axios.post('http://localhost:8000/register', { name: name, email: email, password: password })
      .then((response) => {
        console.log(response.data);
        window.alert('Registration successful.');
        window.location.href = '/login';
      })
      .catch((error) => {
        console.error(error);
        if(error.response.status===409){
          window.alert("Please try a different email it seems an email with this account already exists");
        }
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
