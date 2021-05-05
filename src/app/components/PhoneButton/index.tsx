import React from "react";
import { Button, Typography } from "@material-ui/core";
import { PHONE_MASK } from "../../constants";
import { useIntl } from "react-intl";
import { makeStyles } from "@material-ui/core/styles";

interface IProps {
  userId: number;
  realNumber: string;
}

const useStyles = makeStyles(theme => ({
  root: {
    display: "inline-flex",
    flexDirection: "column",
  },
  body: {
    display: "inline-flex",
    alignItems: "center",
  },
  title: {
    color: theme.palette.grey.A200,
    fontSize: theme.typography.pxToRem(15),
  },
  button: {
    // marginBottom: theme.spacing(2),
  },
  helper: {
    color: theme.palette.grey.A200,
    fontSize: theme.typography.pxToRem(13),
  },
}));

const PhoneButton = (props: IProps) => {
  const intl = useIntl();
  const styles = useStyles();

  return (
    <div className={styles.root}>
      <div className={styles.body}>
        <Typography component="p" className={styles.title}>
          {intl.formatMessage({
            id: "PROFILE.INPUT.PHONE",
          })}
          :
        </Typography>
        <Button variant={"text"} href={`tel:${PHONE_MASK}`} className={styles.button}>
          {PHONE_MASK}
        </Button>
      </div>

      <Typography component="p" className={styles.helper}>
        {intl.formatMessage({ id: "PHONE_MASK_HELPER_TEXT" }, { userId: props.userId })}
      </Typography>
    </div>
  );
};

export default PhoneButton;
