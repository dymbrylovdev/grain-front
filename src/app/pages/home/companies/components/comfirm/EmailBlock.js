import React, { useCallback, useState } from "react";
import { injectIntl } from "react-intl";
import { Formik } from "formik";
import * as Yup from "yup";
import { connect } from "react-redux";
import { TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import clsx from "clsx";

import * as companyDuck from "../../../../../store/ducks/companies.duck";
import ButtonWithLoader from "../../../../../components/ui/Buttons/ButtonWithLoader";
import StatusAlert from "../../../../../components/ui/Messages/StatusAlert";

const innerStyles = makeStyles(theme => ({
  title: {
    paddingBottom: theme.spacing(1),
  },
}));

function EmailBlock({ intl, company = {}, sentConfirmCode, confirmByEmail, user = {}, classes }) {
  const innerClasses = innerStyles();
  const [isCodeSent, setCodeSent] = useState(false);
  const [sentStatus, setSentStatus] = useState({});
  const [isSuccess, setSuccess] = useState(user.company_confirmed_by_email);

  const sentCodeAction = useCallback((userId, companyId) => {
    setSentStatus({
      loading: true,
    });
    const params = { userId, companyId };
    const successCallback = () => {
      setSentStatus({
        loading: false,
      });
      setCodeSent(true);
    };
    const failCallback = error => {
      setSentStatus({
        loading: false,
        error: true,
        message: error || intl.formatMessage({ id: "COMPANY.CONFIRM.ERROR.SENT" }),
      });
    };
    sentConfirmCode(params, successCallback, failCallback);
  }, []);

  return (
    <Formik
      initialValues={{ code: "" }}
      validationSchema={Yup.object().shape({
        code: Yup.string().required(
          intl.formatMessage({ id: "PROFILE.VALIDATION.REQUIRED_FIELD" })
        ),
      })}
      onSubmit={(values, { setStatus, setSubmitting, resetForm }) => {
        const code = values.code;
        const successCallback = () => {
          setSuccess(true);
          setStatus({
            loading: false,
          });
        };
        const failCallback = error => {
          setStatus({
            loading: false,
            error: true,
            message: error || intl.formatMessage({ id: "COMPANY.CONFIRM.ERROR.SENT" }),
          });
        };
        setStatus({
          loading: true,
        });
        confirmByEmail(code, successCallback, failCallback);
      }}
    >
      {({
        values,
        status,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
      }) => (
        <div className={classes.form}>
          <h4 className={clsx("kt-portlet__head-title ", innerClasses.title)}>
            {intl.formatMessage({ id: "COMPANY.CONFIRM.EMAIL.TITLE" })}
          </h4>
          {isSuccess ? (
            <StatusAlert
              status={{
                success: true,
                message: intl.formatMessage({ id: "COMPANY.CONFIRM.SUCCESS" }),
              }}
            />
          ) : company.email || company.email2 ? (
            <div>
              {intl.formatMessage(
                {
                  id: "COMPANY.CONFIRM.EMAIL.TEXT",
                },
                { name: company.short_name }
              )}
              <ul>
                {company.email && <li>{company.email}</li>}
                {company.email2 && <li>{company.email2}</li>}
              </ul>
              {!isCodeSent && <StatusAlert status={sentStatus} />}
              {intl.formatMessage({ id: "COMPANY.CONFIRM.EMAIL.TEXT.SENT" })}
              <div className={classes.buttonContainer}>
                <ButtonWithLoader
                  onPress={() => sentCodeAction(user.id, company.id)}
                  loading={sentStatus && sentStatus.loading}
                  disabled={sentStatus && sentStatus.loading}
                >
                  {intl.formatMessage({ id: "COMPANY.CONFIRM.BUTTON.SENT_CODE" })}
                </ButtonWithLoader>
              </div>
              {isCodeSent && (
                <>
                  <TextField
                    label={intl.formatMessage({
                      id: "COMPANY.CONFIRM.INPUT.CODE",
                    })}
                    margin="normal"
                    className={classes.textField}
                    name="code"
                    value={values.code || ""}
                    variant="outlined"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    helperText={touched.code && errors.code}
                    error={Boolean(touched.code && errors.code)}
                  />
                  <StatusAlert status={status} />
                  <div className={classes.buttonContainer}>
                    <ButtonWithLoader
                      onPress={handleSubmit}
                      loading={status && status.loading}
                      disabled={status && status.loading}
                    >
                      {intl.formatMessage({ id: "COMPANY.CONFIRM.BUTTON.SENT" })}
                    </ButtonWithLoader>
                  </div>
                </>
              )}
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
      )}
    </Formik>
  );
}

export default injectIntl(connect(null, companyDuck.actions)(EmailBlock));
