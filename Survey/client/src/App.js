import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import LoginPage from './Pages/LoginPage';
import RegisterPage from './Pages/RegisterPage';
import Questionnaire from './Pages/Questionnaire';
import DownloadAnswers from './Pages/DownloadAnswers';
import CreateQuestionnaire from './Pages/CreateQuestionnaire';
import Menu from './Menu';

function App() {
  return (
    <BrowserRouter>
     
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/createquestionnaire" element={<CreateQuestionnaire />} />
        <Route path="/questionnaire" element={<Questionnaire />} />
        <Route path="/DownloadAnswers" element={<DownloadAnswers/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
