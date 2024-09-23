import React, {useEffect} from 'react';
import styled from 'styled-components';
import { ReactComponent as RightArrow } from '../../assets/pay/rightArrow.svg';
import GlobalAccount from '../../components/pay/GlobalAccount';
import ExchangeRate from '../../components/pay/ExchangeRate';
import Header from '../../components/header/Header';
import { useDispatch } from 'react-redux';
import { pageMove } from '../../features/navigation/naviSlice';


const s = {
	Container: styled.div`
		background-color: #F3F4F6;
		height: 100vh;
	`,
	Card: styled.div`
		background-color: #ffffff;
		border-radius: 20px;
		margin: 0 16px;
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
	`,
	ButtonArea: styled.div`
		display: flex;
		justify-content: space-between;
		margin: 0 20px;
		padding-bottom: 20px;
	`
}


const PayPage = () => {
	const dispatch = useDispatch();

    useEffect(() => {
        dispatch(pageMove("pay"));
    }, [])

	return (
		<>
			<Header/>
			<s.Container>
				<s.Card>
					<s.CardTitleArea>
						<s.CardTitle>내 통장</s.CardTitle>
						<RightArrow/>
					</s.CardTitleArea>
					<s.CardCaption>은행 312-9446-0093</s.CardCaption>
					<s.ButtonArea>
						<s.CardContent>20,000,000원</s.CardContent>
						<s.CardButton>송금</s.CardButton>
					</s.ButtonArea>
				</s.Card>
				<s.Card>
					<s.CardTitleArea>
						<s.CardTitle>내 외화 지갑</s.CardTitle>
						<RightArrow/>
					</s.CardTitleArea>
					<s.CurrencyArea>
						<GlobalAccount
							nation='미국'
							foreignCurrency={1000}
						/>
						<GlobalAccount
							nation='유럽'
							foreignCurrency={1000}
						/>
						<GlobalAccount
							nation='일본'
							foreignCurrency={1000}
						/>
						<GlobalAccount
							nation='중국'
							foreignCurrency={1000}
						/>
						<GlobalAccount
							nation='영국'
							foreignCurrency={1000}
						/>
						<GlobalAccount
							nation='스위스'
							foreignCurrency={1000}
						/>
						<GlobalAccount
							nation='캐나다'
							foreignCurrency={1000}
						/>
					</s.CurrencyArea>
				</s.Card>
				<s.Card>
					<s.CardTitleArea>
						<s.CardTitle>실시간 환율</s.CardTitle>
						<RightArrow/>
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

export default PayPage;