import React, {useEffect} from 'react';
import Header from '../../components/header/Header';
import { useDispatch } from 'react-redux';
import { pageMove } from '../../features/navigation/naviSlice';

const TravelsPage = () => {

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(pageMove("travels"));
    }, [])

    return (
        <>
            <Header/>
            <div>여행</div>
        </>
    );
};

export default TravelsPage;