import React from "react";

interface Props {
  label: string;
  onClick?: () => void;
}

const ButtonControl: React.FC<Props> = ({ label, onClick }) => (
  <button onClick={onClick}>{label}</button>
);

export default ButtonControl;
