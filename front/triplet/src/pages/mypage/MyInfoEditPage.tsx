import React, {useState, useEffect} from 'react';
import BackHeader from '../../components/header/BackHeader';
import styled from 'styled-components';

import { useNavigate } from 'react-router-dom';

import useAxios from '../../hooks/useAxios';
import useInput from '../../hooks/useInput';
import { useDispatch } from 'react-redux';
import { setUserInfo } from '../../features/user/userInfoSlice';

const HowP = styled.p`
    font-size : 12px;
    margin : 0px 0px 4px;
    color : #888888;
`;

const EntireDiv = styled.div`
    height: 100vh; /* 화면 높이를 100%로 설정 */
    margin: 0;
    padding: 56px 16px; /* padding 조정 */
    box-sizing: border-box; /* padding과 border를 포함하여 계산 */
    overflow: hidden; /* 스크롤을 없애기 위해 overflow 속성 사용 */
`;

const InputDiv = styled.div`
    margin-top : 40px;
    margin-bottom : 27px;
`;

const NumP = styled.p`
    margin : auto 4px;
    font-size : 14px;
    color : #424242;
`;

const CheckP = styled.p`
    font-size : 12px;
    margin : 4px 0 0 0;
    color : #008DE7;
`
const StyledInput = styled.input`
    background-color : ${ (props) => props.disabled ? '#A1A1A1' : 'white'};
    color : ${ (props) => props.disabled ? 'white' : 'black'};
    width:100%;
    height:44px;
    border-radius : 10px;
    border : 1px solid #F0F0F0;
    text-align:center;
    text-indent: 10px; 
`;

const StyledInputFront = styled.input`
    background-color : ${ (props) => props.disabled ? '#A1A1A1' : 'white'};
    color : ${ (props) => props.disabled ? 'white' : 'black' };
    border-radius : 10px;
    border : 1px solid #F0F0F0;
    box-sizing: border-box;
    width : 50%;
    padding : 10px;
    height : 44px;
    text-align:center;
`;


const StyledBtn = styled.button`
    width:74px;
    height:44px;
    border : 1px solid ${ (props) => props.disabled ? '#A1A1A1': '#008DE7'};
    border-radius : 10px;
    font-weight: 600;
    background-color : ${ (props) => props.disabled ? '#A1A1A1' : 'white'};
    color : ${ (props) => props.disabled ? 'white' : '#008DE7'};
    flex-shrink: 0;
    margin-left : 8px;
`;

const InputDistanceDiv = styled.div`
    margin-bottom : 32px;

    ${StyledInput}{
        text-align: left;
        text-indent: 10px; 
    }
`

const RegistDiv = styled.div`
    display : flex;
    flex-direction: row;

    ${StyledInputFront} {
        width : 80px;
        margin-right : 12px;
    }

    ${StyledInput} {
        width : 36px;
        margin-left : 12px;
        margin-right : 8px;
    }

`;

const RequiredP = styled.p`
    font-size: 12px;
    margin: 4px 0 0 0;
    color: red;
`;

const PhoneDiv = styled.div`
    display : flex;  
    flex-direction: row;

    ${StyledBtn} {
        width : 100px;
    }

`;

const CheckDiv = styled.div`
    display: flex;
    flex-direction: row;
`;

const ConfirmBtn = styled.button`
    width: 100%;
    height : 44px;
    background-color : #008DE7;
    color : #FFFFFF;
    border-radius : 10px;
    font-weight: 600;
    font-size : 14px;
    border : none;
    margin-top : 66px;
`;

const s = {
    // 모달 스타일링
    ModalOverlay: styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  `,
    ModalContainer: styled.div`
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    text-align: center;
    width: 300px;
    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
  `,
    ModalText: styled.p`
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 20px;
  `,
    ModalButton: styled.button`
    background-color: #008DE7;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    font-size: 14px;
    cursor: pointer;
    &:hover {
      background-color: #006bbf;
    }
  `
}


const MyInfoEditPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const validIdentificationFront = (value: string): boolean => {
        const regex = /^[0-9]*$/;
        return value.length <= 6 && regex.test(value);
    }

    const validIdentificationBack = (value: string): boolean => {
        const regex = /^[0-9]*$/;
        return value.length <= 1 && regex.test(value);
    }

    const name = useInput();
    const identificationNumFront = useInput(validIdentificationFront);
    const identificationNumBack = useInput(validIdentificationBack);

    const [identificationNum, setIdentificationNum] = useState('');

    const { data: infoData, refetch: infoRefetch } = useAxios("/user/my", 'GET');

    useEffect(() => {
        infoRefetch();
    }, []);

    useEffect(() => {
        if (infoData !== null) {
            name.changeData(infoData.data.name);
            identificationNumFront.changeData(infoData.data.birth);
        }
    }, [infoData]);

    useEffect(() => {
        setIdentificationNum(`${identificationNumFront.value}${identificationNumBack.value}`);
    }, [identificationNumFront, identificationNumBack]);

    const { data: editData, error: editError, refetch: editRefetch } = useAxios('/user/my', 'PUT', undefined, {
        name: name.value,
        identificationNumber: identificationNum
    });

    const myInfoEdit = () => {
        editRefetch();
        setIsModalOpen(true);
    }

    useEffect(() => {
        if (editData !== null) {
            dispatch(setUserInfo({ name: name.value }));
        }
    }, [editData]);

    // 버튼 비활성화 조건: 이름과 주민등록번호 필드가 비어있으면 버튼 비활성화
    const isFormValid = name.value && identificationNumFront.value && identificationNumBack.value;

    const [isModalOpen, setIsModalOpen] = useState(false);
    // 모달 닫기 및 페이지 이동 처리
    const closeModal = () => {
        setIsModalOpen(false);
        navigate(`/mypage`);
    };

    return (
        <>
            <BackHeader title="내 정보 수정" />
            <EntireDiv>
                <InputDiv>
                    <InputDistanceDiv>
                        <HowP>이름</HowP>
                        <StyledInput type="text" value={name.value} onChange={name.onChange} />
                        {!name.value && <RequiredP>필수 입력값입니다.</RequiredP>}
                    </InputDistanceDiv>
                    <InputDistanceDiv>
                        <HowP>주민등록번호</HowP>
                        <RegistDiv>
                            <StyledInputFront type="text" value={identificationNumFront.value} onChange={identificationNumFront.onChange} />
                            <NumP>-</NumP>
                            <StyledInput type="text" value={identificationNumBack.value} onChange={identificationNumBack.onChange} />
                            <NumP>* * * * * *</NumP>
                        </RegistDiv>
                        {(!identificationNumFront.value || !identificationNumBack.value) && (
                            <RequiredP>필수 입력값입니다.</RequiredP>
                        )}
                    </InputDistanceDiv>
                    <ConfirmBtn onClick={myInfoEdit} disabled={!isFormValid}>
                        수정 완료
                    </ConfirmBtn>
                </InputDiv>
            </EntireDiv>
            {isModalOpen && (
                <s.ModalOverlay>
                    <s.ModalContainer>
                        <s.ModalText>회원 정보가 수정되었습니다.</s.ModalText>
                        <s.ModalButton onClick={closeModal}>확인</s.ModalButton>
                    </s.ModalContainer>
                </s.ModalOverlay>
            )}
        </>
    );
};

export default MyInfoEditPage;