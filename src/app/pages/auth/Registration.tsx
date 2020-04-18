import React, { useState, useEffect } from "react";
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
} from "@material-ui/core";
import * as Yup from "yup";
import { useSnackbar } from "notistack";

import { actions as authActions } from "../../store/ducks/auth.duck";

import ButtonWithLoader from "../../components/ui/Buttons/ButtonWithLoader";
import TermDialog from "./components/TermDialog";
import { IAppState } from "../../store/rootDuck";
import { TRole } from "../../interfaces/users";

const Registration: React.FC<TPropsFromRedux & WrappedComponentProps> = ({
  intl,
  clearReg,
  register,
  regLoading,
  regSuccess,
  regError,
}) => {
  const history = useHistory();
  const [isAgreementOpen, setOpenUserAgreement] = useState(false);

  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    if (regError) {
      enqueueSnackbar(regError, {
        variant: "error",
      });
      clearReg();
    }
    if (regSuccess) {
      history.push("/auth/email-sent/registration");
      clearReg();
    }
  }, [clearReg, enqueueSnackbar, history, regError, regSuccess]);

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
            onSubmit={values => {
              register({
                email: values.email,
                roles: [values.role as TRole],
                login: values.login,
              });
            }}
          >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
              <form onSubmit={handleSubmit} noValidate autoComplete="off">
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
                  <Link to="/auth">
                    <button
                      type="button"
                      className="btn btn-secondary btn-elevate kt-login__btn-secondary"
                    >
                      {intl.formatMessage({ id: "AUTH.GENERAL.BACK_BUTTON" })}
                    </button>
                  </Link>

                  <ButtonWithLoader
                    disabled={regLoading || !values.acceptTerms}
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
    regLoading: state.auth.regLoading,
    regSuccess: state.auth.regSuccess,
    regError: state.auth.regError,
  }),
  {
    register: authActions.regRequest,
    clearReg: authActions.clearReg,
  }
);

type TPropsFromRedux = ConnectedProps<typeof connector>;

export default connector(injectIntl(Registration));
