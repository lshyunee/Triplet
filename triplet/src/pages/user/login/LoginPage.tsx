import react, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginSuccess } from '../../../features/auth/authSlice';
import styled from 'styled-components';

import { login, naverLogin } from '../../../services/user/authService';

const BigDiv = styled.div`
    display:flex;
    justify-content : center;
    align-items : center;
    flex-direction: column;
`;

const LoginInput = styled.input`
    width:328px;
    height:44px;
    border-radius : 10px;
    border : 1px solid #F0F0F0;
    box-sizing: border-box;
    margin : 10px;
    padding : 10px;
`;

const LoginBtn = styled.button`
    width:328px;
    height:44px;
    color : white;
    background-color : #008DE7;
    border-radius : 10px;
    border : none;
    box-sizing: border-box;
    margin : 10px;
    padding : 10px;
`;

const NaverLoginBtn = styled.button`
    width:328px;
    height:44px;
    color : white;
    background-color : green;
    border-radius : 10px;
    border : none;
    box-sizing: border-box;
    margin : 10px;
    padding : 10px;
`;

const SignupDiv = styled.div`
    display: flex;
    flex-direction: row;
`;

const SignupP = styled.p`
    margin-left: 4px;
    margin-right: 4px;
    font-size : 14px;
`;

const LoginPage = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = () => {
        const user = {
            id : id.value,
            pw : pw.value,
        }
        
        const Login = async () => {
            const response = await login(user.id, user.pw);
            if(response===200){
                dispatch(loginSuccess());
                navigate('/home');
            }
        }

        Login();
    }

    const handleNaverLogin = () => {
        const Login = async () => {
            const response = await naverLogin();
            if(response===200){
                dispatch(loginSuccess());
                navigate('/home');
            }
        }

        Login();
    }

    const useInput = (validator:Function) => {

        const [ value, setValue ] = useState('');
        const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            const {
                target : { value }
            } = event;
            let willUpdate = true;
            // validator 실행
            if (typeof validator === "function") {
                willUpdate = validator(value);
            }

            // validator가 true일 때만 값 업데이트
            if (willUpdate) {
                setValue(value);
            }
        }

        return { value, onChange };
    }

    const validId = (value:string): boolean => {
        const regex = /^[a-zA-z0-9]*$/;
        return value.length <= 16 && regex.test(value);
    };

    const validPw = (value:string): boolean => {
    const regex = /^[a-zA-Z0-9!@#$%^&*()]*$/;
    return value.length <= 15 && regex.test(value);
    }

    const id = useInput(validId);
    const pw = useInput(validPw);

    return (
        <>
        <BigDiv>
            <div>
                <p>Triplet</p>
            </div>
            <LoginInput type="text" placeholder='아이디' {...id} />
            <LoginInput type="password" placeholder='비밀번호' {...pw} />
            <LoginBtn onClick={handleLogin}>로그인</LoginBtn>
            <NaverLoginBtn onClick={handleNaverLogin}>네이버 계정 로그인</NaverLoginBtn>
            <SignupDiv>
                <SignupP>아직 회원이 아니신가요?</SignupP>
                <SignupP>회원가입</SignupP>
            </SignupDiv>
        </BigDiv>
        </>
    );
};

export default LoginPage;