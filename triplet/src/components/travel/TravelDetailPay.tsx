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

const PositionDiv = styled.div`
    width: 100%;
    height: 165px;
    display: flex;
    background-color : white;
    border-radius : 20px;
`;

const CardDiv = styled.div`
    width : 100%;
    display : flex;
    flex-direction : column;
    padding : 20px;
    border-radius: 20px;
    position: relative;
    overflow: hidden;
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

const TravelDetailPay = () => {
    
    return (
        <PositionDiv>
            <CardDiv>
                <Header>
                    <Label>
                        <JPFlag/>
                        여행지갑
                    </Label>
                    <RightArrow/>
                </Header>
                <Amount>1,011.00 JPY</Amount>
                <SubAmount>9,548원</SubAmount>
                <ButtonContainer>
                    <Button>충전</Button>
                    <Button>환급</Button>
                </ButtonContainer>
            </CardDiv>
        </PositionDiv>
    );

}

export default TravelDetailPay;