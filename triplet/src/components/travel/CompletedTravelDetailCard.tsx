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
    height: 120px;
    border-radius: 20px;
    position: relative;
    overflow: hidden;
`;

const TitleP = styled.p`
    position: absolute;
    bottom: 55px; 
    left: 20px;
    z-index: 2;
    font-weight: 700;
    font-size: 20px;
    color: black;
`;

const InfoP = styled.p`
    position: absolute;
    bottom: 5px; /* TitleP 아래에 위치 */
    left: 20px;
    z-index: 2;
    font-size: 16px;
    color: #666666;
`;

const PriceInfo = styled.div`
    position: absolute;
    bottom: 5px; /* 하단에 딱 붙지 않도록 여백 추가 */
    right: 20px;  /* 왼쪽으로 이동해서 정렬 */
    z-index: 2;
    font-size: 18px;
    display: flex; /* Flexbox 사용 */
    flex-direction: row; /* 자식 요소를 가로로 배치 */
    align-items: center; /* 자식 요소를 수직으로 가운데 정렬 */
`;



const PriceInfoP = styled.p`
    font-weight : 300;
    color : #666666;
`;

interface TravelDetailCardProps {
    title : String,
    startDate : String,
    endDate : String,
    country : String,
    memberCount : number,
    usedBudget : number,
}

const CompletedTravelDetailCard: React.FC<TravelDetailCardProps> = 
        ({title, startDate, endDate, country, memberCount,usedBudget}) => {


    return (
        <PositionDiv>
            <CardDiv>
                <TitleP>{title}</TitleP>
                <InfoP> { startDate} ~
                {endDate}<br />{country} · {memberCount}명</InfoP>
                <PriceInfo>
                        <PriceInfoP>{usedBudget}원</PriceInfoP>
                </PriceInfo>
            </CardDiv>
        </PositionDiv>
    );
};

export default CompletedTravelDetailCard;
