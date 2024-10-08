import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { pageMove } from '../../features/navigation/naviSlice';

import SampleImg from '../../assets/travelSampleImg/sampleImg.png';
import BackHeader from '../../components/header/BackHeader';
import TravelDetailPay from '../../components/travel/TravelDetailPay';

import { ReactComponent as RightArrow } from '../../assets/common/rightArrow.svg';
import { ReactComponent as PayIcon } from '../../assets/common/payIcon.svg';
import { ReactComponent as ShareIcon } from '../../assets/common/shareIcon.svg';
import useAxios from '../../hooks/useAxios';
import ShareTravelModal from '../../components/modal/ShareTravelModal';
import CompletedTravelDetailCard from '../../components/travel/CompletedTravelDetailCard';

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
`;

const MoneyCategoryDiv = styled.div`
    display : flex;
    flex-direction : row;
    justify-content : space-between;
`;

const MoneyCategoryProgressDiv = styled.div`
    display : flex;
    flex-direction : row;
    justify-content : space-between;
    margin : 24px 0 0 0;
`;

const MoneyCategoryP = styled.p`
    color : black;
    font-size : 16px;
    font-weight : 400;
    margin : 0;
    margin-left : 2px;
`;

const MoneyTitleDiv = styled.div`
    display : flex;
    flex-direction: row;
`;

const BudgetDiv = styled.div`
    display : flex;
    flex-direction: row;
    margin-right : 2px;
`;

const MoneyBudgetP = styled.p`
    margin : 0px;
    font-size : 16px;
    font-weight : 400;
    color : black;
