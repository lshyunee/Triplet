import React, { useEffect } from 'react';
import styled from 'styled-components';
import OngoingTravelCard from '../../components/travel/OngoingTravelCard';
import Header from '../../components/header/Header';
import { useDispatch } from 'react-redux';
import { pageMove } from '../../features/navigation/naviSlice';

import { ReactComponent as SimplePay} from '../../assets/main/simplePay.svg';
import { ReactComponent as TravelPlan} from '../../assets/main/travelPlan.svg';
import { ReactComponent as RightArrow} from '../../assets/common/rightArrow.svg';

import { ReactComponent as USFlag } from '../../assets/pay/us.svg';
import { ReactComponent as EUFlag } from '../../assets/pay/eu.svg';
import { ReactComponent as JPFlag } from '../../assets/pay/jp.svg';
import { ReactComponent as CHFlag } from '../../assets/pay/ch.svg';
import { ReactComponent as UKFlag } from '../../assets/pay/uk.svg';
import { ReactComponent as SWFlag } from '../../assets/pay/sw.svg';
import { ReactComponent as CAFlag } from '../../assets/pay/ca.svg';

const MainDiv = styled.div`
    background-color: #F3F4F6;
    min-height : 100vh;
`

const HomeDiv = styled.div`
    display: flex;
    flex-direction: column;
    padding-top: 68px; /* Header의 높이만큼 패딩을 추가 */
    padding-bottom : 56px;
    margin : 0 16px;
`;

const TitleP = styled.p`
    font-size:16px;
    font-weight : 600;
`

const LittleTitleDiv = styled.div`
    display:flex;
    flex-direction:row;
    align-items:center;
`;

const LittleDiv = styled.div`
    width: 100%;
    box-sizing: border-box;
    height : 64px;
    display : flex;
    flex-direction : row;
    background-color : white;
    border-radius : 20px;
    align-items: center;
    padding : 16px;
    justify-content : space-between;
    margin-top : 12px;
    
    ${TitleP}{
        margin-left: 12px;
    }
`

const TitleDiv = styled.div`
    height : 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const DetailP = styled.p`
    font-size: 14px;
    font-weight : 400;
    color : #666666;
`;

const LargeDiv = styled.div`
    height : 200px;
    background-color: #ffffff;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    padding : 20px;
    margin-bottom : 32px;
`;

const Card = styled.div`
    background-color: #ffffff;
    border-radius: 20px;
    margin-bottom: 12px;
    padding : 20px;
    display: flex;
    flex-direction: column;
    margin-top : 12px;
`;

const CardTitle = styled.span`
    font-size: 16px;
    font-weight: 600;
`;

const CardTitleArea = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const CardCaption = styled.span`
    font-size: 14px;
    font-weight: 400;
    color: #666666;
    padding-top: 24px;
`;

const CardContent = styled.span`
    font-size: 16px;
    font-weight: 600;
    align-self: flex-end;
`;

const CardButton = styled.button`
    border: 0;
    background-color: #E6F2FF;
    color: #008DE7;
    font-size: 14px;
    font-weight: 600;
    width: 65px;
    height: 36px;
    border-radius: 50px;
`;

const ButtonArea = styled.div`
    display: flex;
    justify-content: space-between;
`;

const HomePage = () => {

    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(pageMove("home"));
    }, [])

    return (
        <MainDiv>
            <Header/>
            <HomeDiv>
                <OngoingTravelCard/>
                <LittleDiv>
                    <LittleTitleDiv>
                        <SimplePay/>
                        <TitleP>간편결제</TitleP>
                    </LittleTitleDiv>
                    <RightArrow/>
                </LittleDiv>
                <LittleDiv>
                    <LittleTitleDiv>
                        <TravelPlan/>
                        <TitleP>여행 계획 만들기</TitleP>
                    </LittleTitleDiv>
                    <RightArrow/>
                </LittleDiv>
                <Card>
                    <CardTitleArea>
                        <CardTitle>내 통장</CardTitle>
                        <RightArrow/>
                    </CardTitleArea>
                    <CardCaption>은행 312-9446-0093</CardCaption>
                    <ButtonArea>
                        <CardContent>20,000,000원</CardContent>
                        <CardButton>송금</CardButton>
                    </ButtonArea>
                </Card>
                <LargeDiv>
                    <TitleDiv>
                        <TitleP>내 외화 지갑</TitleP>
                        <RightArrow/>
                    </TitleDiv>
                </LargeDiv>
            </HomeDiv>
        </MainDiv>
    );
};

export default HomePage;