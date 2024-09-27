import { create } from 'domain';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { pageMove } from '../../features/navigation/naviSlice';
import BackHeader from '../../components/header/BackHeader';
import { ReactComponent as Calendar } from '../../assets/pay/calendar.svg';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const s = {
  Container: styled.div`
    margin-top: 56px;
    padding: 0 16px;
  `,
  CalendarButton: styled.div`
    background-color: #F9FAFC;
    height: 44px;
    border: solid 1px #F0F0F0;
    border-radius: 10px;
    display: flex;
    /* justify-content: center; */
    width: 100%;
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
    font-size: 14px;
    font-weight: 500;
    color: #424242;
    background-color: #F9FAFC;
    pointer-events: none;
    outline: none;
    caret-color: transparent;
  `,
  InputText: styled.div`
    font-size: 12px;
    font-weight: 500;
    color: #424242;
    margin-bottom: 4px;
    margin-left: 4px;
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
  DropDown: styled.select`
    font-size: 14px;
    font-weight: 500;
    background-color: #F9FAFC;
    border: solid 1px #F0F0F0;
    border-radius: 10px;
    height: 44px;
    width: 100%;
    padding: 0 16px;
  `,
}


const CreateTravelPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(pageMove("travels"));
  }, []);

  const today =  new Date();
  const week = new Date(new Date().setDate(new Date().getDate() +3));

  const [dateRange, setDateRange] = useState<any | null>([today, week]);
  const [start, end] = dateRange;

  const dateInputRef = useRef<DatePicker>(null);
  
  const [isDateOpen, setIsDateOpen] = useState<boolean>(false);

  useEffect(() => {
    if (isDateOpen === true) {
      dateInputRef.current?.setFocus();
      setIsDateOpen(false);
    };
  }, [isDateOpen]);

  return (
    <>
    <BackHeader title='여행 등록'/>
    <s.Container>
      <s.InputText>여행 일정</s.InputText>
      <s.CalendarButton>
        <s.CalendarTextArea onClick={() => setIsDateOpen(true)}>
          <Calendar/>
          <s.StyledDatePicker
            selectsRange={true}
            startDate={start}
            endDate={end}
            minDate={today}
            onChange={((range: any) => setDateRange(range))}
            dateFormat={"yyyy.MM.dd"}
            ref={dateInputRef}
          />
        </s.CalendarTextArea>
      </s.CalendarButton>
      <s.InputText>여행 국가</s.InputText>
      <s.DropDown>
        <option value="dd">선택</option>
        <option value="dd">ㄴㅇㄹ</option>
      </s.DropDown>
      <s.InputText>여행 인원</s.InputText>
      <s.InputBox placeholder='여행 인원을 입력하세요.'/>
    </s.Container>
    </>
  );
};

export default CreateTravelPage;