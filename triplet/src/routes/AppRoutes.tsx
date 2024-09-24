import React from 'react';
import { Routes, Route } from 'react-router-dom';
import styled from 'styled-components';

// router import
import Home from '../pages/home/HomePage';
import Board from '../pages/board/BoardPage';
import MyPage from '../pages/mypage/MyPage';
import Pay from '../pages/pay/PayPage';
import Travels from '../pages/travels/TravelsPage';
import Login from '../pages/user/login/LoginPage';
import Signup from '../pages/user/signup/SignupPage';
import Alarm from '../pages/alarm/AlarmPage';
import MyInfoEditPage from '../pages/mypage/MyInfoEditPage';
import PasswordEditPage from '../pages/mypage/PasswordEditPage';
import SimplePasswordSetPage from '../pages/user/simplePassword/SimplePasswordSetPage';
import SimplePasswordConfirmPage from '../pages/user/simplePassword/SimplePasswordConfirmPage';
import SimplePasswordSetConfirmPage from '../pages/user/simplePassword/SimplePasswordSetConfirmPage';


const AppRoutes: React.FC = () => (
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/signup" element={<Signup/>}/>
            <Route path="/home" element={<Home/>}/>
            <Route path="/feed" element={<Board/>}/>
            <Route path="/mypage" element={<MyPage/>} />
            <Route path="/mypage/info-edit" element={<MyInfoEditPage/>} />
            <Route path="/mypage/password-edit" element={<PasswordEditPage/>} />
            <Route path="/simple-password/set" element={<SimplePasswordSetPage/>} />
            <Route path="/simple-password/confirm" element={<SimplePasswordConfirmPage/>}/>
            <Route path="/simple-password/setConfirm" element={<SimplePasswordSetConfirmPage/>}/>            
            <Route path="/pay" element={<Pay/>}/>
            <Route path="/travels" element={<Travels/>}/>
            <Route path="/alarm" element={<Alarm/>}/>
        </Routes>
);

export default AppRoutes;
