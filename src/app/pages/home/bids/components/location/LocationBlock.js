import React from "react";
import { injectIntl } from "react-intl";
import { Col, Row } from "react-bootstrap";
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
function LocationBlock({ intl, handleClick, location }) {
  const innerClasses = innerStyles();
  return (
    <Row>
      <Col className={innerClasses.container}>
        <Row md="auto">
          <div className={innerClasses.text}>{intl.formatMessage({ id: "BID.BOTTOM.TEXT" })}</div>
          <div className={innerClasses.text}>
            {location
              ? `${intl.formatMessage({ id: "BID.LOCATION.TEXT" })} ${location}`
              : intl.formatMessage({ id: "BID.LOCATION.NO_TEXT" })}
          </div>
        </Row>
        <Row>
          <ButtonWithLoader onPress={handleClick}>
            {intl.formatMessage({ id: "BID.LOCATION.BUTTON" })}
          </ButtonWithLoader>
        </Row>
      </Col>
      <Col />
    </Row>
  );
}

export default injectIntl(LocationBlock);
