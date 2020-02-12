import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { injectIntl, FormattedMessage } from "react-intl";

import { RichEditor } from "../../../components";
import ButtonWithLoader from "../../../components/ui/Buttons/ButtonWithLoader";

const useStyles = makeStyles(theme => ({
  buttonContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: theme.spacing(3),
  },
}));

function UserDocPage() {
  const classes = useStyles();

  return (
    <>
      <RichEditor placeholder="" />

      <div className={classes.buttonContainer}>
        <ButtonWithLoader>
          <FormattedMessage id="USERDOC.BUTTON.SAVE" />
        </ButtonWithLoader>
      </div>
    </>
  );
}

export default injectIntl(UserDocPage);
