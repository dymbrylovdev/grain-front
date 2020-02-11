import React, { useState } from 'react';
import { shallowEqual, useSelector, connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { TextField } from '@material-ui/core';
import { Formik } from 'formik';
import clsx from 'clsx';
import * as auth from '../../../store/ducks/auth.duck';
import { setUser } from '../../../crud/auth.crud';
import StatusAlert from './components/StatusAlert';
import useStyles from './styles';


const getInitialValues = user => ({
  fio: user.fio,
  phone: user.phone,
  email: user.email,
  inn: user.inn,
  company: user.company,
  password: '',
  repeatPassword: '',
});

function ProfilePage({ intl, fulfillUser }) {
  const [loading, setLoading] = useState(false);
  const user = useSelector(({ auth: { user } }) => user, shallowEqual);
  console.log('myUser', user);
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <Formik
        initialValues={getInitialValues(user)}
        validate={values => {
          const errors = {};
          if (values.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
            errors.email = intl.formatMessage({
              id: 'AUTH.VALIDATION.INVALID_FIELD',
            });
          }

          if (values.password !== values.repeatPassword) {
            errors.password = intl.formatMessage({
              id: 'PROFILE.VALIDATION.SIMILAR_PASSWORD',
            });
          }
          return errors;
        }}
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
                      id: 'PROFILE.STATUS.SUCCESS',
                    }),
                  });
                  fulfillUser(data.data);
                  //resetForm(getInitialValues(data.data));
                }
              })
              .catch(error => {
                console.log('loginError', error);

                setLoading(false);
                setSubmitting(false);
                setStatus({
                  error: true,
                  message: intl.formatMessage({
                    id: 'PROFILE.STATUS.ERROR',
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
                  id: 'PROFILE.INPUT.FIO',
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
                  id: 'PROFILE.INPUT.EMAIL',
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
                  id: 'PROFILE.INPUT.PHONE',
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
                  id: 'PROFILE.INPUT.INN',
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
                  id: 'PROFILE.INPUT.COMPANY',
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
                  id: 'PROFILE.INPUT.PASSWORD',
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
                  id: 'PROFILE.INPUT.REPEATPASSWORD',
                })}
                margin="normal"
                className={classes.textField}
                name="repeatPassword"
                value={values.repeatPassword}
                variant="outlined"
                onBlur={handleBlur}
                onChange={handleChange}
                helperText={touched.password && touched.repeatPassword && errors.password}
                error={Boolean(touched.password && touched.repeatPassword && errors.password)}
              />
              <div className={classes.buttonContainer}>
                <button
                  className={`btn btn-primary btn-elevate kt-login__btn-primary ${clsx({
                    'kt-spinner kt-spinner--right kt-spinner--md kt-spinner--light': loading,
                  })}`}
                >
                  <FormattedMessage id="PROFILE.BUTTON.SAVE" />
                </button>
              </div>
            </form>
          </div>
        )}
      </Formik>
    </div>
  );
}

export default injectIntl(connect(null, auth.actions)(ProfilePage));
