import React, { useEffect } from 'react';
import styled from 'styled-components';
import OngoingTravelCard from '../../components/travel/OngoingTravelCard';
import Header from '../../components/header/Header';
import { useSelector, useDispatch } from 'react-redux';
import { pageMove } from '../../features/navigation/naviSlice';
import { ongoingTravelDataInsert } from '../../features/travel/ongoingTravelSlice';
import { Link as RouterLink, useNavigate} from 'react-router-dom';

import { ReactComponent as SimplePay} from '../../assets/main/simplePay.svg';
import { ReactComponent as TravelPlan} from '../../assets/main/travelPlan.svg';
import { ReactComponent as RightArrow} from '../../assets/common/rightArrow.svg';

import { ReactComponent as USFlag } from '../../assets/pay/us.svg';
import { ReactComponent as EUFlag } from '../../assets/pay/eu.svg';
import { ReactComponent as JPFlag } from '../../assets/pay/jp.svg';
import { ReactComponent as CHFlag } from '../../assets/pay/ch.svg';
import { ReactComponent as UKFlag } from '../../assets/pay/uk.svg';
import { ReactComponent as SWFlag } from '../../assets/pay/sw.svg';
import { ReactComponent as CAFlag } from '../../assets/pay/ca.svg';
import UpcomingTravelCard from '../../components/travel/UpcomingTravelCard';
import useAxios from '../../hooks/useAxios';
import UpcomingTravelHomeCard from '../../components/travel/UpcomingTravelHomeCard';
import CreateTravelCard from '../../components/travel/CreateTravelCard';
import { setUserInfo } from '../../features/user/userInfoSlice';
import { loginSuccess, logout } from '../../features/auth/authSlice';
import GlobalAccount from '../../components/pay/GlobalAccount';

const MainDiv = styled.div`
    background-color: #F3F4F6;
    min-height : 100vh;
`

const HomeDiv = styled.div`
    display: flex;
    flex-direction: column;
    padding-top: 68px; /* Header의 높이만큼 패딩을 추가 */
    padding-bottom : 56px;
    margin : 0 16px;
`;

const TitleP = styled.p`
    font-size:16px;
    font-weight : 600;
`

const Link = styled(RouterLink)`
    display: block;  /* Link를 블록 요소로 변환 */
    width: 100%;
    text-decoration : none;
    color : inherit;
`;

const LittleTitleDiv = styled.div`
    display:flex;
    flex-direction:row;
    align-items:center;
`;

const LittleDiv = styled.div`
    width: 100%;
    box-sizing: border-box;
    height : 64px;
    display : flex;
    flex-direction : row;
    background-color : white;
    border-radius : 20px;
    align-items: center;
    padding : 16px;
    justify-content : space-between;
    margin-top : 12px;
    
    ${TitleP}{
        margin-left: 12px;
    }

    &:hover {
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1); /* 그림자 효과 */
    border-radius: 20px;
    transition: box-shadow 0.3s ease; /* 부드러운 전환 효과 */
    }
`

const TitleDiv = styled.div`
    height : 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const LargeDiv = styled.div`
    height : 200px;
    background-color: #ffffff;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    padding : 20px;
    margin-bottom : 32px;

    &:hover {
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1); /* 그림자 효과 */
    border-radius: 20px;
    transition: box-shadow 0.3s ease; /* 부드러운 전환 효과 */
    }
`;

const AccountDiv = styled.div`
    /* height : 200px; */
    background-color: #ffffff;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    padding-bottom: 10px;
    margin-bottom : 32px;

    &:hover {
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1); /* 그림자 효과 */
    border-radius: 20px;
    transition: box-shadow 0.3s ease; /* 부드러운 전환 효과 */
    }
`;

const AccountTitle = styled.div`
    height : 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
    padding-bottom: 10px;
`;

const Card = styled.div`
    background-color: #ffffff;
    border-radius: 20px;
    margin-bottom: 12px;
    padding : 20px;
    display: flex;
    flex-direction: column;
    margin-top : 12px;
    cursor: pointer;

    &:hover {
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1); /* 그림자 효과 */
    border-radius: 20px;
    transition: box-shadow 0.3s ease; /* 부드러운 전환 효과 */
    }
