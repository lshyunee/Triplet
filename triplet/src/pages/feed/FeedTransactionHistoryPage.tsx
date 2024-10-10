
    import React, {useEffect, useRef, useState} from 'react';
    import styled from 'styled-components';
    import BackHeader from '../../components/header/BackHeader';

    import { useDispatch, useSelector } from 'react-redux';
    import { useParams,useNavigate} from 'react-router-dom';
    import { RootState } from '../../store';
    import { pageMove } from '../../features/navigation/naviSlice';
    import { ReactComponent as Wallet } from '../../assets/pay/wallet.svg';
    import { ReactComponent as Calendar } from '../../assets/pay/calendar.svg';
    import DatePicker from 'react-datepicker';
    import "react-datepicker/dist/react-datepicker.css";
    import { isDate } from 'util/types';
    import useAxios from '../../hooks/useAxios';
    import { format, differenceInDays, addDays,subHours  } from 'date-fns';

    interface Transaction {
    transactionId: number;
    price: number;
    transactionDate: string;
    balance: number;
    categoryName: string;
    categoryId: number;
    merchantName: string;
    travelId: number;
    
    }

    interface TransactionsResponse {
    code: string;
    message: string;
    data: Transaction[];
    }

    const s = {
    Container: styled.div`
        padding-top: 112px;
        padding-left: 16px;
        padding-right: 16px;
        height: calc(100vh - 168px);
        padding-bottom: 56px; /* NavBar 높이만큼 패딩 추가 */
        box-sizing: border-box;     
        `,

    StickyDateSliderContainer: styled.div`
        position: fixed;
        top: 56px;
        height:56px; 
        width: calc(100vw - 16px);
        box-sizing: border-box; 
        background-color: white;
        z-index: 1;
        text-align: center;
        display:flex;
    `,
    TransactionContainer: styled.div`

        padding-bottom:56px;
        `,
    
    DateList: styled.div`
         width: 100%; /* 가로 길이를 100%로 설정 */
        text-align: center;
        display: flex;
         overflow-x: auto; /* 가로 스크롤 가능하게 설정 */
        flex-shrink: 0; /* 요소가 축소되지 않도록 설정 */
    `,
    DateButton: styled.button<{ selected: boolean }>`
        background-color: ${({ selected }) => (selected ? '#008DE7' : '#F9FAFC')};
        color: ${({ selected }) => (selected ? '#FFFFFF' : '#444444')};
        padding: 10px;
        border-radius: 10px;
        cursor: pointer;
        border: none;
        min-width: 50px;
        text-align: center;
        margin:5px;

        `
        
    ,


    Card: styled.div`
        background-color: #E5F3FF;
        padding: 20px;
        border-radius: 20px;
        margin-top: 12px;`
    ,
    CardTitle: styled.span`
        font-size: 14px;
        font-weight: 500;
        margin-left: 8px;`
    ,
    CardTitleArea: styled.div`
        display: flex;
        align-items: center;
        margin-bottom: 4px;`
    ,
    CardCaption: styled.span`
        font-size: 14px;
        font-weight: 400;
        color: #666666;`
    ,
    CardKrw: styled.div`
        font-size: 20px;
        font-weight: 600;`
    ,
    CardButton: styled.button`
        background-color: #A2D3FF;
        font-size: 14px;
        font-weight: 500;
        height: 36px;
        width: 66px;
        border-radius: 50px;
        border: 0;`
    ,
    ButtonArea: styled.div`
        display: flex;
        align-items: end;
        justify-content: center; 
        gap: 80px; 
        margin-top: 8px;`
    ,
    CalendarButton: styled.div`
        background-color: #F9FAFC;
        height: 44px;
        border: solid 1px #F0F0F0;
        border-radius: 50px;
        display: flex;
        justify-content: center;
        width: 256px;
        margin: 0 auto;
        margin-top: 12px;
        margin-bottom: 20px;`
    ,
    CalendarText: styled.span`
        font-size: 12px;
        font-weight: 500;
        margin-left: 12px;`
    ,
    CalendarTextArea: styled.div`
        display: flex;
        align-items: center;
        width: 100%;
        justify-content: center;
        cursor: pointer;`
    ,
    StyledDatePicker: styled(DatePicker)`
        text-align: center;
        border: none;
        font-size: 12px;
        font-weight: 500;
        background-color: #F9FAFC;
        width: 150px;
        pointer-events: none;
        outline: none;
        caret-color: transparent;`
    ,
    DateText: styled.span`
        font-size: 12px;
        font-weight: 500;
        color: #444444;`
    ,
    DateLine: styled.hr`
        border: solid 0.1px #D9D9D9;
        margin: 0;
        margin-top: 8px;`
    ,
    PaymentTime: styled.span`
        font-size: 12px;
        font-weight: 400;
        color: #666666;`
        
    ,
    PaymentTitle: styled.span`
        font-size: 14px;
        font-weight: 600;
        margin-top: 8px;`
    ,
    PaymentTypeBlue: styled.span`
        font-size: 12px;
        font-weight: 400;
        color: #008DE7;`
    ,
    PaymentTypeRed: styled.span`
        font-size: 12px;
        font-weight: 400;
        color: #EB5C5C;`
    ,
    PaymentAmountBlue: styled.span`
        font-size: 16px;
        font-weight: 600;
        color: #008DE7;
        margin-top: 8px;`
    ,
    PaymentAmountRed: styled.span`
        font-size: 16px;
        font-weight: 600;
        color: #EB5C5C;
        margin-top: 8px;`
    ,
    BalanceText: styled.span`
        font-size: 12px;
        font-weight: 400;
        color: #666666;
        margin-top: 8px;`
    ,
    PaymentTitleArea: styled.div`
        display: flex;
        flex-direction: column;`
    ,
    PaymentAmountArea: styled.div`
        display: flex;
        flex-direction: column;
        align-items: end;`
    ,
    PaymentArea: styled.div`
        display: flex;
        justify-content: space-between;
        margin: 16px 0;`
    ,
    PaymentLine: styled.hr`
        border: solid 0.1px #EFEFEF;
        margin: 0;`
    ,
    EmptyMessage: styled.div`
        display: flex;
        justify-content: center;
        align-items: center;
        height: 50vh;  
        color: #666666;`,

    DateSection: styled.div`
        margin-top: 16px;
    `,
    
    }

    const FeedTransactionHistoryPage = () => {
    const dispatch = useDispatch();
    const { travelId } = useParams();
    const travel = useSelector((state: RootState) => state.sharedTravel);
    const { data: transactionData, 
            error: transactionError , 
            loading: transactionLoading, 
            status: transactionStatus, 
            refetch: transactionRefetch } = useAxios(`travel-wallet/transaction/${travelId}`, 'GET');

    const [transactionsByDate, setTransactionsByDate] = useState<{ [key: string]: Transaction[] }>({});

    useEffect(() => {
        const fetchData = async () => {
                try {
            await Promise.all([
                transactionRefetch(),  // 외화계좌 API 요청
            ]);
                } catch (error) {
                console.error('Error fetching data:', error);
                }
            };
        dispatch(pageMove("pay"));
        fetchData();
    }, []);


    

    const dateRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
    const [transactions, setTransactions] = useState<Transaction[] | null>(null);

        // 시작날짜와 끝날짜 계산
        const [startDate, setStartDate] = useState<Date | null>(null);
        const [endDate, setEndDate] = useState<Date | null>(null);
    
        const [selectedDate, setSelectedDate] = useState<string | null>(null);

        const getDateRange = () => {
            if (!startDate || !endDate) return [];
            const days = differenceInDays(endDate, startDate);
            return Array.from({ length: days + 1 }, (_, i) => addDays(startDate, i));
        };
        const handleDateSelect = (date: Date) => {
            const formattedDate = format(date, 'yyyy-MM-dd');
            setSelectedDate(formattedDate);
            const dateRef = dateRefs.current[formattedDate];
            if (dateRef) {
                const headerHeight = 112; // 고정된 날짜 선택 부분의 높이 (픽셀로 지정)
                const sectionPosition = dateRef.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                  top: sectionPosition,
                  behavior: 'smooth',
                });
              }
        };

    // 날짜별 데이터를 그룹화하는 함수
    const groupTransactionsByDate = (transactions: Transaction[]) => {
        return transactions.reduce((acc: { [key: string]: Transaction[] }, transaction) => {
        const date = format(new Date(transaction.transactionDate), 'yyyy-MM-dd');
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(transaction);
        return acc;
        }, {});
    };

        useEffect(() => {
            dispatch(pageMove('pay'));
            if (transactionData && transactionData.code === '200') {
        const filteredTransactions = transactionData.data
            .filter((transaction: Transaction) => transaction.categoryId >= 1 && transaction.categoryId <= 6)
            .map((transaction: Transaction) => ({
            ...transaction,
            transactionDate: subHours(new Date(transaction.transactionDate), 9).toISOString(),
            }));

        const groupedTransactions = groupTransactionsByDate(filteredTransactions);
        setTransactionsByDate(groupedTransactions);
        }
        }, [transactionData, dispatch]);
        const transactionDates = Object.keys(transactionsByDate);


    return (
        <>
        <BackHeader title='여행 '/>
        <s.Container>
        <s.StickyDateSliderContainer>
            <s.DateList>
            {transactionDates
                .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
                .map((date) => (
            <s.DateButton
                key={date}
                selected={selectedDate === date}
                onClick={() => handleDateSelect(new Date(date))}
            >
                {format(new Date(date), 'MM.dd')}
            </s.DateButton>
            ))}
            </s.DateList>
        </s.StickyDateSliderContainer>
   
        <s.TransactionContainer>
        {/* 거래 내역이 없을 때 문구 표시 */}
        {transactionDates?.length === 0 ? (
            <s.EmptyMessage>거래 내역이 없습니다</s.EmptyMessage>
        ) : ( 
            transactionDates
            .map((date) => (
            <React.Fragment key={date}>

                <s.DateSection ref={(el) => (dateRefs.current[date] = el)}>
                    <div>{format(new Date(date), 'yyyy.MM.dd')}</div>
                    <s.DateLine />
                {transactionsByDate[date].map((transaction) => (
                    
                <React.Fragment >
                    <s.PaymentArea key={transaction.transactionId}>
                    <s.PaymentTitleArea>
                        <s.PaymentTime>{new Date(transaction.transactionDate).toLocaleTimeString()}</s.PaymentTime>
                        <s.PaymentTitle>{transaction.merchantName}</s.PaymentTitle>
                    </s.PaymentTitleArea>

                    <s.PaymentAmountArea>
                        <s.PaymentAmountBlue>{transaction.price.toLocaleString()}원</s.PaymentAmountBlue>
                        <s.BalanceText>잔액 {transaction.balance.toLocaleString()}원</s.BalanceText>
                    </s.PaymentAmountArea>
                    </s.PaymentArea>
                    <s.PaymentLine/>
                </React.Fragment>
                ))
                }
                </s.DateSection>
                </React.Fragment>
            ))
        )}
        </s.TransactionContainer>
        </s.Container>
        </>
    );
    };

    export default FeedTransactionHistoryPage;