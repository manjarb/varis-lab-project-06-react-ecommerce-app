import React from "react";

interface ErrorMessageProps {
  message?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message = "Something went wrong. Please try again.",
}) => {
  return (
    <div role="alert" className="text-center pt-30 pb-30">
      <p className="fs-18 text-muted">{message}</p>
    </div>
  );
};

export default ErrorMessage;
