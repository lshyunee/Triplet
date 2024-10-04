import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import useAxios from '../../hooks/useAxios';

import SampleImg from '../../assets/travelSampleImg/sampleImg.png';

const PositionDiv = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    background-color : white;
    border-radius : 20px;
`;

const CardDiv = styled.div`
    width: 100%;
    height: 169px;
    border-radius: 20px;
    position: relative;
    overflow: hidden;
`;

const TitleP = styled.p`
    position: absolute;
    bottom: 105px; 
    left: 20px;
    z-index: 2;
    font-weight: 700;
    font-size: 20px;
    color: black;
`;

const InfoP = styled.p`
    position: absolute;
    bottom: 70px; /* TitleP 아래에 위치 */
    left: 20px;
    z-index: 2;
    font-size: 14px;
    color: #666666;
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
    background-color: rgba(0, 141, 231, 0.3);
    z-index: 2;
    border-radius: 50px;
    overflow: hidden;
`;

const ProgressBar = styled.div`
    width: 30%; /* 30% 진행률 */
    height: 100%;
    border-radius: 50px;
    background-color: #008DE7;
`;

const ProgressText = styled.div`
    position: absolute;
    bottom: 38px; /* 진행률 바 바로 위에 위치 */
    left: 20px;
    z-index: 2;
    color: #008DE7;
    font-size: 16px;
    font-weight: 700;
    margin-left : 2px;
`;

const PriceInfo = styled.div`
    position: absolute;
    bottom: 25px; /* 하단에 딱 붙지 않도록 여백 추가 */
    right: 20px;  /* 왼쪽으로 이동해서 정렬 */
    z-index: 2;
    font-size: 14px;
    display: flex; /* Flexbox 사용 */
    flex-direction: row; /* 자식 요소를 가로로 배치 */
    align-items: center; /* 자식 요소를 수직으로 가운데 정렬 */
`;

const PriceUsedP = styled.p`
    color: #008DE7;
    font-weight: 600;
    margin-right : 4px;
`;

const PriceInfoP = styled.p`
    font-weight : 400;
    color : #666666;
`;

interface TravelDetailCardProps {
    title : String,
    startDate : String,
    endDate : String,
    country : String,
    memberCount : number,
    usedBudget : number,
    totalBudgetWon : number,
}

const TravelDetailCard: React.FC<TravelDetailCardProps> = 
        ({title, startDate, endDate, country, memberCount,usedBudget, totalBudgetWon}) => {


    return (
        <PositionDiv>
            <CardDiv>
                <TitleP>{title}</TitleP>
                <InfoP> { startDate} ~
                {endDate}<br />{country} · {memberCount}명</InfoP>
                <ProgressText>{(usedBudget / totalBudgetWon * 100).toFixed(0)}%</ProgressText>
                <ProgressContainer>
                    <ProgressBar />
                </ProgressContainer>
                <PriceInfo>
                    <PriceUsedP>
                        {usedBudget} 
                    </PriceUsedP>
                        <PriceInfoP>/ {totalBudgetWon}원</PriceInfoP>
                </PriceInfo>
            </CardDiv>
        </PositionDiv>
    );
};

export default TravelDetailCard;
