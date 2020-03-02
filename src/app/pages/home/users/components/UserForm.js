import React, { useState, useRef, useEffect } from "react";
import { injectIntl, FormattedMessage } from "react-intl";
import { TextField, MenuItem, Paper } from "@material-ui/core";
import { useSelector, shallowEqual } from "react-redux";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import AutocompleteLocations from "../../../../components/AutocompleteLocations";
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
const vendor = {
  value: "Продавец",
  id: "ROLE_VENDOR",
};

const buyer = {
  value: "Покупатель",
  id: "ROLE_BUYER",
};

const roles = [admin, buyer, vendor];



function UserForm({
  fetchLocations,
  clearLocations,
  user,
  classes,
  loading,
  submitAction,
  isEdit,
  isCreate,
  intl,
  isEditable,
}) {
  const formRef = useRef();
  const statuses = useSelector(({ users: { statuses } }) => statuses, shallowEqual);
  const { locations, isLoadingLocations } = useSelector(state => state.locations);
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    user && user.id && formRef.current.resetForm({ values: getInitialValues(user) });
  }, [user]);


  const schema = Yup.object().shape({
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
    repeatPassword: Yup.string().test('passwords-match', <FormattedMessage id="PROFILE.VALIDATION.SIMILAR_PASSWORD" />, 
    function(value){
      const password = this.parent.password;
      if ( password && password !== "" && password !== value ){
        return false;
      }
      return true;
    })
  })
 

  return (
    <Paper className={classes.container}>
      <Formik
        autoComplete="off"
        initialValues={getInitialValues(user)}
        validationSchema={schema}
        onSubmit={(values, { setStatus, setSubmitting, resetForm }) => {
          if (values.password === "" || !values.password) {
            delete values.password;
          }
          if (values.login === "") {
            delete values.login;
          }
          if (selectedLocation) {
            values.location = { ...selectedLocation };
          } else {
            delete values.location;
          }
          console.log("---values", values);
          submitAction(values, setStatus, setSubmitting);
        }}
        innerRef={formRef}
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
              {(isEdit || isCreate) && (
                <TextField
                  select
                  margin="normal"
                  label={intl.formatMessage({
                    id: "PROFILE.INPUT.ROLE",
                  })}
                  value={values.role}
                  onChange={handleChange}
                  name="role"
                  variant="outlined"
                  disabled={isEdit}
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
                    margin="normal"
                    label={intl.formatMessage({
                      id: "PROFILE.INPUT.STATUS",
                    })}
                    value={values.status}
                    onChange={handleChange}
                    name="status"
                    variant="outlined"
                    disabled={!isEditable}
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
                    autoComplete="off"
                    disabled={!isEditable}
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
                disabled={!isEditable}
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
                disabled={!isEditable}
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
                disabled={!isEditable}
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
                disabled={!isEditable}
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
                disabled={!isEditable}
              />
              <AutocompleteLocations
                options={locations}
                loading={isLoadingLocations}
                defaultValue={{
                  text: user.location && user.location.text ? user.location.text : "",
                }}
                label={intl.formatMessage({
                  id: "PROFILE.INPUT.LOCATION",
                })}
                editable={!(user.location && user.location.text)}
                inputClassName={classes.textField}
                inputError={Boolean(touched.location && errors.location)}
                inputHelperText={touched.location && errors.location}
                fetchLocations={fetchLocations}
                clearLocations={clearLocations}
                setSelectedLocation={setSelectedLocation}
                disable={!isEditable}
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
                autoComplete="new-password"
                disabled={!isEditable}
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
                helperText={touched.repeatPassword && errors.repeatPassword}
                error={Boolean(touched.repeatPassword && errors.repeatPassword)}
                disabled={!isEditable}
              />
              {isEditable && (
                <div className={classes.buttonContainer}>
                  <ButtonWithLoader onPress={handleSubmit} loading={loading}>
                    <FormattedMessage id="PROFILE.BUTTON.SAVE" />
                  </ButtonWithLoader>
                </div>
              )}
            </Form>
          </div>
        )}
      </Formik>
    </Paper>
  );
}

export default injectIntl(UserForm);
