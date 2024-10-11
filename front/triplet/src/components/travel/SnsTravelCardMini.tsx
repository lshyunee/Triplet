import React from 'react';
import styled from 'styled-components';
import SampleImg from '../../assets/travelSampleImg/sampleImg.png';
import { Link } from 'react-router-dom';

const CardDiv = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end; /* 아래쪽에 텍스트 배치 */
`;

const TravelImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4); /* 반투명한 검정 오버레이 */
  z-index: 2;
`;

const BottomOverlay = styled.div`
  position: relative;
  width: 100%;
  height : 40%;
  background-color: rgba(0, 0, 0, 0.5); /* 하단 반투명 오버레이 */
  backdrop-filter: blur(3px); /* 블러 처리 추가 */
  z-index: 3;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const StyledLink = styled(Link)`
    display: block;
    width: 100%;
    text-decoration: none !important;  /* 밑줄 강제로 제거 */
    color: inherit !important;         /* 링크 색상 기본값 제거 */
`;

const ContentTitleDiv = styled.div`
    display : flex;
    flex-direction : row;
    justify-content : space-between;
    margin : 2vw 0 2vw;
`;

const ContentDiv = styled.div`
  height : 100%;
  z-index: 4;
  color: white;
  font-weight: 600;
  display: flex;
  flex-direction : column;
  padding: 0 2.5vw;
  margin-left : 1vw;
`;

const PriceInfoP = styled.p`
    font-weight: 400;
    font-size : 3.5vw;
    color : white;
    margin: 0;
    display : flex;
    align-items : center;
`;

const DayInfoP = styled.p`
    font-weight: 400;
    font-size : 3.5vw;
    color : white;
    margin: 0;
    display : flex;
    align-items : center;
`

const CountryP = styled.p`
    font-weight : 500;
    font-size : 4.5vw;
    color : white;
    margin: 0;

`

interface TravelDataProps {
  travelId : number,
  title : string,
  days : number,
  totalBudgetWon : number,
  memberCount : number,
  image : string,
}

const SnsTravelCardMini : React.FC<TravelDataProps> = ({
  travelId,title, days, totalBudgetWon, memberCount, image 
 }) => {
  return (
  <StyledLink to={`/feed/${travelId}/detail`}>
      <CardDiv>
        <TravelImg src={image} alt="Travel" />
        <Overlay />
        <BottomOverlay>
          <ContentDiv>
              <ContentTitleDiv>
                  <CountryP>{title}</CountryP>
                  <PriceInfoP>{days}일</PriceInfoP>
              </ContentTitleDiv>
              <DayInfoP>{totalBudgetWon}원/{memberCount}인</DayInfoP>
          </ContentDiv>
        </BottomOverlay>
      </CardDiv>
    </StyledLink>
  );
};

export default SnsTravelCardMini;
