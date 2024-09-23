import React from 'react';
import { Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components';
import {ReactComponent as Alarm} from '../../assets/header/alarm.svg';

// 스타일
const StyledDiv = styled.div`
    box-sizing: border-box;
    width: 100%;
    height: 56px;
    display:flex;
    align-items: center;
    flex-direction:row;
    justify-content: space-between;  /* 양 끝에 배치 */
    padding-right : 17px;
    background-color : #F3F4F6;
    position: fixed;
`;

const StyledP = styled.p`
    font-weight : 600;
    color : #008DE7;
    font-size : 20px;
    font-weight : 800;
    margin-left : 17px;
`;

const Header: React.FC = () => {

  const navigate = useNavigate();

  return (
    <StyledDiv>
        <Link to="/home" style={{ textDecoration: 'none' }}>
            <StyledP>Triplet</StyledP>
        </Link>
        <Alarm/>
    </StyledDiv>
  );
}

export default Header;
