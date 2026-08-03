import React from "react";

interface RadioInputProps {
  id: string;
  name: string;
  checked: boolean;
  onChange: () => void;
  label: React.ReactNode;
  className?: string;
}

const RadioInput: React.FC<RadioInputProps> = ({
  id,
  name,
  checked,
  onChange,
  label,
  className = "",
}) => {
  return (
    <div className={`flex align-item-start ${className}`}>
      <input
        className="mr-10 mt-3"
        type="radio"
        id={id}
        name={name}
        checked={checked}
        onChange={onChange}
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
};

export default RadioInput;
