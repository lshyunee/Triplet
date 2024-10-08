import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { pageMove } from '../../features/navigation/naviSlice';
import BackHeader from '../../components/header/BackHeader';
import { useZxing } from 'react-zxing';
import { useNavigate } from 'react-router-dom';
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
};

const QRPage: React.FC = () => {
    const dispatch = useDispatch();
    const [qrData, setQrData] = useState<string | null>(null); // QR 데이터

    const navigate = useNavigate();
    const { ref } = useZxing({
        onDecodeResult(result) {

            if(result.getText()){
                const lastPart = result.getText().split('/').pop(); // 마지막 숫자 부분 추출
                if (lastPart) {
                    navigate(`/pay/qr/payment/${lastPart}`)
                }
            }
        },
        onDecodeError(err) {
            console.error(err);
        },
        timeBetweenDecodingAttempts: 5000,  // 인식 시도 간격을 500ms로 조정
        constraints: {
            video: {
              facingMode: 'environment',  // 후면 카메라 사용
              width: { ideal: 1280 },
              height: { ideal: 720 }
            }
          }
    });

    useEffect(() => {
        dispatch(pageMove("pay"));
    }, [dispatch]);

    return (
        <>
            <BackHeader title='결제' />
            <s.Container>
                <video ref={ref} style={{ width: '100%', height: '100%', objectFit: 'cover', zIndex: 5 }} />
                <s.QrScannerOverlayText>결제 QR코드를 스캔하세요</s.QrScannerOverlayText>
            </s.Container>
            {qrData && <div>스캔 결과: {qrData}</div>}
        </>
    );
};

export default QRPage;
