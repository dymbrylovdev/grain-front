import React from "react";
import { injectIntl, FormattedMessage } from "react-intl";
import { TextField, MenuItem } from "@material-ui/core";
import { useSelector, shallowEqual } from "react-redux";
import { Formik } from "formik";
import { Paper } from "@material-ui/core";
import * as Yup from "yup";
import ButtonWithLoader from "../../../../components/ui/Buttons/ButtonWithLoader";
import StatusAlert from "./StatusAlert";

const getInitialValues = user => ({
  login: user.login || "",
  fio: user.fio || "",
  phone: user.phone || "",
  email: user.email || "",
  inn: user.inn || "",
  company: user.company || "",
  password: "",
  repeatPassword: "",
  role: user.is_vendor ? vendor : user.is_buyer ? buyer : admin,
  status: user.status || "",
});
const admin = {
  value: "Администратор",
  id: "ROLE_ADMIN",
};
const buyer = {
  value: "Продавец",
  id: "ROLE_BUYER",
};

const vendor = {
  value: "Покупатель",
  id: "ROLE_VENDOR",
};

const roles = [admin, buyer, vendor];

function UserForm({ user, classes, loading, submitAction, isEdit, isCreate, intl }) {
  const statuses = useSelector(({ users: { statuses } }) => statuses, shallowEqual);
  return (
    <Paper className={classes.container}>
      <Formik
        autoComplete="off"
        initialValues={getInitialValues(user)}
        validationSchema={Yup.object().shape({
          email: Yup.string()
            .email(<FormattedMessage id="AUTH.VALIDATION.INVALID_FIELD" />)
            .required(<FormattedMessage id="PROFILE.VALIDATION.REQUIRED_FIELD" />),
          password: isCreate
            ? Yup.string().required(<FormattedMessage id="PROFILE.VALIDATION.REQUIRED_FIELD" />)
            : null,
          login: Yup.string().required(<FormattedMessage id="PROFILE.VALIDATION.REQUIRED_FIELD" />),

          repeatPassword: Yup.mixed().oneOf(
            [Yup.ref("password"), '', null],
            <FormattedMessage id="PROFILE.VALIDATION.SIMILAR_PASSWORD" />
          ),
        })}
        onSubmit={(values, { setStatus, setSubmitting, resetForm }) => {
          submitAction(values, setStatus, setSubmitting);
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
            <form noValidate autoComplete="off" className="kt-form" onSubmit={handleSubmit}>
              <StatusAlert status={status} />
              {isCreate && (
                <TextField
                  select
                  className={classes.textSelect}
                  label={intl.formatMessage({
                    id: "PROFILE.INPUT.ROLE",
                  })}
                  value={values.role}
                  onChange={handleChange}
                  name="role"
                  variant="outlined"
                >
                  {roles.map(option => (
                    <MenuItem key={option.id} value={option}>
                      {option.value}
                    </MenuItem>
                  ))}
                </TextField>
              )}
              {(isEdit || isCreate) && (
                <div>
                  <TextField
                    select
                    className={classes.textSelect}
                    label={intl.formatMessage({
                      id: "PROFILE.INPUT.STATUS",
                    })}
                    value={values.status}
                    onChange={handleChange}
                    name="status"
                    variant="outlined"
                  >
                    {statuses.map(option => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    type="text"
                    label={intl.formatMessage({
                      id: "PROFILE.INPUT.LOGIN",
                    })}
                    margin="normal"
                    className={classes.textField}
                    name="login"
                    value={values.login}
                    variant="outlined"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    helperText={touched.login && errors.login}
                    error={Boolean(touched.login && errors.login)}
                    autocomplete="off"
                  />
                </div>
              )}
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
                type="text"
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
                autoComplete="off"
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
                helperText={touched.password && errors.password}
                error={Boolean(touched.password && errors.password)}
                autocomplete="new-password"
              />

              <TextField
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
                helperText={errors.repeatPassword}
                error={Boolean(errors.repeatPassword || errors.password)}
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

export default injectIntl(UserForm);
