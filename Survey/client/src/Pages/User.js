import React from "react";
import UserSurveySearch from '../Components/UserSurveySearch';
import SurveysAnswered from '../Components/AnsweredSurveys.js';
import Menu from '../Components/Menu.js';
import '../CSS/User.css';

function User() {
  return (
    <div>
        <Menu></Menu>
    <div className="user-container">
      <div className="column">
        <h3 className="header">Surveys Created</h3>
        <UserSurveySearch className="search-component" />
      </div>
      <div className="column">
        <h3 className="header">Surveys Answered</h3>
        <SurveysAnswered className="answered-surveys-component" />
      </div>
    </div>
    </div>
  );
}

export default User;
