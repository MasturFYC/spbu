import React from "react";

const useClickOutside = (ref: HTMLButtonElement | Element | any, callback: Function) => {
  const handleClick = (e: MouseEvent) => {
    const current = ref.current;
    if (current && !current.contains(e.target)) {
      callback();
    }
  };
  React.useEffect(() => {
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  });
};

export default useClickOutside;