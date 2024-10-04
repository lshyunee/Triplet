import React from 'react';
import { Routes, Route } from 'react-router-dom';
import styled from 'styled-components';

// router import
import Home from '../pages/home/HomePage';
import FeedPage from '../pages/feed/FeedPage';
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
import AccountDetailPage from '../pages/pay/AccountDetailPage';
import GlobalWalletPage from '../pages/pay/GlobalWalletPage';
import ExchangePage from '../pages/pay/ExchangePage';
import QRPage from '../pages/pay/QRPage';
import QRPayPage from '../pages/pay/QRPayPage';
import QRCompletePage from '../pages/pay/QRCompletePage';
import CreateTravelPage from '../pages/travels/CreateTravelPage';
import UpcomingTravelDetailPage from '../pages/travels/UpcomingTravelDetailPage';
import OngoingTravelDetailPage from '../pages/travels/OngoingTravelDetailPage';
import CompletedTravelDetailPage from '../pages/travels/CompletedTravelDetailPage';
import MyInfoSetPage from '../pages/mypage/MyInfoSetPage';
import FeedDetailPage from '../pages/feed/FeedDetailPage';

const AppRoutes: React.FC = () => (
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/signup" element={<Signup/>}/>
            <Route path="/mypage" element={<MyPage/>} />
            <Route path="/mypage/info-set" element={<MyInfoSetPage/>}/>
            <Route path="/mypage/info-edit" element={<MyInfoEditPage/>} />
            <Route path="/mypage/password-edit" element={<PasswordEditPage/>} />
            <Route path="/simple-password/set" element={<SimplePasswordSetPage/>} />
            <Route path="/simple-password/confirm" element={<SimplePasswordConfirmPage/>}/>
            <Route path="/simple-password/setConfirm" element={<SimplePasswordSetConfirmPage/>}/>            
            <Route path="/pay" element={<Pay/>}/>
            <Route path="/pay/qr" element={<QRPage/>}/>
            <Route path="/pay/qr/payment" element={<QRPayPage/>}/>
            <Route path="/pay/qr/complete" element={<QRCompletePage/>}/>
            <Route path="/pay/account-detail" element={<AccountDetailPage/>}/>
            <Route path="/pay/global-wallet" element={<GlobalWalletPage/>}/>
            <Route path="/pay/exchange" element={<ExchangePage/>}/>
            <Route path="/travels" element={<Travels/>}/>
            <Route path="/travels/create" element={<CreateTravelPage/>}/>
            <Route path="/travels/ongoing/detail" element={<OngoingTravelDetailPage/>}/>
            <Route path="/travels/upcoming/:id/detail" element={<UpcomingTravelDetailPage/>}/>
            <Route path="/travels/completed/:id/detail" element={<CompletedTravelDetailPage/>}/>
            <Route path="/feed" element={<FeedPage/>}/>
            <Route path="/feed/:id/detail" element={<FeedDetailPage/>}/>
            <Route path="/alarm" element={<Alarm/>}/>
        </Routes>
);

export default AppRoutes;
