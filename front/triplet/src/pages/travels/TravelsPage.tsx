import React, {useEffect} from 'react';
import Header from '../../components/header/Header';
import { useSelector, useDispatch } from 'react-redux';
import { pageMove } from '../../features/navigation/naviSlice';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import OngoingTravelCard from '../../components/travel/OngoingTravelCard';
import UpcomingTravelCard from '../../components/travel/UpcomingTravelCard';
import CompleteTravelCard from '../../components/travel/CompleteTravelCard';

import { ReactComponent as CreateBtn } from '../../assets/travel/create.svg';
import { RootState } from '../../store';
import { addCompletedTravels, setCompletedTravels, selectAllCompletedTravelIds } from '../../features/travel/completedTravelSlice';
import { addUpcomingTravels, selectAllUpcomingTravelIds, setUpcomingTravels } from '../../features/travel/upcomingTravelSlice';
import useAxios from '../../hooks/useAxios';
import { selectOngoingTravelId } from '../../features/travel/ongoingTravelSlice';

const TravelDiv = styled.div`
    min-height : calc(100vh - 56px);
    background-color : #F3F4F6;
    display : flex;
    flex-direction : column;
    margin : 56px 0;
    padding : 0 16px;
`;

const CategoryP = styled.p`
    font-size : 14px;
    font-weight : 500;
    color : #888888;
    padding : 0;
    margin-bottom : 8px;
`

const OngoingTravelDiv = styled.div`
    display : flex;
    flex-direction : column;
    margin-top : 12px;
    margin-bottom : 28px;
`

const UpcomingTravelDiv = styled.div`
    display : flex;
    flex-direction : column;
    margin-bottom : 26px;
`

const CompleteTravelDiv = styled.div`
    display : flex;
    flex-direction : column;
    margin-bottom : 32px;
`

const TravelCardDiv = styled.div`
    margin-top: 12px;
    display: grid;
    grid-template-columns: repeat(2, minmax(min(100px,100%), 1fr));
    gap: 16px; /* 카드 사이에 16px의 간격 추가 */
    place-items: center; /* 가로, 세로축 모두 중앙 정렬 */
    justify-content: start; /* 왼쪽에서부터 아이템을 정렬 */

    
  @media(min-width : 700px){
    justify-content : center;
  }
`;

const CreateTravelDiv = styled.div`
    display : flex;
    justify-content : right;
    margin-bottom : 24px;
`

const StyledLink = styled(Link)`
    display: block; /* Link를 블록 요소로 변환 */
    width: 100%; /* 필요한 경우 너비를 100%로 설정 */
`;

const TravelsPage = () => {

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(pageMove("travels"));

        upcomingRefetch();
        completedRefetch();

    }, [])

    const { data : upcomingData, error : upcomingError, status : upcomingStatus,
        refetch : upcomingRefetch
     } = useAxios("/travels/upcoming", "GET");

     const { data : completedData, error : completedError, status : completedStatus,
        refetch : completedRefetch
     } = useAxios("/travels/completed", "GET");

    useEffect(() => {

        if (upcomingData && upcomingStatus === 200) {
            dispatch(addUpcomingTravels(upcomingData.data));
          }

    }, [upcomingData, upcomingError])

    
    useEffect(()=>{

        if(completedData && completedStatus === 200){
            dispatch(addCompletedTravels(completedData.data));
        }

    },[completedData, completedError])

    const completedTravelIds: number[] = useSelector(selectAllCompletedTravelIds);
    const upcomingTravelIds : number[] = useSelector(selectAllUpcomingTravelIds);

    return (
        <>
            <Header/>
            <TravelDiv>
                <OngoingTravelDiv>
                    <CategoryP>
                        진행중인 여행
                    </CategoryP>
                    <OngoingTravelCard />
                </OngoingTravelDiv>
                <UpcomingTravelDiv>
                    <CategoryP>
                        다가오는 여행
                    </CategoryP>
                    <TravelCardDiv>
                        {upcomingTravelIds.map((id:number) =>(
                            <UpcomingTravelCard key={id} travelId={id}/>
                        ))}
                    </TravelCardDiv>
                </UpcomingTravelDiv>
                <CompleteTravelDiv>
                    <CategoryP>
                        지난 여행
                    </CategoryP>
                    <TravelCardDiv>
                        {completedTravelIds.map((id:number) =>(
                            <CompleteTravelCard key={id} travelId={id}/>
                        ))}
                    </TravelCardDiv>
                </CompleteTravelDiv>
                <CreateTravelDiv>
                    <Link to="/travels/create">
                        <CreateBtn></CreateBtn>                    
                    </Link>
                </CreateTravelDiv>
            </TravelDiv>
        </>
    );
};

export default TravelsPage;