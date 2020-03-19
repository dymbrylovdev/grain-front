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
        {intl.formatMessage({ id: "COMPANY.CONFIRM.PHONE.TITLE" })}
      </h4>
      {user.company_confirmed_by_phone ? (
        <StatusAlert
          status={{
            success: true,
            message: intl.formatMessage({ id: "COMPANY.CONFIRM.SUCCESS" }),
          }}
        />
      ) : company.mobile_phone || company.telephone ? (
        <div>
          {intl.formatMessage(
            {
              id: "COMPANY.CONFIRM.PHONE.TEXT",
            },
            { name: company.short_name }
          )}
          <ul>
            {company.mobile_phone && <li>{company.mobile_phone}</li>}
            {company.telephone && <li>{company.telephone}</li>}
          </ul>
        </div>
      ) : (
        <div>
          {intl.formatMessage(
            { id: "COMPANY.CONFIRM.EMAIL.NO_TEXT" },
            { name: company.short_name }
          )}
        </div>
      )}
    </div>
  );
}

export default injectIntl(PhoneBlock);
