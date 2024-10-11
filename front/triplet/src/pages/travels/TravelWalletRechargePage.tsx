import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { pageMove } from '../../features/navigation/naviSlice';
import BackHeader from '../../components/header/BackHeader';
import useAxios from '../../hooks/useAxios';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from "../../services/axios";

const s = {
  Container: styled.div`
    margin-top: 56px;
    height: 100vh;
    padding: 0 16px;
  `,
  Title: styled.span`
    margin-bottom: 40px;
    margin-top: 20px;
    font-size: 16px;
    font-weight: 500;
    margin-left: 8px;
  `,
  TitleArea: styled.div`
    display: flex;
    align-items: center;
  `,
  Caption: styled.span`
    font-size: 12px;
    padding-left: 10px;
    padding-bottom: 5px;
    font-weight: 400;
    color: #666666;
  `,
  InputArea: styled.div`
    width: 100%;
    display: flex;
  `,
  ExchangeInput: styled.input`
    font-size: 14px;
    font-weight: 500;
    background-color: #F9FAFC;
    border: solid 1px #F0F0F0;
    border-radius: 10px;
    height: 44px;
    width: 100%;
    padding: 0 16px;
  `,
  BtnArea: styled.div`
    display: flex;
    position: fixed;
    bottom: 84px;
    width: 100%;
    left: 0;
    right: 0;
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
    &:disabled {
      background-color: #888888;
      cursor: not-allowed;
    }
  `,
  ErrorMessage: styled.div`
    color: #EB5C5C;
    font-size: 12px;
    margin-top: 5px;
  `,
  // 모달 스타일링
  ModalOverlay: styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  `,
  ModalContainer: styled.div`
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    text-align: center;
    width: 300px;
    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
  `,
  ModalText: styled.p`
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 20px;
  `,
  ModalButton: styled.button`
    background-color: #008DE7;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    font-size: 14px;
    cursor: pointer;
    &:hover {
      background-color: #006bbf;
    }
  `
};

const ExchangePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currency, travelId } = useParams(); // travelId를 링크에서 가져옴
  const [exchangeRate, setExchangeRate] = useState<number>(1);
  const { data: travelWalletDetailData, refetch: travelWalletDetailRefetch } = useAxios(`/travel-wallet/${travelId}`, 'GET');

  const { data: foreignAccountData, refetch: foreignAccountRefetch } = useAxios(`/foreign-account/${currency}`, 'GET');
  const { data: exchangeRateData, refetch: exchangeRateRefetch } = useAxios(`/exchange-rate/${travelWalletDetailData?.data?.currency}`, 'GET');

  const [fromAmount, setFromAmount] = useState<any>('');
  const [isInvalid, setIsInvalid] = useState(false);
  const [isBalanceExceeded, setIsBalanceExceeded] = useState(false);

  // 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { refetch: rechargeWallet } = useAxios(`/travel-wallet/recharge`, 'POST'); // 충전 요청 POST

  useEffect(() => {
    if (travelWalletDetailData) {
      const fetchData = async () => {
        try {
          await Promise.all([exchangeRateRefetch()]);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      fetchData();
    }
  }, [travelWalletDetailData]);

  useEffect(() => {
    if (exchangeRateData) {
      setExchangeRate(exchangeRateData?.data?.exchangeRate);
    }
  }, [exchangeRateData]);

  const fromOnChange = (e: React.FormEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;

    // 숫자가 아닌 값은 입력되지 않도록 처리
    const numericValue = value.replace(/[^0-9]/g, '');
    setFromAmount(numericValue);

    // 입력된 금액이 외화 계좌 잔액을 초과하는지 확인
    const numericValueAsNumber = Number(numericValue);
    if (foreignAccountData && numericValueAsNumber > foreignAccountData?.data?.accountBalance) {
      setIsBalanceExceeded(true); // 잔액 부족
    } else {
      setIsBalanceExceeded(false); // 정상
    }
  };

  const handleRecharge = async () => {
    if (!isInvalid && !isBalanceExceeded) {
      const now = new Date();

      // UTC 시간에 9시간을 더해 한국 시간으로 변환
      now.setHours(now.getHours() + 9);

      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 1 더해줌
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');

      // "YYYY-MM-DDTHH:mm:ss" 형식으로 조합
      const transactionDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;

      const requestBody = {
        travelId: travelId, // URL에서 가져온 travelId 사용
        chargeCost: fromAmount, // 사용자가 입력한 충전 금액
        transactionDate: transactionDate, // 한국 시간으로 현재 날짜와 시간
      };

      try {
        // POST 요청을 보내서 충전
        await axiosInstance.post('/travel-wallet/recharge', requestBody); // axiosInstance를 사용하여 POST 요청

        // 모달 열기
        setIsModalOpen(true);

      } catch (error) {
        console.error('충전 중 오류 발생:', error);
      }
    }
  };

  // 모달 닫기 및 페이지 이동 처리
  const closeModal = () => {
    setIsModalOpen(false);
    navigate(`/travels/wallet/${travelId}`);
  };

  useEffect(() => {
    dispatch(pageMove('travels'));
    const fetchData = async () => {
      try {
        await Promise.all([foreignAccountRefetch(), travelWalletDetailRefetch()]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  return (
      <>
        <BackHeader title='충전' />
        <s.Container>
          <s.TitleArea>
            <s.Title>
              내 외화 계좌 잔액 : {foreignAccountData?.data?.accountBalance}{' '}
              {foreignAccountData?.data?.currency}
            </s.Title>
          </s.TitleArea>
          <s.Caption>충전 금액 입력 </s.Caption>
          <s.InputArea>
            <s.ExchangeInput onChange={fromOnChange} value={fromAmount} />
          </s.InputArea>
          {/* 잔액 부족 메시지 표시 */}
          {isBalanceExceeded && <s.ErrorMessage>잔액이 부족합니다</s.ErrorMessage>}
          <s.BtnArea>
            <s.PayBtn onClick={handleRecharge} disabled={isInvalid || isBalanceExceeded}>
              충전하기
            </s.PayBtn>
          </s.BtnArea>
        </s.Container>

        {/* 모달 창 */}
        {isModalOpen && (
            <s.ModalOverlay>
              <s.ModalContainer>
                <s.ModalText>충전이 완료되었습니다.</s.ModalText>
                <s.ModalButton onClick={closeModal}>확인</s.ModalButton>
              </s.ModalContainer>
            </s.ModalOverlay>
        )}
      </>
  );
};

export default ExchangePage;
