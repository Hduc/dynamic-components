import React from "react";

interface Props {
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputControl: React.FC<Props> = ({ placeholder, onChange }) => (
  <input placeholder={placeholder} onChange={onChange} />
);

export default InputControl;
