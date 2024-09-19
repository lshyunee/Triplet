import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import './App.css';

// router import
import AppRoutes from './routes/AppRoutes';
import Navbar from './components/navigation/Navbar';

// 글로벌 css
const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Pretendard';
    src: url('/fonts/PretendardVariable.woff2') format('woff2');
    font-weight: 1 1000;
    font-style: normal;
  }

  body {
    font-family : 'Pretendard', sans-serif;
  }
`;

const App: React.FC = () => {
  return (
    <Router>
      <GlobalStyle />
      <Navbar/>
      <AppRoutes/>
    </Router>
  );
};

export default App;
