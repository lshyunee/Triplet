import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BackHeader from '../../../components/header/BackHeader';
import styled from 'styled-components';

const HowP = styled.p`
    font-size : 12px;
    margin-bottom : 3px;
    color : #888888;
`;

const NumP = styled.p`
    font-size : 14px;
    color : #424242;
    margin-right : 12px;
`;

const InputDiv = styled.div`
    display: flex;
    flex-direction: column;
    padding: 20px;
    margin-top:20px;
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
`;

const StyledInputFront = styled.input`
    background-color : #F9FAFC;
    border-radius : 10px;
    margin-bottom : 10px;
    border : 1px solid #F0F0F0;
    box-sizing: border-box;
    margin-right : 12px;
    padding : 10px;
    height : 44px;
`;

const CheckDiv = styled.div`
    display: flex;
    flex-direction: row;

    ${StyledInput} {
        width:246px;
    }
`;

const StyledBtn = styled.button`
    width:74px;
    height:44px;
    border-radius : 10px;
    background-color : white;
    color : #008DE7;
    border : 1px solid #008DE7;
`;

const RegistDiv = styled.div`
    display : flex;
    flex-direction: row;

    ${StyledInputFront}{
        width : 80px;
    }

    ${StyledInput}{
        width : 36px;
    }

`;

const PhoneDiv = styled.div`
    display : flex;
    flex-direction: row;
    
    ${StyledInput}{
        width : 61px;
        margin-right: 8px;
    }

    ${StyledInputFront}{
        width : 52px;
        margin-right: 8px;
    }

    ${StyledBtn}{
        width : 100px;
        font-size : 12px;
    }

    ${NumP}{
        margin-right: 8px;
    }
`

const ConfirmBox = styled.button`
    width : 328px;
    height : 44px;
    background-color : #008DE7;
    color : #FFFFFF;
    border-radius : 10px;
    border : none;
    margin-top : 60px;
`;

const SignupPage = () => {

    const title = '회원가입';

    return(
        <div>
            <BackHeader title={title}/>
            <InputDiv>
                <HowP>아이디</HowP>
                <CheckDiv>
                    <StyledInput type="text" />
                    <StyledBtn>중복확인</StyledBtn>
                </CheckDiv>
                <HowP>비밀번호</HowP>
                <StyledInput type="text" />
                <HowP>비밀번호 확인</HowP>
                <StyledInput type="text" />
                <HowP>이름</HowP>
                <StyledInput type="text" />
                <HowP>주민등록번호</HowP>
                <RegistDiv>
                    <StyledInputFront type="text" />
                    <NumP>-</NumP>
                    <StyledInput type="text" />
                    <NumP>* * * * * *</NumP>
                </RegistDiv>
                <HowP>전화번호</HowP>
                <PhoneDiv>
                    <StyledInputFront type="text" />
                    <NumP>-</NumP>
                    <StyledInput type="text" />
                    <NumP>-</NumP>
                    <StyledInput type="text" />
                    <StyledBtn>인증번호 발송</StyledBtn>
                </PhoneDiv>
                <HowP>인증번호</HowP>
                <CheckDiv>
                    <StyledInput type="text" />
                    <StyledBtn>확인</StyledBtn>
                </CheckDiv>
                <ConfirmBox>회원가입</ConfirmBox>
            </InputDiv>
        </div>
    )
}

export default SignupPage;