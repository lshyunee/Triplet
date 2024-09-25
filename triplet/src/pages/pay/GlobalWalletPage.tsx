import React, {useEffect} from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { pageMove } from '../../features/navigation/naviSlice';
import BackHeader from '../../components/header/BackHeader';
import Header from '../../components/header/Header';
import ExchangeRate from '../../components/pay/ExchangeRate';



const s = {
  Container: styled.div`
    background-color: #F3F4F6;
    min-height: calc(100vh - 112px);
    margin-top: 56px;
    padding: 0 16px 0;
  `,
  Card: styled.div`
    background-color: #ffffff;
    border-radius: 20px;
    /* margin: 0 16px; */
    margin-bottom: 12px;
    display: flex;
    flex-direction: column;
  `,
  CurrencyArea: styled.div`
		margin-top: 10px;
		margin-bottom: 10px;
	`,
	CardTitle: styled.span`
		font-size: 16px;
		font-weight: 600;
	`,
	CardTitleArea: styled.div`
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin: 0 20px;
		padding-top: 20px;
	`,
}


const GlobalWalletPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(pageMove("pay"));
  }, []);


  return (
    <>
    <Header/>
    <s.Container>
    <s.Card>
					<s.CardTitleArea>
						<s.CardTitle>실시간 환율</s.CardTitle>
					</s.CardTitleArea>
					<s.CurrencyArea>
						<ExchangeRate
							nation='미국'
							foreignCurrency={1344.71}
							isRise={true}
							rate={0.20}
						/>
						<ExchangeRate
							nation='유럽'
							foreignCurrency={1344.71}
							isRise={true}
							rate={0.20}
						/>
						<ExchangeRate
							nation='일본'
							foreignCurrency={1344.71}
							isRise={false}
							rate={0.20}
						/>
						<ExchangeRate
							nation='중국'
							foreignCurrency={1344.71}
							isRise={true}
							rate={0.20}
						/>
						<ExchangeRate
							nation='영국'
							foreignCurrency={1344.71}
							isRise={true}
							rate={0.20}
						/>
						<ExchangeRate
							nation='스위스'
							foreignCurrency={1344.71}
							isRise={true}
							rate={0.20}
						/>
						<ExchangeRate
							nation='캐나다'
							foreignCurrency={1344.71}
							isRise={false}
							rate={0.20}
						/>
					</s.CurrencyArea>
				</s.Card>
    </s.Container>
    </>
  );
};

export default GlobalWalletPage;