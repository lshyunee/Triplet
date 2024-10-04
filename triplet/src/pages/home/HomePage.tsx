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

const Card = styled.div`
    background-color: #ffffff;
    border-radius: 20px;
    margin-bottom: 12px;
    padding : 20px;
    display: flex;
    flex-direction: column;
    margin-top : 12px;

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
    const upcomingData = useSelector((state: any) => state.upcomingTravels?.travels || []);
    const userData = useSelector((state:any) => state.userInfo);

    // useAxios 훅으로 데이터 요청
    const { data: infoData, error: infoError, refetch: infoRefetch } = useAxios("/travels/ongoing", "GET");
    const { data : userInfoData, error: userInfoError, status: userInfoStatus, refetch: userInfoRefetch } = useAxios("/user/my","GET");

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
        if (infoData) {
            dispatch(ongoingTravelDataInsert({
                travelId: infoData.travelId,
                title: infoData.title,
                startDate: new Date(infoData.startDate),
                endDate: new Date(infoData.endDate),
                image: infoData.image,
                countryName: infoData.countryName,
                countryId: infoData.countryId,
                currency: infoData.currency,
                memberCount: infoData.memberCount,
                totalBudget: infoData.totalBudget,
                status: infoData.status,
                shareStatus: infoData.shareStatus,
                shared: infoData.shared,
            }));
        }

        if (infoError) {
            if(infoError.response.data.message){
                console.log(infoError.response.data.message);
            }
        }
    }, [infoData, infoError]);

    useEffect(() => {

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
    
        if(userInfoStatus!==null&&userInfoStatus!==200){
            console.log(userInfoStatus);
            // userInfoData가 없거나 필드가 null/undefined일 때 '/mypage/info-set'으로 이동
            if (!userInfoData || !userInfoData.data) {
                navigate('/mypage/info-set');
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
    
 
    return (
        <MainDiv>
            <Header/>
            <HomeDiv>
                {travelData.travelId ? (
                    <Link to="/travels/ongoing/detail">
                        <OngoingTravelCard />
                    </Link>
                ) : (
                    upcomingData.length > 0 ? (
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
                <Link to="/pay/account-detail">
                    <Card>
                        <CardTitleArea>
                            <CardTitle>내 통장</CardTitle>
                            <RightArrow/>
                        </CardTitleArea>
                        <CardCaption>은행 312-9446-0093</CardCaption>
                        <ButtonArea>
                            <CardContent>20,000,000원</CardContent>
                            <CardButton>송금</CardButton>
                        </ButtonArea>
                    </Card>
                </Link>
                <Link to="/pay/global-wallet">
                    <LargeDiv>
                        <TitleDiv>
                            <TitleP>내 외화 지갑</TitleP>
                            <RightArrow/>
                        </TitleDiv>
                    </LargeDiv>
                </Link>
            </HomeDiv>
        </MainDiv>
    );
};

export default HomePage;