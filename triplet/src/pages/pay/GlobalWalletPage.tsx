import React, {useEffect} from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { pageMove } from '../../features/navigation/naviSlice';
import BackHeader from '../../components/header/BackHeader';
import Header from '../../components/header/Header';
import ExchangeRate from '../../components/pay/ExchangeRate';
import GlobalAccount from '../../components/pay/GlobalAccount';
import useAxios from '../../hooks/useAxios';



const s = {
  Container: styled.div`
    background-color: #F3F4F6;
    min-height: calc(100vh - 112px);
    margin-top: 56px;
	margin-bottom : 56px;
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
	GlobalAccountCard: styled.div`
		background-color: #FFFFFF;
		border-radius: 20px;
		padding: 10px 0;
		margin-bottom: 12px;
	`,
	TitleText: styled.div`
		font-size: 16px;
		font-weight: 600;
		margin: 12px 4px;
	`
}


const GlobalWalletPage = () => {
  const dispatch = useDispatch();

  const { data: foreignAccountData, 
    error: foreignAccountError, 
    loading: foreignAccountLoading, 
    status: foreignAccountStatus, 
    refetch: foreignAccountRefetch } = useAxios('/foreign-account', 'GET');

	const { data: exchangeRateData, 
		error: exchangeRateError, 
		loading: exchangeRateLoading, 
		status: exchangeRateStatus, 
		refetch: exchangeRateRefetch } = useAxios('/exchange-rate-list', 'GET');

  useEffect(() => {
    const fetchData = async () => {
			try {
			await Promise.all([
				foreignAccountRefetch(),  // 외화계좌 API 요청
				exchangeRateRefetch(),  // 전체 환율 API 요청
			]);
			} catch (error) {
			console.error('Error fetching data:', error);
			}
		};
    dispatch(pageMove("pay"));
    fetchData();
  }, []);


  return (
    <>
    <Header/>
    <s.Container>
			<s.TitleText>내 외화 지갑</s.TitleText>
			<s.GlobalAccountCard>
				<GlobalAccount
					nation='미국'
					foreignCurrency={foreignAccountData?.data[6]?.accountBalance}
					isExchange={true}
				/>
			</s.GlobalAccountCard>
			<s.GlobalAccountCard>
				<GlobalAccount
					nation='유럽'
					foreignCurrency={foreignAccountData?.data[3]?.accountBalance}
					isExchange={true}
				/>
			</s.GlobalAccountCard>
			<s.GlobalAccountCard>
				<GlobalAccount
					nation='일본'
					foreignCurrency={foreignAccountData?.data[5]?.accountBalance}
					isExchange={true}
				/>
			</s.GlobalAccountCard>
			<s.GlobalAccountCard>
				<GlobalAccount
					nation='중국'
					foreignCurrency={foreignAccountData?.data[2]?.accountBalance}
					isExchange={true}
				/>
			</s.GlobalAccountCard>
			<s.GlobalAccountCard>
				<GlobalAccount
					nation='영국'
					foreignCurrency={foreignAccountData?.data[4]?.accountBalance}
					isExchange={true}
				/>
			</s.GlobalAccountCard>
			<s.GlobalAccountCard>
				<GlobalAccount
					nation='스위스'
					foreignCurrency={foreignAccountData?.data[1]?.accountBalance}
					isExchange={true}
				/>
			</s.GlobalAccountCard>
			<s.GlobalAccountCard>
				<GlobalAccount
					nation='캐나다'
					foreignCurrency={foreignAccountData?.data[0]?.accountBalance}
					isExchange={true}
				/>
			</s.GlobalAccountCard>
			<s.Card>
				<s.CardTitleArea>
					<s.CardTitle>실시간 환율</s.CardTitle>
				</s.CardTitleArea>
				<s.CurrencyArea>
					<ExchangeRate
						nation='미국'
						foreignCurrency={exchangeRateData?.data[5]?.exchangeRate}
						isRise={exchangeRateData?.data[5]?.changeStatus}
						rate={exchangeRateData?.data[5]?.changePercentage}
					/>
					<ExchangeRate
						nation='유럽'
						foreignCurrency={exchangeRateData?.data[3]?.exchangeRate}
						isRise={exchangeRateData?.data[3]?.changeStatus}
						rate={exchangeRateData?.data[3]?.changePercentage}
					/>
					<ExchangeRate
						nation='일본'
						foreignCurrency={exchangeRateData?.data[6]?.exchangeRate}
						isRise={exchangeRateData?.data[6]?.changeStatus}
						rate={exchangeRateData?.data[6]?.changePercentage}
					/>
					<ExchangeRate
						nation='중국'
						foreignCurrency={exchangeRateData?.data[2]?.exchangeRate}
						isRise={exchangeRateData?.data[2]?.changeStatus}
						rate={exchangeRateData?.data[2]?.changePercentage}
					/>
					<ExchangeRate
						nation='영국'
						foreignCurrency={exchangeRateData?.data[0]?.exchangeRate}
						isRise={exchangeRateData?.data[0]?.changeStatus}
						rate={exchangeRateData?.data[0]?.changePercentage}
					/>
					<ExchangeRate
						nation='스위스'
						foreignCurrency={exchangeRateData?.data[4]?.exchangeRate}
						isRise={exchangeRateData?.data[4]?.changeStatus}
						rate={exchangeRateData?.data[4]?.changePercentage}
					/>
					<ExchangeRate
						nation='캐나다'
						foreignCurrency={exchangeRateData?.data[1]?.exchangeRate}
						isRise={exchangeRateData?.data[1]?.changeStatus}
						rate={exchangeRateData?.data[1]?.changePercentage}
					/>
				</s.CurrencyArea>
			</s.Card>
    </s.Container>
    </>
  );
};

export default GlobalWalletPage;