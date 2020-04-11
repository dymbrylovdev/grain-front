import React, { useEffect } from "react";
import { Formik } from "formik";
import { connect, ConnectedProps } from "react-redux";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { TextField } from "@material-ui/core";
import { useHistory, RouteComponentProps } from "react-router-dom";
import * as Yup from "yup";
import { useSnackbar } from "notistack";

import { actions as authActions } from "../../store/ducks/auth.duck";
import { IAppState } from "../../store/rootDuck";
import ButtonWithLoader from "../../components/ui/Buttons/ButtonWithLoader";

const ChangePassword: React.FC<RouteComponentProps<{ code: string }> &
  TPropsFromRedux &
  WrappedComponentProps> = ({
  match: {
    params: { code },
  },
  intl,
  clearNewPassword,
  newPasswordRequest,
  newPasswordLoading,
  newPasswordSuccess,
  newPasswordError,
}) => {
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (newPasswordSuccess || newPasswordError) {
      enqueueSnackbar(
        newPasswordSuccess ? "Новый пароль установлен" : `Ошибка: ${newPasswordError}`,
        { variant: newPasswordSuccess ? "success" : "error" }
      );
    }
    if (newPasswordSuccess) {
      history.push("/auth");
    }
    return () => {
      clearNewPassword();
    };
  }, [clearNewPassword, enqueueSnackbar, history, newPasswordError, newPasswordSuccess]);

  return (
    <div className="kt-login__body">
      <div className="kt-login__form">
        <div className="kt-login__title">
          <h3>{intl.formatMessage({ id: "AUTH.PASSWORD.TITLE" })}</h3>
        </div>

        <Formik
          initialValues={{ password: "", password2: "" }}
          validationSchema={Yup.object().shape({
            password: Yup.string().required(
              intl.formatMessage({ id: "PROFILE.VALIDATION.REQUIRED_FIELD" })
            ),
            password2: Yup.string()
              .oneOf(
                [Yup.ref("password"), null],
                intl.formatMessage({ id: "PROFILE.VALIDATION.SIMILAR_PASSWORD" })
              )
              .required(intl.formatMessage({ id: "PROFILE.VALIDATION.REQUIRED_FIELD" })),
          })}
          onSubmit={values => {
            newPasswordRequest({ password: values.password, password2: values.password2, code });
          }}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
            <form onSubmit={handleSubmit} className="kt-form">
              <div className="form-group">
                <TextField
                  autoComplete="off"
                  type="password"
                  margin="normal"
                  label="Новый пароль"
                  className="kt-width-full"
                  name="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password}
                  helperText={touched.password && errors.password}
                  error={Boolean(touched.password && errors.password)}
                />
              </div>

              <div className="form-group">
                <TextField
                  autoComplete="off"
                  type="password"
                  margin="normal"
                  label="Новый пароль еще раз"
                  className="kt-width-full"
                  name="password2"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password2}
                  helperText={touched.password2 && errors.password2}
                  error={Boolean(touched.password2 && errors.password2)}
                />
              </div>

              <div className="kt-login__actions">
                <ButtonWithLoader
                  disabled={newPasswordLoading}
                  loading={newPasswordLoading}
                  onPress={handleSubmit}
                >
                  {intl.formatMessage({ id: "AUTH.PASSWORD.BUTTON" })}
                </ButtonWithLoader>
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
    newPasswordLoading: state.auth.newPasswordLoading,
    newPasswordSuccess: state.auth.newPasswordSuccess,
    newPasswordError: state.auth.newPasswordError,
  }),
  {
    clearNewPassword: authActions.clearNewPassword,
    newPasswordRequest: authActions.newPasswordRequest,
  }
);

type TPropsFromRedux = ConnectedProps<typeof connector>;

export default connector(injectIntl(ChangePassword));
