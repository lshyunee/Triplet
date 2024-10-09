import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { pageMove } from '../../features/navigation/naviSlice';

import SampleImg from '../../assets/travelSampleImg/sampleImg.png';
import BackHeader from '../../components/header/BackHeader';
import TravelDetailCard from '../../components/travel/TravelDetailCard';
import TravelDetailPay from '../../components/travel/TravelDetailPay';

import { ReactComponent as RightArrow } from '../../assets/common/rightArrow.svg';
import { ReactComponent as PayIcon } from '../../assets/common/payIcon.svg';
import { ReactComponent as ShareIcon } from '../../assets/common/shareIcon.svg';
import { selectUpcomingTravelByTitleId } from '../../features/travel/upcomingTravelSlice';
import { RootState } from '../../store';
import useAxios from '../../hooks/useAxios';
import { ongoingTravelDataInsert, selectOngoingTravelId } from '../../features/travel/ongoingTravelSlice';

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
    margin-bottom : 24px;
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
    paid : number;
    color : string;
}

const MoneyChartConsumpBar = styled.div<MoneyCategoryProps>`
    width: 100%;
    background-color: ${props => props.color};
    border-radius: 50px;
    overflow: hidden;
    height: 12px;
`;

const MoneyChartBar = styled.div<MonyeProgressProps>`
    height : 100%;
    background-color : ${props => props.color};
    width : ${props => `${props.paid}%` || '0%'};
    border-radius : 50px;
`

