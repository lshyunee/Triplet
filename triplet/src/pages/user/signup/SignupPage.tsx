import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BackHeader from '../../../components/header/BackHeader';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import useAxios from '../../../hooks/useAxios';

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
    font-size : 14px;
    color : #424242;
    margin-right : 12px;
`;

const CheckP = styled.p`
    font-size : 12px;
    color : #008DE7;
    margin-top: 0;
`

const InputDiv = styled.div`
    display: flex;
    flex-direction: column;
    padding: 20px;
    margin-top:20px;
`;

const ExplainDiv = styled.div`
    display : flex;
    flex-direction: row;
`;

const StyledInput = styled.input`
    background-color : #F9FAFC;
    width:328px;
    height:44px;
    margin-bottom : 10px;
    border-radius : 10px;
    border : 1px solid #F0F0F0;
    box-sizing: border-box;
    padding : 10px;
    margin-right : 12px;
`;

const StyledInputFront = styled.input`
    background-color : #F9FAFC;
    border-radius : 10px;
    margin-bottom : 10px;
    border : 1px solid #F0F0F0;
    box-sizing: border-box;
    margin-right : 12px;
    padding : 10px;
    height : 44px;
`;

const CheckDiv = styled.div`
    display: flex;
    flex-direction: row;

    ${StyledInput} {
        width:246px;
        margin-bottom: 4px;
    }
`;

const StyledBtn = styled.button`
    width:74px;
    height:44px;
    border-radius : 10px;
    font-weight: 600;
    background-color : white;
    color : #008DE7;
    border : 1px solid #008DE7;
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
    
    ${StyledInput}{
        width : 61px;
        margin-right: 8px;
    }

    ${StyledInputFront}{
        width : 52px;
        margin-right: 8px;
    }

    ${StyledBtn}{
        width : 100px;
        font-size : 12px;
    }

    ${NumP}{
        margin-right: 8px;
    }
`

const ConfirmBox = styled.button`
    width : 328px;
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

    const title = '회원가입';

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const useInput = (validator?: (value: string) => boolean) => {
        const [value, setValue] = useState('');
      
        const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
          const {
            target: { value },
          } = event;
      
          // validator가 없으면 기본적으로 true로 설정
          let willUpdate = true;
      
          // validator가 제공된 경우만 실행
          if (validator && typeof validator === 'function') {
            willUpdate = validator(value);
          }
      
          // validator 통과한 경우에만 value 업데이트
          if (willUpdate) {
            setValue(value);
          }
        };
      
        return { value, onChange };
      };
      

    const validId = (value:string) : boolean => {
        const regex = /^[a-zA-z0-9]*$/;
        return value.length <= 16 && regex.test(value);
    }

    const validPw = (value:string): boolean => {
        const regex = /^[a-zA-Z0-9!@#$%^&*()]*$/;
        return value.length <= 15 && regex.test(value);
    }

    const id = useInput(validId);
    const pw = useInput(validPw);
    const pwCheck = useInput(validPw);
    const name = useInput();
    const identificationNumFront = useInput();
    const identificationNumBack = useInput();
    const phoneNumFront = useInput();
    const phoneNumMiddle = useInput();
    const phoneNumBack = useInput();
    const certificationNum = useInput();

    const [ phoneNum, setPhoneNum ] = useState('');

    // 아이디 중복 체크
    const { data: duplicatedData, error: duplicatedError, loading: duplicatedLoading,
        status: duplicatedStatus, refetch: duplicatedRefetch }
        = useAxios('/signup/is-duplicated', 'POST', {memberId : id.value});

    const [ isDuplicated, setIsDuplicated ] = useState(true);

    const idDuplicationCheck = () => {
        // 중복 체크 요청을 실행하기 위해 refetch 호출
        duplicatedRefetch();
    };

    useEffect(() => {
        // 상태 업데이트를 불필요하게 반복하지 않도록, 명확한 조건 설정
        if (duplicatedStatus === 200 || duplicatedStatus === 401) {
          // 상태를 이미 업데이트한 경우 중복 호출 방지
          if (isDuplicated !== duplicatedData.isDuplicated) {
            setIsDuplicated(duplicatedData.isDuplicated);
          }
        }
        // 의존성 배열에서 duplicatedData를 제외하여 불필요한 상태 변경 방지
      }, [duplicatedStatus]); // duplicatedStatus만 의존성 배열에 포함

      // 전화번호 인증
    useEffect(() => {
        setPhoneNum(`${phoneNumFront}${phoneNumMiddle}${phoneNumBack}`);
    }, [phoneNumFront, phoneNumMiddle, phoneNumBack])

    const { data: phoneData, error: phoneError, loading: phoneLoading,
        status: phoneStatus, refetch: phoneRefetch }
        = useAxios('/sms/send','POST',{phoneNumber : phoneNum});

    const certificateSend = () => {
        phoneRefetch();
    };

    const { data : smsData, error: smsError, loading: smsLoading,
        status: smsStatus, refetch: smsRefetch}
        = useAxios('/sms/confirm', 'POST', 
            {phoneNumber : phoneNum, certificationNumber: certificationNum});

    const certificateCheck = () => {
        smsRefetch();
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
                    <StyledBtn onClick={idDuplicationCheck}>중복확인</StyledBtn>
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
                    <StyledInputFront type="text" {...phoneNumFront}/>
                    <NumP>-</NumP>
                    <StyledInput type="text" {...phoneNumMiddle}/>
                    <NumP>-</NumP>
                    <StyledInput type="text" {...phoneNumBack}/>
                    <StyledBtn onClick={certificateSend}>인증번호 발송</StyledBtn>
                </PhoneDiv>
                <HowP>인증번호</HowP>
                <CheckDiv>
                    <StyledInput type="text" {...certificationNum} />
                    <StyledBtn onClick={certificateCheck}>확인</StyledBtn>
                </CheckDiv>
                <CheckP>인증되었습니다.</CheckP>
                <ConfirmBox>회원가입</ConfirmBox>
            </InputDiv>
        </div>
    )
}

export default SignupPage;