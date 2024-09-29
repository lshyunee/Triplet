import React, { useState, useEffect } from "react";
import styled from "styled-components";
import useInput from "../../hooks/useInput";

import { ReactComponent as Plus } from '../../assets/common/plus.svg';
import { ReactComponent as Minus } from '../../assets/common/minus.svg';
import  { ReactComponent as ArrowDown }  from '../../assets/common/arrowDownBlack.svg';
import { ReactComponent as CloseButton } from '../../assets/common/closeBtn.svg';

import ErrorModal from "../modal/ErrorModal";

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
  max-height : 520px;
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
  margin-top : 16px;
`;

const TitleP = styled.p`
    font-size : 16px;
    font-weight : 600;
    padding : 0px;
    margin : 0px;
`

const CategoryP = styled.p`
  font-size: 12px;
  font-weight: 400;
  color : #666666;
  padding : 0px;
  margin : 0px 0px 4px;
`;

const ContentDiv = styled.div`
  display: flex;
  flex-direction: row;
`;

const CategoryDiv = styled.div`
    display : flex;
    flex-direction : column;
    margin-top : 28px;
    margin-bottom : 20px;
`

const UnitP = styled.p`
  font-weight: 500;
  font-size : 14px;
  margin-left : 8px;
`;

const NumberP = styled.p`
  font-weight : 500;
  font-size : 14px;
`

const BudgetP = styled.p`
  font-weight : 500;
  font-size : !4px;
`

const NumberDiv = styled.div`
  display: flex;
  justify-content: center; /* 중앙 정렬 */
  align-items: center;
  background-color: #F9FAFC;
  border: 1px solid #F0F0F0;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  width: 106px;
  height: 44px;
  gap: 16px; /* 버튼과 숫자 사이의 간격 */
`;


const BudgetDiv = styled.div`
  display: flex;
  gap: 8px;
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

const BudgetInput = styled.input`
  width : 106px;
  hegiht : 44px;
  color : black;
  background-color : #F9FAFC;
  border : 1px solid #F0F0F0;
  border-radius : 10px;
  font-weight : 500;
  font-size : 14px;
  display : flex;
  text-align : center;
`;

const PeriodInput = styled.input`
  width : 42px;
  height : 44px;
  background-color : #F9FAFC;
  border : 1px solid #F0F0F0;
  border-radius : 10px;
  font-weight : 500;
  font-size : 14px;
  display : flex;  
  text-align : center;
`

const PeriodDiv = styled.div`
  display : flex;
  gap : 8px;
`
const DropdownWrapper = styled.div`
  position: relative;
  width: 80px;
`;

const DropdownButton = styled.button`
  width: 100%;
  height: 44px;
  font-size: 14px;
  background-color: #F9FAFC;
  border: 1px solid #F0F0F0;
  border-radius: 10px;
  cursor: pointer;
  text-align: center;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  
  &:focus {
    outline: none;
    border-color: #008de7;
  }
`;

const DropdownIcon = styled(ArrowDown)`
  width: 16px;
  height: 16px;
`;

const DropdownMenu = styled.ul`
  position: absolute;
  bottom: 48px; /* 버튼 위로 위치 */
  width: 100%;
  max-height: 88px; /* 최대 2개의 항목만 보이도록 높이 제한 (각 항목의 높이가 44px인 경우) */
  background-color: white;
  border: 1px solid #F0F0F0;
  border-radius: 10px;
  list-style: none;
  padding: 0;
  margin: 0;
  overflow-y: auto; /* 스크롤 활성화 */
  z-index: 100;
`;


const DropdownItem = styled.li`
  padding: 8px 16px;
  cursor: pointer;
  
  &:hover {
    background-color: #f1f1f1;
  }
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

  const [ isErrorOpen, setIsErrorOpen ] = useState(false);
  const [ errorMsg, setErrorMsg ] = useState('');

  const errorOpen = () => {
    setIsErrorOpen(true);
  }

  const [ person, setPerson ] = useState(1);

  const decreasePerson = () => {
    if(person==1){
      setErrorMsg("인원수는 1 이상이어야 합니다.");
      errorOpen();
      return;
    }
    setPerson(person-1);
  }

  const increasePerson = () => {
    setPerson(person+1);
  }

  const budgetValid = (value : string): boolean => {
    const regex = /^[0-9]*$/;
    return regex.test(value);
  }

  const periodValid = (value: string) : boolean => {
    const regex = /^[0-9]*$/;
    return value.length<=3 && regex.test(value);
  }

  const minBudget = useInput(budgetValid);
  const maxBudget = useInput(budgetValid);

  const minPeriod = useInput(periodValid);
  const maxPeriod = useInput(periodValid);

  const [selectedMonth, setSelectedMonth] = useState('1');
  const [dropDownOpen, setdropDownOpen] = useState(false);

  const months = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

  const toggleDropdown = () => setdropDownOpen(!dropDownOpen);

  const selectMonth = (month:any) => {
    setSelectedMonth(month);
    setdropDownOpen(false); // 선택 후 드롭다운 닫기
  };

  return (
    <Overlay
      className={` ${isOpen ? "open" : "closed"}`}
      onClick={!isErrorOpen ? handleClose : undefined}  // 에러 모달이 열려있을 때는 handleClose 실행 안 함
    >
      <Sheet className={` ${isOpen ? "open" : "closed"}`} onClick={(e) => e.stopPropagation()}>
        <Header>
          <TitleP>상세검색</TitleP>
          <CloseButton onClick={handleClose}>X</CloseButton>
        </Header>
        <CategoryDiv>
            <CategoryP>인원</CategoryP>
            <ContentDiv>
                <NumberDiv>
                <Minus onClick={decreasePerson}></Minus>
                <NumberP>{person}</NumberP>
                <Plus onClick={increasePerson}></Plus>
                </NumberDiv>
                <UnitP>명</UnitP>
            </ContentDiv>
            </CategoryDiv>
            <CategoryDiv>
                <CategoryP>예산</CategoryP>
                <ContentDiv>
                    <BudgetDiv>
                    <BudgetInput type="text" {...minBudget} />
                    <BudgetP>~</BudgetP>
                    <BudgetInput type="text" {...maxBudget}/>
                    </BudgetDiv>
                    <UnitP>원</UnitP>
                </ContentDiv>
            </CategoryDiv>
            <CategoryDiv>
                <CategoryP>기간</CategoryP>
                <ContentDiv>
                  <PeriodDiv>
                    <PeriodInput type="text" {...minPeriod}/>
                    <BudgetP>~</BudgetP> 
                    <PeriodInput type="text" {...maxPeriod}/>
                    <UnitP>일</UnitP>
                  </PeriodDiv>
                </ContentDiv>
            </CategoryDiv>
            <CategoryDiv>
          <CategoryP>여행 시기</CategoryP>
          <ContentDiv>
            <DropdownWrapper>
              <DropdownButton onClick={toggleDropdown}>
                {selectedMonth}
                <DropdownIcon />
              </DropdownButton>
              {dropDownOpen && (
                <DropdownMenu>
                  {months.map((month) => (
                    <DropdownItem key={month} onClick={() => selectMonth(month)}>
                      {month}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              )}  
            </DropdownWrapper>
            <UnitP>월</UnitP>
          </ContentDiv>
        </CategoryDiv>
        <SaveButton>저장</SaveButton>
      </Sheet>
      <ErrorModal isOpen={isErrorOpen} onClose={() => {setIsErrorOpen(false)}} msg={errorMsg}></ErrorModal>
    </Overlay>
  );
};

export default DetailSearchBottomSheet;