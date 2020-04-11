import React, { useEffect } from "react";
import { Formik } from "formik";
import { connect, ConnectedProps } from "react-redux";
import { TextField, Button, Grid } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { FormattedMessage, injectIntl, WrappedComponentProps } from "react-intl";
import * as Yup from "yup";
import { useSnackbar } from "notistack";

import { actions as authActions } from "../../store/ducks/auth.duck";
import { IAppState } from "../../store/rootDuck";
import ButtonWithLoader from "../../components/ui/Buttons/ButtonWithLoader";

const ForgotPassword: React.FC<WrappedComponentProps & TPropsFromRedux> = ({
  intl,
  clearRecoveryPassword,
  recoveryPasswordRequest,
  recoveryPasswordLoading,
  recoveryPasswordSuccess,
  recoveryPasswordError,
}) => {
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (recoveryPasswordError) {
      enqueueSnackbar(recoveryPasswordError, { variant: "error" });
    }
    if (recoveryPasswordSuccess) {
      history.push("/auth/email-sent/forgot");
    }
    return () => {
      clearRecoveryPassword();
    };
  }, [
    recoveryPasswordSuccess,
    recoveryPasswordError,
    enqueueSnackbar,
    clearRecoveryPassword,
    history,
  ]);

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
              .email(intl.formatMessage({ id: "AUTH.VALIDATION.INVALID_FIELD" }))

              .required(intl.formatMessage({ id: "PROFILE.VALIDATION.REQUIRED_FIELD" })),
          })}
          onSubmit={values => {
            recoveryPasswordRequest({ email: values.email });
          }}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
            <form onSubmit={handleSubmit} className="kt-form">
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
                <Grid container direction="row" justify="space-between" alignItems="stretch">
                  <Button onClick={() => history.push("/auth")} variant="outlined" color="primary">
                    {intl.formatMessage({ id: "ALL.BUTTONS.PREV" })}
                  </Button>

                  <ButtonWithLoader
                    disabled={recoveryPasswordLoading}
                    loading={recoveryPasswordLoading}
                    onPress={handleSubmit}
                  >
                    {intl.formatMessage({ id: "AUTH.BUTTON.RESET" })}
                  </ButtonWithLoader>
                </Grid>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
};

const connector = connect(
  (state: IAppState) => ({
    recoveryPasswordLoading: state.auth.recoveryPasswordLoading,
    recoveryPasswordSuccess: state.auth.recoveryPasswordSuccess,
    recoveryPasswordError: state.auth.recoveryPasswordError,
  }),
  {
    clearRecoveryPassword: authActions.clearRecoveryPassword,
    recoveryPasswordRequest: authActions.recoveryPasswordRequest,
  }
);

type TPropsFromRedux = ConnectedProps<typeof connector>;

export default injectIntl(connector(ForgotPassword));
