import React, { useCallback, useEffect, useState } from "react";
import { useFormik } from "formik";
import { connect, ConnectedProps } from "react-redux";
import { useHistory } from "react-router-dom";
import { FormattedMessage, injectIntl, WrappedComponentProps } from "react-intl";
import {
  Checkbox,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@material-ui/core";
import * as Yup from "yup";
import { useSnackbar } from "notistack";

import { actions as authActions } from "../../store/ducks/auth.duck";

import ButtonWithLoader from "../../components/ui/Buttons/ButtonWithLoader";
import TermDialog from "./components/TermDialog";
import { IAppState } from "../../store/rootDuck";
import { TRole } from "../../interfaces/users";
import { roles } from "../home/users/utils/profileForm";
import Preloader from "../../components/ui/Loaders/Preloader";

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

  clearSendCode,
  sendCodeConfirm,
  sendCodeLoading,
  sendCodeSuccess,
  sendCodeError,

  findInSystemError,
  clearFindInSystem,
  authData,
}) => {
  const history = useHistory();
  const [isAgreementOpen, setOpenUserAgreement] = useState(false);
  const [phoneRegPhase, setPhoneRegPhase] = useState(0);

  let validationSchema = {};

  if (authData && authData.type === "email") {
    validationSchema = {};
  }
  if (authData && authData.type === "phone") {
    if (phoneRegPhase === 0) {
      validationSchema = {};
    }
    if (phoneRegPhase === 1) {
      validationSchema = {
        codeConfirm: Yup.string().required(
          intl.formatMessage({ id: "AUTH.VALIDATION.REQUIRED_FIELD" })
        ),
      };
    }
  }

  const backHandler = useCallback(() => {
    clearFindInSystem();

    history.push("/auth");
  }, [clearFindInSystem, history]);

  const { values, errors, touched, resetForm, handleChange, handleBlur, handleSubmit } = useFormik({
    enableReinitialize: true,
    initialValues: {
      codeConfirm: "",
      role: "ROLE_BUYER",
      acceptTerms: true,
    },
    onSubmit: values => {
      if (authData && authData.type === "email") {
        register({
          email: authData.value,
          roles: [values.role as TRole],
          login: authData.value,
          crop_ids: [1],
        });
      }
      if (authData && authData.type === "phone") {
        if (phoneRegPhase === 0) {
          register({
            phone: authData.value,
            roles: [values.role as TRole],
            crop_ids: [1],
          });
        }
        if (phoneRegPhase === 1) {
          loginByPhone({
            phone: authData.value,
            code: values.codeConfirm,
          });
        }
      }
    },
    validationSchema: Yup.object().shape(validationSchema),
  });

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (regError) {
      enqueueSnackbar(regError, {
        variant: "error",
      });
      clearReg();
    }
    if (regSuccess) {
      if (authData && authData.type === "email") history.push("/auth/email-sent/registration");
      if (authData && authData.type === "phone") {
        enqueueSnackbar(intl.formatMessage({ id: "AUTH.VALIDATION.CODE.CONFIRM" }), {
          variant: "success",
        });

        setPhoneRegPhase(1);
      }

      clearReg();
    }
  }, [clearReg, enqueueSnackbar, history, regError, regSuccess]);

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

  useEffect(() => {
    if (!findInSystemError) {
      history.push("/auth");
    }

    return () => {
      clearFindInSystem();
    };
  }, []);

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

          <form onSubmit={handleSubmit} noValidate autoComplete="off">
            {!phoneRegPhase ? (
              <>
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
              </>
            ) : (
              <div className="form-group mb-0">
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
              </div>
            )}

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
                disabled={regLoading || !values.acceptTerms || loginByPhoneLoading || fetchLoading}
                onPress={handleSubmit}
                loading={regLoading}
              >
                {intl.formatMessage({ id: "AUTH.BUTTON.REGISTER" })}
              </ButtonWithLoader>
            </div>
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

    regLoading: state.auth.regLoading,
    regSuccess: state.auth.regSuccess,
    regError: state.auth.regError,

    loginByPhoneLoading: state.auth.loginByPhoneLoading,
    loginByPhoneSuccess: state.auth.loginByPhoneSuccess,
    loginByPhoneError: state.auth.loginByPhoneError,

    sendCodeLoading: state.auth.sendCodeConfirmLoading,
    sendCodeSuccess: state.auth.sendCodeConfirmSuccess,
    sendCodeError: state.auth.sendCodeConfirmError,

    findInSystemError: state.auth.findInSystemError,
    authData: state.auth.authData,
  }),
  {
    fetch: authActions.fetchRequest,
    register: authActions.regRequest,
    clearReg: authActions.clearReg,

    loginByPhone: authActions.loginByPhoneRequest,
    clearLoginByPhone: authActions.clearLoginByPhone,

    sendCodeConfirm: authActions.sendCodeRequest,
    clearSendCode: authActions.clearSendCode,

    clearFindInSystem: authActions.clearFindInSystem,
  }
);

type TPropsFromRedux = ConnectedProps<typeof connector>;

export default connector(injectIntl(Registration));
