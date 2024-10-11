import React from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  width: 300px;
`;

const ModalButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

interface WarningModalProps {
  message: string;
  onConfirm: () => void;
}

const WarningModal: React.FC<WarningModalProps> = ({ message, onConfirm }) => {
  return (
    <ModalOverlay>
      <ModalContent>
        <p>{message}</p>
        <ModalButton onClick={onConfirm}>확인</ModalButton>
      </ModalContent>
    </ModalOverlay>
  );
};

export default WarningModal;
