import React, {useEffect, useState} from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import './App.css';

// router import
import AppRoutes from './routes/AppRoutes';
import SplashScreen from './components/loading/SplashScreen';
import AppContent from './pages/AppContent';

// 글로벌 css
const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Pretendard';
    src: url('/fonts/PretendardVariable.woff2') format('woff2');
    font-weight: 1 1000;
    font-style: normal;
  }

  button, input {
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

  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    if('serviceWorker' in navigator){
      window.addEventListener('load', () =>{
        navigator.serviceWorker
          .register('/service-worker.js')
          .then((registration) => {
            console.log("Service Worker register", registration.scope);
            setLoading(false);
          })
          .catch((error) => {
            console.log("로딩 실패");
            setLoading(false);
          });
      });
    }else{
      setLoading(false);
    }
  }, []);

  return (
    <>
      <GlobalStyle />
      {loading ? <SplashScreen/> : <AppContent/>}
      <AppRoutes/>
    </>
  );
};

export default App;
