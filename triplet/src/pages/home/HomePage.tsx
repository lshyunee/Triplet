import React, { useEffect } from 'react';
import styled from 'styled-components';
import TravelCard from '../../components/travel/TravelCard';
import Header from '../../components/header/Header';
import { useDispatch } from 'react-redux';
import { pageMove } from '../../features/navigation/naviSlice';

const HomeDiv = styled.div`
    display:flex;
    flex-direction : column;
    align-items : center;
    
    > * {
        margin-bottom : 12px;
    }
`;

const HomePage = () => {

    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(pageMove("home"));
    }, [])

    return (
        <HomeDiv>
            <Header/>
            <TravelCard/>
            <div>홈</div>
        </HomeDiv>
    );
};

export default HomePage;