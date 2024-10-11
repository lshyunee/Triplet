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
    z-index: 10;
`;

const StyledP = styled.p`
    font-weight : 600;
    color : #008DE7;
    font-size : 20px;
    font-weight : 800;
    margin-left : 17px;
`;

const InviteButton = styled.button`
  font-size: 14px;
  font-weight: 500;
  color: #008DE7;
  border: solid 1px #008DE7;
  height: 32px;
  width: 76px;
  border-radius: 50px;
  /* background-color: #FFFFFF; */
  margin-right: 20px;
  cursor: pointer;
`;

const ButtonArea = styled.div`
  display: flex;
  align-items: center;
`

const Header: React.FC = () => {

  const navigate = useNavigate();

  const inviteOnClick = () => {
    navigate('/travels/invite')
  }

  return (
    <StyledDiv>
        <Link to="/" style={{ textDecoration: 'none' }}>
            <StyledP>Triplet</StyledP>
        </Link>
        <ButtonArea>
          <InviteButton onClick={inviteOnClick}>초대코드</InviteButton>
          <Link to="/alarm">
            <Alarm/>
          </Link>
        </ButtonArea>
    </StyledDiv>
  );
}

export default Header;
