import React, { useState, useEffect, useCallback } from "react";
import { compose } from "redux";
import { connect, ConnectedProps } from "react-redux";
import { FormattedMessage, injectIntl, WrappedComponentProps } from "react-intl";
import {
  TextField,
  Tabs,
  Tab,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import { useSnackbar } from "notistack";

import { actions as authActions } from "../../store/ducks/auth.duck";

import ButtonWithLoader from "../../components/ui/Buttons/ButtonWithLoader";
import { TabPanel, a11yProps } from "../../components/ui/Table/TabPanel";
import NumberFormatForRegister from "../../components/NumberFormatCustom/NumberFormatForRegister";
import { phoneCountryCodes, countries } from "./phoneCountryCodes";
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
}) => {
  const [valueTabs, setValueTabs] = useState(0);
  const [phoneLoginPhase, setPhoneLoginPhase] = useState(0);
  const [countryCode, setCountryCode] = useState(countries[0].code);
  const [countryName, setCountryName] = useState(phoneCountryCodes[0]);

  const handleTabsChange = (e: any, newValue: number) => {
    setValueTabs(newValue);
  };

  const sendCodeSetPhase = values => {
    sendCodeConfirm({ phone: `${values.phoneCode}${values.phone}` });
    setPhoneLoginPhase(1);
  };

  const handleCountryNameChange = (e: any) => {
    setCountryName(e.target.value);
  }

  const handleCountryCodeChange = (e: any) => {
    const countryName = e.target.value;

    countries.forEach(country => {
      if (country.country === countryName) {
        setCountryCode(country.code);
      }
    });
  };

  let validationSchema = {};

  if (valueTabs === 0) {
    validationSchema = {
      email: Yup.string()
        .email(intl.formatMessage({ id: "AUTH.VALIDATION.INVALID_FIELD" }))
        .required(intl.formatMessage({ id: "PROFILE.VALIDATION.REQUIRED_FIELD" })),
      password: Yup.string().required(intl.formatMessage({ id: "AUTH.VALIDATION.REQUIRED_FIELD" })),
    };
  }
  if (valueTabs === 1) {
    if (phoneLoginPhase === 0) {
      validationSchema = {
        phone: Yup.string().required(intl.formatMessage({ id: "AUTH.VALIDATION.REQUIRED_FIELD" })),
      };
    }
    if (phoneLoginPhase === 1) {
      validationSchema = {
        codeConfirm: Yup.string().required(
          intl.formatMessage({ id: "AUTH.VALIDATION.REQUIRED_FIELD" })
        ),
      };
    }
  }

  const { enqueueSnackbar } = useSnackbar();

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
              phone: "",
              codeConfirm: "",
            }}
            validationSchema={Yup.object().shape(validationSchema)}
            onSubmit={values => {
              if (valueTabs === 0) {
                login({ login: values.email, password: values.password });
              }
              if (valueTabs === 1) {
                !phoneLoginPhase
                  ? sendCodeSetPhase(values)
                  : loginByPhone({
                      phone: `${countryCode}${values.phone}`,
                      code: values.codeConfirm,
                    });
              }
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
              resetForm
            }) => (
              <form
                noValidate={true}
                autoComplete="off"
                className="kt-form"
                onSubmit={handleSubmit}
              >
                <Tabs
                  value={valueTabs}
                  onChange={handleTabsChange}
                  variant="scrollable"
                  indicatorColor="primary"
                  textColor="primary"
                  aria-label="tabs"
                >
                  <Tab label="По email" {...a11yProps(0)} />
                  <Tab label="По телефону" {...a11yProps(1)} />
                </Tabs>

                <TabPanel value={valueTabs} index={0}>
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
                    <div>
                      <ButtonWithLoader
                        onPress={handleSubmit}
                        disabled={
                          fetchLoading || loginLoading || loginByPhoneLoading || sendCodeLoading
                        }
                        loading={fetchLoading || loginLoading}
                      >
                        <FormattedMessage id="AUTH.LOGIN.BUTTON" />
                      </ButtonWithLoader>
                      <div style={{ marginTop: 16 }}>
                        <Link to="/auth/forgot-password" className="kt-link kt-login__link-forgot">
                          <FormattedMessage id="AUTH.GENERAL.FORGOT_BUTTON" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </TabPanel>

                <TabPanel value={valueTabs} index={1}>
                  <div className="form-group">
                    {phoneLoginPhase === 0 && (
                      <>
                        <TextField
                          select
                          type="country"
                          label={intl.formatMessage({
                            id: "AUTH.INPUT.COUNTRIES",
                          })}
                          margin="normal"
                          className="kt-width-full"
                          name="country"
                          onBlur={handleBlur}
                          //@ts-ignore
                          onChange={(e) => {
                            handleCountryNameChange(e);
                            handleCountryCodeChange(e);
                          }}
                          value={countryName}
                        >
                          {countries.map(item => (
                            <MenuItem key={item.id} value={item.country}>
                              {item.country}
                            </MenuItem>
                          ))}
                        </TextField>

                        <TextField
                          type="phone"
                          label={intl.formatMessage({
                            id: "AUTH.INPUT.PHONE",
                          })}
                          margin="normal"
                          className="kt-width-full"
                          name="phone"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.phone}
                          helperText={touched.phone && errors.phone}
                          error={Boolean(touched.phone && errors.phone)}
                          placeholder={`+${countryCode}`}
                          // InputProps={{
                          //   inputComponent: NumberFormatForRegister as any,
                          // }}
                        />

                        <div className="kt-login__actions">
                          <ButtonWithLoader
                            onPress={handleSubmit}
                            disabled={
                              fetchLoading || loginLoading || loginByPhoneLoading || sendCodeLoading
                            }
                            loading={fetchLoading || loginLoading}
                          >
                            <FormattedMessage id="AUTH.LOGIN.PHONE" />
                          </ButtonWithLoader>
                        </div>
                      </>
                    )}

                    {phoneLoginPhase === 1 && (
                      <>
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

                        <div style={{ display: "flex", justifyContent: "flex-start" }}>
                          <div className="kt-login__actions" style={{ marginRight: 30 }}>
                            <ButtonWithLoader
                              onPress={() => setPhoneLoginPhase(0)}
                              disabled={fetchLoading || loginLoading}
                              loading={fetchLoading || loginLoading}
                            >
                              <FormattedMessage id="AUTH.GENERAL.BACK_BUTTON" />
                            </ButtonWithLoader>
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
                      </>
                    )}
                  </div>
                </TabPanel>
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

    loginByPhoneLoading: state.auth.loginByPhoneLoading,
    loginByPhoneSuccess: state.auth.loginByPhoneSuccess,
    loginByPhoneError: state.auth.loginByPhoneError,

    sendCodeLoading: state.auth.sendCodeConfirmLoading,
    sendCodeSuccess: state.auth.sendCodeConfirmSuccess,
    sendCodeError: state.auth.sendCodeConfirmError,
  }),
  {
    fetch: authActions.fetchRequest,
    login: authActions.loginRequest,
    clearLogin: authActions.clearLogin,

    loginByPhone: authActions.loginByPhoneRequest,
    clearLoginByPhone: authActions.clearLoginByPhone,

    sendCodeConfirm: authActions.sendCodeRequest,
    clearSendCode: authActions.clearSendCode,
  }
);

type TPropsFromRedux = ConnectedProps<typeof connector>;

export default compose(connector, injectIntl)(Login);
