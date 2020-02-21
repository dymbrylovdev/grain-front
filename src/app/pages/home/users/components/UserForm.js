import React, { useState, useEffect } from "react";
import { injectIntl, FormattedMessage } from "react-intl";
import { TextField, MenuItem } from "@material-ui/core";
import { useSelector, shallowEqual } from "react-redux";
import { Formik, Form } from "formik";
import { Paper, CircularProgress } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import * as Yup from "yup";

import ButtonWithLoader from "../../../../components/ui/Buttons/ButtonWithLoader";
import StatusAlert from "../../../../components/ui/Messages/StatusAlert";

const getInitialValues = user => ({
  login: user.login || "",
  fio: user.fio || "",
  location: user.location || {},
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
  id: "ROLE_VENDOR",
};

const vendor = {
  value: "Покупатель",
  id: "ROLE_BUYER",
};

const roles = [admin, buyer, vendor];

function UserForm({
  fetchLocations,
  clearFoundResult,
  user,
  classes,
  loading,
  submitAction,
  isEdit,
  isCreate,
  intl,
}) {
  const statuses = useSelector(({ users: { statuses } }) => statuses, shallowEqual);
  const locations = useSelector(state => state.users.locations);
  const isLoadingLocations = useSelector(state => state.users.isLoadingLocations);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const [location, setLocation] = useState("");

  useEffect(() => {
    clearFoundResult();
  }, [clearFoundResult]);

  useEffect(() => {
    fetchLocations(location);
  }, [fetchLocations, location]);

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
          login:
            isCreate || isEdit
              ? Yup.string().required(<FormattedMessage id="PROFILE.VALIDATION.REQUIRED_FIELD" />)
              : null,

          repeatPassword: Yup.mixed().oneOf(
            [Yup.ref("password"), "", null],
            <FormattedMessage id="PROFILE.VALIDATION.SIMILAR_PASSWORD" />
          ),
        })}
        onSubmit={(values, { setStatus, setSubmitting, resetForm }) => {
          if (values.password === "") {
            delete values.password;
          }
          if (values.login === "") {
            delete values.login;
          }
          if (selectedLocation) {
            const { lat, lng, city, country, province, street, house, text } = selectedLocation;
            values.location = {
              lat: parseFloat(lat),
              lng: parseFloat(lng),
              city,
              country,
              province,
              street,
              house,
              text,
            };
          } else {
            delete values.location;
          }
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
            <Form
              autoComplete="off"
              className="kt-form"
              onSubmit={() => {
                console.log("submit ");
              }}
            >
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
              <Autocomplete
                id="location"
                debug
                options={locations}
                loading={isLoadingLocations}
                getOptionLabel={option => option.text}
                onChange={(e, val) => {
                  setSelectedLocation(val);
                }}
                filterOptions={options => options}
                noOptionsText="Введите место"
                defaultValue={{
                  text: user.location && user.location.text ? user.location.text : "",
                }}
                renderInput={params => (
                  <TextField
                    {...params}
                    type="text"
                    label={intl.formatMessage({
                      id: "PROFILE.INPUT.LOCATION",
                    })}
                    value={location}
                    margin="normal"
                    className={classes.textField}
                    name="location"
                    variant="outlined"
                    onBlur={handleBlur}
                    onChange={e => setLocation(e.target.value)}
                    helperText={touched.location && errors.location}
                    error={Boolean(touched.location && errors.location)}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <React.Fragment>
                          {isLoadingLocations ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </React.Fragment>
                      ),
                    }}
                  />
                )}
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
                helperText={touched.password && errors.password}
                error={Boolean(touched.password && errors.password)}
                autocomplete="new-password"
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
                helperText={errors.repeatPassword}
                error={Boolean(errors.repeatPassword || errors.password)}
              />
              <div className={classes.buttonContainer}>
                <ButtonWithLoader onPress={handleSubmit} loading={loading}>
                  <FormattedMessage id="PROFILE.BUTTON.SAVE" />
                </ButtonWithLoader>
              </div>
            </Form>
          </div>
        )}
      </Formik>
    </Paper>
  );
}

export default injectIntl(UserForm);
