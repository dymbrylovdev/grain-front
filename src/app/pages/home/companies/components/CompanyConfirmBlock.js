import React, { useCallback } from "react";
import { injectIntl } from "react-intl";
import { Checkbox, FormControlLabel } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { Row, Col } from "react-bootstrap";

const innerStyles = makeStyles(theme => ({
  container: {
    paddingBottom: theme.spacing(1),
  },
  title: {
      fontSize: 14,
      paddingBottom: theme.spacing(1),
  }
}));

function CompanyConfirmBlock({ intl, values, handleChange, disabled }) {
  const innerClasses = innerStyles();
  const getTitleText = useCallback(
    (disabled, values) => {
      if (!disabled) return `${intl.formatMessage({ id: "COMPANY.CONFIRM.TITLE" })}`;
      if (
        !values.company_confirmed_by_email &&
        !values.company_confirmed_by_phone &&
        !values.company_confirmed_by_payment
      ) {
        return `${intl.formatMessage({ id: "COMPANY.CONFIRM.NO_CONFIRM" })}`;
      }
      return `${intl.formatMessage({ id: "COMPANY.CONFIRM.TITLE" })}${
        values.company_confirmed_by_email
          ? ` [${intl.formatMessage({ id: "COMPANY.CONFIRM.BY_EMAIL" })}]`
          : ""
      }${
        values.company_confirmed_by_phone
          ? ` [${intl.formatMessage({ id: "COMPANY.CONFIRM.BY_PHONE" })}]`
          : ""
      }${
        values.company_confirmed_by_payment
          ? ` [${intl.formatMessage({ id: "COMPANY.CONFIRM.BY_PAY" })}]`
          : ""
      }`;
    },
    [values, disabled]
  );

  return (
    <Col className={innerClasses.container}>
      <Row className={innerClasses.title}>{getTitleText(disabled, values)}</Row>
      {!disabled && (
        <>
          <Row>
            <FormControlLabel
              control={
                <Checkbox
                  checked={values.company_confirmed_by_email}
                  onChange={handleChange}
                  disabled={disabled}
                />
              }
              label={intl.formatMessage({ id: "COMPANY.CONFIRM.BY_EMAIL" })}
              name={"company_confirmed_by_email"}
            />
          </Row>
          <Row>
            <FormControlLabel
              control={
                <Checkbox
                  checked={values.company_confirmed_by_phone}
                  onChange={handleChange}
                  disabled={disabled}
                />
              }
              label={intl.formatMessage({ id: "COMPANY.CONFIRM.BY_PHONE" })}
              name={"company_confirmed_by_phone"}
            />
          </Row>
          <Row>
            <FormControlLabel
              control={
                <Checkbox
                  checked={values.company_confirmed_by_payment}
                  onChange={handleChange}
                  disabled={disabled}
                />
              }
              label={intl.formatMessage({ id: "COMPANY.CONFIRM.BY_PAY" })}
              name={"company_confirmed_by_payment"}
            />
          </Row>
        </>
      )}
    </Col>
  );
}

export default injectIntl(CompanyConfirmBlock);
