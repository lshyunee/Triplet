import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import BackHeader from '../../../components/header/BackHeader';

// 이미지 (SVG 아이콘)
import { ReactComponent as RemoveIcon } from '../../../assets/simplePay/remove.svg';
import { ReactComponent as RepeatIcon } from '../../../assets/simplePay/repeat.svg';

// 숫자 배열을 섞기 위한 함수
const shuffleArray = (array: number[]) => {
    return array
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
};

const TitleDiv = styled.div`
    margin-top : 126px;
    text-align : center;
`

const Title = styled.p`
  margin: 10px 0;
  font-size: 16px;
  font-weight : 700;
`;

const Description = styled.p`
    display : flex;
    align-items: center;
    justify-content : center;
    height : 34px;
    margin-bottom: 20px;
    font-size:14px;
    font-weight: 500;
    color: #333;
`;



const PasswordDots = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px 0;
  margin-bottom : 146px;
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
  gap: 15px;
  max-width: 300px;
  margin: 0 auto;
`;

const NumberButton = styled.button`
    padding: 20px;
    font-size: 20px;
    font-weight: 600;
    background-color: white;
    border: none;
      margin-top : 10px;
`;


const BottomButtons = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
    max-width: 300px;
    margin: 0 auto;
    margin-top : 10px;
`;

const IconButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const SimplePasswordConfirmPage = () => {
    const [numbers, setNumbers] = useState<number[]>([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const [password, setPassword] = useState<number[]>([]);

    useEffect(() => {
        setNumbers(shuffleArray([...numbers]));  // numbers 배열 복사 후 섞기
    }, []);

    // 숫자 클릭 핸들러
    const handleNumberClick = (num: number) => {
        if (password.length < 6) {
            setPassword([...password, num]);
        }
    };

    // 지우기 버튼 클릭 핸들러
    const handleBackspace = () => {
        setPassword(password.slice(0, -1));
    };

    // 초기화 버튼 클릭 핸들러
    const handleReset = () => {
        setPassword([]);
        setNumbers(shuffleArray([...numbers]));
    };

    return (
        <div>
            <BackHeader title={"간편비밀번호 인증"} />
            <TitleDiv>
                <Title>간편비밀번호</Title>
                <Description>비밀번호를 입력해주세요.</Description>
            </TitleDiv>

            <PasswordDots>
                {Array(6)
                    .fill(null)
                    .map((_, idx) => (
                        <Dot key={idx} isActive={password[idx] !== undefined} />
                    ))}
            </PasswordDots>

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
        </div>
    );
};

export default SimplePasswordConfirmPage;