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
import {ReactComponent as PayImg} from '../../assets/pay/payCompleted.svg';


const s = {
	Container: styled.div`
    display: flex;
    margin-top: 56px;
    height: calc(100vh - 112px);
    padding: 0 16px;
    flex-direction: column;
    align-items: center; 
    // padding-bottom: 56px;
  `,
  Caption: styled.div`
    margin-top: 36px;
    font-size: 16px;
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
    margin-top: 169px;
    margin-bottom: 36px;
    font-size: 24px;
    font-weight: 700;
    color: #000000;
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


const QRCompletePage = () => {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(pageMove("pay"));
	}, []);


	return (
		<>
			<BackHeader title='결제'/>
			<s.Container>
                <s.MerchantName>결제 완료</s.MerchantName>
                <PayImg/>
                <s.Caption>결제가 정상적으로 처리되었습니다.</s.Caption>
                <s.BtnArea>
                    <s.PayBtn>확인</s.PayBtn>
                </s.BtnArea>
			</s.Container>
		</>
	);
};

export default QRCompletePage;