import React from "react";
import clsx from "clsx";

interface IProps {
  loading?: boolean;
}

const ButtonWithLoader: React.FC<IProps> = ({ children, loading = false }) => {
  return (
    <button
      className={clsx({
        "btn btn-primary btn-elevate kt-login__btn-primary": true,
        "kt-spinner kt-spinner--right kt-spinner--md kt-spinner--light": loading,
      })}
    >
      {children}
    </button>
  );
};

export default ButtonWithLoader;
