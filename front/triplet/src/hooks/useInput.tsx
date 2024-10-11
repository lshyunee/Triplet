import React, { useState } from 'react';

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

    const changeData = (v:any) => {
      setValue(v);
    }
  
    return { value, onChange, changeData };
  };

  export default useInput;