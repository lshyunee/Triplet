import React, {useEffect, useState} from 'react';
import Header from '../../components/header/Header';
import { useDispatch } from 'react-redux';
import { pageMove } from '../../features/navigation/naviSlice';
import styled from 'styled-components';

import useAxios from '../../hooks/useAxios';
import useInput from '../../hooks/useInput';
import { ReactComponent as Search } from '../../assets/common/search.svg';
import { ReactComponent as ArrowDown } from '../../assets/common/arrowDown.svg';
import { ReactComponent as Filter } from '../../assets/common/filter.svg';

import SnsTravelCardMini from '../../components/travel/SnsTravelCardMini';
import DetailSearchBottomSheet from '../../components/travel/DetailSearchBottomSheet';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { addFeedTravels } from '../../features/travel/snsTravelSlice';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';

const FeedDiv = styled.div`
    background-color : #F3F4F6;
    min-height: calc(100vh - 112px);
    padding : 0 16px 0;
    margin : 56px 0 56px 0;
`;

const TitleDiv = styled.div`
    margin-top : 8px;
`;

const TitleP = styled.p`
    font-size : 20px;
    font-weight : 800;
    margin : 12px 0px 0;
`;

const TitleExplainP = styled.p`
    font-size : 16px;
    font-weight : 600;
    color : #008DE7;
    margin : 8px 0 0 0;
`;

const SearchDiv = styled.p`
    margin-top:40px;
    position: relative;
    display: flex;
    align-items: center;
`

const SearchWrapper = styled.div`
    position: absolute;
    left: 10px;
    display: flex;
    align-items: center;
    height: 100%;
`

const FilterWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 4px; /* 텍스트와 아이콘 사이에 간격 */
`

const SearchInput = styled.input`
    width : 100%;
    height : 44px;
    background-color : white;
    color : black;
    border : 1px solid #F0F0F0;
    border-radius : 50px;
    text-indent : 30px;

    &::placeholder {
    color : #AEAEAE; 
    }
`

const FilterDiv = styled.div`
    margin-top : 12px;
    display : flex;
    justify-content : space-between;
`;

const FilterDownDiv = styled.div`
    display : flex;
    flex-direction : row;
    text-align : center;
    align-items : center;
    gap : 4px;
`

const FilterP = styled.p`
    font-size : 14px;
    font-weight : 500;
    color : #008DE7;
`;

const FilterBtn = styled.button`
    display: flex;
    align-items: center;
    width: 86px;
    height : 37px;
    background-color : #E6F2FF;
    color : #008DE7;
    border : none;
    border-radius : 50px;
    padding : 12px;
    font-size : 12px;
    font-weight : 500;

    &:hover {
        background-color: #D0E8FF;
    }
`;

const TravelDiv = styled.div`
    margin-top: 12px;
    display: grid;
    grid-template-columns: repeat(2, 1fr); /* 각 칼럼의 너비를 균등하게 설정 */
    gap: 16px;
    place-items: center;
    justify-content: start;
    margin-bottom: 26px;
    height: auto; /* 부모의 높이에 맞게 자동으로 크기 설정 */
`;


const FeedPage = () => {

    const dispatch = useDispatch();
    const selector = useSelector;
    const filter = selector((state : RootState) => state.filterTravel);
    const travels = selector((state : RootState) => state.snsTravel);

    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);

    useEffect(() => {
        dispatch(pageMove("feed"));
    }, [])

    const { data : searchData, error : searchError, status : searchStatus,
        loading : searchLoading, refetch : searchRefetch
       } = useAxios("travels/shared", "GET",
        {
          countryName : filter.countryName === '' ? null : filter.countryName,
          memberCount : filter.memberCount,
          minBudget : filter.minBudget === 0 ? null : filter.minBudget,
          maxBudget : filter.maxBudget === 0 ? null : filter.maxBudget,
          minPeriod : filter.minDays === 0 ? null : filter.minDays,
          maxPeriod : filter.maxDays === 0 ? null : filter.maxDays,
          page : page,
          kind : filter.kind
    });

    useEffect(() => {
        if (hasMore && !searchLoading) {
            searchRefetch();
        }
    }, [page, hasMore]);

    useEffect(() => {
        if (searchData && searchData.data.content.length > 0) {
            dispatch(addFeedTravels(searchData.data.content));
            console.log(searchData.data.content);
        } else {
            setHasMore(false); // 더 이상 데이터가 없으면 로딩을 중단
        }
    }, [searchData, searchError]);

    const loadMore = () => {
        if (!searchLoading && hasMore) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    const targetRef = useIntersectionObserver(loadMore, {
        root: null,
        rootMargin: '0px',
        threshold: 1.0,
    });

    const valid = (value:string) => {
        const regex = /^[가-힣]*$/;
        return regex.test(value);
    }

    const country = useInput(valid);

    const [ isBottomSheetOpen, setIsBottomSheetOpen ] = useState(false);

    return (
        <>
            <Header/>
            <FeedDiv>
                <TitleDiv>
                    <TitleP>여행 피드</TitleP>
                    <TitleExplainP>가고 싶은 여행지를 찾아보세요.</TitleExplainP>
                </TitleDiv>
                <SearchDiv>
                    <SearchWrapper>
                        <Search/>                        
                    </SearchWrapper>
                    <SearchInput placeholder='여행지를 입력하세요.'></SearchInput>
                </SearchDiv>
                <FilterDiv>
                    <FilterDownDiv>
                        <FilterP>추천순</FilterP>
                        <ArrowDown/>
                    </FilterDownDiv>
                    <FilterDownDiv>
                        <FilterBtn onClick={() => setIsBottomSheetOpen(true)}>
                        <FilterWrapper>
                            <Filter width={16} height={16}/>
                        </FilterWrapper>
                        상세검색
                        </FilterBtn>
                    </FilterDownDiv>
                </FilterDiv>
                <TravelDiv>
                    {travels?.travelData.map((travel, index) => (
                        <SnsTravelCardMini
                            key={travel.id}
                            title={travel.title}
                            days={travel.days}
                            totalBudgetWon={travel.totalBudgetWon}
                            memberCount={travel.memberCount}
                        />
                    ))}
                    <div ref={targetRef} style={{ height: '20px', backgroundColor: 'transparent' }} />
                </TravelDiv>
                <DetailSearchBottomSheet isOpen={isBottomSheetOpen} 
            onClose={() => setIsBottomSheetOpen(false)}></DetailSearchBottomSheet>
            </FeedDiv>
        </>
    );
};

export default FeedPage;