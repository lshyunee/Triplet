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
		background-color: #F3F4F6;
		/* height: 100%; */
		padding-top: 68px;
		padding-bottom: 16px;
	`,
	Card: styled.div`
		background-color: #ffffff;
		border-radius: 20px;
		margin: 0 16px;
		margin-bottom: 12px;
		display: flex;
		flex-direction: column;
	`,
}


const QRPage = () => {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(pageMove("pay"));
	}, []);

    const [qrData, setQrData] = useState<string | null>(null);

    const handleScan = (data: string | null) => {
        if (data) {
        setQrData(data);
        }
    };

    const handleError = (err: any) => {
        console.error(err);
    };

    const previewStyle = {
        height: 240,
        width: 320,
    };

	return (
		<>
			<BackHeader title='결제'/>
			<s.Container>
			<h1>QR 코드 스캔</h1>
                <QrScanner
                    delay={300}
                    style={previewStyle}
                    onError={handleError}
                    onScan={handleScan}
                />
                {qrData ? (
                    <div>
                    <h3>스캔한 데이터:</h3>
                    <p>{qrData}</p>
                    </div>
                ) : (
                    <p>QR 코드를 스캔하세요</p>
                )}
			</s.Container>
		</>
	);
};

export default QRPage;