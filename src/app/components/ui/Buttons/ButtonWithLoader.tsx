import React from "react";
import clsx from "clsx";
import { Button } from "@material-ui/core";

interface IProps {
  loading?: boolean;
  variant?: "text" | "outlined" | "contained";
  color?: "inherit" | "primary" | "secondary" | "default";
  onPress?: () => {} | void;
  disabled?: boolean;
}

const noop = () => {};

const ButtonWithLoader: React.FC<IProps> = ({
  children,
  loading = false,
  onPress = noop,
  variant = "contained",
  color = "primary",
  disabled = false,
}) => {
  return (
    <Button
      variant={variant}
      color={color}
      onClick={onPress}
      className={
        variant === "contained"
          ? clsx({
              "btn btn-primary btn-elevate kt-login__btn-primary": true,
              "kt-spinner kt-spinner--right kt-spinner--md kt-spinner--light": loading,
            })
          : clsx({
              "btn btn-elevate": true,
              "kt-spinner kt-spinner--right kt-spinner--md kt-spinner--dark": loading,
            })
      }
      disabled={disabled}
    >
      {children}
    </Button>
  );
};

export default ButtonWithLoader;
