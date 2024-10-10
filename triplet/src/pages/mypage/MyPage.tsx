import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import BackHeader from '../../components/header/BackHeader';
import { pageMove } from '../../features/navigation/naviSlice';
import { ReactComponent as RightArrow} from '../../assets/common/rightArrow.svg';

import Logout from '../user/logout/LogoutModal';
import Notification from '../user/notification/NotificationModal';
import WithdrawalModal from '../user/withdrawal/WithdrawalModal';
import ErrorModal from '../../components/modal/ErrorModal';

import { useSelector } from 'react-redux';

const PageDiv = styled.div`
    background-color : #F3F4F6;
    width: 100%;
    min-height: (100vh - 112px);
    padding : 56px 0;
    > *{
        margin-bottom : 8px;
    }
`;

const TitleP = styled.p`
    font-size : 16px;
    font-weight : 600;
    margin-top : 40px;
    margin-left : 16px;
`;

const InfoP = styled.p`
        font-size : 14px;
        height : 14px;
        font-weight : 500;
        color : #666666;
        margin-left : 12px;
        margin-top : 0px;
        margin-bottom : 0px;
    `;

const CategoryP = styled.p`
    font-size : 14px;
    font-weight : 500;
    margin : 0px;
    box-sizing: border-box;
`;

const MyInfoDiv = styled.div`
    display : flex;
    flex-direction : column;
    width : 100%;
    height : 194px;
    background-color : white;

   ${TitleP} {
        margin-bottom:20px;
    }
`;

const MyInfoConfigDiv = styled.div`
    display : flex;
    flex-direction : column;
    width: 100%;
    height : 100%;
    background-color : white;
    margin-bottom : 24px;

    ${TitleP} {
        margin-bottom:24px;
    }
`

const InfoDiv = styled.div`
    display : flex;
    flex-direction : row;
    margin-bottom: 12px;
    height : 14px;

    ${InfoP} {
        width: 81px;
    }

`;

const ConfigDiv = styled.div`
    box-sizing: border-box;
    width : 100%;
    height: 24px;
    display: flex;
    flex-direction: row;
    justify-content : space-between;
    align-items: center;
    margin-top : 0px;
    margin-bottom :32px;
    padding-left : 16px;
    padding-right : 10px;
`;

const StyledLink = styled(Link)`
  text-decoration: none;  /* 밑줄 제거 */
  color: inherit;         /* 부모 요소의 색상 계승, 원하는 색으로 설정 가능 */
`;

const MyPage = () => {

    const title = "마이페이지"
    const dispatch = useDispatch();
    const [ isLogOutOpen, setIsLogOutOpen ] = useState(false);
    const [ isNotifictaionOpen, setIsNotifictaionOpen ] = useState(false);
    const userData = useSelector((state:any) => state.userInfo);

    const { memberId, name, birth, phoneNumber } = userData;

    useEffect(() => {
        dispatch(pageMove("mypage"));
        console.log(memberId);
    }, [])

    const openNotifictaion = () => {
        setIsNotifictaionOpen(true);
    };

    const closeNotifictaion = () => {
        setIsNotifictaionOpen(false);
    } 

    const openLogout = () => {
        setIsLogOutOpen(true);
    };

    const closeLogout = () => {
        setIsLogOutOpen(false);
    } 

    const [ isWithdrawal, setIsWithdrawal ] = useState(false);
    
    const withdrawal = () => {
        setIsWithdrawal(true);
    }

    const [ errorMsg, setErrorMsg] = useState('...');

    const kakaoDontGoPassword = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        if(memberId.slice(0,5)==="kakao"){
            event.preventDefault();
        }
        setErrorMsg("카카오 계정은 비밀번호를 변경할 수 없습니다.");
        clickPassword();
    }

    const [ isError, setIsError ] = useState(false);

    const clickPassword = () => {
        setIsError(true);
    }

    return (
        <>
            <BackHeader title={title}/>
            <PageDiv>
                <MyInfoDiv>
                    <TitleP>내 정보</TitleP>
                    <InfoDiv>
                        <InfoP>이름</InfoP>
                        <CategoryP>{name}</CategoryP>
                    </InfoDiv>
                    <InfoDiv>
                        <InfoP>생년월일</InfoP>
                        <CategoryP>{birth}</CategoryP>
                    </InfoDiv>
                    <InfoDiv>
                        <InfoP>전화번호</InfoP>
                        <CategoryP>{phoneNumber}</CategoryP>
                    </InfoDiv>
                    
                </MyInfoDiv>
                <MyInfoConfigDiv>
                    <TitleP>회원정보 설정</TitleP>
                    <StyledLink to="/mypage/info-edit">
                        <ConfigDiv>
                            <CategoryP>내 정보 수정</CategoryP>
                            <RightArrow/>
                        </ConfigDiv>
                    </StyledLink>
                    <StyledLink to="/simple-password/set">
                        <ConfigDiv>
                            <CategoryP>간편 비밀번호 재설정</CategoryP>
                            <RightArrow/>
                        </ConfigDiv>
                    </StyledLink>
                    <StyledLink to="/mypage/password-edit" onClick={(event) => kakaoDontGoPassword(event)}>
                        <ConfigDiv>
                            <CategoryP>비밀번호 변경</CategoryP>
                            <RightArrow/>
                        </ConfigDiv>
                    </StyledLink>
                    <ConfigDiv onClick={openNotifictaion}>
                        <CategoryP>Push 알림 설정</CategoryP>
                        <RightArrow/>
                    </ConfigDiv>
                    <ConfigDiv onClick={openLogout}>
                        <CategoryP>로그아웃</CategoryP>
                        <RightArrow/>
                    </ConfigDiv>
                    <ConfigDiv onClick={withdrawal}>
                        <CategoryP>회원탈퇴</CategoryP>
                        <RightArrow/>
                    </ConfigDiv>
                </MyInfoConfigDiv>
                <Logout isOpen={isLogOutOpen} onClose={closeLogout}></Logout>
                <Notification isOpen={isNotifictaionOpen} onClose = {closeNotifictaion}></Notification>
                <WithdrawalModal isOpen={isWithdrawal} onClose={()=>{setIsWithdrawal(false)}}/>
                <ErrorModal isOpen={isError} onClose={() => {setIsError(false)}} msg={errorMsg}></ErrorModal>   
            </PageDiv>
           
        </>
    );
};

export default MyPage;