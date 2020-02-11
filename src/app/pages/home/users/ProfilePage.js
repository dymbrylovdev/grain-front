import React, { useState } from "react";
import { shallowEqual, useSelector, connect } from "react-redux";
import { injectIntl, FormattedMessage } from "react-intl";
import { TextField } from "@material-ui/core";
import { Formik } from "formik";
import { makeStyles } from "@material-ui/core/styles";
import { Paper } from "@material-ui/core";
import * as Yup from "yup";

import * as auth from "../../../store/ducks/auth.duck";
import { setUser } from "../../../crud/auth.crud";
import StatusAlert from "./StatusAlert";
import ButtonWithLoader from "../../../components/ui/Buttons/ButtonWithLoader";

const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  form: {
    maxWidth: "800px",
    width: "100%",
    padding: theme.spacing(3),
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: theme.spacing(3),
  },
}));

const getInitialValues = user => ({
  fio: user.fio,
  phone: user.phone,
  email: user.email,
  inn: user.inn,
  company: user.company,
  password: "",
  repeatPassword: "",
});

function ProfilePage({ intl, fulfillUser }) {
  const [loading, setLoading] = useState(false);
  const user = useSelector(({ auth: { user } }) => user, shallowEqual);
  console.log("myUser", user);
  const classes = useStyles();
  return (
    <Paper className={classes.container}>
      <Formik
        initialValues={getInitialValues(user)}
        validationSchema={Yup.object().shape({
          email: Yup.string()
            .email(<FormattedMessage id="AUTH.VALIDATION.INVALID_FIELD" />)
            .required("Email is required"),

          password: Yup.string().min(4, "Password must have at least 4 characters"),

          repeatPassword: Yup.string().oneOf(
            [Yup.ref("password"), null],
            <FormattedMessage id="PROFILE.VALIDATION.SIMILAR_PASSWORD" />
          ),
        })}
        onSubmit={(values, { setStatus, setSubmitting, resetForm }) => {
          setLoading(true);
          setTimeout(() => {
            setUser(values)
              .then(({ data }) => {
                setLoading(false);
                if (data.data) {
                  setStatus({
                    error: false,
                    message: intl.formatMessage({
                      id: "PROFILE.STATUS.SUCCESS",
                    }),
                  });
                  fulfillUser(data.data);
                  //resetForm(getInitialValues(data.data));
                }
              })
              .catch(error => {
                console.log("loginError", error);

                setLoading(false);
                setSubmitting(false);
                setStatus({
                  error: true,
                  message: intl.formatMessage({
                    id: "PROFILE.STATUS.ERROR",
                  }),
                });
              });
          }, 1000);
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
          <div className={classes.form}>
            <form noValidate={true} autoComplete="off" className="kt-form" onSubmit={handleSubmit}>
              <StatusAlert status={status} />
              <TextField
                type="text"
                label={intl.formatMessage({
                  id: "PROFILE.INPUT.FIO",
                })}
                margin="normal"
                className={classes.textField}
                name="fio"
                value={values.fio}
                variant="outlined"
                onBlur={handleBlur}
                onChange={handleChange}
                helperText={touched.fio && errors.fio}
                error={Boolean(touched.fio && errors.fio)}
              />
              <TextField
                type="email"
                label={intl.formatMessage({
                  id: "PROFILE.INPUT.EMAIL",
                })}
                margin="normal"
                className={classes.textField}
                name="email"
                value={values.email}
                variant="outlined"
                onBlur={handleBlur}
                onChange={handleChange}
                helperText={touched.email && errors.email}
                error={Boolean(touched.email && errors.email)}
              />
              <TextField
                type="tel"
                label={intl.formatMessage({
                  id: "PROFILE.INPUT.PHONE",
                })}
                margin="normal"
                className={classes.textField}
                name="phone"
                value={values.phone}
                variant="outlined"
                onBlur={handleBlur}
                onChange={handleChange}
                helperText={touched.phone && errors.phone}
                error={Boolean(touched.phone && errors.phone)}
              />
              <TextField
                type="text"
                label={intl.formatMessage({
                  id: "PROFILE.INPUT.INN",
                })}
                margin="normal"
                className={classes.textField}
                name="inn"
                value={values.inn}
                variant="outlined"
                onBlur={handleBlur}
                onChange={handleChange}
                helperText={touched.inn && errors.inn}
                error={Boolean(touched.inn && errors.inn)}
              />
              <TextField
                type="text"
                label={intl.formatMessage({
                  id: "PROFILE.INPUT.COMPANY",
                })}
                margin="normal"
                className={classes.textField}
                name="company"
                value={values.company}
                variant="outlined"
                onBlur={handleBlur}
                onChange={handleChange}
                helperText={touched.company && errors.company}
                error={Boolean(touched.company && errors.company)}
              />
              <TextField
                type="password"
                label={intl.formatMessage({
                  id: "PROFILE.INPUT.PASSWORD",
                })}
                margin="normal"
                className={classes.textField}
                name="password"
                value={values.password}
                variant="outlined"
                onBlur={handleBlur}
                onChange={handleChange}
                error={Boolean(touched.password && touched.repeatPassword && errors.password)}
              />

              <TextField
                type="password"
                label={intl.formatMessage({
                  id: "PROFILE.INPUT.REPEATPASSWORD",
                })}
                margin="normal"
                className={classes.textField}
                name="repeatPassword"
                value={values.repeatPassword}
                variant="outlined"
                onBlur={handleBlur}
                onChange={handleChange}
                helperText={
                  touched.password &&
                  touched.repeatPassword &&
                  (errors.password || errors.repeatPassword)
                }
                error={Boolean(
                  touched.password &&
                    touched.repeatPassword &&
                    (errors.password || errors.repeatPassword)
                )}
              />
              <div className={classes.buttonContainer}>
                <ButtonWithLoader loading={loading}>
                  <FormattedMessage id="PROFILE.BUTTON.SAVE" />
                </ButtonWithLoader>
              </div>
            </form>
          </div>
        )}
      </Formik>
    </Paper>
  );
}

export default injectIntl(connect(null, auth.actions)(ProfilePage));
