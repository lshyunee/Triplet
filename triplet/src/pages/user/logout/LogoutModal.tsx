import React from 'react';
import styled from 'styled-components';

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
  padding: 0; /* 추가 */
  margin: 0; /* 추가 */
`;


const ModalContentDiv = styled.div`
  background-color: white;
  max-width: 360px;
  width: 80%;
  height: auto;
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between; /* 내용 간격 고정 */
  border-radius: 8px;
  border: none;
  overflow: hidden;
  box-sizing: border-box;
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
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  align-items: stretch; /* 추가 */
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
  margin: 0; /* 추가 */
  vertical-align: top;
  box-sizing: border-box;
`;


interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LogoutModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    onClose();
  };

  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };


  return (
    <ModalLayout onClick={handleOverlayClick}>
      <ModalContentDiv onClick={handleContentClick}>
        <Title>로그아웃</Title>
        <Description>로그아웃 하시겠습니까?</Description>
        <ConfirmDiv>
          <Button isCancel onClick={onClose}>취소</Button>
          <Button >확인</Button>
        </ConfirmDiv>
      </ModalContentDiv>
    </ModalLayout>
  );
};

export default LogoutModal;
