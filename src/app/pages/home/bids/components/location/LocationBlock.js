import React from "react";
import { injectIntl } from "react-intl";
import { makeStyles } from "@material-ui/styles";
import ButtonWithLoader from "../../../../../components/ui/Buttons/ButtonWithLoader";

const innerStyles = makeStyles(theme => ({
  container: {
    alignItems: "center",
    marginLeft: theme.spacing(2),
  },
  text: {
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));
function LocationBlock({ intl, handleClick, locations }) {
  const innerClasses = innerStyles();
  return (
    <div className={innerClasses.container}>
      <div>
        <div className={innerClasses.text}>{intl.formatMessage({ id: "BID.BOTTOM.TEXT" })}</div>
        <div className={innerClasses.text}>
          {locations.length ? (
            <div>
              <div>{intl.formatMessage({ id: "BID.LOCATION.TEXT" })}</div>
              {locations.map(item => (
                <div key={item.id}>&bull; {item.name}</div>
              ))}
            </div>
          ) : (
            <div>{intl.formatMessage({ id: "BID.LOCATION.NO_TEXT" })}</div>
          )}
        </div>
      </div>
      <div>
        <ButtonWithLoader onPress={handleClick}>
          {intl.formatMessage({ id: "BID.LOCATION.BUTTON" })}
        </ButtonWithLoader>
      </div>
    </div>
  );
}

export default injectIntl(LocationBlock);
