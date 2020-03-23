import React from "react";
import { injectIntl } from "react-intl";
import { makeStyles } from "@material-ui/core";
import ButtonWithLoader from "../Buttons/ButtonWithLoader";

const useStyle = makeStyles(theme => ({
  root: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column"
  },
  title: {
    marginBottom: theme.spacing(2),
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
}));

function LoadError({ intl, title, handleClick }) {
  const classes = useStyle();
  return (
    <div className={classes.root}>
      <div className={classes.title}>
        {title || intl.formatMessage({ id: "ERROR.LOAD.TITLE", default: "Ошибка загрузки данных" })}
      </div>
      <ButtonWithLoader onPress={handleClick || (() => {})}>
        {intl.formatMessage({ id: "ERROR.BUTTON.REPEAT", default: "Повторить попытку" })}
      </ButtonWithLoader>
    </div>
  );
}

export default injectIntl(LoadError);
