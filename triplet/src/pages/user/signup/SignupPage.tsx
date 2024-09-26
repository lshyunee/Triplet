import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import useAxios from '../../../hooks/useAxios';
import useInput from '../../../hooks/useInput';
import BackHeader from '../../../components/header/BackHeader';
import ErrorModal from '../../../components/modal/ErrorModal';

const HowP = styled.p`
    font-size : 12px;
    margin-bottom : 3px;
    color : #888888;
`;


const ExplainP = styled.p`
    font-size : 10px;
    padding-top : 2px;
    margin-bottom : 3px;
    margin-left : 4px;
    color : #AAAAAA;
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

const InputDiv = styled.div`
    display: flex;
    flex-direction: column;
    margin :40px 16px 0;
    padding-top : 56px;
`;

const ExplainDiv = styled.div`
    display : flex;
    flex-direction: row;
`;

const StyledInput = styled.input`
    background-color : #F9FAFC;
    width: 100%;
    height:44px;
    margin-bottom : 10px;
    border-radius : 10px;
    border : 1px solid #F0F0F0;
    box-sizing: border-box;
    padding : 10px;
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



const CheckDiv = styled.div`
    display: flex;
    flex-direction: row;

    ${StyledInput} {
        margin-bottom: 4px;
    }
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

const RegistDiv = styled.div`
    display : flex;
    flex-direction: row;

    ${StyledInputFront}{
        width : 80px;
    }

    ${StyledInput}{
        width : 36px;
    }

`;

const PhoneDiv = styled.div`
    display : flex;  
    flex-direction: row;

    ${StyledBtn} {
        width : 100px;
    }

`;

const ConfirmDiv = styled.div`
    width : 100%;
`;

const ConfirmBox = styled.button`
    width : 100%;
    height : 44px;
    background-color : #008DE7;
    color : #FFFFFF;
    border-radius : 10px;
    font-weight: 600;
    font-size : 14px;
    border : none;
    margin-top : 60px;
`;

const SignupPage = () => {

    const navigate = useNavigate();
    const title = "회원가입";

    const validId = (value:string) : boolean => {
        const regex = /^[a-zA-z0-9]*$/;
        return value.length <= 16 && regex.test(value);
    }

    const validPw = (value:string): boolean => {
        const regex = /^[a-zA-Z0-9!@#$%^&*()]*$/;
        return value.length <= 15 && regex.test(value);
    }

    const validNum = (value:string): boolean => {
        const regex = /^[0-9]*$/;
        return regex.test(value);
    }

    const id = useInput(validId);
    const pw = useInput(validPw);
    const pwCheck = useInput(validPw);
    const name = useInput();
    const identificationNumFront = useInput(validNum);
    const identificationNumBack = useInput(validNum);
    const phoneNumFront = useInput(validNum);
    const phoneNumMiddle = useInput(validNum);
    const phoneNumBack = useInput(validNum);
    const certificationNum = useInput(validNum);

    const [ phoneNum, setPhoneNum ] = useState('');
    const [ identificationNum, setIdentificationNum ] = useState('');

    // 아이디 중복 체크
    const { data: duplicatedData, error: duplicatedError, loading: duplicatedLoading,
        status: duplicatedStatus, refetch: duplicatedRefetch }
        = useAxios('/signup/is-duplicated', 'POST', {memberId : id.value});

    const [ isDuplicated, setIsDuplicated ] = useState(true);

    const idDuplicationCheck = () => {
        // 중복 체크 요청을 실행하기 위해 refetch 호출
        duplicatedRefetch();
        setIsDuplicated(duplicatedData.data.isDuplicated);
    };

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
        if(phoneStatus===200){
            console.log(phoneData);
        }
        if(phoneStatus===400){
            console.log(phoneData);
            console.log(phoneStatus);
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
        if(smsStatus===400){
            if(smsData.code==="M0007"){
                setErrorMsg(smsData.message);
                isErrorOpen();
            }else if(smsData.code==="M0014"){
                setErrorMsg(smsData.message);
                isErrorOpen();
            }
        }
    }

    const [ isCheck, setIsCheck ] = useState(false);

    useEffect (() => {
        if(smsStatus===200){
            setIsCheck(true);
        }
    }, [smsStatus]);

    const [ isError, setIsError ] = useState(false);
    const [ errorMsg, setErrorMsg ] = useState('');
    
    const isErrorOpen = () => {
        setIsError(true);
    }

    const closeError = () => {
        setIsError(false);
    }

    return(
        <div>
            <BackHeader title={title}/>
            <InputDiv>
                <ExplainDiv>
                    <HowP>아이디</HowP>
                    <ExplainP>(영문, 숫자 포함 5~16자)</ExplainP>
                </ExplainDiv>
                <CheckDiv>
                    <StyledInput type="text" {...id} />
                    <StyledBtn onClick={idDuplicationCheck} disabled={false}>중복확인</StyledBtn>
                </CheckDiv>
                <CheckP>{isDuplicated ? " " : "사용 가능한 아이디입니다."}</CheckP>
                <ExplainDiv>
                    <HowP>비밀번호</HowP>
                    <ExplainP>(영문, 숫자, 특수문자 포함 8~15자)</ExplainP>
                </ExplainDiv>
                <StyledInput type="password" {...pw}/>
                <HowP>비밀번호 확인</HowP>
                <StyledInput type="password" {...pwCheck} />
                <HowP>이름</HowP>
                <StyledInput type="text" {...name}/>
                <HowP>주민등록번호</HowP>
                <RegistDiv>
                    <StyledInputFront type="text" {...identificationNumFront}/>
                    <NumP>-</NumP>
                    <StyledInput type="text" {...identificationNumBack}/>
                    <NumP>* * * * * *</NumP>
                </RegistDiv>
                <HowP>전화번호</HowP>
                <PhoneDiv>
                    <StyledInputFront type="text" {...phoneNumFront} disabled={isCheck} />
                    <NumP>-</NumP>
                    <StyledInput type="text" {...phoneNumMiddle} disabled={isCheck}/>
                    <NumP>-</NumP>
                    <StyledInput type="text" {...phoneNumBack} disabled={isCheck}/>
                    <StyledBtn onClick={certificateSend} disabled={isCheck}>인증번호 발송</StyledBtn>
                </PhoneDiv>
                <HowP>인증번호</HowP>
                <CheckDiv>
                    <StyledInput type="text" {...certificationNum} disabled={isCheck}/>
                    <StyledBtn onClick={certificateCheck} disabled={isCheck}>확인</StyledBtn>
                </CheckDiv>
                <CheckP>인증되었습니다.</CheckP>
                <ConfirmDiv>  
                        <ConfirmBox>회원 가입</ConfirmBox>
                    </ConfirmDiv>
            </InputDiv>
            <ErrorModal isOpen={isError} onClose={closeError} msg={errorMsg}></ErrorModal>
        </div>
    )
}

export default SignupPage;