`;

interface Travel {
    travelId: number;
    title: string;
    startDate: string;
    endDate: string;
    image: string;
    country: string;
    countryId: number;
    currency: string;
    memberCount: number;
    totalBudgetWon: number;
    usedBudget: number;
    status: boolean;
    shareStatus: boolean;
    shared: boolean;
    airportCost : number;
    myTravel : boolean;
    creatorId : number;
    finishTravel : boolean;
}

const CompletedTravelDetailPage = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(pageMove("travels"));
    }, [dispatch]);
    
    const { id } = useParams();
    const [travel, setTravel] = useState<Travel>();

    const { data: travelData, error: travelError, 
        status: travelStatus, refetch: travelRefetch    
    } = useAxios(`/travels/${id}`, "GET");

    const { data: budgetData, error: budgetError,
        status: budgetStatus, refetch: budgetRefetch
    } = useAxios(`/travels/expenditure-expenses/${id}`, "GET");

    useEffect(()=> {
        travelRefetch();
    }, []);

    useEffect(() => {
        if (travelData) {
            setTravel(travelData.data);
            console.log(travelData.data);
        }
    }, [travelData, travelError]);

    useEffect(()=>{
        if(travel && travel.travelId !== 0){
            budgetRefetch();
        }
      },[travel])

    interface BudgetDetails {
        isComplete: boolean;
        budgetList: Budget[];
    }
    
    const [budgetDetails, setBudgetDetails] = useState<BudgetDetails|null>(null);
    
    interface Budget {
        categoryId: number;
        categoryName: string;
        used: number;
    }
    
    const [ usedBudget, setUsedBudget ] = useState(0);

    useEffect(() => {
        if (budgetData) {
            const { isComplete, budgetList } = budgetData.data;

            console.log(budgetData);
        
            setBudgetDetails({
                isComplete,
                budgetList: budgetList?.map((budget: Budget) => ({
                    categoryId: budget.categoryId,
                    categoryName: budget.categoryName,
                    used: budget.used,
                })) || []
            });

            
            setUsedBudget(
                budgetList.reduce((total: number, budget: any) => total + budget.used, 0)
            );
        
        }
    }, [budgetData, budgetError]);

    
    const [ isShareModal, setShareModal ] = useState(false);

    return (
        <>
            <BackHeader title={travel?.title || ""}></BackHeader>
            <DetailDiv>
                <Img src={SampleImg}></Img>
                <Overlay />
                <ContentDiv>
                    <TravelCardDiv>
                        <CompletedTravelDetailCard title={travel?.title || ""}
                            startDate={travel?.startDate || ""} 
                            endDate={travel?.endDate || ""}
                            country={travel?.country || ""}
                            memberCount={travel?.memberCount || 0}
                            usedBudget={usedBudget || 0}/>
                    </TravelCardDiv>
                    <TravelDetailPay />
                    <CategoryBudgetDiv>
                        <CategoryTitleDiv>
                            <CategoryTitleFontDiv>
                                <PayIcon />
                                <TitleP>여행 지출 내역</TitleP>
                            </CategoryTitleFontDiv>
                            <RightArrow />
                        </CategoryTitleDiv>
                    </CategoryBudgetDiv>
                    <MoneyDiv>
                        <MoneyCategoryDiv>
                            <MoneyCategoryP>항공</MoneyCategoryP>
                            <MoneyCategoryP>600,000원</MoneyCategoryP>
                        </MoneyCategoryDiv>
                        {/* 항목이 있는지 확인 후 조건부 렌더링 */}
                        {budgetDetails?.budgetList?.[0] && (
                            <>
                                <MoneyCategoryProgressDiv>
                                    <MoneyTitleDiv>
                                        <MoneyCategoryP>식사</MoneyCategoryP>
                                    </MoneyTitleDiv>
                                    <BudgetDiv>
                                        <MoneyBudgetP color=''>{budgetDetails?.budgetList?.[0]?.used || 0} {travel?.currency}</MoneyBudgetP>
                                    </BudgetDiv>
                                </MoneyCategoryProgressDiv>
                            </>
                        )}
                        {budgetDetails?.budgetList?.[1] && (
                            <>
                                <MoneyCategoryProgressDiv>
                                    <MoneyTitleDiv>
                                        <MoneyCategoryP>식사</MoneyCategoryP>
                                    </MoneyTitleDiv>
                                    <BudgetDiv>
                                    <MoneyBudgetP color=''>{budgetDetails?.budgetList?.[1]?.used || 0} {travel?.currency}</MoneyBudgetP>
                                    </BudgetDiv>
                                </MoneyCategoryProgressDiv>
                            </>
                        )}
                        {budgetDetails?.budgetList?.[2] && (
                            <>
                                <MoneyCategoryProgressDiv>
                                    <MoneyTitleDiv>
                                        <MoneyCategoryP>식사</MoneyCategoryP>
                                    </MoneyTitleDiv>
                                    <BudgetDiv>
                                        <MoneyBudgetP color=''>{budgetDetails?.budgetList?.[2]?.used || 0} {travel?.currency}</MoneyBudgetP>
                                    </BudgetDiv>
                                </MoneyCategoryProgressDiv>
                            </>
                        )}

                        {budgetDetails?.budgetList?.[3] && (
                            <>
                                <MoneyCategoryProgressDiv>
                                    <MoneyTitleDiv>
                                        <MoneyCategoryP>식사</MoneyCategoryP>
                                    </MoneyTitleDiv>
                                    <BudgetDiv>
                                        <MoneyBudgetP color=''>{budgetDetails?.budgetList?.[3]?.used || 0} {travel?.currency}</MoneyBudgetP>
                                    </BudgetDiv>
                                </MoneyCategoryProgressDiv>
                            </>
                        )}

                        {budgetDetails?.budgetList?.[4] && (
                            <>
                                <MoneyCategoryProgressDiv>
                                    <MoneyTitleDiv>
                                        <MoneyCategoryP>식사</MoneyCategoryP>
                                    </MoneyTitleDiv>
                                    <BudgetDiv>
                                        <MoneyBudgetP color=''>{budgetDetails?.budgetList?.[4]?.used || 0} {travel?.currency}</MoneyBudgetP>
                                    </BudgetDiv>
                                </MoneyCategoryProgressDiv>
                            </>
                        )}

                        {budgetDetails?.budgetList?.[5] && (
                            <>
                                <MoneyCategoryProgressDiv>
                                    <MoneyTitleDiv>
                                        <MoneyCategoryP>식사</MoneyCategoryP>
                                    </MoneyTitleDiv>
                                    <BudgetDiv>
                                        <MoneyBudgetP color=''>{budgetDetails?.budgetList?.[5]?.used || 0} {travel?.currency}</MoneyBudgetP>
                                    </BudgetDiv>
                                </MoneyCategoryProgressDiv>
                            </>
                        )}
                    </MoneyDiv>
                    <CategoryShareDiv>
                        <CategoryTitleDiv  onClick={()=>{setShareModal(true)}}>
                            <CategoryTitleFontDiv>
                                <ShareIcon />
                                <TitleP>여행 공유 옵션</TitleP>
                            </CategoryTitleFontDiv>
                            <RightArrow />
                        </CategoryTitleDiv>
                    </CategoryShareDiv>
                </ContentDiv>
            </DetailDiv>
            <ShareTravelModal isOpen={isShareModal} onClose={() => { setShareModal(false) }} travelId={travel?.travelId || 0} 
                share={travel?.shared || false} shareDetail={travel?.shareStatus || false}/>
        </>
    );
};

export default CompletedTravelDetailPage;