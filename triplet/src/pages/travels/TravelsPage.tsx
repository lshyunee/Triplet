import React, {useEffect} from 'react';
import Header from '../../components/header/Header';
import { useDispatch } from 'react-redux';
import { pageMove } from '../../features/navigation/naviSlice';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import TravelCard from '../../components/travel/TravelCard';
import UpcomingTravelCard from '../../components/travel/UpcomingTravelCard';
import CompleteTravelCard from '../../components/travel/CompleteTravelCard';

import { ReactComponent as CreateBtn } from '../../assets/travel/create.svg';

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
    margin-bottom : 12px;
`

const CompleteTravelDiv = styled.div`
    display : flex;
    flex-direction : column;
    margin-bottom : 32px;
`

const TravelCardDiv = styled.div`
    margin-top: 12px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(156px, 100%), 1fr));
    gap: 16px; /* 카드 사이에 16px의 간격 추가 */
    place-items: center; /* 가로, 세로축 모두 중앙 정렬 */
    justify-content: start; /* 왼쪽에서부터 아이템을 정렬 */
    margin-bottom: 26px;

    /* 그리드가 최소 2개의 열을 유지하도록 설정 */
    @media (min-width: 320px) {
        grid-template-columns: repeat(2, minmax(156px, 1fr));
    }

    @media (min-width: 768px) {
        grid-template-columns: repeat(auto-fit, minmax(156px, 1fr));
    }
`;

const CreateTravelDiv = styled.div`
    display : flex;
    justify-content : right;
    margin-bottom : 24px;
`

const TravelsPage = () => {

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(pageMove("travels"));
    }, [])

    return (
        <>
            <Header/>
            <TravelDiv>
                <OngoingTravelDiv>
                    <CategoryP>
                        진행중인 여행
                    </CategoryP>
                    <TravelCard></TravelCard>
                </OngoingTravelDiv>
                <UpcomingTravelDiv>
                    <CategoryP>
                        다가오는 여행
                    </CategoryP>
                    <TravelCardDiv>
                        <UpcomingTravelCard></UpcomingTravelCard>
                    </TravelCardDiv>
                </UpcomingTravelDiv>
                <CompleteTravelDiv>
                    <CategoryP>
                        지난 여행
                    </CategoryP>
                    <TravelCardDiv>
                        <CompleteTravelCard></CompleteTravelCard>
                        <CompleteTravelCard></CompleteTravelCard>
                        <CompleteTravelCard></CompleteTravelCard>
                        <CompleteTravelCard></CompleteTravelCard>
                        <CompleteTravelCard></CompleteTravelCard>
                        <CompleteTravelCard></CompleteTravelCard>
                        <CompleteTravelCard></CompleteTravelCard>
                        <CompleteTravelCard></CompleteTravelCard>
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