import React from 'react';
import styled from 'styled-components';
import rightArrow from '../../assets/header/rightArrow.png';

// props 타입 정의
interface HeaderProps {
  title: string;  // title은 문자열 타입
}

// 스타일
const StyledDiv = styled.div`
    display:flex;
    align-items: center;
    flex-direction:row;
    padding: 5px 15px;
`;

const StyledP = styled.p`
    font-weight : 600;
    font-size : 16px;
    margin-left : 12px;
`;

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <StyledDiv>
      <img src={rightArrow} alt="arrow" />
      <StyledP>{title}</StyledP>  {/* title을 출력 */}
    </StyledDiv>
  );
}

export default Header;
