import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import BackHeader from '../../components/header/BackHeader';


const PageDiv = styled.div`
    background-color : #F3F4F6;
    width: 100%;
    height: 100vh;
`

const MyInfoDiv = styled.div`
    display : flex;
    flex-direction : column;
    width : 360px;
    height : 194px;
`;

const InfoDiv = styled.div`
    display : flex;
    flex-direction : row;
`;

const TitleP = styled.p`
    font-size : 16px;
    font-weight : 600;
    margin-left : 16px;
`;

const CategoryP = styled.p`
    font-size : 14px;
    font-weight : 500;
`;

const InfoP = styled.p`
    font-size : 14px;
    font-weight : 500;
    color : #666666;
`;

const MyPage = () => {

    const title = "마이페이지"

    return (
        <>
            <BackHeader title={title}/>
            <PageDiv>
                <MyInfoDiv>
                    <TitleP>내 정보</TitleP>
                </MyInfoDiv>
            </PageDiv>
        </>
    );
};

export default MyPage;