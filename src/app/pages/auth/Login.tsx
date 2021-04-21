import React, { useCallback, useEffect } from "react";
import { compose } from "redux";
import { connect, ConnectedProps } from "react-redux";
import { FormattedMessage, injectIntl, WrappedComponentProps } from "react-intl";
import { TextField } from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSnackbar } from "notistack";

import { actions as authActions } from "../../store/ducks/auth.duck";

import ButtonWithLoader from "../../components/ui/Buttons/ButtonWithLoader";
import { IAppState } from "../../store/rootDuck";
import Preloader from "../../components/ui/Loaders/Preloader";

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

  clearLoginByPhone,
  loginByPhone,
  loginByPhoneLoading,
  loginByPhoneSuccess,
  loginByPhoneError,

  clearSendCode,
  sendCodeConfirm,
  sendCodeLoading,
  sendCodeSuccess,
  sendCodeError,

  clearFindInSystem,
  findInSystemSuccess,

  authData,
}) => {
  const history = useHistory();

  let validationSchema = {};

  if (authData && authData.type === "email") {
    validationSchema = {
      password: Yup.string().required(intl.formatMessage({ id: "AUTH.VALIDATION.REQUIRED_FIELD" })),
    };
  }
  if (authData && authData.type === "phone") {
    validationSchema = {
      codeConfirm: Yup.string().required(
        intl.formatMessage({ id: "AUTH.VALIDATION.REQUIRED_FIELD" })
      ),
    };
  }

  const backHandler = useCallback(() => {
    clearFindInSystem();

    history.push("/auth");
  }, [clearFindInSystem, history]);

  const { values, errors, touched, resetForm, handleChange, handleBlur, handleSubmit } = useFormik({
    enableReinitialize: true,
    initialValues: {
      password: "",
      codeConfirm: "",
    },
    onSubmit: values => {
      if (authData && authData.type === "email") {
        login({ login: authData?.value || "", password: values.password });
      }
      if (authData && authData.type === "phone") {
        loginByPhone({
          phone: authData?.value || "",
          code: values.codeConfirm,
        });
      }
    },
    validationSchema: Yup.object().shape(validationSchema),
  });

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (!findInSystemSuccess) {
      history.push("/auth");
    } else if (authData && authData.type === "phone") {
      sendCodeConfirm({ phone: authData.value });
    }

    return () => {
      clearFindInSystem();
      clearSendCode();
    };
  }, []);

  useEffect(() => {
    if (sendCodeSuccess || sendCodeError) {
      enqueueSnackbar(
        sendCodeSuccess
          ? intl.formatMessage({ id: "AUTH.VALIDATION.CODE.CONFIRM" })
          : sendCodeError,
        {
          variant: sendCodeSuccess ? "success" : "error",
        }
      );
      clearSendCode();
    }
  }, [enqueueSnackbar, sendCodeSuccess, sendCodeError, clearSendCode]);

  useEffect(() => {
    if (loginByPhoneError) {
      enqueueSnackbar(intl.formatMessage({ id: "AUTH.VALIDATION.INVALID.CODE" }), {
        variant: "error",
      });
      clearLoginByPhone();
    }
  }, [enqueueSnackbar, loginByPhoneError]);

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
    if (loginSuccess || loginByPhoneSuccess) {
      fetch();
      clearLogin();
      clearLoginByPhone();
    }
  }, [clearLoginByPhone, clearLogin, fetch, loginSuccess, loginByPhoneSuccess]);

  if (sendCodeLoading) return <Preloader />;

  return (
    <>
      <div className="kt-login__body">
        <div className="kt-login__form">
          <div className="kt-login__title">
            <h3>{intl.formatMessage({ id: "AUTH.LOGIN.TITLE" })}</h3>
          </div>

          <form noValidate={true} autoComplete="off" className="kt-form" onSubmit={handleSubmit}>
            {authData && authData.type === "email" && (
              <>
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

                <div
                  style={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}
                >
                  <div className="kt-login__actions" style={{ marginRight: 30 }}>
                    <button
                      onClick={backHandler}
                      type="button"
                      className="btn btn-secondary btn-elevate kt-login__btn-secondary"
                    >
                      {intl.formatMessage({ id: "AUTH.GENERAL.BACK_BUTTON" })}
                    </button>
                  </div>

                  <div className="kt-login__actions">
                    <ButtonWithLoader
                      onPress={handleSubmit}
                      disabled={fetchLoading || loginLoading}
                      loading={fetchLoading || loginLoading}
                    >
                      <FormattedMessage id="AUTH.LOGIN.BUTTON" />
                    </ButtonWithLoader>
                  </div>
                </div>

                <Link to="/auth/forgot-password" className="kt-link kt-login__link-forgot">
                  <FormattedMessage id="AUTH.GENERAL.FORGOT_BUTTON" />
                </Link>
              </>
            )}

            {authData && authData.type === "phone" && (
              <>
                <div className="form-group">
                  <TextField
                    type="text"
                    label={intl.formatMessage({
                      id: "AUTH.INPUT.CODE",
                    })}
                    margin="normal"
                    className="kt-width-full"
                    name="codeConfirm"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.codeConfirm}
                    helperText={touched.codeConfirm && errors.codeConfirm}
                    error={Boolean(touched.codeConfirm && errors.codeConfirm)}
                  />
                </div>

                <div
                  className="kt-login__actions"
                  style={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}
                >
                  <button
                    onClick={backHandler}
                    type="button"
                    className="btn btn-secondary btn-elevate kt-login__btn-secondary"
                    style={{ marginRight: 30 }}
                  >
                    {intl.formatMessage({ id: "AUTH.GENERAL.BACK_BUTTON" })}
                  </button>

                  <ButtonWithLoader
                    onPress={handleSubmit}
                    disabled={fetchLoading || loginLoading || loginByPhoneLoading}
                    loading={fetchLoading || loginLoading || loginByPhoneLoading}
                  >
                    <FormattedMessage id="AUTH.LOGIN.BUTTON" />
                  </ButtonWithLoader>
                </div>
              </>
            )}
          </form>
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

    loginByPhoneLoading: state.auth.loginByPhoneLoading,
    loginByPhoneSuccess: state.auth.loginByPhoneSuccess,
    loginByPhoneError: state.auth.loginByPhoneError,

    sendCodeLoading: state.auth.sendCodeConfirmLoading,
    sendCodeSuccess: state.auth.sendCodeConfirmSuccess,
    sendCodeError: state.auth.sendCodeConfirmError,

    findInSystemLoading: state.auth.findInSystemLoading,
    findInSystemSuccess: state.auth.findInSystemSuccess,
    findInSystemError: state.auth.findInSystemError,

    authData: state.auth.authData,
  }),
  {
    fetch: authActions.fetchRequest,
    login: authActions.loginRequest,
    clearLogin: authActions.clearLogin,

    loginByPhone: authActions.loginByPhoneRequest,
    clearLoginByPhone: authActions.clearLoginByPhone,

    sendCodeConfirm: authActions.sendCodeRequest,
    clearSendCode: authActions.clearSendCode,

    findInSystem: authActions.findInSystemRequest,
    clearFindInSystem: authActions.clearFindInSystem,
  }
);

type TPropsFromRedux = ConnectedProps<typeof connector>;

export default compose(connector, injectIntl)(Login);
