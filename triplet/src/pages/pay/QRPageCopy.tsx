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
    const navigate = useNavigate();

    const [isScanning, setIsScanning] = useState(false); // 스캔 중인지 여부 상태 관리

    const { ref } = useZxing({
        onDecodeResult(result) {
            if (!isScanning) {
                const lastPart = result.getText().split('/').pop(); // 마지막 숫자 부분 추출
                if (lastPart) {
                    setIsScanning(true); // 스캔 중으로 설정하여 중복 방지
                    navigate(`/pay/qr/payment/${lastPart}`, { replace: true });
                }
            }
        },
        onDecodeError(err) {
            console.error('QR 인식 오류:', err);
        },
        timeBetweenDecodingAttempts: 500,  // 인식 시도 간격을 500ms로 조정
        constraints: {
            video: {
                facingMode: 'environment',  // 후면 카메라 사용
                width: { ideal: 1280 },
                height: { ideal: 720 }
            }
        }
    });

    // 카메라를 활성화하고, 페이지를 떠날 때 카메라를 끄는 처리
    useEffect(() => {
        const videoElement = ref.current;

        return () => {
            if (videoElement && videoElement.srcObject) {
                const stream = videoElement.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
                videoElement.srcObject = null;
            }
        };
    }, [ref]);

    // QR 코드를 인식한 후 2초 후에 다시 스캔 가능하도록 설정
    useEffect(() => {
        if (isScanning) {
            const timeout = setTimeout(() => {
                setIsScanning(false);
            }, 2000); // 2초 후 스캔 가능하게 변경

            return () => clearTimeout(timeout);
        }
    }, [isScanning]);

    return (
        <>
            <BackHeader title="결제" />
            <s.Container>
                <video ref={ref} style={{ width: '100%', height: '100%', objectFit: 'cover', zIndex: 5 }} />
                <s.QrScannerOverlayText>결제 QR코드를 스캔하세요</s.QrScannerOverlayText>
            </s.Container>
        </>
    );
};

export default QRPage;
