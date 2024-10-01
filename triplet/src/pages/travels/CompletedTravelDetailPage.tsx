import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { pageMove } from '../../features/navigation/naviSlice';

import SampleImg from '../../assets/travelSampleImg/sampleImg.png';
import BackHeader from '../../components/header/BackHeader';
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
    color : string;
}

const MoneyChartConsumpBar = styled.div<MoneyCategoryProps>`
    width: 100%;
    background-color: ${props => props.color};
    border-radius: 50px;
    overflow: hidden;
    height: 20px;
`;

const MoneyChartBar = styled.div<MonyeProgressProps>`
    height : 100%;
    background-color : ${props => props.color};
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

const MoneyTitleDiv = styled.div`
    display : flex;
    flex-direction: row;
`

interface MoneyCategoryProps {
    color : string;
}

const MoneyComsumpP = styled.p<MoneyCategoryProps>`
    font-size : 16px;
    font-weight : 700;
    color : ${props => props.color || "#666666"};
    margin : 0px;
    margin-left : 8px;
`

const BudgetDiv = styled.div`
    display : flex;
    flex-direction: row;
    margin-right : 2px;
`

const MoneyBudgetP = styled.p<MoneyCategoryProps>`
    margin : 0px;
    font-size : 14px;
    font-weight : 500;
    color : ${props => props.color || "#666666"}
`;

const MoneyBudgetComsumpP = styled.p<MoneyCategoryProps>`
    margin : 0px;
    font-size : 14px;
    font-weight : 600;
    margin-right : 4px;
    color : ${props => props.color || "#666666"}
`;


const CompletedTravelDetailPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(pageMove("travels"));
  }, [dispatch]);

  const { id } = useParams();

  const travel = useSelector( (state:RootState) => selectTravelByTitleId(state, Number(id)));

  const hexToRgba = (hex:string, alpha:string) => {
    // hex 코드에서 # 제거
    const strippedHex = hex.replace('#', '');

    // 16진수 값으로 변환
    const r = parseInt(strippedHex.substring(0, 2), 16);
    const g = parseInt(strippedHex.substring(2, 4), 16);
    const b = parseInt(strippedHex.substring(4, 6), 16);

    // rgba 문자열 생성
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

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
                    <MoneyTitleDiv>
                        <MoneyCategoryP>식사</MoneyCategoryP>
                        <MoneyComsumpP color="#00D5FF">30%</MoneyComsumpP>
                    </MoneyTitleDiv>
                    <BudgetDiv>
                        <MoneyBudgetComsumpP color='#00D5FF'>600,000</MoneyBudgetComsumpP>
                        <MoneyBudgetP color=''>/ 2,000,000원</MoneyBudgetP>
                    </BudgetDiv>
                </MoneyCategoryProgressDiv>
                <MoneyChartConsumpBar color={hexToRgba("#00D5FF","0.3")}>
                    <MoneyChartBar paid="80%" color="#00D5FF"/>
                </MoneyChartConsumpBar>
                <MoneyCategoryProgressDiv>
                    <MoneyTitleDiv>
                        <MoneyCategoryP>교통</MoneyCategoryP>
                        <MoneyComsumpP color="#00C8FB">30%</MoneyComsumpP>
                    </MoneyTitleDiv>
                    <BudgetDiv>
                        <MoneyBudgetComsumpP color='#00C8FB'>600,000</MoneyBudgetComsumpP>
                        <MoneyBudgetP color=''>/ 2,000,000원</MoneyBudgetP>
                    </BudgetDiv>
                </MoneyCategoryProgressDiv>
                <MoneyChartConsumpBar color={hexToRgba("#00C8FB","0.3")}>
                    <MoneyChartBar paid="30%" color="#00C8FB"/>
                </MoneyChartConsumpBar>
                <MoneyCategoryProgressDiv>
                    <MoneyTitleDiv>
                        <MoneyCategoryP>관광</MoneyCategoryP>
                        <MoneyComsumpP color="#00B8F5">30%</MoneyComsumpP>
                    </MoneyTitleDiv>
                    <BudgetDiv>
                        <MoneyBudgetComsumpP color='#00B8F5'>600,000</MoneyBudgetComsumpP>
                        <MoneyBudgetP color=''>/ 2,000,000원</MoneyBudgetP>
                    </BudgetDiv>
                </MoneyCategoryProgressDiv>
                <MoneyChartConsumpBar  color={hexToRgba("#00B8F5","0.3")}>
                    <MoneyChartBar paid="30%" color="#00B8F5"/>
                </MoneyChartConsumpBar>
                <MoneyCategoryProgressDiv>
                    <MoneyTitleDiv>
                        <MoneyCategoryP>쇼핑</MoneyCategoryP>
                        <MoneyComsumpP color="#00ACF1">30%</MoneyComsumpP>
                    </MoneyTitleDiv>
                    <BudgetDiv>
                        <MoneyBudgetComsumpP color='#00ACF1'>600,000</MoneyBudgetComsumpP>
                        <MoneyBudgetP color=''>/ 2,000,000원</MoneyBudgetP>
                    </BudgetDiv>
                </MoneyCategoryProgressDiv>
                <MoneyChartConsumpBar  color={hexToRgba("#00ACF1","0.3")}>
                    <MoneyChartBar paid="30%" color='#00ACF1'/>
                </MoneyChartConsumpBar>
                <MoneyCategoryProgressDiv>
                    <MoneyTitleDiv>
                        <MoneyCategoryP>숙박</MoneyCategoryP>
                        <MoneyComsumpP color="#009BEB">30%</MoneyComsumpP>
                    </MoneyTitleDiv>
                    <BudgetDiv>
                        <MoneyBudgetComsumpP color='#009BEB'>600,000</MoneyBudgetComsumpP>
                        <MoneyBudgetP color=''>/ 2,000,000원</MoneyBudgetP>
                    </BudgetDiv>
                </MoneyCategoryProgressDiv>
                <MoneyChartConsumpBar color={hexToRgba("#009BEB","0.3")}>
                    <MoneyChartBar paid="30%"  color='#009BEB'/>
                </MoneyChartConsumpBar>
                <MoneyCategoryProgressDiv>
                    <MoneyTitleDiv>
                        <MoneyCategoryP>기타</MoneyCategoryP>
                        <MoneyComsumpP color="#008DE7">30%</MoneyComsumpP>
                    </MoneyTitleDiv>
                    <BudgetDiv>
                        <MoneyBudgetComsumpP color='#008DE7'>600,000</MoneyBudgetComsumpP>
                        <MoneyBudgetP color=''>/ 2,000,000원</MoneyBudgetP>
                    </BudgetDiv>
                </MoneyCategoryProgressDiv>
                <MoneyChartConsumpBar color={hexToRgba("#008DE7","0.3")}>
                    <MoneyChartBar paid="30%" color='#008DE7'/>
                </MoneyChartConsumpBar>
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
  );
}

export default CompletedTravelDetailPage;