`;

const CardTitle = styled.span`
    font-size: 16px;
    font-weight: 600;
`;

const CardTitleArea = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const CardCaption = styled.span`
    font-size: 14px;
    font-weight: 400;
    color: #666666;
    padding-top: 24px;
`;

const CardContent = styled.span`
    font-size: 16px;
    font-weight: 600;
    align-self: flex-end;
`;

const CardButton = styled.button`
    border: 0;
    background-color: #E6F2FF;
    color: #008DE7;
    font-size: 14px;
    font-weight: 600;
    width: 65px;
    height: 36px;
    border-radius: 50px;
    cursor: pointer;
`;

const ButtonArea = styled.div`
    display: flex;
    justify-content: space-between;
`;

const HomePage = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(pageMove("home"));
    }, [])

    // Redux 스토어에서 데이터를 가져옴
    const travelData = useSelector((state:any) => state.ongoingTravel);
    const upcomingTravel = useSelector((state: any) => state.upcomingTravels?.travels || []);
    const userData = useSelector((state:any) => state.userInfo);

    // useAxios 훅으로 데이터 요청
    const { data: infoData, error: infoError, refetch: infoRefetch } 
    = useAxios("/travels/ongoing", "GET");
    const { data : userInfoData, error: userInfoError, status: userInfoStatus, refetch: userInfoRefetch } 
    = useAxios("/user/my","GET");
    const { data : upcomingData, error : upcomingError, refetch : upcomingRefetch} 
    = useAxios("/travels/upcoming", "GET");

    // 컴포넌트가 처음 렌더링될 때, 데이터가 없으면 Axios 요청을 트리거
    useEffect(() => {
        if (!travelData.travelId) {
            infoRefetch();
        }
    }, [travelData.travelId]);


    useEffect(()=>{
        if (!userData.memberId) {
            userInfoRefetch();
        }
    }, [userData])

    // Axios 요청 결과를 Redux 스토어에 저장
    useEffect(() => {
        if (infoData?.data) {
            dispatch(ongoingTravelDataInsert({
              travelId: infoData.data.travelId,
              title: infoData.data.title,
              startDate: infoData.data.startDate,
              endDate: infoData.data.endDate,
              image: infoData.data.image,
              countryName: infoData.data.countryName,
              countryId: infoData.data.countryId,
              currency: infoData.data.currency,
              memberCount: infoData.data.memberCount,
              totalBudget: infoData.data.totalBudget,
              status: infoData.data.status,
              shareStatus: infoData.data.shareStatus,
              shared: infoData.data.shared,
            }));
          }
          
        if (infoError) {
            if(infoError.response.data.message){
                console.log(infoError.response.data.message);
            }
        }

    }, [infoData, infoError]);

    useEffect(() => {

        if (userInfoData!==401){
            dispatch(loginSuccess());
        }

        if (userInfoError){
            dispatch(logout());
        }

        // userInfoData가 존재하고, userInfoStatus가 200일 때 Redux에 데이터를 저장
        if (userInfoData && userInfoStatus === 200 && userInfoData.data) {
            dispatch(setUserInfo({
                memberId: userInfoData.data.memberId,
                name: userInfoData.data.name,
                birth: userInfoData.data.birth,
                gender: userInfoData.data.gender,
                phoneNumber: userInfoData.data.phoneNumber,
            }));
        }
    
        if(userInfoStatus&&userInfoStatus!==200){
            if (!userInfoData || !userInfoData.data) {
                navigate('/login');
            } else if (userInfoData.data){
                const { memberId, name, birth, gender, phoneNumber } = userInfoData.data;
                if (
                    memberId === null || memberId === undefined ||
                    name === null || name === undefined ||
                    birth === null || birth === undefined ||
                    gender === null || gender === undefined ||
                    phoneNumber === null || phoneNumber === undefined
                ) {
                    navigate('/mypage/info-set');
                }
            }
        }
    }, [userInfoData, userInfoError]);


    const { data: foreignAccountData, 
		error: foreignAccountError, 
		loading: foreignAccountLoading, 
		status: foreignAccountStatus, 
		refetch: foreignAccountRefetch } = useAxios('/foreign-account', 'GET');

    const { data: accountData, 
        error: accountError, 
        loading: accountLoading, 
        status: accountStatus, 
        refetch: accountRefetch } = useAxios('/account', 'GET');

    const { data: exchangeRateData, 
        error: exchangeRateError, 
        loading: exchangeRateLoading, 
        status: exchangeRateStatus, 
        refetch: exchangeRateRefetch } = useAxios('/exchange-rate-list', 'GET');
    
    useEffect(() => {
        const fetchData = async () => {
            try {
            await Promise.all([
                accountRefetch(),
                exchangeRateRefetch(),
                foreignAccountRefetch()   // 원화계좌 API 요청
            ]);
            } catch (error) {
            console.error('Error fetching data:', error);
            }
        };
    
        fetchData();
    }, []);
    
    useEffect(() => {
    }, [accountData])

    const accountOnClick = () => {
		navigate('/pay/account-detail');
	};

    const transferOnclick = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		navigate('/pay/transfer');
	};
 
    return (
        <MainDiv>
            <Header/>
            <HomeDiv>
                {travelData.travelId ? (
                    <Link to="/travels/ongoing/detail">
                        <OngoingTravelCard />
                    </Link>
                ) : (
                    upcomingData?.length > 0 ? (
                        <UpcomingTravelHomeCard />
                    ) : (
                        <CreateTravelCard/>
                    )
                )}
                <Link to="/pay/qr">
                    <LittleDiv>
                        <LittleTitleDiv>    
                            <SimplePay/>
                            <TitleP>간편결제</TitleP>
                        </LittleTitleDiv>
                        <RightArrow/>
                    </LittleDiv>
                </Link>
                <Link to="/travels/create">
                    <LittleDiv>
                        <LittleTitleDiv>
                            <TravelPlan/>
                            <TitleP>여행 계획 만들기</TitleP>
                        </LittleTitleDiv>
                        <RightArrow/>
                    </LittleDiv>
                </Link>
                <Card onClick={accountOnClick}>
                    <CardTitleArea>
                        <CardTitle>내 통장</CardTitle>
                        <RightArrow/>
                    </CardTitleArea>
                    {accountData?.data.bankName === '바나나은행' ? (
                    <CardCaption>Triplet {accountData?.data.accountNumber}</CardCaption>
                    ) : (
                    <CardCaption>{accountData?.data.bankName} {accountData?.data.accountNumber}</CardCaption>
                    )}
                    <ButtonArea>
                        <CardContent>{accountData?.data.accountBalance.toLocaleString()}원</CardContent>
                        <CardButton onClick={transferOnclick}>송금</CardButton>
                    </ButtonArea>
                </Card>
                <Link to="/pay/global-wallet">
                    <AccountDiv>
                        <AccountTitle>
                            <TitleP>내 외화 지갑</TitleP>
                            <RightArrow/>
                        </AccountTitle>
                        <GlobalAccount
							nation='미국'
							foreignCurrency={foreignAccountData?.data[6]?.accountBalance}
							isExchange={false}
							accountId={foreignAccountData?.data[6]?.accountId}
                            rate={exchangeRateData?.data[4]?.exchangeRate}
						/>
                        <GlobalAccount
							nation='유럽'
							foreignCurrency={foreignAccountData?.data[3]?.accountBalance}
							isExchange={false}
							accountId={foreignAccountData?.data[3]?.accountId}
                            rate={exchangeRateData?.data[0]?.exchangeRate}
						/>
						<GlobalAccount
							nation='일본'
							foreignCurrency={foreignAccountData?.data[5]?.accountBalance}
							isExchange={false}
							accountId={foreignAccountData?.data[5]?.accountId}
                            rate={exchangeRateData?.data[3]?.exchangeRate}
						/>
                    </AccountDiv>
                </Link>
            </HomeDiv>
        </MainDiv>
    );
};

export default HomePage;