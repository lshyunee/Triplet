import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginSuccess } from '../../../features/auth/authSlice';
import styled from 'styled-components';

import useAxios from '../../../hooks/useAxios';
import useInput from '../../../hooks/useInput';

import ErrorModal from '../../../components/modal/ErrorModal';
import CompleteModal from '../../../components/modal/CompleteModal';

import { requestNotificationPermission } from '../../../firebaseNotification/firebase';
const TitleP = styled.p`
    font-size : 32px;
    font-weight : 800;
    color : #008DE7;
    margin : 0px;
`;

const TitleDiv = styled.div`
    margin-top : 125px;
    margin-bottom : 61px;
`;

const BigDiv = styled.div`
    padding : 0 16px;
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

const LoginForm = styled.form`
    width: 100%;
`;

const LoginInput = styled.input`
    width:100%;
    height:44px;
    border-radius : 10px;
    background-color : #F9FAFC;
    border : 1px solid #F0F0F0;
    box-sizing: border-box;
    margin-bottom : 20px;
    padding : 14px;
`;

const LoginBtn = styled.button`
    width:100%;
    height:44px;
    color : white;
    background-color : #008DE7;
    border-radius : 10px;
    border : none;
    box-sizing: border-box;
    margin-bottom : 20px;
    padding : 14px;
`;

const KakaoLoginBtn = styled.button`
    width:100%;
    height:44px;
    color : black;
    background-color : #FBE44E;
    border-radius : 10px;
    border : 1px solid #E6E6EA;
    box-sizing: border-box;
    margin-bottom : 20px;
    padding : 14px;
    display : flex;
    justify-content : center;
    align-items : center;
    font-size : 14px;
    font-weight : 600;
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

    const validId = (value: string): boolean => {
        const regex = /^[a-zA-Z0-9]*$/;
        return value.length <= 16 && regex.test(value);
    };

    const validPw = (value: string): boolean => {
        const regex = /^[a-zA-Z0-9!@#$%^&*()]*$/;
        return value.length <= 15 && regex.test(value);
    };

    const id = useInput(validId);
    const pw = useInput(validPw);

    const formData = new FormData();
    formData.append('memberId', id.value);
    formData.append('password', pw.value);

    const { data: loginData, error: loginError, loading: loginLoading, 
        status: loginStatus, refetch: loginRefetch } = useAxios('/login', 'POST', undefined, formData);

    // 로그인 핸들러
    const handleLogin = (e: any) => {
        e.preventDefault(); // 폼 기본 동작 방지
        if (!isError && !isComplete) {
            loginRefetch(); // 클릭 시 요청 재시도
            // 로그인 버튼에서 포커스 제거
            if (loginBtnRef.current) {
                loginBtnRef.current.blur(); // 포커스 제거
            }
        }
    };
    
    useEffect(() => {
        if (loginData !== null) {
            setCompleteMsg("로그인이 완료되었습니다.");
            isCompleteOpen();
        }

        if (loginError !== null) {
            const message = loginError.response?.data?.message || "로그인이 불가능합니다.";
            setErrorMsg(message);
            isErrorOpen();
        }
    }, [loginData, loginError]);

    // 카카오 로그인 버튼 핸들러
    const handleKakaoLogin = () => {
        window.location.href = 'https://j11b202.p.ssafy.io/api/v1/oauth2/authorization/kakao';
    };

    // 로그인 상태 변경 시 처리
    useEffect(() => {
        if (loginStatus === 200) {
            
            dispatch(loginSuccess());
            requestNotificationPermission();
            navigate('/');

        }
    }, [loginStatus, dispatch, navigate]);

    // 에러 모달
    const [isError, setIsError] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const isErrorOpen = () => setIsError(true);
    const closeError = () => {
        setIsError(false);
        preventEnterKeyAfterModalClose();
    };

    const [isComplete, setIsComplete] = useState(false);
    const [completeMsg, setCompleteMsg] = useState('');

    const isCompleteOpen = () => setIsComplete(true);
    const closeComplete = () => {
        setIsComplete(false);
        preventEnterKeyAfterModalClose();
    };

    // 상태 관리 변수
    const [enterPressed, setEnterPressed] = useState(false); // Enter 키가 눌린 상태를 추적

    // 버튼에 대한 참조 추가
    const loginBtnRef = useRef<HTMLButtonElement>(null);

    // 모달이 닫힐 때 Enter 키 입력을 방지하는 함수
    const preventEnterKeyAfterModalClose = () => {
        // 모달 닫힌 후 300ms 동안 Enter 키 이벤트 방지
        setTimeout(() => {
            setEnterPressed(false); // Enter 키 상태 초기화
        }, 300);  // 300ms 후에 Enter 키 입력을 다시 허용
    };

    // 모달이 열릴 때 포커스 제거
    useEffect(() => {
        if (isError || isComplete) {
            const inputElements = document.querySelectorAll('input');
            inputElements.forEach(input => input.blur()); // 모든 input 필드에서 포커스 제거
        }
    }, [isError, isComplete]);

    // 모달이 열려 있을 때 Enter 키 입력 막기
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Enter' && (isError || isComplete)) {
                event.preventDefault(); // 모달이 열려 있을 때 Enter 키 입력을 막음
                setEnterPressed(true);  // Enter 키가 눌렸음을 기록
                // 포커스를 다른 곳으로 옮김
                if (document.activeElement instanceof HTMLElement) {
                    document.activeElement.blur(); // 현재 포커스된 요소에서 포커스 제거
                }
            }
        };

        // 모달이 열려 있을 때만 이벤트 리스너 추가
        if (isError || isComplete) {
            window.addEventListener('keydown', handleKeyDown);
        } else {
            window.removeEventListener('keydown', handleKeyDown);
        }

        // cleanup 함수로 이벤트 리스너 제거
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isError, isComplete]);

    return (
        <BigDiv>
            <TitleDiv>
                <TitleP>Triplet</TitleP>
            </TitleDiv>
            <LoginForm onSubmit={handleLogin}>
                <LoginInput type="text" placeholder="아이디" value={id.value} onChange={id.onChange} />
                <LoginInput type="password" placeholder="비밀번호" value={pw.value} onChange={pw.onChange} />
                <LoginBtn ref={loginBtnRef} type="submit" disabled={enterPressed}>로그인</LoginBtn>
            </LoginForm>
            <KakaoLoginBtn onClick={handleKakaoLogin}>
                카카오 로그인
            </KakaoLoginBtn>
            <SignupDiv>
                <SignupP>아직 회원이 아니신가요?</SignupP>
                <StyledLink to="/signup">
                    <SignupP>회원가입</SignupP>
                </StyledLink>
            </SignupDiv>
            <ErrorModal isOpen={isError} onClose={closeError} msg={errorMsg}></ErrorModal>
            <CompleteModal isOpen={isComplete} onClose={closeComplete} msg={completeMsg}></CompleteModal>
        </BigDiv>
    );
};
export default LoginPage;