const MoneyCategoryP = styled.p`
    color : #666666;
    font-size : 14px;
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


const OngoingTravelDetailPage = () => {
  
    const dispatch = useDispatch();

  useEffect(() => {
    dispatch(pageMove("travels"));
  }, [dispatch]);

  const travelId = useSelector(selectOngoingTravelId);
  const travel = useSelector((state:any) => state.ongoingTravel);

  const { data : travelData, error : travelError, status : travelStatus,
    refetch : travelRefetch
  } = useAxios(`/travels/${travelId}`, "GET");

  const { data: budgetData, error: budgetError,
    status: budgetStatus, refetch: budgetRefetch
} = useAxios(`/travels/expenditure-expenses/${travel.travelId}`, "GET");

useEffect(()=> {
    travelRefetch();
}, [])

useEffect(() => {
    if (travelData && travelData.data) {
      dispatch(ongoingTravelDataInsert({
        airportCost : travelData.data.airportCost,
        travelId : travelData.data.travelId,
        creatorId : travelData.data.creatorId,
      }));
      console.log(travelData);
    }
    budgetRefetch();
}, [travelData, travelError]);

  interface BudgetDetails {
    isComplete: boolean;
    budgetList: Budget[];
}

const [budgetDetails, setBudgetDetails] = useState<BudgetDetails | null>(null);

interface Budget {
    categoryId: number;
    categoryName: string;
    categoryBudget: number;
    usedBudget: number;
    fiftyBudget: number;
    eightyBudget: number;
    budgetWon: number;
}

const [ usedBudget, setUsedBudget ] = useState(0);

useEffect(() => {
    if (budgetData) {
         const { isComplete, budgetList } = budgetData.data;
  
          setBudgetDetails({
              isComplete,
              budgetList: budgetList.map((budget: Budget) => ({
                  categoryId: budget.categoryId,
                  categoryName: budget.categoryName,
                  categoryBudget: budget.categoryBudget,
                  usedBudget: budget.usedBudget,
                  fiftyBudget: budget.fiftyBudget,
                  eightyBudget: budget.eightyBudget,
                  budgetWon: budget.budgetWon
              }))
          });

          setUsedBudget(budgetList.reduce(
            (total:Number, usedBudget: any) => total + usedBudget, 0));

        console.log(budgetDetails?.budgetList);

      }
  
      if (budgetError) {
      }

  }, [budgetData, budgetError]);

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
    <BackHeader title={travel?.title||""}></BackHeader>
    <DetailDiv>
      <Img src={travel?.image||SampleImg}></Img>
      <Overlay />
      <ContentDiv>
          <TravelCardDiv>
          <TravelDetailCard 
          travelId={travel?.travelId||0}
          title={travel?.title||""}
          startDate={travel?.startDate||""} endDate={travel?.endDate||""}
          country={travel?.countryName||""}
          memberCount={travel?.memberCount||0}
          usedBudget={usedBudget|0}
          totalBudget={travel?.totalBudget||0}
          currency={travel?.currency||""}
          creatorId={travel?.creatorId||0}
          />
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
                    <MoneyCategoryP>{travel?.airportCost} 원</MoneyCategoryP>
                </MoneyCategoryDiv>
                <MoneyCategoryProgressDiv>
                    <MoneyTitleDiv>
                        <MoneyCategoryP>{budgetDetails?.budgetList[0]?.categoryName}</MoneyCategoryP>
                        <MoneyComsumpP color="#00D5FF">
                            {budgetDetails?.budgetList[0]?.usedBudget && budgetDetails?.budgetList[0]?.categoryBudget 
                                ? ((budgetDetails.budgetList[0].usedBudget / budgetDetails.budgetList[0].categoryBudget) * 100).toFixed(0) 
                                : 0}%  
                        </MoneyComsumpP>
                    </MoneyTitleDiv>
                    <BudgetDiv>
                        <MoneyBudgetComsumpP color='#00D5FF'>{budgetDetails?.budgetList[0].usedBudget||0}</MoneyBudgetComsumpP>
                        <MoneyBudgetP color=''>/ {budgetDetails?.budgetList[0].categoryBudget||0} {travel?.currency}</MoneyBudgetP>
                    </BudgetDiv>
                </MoneyCategoryProgressDiv>
                <MoneyChartConsumpBar color={hexToRgba("#00D5FF","0.3")}>
                    <MoneyChartBar paid={budgetDetails?.budgetList[0]?.usedBudget && budgetDetails?.budgetList[0]?.categoryBudget 
                                ? ((budgetDetails.budgetList[0].usedBudget / budgetDetails.budgetList[0].categoryBudget) * 100)
                                : 0}  color="#00D5FF"/>
                </MoneyChartConsumpBar>
                <MoneyCategoryProgressDiv>
                    <MoneyTitleDiv>
                        <MoneyCategoryP>{budgetDetails?.budgetList[1]?.categoryName}</MoneyCategoryP>
                        <MoneyComsumpP color="#00C8FB">
                            {budgetDetails?.budgetList[1]?.usedBudget && budgetDetails?.budgetList[1]?.categoryBudget 
                                ? ((budgetDetails.budgetList[1].usedBudget / budgetDetails.budgetList[1].categoryBudget) * 100).toFixed(0) 
                                : 0}%
                        </MoneyComsumpP>
                    </MoneyTitleDiv>
                    <BudgetDiv>
                        <MoneyBudgetComsumpP color='#00C8FB'>{budgetDetails?.budgetList[1].usedBudget||0}</MoneyBudgetComsumpP>
                        <MoneyBudgetP color=''>/ {budgetDetails?.budgetList[1].categoryBudget||0} {travel?.currency}</MoneyBudgetP>
                    </BudgetDiv>
                </MoneyCategoryProgressDiv>
                <MoneyChartConsumpBar color={hexToRgba("#00C8FB","0.3")}>
                    <MoneyChartBar paid={budgetDetails?.budgetList[1]?.usedBudget && budgetDetails?.budgetList[1]?.categoryBudget 
                                ? ((budgetDetails.budgetList[1].usedBudget / budgetDetails.budgetList[1].categoryBudget) * 100)
                                : 0}  color="#00C8FB"/>
                </MoneyChartConsumpBar>
                <MoneyCategoryProgressDiv>
                    <MoneyTitleDiv>
                        <MoneyCategoryP>{budgetDetails?.budgetList[2]?.categoryName}</MoneyCategoryP>
                        <MoneyComsumpP color="#00B8F5">
                                {budgetDetails?.budgetList[2]?.usedBudget && budgetDetails?.budgetList[2]?.categoryBudget 
                                ? ((budgetDetails.budgetList[2].usedBudget / budgetDetails.budgetList[2].categoryBudget) * 100).toFixed(0) 
                                : 0}%
                        </MoneyComsumpP>
                    </MoneyTitleDiv>
                    <BudgetDiv>
                        <MoneyBudgetComsumpP color='#00B8F5'>{budgetDetails?.budgetList[2].usedBudget||0}</MoneyBudgetComsumpP>
                        <MoneyBudgetP color=''>/ {budgetDetails?.budgetList[2].categoryBudget||0} {travel?.currency}</MoneyBudgetP>
                    </BudgetDiv>
                </MoneyCategoryProgressDiv>
                <MoneyChartConsumpBar  color={hexToRgba("#00B8F5","0.3")}>
                    <MoneyChartBar paid={budgetDetails?.budgetList[2]?.usedBudget && budgetDetails?.budgetList[2]?.categoryBudget 
                                ? ((budgetDetails.budgetList[2].usedBudget / budgetDetails.budgetList[2].categoryBudget) * 100)
                                : 0}  color="#00B8F5"/>
                </MoneyChartConsumpBar>
                <MoneyCategoryProgressDiv>
                    <MoneyTitleDiv>
                        <MoneyCategoryP>{budgetDetails?.budgetList[3]?.categoryName}</MoneyCategoryP>
                        <MoneyComsumpP color="#00ACF1">
                            {budgetDetails?.budgetList[3]?.usedBudget && budgetDetails?.budgetList[3]?.categoryBudget 
                                ? ((budgetDetails.budgetList[3].usedBudget / budgetDetails.budgetList[3].categoryBudget) * 100).toFixed(0) 
                                : 0}%
                        </MoneyComsumpP>
                    </MoneyTitleDiv>
                    <BudgetDiv>
                        <MoneyBudgetComsumpP color='#00ACF1'>{budgetDetails?.budgetList[3].usedBudget||0}</MoneyBudgetComsumpP>
                        <MoneyBudgetP color=''>/ {budgetDetails?.budgetList[3].categoryBudget||0} {travel?.currency}</MoneyBudgetP>
                    </BudgetDiv>
                </MoneyCategoryProgressDiv>
                <MoneyChartConsumpBar  color={hexToRgba("#00ACF1","0.3")}>
                    <MoneyChartBar paid={budgetDetails?.budgetList[3]?.usedBudget && budgetDetails?.budgetList[3]?.categoryBudget 
                                ? ((budgetDetails.budgetList[3].usedBudget / budgetDetails.budgetList[3].categoryBudget) * 100)
                                : 0}  color='#00ACF1'/>
                </MoneyChartConsumpBar>
                <MoneyCategoryProgressDiv>
                    <MoneyTitleDiv>
                        <MoneyCategoryP>{budgetDetails?.budgetList[4]?.categoryName}</MoneyCategoryP>
                        <MoneyComsumpP color="#009BEB">
                        {budgetDetails?.budgetList[4]?.usedBudget && budgetDetails?.budgetList[4]?.categoryBudget 
                                ? ((budgetDetails.budgetList[4].usedBudget / budgetDetails.budgetList[4].categoryBudget) * 100).toFixed(0) 
                                : 0}%
                        </MoneyComsumpP>
                    </MoneyTitleDiv>
                    <BudgetDiv>
                        <MoneyBudgetComsumpP color='#009BEB'>{budgetDetails?.budgetList[4].usedBudget||0}</MoneyBudgetComsumpP>
                        <MoneyBudgetP color=''>/ {budgetDetails?.budgetList[4].categoryBudget||0} {travel?.currency}</MoneyBudgetP>
                    </BudgetDiv>
                </MoneyCategoryProgressDiv>
                <MoneyChartConsumpBar color={hexToRgba("#009BEB","0.3")}>
                    <MoneyChartBar paid={budgetDetails?.budgetList[4]?.usedBudget && budgetDetails?.budgetList[4]?.categoryBudget 
                                ? ((budgetDetails.budgetList[4].usedBudget / budgetDetails.budgetList[4].categoryBudget) * 100)
                                : 0}  color='#009BEB'/>
                </MoneyChartConsumpBar>
                <MoneyCategoryProgressDiv>
                    <MoneyTitleDiv>
                        <MoneyCategoryP>{budgetDetails?.budgetList[5]?.categoryName}</MoneyCategoryP>
                        <MoneyComsumpP color="#008DE7">
                            {budgetDetails?.budgetList[5]?.usedBudget && budgetDetails?.budgetList[5]?.categoryBudget 
                                ? ((budgetDetails.budgetList[5].usedBudget / budgetDetails.budgetList[5].categoryBudget) * 100).toFixed(0) 
                                : 0}%
                        </MoneyComsumpP>
                    </MoneyTitleDiv>
                    <BudgetDiv>
                        <MoneyBudgetComsumpP color='#008DE7'>{budgetDetails?.budgetList[5].usedBudget||0}</MoneyBudgetComsumpP>
                        <MoneyBudgetP color=''>/ {budgetDetails?.budgetList[5].categoryBudget||0} {travel?.currency}</MoneyBudgetP>
                    </BudgetDiv>
                </MoneyCategoryProgressDiv>
                <MoneyChartConsumpBar color={hexToRgba("#008DE7","0.3")}>
                    <MoneyChartBar paid={budgetDetails?.budgetList[5]?.usedBudget && budgetDetails?.budgetList[5]?.categoryBudget 
                                ? ((budgetDetails.budgetList[5].usedBudget / budgetDetails.budgetList[5].categoryBudget) * 100)
                                : 0}  color='#008DE7'/>
                </MoneyChartConsumpBar>
            </MoneyDiv>
      </ContentDiv>
    </DetailDiv>
  </>
  );
}

export default OngoingTravelDetailPage;
