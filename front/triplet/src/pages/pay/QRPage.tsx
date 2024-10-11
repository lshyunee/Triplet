import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import { ReactComponent as RightArrow } from '../../assets/pay/rightArrow.svg';
import GlobalAccount from '../../components/pay/GlobalAccount';
import ExchangeRate from '../../components/pay/ExchangeRate';
import Header from '../../components/header/Header';
import { useDispatch } from 'react-redux';
import { pageMove } from '../../features/navigation/naviSlice';
import { Navigate, useNavigate } from 'react-router-dom';
import BackHeader from '../../components/header/BackHeader';
import QrScanner from 'react-qr-scanner';


const s = {
	Container: styled.div`
        z-index: -1;
        position: relative;
        background-color: white;
        margin-top: 56px;
        height: calc(100vh);
        display: flex;
        align-items: center; 
        justify-content: center;
        width: 100%;
	`,
    QrScannerOverlayText: styled.div`
        position: absolute;
        color: white;
        font-size: 14px;
        top: 10%; 
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 10; 
    `,
    Caption: styled.span`
    font-size: 12px;
    font-weight: 400;
    color: #666666;
  `,
}


const QRPage = () => {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(pageMove("pay"));
	}, []);

    const [qrData, setQrData] = useState<string | null>(null); // qr 데이터

    const handleScan = (data: string | null) => {
        if (data) {
        setQrData(data);
        }
    };

    const handleError = (err: any) => {
        console.error(err);
    };

	return (
		<>
			<BackHeader title='결제'/>
			<s.Container>
                <QrScanner
                    delay={300}
                    style={{
                        width: '100%',
                        height: '100%',
                        position: 'relative',
                        zIndex: 5,
                        objectFit: 'cover'
                      }}
                    onError={handleError}
                    onScan={handleScan}
                />
                <s.QrScannerOverlayText>결제 QR코드를 스캔하세요</s.QrScannerOverlayText>
			</s.Container>
		</>
	);
};

export default QRPage;