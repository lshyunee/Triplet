import React, {useEffect, useState} from 'react';
import styled from 'styled-components';

import BackHeader from '../../components/header/BackHeader';
import useInput from '../../hooks/useInput';
import useAxios from '../../hooks/useAxios';
import { useNavigate } from 'react-router-dom';

import CompleteModal from '../../components/modal/CompleteModal';
import ErrorModal from '../../components/modal/ErrorModal';

const HowP = styled.p`
    font-size : 12px;
    margin : 0 0 4px;
    color : #888888;
`;

const ExplainP = styled.p`
    font-size : 10px;
    margin : 0 0 4px;
    color : #AAAAAA;
`;

const ExplainDiv = styled.div`
    display : flex;
    flex-direction: row;
`;

const StyledInput = styled.input`
    width : 100%;
    background-color : #F9FAFC;
    height:44px;
    border-radius : 10px;
    border : 1px solid #F0F0F0;
    box-sizing: border-box;
    text-indent : 10px
`;

const PasswordDiv = styled.div`
    margin : 0 16px 0;
    min-height : calc (100vh - 112px);
    padding : 56px 0;

`;

const CurrentDiv = styled.div`
margin-top: 100px;
`

const NewDiv = styled.div`
    margin-top : 60px;
`

const NewConfirmDiv = styled.div`   
    margin-top : 32px;
    margin-bottom : 145px;
`;

const ConfirmBtn = styled.button`
    width : 100%;
    height : 44px;
    background-color : #008DE7;
    color : #FFFFFF;
    border-radius : 10px;
    font-weight: 600;
    font-size : 14px;
    border : none;
    margin-bottom : 28px;
`;

const PasswordEditPage = () => {

    const navigate = useNavigate();

    const validPw = (value:string): boolean => {
        const regex = /^[a-zA-Z0-9!@#$%^&*()]*$/;
        return value.length <= 15 && regex.test(value);
    }

    const pw = useInput(validPw);
    const newPw = useInput(validPw);
    const newPwCheck = useInput(validPw);

    const { data: pwData, error: pwError, loading: pwLoading,
        status: pwStatus, refetch: pwRefetch
    } = useAxios('/user/password', 'PUT',{
        password : pw.value,
        newPassword : newPw.value,
        newPasswordConfirm : newPwCheck.value
    });

    const changePassword = () => {
       pwRefetch();
    }

    useEffect (() => {
        if(pwData !== null){
            setMsg("비밀번호 변경이 완료되었습니다.");
            isModalOpen();
            navigate(-1);
        }
        if(pwError !== null){
            const message = pwError.response.data.message || '올바르지 않은 비밀번호입니다.';
            setErrorMsg(message);
            isErrorOpen();
        }
    }, [pwData, pwError]);

    const [ isModel, setIsModel ] = useState(false);
    const [ msg, setMsg ] = useState('');

    const isModalOpen = () => {
        setIsModel(true);
    }

    const isModelClose = () => {
        setIsModel(false);
    }

    const [ isErrorModal, setIsErrorModal ] = useState(false);
    const [ errorMsg, setErrorMsg ] = useState('');

    const isErrorOpen = () => {
        setIsErrorModal(true);
    }

    const isErrorClose = () => {
        setIsErrorModal(false);
    }

    return (
        <>
            <BackHeader title="비밀번호 변경" />
            <PasswordDiv>
                <CurrentDiv>
                    <HowP>현재 비밀번호</HowP>
                    <StyledInput type="password" value={pw.value} onChange={pw.onChange} />
                </CurrentDiv>
                <NewDiv>
                    <ExplainDiv>
                        <HowP>새 비밀번호</HowP>
                        <ExplainP>(영문, 숫자, 특수문자 포함 8~15자)</ExplainP>
                    </ExplainDiv>
                    <StyledInput type="password" value={newPw.value} onChange={newPw.onChange} />
                    <NewConfirmDiv>
                        <HowP>새 비밀번호 확인</HowP>
                        <StyledInput type="password" value={newPwCheck.value} onChange={newPwCheck.onChange} />
                    </NewConfirmDiv>
                </NewDiv>
                <ConfirmBtn onClick={changePassword}>비밀번호 변경</ConfirmBtn>
            </PasswordDiv>
            <ErrorModal isOpen={isErrorModal} onClose={isErrorClose} msg={errorMsg}></ErrorModal>
            <CompleteModal isOpen={isModel} onClose={isModelClose} msg={msg}></CompleteModal>

        </>
    );
};

export default PasswordEditPage;