import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import useAxios from '../../../hooks/useAxios';
import useInput from '../../../hooks/useInput';
import BackHeader from '../../../components/header/BackHeader';
import ErrorModal from '../../../components/modal/ErrorModal';
import CompleteModal from '../../../components/modal/CompleteModal';


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

const StyledInput = styled.input<{ isValid: number }>`
    background-color : ${ (props) => props.disabled ? '#A1A1A1' : 'white'};
    color : ${ (props) => props.disabled ? 'white' : 'black'};
    width:100%;
    height:44px;
    border-radius : 10px;
    border : 1px solid ${(props) =>
        props.isValid === 0
            ? '#f0f0f0'
            : props.isValid === 1
            ? '#008DE7'
            : 'red'};
    text-indent: 10px; 
`;

const ErrorMessage = styled.p`
    color: red;
    font-size : 10px;
    padding-top : 2px;
    margin-bottom : 3px;
    margin-left : 4px;
`;

const SuccessMessage = styled.p`
    color: #008DE7;
    font-size : 10px;
    padding-top : 2px;
    margin-bottom : 3px;
    margin-left : 4px;
`;

const StyledInputFront = styled.input<{ isValid: number }>`
    background-color : ${ (props) => props.disabled ? '#A1A1A1' : 'white'};
    color : ${ (props) => props.disabled ? 'white' : 'black' };
    border-radius : 10px;  
    border : 1px solid ${(props) =>
        props.isValid === 0
            ? '#f0f0f0'
            : props.isValid === 1
            ? '#008DE7'
            : 'red'};
    box-sizing: border-box;
    width : 50%;
    padding : 10px;
    height : 44px;
    text-align:center;
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
    margin-bottom : 28px;
`;

