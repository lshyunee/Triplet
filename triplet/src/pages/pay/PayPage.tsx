import React, {useEffect} from 'react';
import Header from '../../components/header/Header';
import { useDispatch } from 'react-redux';
import { pageMove } from '../../features/navigation/naviSlice';

const PayPage = () => {

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(pageMove("pay"));
    }, [])

    return (
        <>
            <Header />
            <div>페이</div>
        </>
    );
};

export default PayPage;