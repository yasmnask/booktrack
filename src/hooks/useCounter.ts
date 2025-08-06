import { useState } from "react";
// Custom hook untuk mengelola counter
const useCounter = () => {
  const [count, setCount] = useState(0);

  const handleDecrement = () => {
    setCount((prevCount) => {
      if (prevCount > 0) {
        return prevCount - 1;
      } else {
        alert("Tidak bisa kurang dari 0");
        return 0;
      }
    });
  };
  const handleReset = () => {
    setCount(0);
  };
  const handleIncrement = () => {
    setCount((prevCount) => prevCount + 1);
  };

  return {
    count,
    handleIncrement,
    handleDecrement,
    handleReset,
  };
};

export default useCounter;
