import React, {useEffect, useRef, useState} from 'react';
import styled from 'styled-components';
import BackHeader from '../../components/header/BackHeader';
import { useDispatch } from 'react-redux';
import { pageMove } from '../../features/navigation/naviSlice';
import { ReactComponent as Wallet } from '../../assets/pay/wallet.svg';
import { ReactComponent as Calendar } from '../../assets/pay/calendar.svg';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { isDate } from 'util/types';
import { addDays } from 'react-datepicker/dist/date_utils';
import useAxios from '../../hooks/useAxios';
import { useNavigate } from 'react-router-dom';
interface Transaction {
  transactionId: number;
  transactionDate: string;
  transactionType: number;
  transactionTypeName: string;
  transactionAccountNumber: string;
  price: number;
  transactionAfterBalance: number;
  transactionName: string;
}

interface TransactionsResponse {
  code: string;
  message: string;
  data: {
    [key: string]: Transaction[];
  };
}
 
 
   //형식은 원하는 형식으로.
const s = {
  Container: styled.div`
    padding-top: 56px;
    padding-left: 16px;
    padding-right: 16px;
    height: calc(100vh - 112px);
    overflow-y: auto;
  `,
  Card: styled.div`
    background-color: #E5F3FF;
    padding: 20px;
    border-radius: 20px;
    margin-top: 12px;
  `,
  CardTitle: styled.span`
    font-size: 14px;
    font-weight: 500;
    margin-left: 8px;
  `,
  CardTitleArea: styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 4px;
  `,
  CardCaption: styled.span`
    font-size: 14px;
    font-weight: 400;
    color: #666666;
  `,
  CardKrw: styled.span`
    font-size: 20px;
    font-weight: 600;
  `,
  CardButton: styled.button`
    background-color: #A2D3FF;
    font-size: 14px;
    font-weight: 500;
    height: 36px;
    width: 66px;
    border-radius: 50px;
    border: 0;
    cursor: pointer;
  `,
  ButtonArea: styled.div`
    display: flex;
    align-items: end;
    justify-content: space-between;
    margin-top: 8px;
  `,
  CalendarButton: styled.div`
    background-color: #F9FAFC;
    height: 44px;
    border: solid 1px #F0F0F0;
    border-radius: 50px;
    display: flex;
    justify-content: center;
    width: 256px;
    margin: 0 auto;
    margin-top: 12px;
    margin-bottom: 20px;
  `,
  CalendarText: styled.span`
    font-size: 12px;
    font-weight: 500;
    margin-left: 12px;
  `,
  CalendarTextArea: styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: center;
    cursor: pointer;
  `,
  StyledDatePicker: styled(DatePicker)`
    text-align: center;
    border: none;
    font-size: 12px;
    font-weight: 500;
    background-color: #F9FAFC;
    width: 150px;
    pointer-events: none;
    outline: none;
    caret-color: transparent;
  `,
  DateText: styled.span`
    font-size: 12px;
    font-weight: 500;
    color: #444444;
  `,
  DateLine: styled.hr`
    border: solid 0.1px #D9D9D9;
    margin: 0;
    margin-top: 8px;
  `,
  PaymentTime: styled.span`
    font-size: 12px;
    font-weight: 400;
    color: #666666;
    
  `,
  PaymentTitle: styled.span`
    font-size: 14px;
    font-weight: 600;
    margin-top: 8px;
  `,
  PaymentTypeBlue: styled.span`
    font-size: 12px;
    font-weight: 400;
    color: #008DE7;
  `,
  PaymentTypeRed: styled.span`
    font-size: 12px;
    font-weight: 400;
    color: #EB5C5C;
  `,
  PaymentAmountBlue: styled.span`
    font-size: 16px;
    font-weight: 600;
    color: #008DE7;
    margin-top: 8px;
  `,
  PaymentAmountRed: styled.span`
    font-size: 16px;
    font-weight: 600;
    color: #EB5C5C;
    margin-top: 8px;
  `,
  BalanceText: styled.span`
    font-size: 12px;
    font-weight: 400;
    color: #666666;
    margin-top: 8px;
  `,
  PaymentTitleArea: styled.div`
    display: flex;
    flex-direction: column;
  `,
  PaymentAmountArea: styled.div`
    display: flex;
    flex-direction: column;
    align-items: end;
  `,
  PaymentArea: styled.div`
    display: flex;
    justify-content: space-between;
    margin: 16px 0;
  `,
  PaymentLine: styled.hr`
    border: solid 0.1px #EFEFEF;
    margin: 0;
  `,
  EmptyMessage: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50vh;  
    color: #666666;
  `,
    StyledSelect: styled.select`
    background-color: #f0f0f0; 
    color: #333;              
    border-radius: 5px;         
    padding: 5px;             
    margin: 0 5px;    
`,
}

const AccountDetailPage = () => {
  const dispatch = useDispatch();

  const { data: accountDetailData, 
		error: accountDetailError, 
		loading: accountDetailLoading, 
		status: accountDetailStatus, 
		refetch: accountDetailRefetch } = useAxios(`/account`, 'GET');

  useEffect(() => {
    const fetchData = async () => {
			try {
        await Promise.all([
          accountDetailRefetch(),  // 원화계좌 API 요청
        ]);
			} catch (error) {
			  console.error('Error fetching data:', error);
			}
		};
    dispatch(pageMove("pay"));
    fetchData();
  }, []);

  const today =  new Date();
  const week = new Date(new Date().setDate(new Date().getDate() -7));

  const [dateRange, setDateRange] = useState<any | null>([week, today]);
  const [start, end] = dateRange;

  const dateInputRef = useRef<DatePicker>(null);
  
  const [isDateOpen, setIsDateOpen] = useState<boolean>(false);
  const [transaction, setTransaction] = useState<TransactionsResponse | null>(null);

  const { data: transactionData, 
    error: transactionError, 
    loading: transactionLoading, 
    status: transactionStatus, 
    refetch: transactionRefetch } = useAxios(`/transaction`, 'POST', undefined,{
      accountId: accountDetailData?.data?.accountId,
      startDate: start,
      endDate: end
    });

  useEffect(() => {
    if (accountDetailData && start && end) {
      const fetchData = async () => {
        try {
          await Promise.all([
            transactionRefetch() // 거래내역 조회
          ]);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      fetchData();
    }
  }, [accountDetailData, start, end])

  useEffect(() => {
    if (transactionData) {
      setTransaction(transactionData)
      
    }
  }, [transactionData])

  useEffect(() => {
    if (isDateOpen === true) {
      dateInputRef.current?.setFocus();
      setIsDateOpen(false);
    };
  }, [isDateOpen]);

  const navigate = useNavigate();

  const transferOnclick = (e: React.MouseEvent<HTMLButtonElement>) => {
		navigate('/pay/transfer');
	};
  
  return (
    <>
    <BackHeader title='내 계좌'/>
    <s.Container>
      <s.Card>
        <s.CardTitleArea>
          <Wallet/>
          <s.CardTitle>내 통장</s.CardTitle>
        </s.CardTitleArea>
        {accountDetailData?.data?.bankName === '바나나은행' ? (
        <s.CardCaption>Triplet {accountDetailData?.data?.accountNumber}</s.CardCaption>
        ) : (
        <s.CardCaption>{accountDetailData?.data?.bankName} {accountDetailData?.data?.accountNumber}</s.CardCaption>
        )}
        <s.ButtonArea>
          <s.CardKrw>{accountDetailData?.data?.accountBalance.toLocaleString()} 원</s.CardKrw>
          <s.CardButton onClick={transferOnclick}>송금</s.CardButton>
        </s.ButtonArea>
      </s.Card>
      <s.CalendarButton>
        <s.CalendarTextArea onClick={() => setIsDateOpen(true)}>
          <Calendar/>
          <s.StyledDatePicker
            selectsRange={true}
            startDate={start}
            endDate={end}
            maxDate={today}
            onChange={((range: any) => setDateRange(range))}
            dateFormat={"yyyy.MM.dd"}
            ref={dateInputRef}
            showMonthDropdown
            showYearDropdown
            dropdownMode="scroll"
          />
        </s.CalendarTextArea>
      </s.CalendarButton>

      {/* 거래 내역이 없을 때 문구 표시 */}
      {transaction && Object.keys(transaction.data).length === 0 ? (
        <s.EmptyMessage>거래 내역이 없습니다</s.EmptyMessage>
      ) : (
        /* 거래 내역을 날짜별로 반복 렌더링 */
        transaction &&
        Object.keys(transaction.data).map((date) => (
          <React.Fragment key={date}>
            <s.DateText>{date}</s.DateText>
            <s.DateLine />

            {/* 해당 날짜의 거래 내역 표시 */}
            {transaction.data[date].map((transaction) => (
              <React.Fragment key={transaction.transactionId}>
                <s.PaymentArea>
                  <s.PaymentTitleArea>
                    <s.PaymentTime>
                    {new Date(transaction.transactionDate).toLocaleTimeString()}
</s.PaymentTime>
                    <s.PaymentTitle>{transaction.transactionName}</s.PaymentTitle>
                  </s.PaymentTitleArea>

                  <s.PaymentAmountArea>
                    {transaction.transactionType === 1 ? (
                      <s.PaymentTypeRed>입금</s.PaymentTypeRed>
                    ) : (
                      <s.PaymentTypeBlue>출금</s.PaymentTypeBlue>
                    )}
                    {transaction.transactionType === 1 ? (
                      <s.PaymentAmountRed>{transaction.price.toLocaleString()}원</s.PaymentAmountRed>
                    ) : (
                      <s.PaymentAmountBlue>{transaction.price.toLocaleString()}원</s.PaymentAmountBlue>
                    )}
                    <s.BalanceText>잔액 {transaction.transactionAfterBalance.toLocaleString()}원</s.BalanceText>
                  </s.PaymentAmountArea>
                </s.PaymentArea>
                <s.PaymentLine />
              </React.Fragment>
            ))}
          </React.Fragment>
        ))
      )}
    </s.Container>
    </>
  );
};

export default AccountDetailPage;