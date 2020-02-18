import React from "react";
import clsx from "clsx";
import { Button } from "@material-ui/core";

interface IProps {
  loading?: boolean;
  color?: any;
  onPress?: () => {};
}

const noop = () => {};

const ButtonWithLoader: React.FC<IProps> = ({ children, loading = false, onPress = noop, color = "primary" }) => {
  return (
    <Button
      variant="contained"
      color={color}
      onClick={onPress}
      className={clsx({
        "btn btn-primary btn-elevate kt-login__btn-primary": true,
        "kt-spinner kt-spinner--right kt-spinner--md kt-spinner--light": loading,
      })}
      type="submit"
    >
      {children}
    </Button>
  );
};

export default ButtonWithLoader;
