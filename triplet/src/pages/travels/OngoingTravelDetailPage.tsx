import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import BackHeader from '../../components/header/BackHeader';

import SampleImg from '../../assets/travelSampleImg/sampleImg.png';
import OngoingTravelDetailCard from '../../components/travel/OngoingTravelDetailCard';
import TravelDetailPay from '../../components/travel/TravelDetailPay';

import { ReactComponent as RightArrow } from '../../assets/common/rightArrow.svg';
import { ReactComponent as PayIcon } from '../../assets/common/payIcon.svg';
import { ReactComponent as ShareIcon } from '../../assets/common/shareIcon.svg';
import { selectTravelByTitleId } from '../../features/travel/upcomingTravelSlice';
import { RootState } from '../../store';


const DetailDiv = styled.div`
    padding : 56px 0 0 0;
    display: flex;
    flex-direction: column;
    width: 100%;
    height : calc ( 100vh - 112px );
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
    margin-bottom : 56px;
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

const MoneyDiv = styled.div`
    border-radius : 20px;
    background-color : white;
    display : flex;
    flex-direction : column;
    padding : 20px;
`

const MoneyCategoryDiv = styled.div`
    display : flex;
    flex-direction : row;
    justify-content : space-between;
`

const MoneyCategoryProgressDiv = styled.div`
    display : flex;
    flex-direction : row;
    justify-content : space-between;
    margin : 24px 0 8px 0;
`

interface MonyeProgressProps {
    paid : string;
}

const MoneyEatDiv = styled.div`
    width: 100%;
    background-color: rgba(0,213,255,0.5);
    border-radius: 50px;
    overflow: hidden;
    height: 20px;
`;

const MoneyEatBarDiv = styled.div<MonyeProgressProps>`
    height : 100%;
    background-color : rgba(0,213,255);
    width : ${props => props.paid || '50%'};
    border-radius : 50px;
`

const MoneyRideDiv = styled.div`
    width: 100%;
    background-color: rgba(0,200,251,0.5);
    border-radius: 50px;
    overflow: hidden;
    height: 20px;
`;

const MoneyRideBarDiv = styled.div<MonyeProgressProps>`
    height : 100%;
    background-color : rgba(0,200,251);
    width : ${props => props.paid || '50%'};
    border-radius : 50px;
`

const MoneyTourDiv = styled.div`
    width: 100%;
    background-color: rgba(0,184,245,0.5);
    border-radius: 50px;
    overflow: hidden;
    height: 20px;
`;

const MoneyTourBarDiv = styled.div<MonyeProgressProps>`
    height : 100%;
    background-color : rgba(0, 184, 245);
    width : ${props => props.paid || '50%'};
    border-radius : 50px;
`

const MoneyShopDiv = styled.div`
    width: 100%;
    background-color: rgba(0,172,241,0.5);
    border-radius: 50px;
    overflow: hidden;
    height: 20px;
`;

const MoneyShopBarDiv = styled.div<MonyeProgressProps>`
    height : 100%;
    background-color : rgba(0, 172, 241);
    width : ${props => props.paid || '50%'};
    border-radius : 50px;
`

const MoneyStayDiv = styled.div`
    width: 100%;
    background-color: rgba(0,155,235,0.5);
    border-radius: 50px;
    overflow: hidden;
    height: 20px;
`;

const MoneyStayBarDiv = styled.div<MonyeProgressProps>`
    height : 100%;
    background-color : rgba(0, 155, 235);
    width : ${props => props.paid || '50%'};
    border-radius : 50px;
`

const MoneyEtcDiv = styled.div`
    width: 100%;
    background-color: rgba(0,141,231,0.5);
    border-radius: 50px;
    overflow: hidden;
    height: 20px;
`;

const MoneyEtcBarDiv = styled.div<MonyeProgressProps>`
    height : 100%;
    background-color : rgba(0, 141, 231);
    width : ${props => props.paid || '50%'};
    border-radius : 50px;
`

const MoneyCategoryP = styled.p`
    color : #666666;
    font-size : 16px;
    font-weight : 600;
    margin : 0;
    margin-left : 2px;
`

const MoneyP = styled.p`
    color : #666666;
    font-size : 16px;
    font-wegiht : 500;
    margin : 0
    margin-right : 2px;
`


const OngoingTravelDetailPage = () => {

    
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
                          <TitleP>여행 지출 내역</TitleP>
                      </CategoryTitleFontDiv>
                      <RightArrow/>
                  </CategoryTitleDiv>
              </CategoryBudgetDiv>
                <MoneyDiv>
                    <MoneyCategoryDiv>
                        <MoneyCategoryP>항공</MoneyCategoryP>
                        <MoneyCategoryP>600,000원</MoneyCategoryP>
                    </MoneyCategoryDiv>
                    <MoneyCategoryProgressDiv>
                        <MoneyCategoryP>식사</MoneyCategoryP>
                    </MoneyCategoryProgressDiv>
                    <MoneyEatDiv>
                        <MoneyEatBarDiv paid="80%"/>
                    </MoneyEatDiv>
                    <MoneyCategoryProgressDiv>
                        <MoneyCategoryP>교통</MoneyCategoryP>
                    </MoneyCategoryProgressDiv>
                    <MoneyRideDiv>
                        <MoneyRideBarDiv paid="30%"/>
                    </MoneyRideDiv>
                    <MoneyCategoryProgressDiv>
                        <MoneyCategoryP>관광</MoneyCategoryP>
                    </MoneyCategoryProgressDiv>
                    <MoneyTourDiv>
                        <MoneyTourBarDiv paid="30%"/>
                    </MoneyTourDiv>
                    <MoneyCategoryProgressDiv>
                        <MoneyCategoryP>쇼핑</MoneyCategoryP>
                    </MoneyCategoryProgressDiv>
                    <MoneyShopDiv>
                        <MoneyShopBarDiv paid="30%"/>
                    </MoneyShopDiv>
                    <MoneyCategoryProgressDiv>
                        <MoneyCategoryP>숙박</MoneyCategoryP>
                    </MoneyCategoryProgressDiv>
                    <MoneyStayDiv>
                        <MoneyStayBarDiv paid="30%"/>
                    </MoneyStayDiv>
                    <MoneyCategoryProgressDiv>
                        <MoneyCategoryP>기타</MoneyCategoryP>
                    </MoneyCategoryProgressDiv>
                    <MoneyEtcDiv>
                        <MoneyEtcBarDiv paid="30%"/>
                    </MoneyEtcDiv>
                </MoneyDiv>
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
    )
}

export default OngoingTravelDetailPage;