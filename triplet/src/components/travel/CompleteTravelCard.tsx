import React from 'react';
import styled from 'styled-components';
import SampleImg from '../../assets/travelSampleImg/sampleImg.png';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectCompletedTravelByTitleId } from '../../features/travel/completedTravelSlice';
import { RootState } from '../../store';

const CardDiv = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;

  @media(min-width : 700px){
    width : 90%;
  }
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
  padding: 0 2vw;
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
    font-size : 3vw;
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

`;

const StyledLink = styled(Link)`
    display: block;
    width: 100%;
    text-decoration: none !important;  /* 밑줄 강제로 제거 */
    color: inherit !important;         /* 링크 색상 기본값 제거 */
`;

interface CompleteTravelCardProps {
  travelId : number;
}

const CompleteTravelCard: React.FC<CompleteTravelCardProps> = ({travelId}) => {

  const travel:number = travelId;
  
  const travelData = useSelector((state : RootState) => selectCompletedTravelByTitleId(state, travel)) || null;

  return (
    <StyledLink to={`/travels/completed/${travel}/detail`}> 
      <CardDiv>
        <TravelImg src={SampleImg} alt="Travel" />
        <Overlay />
        <BottomOverlay>
          <ContentDiv>
              <ContentTitleDiv>
                  <CountryP>{travelData?.title}</CountryP>
                  <PriceInfoP>{travelData?.countryName}</PriceInfoP>
              </ContentTitleDiv>
              <DayInfoP>{travelData?.startDate ? new Date(travelData.startDate).toLocaleDateString() : ''} ~ 
                {travelData?.endDate ? new Date(travelData.endDate).toLocaleDateString() : ''}</DayInfoP>
          </ContentDiv>
        </BottomOverlay>
      </CardDiv>
    </StyledLink>
  );
};

export default CompleteTravelCard;
