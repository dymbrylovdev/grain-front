import React from "react";
import { injectIntl } from "react-intl";
import { Formik } from "formik";
import { TextField } from "@material-ui/core";
import { connect } from "react-redux";
import * as Yup from "yup";
import * as auth from "../../store/ducks/auth.duck";

import StatusAlert from "../../components/ui/Messages/StatusAlert";
import ButtonWithLoader from "../../components/ui/Buttons/ButtonWithLoader";

const getInitialValues = () => ({
  password: "",
  password2: "",
});

function ChangePassword({ intl, match: { params }, changePassword }) {
  const { code } = params;
  return (
    <div className="kt-login__body">
      <div className="kt-login__form">
        <div className="kt-login__title">
          <h3>{intl.formatMessage({ id: "AUTH.PASSWORD.TITLE" })}</h3>
        </div>
        <Formik
          initialValues={getInitialValues()}
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
          onSubmit={(values, { setStatus, setSubmitting }) => {
            setStatus({ loading: true });
            const params = values;
            params.code = code;
            const failCallback = e => {
              setStatus({
                loading: false,
                message: e || intl.formatMessage({ id: "AUTH.VALIDATION.NOT_FOUND" }, { name: "" }),
                error: true,
              });
              setSubmitting(false);
            };
            changePassword(params, failCallback);
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
                  type="password"
                  label={intl.formatMessage({
                    id: "PROFILE.INPUT.PASSWORD",
                  })}
                  margin="normal"
                  fullWidth={true}
                  name="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  helperText={touched.password && errors.password}
                  error={Boolean(touched.password && errors.password)}
                />
                <TextField
                  type="password"
                  label={intl.formatMessage({
                    id: "PROFILE.INPUT.REPEATPASSWORD",
                  })}
                  margin="normal"
                  fullWidth={true}
                  name="password2"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  helperText={touched.password2 && errors.password2}
                  error={Boolean(touched.password2 && errors.password2)}
                />
                <div className="kt-login__actions">
                  <ButtonWithLoader
                    disabled={isSubmitting}
                    loading={status && status.loading}
                    onPress={handleSubmit}
                  >
                    {intl.formatMessage({ id: "AUTH.PASSWORD.BUTTON" })}
                  </ButtonWithLoader>
                </div>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default injectIntl(connect(null, auth.actions)(ChangePassword));
