import React from 'react';
import styled from 'styled-components';
import SampleImg from '../../assets/travelSampleImg/sampleImg.png';

const CardDiv = styled.div`
  width: 156px;
  height: 156px; /* 카드 높이를 좀 더 늘림 */
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
  height: 63px;
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
    margin-bottom : 8px;
`;

const ContentDiv = styled.div`
  z-index: 4;
  color: white;
  font-size: 14px;
  font-weight: 600;
  display: flex;
    flex-direction : column;
  padding: 12px;
`;

const PriceInfoP = styled.p`
    font-weight: 400;
    font-size : 12px;
    color : white;
    margin: 0;
`;

const CountryP = styled.p`
    font-weight : 500;
    font-size : 14px;
    color : white;
    margin: 0;
`

const SnsTravelCardMini = () => {
  return (
    <CardDiv>
      <TravelImg src={SampleImg} alt="Travel" />
      <Overlay />
      <BottomOverlay>
        <ContentDiv>
            <ContentTitleDiv>
                <CountryP>일본</CountryP>
                <PriceInfoP>5일</PriceInfoP>
            </ContentTitleDiv>
            <PriceInfoP>2,000,000원/3인</PriceInfoP>
        </ContentDiv>
      </BottomOverlay>
    </CardDiv>
  );
};

export default SnsTravelCardMini;
