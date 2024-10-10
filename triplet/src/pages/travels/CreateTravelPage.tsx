import { create } from 'domain';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { pageMove } from '../../features/navigation/naviSlice';
import BackHeader from '../../components/header/BackHeader';
import { ReactComponent as Calendar } from '../../assets/pay/calendar.svg';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

import { ReactComponent as Plus } from '../../assets/common/plus.svg';
import { ReactComponent as Minus } from '../../assets/common/minus.svg';
import useAxios from '../../hooks/useAxios';
import { count } from 'console';
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';


const s = {
  Container: styled.div`
    margin-top: 56px;
    padding: 0 16px;
    height: calc(100vh - 112px);
    overflow-y: auto;
  `,
  CalendarButton: styled.div`
    background-color: #F9FAFC;
    height: 44px;
    border: solid 1px #F0F0F0;
    border-radius: 10px;
    display: flex;
    /* justify-content: center; */
    width: 100%;
  `,
  CalendarText: styled.span`
    font-size: 12px;
    font-weight: 500;
    margin-left: 12px;
  `,
  CalendarTextArea: styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: center;
    cursor: pointer;
  `,
  StyledDatePicker: styled(DatePicker)`
    text-align: center;
    border: none;
    font-size: 14px;
    font-weight: 500;
    color: #424242;
    background-color: #F9FAFC;
    pointer-events: none;
    outline: none;
    caret-color: transparent;
  `,
  InputText: styled.div`
    font-size: 12px;
    font-weight: 500;
    color: #424242;
    margin-bottom: 4px;
    margin-left: 4px;
    margin-top: 24px;
  `,
  InputBoxArea: styled.div`
    width: 100%;
    display: flex;
    align-items: center;
  `,
  InputBox: styled.input`
    font-size: 14px;
    font-weight: 500;
    background-color: #F9FAFC;
    border: solid 1px #F0F0F0;
    border-radius: 10px;
    height: 44px;
    width: 100%;
    padding: 0 16px;
  `,
  DropDown: styled.select`
    font-size: 14px;
    font-weight: 500;
    font-family: 'Pretendard';
    background-color: #F9FAFC;
    border: solid 1px #F0F0F0;
    border-radius: 10px;
    height: 44px;
    width: 100%;
    padding: 0 16px;
  `,
  Number: styled.p`
    font-weight : 500;
    font-size : 14px;
  `,
  NumberArea: styled.div`
    display: flex;
    justify-content: center; /* 중앙 정렬 */
    align-items: center;
    background-color: #F9FAFC;
    border: 1px solid #F0F0F0;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 500;
    width: 106px;
    height: 44px;
    gap: 16px; /* 버튼과 숫자 사이의 간격 */
  `,
  CountArea: styled.div`
    display: flex;
    flex-direction: row;
  `,
  UnitText: styled.p`
    font-weight: 500;
    font-size: 14px;
    margin-left: 8px;
  `,
  ImageButton: styled.button`
    background-color: #FFFFFF;
    border: solid 1px #008DE7;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 600;
    color: #008DE7;
    height: 44px;
    width: 100px;
    margin-bottom: 130px;
  `,
  ImageArea: styled.div`
    width: 100%;
  `,
  PrevButton: styled.button`
    background-color: #FFFFFF;
    font-size: 14px;
    font-weight: 600;
    border-radius: 10px;
    height: 44px;
    border: solid 1px #008DE7;
    width: 100%;
    color: #008DE7;
  `,
  NextButton: styled.button`
    background-color: #008DE7;
    font-size: 14px;
    font-weight: 600;
    border-radius: 10px;
    height: 44px;
    border: none;
    width: 100%;
    color: #FFFFFF;
  `,
  SubmitButton: styled.button`
    background-color: #008DE7;
    font-size: 14px;
    font-weight: 600;
    border-radius: 10px;
    height: 44px;
    border: none;
    width: 100%;
    color: #FFFFFF;
  `,
  ButtonArea: styled.div`
    display: flex;
    gap: 8px;
    position: fixed;
    left: 0;
    right: 0;
    margin: 0 16px;
    bottom: 84px;
  `,
  FirstStep: styled.div<FirstStepProps>`
    display: ${(props) => (props.$isFirst === true ? '' : 'none')};
  `,
  SecondStep: styled.div<FirstStepProps>`
    display: ${(props) => (props.$isFirst === true ? 'none' : '')};
  `,
  Unit: styled.span`
    font-size: 14px;
    font-weight: 500;
    margin-left: 8px;
  `
}

type countryData = {
  countryId: number;
  countryName: string;
  currency: string;
};

interface FirstStepProps {
  $isFirst: boolean;
};

type currencyData = {
  changePercentage: string;
  changeStatus: number;
  created: string;
  currency: string;
  exchangeMin: number;
  exchangeRate: string;
  id: number;
};

const CreateTravelPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(pageMove("travels"));
  }, []);

  // 단계 구분
  const [isFirst, setIsFirst] = useState(true);
  const nextButtonOnclick = () => {
    setIsFirst((prev) => !prev);
  }

  // 일정
  const today =  new Date();
  const week = new Date(new Date().setDate(new Date().getDate() +3));

  const [dateRange, setDateRange] = useState<any | null>([today, week]);
  const [start, end] = dateRange;

  const dateInputRef = useRef<DatePicker>(null);
  
  const [isDateOpen, setIsDateOpen] = useState<boolean>(false);

  useEffect(() => {
    if (isDateOpen === true) {
      dateInputRef.current?.setFocus();
      setIsDateOpen(false);
    };
  }, [isDateOpen]);

  // 인원
  const [ isErrorOpen, setIsErrorOpen ] = useState(false);
  const [ errorMsg, setErrorMsg ] = useState('');
  const [ person, setPerson ] = useState(1);

  const errorOpen = () => {
    setIsErrorOpen(true);
  }

  const decreasePerson = () => {
    if(person === 1){
      setErrorMsg("인원수는 1 이상이어야 합니다.");
      errorOpen();
      return;
    }
    setPerson(person-1);
  }

  const increasePerson = () => {
    setPerson(person+1);
  }

  // 이미지
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<string>();
  const [changeImg, setChangeImg] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState<string>();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFilesArray = Array.from(e.target.files);
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          setImage(reader.result as string);
          setImgUrl(URL.createObjectURL(file));
        };
        setChangeImg(newFilesArray[0]);
        reader.readAsDataURL(file);
      };
    };
  };

  // 제목
  const [title, setTitle] = useState<string>();
  const handleTitleChange = (e: React.FormEvent<HTMLInputElement>) => {
    const {
      currentTarget: {value},
    } = e;
    setTitle(value);
  };

  // 국가조회
  const [country, setCountry] = useState<countryData[]>([]);

  const { data: countryData,
    error: countryError,
    loading: countryLoading,
    status: countryStatus,
    refetch: countryRefetch } = useAxios('/travels/countries', 'GET');

  


  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          countryRefetch(),
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (countryData) {
      setCountry(countryData.data)
      console.log(countryData.data)
    }
  }, [countryData]);

  // 국가선택
  const [travelCountry, setTravelCountry] = useState<number>(1);
  const [countryCurrency, setCountryCurrency] = useState<string>('KRW');
  const handleCountryChange = (e: React.FormEvent<HTMLSelectElement>) => {
    const {
      currentTarget: {value},
    } = e;
    const countryParse = JSON.parse(value)
    setTravelCountry(countryParse.countryId)
    setCountryCurrency(countryParse.currency)
  };

  useEffect(() => {
    console.log(countryCurrency)
  }, [countryCurrency])

  // 예산설정
  const [flight, setFlight] = useState<number>(0);
  const [meal, setMeal] = useState<number>(0);
  const [shopping, setShopping] = useState<number>(0);
  const [transport, setTransport] = useState<number>(0);
  const [tour, setTour] = useState<number>(0);
  const [accommodation, setAccommodation] = useState<number>(0);
  const [etc, setEtc] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  const [foreignFlight, setForeignFlight] = useState<number>(0);
  const [foreignMeal, setForeignMeal] = useState<number>(0);
  const [foreignShopping, setForeignShopping] = useState<number>(0);
  const [foreignTransport, setForeignTransport] = useState<number>(0);
  const [foreignTour, setForeignTour] = useState<number>(0);
  const [foreignAccommodation, setForeignAccommodation] = useState<number>(0);
  const [foreignEtc, setForeignEtc] = useState<number>(0);
  const [foreignTotal, setForeignTotal] = useState<number>(0);

  const [currency, setCurrency] = useState<currencyData>();
  const { data: currencyData,
    error: currencyError,
    loading: currencyLoading,
    status: currencyStatus,
    refetch: currencyRefetch } = useAxios(`/exchange-rate/${countryCurrency}`, 'GET');
  
  
  const handleBudget = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    const numberValue = Number(value);
    if (numberValue || Number(value) === 0) {
      switch (name) {
        case 'flight':
          setFlight(numberValue);
          break;
        case 'meal':
          setMeal(numberValue);
          break;
        case 'shopping':
          setShopping(numberValue);
          break;
        case 'transport':
          setTransport(numberValue);
          break;
        case 'tour':
          setTour(numberValue);
          break;
        case 'accommodation':
          setAccommodation(numberValue);
          break;
        case 'etc':
          setEtc(numberValue);
          break;
      };
    }
  };
  useEffect(() => {
    setTotal(flight + meal + transport + shopping + tour + accommodation + etc)
  }, [flight, meal, transport, shopping, tour, accommodation, etc])

  const [tdata, settdata] = useState<any>();
  

  const { data: testData,
    error: testError,
    loading: testLoading,
    status: testStatus,
    refetch: testRefetch } = useAxios('/travels/create', 'POST', undefined, tdata)

  // axios
  const submitTravelData = async () => {
    if (!title) {
      window.alert('제목을 입력해주세요.')
      return;
    }
    if (person < 1) {
      return;
    }

    const budgets = [
      { categoryId: 1, budget: meal, budgetWon: meal },
      { categoryId: 2, budget: shopping, budgetWon: shopping },
      { categoryId: 3, budget: transport, budgetWon: transport },
      { categoryId: 4, budget: tour, budgetWon: tour },
      { categoryId: 5, budget: accommodation, budgetWon: accommodation },
      { categoryId: 6, budget: etc, budgetWon: etc },
    ];

    // FormData 생성
    const formData = new FormData();

    const tmpData = {
      country: travelCountry,
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
      title: title,
      memberCount: person,
      totalBudget: total,
      airportCost: flight,
      totalBudgetWon: total,
      budgets: budgets
    };

    formData.append("data", JSON.stringify(tmpData))

    // 이미지 파일
    if (changeImg) {
      formData.append("image", changeImg);
    }
    
    console.log("FormData 내용:");
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });

    settdata(formData)
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (tdata) {
      console.log('실행')
      const fetchData = async () => {
        try {
          await Promise.all([
            testRefetch(),
          ]);
        } catch (error) {
          console.error('error fetching data:', error);
        }
      };
    
      fetchData();
    }
  }, [tdata])

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          currencyRefetch(),
        ])
      } catch (error) {
        console.error('error fetching', error)
      }
    }
    fetchData()
  }, [countryCurrency])

  useEffect(() => {
    if (testError) {
      window.alert(testError.response.data.message)
    }
  }, [testError])

  useEffect(() => {
    if (testData) {

      navigate('/travels')
    }
  }, [testData])

  useEffect(() => {
    console.log(currencyData)
    if (currencyData) {
      setCurrency(currencyData.data)
    }
  }, [currencyData])

  useEffect(() => {
    console.log(currency)
  }, [currency])

  return (
    <>
    <BackHeader title='여행 등록'/>
    <s.Container>
      <s.FirstStep $isFirst={isFirst}>
        <s.InputText>여행 제목</s.InputText>
        <s.InputBoxArea><s.InputBox onChange={handleTitleChange} placeholder='여행 제목을 입력하세요.'></s.InputBox></s.InputBoxArea>
        <s.InputText>여행 일정</s.InputText>
        <s.CalendarButton>
          <s.CalendarTextArea onClick={() => setIsDateOpen(true)}>
            <Calendar/>
            <s.StyledDatePicker
              selectsRange={true}
              startDate={start}
              endDate={end}
              minDate={today}
              onChange={((range: any) => setDateRange(range))}
              dateFormat={"yyyy.MM.dd"}
              ref={dateInputRef}
            />
          </s.CalendarTextArea>
        </s.CalendarButton>
        <s.InputText>여행 국가</s.InputText>
        
        <s.DropDown onChange={handleCountryChange}>
          {country.map((data) => (
            <option key={data.countryId} value={JSON.stringify(data)}>{data.countryName}</option>
          ))}
        </s.DropDown>
        <s.InputText>여행 인원</s.InputText>
        <s.CountArea>
          <s.NumberArea>
            <Minus onClick={decreasePerson}></Minus>
            <s.Number>{person}</s.Number>
            <Plus onClick={increasePerson}></Plus>
          </s.NumberArea>
          <s.UnitText>명</s.UnitText>
        </s.CountArea>
        <s.InputText>대표 사진</s.InputText>
        <s.ImageArea>
          <img src={imgUrl} width={'100%'} />
        </s.ImageArea>
        <s.ImageButton onClick={() => {
          fileInputRef.current?.click()
        }}>사진 선택</s.ImageButton>
        <input
          ref={fileInputRef}
          type='file'
          accept='image/*'
          multiple
          style={{display: 'none'}}
          onChange={handleImageUpload}
        />
        <s.ButtonArea>
          <s.NextButton onClick={nextButtonOnclick}>다음으로</s.NextButton>
        </s.ButtonArea>
      </s.FirstStep>
      <s.SecondStep $isFirst={isFirst}>
        <s.InputText>항공</s.InputText>
        <s.InputBoxArea><s.InputBox name='flight' onChange={handleBudget} value={flight}></s.InputBox><s.Unit>원</s.Unit></s.InputBoxArea>
        <s.InputText>식사</s.InputText>
        <s.InputBoxArea><s.InputBox name='meal' onChange={handleBudget} value={meal}></s.InputBox><s.Unit>원</s.Unit></s.InputBoxArea>
        <s.InputText>쇼핑</s.InputText>
        <s.InputBoxArea><s.InputBox name='shopping' onChange={handleBudget} value={shopping}></s.InputBox><s.Unit>원</s.Unit></s.InputBoxArea>
        <s.InputText>교통</s.InputText>
        <s.InputBoxArea><s.InputBox name='transport' onChange={handleBudget} value={transport}></s.InputBox><s.Unit>원</s.Unit></s.InputBoxArea>
        <s.InputText>관광</s.InputText>
        <s.InputBoxArea><s.InputBox name='tour' onChange={handleBudget} value={tour}></s.InputBox><s.Unit>원</s.Unit></s.InputBoxArea>
        <s.InputText>숙박</s.InputText>
        <s.InputBoxArea><s.InputBox name='accommodation' onChange={handleBudget} value={accommodation}></s.InputBox><s.Unit>원</s.Unit></s.InputBoxArea>
        <s.InputText>기타</s.InputText>
        <s.InputBoxArea><s.InputBox name='etc' onChange={handleBudget} value={etc}></s.InputBox><s.Unit>원</s.Unit></s.InputBoxArea>
        <s.InputText>총 예산</s.InputText>
        <s.InputBoxArea style={{marginBottom: '120px'}}><s.InputBox name='total' onChange={handleBudget} value={total}></s.InputBox><s.Unit>원</s.Unit></s.InputBoxArea>
        <s.ButtonArea>
          <s.PrevButton onClick={nextButtonOnclick}>이전으로</s.PrevButton>
          <s.SubmitButton onClick={submitTravelData}>완료하기</s.SubmitButton>
        </s.ButtonArea>
      </s.SecondStep>
    </s.Container>
    </>
  );
};

export default CreateTravelPage;