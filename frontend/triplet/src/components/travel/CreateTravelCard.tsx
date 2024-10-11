import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import SampleImg2 from '../../assets/travelSampleImg/sampleImg2.jpg';

import { ReactComponent as CreateBtn } from '../../assets/common/createBtnWhite.svg';

const PositionDiv = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 227px;
    border-radius: 20px;
    position: relative;
    overflow: hidden;
`;

const CardDiv = styled.div`
    width: 100%;
    height: 227px;
    border-radius: 20px;
    position: relative;
    overflow: hidden;
`;

const TravelImg = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;

const Overlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5); /* 반투명한 검정 오버레이 */
    z-index: 1;
`;

const ContentDiv = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 2;
`;

const TitleP = styled.p`
    font-weight: 600;
    font-size: 16px;
    color: white;
    margin : 0;
    margin-bottom: 12px;
`;

const StyledLink = styled(Link)`
    display: block;
    width: 100%;
    text-decoration: none !important;  /* 밑줄 강제로 제거 */
    color: inherit !important;         /* 링크 색상 기본값 제거 */
`;


const CreateTravelCard = () => {
    return (
        <PositionDiv>
            <StyledLink to="/travels/create">
                <CardDiv>
                    <TravelImg src={SampleImg2} alt="Travel" />
                    <Overlay />
                    <ContentDiv>
                        <TitleP>여행 계획을 생성해주세요!</TitleP>
                        <CreateBtn/>
                    </ContentDiv>
                </CardDiv>
            </StyledLink>
        </PositionDiv>
    );
};

export default CreateTravelCard;