const ConfirmBox = styled.button`
 background-color : ${ (props) => props.disabled ? '#A1A1A1' : '#008DE7'};
    color : ${ (props) => props.disabled ? 'white' : '#FFFFFF' };
    width : 100%;
    height : 44px;
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
    const validPw = (value: string): boolean => {
        const regex = /^[a-zA-Z0-9!@#$%^&*()]*$/;
        return regex.test(value);
    }
    const validNum = (value:string): boolean => {
        const regex = /^[0-9]*$/;
        return value.length <=6 && regex.test(value);
    }

    const validPhoneNumFront = (value:string): boolean => {
        const regex = /^[0-9]*$/;
        return value.length <=3 && regex.test(value);
    }

    const validPhoneNum = (value:string): boolean => {
        const regex = /^[0-9]*$/;
        return value.length <=4 && regex.test(value);
    }

    const validName = (value:string) : boolean =>{
        const regex = /^[가-힣]{2,20}$/;
        return value.length<=20 && regex.test(value)
    }

    const validIdentificationFront = (value:string): boolean => {
        if (value.length < 6) {
            // 6자리가 될 때까지는 숫자인지만 확인
            return /^\d*$/.test(value);
        } else {
            // 6자리가 되었을 때 날짜 형식 유효성 검사
            const regex = /^(?:[0-9]{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[1,2][0-9]|3[0,1]))$/;
            return regex.test(value);
        }
    }

    const validIdentificationBack = (value:string): boolean => {
        const regex = /^[1-4]*$/;
        return value.length <=1 && regex.test(value);
    }

    const id = useInput(validId);
    const pw = useInput(validPw);
    const pwCheck = useInput(validPw);
    const name = useInput();
    const identificationNumFront = useInput(validIdentificationFront);
    const identificationNumBack = useInput(validIdentificationBack);
    const phoneNumFront = useInput(validPhoneNumFront);
    const phoneNumMiddle = useInput(validPhoneNum);
    const phoneNumBack = useInput(validPhoneNum);
    const certificationNum = useInput(validNum);

    const [isPwValid, setIsPwValid] = useState(0); // 비밀번호 유효성 상태
    const [isPwCheckValid, setIsPwCheckValid] = useState(0); // 비밀번호 확인 유효성 상태
    const [pwError, setPwError] = useState('');
    const [pwCheckError, setPwCheckError] = useState('');
    const [pwCheckSuccess, setPwCheckSuccess] = useState(false);
    const [isIdValid, setIsIdValid] = useState(0);
    const [idCheckButton, setIdCheckButton] = useState(false) // 아이디 유효성 상태
    const [idError, setIdError] = useState('');
    const [idSucess, setIdSucess] = useState("")
    const [nameValid, setNameValid] = useState(0)
    const [identificationFrontValid,setIdentificationFrontValid] = useState(0)
    const [identificationBackValid,setIdentificationBackValid] = useState(0)

    const [PhoneNumFrontValid,setPhoneNumFrontValid] = useState(0)
    const [PhoneNumMiddleValid,setPhoneNumMiddleValid] = useState(0)
    const [PhoneNumBackValid,setPhoneNumnBackValid] = useState(0)

    const [isPhoneValid, setIsPhoneValid] = useState(false);

    const [isConfirm,setIsConfirm] = useState(false);

    const handleConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value.length >= 6  && validNum(value)) {
            setIsConfirm(true);
        }else if (value.length > 0){
            setIsConfirm(false)
        }else{
            setIsConfirm(false)
        }
        certificationNum.onChange(e); // 기존 입력 처리
    };

    const handlePhoneNumBackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value.length === 4  && validPhoneNum(value)) {
            setPhoneNumnBackValid(1);
        }else if (value.length > 0){
            setPhoneNumnBackValid(-1)
        }else{
            setPhoneNumnBackValid(0)
        }
        phoneNumBack.onChange(e); // 기존 입력 처리
    };

    const handlePhoneNumMiddleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value.length === 4  && validPhoneNum(value)) {
            setPhoneNumMiddleValid(1);
        }else if (value.length > 0){
            setPhoneNumMiddleValid(-1)
        }else{
            setPhoneNumMiddleValid(0)
        }
        phoneNumMiddle.onChange(e); // 기존 입력 처리
    }; 

    const handlePhoneNumFrontChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value.length > 0  && validPhoneNumFront(value) && value === '010') {
            setPhoneNumFrontValid(1);
        }else if (value.length > 0){
            setPhoneNumFrontValid(-1)
        }else{
            setPhoneNumFrontValid(0)
        }
        phoneNumFront.onChange(e); // 기존 입력 처리
    };


    const handleIdentificationBackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // 전체 유효성 검사 (8~15자, 정규식 일치)
        if (value.length > 0  && validIdentificationBack(value)) {
            setIdentificationBackValid(1);
        }else if (value.length > 0){
            setIdentificationBackValid(-1)
        }else{
            setIdentificationBackValid(0)
        }
        identificationNumBack.onChange(e); // 기존 입력 처리
    };



    const handleIdentificationFrontChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // 전체 유효성 검사 (8~15자, 정규식 일치)
        if (value.length === 6 && validIdentificationFront(value)) {
            setIdentificationFrontValid(1);
        }else if (value.length > 0){
            setIdentificationFrontValid(-1)
        }else{
            setIdentificationFrontValid(0)
        }
        identificationNumFront.onChange(e); // 기존 입력 처리
    };


    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // 전체 유효성 검사 (8~15자, 정규식 일치)
        if (value.length >= 2  && validName(value)) {
            setNameValid(1);
        }else if (value.length > 0){
            setNameValid(-1)
        }else{
            setNameValid(0)
        }
        name.onChange(e); // 기존 입력 처리
    };



    const handlePwChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // 전체 유효성 검사 (8~15자, 정규식 일치)
        if (value.length >= 8 && value.length <= 15 && validPw(value)) {
            setIsPwValid(1);
            setPwError('');
        } else if (value.length > 0) {
            setIsPwValid(-1);
            setPwError('영문, 숫자, 특수문자를 포함해 8~15자를 입력하세요.');
        } else {
            // 비밀번호 입력 초기 상태
            setIsPwValid(0);
            setPwError('');
        }

        if (value === pwCheck.value && pwCheck.value.length > 0) {
            setIsPwCheckValid(1);
            setPwCheckError('');
            setPwCheckSuccess(true);
        } else if (pwCheck.value.length > 0) {
            setIsPwCheckValid(-1);
            setPwCheckError('비밀번호가 일치하지 않습니다.');
            setPwCheckSuccess(false);
        }
        pw.onChange(e); // 기존 입력 처리
    };
    // 비밀번호 확인 입력 시 검사
    const handlePwCheckChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === pw.value && pw.value.length > 0) {
            setIsPwCheckValid(1);
            setPwCheckError('');
            setPwCheckSuccess(true);
        } else if (value.length > 0) {
            setIsPwCheckValid(-1);
            setPwCheckError('비밀번호가 일치하지 않습니다.');
            setPwCheckSuccess(false);
        } else {
            setPwCheckSuccess(false);
        }
        pwCheck.onChange(e); // 기존 입력 처리
    };

    const [ phoneNum, setPhoneNum ] = useState('');
    const [ identificationNum, setIdentificationNum ] = useState('');

    // 아이디 중복 체크
    const { data: duplicatedData, error: duplicatedError, loading: duplicatedLoading,
        status: duplicatedStatus, refetch: duplicatedRefetch }
        = useAxios('/signup/is-duplicated', 'POST',undefined, {memberId : id.value});

    const [ isDuplicated, setIsDuplicated ] = useState(true);

    const idDuplicationCheck = () => {
        // 중복 체크 요청을 실행하기 위해 refetch 호출
        if(id.value.length>=5&&id.value.length<=16){
            duplicatedRefetch();
        }else{
            setIdError("아이디는 영문,숫자 포함 5~16자여야 합니다.");
            setIsIdValid(-1);
        }
    };

   
    useEffect(() => {

        if(duplicatedData!==null){
            console.log(duplicatedData);
            setIsDuplicated(duplicatedData.data.duplicated);
            if(duplicatedData.data.duplicated === true){
                setIdError("이미 존재하는 아이디입니다.");
                setIsIdValid(-1);
            } else {
                setIdSucess("사용 가능한 아이디입니다.");
                setIsIdValid(1);
            }
        }

    }, [duplicatedData, duplicatedError]);

    const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.value.length > 0) {
            setIdCheckButton(true)
        }else{
            setIdCheckButton(false)
        }
        id.onChange(e);
        setIsDuplicated(true); // 아이디 변경 시 중복 상태 초기화
        setIsIdValid(0); // 아이디 변경 시 유효성 초기화
        setIdError('');
        setIdSucess('');
    };

    // 주민등록번호
    useEffect(() => {
        setIdentificationNum(`${identificationNumFront.value}${identificationNumBack.value}`);
    }, [identificationNumFront, identificationNumBack])

    // 전화번호 인증
    useEffect(() => {
        setPhoneNum(`${phoneNumFront.value}${phoneNumMiddle.value}${phoneNumBack.value}`);
        if(PhoneNumFrontValid === 1 && PhoneNumMiddleValid === 1 && PhoneNumBackValid === 1){
            setIsPhoneValid(true);
        }else{
            setIsPhoneValid(false)
        }
    }, [phoneNumFront, phoneNumMiddle, phoneNumBack])

    const { data: phoneData, error: phoneError, loading: phoneLoading,
        status: phoneStatus, refetch: phoneRefetch }
        = useAxios('/sms/send','POST',undefined,{phoneNumber : phoneNum});
    
        const [ isSend, setIsSend ] = useState(false);
    const certificateSend = () => {
        if (phoneNumFront.value.length === 3 && phoneNumMiddle.value.length === 4 && phoneNumBack.value.length === 4) {
            phoneRefetch();
             setIsSend(true);
        } else {
            setErrorMsg('올바른 전화번호를 입력해주세요.');
            isErrorOpen();
        }
    };


    useEffect(() => {
        
        if(phoneError!==null && phoneStatus!==200){
            console.log(phoneError);
            const message = phoneError.response.data.message || '전화번호를 인증할 수 없습니다.';
            setErrorMsg(message);
            isErrorOpen();
        }
        
        if(phoneData !== null && phoneStatus===200){
            setSuccessCheck(false)
        }

    }, [phoneData, phoneError])


    const { data : smsData, error: smsError, loading: smsLoading,
        status: smsStatus, refetch: smsRefetch}
        = useAxios('/sms/confirm', 'POST', undefined,
            {phoneNumber : phoneNum, certificationNumber: certificationNum.value});

    const certificateCheck = () => {
        smsRefetch();
    }
    
    const [ isCheck, setIsCheck ] = useState(false);
    const [ successCheck,setSuccessCheck] = useState(false);
    useEffect (() => {
        if(smsStatus===200){
            setSuccessCheck(true);
            setIsSend(false);
        }else if (smsError!==null){
            const message = smsError.response.data.message || '전화번호를 인증할 수 없습니다.';
            setErrorMsg(message);
            isErrorOpen();
        }
    }, [smsData, smsError]);


    const { data:signupData, loading:signupLoading, 
        error:signupError, status:sigunupError, 
        refetch:signupRefetch } =
        useAxios("/signup",'POST',undefined,{
            memberId : id.value,
            password : pw.value,
            passwordConfirm : pwCheck.value,
            name : name.value,
            phoneNumber : phoneNum,
            identificationNumber : identificationNum
    }); 
    const [validSend, setValidSend] = useState(false)
    useEffect(() => {

        if(isPwValid === 1 
            && isPwCheckValid=== 1 
             && isPhoneValid
              && isIdValid === 1
               && identificationFrontValid === 1 
               && identificationBackValid === 1
               && nameValid === 1
               && isConfirm && successCheck
               )
        {
            setValidSend(true)

        }else{
            setValidSend(false)
        }
    }, [isPwValid,isPwCheckValid,isPhoneValid,isIdValid,identificationFrontValid,identificationBackValid,nameValid,isConfirm,successCheck]);


    const signup = () => {
        signupRefetch();
    }

    useEffect(()=>{
        
        if(signupData!==null){
            navigate("/simple-password/set");
        }

        if(signupError!==null){
            console.log(signupError)
            const message =     signupError?.response?.data?.data?.message
            || signupError?.response?.data?.message
            || '회원 정보 입력이 올바르지 않습니다.';
            setErrorMsg(message);
            isErrorOpen();
        }

    },[signupData, signupError]);

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

    return(
    <div>
        <BackHeader title={title}/>
        <InputDiv>
            <ExplainDiv>
                <HowP>아이디</HowP>
                {(!idError && !idSucess) && <ExplainP>(영문, 숫자 포함 5~16자)</ExplainP>}
                {idError && <ErrorMessage>{idError}</ErrorMessage>}
                {idSucess && <SuccessMessage>{idSucess}</SuccessMessage>}
            </ExplainDiv>
            <CheckDiv>
                <StyledInput type="text" value={id.value} onChange={handleIdChange} isValid={isIdValid} />
                <StyledBtn onClick={idDuplicationCheck} disabled={!idCheckButton}>중복확인</StyledBtn>
            </CheckDiv>
            <ExplainDiv>
                <HowP>비밀번호</HowP> 
                {isPwValid === 0 && <ExplainP>(영문, 숫자, 특수문자 포함 8~15자) </ExplainP>}
                {(isPwValid === 1  || isPwValid === -1) && <ErrorMessage>{pwError}</ErrorMessage>}
            </ExplainDiv>
            <StyledInput type="password" value={pw.value} onChange={handlePwChange}
                isValid={isPwValid} />
            <ExplainDiv>
            <HowP>비밀번호 확인</HowP>
            {isPwCheckValid === -1  && <ErrorMessage>{pwCheckError}</ErrorMessage>}
            {pwCheckSuccess&& <SuccessMessage>비밀번호가 일치합니다.</SuccessMessage>}
            </ExplainDiv>
            <StyledInput type="password" value={pwCheck.value} onChange={handlePwCheckChange}
                isValid={isPwCheckValid} />
            <ExplainDiv>    
            <HowP>이름</HowP>
            {nameValid === -1 && <ErrorMessage>올바른 형식이 아닙니다.</ErrorMessage>}
            </ExplainDiv>
            <StyledInput type="text" value={name.value} onChange={handleNameChange} isValid={nameValid} />
            <ExplainDiv>
            <HowP>주민등록번호</HowP>
            {identificationFrontValid === -1 && <ErrorMessage>올바른 형식이 아닙니다.</ErrorMessage>}
            </ExplainDiv>
            <RegistDiv>
                <StyledInputFront type="text" value={identificationNumFront.value} onChange={handleIdentificationFrontChange} isValid={identificationFrontValid}  />
                <NumP>-</NumP>
                <StyledInput type="text" value={identificationNumBack.value} onChange={handleIdentificationBackChange} isValid={identificationBackValid} />
                <NumP>* * * * * *</NumP>
            </RegistDiv>
            <HowP>전화번호</HowP>
            <PhoneDiv>
                <StyledInputFront type="text" value={phoneNumFront.value} onChange={handlePhoneNumFrontChange} disabled={isCheck} isValid={PhoneNumFrontValid} />
                <NumP>-</NumP>
                <StyledInput type="text" value={phoneNumMiddle.value} onChange={handlePhoneNumMiddleChange} disabled={isCheck}  isValid={PhoneNumMiddleValid}/>
                <NumP>-</NumP>
                <StyledInput type="text" value={phoneNumBack.value} onChange={handlePhoneNumBackChange} disabled={isCheck} isValid={PhoneNumBackValid} />
                <StyledBtn onClick={certificateSend} disabled={!isPhoneValid}>인증번호 발송</StyledBtn>
            </PhoneDiv>
            <HowP>인증번호</HowP>
            <CheckDiv>
                <StyledInput type="text" value={certificationNum.value} onChange={handleConfirmChange} disabled={!isSend} isValid={successCheck?1:-1} />
                <StyledBtn onClick={certificateCheck} disabled={!isConfirm}>확인</StyledBtn>
            </CheckDiv>
            <CheckP>{successCheck ? "인증되었습니다." : ""}</CheckP>
            <ConfirmDiv>  
                <ConfirmBox onClick={signup} disabled={!validSend}>회원 가입</ConfirmBox>
            </ConfirmDiv>
        </InputDiv>
        <ErrorModal isOpen={isError} onClose={closeError} msg={errorMsg}></ErrorModal>
        <CompleteModal isOpen={isModel} onClose={isModelClose} msg={msg}></CompleteModal>
    </div>
    )
}

export default SignupPage;