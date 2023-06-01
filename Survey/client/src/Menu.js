import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import Cookies from 'js-cookie';

function Menu() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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

  function handleLogout() {
    Cookies.remove('token');
    setIsLoggedIn(false);
   
  }

  return (
    <nav>
      <ul>
        <li>
          <NavLink exact to="/">Home</NavLink>
        </li>
     
         
        {isLoggedIn ? (
          <div>
               <li>
             <NavLink to="/user">Profile</NavLink>
           </li>
           <li>
             <NavLink to="/createQuestionnaire">Create Questionnaire</NavLink>
           </li>
          <li>
            <button onClick={handleLogout}>Logout</button>
          </li>
          
           </div>
        ) : (
          <li>
            <NavLink to="/login">Login</NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Menu;
