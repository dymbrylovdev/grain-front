import React from "react";
import { Button } from "@material-ui/core";
import { PHONE_MASK } from "../../constants";
import { makeStyles } from "@material-ui/core/styles";

interface IProps {
  userId: number;
  realNumber: string;
}

const useStyles = makeStyles(theme => ({
  button: {
    "&:hover": {
      color: "#fff",
    },
  },
}));

const PhoneButton = (props: IProps) => {
  const styles = useStyles();

  return (
    <Button variant={"contained"} color={"primary"} href={`tel:${PHONE_MASK},${props.userId}#`} className={styles.button}>
      Позвонить
    </Button>
  );
};

export default PhoneButton;
