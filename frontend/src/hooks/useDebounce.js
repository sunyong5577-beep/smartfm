import { useState, useEffect } from 'react';

/**
 * 검색 입력의 디바운스 훅
 * @param {*} value - 디바운스할 값
 * @param {number} delay - 지연 시간(ms)
 */
const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
