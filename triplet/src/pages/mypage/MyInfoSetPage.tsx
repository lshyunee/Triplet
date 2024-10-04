import React, {useState, useEffect} from 'react';
import BackHeader from '../../components/header/BackHeader';
import styled from 'styled-components';

import { useNavigate } from 'react-router-dom';

import ErrorModal from '../../components/modal/ErrorModal';
import CompleteModal from '../../components/modal/CompleteModal';

import useAxios from '../../hooks/useAxios';
import useInput from '../../hooks/useInput';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setUserInfo } from '../../features/user/userInfoSlice';

const HowP = styled.p`
    font-size : 12px;
    margin : 0px 0px 4px;
    color : #888888;
`;

const EntireDiv = styled.div`
    min-height : 600px;
    margin : 0px 16px 0;
    height : calc(100vh - 112px);
    padding : 56px 0;
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


const MyInfoSetPage = () => {

    const navigate = useNavigate();

    const validNum = (value:string): boolean => {
        const regex = /^[0-9]*$/;
        return regex.test(value);
    }

    const validPhoneNumFront = (value:string): boolean => {
        const regex = /^[0-9]*$/;
        return value.length <=3 && regex.test(value);
    }

    const validPhoneNum = (value:string): boolean => {
        const regex = /^[0-9]*$/;
        return value.length <=4 && regex.test(value);
    }

    const validIdentificationFront = (value:string): boolean => {
        const regex = /^[0-9]*$/;
        return value.length <=6 && regex.test(value);
    }

    const validIdentificationBack = (value:string): boolean => {
        const regex = /^[0-9]*$/;
        return value.length <=1 && regex.test(value);
    }

    const name = useInput();
    const identificationNumFront = useInput(validIdentificationFront);
    const identificationNumBack = useInput(validIdentificationBack);

    const [ identificationNum, setIdentificationNum ] = useState('');


      // 주민등록번호
      useEffect(() => {
        setIdentificationNum(`${identificationNumFront.value}${identificationNumBack.value}`);
    }, [identificationNumFront, identificationNumBack])

    const dispatch = useDispatch();

    const userData = useSelector((state:any) => state.userInfo);

    const { data : userInfoData, error: userInfoError, status: userInfoStatus, refetch: userInfoRefetch } = useAxios("/user/my","GET");

    useEffect(()=>{
        if (!userData.memberId) {
            userInfoRefetch();
        }
    }, [userData])

    useEffect(() => {
        // userInfoData가 존재하고, userInfoStatus가 200일 때 Redux에 데이터를 저장
        if (userInfoData && userInfoStatus === 200 && userInfoData.data) {
            const { memberId, name, birth, gender, phoneNumber } = userInfoData.data;
            if (
                memberId !== null && memberId !== undefined &&
                name !== null && name !== undefined &&
                birth !== null && birth !== undefined &&
                gender !== null && gender !== undefined &&
                phoneNumber !== null && phoneNumber !== undefined
            ) {
                navigate('/');
            }
        }

    }, [userInfoData, userInfoError]);

    const { data: editData, error: editError, loading: editLoading,
        status: editStatus, refetch: editRefetch }
        = useAxios('/user/my', 'PUT', {
            name : name.value,
            identificationNumber : identificationNum
        });

    const myInfoEdit = () => {
        if(name.value.length===0){
            setErrorMsg("이름을 입력해주세요.");
            isErrorOpen();
            return;
        }
        
        editRefetch();
    }

    useEffect(() => {

        if(editData){
            setMsg("내 정보 등록이 완료 되었습니다.");
            isModalOpen();
            navigate("/simple-password/set");
        }

        if(editError){
            const message = editError.response.data.message || "정보 등록이 불가능합니다.";
            setErrorMsg(message);
            isErrorOpen();
        }

    },[editData, editError]);

    // 에러 모달
    const [ isError, setIsError ] = useState(false);
    const [ errorMsg, setErrorMsg ] = useState('');
    
    const isErrorOpen = () => {
        setIsError(true);
    }

    const closeError = () => {
        setIsError(false);
    }

    // 완료 모달
    const [ isModel, setIsModel ] = useState(false);
    const [ msg, setMsg ] = useState('');

    const isModalOpen = () => {
        setIsModel(true);
    }

    const isModelClose = () => {
        setIsModel(false);
    }

    return (
        <>
            <BackHeader title={"내 정보 등록"}/>
            <EntireDiv>
                <InputDiv>
                    <InputDistanceDiv>
                        <HowP>이름</HowP>
                        <StyledInput type="text" value={name.value} onChange={name.onChange}/>
                    </InputDistanceDiv>   
                    <InputDistanceDiv>
                        <HowP>주민등록번호</HowP>
                        <RegistDiv>
                            <StyledInputFront type="text" value={identificationNumFront.value} onChange={identificationNumFront.onChange}/>
                            <NumP>-</NumP>
                            <StyledInput type="text" value={identificationNumBack.value} onChange={identificationNumBack.onChange} disabled={false}/>
                            <NumP>* * * * * *</NumP>
                        </RegistDiv>
                    </InputDistanceDiv>
                    <ConfirmBtn onClick={myInfoEdit}>등록</ConfirmBtn>
                </InputDiv>
            </EntireDiv>
            <ErrorModal isOpen={isError} onClose={closeError} msg={errorMsg}></ErrorModal>
            <CompleteModal isOpen={isModel} onClose={isModelClose} msg={msg} ></CompleteModal>
        </>
    );
};

export default MyInfoSetPage;