import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import useAxios from '../../hooks/useAxios';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { ongoingTravelDataInsert } from '../../features/travel/ongoingTravelSlice';


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

interface MonyeProgressProps {
    paid : number;
}

const ProgressBar = styled.div<MonyeProgressProps>`
    width : ${props => `${props.paid}%` || '0%'};
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

const StyledLink = styled(Link)`
    display: block;
    width: 100%;
    text-decoration: none !important;  /* 밑줄 강제로 제거 */
    color: inherit !important;         /* 링크 색상 기본값 제거 */
`;

const OngoingTravelCard = () => {

    const dispatch = useDispatch();
    const travelData = useSelector((state:any) => state.ongoingTravel);

    const { data: infoData, error: infoError, refetch: infoRefetch } = useAxios("/travels/ongoing", "GET");

    useEffect(() => {
        if (!travelData.travelId) {
            infoRefetch();
        }
    }, [travelData.travelId]);

    useEffect(() => {
        if (infoData?.data) {
            dispatch(ongoingTravelDataInsert({
              travelId: infoData.data.travelId,
              title: infoData.data.title,
              startDate: infoData.data.startDate,
              endDate: infoData.data.endDate,
              image: infoData.data.image,
              countryName: infoData.data.countryName,
              countryId: infoData.data.countryId,
              currency: infoData.data.currency,
              memberCount: infoData.data.memberCount,
              totalBudget: infoData.data.totalBudget,
              status: infoData.data.status,
              shareStatus: infoData.data.shareStatus,
              shared: infoData.data.shared,
            }));
          }

        if (infoError !== null) {
            if(infoError.response.data.message){
            }
        }
    }, [infoData, infoError]);
    
    if (!travelData || !travelData.travelId) {
        return null;
    }

    return (
        <StyledLink to={`/travels/ongoing/detail`}>
        <PositionDiv>
            <CardDiv>
                <TravelImg src={travelData?.image} alt="Travel" />
                <Overlay />
                <BottomOverlay />
                <TitleP>{travelData?.title}</TitleP>
                <InfoP>{travelData?.startDate ? new Date(travelData.startDate).toLocaleDateString() : ''} ~ {travelData?.endDate ? 
                new Date(travelData.endDate).toLocaleDateString() : ''}<br />
                {travelData.countryName} · {travelData.memberCount}명</InfoP>
                <ProgressText>{(travelData.usedBudget/travelData.totalBudget*100).toFixed(0)}%</ProgressText> 
                <ProgressContainer>
                    <ProgressBar paid={(travelData.usedBudget/travelData.totalBudget*100)} />
                </ProgressContainer>
                <PriceInfo>{travelData.usedBudget} <PriceInfoP>/ {travelData.totalBudget}원</PriceInfoP></PriceInfo>
            </CardDiv>
        </PositionDiv>
        </StyledLink>
    );
};

export default OngoingTravelCard;
