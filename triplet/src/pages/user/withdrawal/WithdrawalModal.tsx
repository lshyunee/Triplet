import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { logout } from '../../../features/auth/authSlice';
import useAxios from '../../../hooks/useAxios';

const ModalLayout = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContentDiv = styled.div`
  background-color: white;
  max-width: 360px;
  width: 80%;
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  border-radius: 8px;
  overflow: hidden;
`;

const Title = styled.div`
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 10px;
`;

const Description = styled.div`
  font-size: 14px;
  color: #555;
  margin-bottom: 20px;
`;

const ConfirmDiv = styled.div`
  display: flex;
  width: 100%;
  align-items: stretch;
`;

const Button = styled.button<{ isCancel?: boolean }>`
  width: 50%;
  height: 50px;
  background-color: ${(props) => (props.isCancel ? '#E0E0E0' : '#008DE7')};
  color: ${(props) => (props.isCancel ? '#000000' : '#FFFFFF')};
  font-weight: 400;
  font-size: 16px;
  border: none;
  cursor: pointer;
  padding: 0;
  margin: 0;
  vertical-align: top;
`;

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WithdrawalModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Hook은 항상 호출되도록 한다.
  const { data: withdrawalData, error: withdrawalError, loading: withdrawalLoading,
    status: withdrawalStatus, refetch: withdrawalRefetch}
    = useAxios('/my', 'DELETE', { manual: true });

  const handleWithdrawal = () => {
    // 로그아웃을 클릭했을 때만 실제 로그아웃 API 호출
    withdrawalRefetch();
  };

  useEffect(() => {
    if (withdrawalData !== null) {
      dispatch(logout());
      navigate("/login");
    }
  }, [withdrawalData]);

  // 조건부로 return 대신, 렌더링 부분에서 조건 제어
  if (!isOpen) {
    return null;
  }

  return (
    <ModalLayout onClick={onClose}>
      <ModalContentDiv>
        <Title>회원 탈퇴</Title>
        <Description>정말 회원탈퇴 하시겠습니까?</Description>
        <ConfirmDiv>
          <Button isCancel onClick={onClose}>취소</Button>
          <Button onClick={handleWithdrawal}>확인</Button>
        </ConfirmDiv>
      </ModalContentDiv>
    </ModalLayout>
  );
};

export default WithdrawalModal;
