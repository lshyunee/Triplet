import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import { ReactComponent as RightArrow } from '../../assets/pay/rightArrow.svg';
import GlobalAccount from '../../components/pay/GlobalAccount';
import ExchangeRate from '../../components/pay/ExchangeRate';
import Header from '../../components/header/Header';
import { useDispatch } from 'react-redux';
import { pageMove } from '../../features/navigation/naviSlice';
import { Navigate, useNavigate } from 'react-router-dom';
import useAxios from '../../hooks/useAxios';


const s = {
	Container: styled.div`
		background-color: #F3F4F6;
		/* height: 100%; */
		padding-top: 68px;
		padding-bottom: 72px;
	`,
	Card: styled.div`
		background-color: #ffffff;
		border-radius: 20px;
		margin: 0 16px;
		margin-bottom: 12px;
		display: flex;
		flex-direction: column;
	`,
	MyCard: styled.div`
		background-color: #ffffff;
		border-radius: 20px;
		margin: 0 16px;
		margin-bottom: 12px;
		cursor: pointer;
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
	CardCaption: styled.span`
		font-size: 14px;
		font-weight: 400;
		color: #666666;
		margin: 0 20px;
		padding-top: 24px;
	`,
	CardContent: styled.span`
		font-size: 16px;
		font-weight: 600;
		align-self: flex-end;
	`,
	CardButton: styled.button`
		border: 0;
		background-color: #E6F2FF;
		color: #008DE7;
		font-size: 14px;
		font-weight: 600;
		width: 65px;
		height: 36px;
		border-radius: 50px;
		cursor: pointer;
	`,
	ButtonArea: styled.div`
		display: flex;
		justify-content: space-between;
		margin: 0 20px;
		padding-bottom: 20px;
	`,
	CreateButton: styled.button`
		background-color: #008DE7;
		border: 0;
		color: #ffffff;
		font-size: 14px;
		font-weight: 600;
		width: 100%;
		height: 44px;
		border-radius: 10px;
		margin-top: 12px;
		cursor: pointer;
	`,
}


const PayPage = () => {
	const dispatch = useDispatch();

	const { data: accountData, 
		error: accountError, 
		loading: accountLoading, 
		status: accountStatus, 
		refetch: accountRefetch } = useAxios('/account', 'GET');

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
				accountRefetch(),     // 원화계좌 API 요청
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

	const navigate = useNavigate();

	const accountOnClick = () => {
		navigate('/pay/account-detail');
	};
	
	const onclick = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		window.alert('야호');
	};

	const walletOnClick = () => {
		navigate('/pay/global-wallet');
	};

	return (
		<>
			<Header/>
			<s.Container>
				<s.MyCard onClick={accountOnClick}>
					<s.CardTitleArea>
						<s.CardTitle>{accountData?.data?.accountName}</s.CardTitle>
						<RightArrow/>
					</s.CardTitleArea>
					<s.CardCaption>{accountData?.data?.bankName} {accountData?.data?.accountNumber}</s.CardCaption>
					<s.ButtonArea>
						<s.CardContent>{accountData?.data?.accountBalance} 원</s.CardContent>
						<s.CardButton onClick={onclick}>송금</s.CardButton>
					</s.ButtonArea>
				</s.MyCard>
				<s.MyCard onClick={walletOnClick}>
					<s.CardTitleArea>
						<s.CardTitle>내 외화 지갑</s.CardTitle>
						<s.CardTitle>{}</s.CardTitle>
						<RightArrow/>
					</s.CardTitleArea>
					<s.CurrencyArea>
						<GlobalAccount
							nation='미국'
							foreignCurrency={foreignAccountData?.data[6]?.accountBalance}
							isExchange={false}
							accountId={foreignAccountData?.data[6]?.accountId}
						/>
						<GlobalAccount
							nation='유럽'
							foreignCurrency={foreignAccountData?.data[3]?.accountBalance}
							isExchange={false}
							accountId={foreignAccountData?.data[3]?.accountId}
						/>
						<GlobalAccount
							nation='일본'
							foreignCurrency={foreignAccountData?.data[5]?.accountBalance}
							isExchange={false}
							accountId={foreignAccountData?.data[5]?.accountId}
						/>
						<GlobalAccount
							nation='중국'
							foreignCurrency={foreignAccountData?.data[2]?.accountBalance}
							isExchange={false}
							accountId={foreignAccountData?.data[2]?.accountId}
						/>
						<GlobalAccount
							nation='영국'
							foreignCurrency={foreignAccountData?.data[4]?.accountBalance}
							isExchange={false}
							accountId={foreignAccountData?.data[4]?.accountId}
						/>
						<GlobalAccount
							nation='스위스'
							foreignCurrency={foreignAccountData?.data[1]?.accountBalance}
							isExchange={false}
							accountId={foreignAccountData?.data[1]?.accountId}
						/>
						<GlobalAccount
							nation='캐나다'
							foreignCurrency={foreignAccountData?.data[0]?.accountBalance}
							isExchange={false}
							accountId={foreignAccountData?.data[0]?.accountId}
						/>
					</s.CurrencyArea>
				</s.MyCard>
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

export default PayPage;