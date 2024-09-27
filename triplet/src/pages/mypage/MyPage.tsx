import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import BackHeader from '../../components/header/BackHeader';
import { pageMove } from '../../features/navigation/naviSlice';
import useAxios from '../../hooks/useAxios';
import { ReactComponent as RightArrow} from '../../assets/common/rightArrow.svg';

import Logout from '../user/logout/LogoutModal';

const PageDiv = styled.div`
    background-color : #F3F4F6;
    width: 100%;
    min-height: 100vh;
    padding-top : 56px;
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
    height : 370px;
    background-color : white;

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
    const [ name, setName ] = useState('');
    const [ birth, setBirth ] = useState('');
    const [ phoneNum, setPhoneNum ] = useState('');
    const [ isLogOutOpen, setIsLogOutOpen ] = useState(false);

    useEffect(() => {
        dispatch(pageMove("mypage"));
    }, [])

    const { data: infoData, error: infoError, loading: infoLoading,
        status: infoStatus, refetch: infoRefetch }
        = useAxios('/user/my', 'GET');

    useEffect(() => {
        infoRefetch();
    },[])

    useEffect(() => {
        if(infoData!==null){
            console.log(infoData);
            setName(infoData.data.name);
            setBirth(infoData.data.birth);
            setPhoneNum(infoData.data.phoneNumber);
        }
    },[infoData]);

    const openLogout = () => {
        setIsLogOutOpen(true);
    };

    const closeLogout = () => {
        setIsLogOutOpen(false);
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
                        <CategoryP>{phoneNum}</CategoryP>
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
                    <StyledLink to="/mypage/password-edit">
                        <ConfigDiv>
                            <CategoryP>비밀번호 변경</CategoryP>
                            <RightArrow/>
                        </ConfigDiv>
                    </StyledLink>
                    <ConfigDiv onClick={openLogout}>
                        <CategoryP>로그아웃</CategoryP>
                        <RightArrow/>
                    </ConfigDiv>
                    <ConfigDiv>
                        <CategoryP>회원탈퇴</CategoryP>
                        <RightArrow/>
                    </ConfigDiv>
                </MyInfoConfigDiv>
                <Logout isOpen={isLogOutOpen} onClose={closeLogout}></Logout>
            </PageDiv>
        </>
    );
};

export default MyPage;