import React, {useState, useEffect} from 'react';
import BackHeader from '../../components/header/BackHeader';
import styled from 'styled-components';

import useAxios from '../../hooks/useAxios';
import useInput from '../../hooks/useInput';

const HowP = styled.p`
    font-size : 12px;
    margin-left : 18px;
    margin-bottom : 3px;
    color : #888888;
`;

const InputDiv = styled.div`
    display: flex;
    flex-direction: column;
    margin-top:40px;
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
    margin-left : 18px;
`
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
    margin-left : 16px;
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
        margin-left : 16px;
    }

    ${StyledInput}{
        width : 36px;
        margin-left : 0px;
    }

`;

const PhoneDiv = styled.div`
    display : flex;
    flex-direction: row;
    
    ${StyledInput}{
        width : 61px;
        margin-right: 8px;
        margin-left : 0px;
    }

    ${StyledInputFront}{
        width : 52px;
        margin-right: 8px;
        margin-left : 16px;
    }

    ${StyledBtn}{
        width : 100px;
        font-size : 12px;
    }

    ${NumP}{
        margin-right: 8px;
    }
`

const CheckDiv = styled.div`
    display: flex;
    flex-direction: row;

    ${StyledInput} {
        width:246px;
        margin-bottom: 4px;
        margin-right : 8px;
    }
`;


const ConfirmDiv = styled.div`
    display : flex;
    width : 100%;
    align-items : center;
    margin-left : 16px;
`;

const ConfirmBox = styled.button`
    width : 328px;
    height : 44px;
    background-color : #008DE7;
    color : #FFFFFF;
    border-radius : 10px;
    font-weight: 600;
    font-size : 14px;
    border : none;
    margin-top : 150px;
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

    // 전화번호 인증
    useEffect(() => {
        setPhoneNum(`${phoneNumFront}${phoneNumMiddle}${phoneNumBack}`);
    }, [phoneNumFront, phoneNumMiddle, phoneNumBack])

    // 주민등록번호
    useEffect(() => {
        setIdentificationNum(`${identificationNumFront}${identificationNumBack}`);
    }, [identificationNumFront, identificationNumBack])

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

    const [ isCheck, setIsCheck ] = useState(false);

    useEffect (() => {
        if(smsStatus===200){
            setIsCheck(true);
        }
    }, [smsStatus]);

    const { data: editData, error: editError, loading: editLoading,
        status: editStatus, refetch: editRefetch }
        = useAxios('/api/v1/user/my', 'PUT', {
            name : name,
            phoneNumber : phoneNum,
            identificationNumber : identificationNum
        });

    const myInfoEdit = () => {
        if(isCheck === true){
            editRefetch();
        }   
    }

    return (
        <div>
            <BackHeader title={"내 정보 수정"}/>
            <InputDiv>
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
                        <StyledBtn onClick={certificateSend}>인증번호 발송</StyledBtn>
                    </PhoneDiv>
                    <HowP>인증번호</HowP>
                    <CheckDiv>
                        <StyledInput type="text" {...certificationNum} />
                        <StyledBtn onClick={certificateCheck}>확인</StyledBtn>
                    </CheckDiv>
                    <CheckP>인증되었습니다.</CheckP>
                    <ConfirmDiv>  
                        <ConfirmBox onClick={myInfoEdit}>수정 완료</ConfirmBox>
                    </ConfirmDiv>
            </InputDiv>
        </div>
    );
};

export default MyInfoEditPage;