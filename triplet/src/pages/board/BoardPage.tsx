import React, {useEffect} from 'react';
import Header from '../../components/header/Header';
import { useDispatch } from 'react-redux';
import { pageMove } from '../../features/navigation/naviSlice';


const BoardPage = () => {

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(pageMove("feed"));
    }, [])

    return (
        <>
            <Header/>
            <div>피드</div>
        </>
    );
};

export default BoardPage;