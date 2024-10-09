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
import { useParams } from 'react-router-dom';
import useAxios from '../../hooks/useAxios';
import userEvent from '@testing-library/user-event';


interface ForeignAccount {
  id: number;
  bankCode: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  accountType: string;
  currency: string;
  memberName: string;
  accountCreatedDate: string;
  accountExpiryDate: string;
  accountBalance: string;
}

interface ForeignAccountListResponse {
  code: number;
  message: string;
  data: ForeignAccount[];
}

interface TravelWallet {
  id: number;
  currency: string;
  balance: number;
  share: boolean;
}



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
  Option: styled.option`
    background-color: white;
    color: #333;
    font-size: 16px;
    padding: 10px;

    &:hover {
      background-color: #e6f7ff; 
    }
  `,
}


const QRPayPage = () => {
	const dispatch = useDispatch();
  const { merchantId } = useParams();
  const navigate = useNavigate();

  const [foreignList, setForeignList] = useState<ForeignAccountListResponse>();
  const [targetAccount, setTargetAccount] = useState<ForeignAccount>();
  const [travelWallet, setTravelWallet] = useState<TravelWallet>();
  const [isTravel, setIsTravel] = useState(0);
  const [accountId, setAccountId] = useState(0);
  const [price, setPrice] = useState(0);

  const { data: merchantData, 
		error: merchantError, 
		loading: merchantLoading, 
		status: merchantStatus, 
		refetch: merchantRefetch } = useAxios(`/merchant/${merchantId}`, 'GET');

  const { data: accountData, 
    error: accountError, 
    loading: accountLoading, 
    status: accountStatus, 
    refetch: accountRefetch } = useAxios(`/account`, 'GET');
  
  const { data: foreignAccountData, 
    error: foreignAccountError, 
    loading: foreignAccountLoading, 
    status: foreignAccountStatus, 
    refetch: foreignAccountRefetch } = useAxios('/foreign-account', 'GET');
  
  const { data: onGoingData, 
    error: onGoingError, 
    loading: onGoingLoading, 
    status: onGoingStatus, 
    refetch: onGoingRefetch } = useAxios('/travels/ongoing', 'GET');
  
  const { data: travelWalletData, 
    error: travelWalletError, 
    loading: travelWalletLoading, 
    status: travelWalletStatus, 
    refetch: travelWalletRefetch } = useAxios(`/travel-wallet/${onGoingData?.data?.travelId}`, 'GET');

  const { data: payData, 
    error: payError, 
    loading: payLoading, 
    status: payStatus, 
    refetch: payRefetch } = useAxios('/payment', 'POST', undefined, {
      merchantId: merchantId,
      price: price, // 사용자가 입력한 가격
      isTravel: isTravel,
      accountId: accountId
    });

	useEffect(() => {
    const fetchData = async () => {
			try {
        await Promise.all([
          merchantRefetch(),  // 가맹점 API 
          accountRefetch(), // 원화계좌 API
          foreignAccountRefetch(), // 외화계좌 목록
          onGoingRefetch() // 진행중인 여행 목록
        ]);
			} catch (error) {
			  console.error('Error fetching data:', error);
			}
		};
    dispatch(pageMove("pay"));
    fetchData();
	}, []);

  useEffect(() => {
    if (foreignAccountData) {
      setForeignList(foreignAccountData);
    }
  }, [foreignAccountData])

  useEffect(() => {
    if (foreignList && merchantData) {
      const target = foreignList.data.find(fore => fore.currency === merchantData?.data?.currency);
      setTargetAccount(target)
    }
  }, [foreignList, merchantData])

  useEffect(() => {
    if (onGoingData?.data) {
      const fetchData = async () => {
        try {
          await Promise.all([
            travelWalletRefetch() // 여행지갑
          ]);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      fetchData();
    }
  }, [onGoingData])

  useEffect(() => {
    if (travelWalletData) {
      setTravelWallet(travelWalletData.data)
    }
  }, [travelWalletData])

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const numericValue = value.replace(/\D/g, '');

    // 입력된 값이 없으면 다시 '0'으로 설정
    if (numericValue === '') {
      setPrice(0);
    } else {
      setPrice(Number(numericValue)); 
    }
  };

  const handleAccountChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;

    if (selectedValue === 'travelWallet') {
      if (travelWallet) {
        setAccountId(travelWallet.id);  
        setIsTravel(1);  
      }             
    } else if (selectedValue === 'accountData') {
      setAccountId(accountData.accountId);  
      setIsTravel(0);                    
    } else if (selectedValue === 'targetAccount') {
      if (targetAccount) {
        setAccountId(targetAccount?.id);  
        setIsTravel(0);   
      }                  
    }
  };


	return (
		<>
			<BackHeader title='결제'/>
			<s.Container>
          <s.MerchantCaption>가맹점</s.MerchantCaption>
          <s.MerchantName>{merchantData?.data?.merchantName}</s.MerchantName>
          
          <s.Caption>결제 금액</s.Caption>
          <s.InputArea>
            <s.PayInput value={price} onChange={handlePriceChange}></s.PayInput>
            <s.Currency>{merchantData?.data?.currency}</s.Currency>
          </s.InputArea>

          <s.Caption>결제 지갑</s.Caption>
          <s.InputArea>
            <s.ExchangeInput onChange={handleAccountChange}>
            {travelWallet && Object.keys(travelWallet).length > 0 && (<s.Option>내 여행지갑</s.Option>)}
            {merchantData?.data?.currency === 'KRW' ? (
            <s.Option value="accountData">{accountData?.accountName}</s.Option>) : (
            <s.Option value="targetAccount">{targetAccount?.accountName}</s.Option>)}
            </s.ExchangeInput>
            </s.InputArea>

          <s.BtnArea><s.PayBtn onClick={() => {
            payRefetch();
            // navigate(`/`) 어디로 보내지?
          }}>결제하기</s.PayBtn></s.BtnArea>
			</s.Container>
		</>
	);
};

export default QRPayPage;