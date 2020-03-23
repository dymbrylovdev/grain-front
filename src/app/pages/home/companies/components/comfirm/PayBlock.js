import React from "react";
import { injectIntl } from "react-intl";
import StatusAlert from "../../../../../components/ui/Messages/StatusAlert";
import { makeStyles } from "@material-ui/styles";
import clsx from "clsx";

const innerStyles = makeStyles(theme => ({
  title: {
    paddingBottom: theme.spacing(1),
  },
}));

function PhoneBlock({ intl, company = {}, user = {}, classes }) {
  const innerClasses = innerStyles();
  return (
    <div className={classes.form}>
      <h4 className={clsx("kt-portlet__head-title ", innerClasses.title)}>
        {intl.formatMessage({ id: "COMPANY.CONFIRM.PAY.TITLE" })}
      </h4>
      {user.company_confirmed_by_payment ? (
        <StatusAlert
          status={{
            success: true,
            message: intl.formatMessage({ id: "COMPANY.CONFIRM.SUCCESS" }),
          }}
        />
      ) : (
        <div>
          {intl.formatMessage(
            { id: "COMPANY.CONFIRM.PAY.TEXT" },
            { name: company.short_name }
          )}
        </div>
      )}
    </div>
  );
}

export default injectIntl(PhoneBlock);
