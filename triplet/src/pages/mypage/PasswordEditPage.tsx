import React, {useEffect, useState} from 'react';
import styled from 'styled-components';

import BackHeader from '../../components/header/BackHeader';
import useInput from '../../hooks/useInput';
import useAxios from '../../hooks/useAxios';
import { useNavigate } from 'react-router-dom';

const HowP = styled.p`
    font-size : 12px;
    margin-left : 18px;
    margin-bottom : 3px;
    color : #888888;
`;

const ExplainP = styled.p`
    font-size : 10px;
    padding-top : 2px;
    margin-bottom : 3px;
    margin-left : 4px;
    color : #AAAAAA;
`;

const ExplainDiv = styled.div`
    display : flex;
    flex-direction: row;
`;

const StyledInput = styled.input`
    background-color : #F9FAFC;
    width:328px;
    height:44px;
    margin-bottom : 10px;
    border-radius : 10px;
    border : 1px solid #F0F0F0;
    box-sizing: border-box;
    padding : 10px;
    margin-right : 12px;
    margin-left : 16px;
`;

const CurrentDiv = styled.div`
    margin-top : 120px;
`

const NewDiv = styled.div`
    margin-top : 60px
`

const ConfirmDiv = styled.div`
    display : flex;
    width : 100%;
    align-items : center;
    margin-left : 16px;
`;

const ConfirmBox = styled.button`
    width : 328px;
    height : 44px;
    background-color : #008DE7;
    color : #FFFFFF;
    border-radius : 10px;
    font-weight: 600;
    font-size : 14px;
    border : none;
    margin-top : 120px;
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
    } = useAxios('/api/v1/user/password', 'PUT',{
        password : pw,
        newPassword : newPw,
        newPasswordConfirm : newPwCheck
    });

    const changePassword = () => {
        pwRefetch();
    }

    useEffect (() => {
        if(pwStatus === 200){
            navigate(-1);
        }
    }, [pwStatus]);

    return (
        <div>
            <BackHeader title={"비밀번호 변경"}/>
            <CurrentDiv>
                <HowP>현재 비밀번호</HowP>
                <StyledInput type="password" {...pw} />
            </CurrentDiv>
            <NewDiv>
                <ExplainDiv>
                    <HowP>새 비밀번호</HowP>
                    <ExplainP>(영문, 숫자, 특수문자 포함 8~15자)</ExplainP>
                </ExplainDiv>
                <StyledInput type="password" {...newPw}/>
                <HowP>새 비밀번호 확인</HowP>
                <StyledInput type="password" {...newPwCheck} />
            </NewDiv>
            <ConfirmDiv>  
                <ConfirmBox onClick={changePassword}>비밀번호 변경</ConfirmBox>
            </ConfirmDiv>
        </div>
    );
};

export default PasswordEditPage;