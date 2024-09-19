import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// router import
import Home from '../pages/home/HomePage';
import Board from '../pages/board/BoardPage';
import MyPage from '../pages/mypage/MyPage';
import Pay from '../pages/pay/PayPage';
import Travels from '../pages/travels/TravelsPage';


const AppRoutes: React.FC = () => (
    <Routes>
    <Route path="/" />
    <Route path="/home" element={<Home/>}/>
    <Route path="/feed" element={<Board/>}/>
    <Route path="/myPage" element={<MyPage/>} />
    <Route path="/pay" element={<Pay/>}/>
    <Route path="/travels" element={<Travels/>} />
    </Routes>
);

export default AppRoutes;
