import React, {useState, useEffect} from 'react';
import BackHeader from '../../components/header/BackHeader';
import styled from 'styled-components';

import { useNavigate } from 'react-router-dom';

import ErrorModal from '../../components/modal/ErrorModal';
import CompleteModal from '../../components/modal/CompleteModal';

import useAxios from '../../hooks/useAxios';
import useInput from '../../hooks/useInput';

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
    background-color : #F9FAFC;
    width:100%;
    height:44px;
    border-radius : 10px;
    border : 1px solid #F0F0F0;
    text-align:center;
    text-indent: 10px; 
`;

const StyledInputFront = styled.input`
    background-color : #F9FAFC;
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
    border : 1px solid #008DE7;
    border-radius : 10px;
    font-weight: 600;
    background-color : white;
    color : #008DE7;
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


const MyInfoEditPage = () => {

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
    const phoneNumFront = useInput(validPhoneNumFront);
    const phoneNumMiddle = useInput(validPhoneNum);
    const phoneNumBack = useInput(validPhoneNum);
    const certificationNum = useInput(validNum);

    const [ phoneNum, setPhoneNum ] = useState('');
    const [ identificationNum, setIdentificationNum ] = useState('');

    const { data: infoData, error: infoError, loading: infoLoading,
            status: infoStatus, refetch: infoRefetch}
            = useAxios("/user/my",'GET');

    useEffect(() => {
        infoRefetch();
    },[])

    useEffect(() => {
        
        if(infoData !== null){
            name.setValue(infoData.data.name);
            identificationNumFront.setValue(infoData.data.birth);
            phoneNumFront.setValue(infoData.data.phoneNumber.slice(0,3));
            phoneNumMiddle.setValue(infoData.data.phoneNumber.slice(3,7));
            phoneNumBack.setValue(infoData.data.phoneNumber.slice(7,11));
        }

    },[infoData])

      // 주민등록번호
      useEffect(() => {
        setIdentificationNum(`${identificationNumFront.value}${identificationNumBack.value}`);
    }, [identificationNumFront, identificationNumBack])

      // 전화번호 인증
    useEffect(() => {
        setPhoneNum(`${phoneNumFront.value}${phoneNumMiddle.value}${phoneNumBack.value}`);
    }, [phoneNumFront, phoneNumMiddle, phoneNumBack])

    const { data: phoneData, error: phoneError, loading: phoneLoading,
        status: phoneStatus, refetch: phoneRefetch }
        = useAxios('/sms/send','POST',{phoneNumber : phoneNum});

        const certificateSend = () => {
            phoneRefetch();
        };

    const [ isSend, setIsSend ] = useState(false);

    useEffect(() => {
        
        if(phoneError!==null && phoneStatus!==200){
            console.log(phoneError);
            const message = phoneError.response.data.message || '전화번호를 인증할 수 없습니다.';
            setErrorMsg(message);
            isErrorOpen();
        }
        
        if(phoneData !== null && phoneStatus===200){
            setIsSend(true);
        }

    }, [phoneData, phoneError])

    const { data : smsData, error: smsError, loading: smsLoading,
        status: smsStatus, refetch: smsRefetch}
        = useAxios('/sms/confirm', 'POST', 
            {phoneNumber : phoneNum, certificationNumber: certificationNum.value});

    const certificateCheck = () => {
        smsRefetch();
    }

    const [ isCheck, setIsCheck ] = useState(false);

    useEffect (() => {
        if(smsData!==null){
            setIsCheck(true);
        }else if (smsError!==null){
            console.log(smsError);
            const message = smsError.response.data.message || '전화번호를 인증할 수 없습니다.';
            setErrorMsg(message);
            isErrorOpen();
        }
    }, [smsData, smsError]);

    const { data: editData, error: editError, loading: editLoading,
        status: editStatus, refetch: editRefetch }
        = useAxios('/user/my', 'PUT', {
            name : name,
            phoneNumber : phoneNum,
            identificationNumber : identificationNum
        });

    const myInfoEdit = () => {
        if(name.value.length===0){
            setErrorMsg("이름을 입력해주세요.");
            isErrorOpen();
            return;
        }
        if(isCheck === true){
            editRefetch();
        }   
    }

    useEffect(() => {

        if(editData !== null){
            setMsg("정보 수정이 완료 되었습니다.");
            isModalOpen();
            navigate(-1);
        }

        if(editError !== null){
            const message = editError.response.data.message || "정보 수정이 불가능합니다.";
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
            <BackHeader title={"내 정보 수정"}/>
            <EntireDiv>
                <InputDiv>
                    <InputDistanceDiv>
                        <HowP>이름</HowP>
                        <StyledInput type="text" {...name}/>
                    </InputDistanceDiv>   
                    <InputDistanceDiv>
                        <HowP>주민등록번호</HowP>
                        <RegistDiv>
                            <StyledInputFront type="text" {...identificationNumFront}/>
                            <NumP>-</NumP>
                            <StyledInput type="text" {...identificationNumBack} disabled={false}/>
                            <NumP>* * * * * *</NumP>
                        </RegistDiv>
                    </InputDistanceDiv>
                    <InputDistanceDiv>
                        <HowP>전화번호</HowP>
                        <PhoneDiv>
                            <StyledInputFront type="text" {...phoneNumFront} disabled={isCheck} />
                            <NumP>-</NumP>
                            <StyledInput type="text" {...phoneNumMiddle} disabled={isCheck}/>
                            <NumP>-</NumP>
                            <StyledInput type="text" {...phoneNumBack} disabled={isCheck}/>
                            <StyledBtn onClick={certificateSend} disabled={isSend}>인증번호 발송</StyledBtn>
                        </PhoneDiv>
                    </InputDistanceDiv>
                    <InputDistanceDiv>
                        <HowP>인증번호</HowP>
                        <CheckDiv>
                            <StyledInput type="text" {...certificationNum} disabled={isCheck}/>
                            <StyledBtn onClick={certificateCheck} disabled={isCheck}>확인</StyledBtn>
                        </CheckDiv>
                        <CheckP>{isCheck ? "인증되었습니다." : ""}</CheckP>
                    </InputDistanceDiv>
                    <ConfirmBtn onClick={myInfoEdit}>수정 완료</ConfirmBtn>
                </InputDiv>
            </EntireDiv>
            <ErrorModal isOpen={isError} onClose={closeError} msg={errorMsg}></ErrorModal>
            <CompleteModal isOpen={isModel} onClose={isModelClose} msg={msg} ></CompleteModal>
        </>
    );
};

export default MyInfoEditPage;