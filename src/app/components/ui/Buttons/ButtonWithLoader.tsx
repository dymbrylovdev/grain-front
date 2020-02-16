import React from "react";
import clsx from "clsx";
import { Button } from "@material-ui/core";

interface IProps {
  loading?: boolean;
  onPress?: () => {};
}

const noop = () => {};

const ButtonWithLoader: React.FC<IProps> = ({ children, loading = false, onPress = noop }) => {
  return (
    <Button
      variant="contained"
      color="primary"
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
