import React, {useEffect} from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { pageMove } from '../../features/navigation/naviSlice';

const ExchangePage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(pageMove("pay"));
  }, []);


  return(
    <>
    </>
  );
};

export default ExchangePage;