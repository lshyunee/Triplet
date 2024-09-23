import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import rightArrow from '../../assets/header/rightArrow.png';
import { useSelector } from 'react-redux';

// 스타일
const StyledDiv = styled.div`
    display: flex;
    align-items: center;
    flex-direction: row;
    padding: 5px 15px;
`;

const StyledP = styled.p`
    font-weight: 600;
    font-size: 16px;
    margin-left: 12px;
`;

const BackHeader: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // useSelector를 통해 리덕스 상태에서 title을 바로 가져옴
  const titleObject = useSelector((state: any) => state.title);
  const title = typeof titleObject === 'string' ? titleObject : titleObject?.title || '';

  return (
    <StyledDiv>
      <img onClick={() => navigate(-1)} src={rightArrow} alt="arrow" />
      <StyledP>{title}</StyledP> {/* title을 출력 */}
    </StyledDiv>
  );
}

export default BackHeader;
