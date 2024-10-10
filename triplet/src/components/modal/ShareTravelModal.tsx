import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import useAxios from '../../hooks/useAxios';
import CompleteModal from './CompleteModal';

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
  z-index: 1000;
`;

const ModalContentDiv = styled.div`
  background-color: white;
  width: 300px;
  height: 220px;
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* 상단, 하단 요소 배치 */
  align-items: center;
  border-radius: 20px;
  overflow: hidden;
  padding: 20px 0 0 0;
`;

const Title = styled.div`
  font-size: 30px;
  font-weight: 700;

`;

const ShareItemDiv = styled.div`
    display: flex;
    width: 90%;
    align-items: center;
    justify-content : flex-start;
    margin : 15px 0 0 0;
    gap: 1vw;
`;

const ShareItemTitleP = styled.p`
  font-size: 20px;
  font-weight: 500;
  margin: 0 0 0 0;
  line-height: 1.5;
  text-align : left;
`;

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const StyledCheckbox = styled.div<{ checked: boolean }>`
    width: 60px;
    transition: all 150ms;

  &::after {
    content: '✔';
    display: block;
    color: ${(props) => (props.checked ? '#008DE7' : '#666666')};
    font-size: 30px;
    text-align: center;
  }
`;

const CheckboxLabel = styled.label`
`;

const ConfirmDiv = styled.div`
  display: flex;
  width: 100%;
  align-items: stretch;
  margin-top : auto;
`;

const Button = styled.button<{ cancel?: boolean }>`
  width: 50%;
  height: 50px;
  background-color: ${(props) => (props.cancel ? '#E0E0E0' : '#008DE7')};
  color: ${(props) => (props.cancel ? '#000000' : '#FFFFFF')};
  font-weight: 400;
  font-size: 16px;
  border: none; 
  cursor: pointer;
  padding: 0;
`;


const CustomCheckbox: React.FC<{ label: string; checked: boolean; onChange: () => void }> = ({
  label,
  checked,
  onChange,
}) => (
  <CheckboxWrapper>
    <StyledCheckbox checked={checked} onClick={onChange} />
    <CheckboxLabel>{label}</CheckboxLabel>
  </CheckboxWrapper>
);

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  travelId: number;
  share : boolean;
  shareDetail : boolean;
}

const ShareTravelModal: React.FC<ModalProps> = ({ isOpen, onClose, travelId, share, shareDetail }) => {
  
  const [isShared, setIsShared] = useState(share ? 1 : 0);
  const [isDetailShared, setIsDetailShared] = useState(shareDetail ? 1 : 0);
  
  const [ completedMsg, setCompletedMSg ] = useState("");
  const [ isCompleted, setIsCompleted ] = useState(false);

  const { data : shareData, error : shareError, status : shareStatus, refetch : shareRefetch }
    = useAxios("/travels/share","POST", undefined, {
      travelId : travelId,
      isShared : isShared,
      shareStatus : isDetailShared,
    });

  useEffect(()=>{
    
    if(shareData && shareStatus === 200) {
      setCompletedMSg(shareData.message);
      setIsCompleted(true);
    }

    if(shareError){
      
    }

  },[shareData, shareError])
  
  const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  const handleTravelShared = () => {
    setIsShared(isShared === 1 ? 0 : 1);
  };
  
  const handleDetailShared = () => {
    setIsDetailShared(isDetailShared === 1 ? 0 : 1);
  };
  
  if (!isOpen) {
    return null;
  }
  
  const closeComplete = () => {
    setIsCompleted(false);
    onClose();
  }


  const handleShareComplete = () => {
    shareRefetch();
  }


  return (
    <ModalLayout onClick={handleClickOutside}>
      <ModalContentDiv onClick={(e) => e.stopPropagation()}>
        <Title>여행 공유 설정</Title>
        <ShareItemDiv>
            <CustomCheckbox label="" checked={isShared? true : false} onChange={handleTravelShared} />
            <ShareItemTitleP>여행 공유</ShareItemTitleP>
        </ShareItemDiv>
        <ShareItemDiv>
            <CustomCheckbox label="" checked={isDetailShared ? true : false} onChange={handleDetailShared} />
            <ShareItemTitleP>여행 상세지출내역 공유</ShareItemTitleP>
        </ShareItemDiv>
        <ConfirmDiv>
          <Button cancel={true} onClick={onClose}>취소</Button>
          <Button onClick={handleShareComplete}>확인</Button>
        </ConfirmDiv>
      </ModalContentDiv>
      <CompleteModal isOpen={isCompleted} onClose={closeComplete} msg={completedMsg} />
    </ModalLayout>
  );
};

export default ShareTravelModal;
