import React, {useEffect} from 'react';
import Header from '../../components/header/Header';
import { useDispatch } from 'react-redux';
import { pageMove } from '../../features/navigation/naviSlice';
import styled from 'styled-components';

import useInput from '../../hooks/useInput';
import { ReactComponent as Search } from '../../assets/common/search.svg';

const FeedDiv = styled.div`
    background-color : #F3F4F6;
    min-height: calc(100vh - 112px);
    padding : 56px 16px 0;
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

`

const SearchInput = styled.input`
    width : 100%;
    height : 44px;
    background-color : white;
    color : black;
    border : 1px solid #F0F0F0;
    border-radius : 50px;
    text-indent : 10px;

    &::placeholder {
    color : #AEAEAE; 
    }
`

const FeedPAge = () => {

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(pageMove("feed"));
    }, [])

    const valid = (value:string) => {
        const regex = /^[가-힣]*$/;
        return regex.test(value);
    }

    const country = useInput(valid);

    return (
        <>
            <Header/>
            <FeedDiv>
                <TitleDiv>
                    <TitleP>여행 피드</TitleP>
                    <TitleExplainP>가고 싶은 여행지를 찾아보세요.</TitleExplainP>
                </TitleDiv>
                <SearchDiv>
                    <SearchInput placeholder='여행지를 입력하세요.'></SearchInput>
                </SearchDiv>
            </FeedDiv>
        </>
    );
};

export default FeedPAge;