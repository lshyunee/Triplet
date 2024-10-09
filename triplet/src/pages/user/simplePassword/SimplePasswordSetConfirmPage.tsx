import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import BackHeader from '../../../components/header/BackHeader';
import { useLocation, useNavigate } from 'react-router-dom';
import useAxios from '../../../hooks/useAxios';

// 이미지 (SVG 아이콘)
import { ReactComponent as RemoveIcon } from '../../../assets/simplePay/remove.svg';
import { ReactComponent as RepeatIcon } from '../../../assets/simplePay/repeat.svg';

interface Props {
    number: string;
}

// 숫자 배열을 섞기 위한 함수
const shuffleArray = (array: number[]) => {
    return array
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
};

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

const PasswordDiv = styled.div`
    min-height : calc(100vh - 56px);
    padding : 0.3vh 0 0;
`

const TitleDiv = styled.div`
    width : 100%;
    display : flex;
    flex-direction : column;
    text-align : center;
    padding-top : 20vh;
`;

const Title = styled.p`
    font-size: 16px;
    margin : 0 0 12px;
    font-weight: 700;
`;

const Description = styled.p`
    height : 34px;
    font-size:14px;
    margin : 0 0;
    font-weight: 500;
    color: #333;
`;


const PasswordDots = styled.div`
    display: flex;
    margin-top : 24px;
    justify-content : center;
`;

const Dot = styled.div<{ isActive: boolean }>`
    width: 15px;
    height: 15px;
    margin: 0 8px;
    border-radius: 50%;
    background-color: ${({ isActive }) => (isActive ? '#007BFF' : '#D3D3D3')};
`;

const NumberPad = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    justify-content : center;
    margin-top : 102px;
`;

const NumberButton = styled.button`
    font-size: 20px;
    font-weight: 600;
    background-color: white;
    margin : 20px 50px;
    border: none;
    padding : 0px;
`;

const BottomButtons = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    justify-content : center;
`;

const ButtonDiv = styled.div`
    margin-left : 55px;
    margin-right : 55px;
`

const IconButton = styled.button`
    background-color: transparent;
    border: none;
    cursor: pointer;
    justify-content: center;
    align-items: center;
    margin : 20px 44px;
    padding : 0px;
`;

const ErrorMessage = styled.p`
    color: red;
    font-size: 14px;
    text-align: center;
    margin-top: 16px;
`;
const SimplePasswordSetConfirmPage: React.FC = () => {
    const [numbers, setNumbers] = useState<number[]>([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const [password, setPassword] = useState<number[]>([]);
    const [isError, setIsError] = useState(false); // 에러 상태를 관리하는 상태 변수

    const navigate = useNavigate();
    const location = useLocation();
    const { prePassword } = location.state;

    const { data: resData, loading: resLoading, error: resError, 
        status: resStatus, refetch: resRefetch } 
    = useAxios('/simple-password', 'POST', undefined, {
        newSimplePassword : prePassword.join(''),
        newSimplePasswordConfirm : password.join('')
    });

    useEffect(() => {
        setNumbers(shuffleArray([...numbers]));  // numbers 배열 복사 후 섞기
    }, []);


    // 숫자 클릭 핸들러
    const handleNumberClick = (num: number) => {
        if (password.length < 6) {
            const newPassword = [...password, num];
            setPassword(newPassword);
            setIsError(false);
        }
    };

    useEffect (() => {
        if (password.length === 6) {
            // 6자리 비밀번호가 입력되면 이동
            if (password.join('') === prePassword.join('')) {
                resRefetch();
                // 모달 열기
                setIsModalOpen(true);
            } else {
                setIsError(true); // 에러 상태로 설정
                setPassword([]);
            }
        }
    },[password]);

    // 지우기 버튼 클릭 핸들러
    const handleBackspace = () => {
        setPassword(password.slice(0, -1));
    };

    // 초기화 버튼 클릭 핸들러
    const handleReset = () => {
        setPassword([]);
        setNumbers(shuffleArray([...numbers]));
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    // 모달 닫기 및 페이지 이동 처리
    const closeModal = () => {
        setIsModalOpen(false);
        navigate(`/`);
    };

    return (
        <div>
            <BackHeader title={"간편비밀번호 설정"} />
            <PasswordDiv>
                <TitleDiv>
                    <Title>간편비밀번호 설정</Title>
                    <Description style={{ color: isError ? 'red' : 'black' }}>
                        {isError
                            ? "비밀번호가 일치하지 않습니다."
                            : <>
                                간편비밀번호를
                                <br />
                                다시 한 번 입력해주세요.
                            </>}
                    </Description>
                </TitleDiv>

                <PasswordDots>
                    {Array(6)
                        .fill(null)
                        .map((_, idx) => (
                            <Dot key={idx} isActive={password[idx] !== undefined} />
                        ))}
                </PasswordDots>

                <ButtonDiv>
                    <NumberPad>
                        {numbers.slice(0, 9).map((num) => (
                            <NumberButton key={num} onClick={() => handleNumberClick(num)}>
                                {num}
                            </NumberButton>
                        ))}
                    </NumberPad>

                    {/* 숫자 0 및 아이콘 버튼 */}
                    <BottomButtons>
                        <IconButton onClick={handleReset}>
                            <RepeatIcon />
                        </IconButton>
                        <NumberButton onClick={() => handleNumberClick(numbers[9])}>
                            {numbers[9]}
                        </NumberButton>
                        <IconButton onClick={handleBackspace}>
                            <RemoveIcon />
                        </IconButton>
                    </BottomButtons>
                </ButtonDiv>
            </PasswordDiv>
            <>
                {isModalOpen && (
                    <s.ModalOverlay>
                        <s.ModalContainer>
                            <s.ModalText>변경이 완료되었습니다.</s.ModalText>
                            <s.ModalButton onClick={closeModal}>확인</s.ModalButton>
                        </s.ModalContainer>
                    </s.ModalOverlay>
                )}
            </>
        </div>

    );
};

export default SimplePasswordSetConfirmPage;
