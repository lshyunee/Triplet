import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { pageMove } from '../../features/navigation/naviSlice';
import BackHeader from '../../components/header/BackHeader';
import { useParams } from 'react-router-dom';
import axios from 'axios';


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
}


const CreateQRPage = () => {
	const dispatch = useDispatch();
  const { merchantId } = useParams();

  const [qrImageUrl, setQrImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchQrCode = async () => {
      try {
        const response = await axios.get(`https://j11b202.p.ssafy.io/api/v1/qrcode/${merchantId}`, {
          responseType: 'blob', 
          withCredentials: true,
        });
        const imageBlob = new Blob([response.data], { type: 'image/png' });
        const imageUrl = URL.createObjectURL(imageBlob);
        setQrImageUrl(imageUrl);
      } catch (error) {
        console.error('QR 코드를 불러오는데 실패했습니다:', error);
      }
    };
    dispatch(pageMove("pay"));
    fetchQrCode();
  }, []);
   
	return (
		<>
			<BackHeader title='결제'/>
			<s.Container>
        {qrImageUrl ? (
          <img src={qrImageUrl} alt="QR Code" />
        ) : (
          <p>Loading QR code...</p>
        )}
			</s.Container>
		</>
	);
};

export default CreateQRPage;