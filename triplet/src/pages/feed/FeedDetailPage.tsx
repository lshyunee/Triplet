import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { useParams,useNavigate} from 'react-router-dom';
import { RootState } from '../../store';
import BackHeader from '../../components/header/BackHeader';
import SnsTravelDetailCard from '../../components/travel/SnsTravelDetailCard';
import useAxios from '../../hooks/useAxios';
import { sharedTravelDataInsert } from '../../features/travel/shareTravelSlice';
import WarningModal from '../../components/modal/WarningModal';
const DetailDiv = styled.div`
  padding: 56px 0 0 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: #f3f4f6;
`;

const Img = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const ContentDiv = styled.div`
  padding: 0 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const TravelCardDiv = styled.div`
  margin-top: -31px;
  z-index: 2;
`;
const MoneyDiv = styled.div`
  border-radius: 20px;
  background-color: white;
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const MoneyCategoryDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const MoneyCategoryProgressDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 24px 0 8px 0;
`;

const MoneyChartConsumpBar = styled.div<{ color: string }>`
  width: 100%;
  background-color: ${(props) => props.color};
  border-radius: 50px;
  overflow: hidden;
  height: 12px;
`;

const MoneyChartBar = styled.div<{ paid: string; color: string }>`
  height: 100%;
  background-color: ${(props) => props.color};
  width: ${(props) => props.paid || '0%'};
  border-radius: 50px;
`;

const MoneyCategoryP = styled.p`
  color: #666666;
  font-size: 14px;
  font-weight: 600;
  margin: 0;
  margin-left: 2px;
`;

const MoneyTitleDiv = styled.div`
  display: flex;
  flex-direction: row;
`;

const MoneyComsumpP = styled.p<{ color: string }>`
  font-size: 16px;
  font-weight: 700;
  color: ${(props) => props.color || '#666666'};
  margin: 0px;
  margin-left: 8px;
`;

const BudgetDiv = styled.div`
  display: flex;
  flex-direction: row;
  margin-right: 2px;
`;

const MoneyBudgetP = styled.p<{ color: string }>`
  margin: 0px;
  font-size: 14px;
  font-weight: 500;
  color: ${(props) => props.color || '#666666'};
`;

const MoneyBudgetComsumpP = styled.p<{ color: string }>`
  margin: 0px;
  font-size: 14px;
  font-weight: 600;
  margin-right: 4px;
  color: ${(props) => props.color || '#666666'};
