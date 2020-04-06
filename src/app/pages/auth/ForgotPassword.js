import React, { useState } from "react";
import { Formik } from "formik";
import { connect } from "react-redux";
import { TextField } from "@material-ui/core";
import { Link, Redirect } from "react-router-dom";
import { FormattedMessage, injectIntl } from "react-intl";
import * as Yup from "yup";

import * as auth from "../../store/ducks/auth.duck";
import StatusAlert from "../../components/ui/Messages/StatusAlert";
import ButtonWithLoader from "../../components/ui/Buttons/ButtonWithLoader";

function ForgotPassword({ intl, passwordRequested }) {
  const [isRedirect, setRedirect] = useState(false);

  if (isRedirect) return <Redirect to="/auth/email-sent/forgot" />;

  return (
    <div className="kt-login__body">
      <div className="kt-login__form">
        <div className="kt-login__title">
          <h3>
            <FormattedMessage id="AUTH.FORGOT.TITLE" />
          </h3>
        </div>

        <Formik
          initialValues={{ email: "" }}
          validationSchema={Yup.object().shape({
            email: Yup.string()
              .email(<FormattedMessage id="AUTH.VALIDATION.INVALID_FIELD" />)
              .required(<FormattedMessage id="PROFILE.VALIDATION.REQUIRED_FIELD" />),
          })}
          onSubmit={(values, { setStatus, setSubmitting }) => {
            setStatus({ loading: true });
            const email = values.email;
            const successCallback = () => {
              setRedirect(true);
            };
            const failCallback = e => {
              setStatus({
                loading: false,
                message:
                  e || intl.formatMessage({ id: "AUTH.VALIDATION.NOT_FOUND" }, { name: email }),
                error: true,
              });
              setSubmitting(false);
            };
            passwordRequested(email, successCallback, failCallback);
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
            <form onSubmit={handleSubmit} className="kt-form">
              <StatusAlert status={status} />

              <div className="form-group">
                <TextField
                  type="email"
                  label="Email"
                  margin="normal"
                  fullWidth={true}
                  name="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  helperText={touched.email && errors.email}
                  error={Boolean(touched.email && errors.email)}
                />
              </div>

              <div className="kt-login__actions">
                <Link to="/auth">
                  <button
                    type="button"
                    className="btn btn-secondary btn-elevate kt-login__btn-secondary"
                  >
                    {intl.formatMessage({ id: "AUTH.BUTTON.BACK" })}
                  </button>
                </Link>

                <ButtonWithLoader
                  disabled={isSubmitting}
                  loading={status && status.loading}
                  onPress={handleSubmit}
                >
                  {intl.formatMessage({ id: "AUTH.BUTTON.RESET" })}
                </ButtonWithLoader>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default injectIntl(connect(null, auth.actions)(ForgotPassword));
