import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import leftArrow from '../../assets/header/leftArrow.png';

// props 타입 정의
interface HeaderProps {
  title: string;  // title은 문자열 타입
}


// 스타일
const StyledDiv = styled.div`
    display: flex;
    width: 100%;
    height: 56px;
    align-items: center;
    flex-direction: row;
    background-color: white;
    padding: 5px 15px;
`;

const StyledP = styled.p`
    font-weight: 600;
    font-size: 16px;
    margin-left: 12px;
`;

const BackHeader: React.FC<HeaderProps> = ({title}) => {
  const navigate = useNavigate();

  return (
    <StyledDiv>
      <img onClick={() => navigate(-1)} src={leftArrow} alt="arrow" />
      <StyledP>{title}</StyledP> {/* title을 출력 */}
    </StyledDiv>
  );
}

export default BackHeader;
