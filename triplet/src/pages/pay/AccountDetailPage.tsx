import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import BackHeader from '../../components/header/BackHeader';
import { useDispatch } from 'react-redux';
import { pageMove } from '../../features/navigation/naviSlice';
import { ReactComponent as Wallet } from '../../assets/pay/wallet.svg';
import { ReactComponent as Calendar } from '../../assets/pay/calendar.svg';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const s = {
  Container: styled.div`
    padding-top: 56px;
    padding-left: 16px;
    padding-right: 16px;
  `,
  Card: styled.div`
    background-color: #E5F3FF;
    padding: 20px;
    border-radius: 20px;
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
  `,
  CalendarText: styled.span`
    font-size: 12px;
    font-weight: 500;
    margin-left: 12px;
  `,
  CalendarTextArea: styled.div`
    display: flex;
    align-items: center;
  `,
  StyledDatePicker: styled(DatePicker)`
    border: none;
    font-size: 12px;
    font-weight: 500;
  
  `,


}

const AccountDetailPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(pageMove("pay"));
  }, []);

  const [startDate, setStartDate] = useState<any | null>(null);
  const [endDate, setEndDate] = useState<any | null>(null);

  const handleStartDateChange = (date: any) => {
    console.log('start', date);
    setStartDate(date);
  };
  const handleEndDateChange = (date: any) => {
    console.log('end', date);
    setEndDate(date);
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
        <s.CardCaption>은행 312-9446-0093</s.CardCaption>
        <s.ButtonArea>
          <s.CardKrw>20,000,000원</s.CardKrw>
          <s.CardButton>송금</s.CardButton>
        </s.ButtonArea>
      </s.Card>
      <s.CalendarButton>
        <s.CalendarTextArea>
          <Calendar/>
          <s.CalendarText>2024.08.03 ~ 2024.09.03</s.CalendarText>
        </s.CalendarTextArea>
      </s.CalendarButton>
      <s.StyledDatePicker
        selected={startDate}
        onChange={(date: any) => handleStartDateChange(date)}
        dateFormat={"yyyy.MM.dd"}
      />
      <s.StyledDatePicker
        selected={endDate}
        onChange={(date: any) => handleEndDateChange(date)}
        dateFormat={"yyyy.MM.dd"}
        minDate={startDate}
      />
    </s.Container>
    </>
  );
};

export default AccountDetailPage;