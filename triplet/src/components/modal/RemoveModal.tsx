import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useAxios from '../../hooks/useAxios';
import CompleteModal from '../../components/modal/CompleteModal';
import ErrorModal from './ErrorModal';
import { deleteTravel } from '../../features/travel/deleteTravelSlice';

const ModalLayout = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContentDiv = styled.div`
  background-color: white;
  max-width: 360px;
  width: 80%;
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  border-radius: 8px;
  overflow: hidden;
Z-index : 900;
`;

const Title = styled.div`
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 10px;
`;

const Description = styled.div`
  font-size: 14px;
  color: #555;
  margin-bottom: 20px;
`;

const ConfirmDiv = styled.div`
  display: flex;
  width: 100%;
  align-items: stretch;
`;

const Button = styled.button<{ isCancel?: boolean }>`
  width: 50%;
  height: 50px;
  background-color: ${(props) => (props.isCancel ? '#E0E0E0' : '#008DE7')};
  color: ${(props) => (props.isCancel ? '#000000' : '#FFFFFF')};
  font-weight: 400;
  font-size: 16px;
  border: none;
  cursor: pointer;
  padding: 0;
  margin: 0;
  vertical-align: top;
`;

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  travelId : number;
  creatorId : number;
}

const RemoveModal: React.FC<ModalProps> = ({ isOpen, onClose, travelId, creatorId }) => {
  
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { data : removeData, error : removeError, status : removeStatus,
        refetch : removeRefetch
    } = useAxios(`/travels/delete/${travelId}`, "DELETE");


    const handleRemove = () => {
        removeRefetch();
    };

    const [ completeOpen, setCompletOpen ] = useState(false);
    const [ msg, setMsg ] = useState('');

    const [ errorOpen, setErrorOpen ] = useState(false);
    const [ errorMsg, setErrorMsg ] = useState('');

    useEffect(() => {

        if(removeData && removeStatus === 200){
            dispatch(deleteTravel(travelId));
            setMsg("여행 삭제가 완료되었습니다.");
            setCompletOpen(true);
            onClose();
        }

        if(removeError) {
            console.log(removeError);
            setMsg(removeError.msessage);
            setErrorOpen(true);
            onClose();
        }

    }, [removeData, removeError]);


    const hanldleRemoveComplete = () => {
        setCompletOpen(false);
        navigate('/travels');
    }

    if (!isOpen) {
        return null;
    }

    return (
        <>
        <ModalLayout onClick={onClose}>
            <ModalContentDiv onClick={(e) => e.stopPropagation()}>
            <Title>삭제</Title>
            <Description>여행을 삭제하시겠습니까?</Description>
            <ConfirmDiv>
                <Button isCancel={true} onClick={onClose}>취소</Button>
                <Button onClick={handleRemove}>확인</Button>
            </ConfirmDiv>
            </ModalContentDiv>
        </ModalLayout>
        <CompleteModal isOpen={completeOpen} onClose={hanldleRemoveComplete} msg={msg}/>
        <ErrorModal isOpen={errorOpen} onClose={()=>{setErrorOpen(false)}} msg={errorMsg} />
        </>
    );
};

export default RemoveModal;