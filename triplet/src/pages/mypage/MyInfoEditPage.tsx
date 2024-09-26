import React, {useState, useEffect} from 'react';
import BackHeader from '../../components/header/BackHeader';
import styled from 'styled-components';

import ErrorModal from '../../components/modal/ErrorModal';

import useAxios from '../../hooks/useAxios';
import useInput from '../../hooks/useInput';

const HowP = styled.p`
    font-size : 12px;
    margin : 0px 0px 4px;
    color : #888888;
`;

const EntireDiv = styled.div`
    margin : 0px 16px 0;
    height : calc(100vh - 112px);
    padding-top : 56px;
`;

const InputDiv = styled.div`
    margin-top : 40px;
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
    box-sizing: border-box;
`;

const StyledInputFront = styled.input`
    background-color : #F9FAFC;
    border-radius : 10px;
    border : 1px solid #F0F0F0;
    box-sizing: border-box;
    width : 50%;
    padding : 10px;
    height : 44px;
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
`

const RegistDiv = styled.div`
    display : flex;
    flex-direction: row;

    ${StyledInputFront} {
        width : 52px;
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
    height : 44px;
    background-color : #008DE7;
    color : #FFFFFF;
    border-radius : 10px;
    font-weight: 600;
    font-size : 14px;
    border : none;
    margin-bottom : 28px;
    position: fixed;
    bottom: 56px;
    left: 0;
    right: 0;
    margin-right: 16px;
    margin-left: 16px;
`;


const MyInfoEditPage = () => {

    const validNum = (value:string): boolean => {
        const regex = /^[0-9]*$/;
        return regex.test(value);
    }

    const name = useInput();
    const identificationNumFront = useInput(validNum);
    const identificationNumBack = useInput(validNum);
    const phoneNumFront = useInput(validNum);
    const phoneNumMiddle = useInput(validNum);
    const phoneNumBack = useInput(validNum);
    const certificationNum = useInput(validNum);

    const [ phoneNum, setPhoneNum ] = useState('');
    const [ identificationNum, setIdentificationNum ] = useState('');

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
            console.log("전화번호"+phoneNum);
            phoneRefetch();
            if(phoneStatus===400){
                console.log(phoneData);
                setErrorMsg(phoneData.message);
                isErrorOpen();
            }
        };

    const { data : smsData, error: smsError, loading: smsLoading,
        status: smsStatus, refetch: smsRefetch}
        = useAxios('/sms/confirm', 'POST', 
            {phoneNumber : phoneNum, certificationNumber: certificationNum});

    const certificateCheck = () => {
        smsRefetch();
    }

    const [ isCheck, setIsCheck ] = useState(false);

    useEffect (() => {
        if(smsStatus===200){
            setIsCheck(true);
        }
    }, [smsStatus]);

    const { data: editData, error: editError, loading: editLoading,
        status: editStatus, refetch: editRefetch }
        = useAxios('/user/my', 'PUT', {
            name : name,
            phoneNumber : phoneNum,
            identificationNumber : identificationNum
        });

    const myInfoEdit = () => {
        if(isCheck === true){
            editRefetch();
        }   
    }

    const [ isError, setIsError ] = useState(false);
    const [ errorMsg, setErrorMsg ] = useState('');
    
    const isErrorOpen = () => {
        setIsError(true);
    }

    const closeError = () => {
        setIsError(false);
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
                            <StyledInput type="text" {...identificationNumBack}/>
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
                            <StyledBtn onClick={certificateSend}>인증번호 발송</StyledBtn>
                        </PhoneDiv>
                    </InputDistanceDiv>
                    <InputDistanceDiv>
                        <HowP>인증번호</HowP>
                        <CheckDiv>
                            <StyledInput type="text" {...certificationNum} />
                            <StyledBtn onClick={certificateCheck}>확인</StyledBtn>
                        </CheckDiv>
                        <CheckP>인증되었습니다.</CheckP>
                    </InputDistanceDiv>
                    <ConfirmBtn onClick={myInfoEdit}>수정 완료</ConfirmBtn>
                </InputDiv>
            </EntireDiv>
            <ErrorModal isOpen={isError} onClose={closeError} msg={errorMsg}></ErrorModal>
        </>
    );
};

export default MyInfoEditPage;