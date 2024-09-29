import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import useAxios from '../../hooks/useAxios';
import { useSelector, useDispatch } from 'react-redux';

import SampleImg from '../../assets/travelSampleImg/sampleImg.png';
import ErrorModal from '../modal/ErrorModal';

const PositionDiv = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;

const CardDiv = styled.div`
    width: 100%;
    height: 227px;
    border-radius: 20px;
    position: relative;
    overflow: hidden;
`;

const TravelImg = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;

const Overlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5); /* 반투명한 검정 오버레이 */
    z-index: 1;
`;

const BottomOverlay = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 70px;
    background-color: rgba(0, 0, 0, 0.5); /* 하단 반투명 오버레이 */
    backdrop-filter: blur(3px); /* 블러 처리 추가 */
    z-index: 1;
`;

const TitleP = styled.p`
    position: absolute;
    bottom: 105px; 
    left: 20px;
    z-index: 2;
    font-weight: 700;
    font-size: 20px;
    color: white;
`;

const InfoP = styled.p`
    position: absolute;
    bottom: 70px; /* TitleP 아래에 위치 */
    left: 20px;
    z-index: 2;
    font-size: 14px;
    color: #D9D9D9;
`;

// const Badge = styled.div`
//     position: absolute;
//     top: 20px;
//     right: 20px;
//     width : 70px;
//     height : 30px;
//     z-index: 2;
//     background-color: rgba(0, 0, 0, 0.5);
//     border-radius: 50px;
//     border : 1px solid white;
//     font-size: 12px;
//     font-weight: 500;
//     color : white;
//     display: flex; /* Flexbox 사용 */
//     justify-content: center; /* 수평 중앙 정렬 */
//     align-items: center; /* 수직 중앙 정렬 */
// `;

const ProgressContainer = styled.div`
    position: absolute;
    bottom: 20px; /* 진행률 바를 위로 올려 텍스트 위에 맞춤 */
    left: 20px;
    right: 20px;
    height : 12px;
    background-color: rgba(255, 255, 255, 0.5);
    z-index: 2;
    border-radius: 50px;
    overflow: hidden;
`;

const ProgressBar = styled.div`
    width: 30%; /* 30% 진행률 */
    height: 100%;
    border-radius: 50px;
    background-color: white;
`;

const ProgressText = styled.div`
    position: absolute;
    bottom: 38px; /* 진행률 바 바로 위에 위치 */
    left: 20px;
    z-index: 2;
    color: white;
    font-size: 16px;
    font-weight: 700;
`;

const PriceInfo = styled.div`
    position: absolute;
    bottom: 25px; /* 하단에 딱 붙지 않도록 여백 추가 */
    right: 20px;  /* 왼쪽으로 이동해서 정렬 */
    z-index: 2;
    color: white;
    font-size: 14px;
    font-weight: 600;
    display: flex; /* Flexbox 사용 */
    flex-direction: row; /* 자식 요소를 가로로 배치 */
    align-items: center; /* 자식 요소를 수직으로 가운데 정렬 */
`;

const PriceInfoP = styled.p`
    font-weight : 400;
`;

const UpcomingTravelHomeCard = () => {

    const dispatch = useDispatch();
    const travelData = useSelector((state:any) => state.ongoingTravel);

    return (
        <PositionDiv>
            <CardDiv>
                <TravelImg src={SampleImg} alt="Travel" />
                <Overlay />
                <BottomOverlay /> {/* 하단 반투명 오버레이 추가 */}
                <TitleP>고래상어보러가자</TitleP>
                <InfoP>2024년 9월 3일 ~ 9월 7일<br />일본 · 2명</InfoP>
                <ProgressText>30%</ProgressText> {/* 진행률 텍스트 추가 */}
                <ProgressContainer>
                    <ProgressBar />
                </ProgressContainer>
                <PriceInfo>600,000 <PriceInfoP>/ 2,000,000원</PriceInfoP></PriceInfo>
            </CardDiv>
        </PositionDiv>
    );
};

export default UpcomingTravelHomeCard;
