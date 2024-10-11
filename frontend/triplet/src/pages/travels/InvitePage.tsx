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


const InvitePage = () => {
	const dispatch = useDispatch();

  const [userAccountNumber, setUserAccountNumber] = useState<string>('');
  const [userAccountBalance, setUserAccountBalance] = useState<number>(0);
  const [inviteCode, setInviteCode] = useState<string>('');
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

  const inviteCodeOnChange = (e: React.FormEvent<HTMLInputElement>) => {
    const {
      currentTarget: {value}
    } = e;
    setInviteCode(value)
  }

  const { data: inviteData, 
		error: inviteError, 
		loading: inviteLoading, 
		status: inviteStatus, 
		refetch: inviteRefetch } = useAxios(`/travels/invite/${inviteCode}`, 'POST');


  const inviteOnClick = () => {
    const fetchData = async () => {
			try {
			await Promise.all([
				inviteRefetch()
			]);
			} catch (error) {
			console.error('Error fetching data:', error);
			}
		};
		fetchData();
  }

	const navigate = useNavigate();

  useEffect(() => {
    if (inviteData) {
      window.alert('초대코드 입력 완료')
      navigate(-1)
    }
  }, [inviteData])

  useEffect(() => {
    if (inviteError) {
      window.alert(inviteError.response.data.message)
      console.log(inviteError)
    }
  }, [inviteError])

	return (
		<>
			<BackHeader title='초대코드 입력'/>
			<s.Container>
        <s.Account>공유받은 초대코드를 입력해주세요.</s.Account>
        <s.InputText>초대코드</s.InputText>
        <s.InputBoxArea>
          <s.InputBox onChange={inviteCodeOnChange} value={inviteCode}/>
        </s.InputBoxArea>
        <s.ButtonArea>
          <s.NextButton onClick={inviteOnClick}>입력완료</s.NextButton>
        </s.ButtonArea>
			</s.Container>
		</>
	);
};

export default InvitePage;