`;






interface Budget {
  categoryId: number;
  categoryName: string;
  budget: number;
  budgetWon: number;
}

interface Expenditure {
  categoryId: number;
  categoryName: string;
  used: number;
}

const SharedTravelDetailPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // useNavigate 훅으로 리다이렉트 처리
  const [showModal, setShowModal] = useState(false); // 모달 상태 추가
  const { id } = useParams<{ id: string }>();
  const travel = useSelector((state: RootState) => state.sharedTravel);
  const [expenditureData, setExpenditureData] = useState<Expenditure[]>([]);

  const { data: travelData, refetch: travelRefetch, error } = useAxios(
    `/travels/${id}`,
    'GET'
  );

  const { data: expenditureDataResponse,refetch: usedBudgetfetch } = useAxios(
    `/travels/expenditure-expenses/${id}`,
    'GET'
  );

  useEffect(() => {
    if (!travel?.travelId || travel.travelId === 0) {
      travelRefetch();
      usedBudgetfetch();
    }
  }, []);

  useEffect(() => {
    if (error) { // 에러가 발생했을 때 처리
        if (error.response?.status === 400 && error.response?.data?.code === 'T0004') {
          setShowModal(true); // 모달을 띄움
        }
      }
    else if (travelData) {
        console.log(travelData)
    
      dispatch(
        sharedTravelDataInsert({
          travelId: travelData.data.travelId,
          inviteCode: travelData.data.inviteCode,
          country: travelData.data.country,
          countryId: travelData.data.countryId,
          currency: travelData.data.currency,
          startDate: travelData.data.startDate,
          endDate: travelData.data.endDate,
          title: travelData.data.title,
          image: travelData.data.image,
          creatorId: travelData.data.creatorId,
          myTravel: travelData.data.myTravel,
          memberCount: travelData.data.memberCount,
          totalBudget: travelData.data.totalBudget,
          airportCost: travelData.data.airportCost,
          totalBudgetWon: travelData.data.totalBudgetWon,
          status: travelData.data.status,
          shareStatus: travelData.data.shareStatus,
          budgets: travelData.data.budgets,
          shared: travelData.data.shared,
        })
      );
    
    }
  }, [travelData, dispatch,error]);

  useEffect(() => {
    if (expenditureDataResponse) {
        console.log(expenditureDataResponse)
      setExpenditureData(expenditureDataResponse.data.budgetList);
    }
  }, [expenditureDataResponse]);

  const calculatePercentage = (budget: number, used: number): string => {
    used = used ? used : 0;
    return budget ? `${Math.trunc((used / budget) * 100)}%` : '0%';
  };
  
  const calculateUsed = (): number => {
    const used = expenditureData ? expenditureData.reduce((acc, item) => acc + item.used, 0) : 0;
    return isNaN(used) ? 0 : used; // NaN 체크 추가
  };

  const handleModalConfirm = () => {
    setShowModal(false);
    navigate('/feed'); // 확인 버튼을 누르면 /feed로 리다이렉트
  };

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
  const rgbaToRgb = (rgb:string) => {
    const strippedHex = rgb.split(',').slice(0,3);
    
        console.log(strippedHex.reduce((acc,item)=> acc + item + ",","")+"30%)")
    // rgba 문자열 생성
    return strippedHex.reduce((acc,item)=> acc + item + ",","")+"30%)";
  };
  return (
    <>
      <BackHeader title={travel?.title || ''}></BackHeader>
      {showModal && (
        <WarningModal
          message="여행이 존재하지 않습니다."
          onConfirm={handleModalConfirm}
        />
      )}
      <DetailDiv>
        <Img src={travel?.image || ''}></Img>
        <ContentDiv>
          <TravelCardDiv>
            <SnsTravelDetailCard
              title={travel?.title || ''}
              startDate={travel?.startDate || ''}
              endDate={travel?.endDate || ''}
              country={travel?.country || ''}
              memberCount={travel?.memberCount || 0}
              usedBudget={calculateUsed()} // you can adjust this value
              totalBudget={travel?.totalBudget || 0}
              percentage={travel?.totalBudget > 0 ? calculatePercentage(travel?.totalBudget,calculateUsed()): ''}
              currency={travel?.currency || ''}
            />
          </TravelCardDiv>
          <MoneyDiv>
  {travel?.budgets?.map((budget: Budget, index: number) => {
    const expenditure = expenditureData.find(
      (exp) => exp.categoryId === budget.categoryId
    );
    const used = expenditure?.used || 0;
    const percentageUsed = calculatePercentage(budget.budget, used);

    return (
      <div key={budget.categoryId}>
        <MoneyCategoryProgressDiv>
          <MoneyTitleDiv>
            <MoneyCategoryP>{budget.categoryName}</MoneyCategoryP>
            <MoneyComsumpP color="#00D5FF">{percentageUsed}</MoneyComsumpP>
          </MoneyTitleDiv>
          <BudgetDiv>
            <MoneyBudgetComsumpP color='#00D5FF'>{used}</MoneyBudgetComsumpP>
            <MoneyBudgetP color=''>{budget.budget} {travel.currency}</MoneyBudgetP>
          </BudgetDiv>
        </MoneyCategoryProgressDiv>
        <MoneyChartConsumpBar color={rgbaToRgb(hexToRgba("#008DE7",percentageUsed))}>
          <MoneyChartBar paid={percentageUsed} color={hexToRgba("#008DE7",percentageUsed)} />
        </MoneyChartConsumpBar>
      </div>
    );
  })}
</MoneyDiv>

        </ContentDiv>
      </DetailDiv>
    </>
  );
};

export default SharedTravelDetailPage;
