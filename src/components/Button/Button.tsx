import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import ClipLoader from "react-spinners/ClipLoader";
import styles from "./Button.module.scss";

interface ButtonProps {
  onClick?: () => void;
  icon?: IconProp; // Accepts FontAwesomeIcon props
  variant?: "primary";
  disabled?: boolean;
  isLoading?: boolean;
  children: React.ReactNode;
  type?: "button" | "reset" | "submit";
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  type = "button",
  onClick,
  icon,
  children,
  variant = "primary",
  disabled = false,
  isLoading = false,
  className = "",
}) => {
  return (
    <button
      type={type}
      className={`${styles.button} ${styles[variant]} ${className} flex flex-center py-15 px-20 fw-medium pointer`}
      onClick={() => {
        if (onClick) {
          onClick();
        }
      }}
      disabled={disabled}
    >
      {isLoading ? (
        <ClipLoader size={20} aria-label="Loading Spinner" color="white" />
      ) : (
        <>
          {icon && (
            <FontAwesomeIcon icon={icon} className={`${styles.icon} mr-10`} />
          )}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
