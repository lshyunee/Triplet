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

const s = {
  Container: styled.div`
    padding-top: 56px;
    padding-left: 16px;
    padding-right: 16px;
    height: calc(100vh - 112px);
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
  `
}

const AccountDetailPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(pageMove("pay"));
  }, []);

  const today =  new Date();
  const week = new Date(new Date().setDate(new Date().getDate() -7))

  const [dateRange, setDateRange] = useState<any | null>([week, today]);
  const [start, end] = dateRange;

  const dateInputRef = useRef<DatePicker>(null)
  
  const [isDateOpen, setIsDateOpen] = useState<boolean>(false);

  useEffect(() => {
    if (isDateOpen === true) {
      dateInputRef.current?.setFocus()
      setIsDateOpen(false)
    };
  }, [isDateOpen])

  return (
    <>
    <BackHeader title='내 계좌'/>
    <s.Container>
      <s.Card>
        <s.CardTitleArea>
          <Wallet/>
          <s.CardTitle>내 통장</s.CardTitle>
        </s.CardTitleArea>
        <s.CardCaption>은행 312-9446-0093</s.CardCaption>
        <s.ButtonArea>
          <s.CardKrw>20,000,000원</s.CardKrw>
          <s.CardButton>송금</s.CardButton>
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
          />
        </s.CalendarTextArea>
      </s.CalendarButton>
      <s.DateText>2024.09.09</s.DateText>
      <s.DateLine/>
      <s.PaymentArea>
        <s.PaymentTitleArea>
          <s.PaymentTime>20:25:55</s.PaymentTime>
          <s.PaymentTitle>김철수</s.PaymentTitle>
        </s.PaymentTitleArea>
        <s.PaymentAmountArea>
          <s.PaymentTypeBlue>출금</s.PaymentTypeBlue>
          <s.PaymentAmountBlue>4,290원</s.PaymentAmountBlue>
          <s.BalanceText>잔액 118,309원</s.BalanceText>
        </s.PaymentAmountArea>
      </s.PaymentArea>
      <s.PaymentLine/>

      <s.PaymentArea>
        <s.PaymentTitleArea>
          <s.PaymentTime>20:25:55</s.PaymentTime>
          <s.PaymentTitle>김철수</s.PaymentTitle>
        </s.PaymentTitleArea>
        <s.PaymentAmountArea>
          <s.PaymentTypeRed>입금</s.PaymentTypeRed>
          <s.PaymentAmountRed>4,290원</s.PaymentAmountRed>
          <s.BalanceText>잔액 118,309원</s.BalanceText>
        </s.PaymentAmountArea>
      </s.PaymentArea>
      <s.PaymentLine/>
    </s.Container>
    </>
  );
};

export default AccountDetailPage;