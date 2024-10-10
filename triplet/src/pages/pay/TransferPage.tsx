import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import { ReactComponent as RightArrow } from '../../assets/pay/rightArrow.svg';
import { useDispatch } from 'react-redux';
import { pageMove } from '../../features/navigation/naviSlice';
import { Navigate, useNavigate } from 'react-router-dom';
import useAxios from '../../hooks/useAxios';
import Header from '../../components/header/Header';
import BackHeader from '../../components/header/BackHeader';


const s = {
	Container: styled.div`
		background-color: #FFFFFF;
		height: calc(100vh - 112px);
		padding-top: 56px;
		padding-bottom: 56px;
    padding-left: 16px;
    padding-right: 16px;
	`,
  InputText: styled.div`
    font-size: 12px;
    font-weight: 500;
    color: #424242;
    margin-bottom: 4px;
    margin-left: 4px;
    margin-top: 24px;
  `,
  InputBoxArea: styled.div`
    width: 100%;
    display: flex;
    align-items: center;
  `,
  InputBox: styled.input`
    font-size: 14px;
    font-weight: 500;
    background-color: #F9FAFC;
    border: solid 1px #F0F0F0;
    border-radius: 10px;
    height: 44px;
    width: 100%;
    padding: 0 16px;
  `,
  Unit: styled.span`
    font-size: 14px;
    font-weight: 500;
    margin-left: 8px;
  `,
  NextButton: styled.button`
    background-color: #008DE7;
    font-size: 14px;
    font-weight: 600;
    border-radius: 10px;
    height: 44px;
    border: none;
    width: 100%;
    color: #FFFFFF;
    cursor: pointer;
  `,
  ButtonArea: styled.div`
    display: flex;
    gap: 8px;
    position: fixed;
    left: 0;
    right: 0;
    margin: 0 16px;
    bottom: 84px;
  `,
  Title: styled.div`
    font-size: 14px;
    font-weight: 500;
    color: #666666;
    margin-top: 12px;
    margin-bottom: 12px;
  `,
  Account: styled.div`
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 40px;
  `
	
}


const TransferPage = () => {
	const dispatch = useDispatch();

  const [userAccountNumber, setUserAccountNumber] = useState<string>('');
  const [userAccountBalance, setUserAccountBalance] = useState<number>(0);
  const [transferAccountNumber, setTransferAccountNumber] = useState<string>('');
  const [transferAmount, setTransferAmount] = useState<number>(0);

	const { data: accountData, 
		error: accountError, 
		loading: accountLoading, 
		status: accountStatus, 
		refetch: accountRefetch } = useAxios('/account', 'GET');

	useEffect(() => {
		const fetchData = async () => {
			try {
			await Promise.all([
				accountRefetch(),     // 원화계좌 API 요청
			]);
			} catch (error) {
			console.error('Error fetching data:', error);
			}
		};
	
		dispatch(pageMove("pay"));
		fetchData();
	}, []);

  useEffect(() => {
    if (accountData) {
      setUserAccountNumber(accountData.data.accountNumber)
      setUserAccountBalance(accountData.data.accountBalance)
    }
  }, [accountData])

  const accountOnChange = (e: React.FormEvent<HTMLInputElement>) => {
    const {
      currentTarget: {value}
    } = e;
    if (Number(value) || value === '') {
      setTransferAccountNumber(value)
    }
  }

  const amountOnChange = (e: React.FormEvent<HTMLInputElement>) => {
    const {
      currentTarget: {value}
    } = e;
    if (Number.isInteger(Number(value))) {
      setTransferAmount(Number(value))
    }
  }

  const { data: transferData,
    error: transferError,
    loading: transferLoading,
    status: transferStatus,
    refetch: transferRefetcch } = useAxios('/transaction/create', 'POST', undefined,
    {
      "depositAccountNumber": transferAccountNumber,
      "transactionBalance": transferAmount,
      "withdrawalAccountNumber": userAccountNumber,
    }
    )

  const transferOnClick = () => {
    const fetchData = async () => {
			console.log(userAccountNumber)
      console.log(transferAccountNumber)
      console.log(transferAmount)
      try {
			await Promise.all([
				transferRefetcch(),     // 원화계좌 API 요청
			]);
			} catch (error) {
			console.error('Error fetching data:', error);
			}
		};
		fetchData();
  }

	const navigate = useNavigate();

	return (
		<>
			<BackHeader title='송금하기'/>
			<s.Container>
        <s.Title>계좌 잔액</s.Title>
        <s.Account>{userAccountBalance}원</s.Account>
        <s.InputText>계좌번호</s.InputText>
        <s.InputBoxArea>
          <s.InputBox onChange={accountOnChange} value={transferAccountNumber}/>
        </s.InputBoxArea>
        <s.InputText>송금 금액</s.InputText>
        <s.InputBoxArea>
          <s.InputBox onChange={amountOnChange} value={transferAmount}/>
          <s.Unit>원</s.Unit>
        </s.InputBoxArea>
        <s.ButtonArea>
          <s.NextButton onClick={transferOnClick}>송금하기</s.NextButton>
        </s.ButtonArea>
			</s.Container>
		</>
	);
};

export default TransferPage;