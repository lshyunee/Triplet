import React, { useEffect } from 'react';
import styled from 'styled-components';
import TravelCard from '../../components/travel/TravelCard';
import Header from '../../components/header/Header';
import { useDispatch } from 'react-redux';
import { pageMove } from '../../features/navigation/naviSlice';

import { ReactComponent as SimplePay} from '../../assets/main/simplePay.svg';
import { ReactComponent as TravelPlan} from '../../assets/main/travelPlan.svg';
import { ReactComponent as RightArrow} from '../../assets/common/rightArrow.svg';

const HomeDiv = styled.div`
    width:100%;
    height:100%;
    display:flex;
    flex-direction : column;
    align-items : center;
    background-color : #F3F4F6;

    > * {
        margin-bottom : 12px;
    }
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
    box-sizing: border-box;
    width : 328px;
    height : 64px;
    display : flex;
    flex-direction : row;
    background-color : white;
    border-radius : 20px;
    align-items: center;
    padding-left : 12px;
    padding-right: 12px;
    justify-content : space-between;
    
    ${TitleP}{
        margin-left: 12px;
    }
`

const TitleDiv = styled.div`
    box-sizing: border-box;
    width: 100%;
    display : flex;
    flex-direction : row;
    align-items: center;
    justify-content : space-between;
`;

const DetailP = styled.p`
    font-size: 14px;
    font-weight : 400;
    color : #666666;
    margin : 0px;
`;

const MoneyP = styled.p`
    font-size:16px;
    font-weight : 600;
`

const MiddleDiv = styled.div`
    box-sizing: border-box;
    width : 328px;
    height : 133px;
    display : flex;
    flex-direction : column;
    background-color : white;
    border-radius : 20px;
    padding : 14px;


    ${MoneyP}{
        margin-top : 12px;
        margin-bottom : 0px;
    }

    ${DetailP} {
        margin-top : 24px;
    }

    ${TitleDiv}{
       text-align : center;
        ${TitleP}{
            margin-top : 0px;
            margin-bottom : 0px;
        }
    }
`;

const SendBtn = styled.button`
    width: 65px;
    height: 36px;
    border-radius : 50px;
    border : none;
    background-color : #E6F2FF;
    color: #008DE7;
`;

const LargeDiv = styled.div`
    box-sizing: border-box;
    width : 328px;
    height : 235px;
    display : flex;
    flex-direction : column;
    background-color : white;
    border-radius : 20px;
    align-items: center;
    padding : 16px;
    
    ${TitleP}{
        margin-top : 0px;
        margin-bottom : 0px;
    }

    ${DetailP} {
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
            <MiddleDiv>
                <TitleDiv>
                    <TitleP>내 통장</TitleP>
                    <RightArrow/>
                </TitleDiv>
                <DetailP>은행 312-9446-0093</DetailP>
                <TitleDiv>
                    <MoneyP>20,000,000원</MoneyP>
                    <SendBtn>
                        송금
                    </SendBtn>
                </TitleDiv>
            </MiddleDiv>
            <LargeDiv>
                <TitleDiv>
                    <TitleP>내 외화 지갑</TitleP>
                    <RightArrow/>
                </TitleDiv>
            </LargeDiv>
        </HomeDiv>
    );
};

export default HomePage;