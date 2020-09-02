import React from "react";
import { injectIntl } from "react-intl";
import { Checkbox, FormControlLabel } from "@material-ui/core";
import useStyles from "../../styles";
import { Skeleton } from "@material-ui/lab";
import { getConfirmCompanyString } from "../../../../utils/utils";

function CompanyConfirmBlock({ intl, values, handleChange, disabled, loading, user }) {
  const classes = useStyles();
  // const getTitleText = useCallback(
  //   (disabled, values) => {
  //     if (!disabled) return `${intl.formatMessage({ id: "COMPANY.CONFIRM.TITLE" })}`;
  //     if (
  //       !values.company_confirmed_by_email &&
  //       !values.company_confirmed_by_phone &&
  //       !values.company_confirmed_by_payment
  //     ) {
  //       return `${intl.formatMessage({ id: "COMPANY.CONFIRM.NO_CONFIRM" })}`;
  //     }
  //     return `${intl.formatMessage({ id: "COMPANY.CONFIRM.TITLE" })}${
  //       values.company_confirmed_by_email
  //         ? ` [${intl.formatMessage({ id: "COMPANY.CONFIRM.BY_EMAIL" })}]`
  //         : ""
  //     }${
  //       values.company_confirmed_by_phone
  //         ? ` [${intl.formatMessage({ id: "COMPANY.CONFIRM.BY_PHONE" })}]`
  //         : ""
  //     }${
  //       values.company_confirmed_by_payment
  //         ? ` [${intl.formatMessage({ id: "COMPANY.CONFIRM.BY_PAY" })}]`
  //         : ""
  //     }`;
  //   },
  //   [intl]
  // );

  return (
    <>
      <div className={classes.text}>
        {loading ? (
          <Skeleton width="50%" height={24} animation="wave" />
        ) : (
          // getTitleText(disabled, values)
          getConfirmCompanyString(user, intl)
        )}
      </div>
      {!disabled && (
        <>
          <div className={classes.text}>
            {loading ? (
              <Skeleton width={95} height={24} animation="wave" />
            ) : (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={values.company_confirmed_by_email}
                    onChange={e => {
                      handleChange({
                        data: { company_confirmed_by_email: e.target.checked },
                      });
                    }}
                    disabled={disabled}
                  />
                }
                label={intl.formatMessage({ id: "COMPANY.CONFIRM.BY_EMAIL" })}
                name={"company_confirmed_by_email"}
              />
            )}
          </div>
          {/* <div className={classes.text}>
            {loading ? (
              <Skeleton width={123} height={24} animation="wave" />
            ) : (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={values.company_confirmed_by_phone}
                    onChange={e => {
                      handleChange({
                        data: { company_confirmed_by_phone: e.target.checked },
                      });
                    }}
                    disabled={disabled}
                  />
                }
                label={intl.formatMessage({ id: "COMPANY.CONFIRM.BY_PHONE" })}
                name={"company_confirmed_by_phone"}
              />
            )}
          </div> */}
          <div className={classes.text}>
            {loading ? (
              <Skeleton width={97} height={24} animation="wave" />
            ) : (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={values.company_confirmed_by_payment}
                    onChange={e => {
                      handleChange({
                        data: { company_confirmed_by_payment: e.target.checked },
                      });
                    }}
                    disabled={disabled}
                  />
                }
                label={intl.formatMessage({ id: "COMPANY.CONFIRM.BY_PAY" })}
                name={"company_confirmed_by_payment"}
              />
            )}
          </div>
        </>
      )}
    </>
  );
}

export default injectIntl(CompanyConfirmBlock);
