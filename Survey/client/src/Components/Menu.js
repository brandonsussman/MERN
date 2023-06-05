import React, { useState, useEffect } from 'react';
import { NavLink, Redirect, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import '../CSS/Menu.css';

function Menu() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      // Make request to check-login endpoint to check if user is logged in
      fetch('http://localhost:8000/check-login', {
        headers: {
          Authorization: token
        }
      })
        .then(response => {
          if (response.ok) {
            setIsLoggedIn(true);
          } else {
            setIsLoggedIn(false);
          }
        })
        .catch(error => {
          console.error('Error checking login status:', error);
        });
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    if ( isLoggedIn!=null && isLoggedIn!==true &&( (location.pathname === '/createquestionnaire')||(location.pathname === '/user'))) {
    
      window.location.href = '/';
    }
  }, [isLoggedIn]);

  function handleLogout() {
    Cookies.remove('token');
    setIsLoggedIn(false);
  }
if(isLoggedIn!=null){
  return (
    <nav className="menu">
      <ul className="menu-list">
        <li>
          <NavLink exact to="/" className="menu-link">Home</NavLink>
        </li>
        {isLoggedIn ? (
          <div className="inner-container">
            <li>
              <NavLink to="/user" className="menu-link">Profile</NavLink>
            </li>
            <li>
              <NavLink to="/createQuestionnaire" className="menu-link">Create Questionnaire</NavLink>
            </li>
            <li>
              <div>
                <button onClick={handleLogout} className="menu-logout">Logout</button>
              </div>
            </li>
          </div>
        ) : (
          <li>
            <NavLink to="/login" className="menu-link">Login</NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
        }
}

export default Menu;
