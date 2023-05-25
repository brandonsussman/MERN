import React from "react";
import UserSurveySearch from '../Components/UserSurveySearch';
import SurveysAnswered from '../Components/AnsweredSurveys.js';
import Search from '../Components/Search';

function User() {



    return(
        <div>
<UserSurveySearch></UserSurveySearch>
        <SurveysAnswered></SurveysAnswered>
   </div>
    );
}
export default User;