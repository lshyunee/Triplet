import React, {useEffect} from 'react';
import BackHeader from '../../components/header/BackHeader';
import { useDispatch } from 'react-redux';
import { pageMove } from '../../features/navigation/naviSlice';

const PayPage = () => {    
    const title = "알람";

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(pageMove("alarm"));
    }, [])

    return (
        <>
            <BackHeader title={title}/>
            <div>알람</div>
        </>
    );
};

export default PayPage;