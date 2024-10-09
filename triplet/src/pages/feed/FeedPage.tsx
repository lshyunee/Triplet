import React, {useEffect, useState, useRef} from 'react';
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
import { initFeedTravels, addFeedTravels } from '../../features/travel/snsTravelSlice';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';
import { addFilter, setCountry, setFilter, initFilter  } from '../../features/travel/snsTravelFilterSlice';

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
    position: relative;
    display: flex;
    align-items: center;
    margin-top : 40px;
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
    display : flex;
    justify-content : space-between;
`;


const FilterP = styled.p`
    font-size : 14px;
    font-weight : 500;
    color : #008DE7;
    margin-left : 10px;
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

const FilterDownDiv = styled.div`
    display: flex;
    flex-direction: row;
    text-align: center;
    align-items: center;
    gap: 4px;
    margin-right : 10px;
    position: relative; /* 추가: DropdownMenu의 absolute 위치를 위한 부모 기준 */
`;

const DropdownMenu = styled.ul<{ isOpen: boolean }>`
    display: block;
    position: absolute;
    background-color: white;
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1);
    list-style: none;
    margin: 0;
    padding: 0;
    z-index: 100;
    width: 70px;
    border-radius: 5px;
    top: 35px;
    color : #0082D4;
    border-radius : 0 0 10px 10px;
    font-size : 14px;
    font-weight : 600;

    max-height: ${({ isOpen }) => (isOpen ? '200px' : '0')};
    overflow: hidden;
    transition: max-height 0.3s ease-in-out; 
`;


const DropdownItem = styled.li`
    padding: 10px;
    cursor: 'pointer';
    background-color: 'white';
    color:'#0082D4';

    &:hover {
        background-color: '#f0f0f0';
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

const SearchP = styled.p`
    color : #008DE7;
    font-size : 18px;
    font-weight : 600;
    margin : 15px 0 0 0;
`;

const TargetDiv = styled.div`
    height: 20px;
    background-color: transparent;
`;

const FeedPage = () => {

    const dispatch = useDispatch();
    const selector = useSelector;

    const filter = selector((state : RootState) => state.filterTravel);
    const travels = selector((state : RootState) => state.snsTravel);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedSortOption, setSelectedSortOption] = useState('추천순');

    const dropdownRef = useRef<HTMLDivElement | null>(null);

    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);

    const countryName = useInput();

    const { data : searchData, error : searchError, status : searchStatus,
        loading : searchLoading, refetch : searchRefetch
       } = useAxios("/travels/shared", "GET",
        {
            countryName : filter.kind === 0 || filter.kind === 1 || filter.countryName === '' ? null : filter.countryName,
            memberCount : filter.kind === 0 || filter.kind === 1 || filter.memberCount === 0 ? null : filter.memberCount,
            minBudget : filter.kind === 0 || filter.kind === 1 || filter.minBudget === 0 ? null : filter.minBudget,
            maxBudget : filter.kind === 0 || filter.kind === 1 || filter.maxBudget === 0 ? null : filter.maxBudget,
            minDays : filter.kind === 0 || filter.kind === 1 || filter.minDays === 0 ? null : filter.minDays,
            maxDays : filter.kind === 0 || filter.kind === 1 || filter.maxDays === 0 ? null : filter.maxDays,
            page : page,
            kind : filter.kind
    });

    // console.log({
    //     countryName : filter.kind === 0 || filter.kind === 1 || filter.countryName === '' ? null : filter.countryName,
    //     memberCount : filter.kind === 0 || filter.kind === 1 || filter.memberCount === 0 ? null : filter.memberCount,
    //     minBudget : filter.kind === 0 || filter.kind === 1 || filter.minBudget === 0 ? null : filter.minBudget,
    //     maxBudget : filter.kind === 0 || filter.kind === 1 || filter.maxBudget === 0 ? null : filter.maxBudget,
    //     minPeriod : filter.kind === 0 || filter.kind === 1 || filter.minDays === 0 ? null : filter.minDays,
    //     maxDays : filter.kind === 0 || filter.kind === 1 || filter.maxDays === 0 ? null : filter.maxDays,
    //     page : page,
    //     kind : filter.kind
    //   });

    useEffect(() => {
        dispatch(pageMove("feed"));
        dispatch(initFeedTravels());
        dispatch(initFilter());
        searchRefetch();
    }, [])


    const handleInputChange = (event:any) => {
        countryName.onChange(event);
        if (event.key === 'Enter') {
            dispatch(initFeedTravels());
            dispatch(setCountry(countryName.value));
            dispatch(addFilter(2));
            setSelectedSortOption('정확도순');
        }
    };

    useEffect(() => {
        
        console.log("filter", filter);
        dispatch(initFeedTravels());
        
        if(filter.countryName !== ''){
            console.log("refetch?");
            searchRefetch();
        }else {
            dispatch(addFilter(0));
        }

    },[filter.countryName]);

    useEffect(()=>{
        if(!searchLoading){
            console.log("kind 바뀜", filter.kind);
            dispatch(initFeedTravels());
            searchRefetch();
        }
    }, [filter.kind])

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };


    const handleSortOptionSelect = (option: string) => {
        setSelectedSortOption(option);
        
        let kind = option === '추천순' ? 0 : 1;

        dispatch(addFilter(kind));
        setIsDropdownOpen(false);

    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false); 
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]);

    useEffect(() => {
        if (hasMore && !searchLoading) {
            console.log("refetch?");
            console.log("refetch", filter);
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
                    <SearchInput type="text" value={countryName.value} onChange={countryName.onChange} 
                    onKeyDown={handleInputChange} placeholder='여행지를 입력하세요.'></SearchInput>
                </SearchDiv>
                <FilterDiv>
                    <FilterDownDiv ref={dropdownRef}>
                        <FilterP onClick={toggleDropdown}>{selectedSortOption}</FilterP>
                        <ArrowDown onClick={toggleDropdown}/>
                        
                        <DropdownMenu isOpen={isDropdownOpen}>
                            <DropdownItem onClick={() => handleSortOptionSelect('추천순')}>추천순</DropdownItem>
                            <DropdownItem onClick={() => handleSortOptionSelect('최신순')}>최신순</DropdownItem>
                            <DropdownItem onClick={() => handleSortOptionSelect('정확도순')}>정확도순</DropdownItem>
                        </DropdownMenu>
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
                            key={travel.id || index}  // id가 없거나 중복될 경우 index 사용
                            title={travel.title}
                            days={travel.days}
                            totalBudgetWon={travel.totalBudgetWon}
                            memberCount={travel.memberCount}
                        />
                    ))}
                    <TargetDiv ref={targetRef} />
                </TravelDiv>
                <DetailSearchBottomSheet isOpen={isBottomSheetOpen} 
            onClose={() => setIsBottomSheetOpen(false)}></DetailSearchBottomSheet>
            </FeedDiv>
        </>
    );
};

export default FeedPage;