import React, { useEffect } from "react";
import { compose } from "redux";
import { connect, ConnectedProps } from "react-redux";
import { FormattedMessage, injectIntl, WrappedComponentProps } from "react-intl";
import { TextField } from "@material-ui/core";
import { Link } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import { useSnackbar } from "notistack";

import { actions as authActions } from "../../store/ducks/auth.duck";

import ButtonWithLoader from "../../components/ui/Buttons/ButtonWithLoader";
import { IAppState } from "../../store/rootDuck";

const Login: React.FC<TPropsFromRedux & WrappedComponentProps> = ({
  intl,
  fetch,
  fetchLoading,
  fetchError,
  clearLogin,
  login,
  loginLoading,
  loginSuccess,
  loginError,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    if (fetchError) {
      enqueueSnackbar(fetchError, {
        variant: "error",
      });
    }
    if (loginError) {
      enqueueSnackbar(loginError, {
        variant: "error",
      });
      clearLogin();
    }
  }, [clearLogin, enqueueSnackbar, fetchError, loginError]);

  useEffect(() => {
    if (loginSuccess) {
      fetch();
      clearLogin();
    }
  }, [clearLogin, fetch, loginSuccess]);

  return (
    <>
      <div className="kt-login__head">
        <span className="kt-login__signup-label">
          {intl.formatMessage({ id: "AUTH.GENERAL.NO_ACCOUNT" })}
        </span>
        &nbsp;&nbsp;
        <Link to="/auth/registration" className="kt-link kt-login__signup-link">
          {intl.formatMessage({ id: "AUTH.GENERAL.SIGNUP_BUTTON" })}
        </Link>
      </div>

      <div className="kt-login__body">
        <div className="kt-login__form">
          <div className="kt-login__title">
            <h3>{intl.formatMessage({ id: "AUTH.LOGIN.TITLE" })}</h3>
          </div>

          <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            validationSchema={Yup.object().shape({
              email: Yup.string()
                .email(intl.formatMessage({ id: "AUTH.VALIDATION.INVALID_FIELD" }))
                .required(intl.formatMessage({ id: "PROFILE.VALIDATION.REQUIRED_FIELD" })),
              password: Yup.string().required(
                intl.formatMessage({ id: "AUTH.VALIDATION.REQUIRED_FIELD" })
              ),
            })}
            onSubmit={values => {
              login({ login: values.email, password: values.password });
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
              <form
                noValidate={true}
                autoComplete="off"
                className="kt-form"
                onSubmit={handleSubmit}
              >
                <div className="form-group">
                  <TextField
                    type="email"
                    label={intl.formatMessage({
                      id: "AUTH.INPUT.EMAIL",
                    })}
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

                <div className="form-group">
                  <TextField
                    type="password"
                    margin="normal"
                    label={intl.formatMessage({
                      id: "AUTH.INPUT.PASSWORD",
                    })}
                    className="kt-width-full"
                    name="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.password}
                    helperText={touched.password && errors.password}
                    error={Boolean(touched.password && errors.password)}
                  />
                </div>

                <div className="kt-login__actions">
                  <Link to="/auth/forgot-password" className="kt-link kt-login__link-forgot">
                    <FormattedMessage id="AUTH.GENERAL.FORGOT_BUTTON" />
                  </Link>
                  <ButtonWithLoader
                    onPress={handleSubmit}
                    disabled={fetchLoading || loginLoading}
                    loading={fetchLoading || loginLoading}
                  >
                    <FormattedMessage id="AUTH.LOGIN.BUTTON" />
                  </ButtonWithLoader>
                </div>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};

const connector = connect(
  (state: IAppState) => ({
    fetchLoading: state.auth.loading,
    fetchError: state.auth.error,
    loginLoading: state.auth.loginLoading,
    loginSuccess: state.auth.loginSuccess,
    loginError: state.auth.loginError,
  }),
  {
    fetch: authActions.fetchRequest,
    login: authActions.loginRequest,
    clearLogin: authActions.clearLogin,
  }
);

type TPropsFromRedux = ConnectedProps<typeof connector>;

export default compose(connector, injectIntl)(Login);
