import React, {useEffect, useState} from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './App.css';

// router import
import AppRoutes from './routes/AppRoutes';
import SplashScreen from './components/loading/SplashScreen';
import Navbar from './components/navigation/Navbar';
import type { RootState } from './store';

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

const Div = styled.div`
  display : flex;
  flex-direction : column;
  padding-bottom : 56px;
`;

const App: React.FC = () => {

  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(true);

  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  useEffect(() => {
    const offPages = ["/login", "/signup", "/simple-password/set", "/simple-password/confirm"];
    if (offPages.includes(location.pathname)) {
      setIsActive(false);
    } else {
      setIsActive(true);
    }
  }, [location.pathname]);  // location.pathname이 변경될 때마다 실행

  useEffect(()=> {
      if(isAuthenticated){
          navigate('/login');
      }
  }, [])

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
    <Div>
      <GlobalStyle />
      <AppRoutes/>
      {isActive && <Navbar />}  {/* isActive가 true일 때만 Navbar 렌더링 */}
    </Div>
  );
};

export default App;
