import React from "react";
import { Icon } from "@material-ui/core";
import { toAbsoluteUrl } from "../../../../_metronic/utils/utils";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  imageIcon: {
    height: 24,
    width: 24,
  },
  iconRoot: {
    textAlign: "center",
  },
});

function CustomIcon({ path }) {
  const classes = useStyles();
  return (
      <img className={classes.imageIcon} src={toAbsoluteUrl(path)} />
  );
}

export default CustomIcon;