import React, {useEffect} from 'react';
import { useDispatch } from 'react-redux'
import { Dispatch } from '@reduxjs/toolkit';
import { pageMove } from '../../features/header/titleSlice'

const PayPage = () => {

    const dispatch = useDispatch<Dispatch>();

    useEffect(() => {
        dispatch(pageMove("회원가입"))
    })

    return (
        <>
            <div>알람</div>
        </>
    );
};

export default PayPage;