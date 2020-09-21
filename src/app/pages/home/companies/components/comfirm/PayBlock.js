import React from "react";
import { injectIntl } from "react-intl";
import StatusAlert from "../../../../../components/ui/Messages/StatusAlert";
import { makeStyles } from "@material-ui/styles";
import clsx from "clsx";
import ReportProblemIcon from "@material-ui/icons/ReportProblem";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";

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
        {`${!!company?.email || !!company?.email2 ? "2. " : ""}${intl.formatMessage({
          id: "COMPANY.CONFIRM.PAY.TITLE",
        })}`}
      </h4>
      {user.company_confirmed_by_payment ? (
        <StatusAlert
          status={{
            success: true,
            message: intl.formatMessage({ id: "COMPANY.CONFIRM.SUCCESS" }),
          }}
        />
      ) : (
        <>
          <div>
            {intl.formatMessage({ id: "COMPANY.CONFIRM.PAY.TEXT1" })}
            <b>{intl.formatMessage({ id: "COMPANY.CONFIRM.PAY.TEXT1_1" })}</b>
          </div>
          <br />
          <div>{intl.formatMessage({ id: "COMPANY.CONFIRM.PAY.TEXT2" })}</div>
          <div>
            {intl.formatMessage(
              { id: "COMPANY.CONFIRM.PAY.TEXT2_1" },
              {
                okk: <CheckCircleOutlineIcon color="secondary" />,
              }
            )}
          </div>
          <div>
            {intl.formatMessage(
              { id: "COMPANY.CONFIRM.PAY.TEXT2_2" },
              {
                err: <ReportProblemIcon color="error" />,
              }
            )}
          </div>
          <div>{intl.formatMessage({ id: "COMPANY.CONFIRM.PAY.TEXT3" })}</div>
          <br />
          <div>
            <b>{intl.formatMessage({ id: "COMPANY.CONFIRM.PAY.TEXT4" })}</b>
          </div>
          <br />
          <div>{intl.formatMessage({ id: "COMPANY.CONFIRM.PAY.TEXT5" })}</div>
          <div>{intl.formatMessage({ id: "COMPANY.CONFIRM.PAY.TEXT6" })}</div>
          <br />
          <div>
            <b>{intl.formatMessage({ id: "COMPANY.CONFIRM.PAY.TEXT7" })}</b>
          </div>
          <div>{intl.formatMessage({ id: "COMPANY.CONFIRM.PAY.TEXT8" })}</div>
          <br />
          <div>{intl.formatMessage({ id: "COMPANY.CONFIRM.PAY.TEXT9" })}</div>
          <div>{intl.formatMessage({ id: "COMPANY.CONFIRM.PAY.TEXT10" })}</div>
          <div>{intl.formatMessage({ id: "COMPANY.CONFIRM.PAY.TEXT11" })}</div>
          <div>{intl.formatMessage({ id: "COMPANY.CONFIRM.PAY.TEXT12" })}</div>
          <div>{intl.formatMessage({ id: "COMPANY.CONFIRM.PAY.TEXT13" })}</div>
          <div>{intl.formatMessage({ id: "COMPANY.CONFIRM.PAY.TEXT14" })}</div>
          <div>{intl.formatMessage({ id: "COMPANY.CONFIRM.PAY.TEXT15" })}</div>
          <div>{intl.formatMessage({ id: "COMPANY.CONFIRM.PAY.TEXT16" })}</div>
          <br />
          <div>{intl.formatMessage({ id: "COMPANY.CONFIRM.PAY.TEXT17" })}</div>
          <div>{intl.formatMessage({ id: "COMPANY.CONFIRM.PAY.TEXT18" })}</div>
          <br />
        </>
      )}
    </div>
  );
}

export default injectIntl(PhoneBlock);
