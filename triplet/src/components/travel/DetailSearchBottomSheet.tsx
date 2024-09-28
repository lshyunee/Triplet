import React, { useState, useEffect } from "react";
import styled from "styled-components";

// styled-components 정의
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: end;
  background: rgba(0, 0, 0, 0.5);
  z-index: 50;
  transition: opacity 0.3s ease-in-out;

  &.open {
    opacity: 1;
    pointer-events: all;
  }

  &.closed {
    opacity: 0;
    pointer-events: none;
  }
`;

const Sheet = styled.div`
  width: 100%;
  max-height : 471px;
  background-color: white;
  border-radius: 12px 12px 0 0;
  padding: 0 16px 56px;
  box-shadow: 0px -2px 10px rgba(0, 0, 0, 0.1);
  transform: translateY(100%);
  transition: transform 0.3s ease-in-out;

  &.open {
    transform: translateY(0);
  }

  &.closed {
    transform: translateY(100%);
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TitleP = styled.p`
    font-size : 16px;
    font-weight : 600;
`

const CategoryP = styled.p`
  font-size: 12px;
  font-weight: 400;
  color : #666666;
  padding : 0px;
  margin : 0px 0px 4px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
`;

const ContentDiv = styled.div`
  display: flex;
  flex-direction: row;
`;

const CategoryDiv = styled.div`
    display : flex;
    flex-direction : column;
    margin-bottom : 20px;
`

const UnitP = styled.p`
  font-weight: 500;
  font-size : 14px;
  margin-left : 8px;
`;

const Counter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  button {
    background-color: #eee;
    border: none;
    width: 32px;
    height: 32px;
    font-size: 1.25rem;
  }

  span {
    font-size: 1.25rem;
  }
`;

const PriceRange = styled.div`
  display: flex;
  gap: 10px;

  input {
    border: none;
    background-color: #f5f5f5;
    padding: 8px;
    width: 100px;
    text-align: right;
  }
`;

const Range = styled.div`
  display: flex;
  gap: 10px;

  span {
    font-size: 1rem;
  }
`;

const Select = styled.select`
    width : 80px;
    height : 44px;
    padding: 10px;
    font-size: 14px;
`;

const SaveButton = styled.button`
  width: 100%;
  height : 44px;
  background-color: #008DE7;
  color: white;
  font-size: 14px;
  font-weight : 600;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-bottom : 28px;
`;


interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const DetailSearchBottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
}) => {
  const [visible, setVisible] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      onClose();
    }, 300); // 300ms 애니메이션 시간에 맞추기
  };

  return (
    <Overlay
      className={` ${isOpen ? "open" : "closed"}`}
      onClick={handleClose}
    >
      <Sheet className={` ${isOpen ? "open" : "closed"}`} onClick={(e) => e.stopPropagation()}>
        <Header>
          <TitleP>상세검색</TitleP>
          <CloseButton onClick={handleClose}>X</CloseButton>
        </Header>
        <CategoryDiv>
            <CategoryP>인원</CategoryP>
            <ContentDiv>
                <Counter>
                <button>-</button>
                <span>0</span>
                <button>+</button>
                </Counter>
                <UnitP>명</UnitP>
            </ContentDiv>
            </CategoryDiv>
            <CategoryDiv>
                <CategoryP>예산</CategoryP>
                <ContentDiv>
                    <PriceRange>
                    <input type="text" value="1,000,000" readOnly /> ~{" "}
                    <input type="text" value="3,000,000" readOnly />
                    </PriceRange>
                    <UnitP>원</UnitP>
                </ContentDiv>
            </CategoryDiv>
            <CategoryDiv>
                <CategoryP>기간</CategoryP>
                <ContentDiv>
                    <Range>
                    <span>3</span> ~ <span>5</span>
                    </Range>
                    <UnitP>일</UnitP>
                </ContentDiv>
            </CategoryDiv>
            <CategoryDiv>
                <CategoryP>여행 시기</CategoryP>
                <ContentDiv>
                    <Select>
                    <option>월</option>
                    </Select>
                    <UnitP>월</UnitP>
                </ContentDiv>
            </CategoryDiv>
        <SaveButton>저장</SaveButton>
      </Sheet>
    </Overlay>
  );
};

export default DetailSearchBottomSheet;