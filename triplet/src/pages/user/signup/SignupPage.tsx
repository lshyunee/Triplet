import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../../components/header/Header';
import styled from 'styled-components';

const StyledInput = styled.input`
    background-color : #F9FAFC;
    width:328px;
    height:44px;
    border-radius : 10px;
    border : 1px solid #F0F0F0;
    box-sizing: border-box;
    padding : 10px;
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

const PhoneDiv = styled.div`
    display : flex;
    flex-direction: row;
`

const SignupPage = () => {

    const title = '회원가입';

    return(
        <div>
            <Header title={title}/>
            <CheckDiv>
                <StyledInput type="text" />
                <StyledBtn>중복확인</StyledBtn>
            </CheckDiv>
            <StyledInput type="text" />
            <StyledInput type="text" />
            <StyledInput type="text" />
            <StyledInput type="text" />
            <StyledInput type="text" />
            <PhoneDiv>
                <StyledInput type="text" />
                <StyledInput type="text" />
                <StyledInput type="text" />
            </PhoneDiv>
            <CheckDiv>
                <StyledInput type="text" />
                <StyledBtn>확인</StyledBtn>
            </CheckDiv>
        </div>
    )
}

export default SignupPage;