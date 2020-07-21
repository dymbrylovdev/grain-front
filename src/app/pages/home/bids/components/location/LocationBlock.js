import React from "react";
import { injectIntl } from "react-intl";
import { makeStyles } from "@material-ui/styles";
import { Button } from "@material-ui/core";

const innerStyles = makeStyles(theme => ({
  container: {
    alignItems: "center",
    marginLeft: theme.spacing(2),
  },
  text: {
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  leftButton: {
    marginRight: theme.spacing(2),
  },
}));
function LocationBlock({ intl, handleClickLocation, handleClickPrices, locations }) {
  const innerClasses = innerStyles();
  return (
    <div className={innerClasses.container}>
      <div>
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
        <Button
          variant="contained"
          color="primary"
          onClick={handleClickLocation}
          className={innerClasses.leftButton}
        >
          {intl.formatMessage({ id: "BID.LOCATION.BUTTON" })}
        </Button>
        <Button variant="contained" color="primary" onClick={handleClickPrices}>
          {intl.formatMessage({ id: "BID.PRICES.BUTTON" })}
        </Button>
      </div>
    </div>
  );
}

export default injectIntl(LocationBlock);
