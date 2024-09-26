import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginSuccess } from '../../../features/auth/authSlice';
import styled from 'styled-components';

import useAxios from '../../../hooks/useAxios';
import useInput from '../../../hooks/useInput';

import ErrorModal from '../../../components/modal/ErrorModal';
import CompleteModal from '../../../components/modal/CompleteModal';

const TitleP = styled.p`
    font-size : 32px;
    font-weight : 800;
    color : #008DE7;
    margin : 0px;
`

const TitleDiv = styled.div`
    margin-top : 125px;
    margin-bottom : 61px;
`

const BigDiv = styled.div`
    display:flex;
    justify-content : center;
    align-items : center;
    flex-direction: column;
`;

const StyledLink = styled(Link)`
    display : flex;
    justify-content : center;
    align-items : center;
    color: #888888; /* 링크 텍스트 색상 */
    &:hover {
        color: darkblue;
    }
    font-size : 14px;
`;

const LoginInput = styled.input`
    width:328px;
    height:44px;
    border-radius : 10px;
    background-color : #F9FAFC;
    border : 1px solid #F0F0F0;
    box-sizing: border-box;
    margin-bottom : 20px;
    padding : 14px;
`;

const LoginBtn = styled.button`
    width:328px;
    height:44px;
    color : white;
    background-color : #008DE7;
    border-radius : 10px;
    border : none;
    box-sizing: border-box;
    margin-bottom : 20px;
    padding : 14px;
`;

const NaverLoginBtn = styled.button`
    width:328px;
    height:44px;
    color : white;
    background-color : green;
    border-radius : 10px;
    border : none;
    box-sizing: border-box;
    margin-bottom : 20px;
    padding : 14px;
`;

const SignupDiv = styled.div`
    display: flex;
    flex-direction: row;
`;

const SignupP = styled.p`
    font-size : 14px;
    margin : 0px 4px;
`;

const LoginPage = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

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

    const formData = new FormData();
    formData.append('memberId', id.value);
    formData.append('password', pw.value);

    const { data: loginData, error: loginError, loading: loginLoading
        , status: loginStatus, refetch: loginRefetch } 
        = useAxios('/login', 'POST', formData);

    const { data: naverData, error: naverError, loading: naverLoading,
        status: naverStatus, refetch: naverRefetch }
        = useAxios('/oauth2/authorization/naver', 'POST');


    // 로그인 버튼 핸들러
    const handleLogin = () => {
        loginRefetch(); // 클릭 시 요청 재시도
    };
    
    useEffect(() => {
        
        if(loginData!==null){
            console.log(loginData);
            setCompleteMsg("로그인이 완료되었습니다.");
            isCompleteOpen();
        }

        if(loginError!==null){
            console.log(loginError);
            const message = loginError.response.data.message || "로그인이 불가능합니다."
            setErrorMsg(message);
            isErrorOpen();
        }

    }, [loginData, loginError]);

    // 네이버 로그인 버튼 핸들러
    const handleNaverLogin = () => {
        naverRefetch(); // 클릭 시 요청 재시도
    };

    // 로그인 상태 변경 시 처리
    useEffect(() => {
        if (loginStatus === 200) {
            dispatch(loginSuccess());
            navigate('/home');
        }
    }, [loginStatus, dispatch, navigate]);

    // 에러 모달
    const [ isError, setIsError ] = useState(false);
    const [ errorMsg, setErrorMsg ] = useState('');
    
    const isErrorOpen = () => {
        setIsError(true);
    }

    const closeError = () => {
        setIsError(false);
    }

    const [ isComplete, setIsComplete ] = useState(false);
    const [ completeMsg, setCompleteMsg ] = useState('');

    const isCompleteOpen = () => {
        setIsComplete(true);
    }

    const closeComplete = () => {
        setIsComplete(false);
    }

    return (
        <>
        <BigDiv>
            <TitleDiv>
                <TitleP>Triplet</TitleP>
            </TitleDiv>
            <LoginInput type="text" placeholder='아이디' {...id} />
            <LoginInput type="password" placeholder='비밀번호' {...pw} />
            <LoginBtn onClick={handleLogin}>로그인</LoginBtn>
            <NaverLoginBtn onClick={handleNaverLogin}>네이버 계정 로그인</NaverLoginBtn>
            <SignupDiv>
                <SignupP>아직 회원이 아니신가요?</SignupP>
                <StyledLink to="/signup">
                    <SignupP>회원가입</SignupP>
                </StyledLink>
            </SignupDiv>
            <ErrorModal isOpen={isError} onClose={closeError} msg={errorMsg}></ErrorModal>
            <CompleteModal isOpen={isComplete} onClose={closeComplete} msg={completeMsg}></CompleteModal>
        </BigDiv>
        </>
    );
};

export default LoginPage;