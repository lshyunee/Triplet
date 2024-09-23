import React from 'react';
import styled from 'styled-components';
import { ReactComponent as USFlag } from '../../assets/pay/us.svg';
import { ReactComponent as EUFlag } from '../../assets/pay/eu.svg';
import { ReactComponent as JPFlag } from '../../assets/pay/jp.svg';
import { ReactComponent as CHFlag } from '../../assets/pay/ch.svg';
import { ReactComponent as UKFlag } from '../../assets/pay/uk.svg';
import { ReactComponent as SWFlag } from '../../assets/pay/sw.svg';
import { ReactComponent as CAFlag } from '../../assets/pay/ca.svg';
import { ReactComponent as UpperArrow } from '../../assets/pay/upperArrow.svg';
import { ReactComponent as LowerArrow } from '../../assets/pay/lowerArrow.svg';

const s = {
  Containter: styled.div`
    display: flex;
    justify-content: space-between;
    padding: 10px 20px;
    align-items: center;
  `,
  Country: styled.span`
    font-size: 14px;
    font-weight: 500;
    margin-left: 12px;
  `,
  CountryArea: styled.div`
    display: flex;
    align-items: center;
  `,
  ForeignCurrency: styled.span`
    font-size: 16px;
    font-weight: 600;
  `,
  RedRate: styled.span`
    font-size: 12px;
    font-weight: 500;
    color: #EB5C5C;
    margin-left: 2px;
  `,
  BlueRate: styled.span`
    font-size: 12px;
    font-weight: 500;
    color: #3290FF;
    margin-left: 2px;
  `,
  RateArea: styled.div`
    display: flex;
    margin-left: 12px;
  `,
  RightArea: styled.div`
    display: flex;
  `,
}


interface GlobalAccountProps {
  nation: String;
  foreignCurrency: number;
  isRise: boolean;
  rate: number;
};


const ExchangeRate = (props: GlobalAccountProps): JSX.Element => {
  const { nation, foreignCurrency, isRise, rate } = props;

  return (
    <>
    <s.Containter>
      {(() => {
        switch (nation) {
          case "미국":
            return <s.CountryArea><USFlag/><s.Country>미국 USD</s.Country></s.CountryArea>
          case "유럽":
            return <s.CountryArea><EUFlag/><s.Country>유럽 EUR</s.Country></s.CountryArea>
          case "일본":
            return <s.CountryArea><JPFlag/><s.Country>일본 JPY</s.Country></s.CountryArea>
          case "중국":
            return <s.CountryArea><CHFlag/><s.Country>중국 CNY</s.Country></s.CountryArea>
          case "영국":
            return <s.CountryArea><UKFlag/><s.Country>영국 GBP</s.Country></s.CountryArea>
          case "스위스":
            return <s.CountryArea><SWFlag/><s.Country>스위스 CHF</s.Country></s.CountryArea>
          case "캐나다":
            return <s.CountryArea><CAFlag/><s.Country>캐나다 CAD</s.Country></s.CountryArea>
        }
      }) ()}

      <s.RightArea>
        <s.ForeignCurrency>{(foreignCurrency.toLocaleString(undefined, {minimumFractionDigits: 2}))}원</s.ForeignCurrency>
        {isRise === true ? (
        <s.RateArea>
          <UpperArrow/>
          <s.RedRate>{rate.toFixed(2)}%</s.RedRate>
        </s.RateArea>
        ) : (
        <s.RateArea>
          <LowerArrow/>
          <s.BlueRate>{rate.toFixed(2)}%</s.BlueRate>
        </s.RateArea>
        )}
        
      </s.RightArea>
    </s.Containter>
    </>
  );
}

export default ExchangeRate;