import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { ReactComponent as RightArrow } from '../../assets/common/rightArrow.svg';
import { ReactComponent as USFlag } from '../../assets/pay/us.svg';
import { ReactComponent as EUFlag } from '../../assets/pay/eu.svg';
import { ReactComponent as JPFlag } from '../../assets/pay/jp.svg';
import { ReactComponent as CHFlag } from '../../assets/pay/ch.svg';
import { ReactComponent as UKFlag } from '../../assets/pay/uk.svg';
import { ReactComponent as SWFlag } from '../../assets/pay/sw.svg';
import { ReactComponent as CAFlag } from '../../assets/pay/ca.svg';
import { ReactComponent as KRFlag } from '../../assets/pay/kr.svg';
import useAxios from '../../hooks/useAxios';
import { Link, useNavigate } from 'react-router-dom';

const PositionDiv = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    background-color : white;
    border-radius : 20px;
`;

const CardDiv = styled.div`
    width: 100%;
    height: 169px;
    border-radius: 20px;
    position: relative;
    overflow: hidden;
`;

const ContentDiv = styled.div`
  padding : 20px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom : 12px;
`;

const Label = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
`;

const Icon = styled.span`
  display: inline-block;
  width: 12px;
  height: 12px;
  background-color: red;
  border-radius: 50%;
`;

const Amount = styled.div`
  font-size: 20px;
  font-weight: 600;
  margin-bottom : 4px;
`;

const SubAmount = styled.div`
  font-size: 14px;
  font-weight : 500;
  color: #666666;
  margin-bottom : 12px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  gap: 80px;
`;

const Button = styled.button`
  background-color: #E6F2FF;
  color: #008DE7;
  width : 65px;
  height : 36px;
  padding: 8px 0;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: #d0e7ff;
  }
`;

const StyledLink = styled(Link)`
    display: block;
    width: 100%;
    text-decoration: none !important;  /* 밑줄 강제로 제거 */
    color: inherit !important;         /* 링크 색상 기본값 제거 */
`;


interface TravelPayProps {
  travelId : number,
}

const TravelDetailPay : React.FC<TravelPayProps> = 
  ({travelId}) => {

    const [ isButtonClicked, setIsButtonClicked ] = useState(false);

    const navigate = useNavigate();
    
    const { data : payData, error : payError, refetch : payRefetch }
    = useAxios(`travel-wallet/${travelId}`,"GET");

    useEffect(()=> {
      payRefetch();
    },[])

    useEffect(()=>{

    },[payData, payError])

    const rechargePay = () => {
      navigate(`/travels/wallet/recharge/${travelId}/${payData?.data.currency}`);
    }

    const refundPay = () => {
      navigate(`/travels/wallet/refund/${travelId}/${payData?.data.currency}`);
    }

    return (
      <PositionDiv>          
        <CardDiv>
          <ContentDiv>
            {(!isButtonClicked) ? (
              <StyledLink to={`/travels/wallet/${travelId}`}>
                <Header>
                  <Label>
                    <JPFlag />
                    여행지갑
                  </Label>
                  <RightArrow />
                </Header>
                <Amount>{payData?.data.balance||0} {payData?.data?.currency}</Amount>
                <SubAmount>9,548원</SubAmount>
              </StyledLink>
            ) : (
              <div>
                <Header>
                  <Label>
                    <JPFlag />
                    여행지갑
                  </Label>
                  <RightArrow />
                </Header>
                <Amount>{payData?.data.balance} {payData?.data?.currency}</Amount>
                <SubAmount>9,548원</SubAmount>
              </div>
            )}
            <ButtonContainer>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsButtonClicked(true);
                  rechargePay();
                }}
              >
                충전
              </Button>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsButtonClicked(true);
                  refundPay();
                }}
              >
                환급
              </Button>
            </ButtonContainer>
          </ContentDiv>
        </CardDiv>
      </PositionDiv>
    );

}

export default TravelDetailPay;