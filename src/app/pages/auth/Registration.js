import React, { useState, useEffect, useCallback } from "react";
import { Formik } from "formik";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import { FormattedMessage, injectIntl } from "react-intl";
import {
  Checkbox,
  FormControlLabel,
  TextField,
  RadioGroup,
  Radio,
  FormLabel,
} from "@material-ui/core";

import * as Yup from "yup";
import * as auth from "../../store/ducks/auth.duck";
import StatusAlert from "../../components/ui/Messages/StatusAlert";
import ButtonWithLoader from "../../components/ui/Buttons/ButtonWithLoader";
import TermDialog from "./components/TermDialog";
import useFetch from "../../hooks/useFetch";

function Registration({ intl, register }) {
  const [isRedirect, setRedirect] = useState(false);
  const [isAgreementOpen, setOpenUserAgreement] = useState(false);
  const [{ response }, requestUserAgreement] = useFetch("api/_public/document/user_agreement");

  useEffect(() => {
    requestUserAgreement();
  }, [requestUserAgreement]);

  const closeUserAgreement = useCallback(() => {
    setOpenUserAgreement(false);
  }, []);

  if (isRedirect) return <Redirect to="/auth/email-sent/registration" />;

  return (
    <>
      <TermDialog isOpen={isAgreementOpen} response={response} handleClose={closeUserAgreement} />
      <div className="kt-login__body">
        <div className="kt-login__form">
          <div className="kt-login__title">
            <h3>
              <FormattedMessage id="AUTH.REGISTER.TITLE" />
            </h3>
          </div>

          <Formik
            initialValues={{
              email: "",
              login: "",
              role: "ROLE_BUYER",
              acceptTerms: true,
            }}
            validationSchema={Yup.object().shape({
              email: Yup.string()
                .email(intl.formatMessage({ id: "AUTH.VALIDATION.INVALID_FIELD" }))
                .required(intl.formatMessage({ id: "PROFILE.VALIDATION.REQUIRED_FIELD" })),
              login: Yup.string().required(
                intl.formatMessage({ id: "PROFILE.VALIDATION.REQUIRED_FIELD" })
              ),
            })}
            onSubmit={(values, { setStatus, setSubmitting }) => {
              setStatus({
                loading: true,
              });
              const roles = [values.role];
              const params = values;
              params.roles = roles;
              console.log("---register params", params);
              const successCallback = () => {
                setRedirect(true);
              };
              const failCallback = e => {
                setStatus({
                  loading: false,
                  message:
                    e ||
                    intl.formatMessage({ id: "AUTH.VALIDATION.NOT_FOUND" }, { name: values.email }),
                  error: true,
                });
                setSubmitting(false);
              };
              register(params, successCallback, failCallback);
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
              <form onSubmit={handleSubmit} noValidate autoComplete="off">
                <StatusAlert status={status} />

                <RadioGroup name="role" value={values.role} onChange={handleChange}>
                  <FormLabel component="legend">
                    {intl.formatMessage({ id: "AUTH.REGISTER.ROLE_TITLE" })}
                  </FormLabel>
                  <FormControlLabel
                    value="ROLE_BUYER"
                    control={<Radio />}
                    label={intl.formatMessage({
                      id: "AUTH.REGISTER.BUYER",
                    })}
                  />
                  <FormControlLabel
                    value="ROLE_VENDOR"
                    control={<Radio />}
                    label={intl.formatMessage({
                      id: "AUTH.REGISTER.VENDOR",
                    })}
                  />
                </RadioGroup>

                <div className="form-group mb-0">
                  <TextField
                    margin="normal"
                    label={intl.formatMessage({ id: "AUTH.INPUT.LOGIN" })}
                    className="kt-width-full"
                    name="login"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.login}
                    helperText={touched.login && errors.login}
                    error={Boolean(touched.login && errors.login)}
                  />
                </div>

                <div className="form-group mb-0">
                  <TextField
                    label={intl.formatMessage({ id: "AUTH.INPUT.EMAIL" })}
                    margin="normal"
                    className="kt-width-full"
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.email}
                    helperText={touched.email && errors.email}
                    error={Boolean(touched.email && errors.email)}
                  />
                </div>

                <div className="form-group mb-0">
                  <FormControlLabel
                    label={
                      <>
                        {intl.formatMessage({ id: "AUTH.REGISTER.AGREE_TERM" })}{" "}
                        <Link className="kt-link" onClick={() => setOpenUserAgreement(true)}>
                          {intl.formatMessage({ id: "AUTH.GENERAL.LEGAL" })}
                        </Link>
                      </>
                    }
                    control={
                      <Checkbox
                        color="primary"
                        name="acceptTerms"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        checked={values.acceptTerms}
                      />
                    }
                  />
                </div>

                <div className="kt-login__actions">
                  <Link to="/auth">
                    <button
                      type="button"
                      className="btn btn-secondary btn-elevate kt-login__btn-secondary"
                    >
                      {intl.formatMessage({ id: "AUTH.GENERAL.BACK_BUTTON" })}
                    </button>
                  </Link>

                  <ButtonWithLoader
                    disabled={isSubmitting || !values.acceptTerms}
                    onPress={handleSubmit}
                    loading={status && status.loading}
                  >
                    {intl.formatMessage({ id: "AUTH.BUTTON.REGISTER" })}
                  </ButtonWithLoader>
                </div>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
}

export default injectIntl(connect(null, auth.actions)(Registration));
