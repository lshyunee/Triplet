import React from 'react';
import { Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components';
import alarm from '../../assets/header/alarm.png';

// 스타일
const StyledDiv = styled.div`
    width: 100%;
    height: 56px;
    display:flex;
    align-items: center;
    flex-direction:row;
    justify-content: space-between;  /* 양 끝에 배치 */
    background-color : #F3F4F6;
<<<<<<< HEAD
    height : 56px;
=======
>>>>>>> 56b037eb8c783fe12fd914b3e2e195d4352b4d0f
`;

const StyledP = styled.p`
    font-weight : 600;
    color : #008DE7;
    font-size : 20px;
    font-weight : 800;
    margin-left : 12px;
`;

const Header: React.FC = () => {

  const navigate = useNavigate();

  return (
    <StyledDiv>
        <Link to="/home" style={{ textDecoration: 'none' }}>
            <StyledP>Triplet</StyledP>
        </Link>
        <img onClick={() => navigate("/alarm")} src={alarm} alt="alarm" />
    </StyledDiv>
  );
}

export default Header;
