import { createStore } from 'redux';

// 리듀서 정의 (예시)
const initialState = {
  count: 0,
};

function counterReducer(state = initialState, action: any) {
  switch (action.type) {
    case 'INCREMENT':
      return {
        ...state,
        count: state.count + 1,
      };
    case 'DECREMENT':
      return {
        ...state,
        count: state.count - 1,
      };
    default:
      return state;
  }
}

// 스토어 생성
const store = createStore(counterReducer);

export default store;
