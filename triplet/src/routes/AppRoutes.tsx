import React from 'react';
import { Routes, Route } from 'react-router-dom';

// router import
import Home from '../pages/home/HomePage';
import Board from '../pages/board/BoardPage';
import MyPage from '../pages/mypage/MyPage';
import Pay from '../pages/pay/PayPage';
import Travels from '../pages/travels/TravelsPage';
import Login from '../pages/user/login/LoginPage';
import Signup from '../pages/user/signup/SignupPage';
import AppContent from '../pages/AppContent';

const AppRoutes: React.FC = () => (
    <Routes>
    <Route path="/" element={<AppContent/>}/>
    <Route path="/login" element={<Login/>}/>
    <Route path="/signup" element={<Signup/>}/>
    <Route path="/home" element={<Home/>}/>
    <Route path="/feed" element={<Board/>}/>
    <Route path="/myPage" element={<MyPage/>} />
    <Route path="/pay" element={<Pay/>}/>
    <Route path="/travels" element={<Travels/>} />
    </Routes>
);

export default AppRoutes;
