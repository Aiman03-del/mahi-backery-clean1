import React from "react";

const InputCell = ({
  value,
  onChange,
  onBlur,
  inputRef,
  onKeyDown,
  placeholder,
}) => (
  <input
    type="text"
    inputMode="numeric"
    pattern="[০-৯0-9]*"
    className="w-full text-center focus:outline-none transition text-base sm:text-lg text-secondary"
    value={value || ""}
    onChange={onChange}
    onBlur={onBlur}
    ref={inputRef}
    onKeyDown={onKeyDown}
    placeholder={placeholder}
  />
);

export default InputCell;
