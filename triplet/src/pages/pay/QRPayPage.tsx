import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import { ReactComponent as RightArrow } from '../../assets/pay/rightArrow.svg';
import GlobalAccount from '../../components/pay/GlobalAccount';
import ExchangeRate from '../../components/pay/ExchangeRate';
import Header from '../../components/header/Header';
import { useDispatch } from 'react-redux';
import { pageMove } from '../../features/navigation/naviSlice';
import { Navigate, useNavigate } from 'react-router-dom';
import BackHeader from '../../components/header/BackHeader';


const s = {
	Container: styled.div`
    // margin-top: 56px;
    height: calc(100vh - 112px);
    padding: 0 16px;
    // padding-bottom: 56px;
  `,
    QrScannerOverlayText: styled.div`
        position: absolute;
        color: white;
        font-size: 18px;
        top: 10%; 
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 10; 
    `,
    InputArea: styled.div`
    margin-bottom: 24px;
    width: 100%;
    display: flex;
    align-items: center;
    `,
    ExchangeInput: styled.select`
    font-size: 14px;
    font-weight: 500;
    background-color: #F9FAFC;
    border: solid 1px #F0F0F0;
    border-radius: 10px;
    height: 44px;
    width: 100%;
    padding: 0 16px;
    // appearance: none;
  ` ,
    PayInput: styled.input`
      font-size: 14px;
      font-weight: 500;
      background-color: #F9FAFC;
      border: solid 1px #F0F0F0;
      border-radius: 10px;
      height: 44px;
      width: 50%;
      padding: 0 16px;
      box-sizing: border-box;
    `,
  Caption: styled.div`
    margin-bottom: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #666666;
  `,
  MerchantCaption: styled.div`
    margin-top: 148px;
    margin-bottom: 4px;
    font-size: 14px;
    font-weight: 400;
    color: #666666;
  `,
  PayBtn: styled.button`
    width:100%;
    height:44px;
    color : white;
    background-color : #008DE7;
    border-radius : 10px;
    border : none;
    box-sizing: border-box;
    margin: 0 16px;
    padding : 14px;
`,
MerchantName: styled.div`
    margin-bottom: 24px;
    font-size: 20px;
    font-weight: 600;
    color: #000000;
  `,
  Currency: styled.span`
    font-size: 14px;
    margin-left: 8px;
  `,
  BtnArea: styled.div`
    display: flex;
    position: fixed;
    bottom: 84px;
    width: 100%;
    left: 0;
    right: 0;    
  `,
}


const QRPayPage = () => {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(pageMove("pay"));
	}, []);


	return (
		<>
			<BackHeader title='결제'/>
			<s.Container>
          <s.MerchantCaption>가맹점</s.MerchantCaption>
          <s.MerchantName>롯데리아</s.MerchantName>
          
          <s.Caption>결제 금액</s.Caption>
          <s.InputArea>
            <s.PayInput defaultValue={'1,500'}></s.PayInput>
            <s.Currency>JPY</s.Currency>
          </s.InputArea>

          <s.Caption>결제 지갑</s.Caption>
          <s.InputArea>
            <s.ExchangeInput>
              <option>내 여행 지갑</option>
              <option>기타 지갑</option>
            </s.ExchangeInput>
            </s.InputArea>

          <s.BtnArea><s.PayBtn>결제하기</s.PayBtn></s.BtnArea>
			</s.Container>
		</>
	);
};

export default QRPayPage;