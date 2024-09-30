import React from 'react';
import styled from 'styled-components';
import SampleImg from '../../assets/travelSampleImg/sampleImg.png';

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

// const Badge = styled.div`
//   width: 70px;
//   height: 30px;
//   background-color: rgba(0, 0, 0, 0.5);
//   border-radius: 50px;
//   border: 1px solid white;
//   font-size: 12px;
//   font-weight: 500;
//   color: white;
//   display: flex; /* Flexbox 사용 */
//   justify-content: center; /* 수평 중앙 정렬 */
//   align-items: center; /* 수직 중앙 정렬 */
//   z-index: 4;
//   position: absolute;
//   top: 10px;
//   right: 10px;
// `;

const ContentTitleDiv = styled.div`
    display : flex;
    flex-direction : row;
    justify-content : space-between;
    margin : 3vw 0 2vw;
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
    font-size : 2.5vw;
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
    font-size : 4vw;
    color : white;
    margin: 0;

`
const UpcomingTravelCard = () => {
  return (
    <CardDiv>
      <TravelImg src={SampleImg} alt="Travel" />
      <Overlay />
      <BottomOverlay>
        <ContentDiv>
            <ContentTitleDiv>
                <CountryP>집에가고싶다</CountryP>
                <PriceInfoP>대한민국</PriceInfoP>
            </ContentTitleDiv>
            <DayInfoP>24.09.28 ~ 24.10.01</DayInfoP>
        </ContentDiv>
      </BottomOverlay>
    </CardDiv>
  );
};

export default UpcomingTravelCard;
