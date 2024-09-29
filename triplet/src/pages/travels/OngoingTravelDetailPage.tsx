import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { pageMove } from '../../features/navigation/naviSlice';
import SampleImg from '../../assets/travelSampleImg/sampleImg.png';
import BackHeader from '../../components/header/BackHeader';
import OngoingTravelDetailCard from '../../components/travel/OngoingTravelDetailCard';
import TravelDetailPay from '../../components/travel/TravelDetailPay';

import { ReactComponent as RightArrow } from '../../assets/common/rightArrow.svg';
import { ReactComponent as PayIcon } from '../../assets/common/payIcon.svg';
import { ReactComponent as ShareIcon } from '../../assets/common/shareIcon.svg';

const DetailDiv = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height : calc( 100vh - 80px );
  padding: 56px 0 0;
  position: relative; /* position 설정 */
  background-color : #F3F4F6;   
`;

const Img = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const ContentDiv = styled.div`
    padding: 0 16px;
    display : flex;
    flex-direction : column;
    gap : 12px;
`;

const TravelCardDiv = styled.div`
  position: relative;
  z-index: 2; /* OngoingTravelDetailCard가 이미지 위에 보이도록 설정 */
  margin-top: -31px; /* 이미지 아래로 살짝 겹쳐서 배치 */
`;

const Overlay = styled.div`
  position: absolute;
  top: 56px;
  left: 0;
  width: 100%;
  height: 200px;
  background-color: rgba(0, 0, 0, 0.2); /* 반투명한 검정 오버레이 */
  z-index: 1;
`;

const CategoryBudgetDiv = styled.div`
    width : 100%;
    height : 64px;
    background-color : white;
    border-radius : 20px;
`;

const CategoryShareDiv = styled.div`
    width : 100%;
    height : 64px;
    background-color : white;
    border-radius : 20px;
    margin-bottom : 28px;
`;

const CategoryTitleDiv = styled.div`
    display : flex;
    flex-direciton : row;
    justify-content : space-between;
    align-items : center;
    margin : 16px;
`;

const CategoryTitleFontDiv = styled.div`
    display : flex;
`;

const TitleP = styled.p`
    font-size : 16px;
    font-weight : 600;
    margin : 0 0 0 12px;
    display : flex;
    align-items : center;
`;


const OngoingTravelDetailPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(pageMove("travels"));
  }, [dispatch]);

  return (
    <>
      <BackHeader title="고래상어보러가자"></BackHeader>
      <DetailDiv>
        <Img src={SampleImg}></Img>
        <Overlay />
        <ContentDiv>
            <TravelCardDiv>
            <OngoingTravelDetailCard />
            </TravelCardDiv>
            <TravelDetailPay/>
            <CategoryBudgetDiv>
                <CategoryTitleDiv>
                    <CategoryTitleFontDiv>
                        <PayIcon/>
                        <TitleP>카테고리별 예산</TitleP>
                    </CategoryTitleFontDiv>
                    <RightArrow/>
                </CategoryTitleDiv>
            </CategoryBudgetDiv>
            <CategoryShareDiv>
                <CategoryTitleDiv>
                    <CategoryTitleFontDiv>
                        <ShareIcon/>
                        <TitleP>여행 공유 옵션</TitleP>
                    </CategoryTitleFontDiv>
                    <RightArrow/>
                </CategoryTitleDiv>
            </CategoryShareDiv>
        </ContentDiv>
      </DetailDiv>
    </>
  );
}

export default OngoingTravelDetailPage;
