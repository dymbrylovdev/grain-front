import React, { useState, useEffect, useCallback } from "react";
import { Formik } from "formik";
import { connect, ConnectedProps } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { FormattedMessage, injectIntl, WrappedComponentProps } from "react-intl";
import {
  Checkbox,
  FormControlLabel,
  TextField,
  RadioGroup,
  Radio,
  FormLabel,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core";
import * as Yup from "yup";
import { useSnackbar } from "notistack";

import { actions as authActions } from "../../store/ducks/auth.duck";

import ButtonWithLoader from "../../components/ui/Buttons/ButtonWithLoader";
import TermDialog from "./components/TermDialog";
import NumberFormatForRegister from "../../components/NumberFormatCustom/NumberFormatForRegister";
import { phoneCountryCodes, countries } from "./phoneCountryCodes";
import { TabPanel, a11yProps } from "../../components/ui/Table/TabPanel";
import { IAppState } from "../../store/rootDuck";
import { TRole } from "../../interfaces/users";
import { roles } from "../home/users/utils/profileForm";

const Registration: React.FC<TPropsFromRedux & WrappedComponentProps> = ({
  intl,
  fetch,
  fetchLoading,
  fetchError,

  clearReg,
  register,
  regLoading,
  regSuccess,
  regError,

  clearLoginByPhone,
  loginByPhone,
  loginByPhoneLoading,
  loginByPhoneSuccess,
  loginByPhoneError,
}) => {
  const history = useHistory();
  const [isAgreementOpen, setOpenUserAgreement] = useState(false);
  const [phoneRegPhase, setPhoneRegPhase] = useState(0);
  const [valueTabs, setValueTabs] = useState(0);
  const [countryCode, setCountryCode] = useState(countries[0].code);
  const [countryName, setCountryName] = useState(phoneCountryCodes[0]);

  const handleTabsChange = (e: any, newValue: number) => {
    setValueTabs(newValue);
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
    };
  }
  if (valueTabs === 1) {
    if (phoneRegPhase === 0) {
      validationSchema = {
        phone: Yup.string().required(intl.formatMessage({ id: "AUTH.VALIDATION.REQUIRED_FIELD" })),
      };
    }
    if (phoneRegPhase === 1) {
      validationSchema = {
        codeConfirm: Yup.string().required(
          intl.formatMessage({ id: "AUTH.VALIDATION.REQUIRED_FIELD" })
        ),
      };
    }
  }

  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    if (regError) {
      if (valueTabs === 0) {
        enqueueSnackbar(regError, {
          variant: "error",
        });
      }
      if (valueTabs === 1) {
        enqueueSnackbar(regError, {
          variant: "error",
        });
      }
      clearReg();
    }
    if (regSuccess) {
      if (valueTabs === 0) history.push("/auth/email-sent/registration");
      if (valueTabs === 1) {
        enqueueSnackbar(intl.formatMessage({ id: "AUTH.VALIDATION.CODE.CONFIRM" }), {
          variant: "success",
        });

        setPhoneRegPhase(1);
      }
      clearReg();
    }
  }, [clearReg, enqueueSnackbar, history, regError, regSuccess]);

  useEffect(() => {
    if (loginByPhoneSuccess || loginByPhoneError) {
      enqueueSnackbar(loginByPhoneSuccess ? "Пользователь успешно создан" : "Произошла ошибка!", {
        variant: loginByPhoneSuccess ? "success" : "error",
      });
      clearLoginByPhone();
    }
  }, [enqueueSnackbar, loginByPhoneSuccess, loginByPhoneError, clearLoginByPhone, history]);

  useEffect(() => {
    if (fetchError) {
      enqueueSnackbar(fetchError, {
        variant: "error",
      });
    }
  }, [fetchError, enqueueSnackbar]);

  useEffect(() => {
    if (loginByPhoneSuccess) {
      fetch();
      clearLoginByPhone();
    }
  }, [loginByPhoneSuccess, fetch, clearLoginByPhone]);

  return (
    <>
      <TermDialog isOpen={isAgreementOpen} handleClose={() => setOpenUserAgreement(false)} />
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
              phone: "",
              codeConfirm: "",
              login: "",
              role: "ROLE_BUYER",
              acceptTerms: true,
            }}
            validationSchema={Yup.object().shape(validationSchema)}
            onSubmit={values => {
              if (valueTabs === 0) {
                register({
                  email: values.email,
                  roles: [values.role as TRole],
                  login: values.email,
                  crop_ids: [1],
                });
              }
              if (valueTabs === 1) {
                if (phoneRegPhase === 0) {
                  register({
                    phone: `${countryCode}${values.phone}`,
                    roles: [values.role as TRole],
                    crop_ids: [1],
                  });
                }
                if (phoneRegPhase === 1) {
                  loginByPhone({
                    phone: `${countryCode}${values.phone}`,
                    code: values.codeConfirm,
                  });
                }
              }
            }}
          >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
              <form onSubmit={handleSubmit} noValidate autoComplete="off">
                <Tabs
                  value={valueTabs}
                  onChange={handleTabsChange}
                  indicatorColor="primary"
                  textColor="primary"
                  aria-label="tabs"
                  variant="fullWidth"
                  style={{ marginBottom: 20 }}
                >
                  <Tab
                    label={intl.formatMessage({ id: "AUTH.REGISTER.EMAIL" })}
                    {...a11yProps(0)}
                  />
                  <Tab
                    label={intl.formatMessage({ id: "AUTH.REGISTER.PHONE" })}
                    {...a11yProps(1)}
                  />
                </Tabs>

                <RadioGroup name="role" value={values.role} onChange={handleChange}>
                  <FormLabel component="legend">
                    {intl.formatMessage({ id: "AUTH.REGISTER.ROLE_TITLE" })}
                  </FormLabel>
                  <FormControlLabel
                    value="ROLE_BUYER"
                    control={<Radio />}
                    label={roles.find(role => role.id === "ROLE_BUYER")?.value}
                  />
                  <FormControlLabel
                    value="ROLE_VENDOR"
                    control={<Radio />}
                    label={roles.find(role => role.id === "ROLE_VENDOR")?.value}
                  />
                </RadioGroup>

                <TabPanel value={valueTabs} index={0}>
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
                </TabPanel>

                <TabPanel value={valueTabs} index={1}>
                  <div className="form-group mb-0">
                    {phoneRegPhase === 0 ? (
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
                          label={intl.formatMessage({ id: "AUTH.INPUT.PHONE" })}
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
                      </>
                    ) : (
                      <TextField
                        label={intl.formatMessage({ id: "AUTH.INPUT.CODE" })}
                        margin="normal"
                        className="kt-width-full"
                        name="codeConfirm"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.codeConfirm}
                        helperText={touched.codeConfirm && errors.codeConfirm}
                        error={Boolean(touched.codeConfirm && errors.codeConfirm)}
                      />
                    )}
                  </div>
                </TabPanel>

                <div className="form-group mb-0">
                  <FormControlLabel
                    label={
                      <>
                        {intl.formatMessage({ id: "AUTH.REGISTER.AGREE_TERM" })}{" "}
                        <div className="kt-link" onClick={() => setOpenUserAgreement(true)}>
                          {intl.formatMessage({ id: "AUTH.GENERAL.LEGAL" })}
                        </div>
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
                  {phoneRegPhase === 1 ? (
                    <button
                      onClick={() => setPhoneRegPhase(0)}
                      type="button"
                      className="btn btn-secondary btn-elevate kt-login__btn-secondary"
                    >
                      {intl.formatMessage({ id: "AUTH.GENERAL.BACK_BUTTON" })}
                    </button>
                  ) : (
                    <Link to="/auth">
                      <button
                        type="button"
                        className="btn btn-secondary btn-elevate kt-login__btn-secondary"
                      >
                        {intl.formatMessage({ id: "AUTH.GENERAL.BACK_BUTTON" })}
                      </button>
                    </Link>
                  )}

                  <ButtonWithLoader
                    disabled={
                      regLoading || !values.acceptTerms || loginByPhoneLoading || fetchLoading
                    }
                    onPress={handleSubmit}
                    loading={regLoading}
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
};

const connector = connect(
  (state: IAppState) => ({
    fetchLoading: state.auth.loading,
    fetchError: state.auth.error,

    regLoading: state.auth.regLoading,
    regSuccess: state.auth.regSuccess,
    regError: state.auth.regError,

    loginByPhoneLoading: state.auth.loginByPhoneLoading,
    loginByPhoneSuccess: state.auth.loginByPhoneSuccess,
    loginByPhoneError: state.auth.loginByPhoneError,
  }),
  {
    fetch: authActions.fetchRequest,
    register: authActions.regRequest,
    clearReg: authActions.clearReg,

    loginByPhone: authActions.loginByPhoneRequest,
    clearLoginByPhone: authActions.clearLoginByPhone,
  }
);

type TPropsFromRedux = ConnectedProps<typeof connector>;

export default connector(injectIntl(Registration));
