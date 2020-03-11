import React, { useEffect, useRef } from "react";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import { injectIntl } from "react-intl";

import { Paper, TextField } from "@material-ui/core";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";

import ButtonWithLoader from "../../../../components/ui/Buttons/ButtonWithLoader";
import StatusAlert from "../../../../components/ui/Messages/StatusAlert";

const getInitialValues = company => ({
  short_name: company.short_name || "",
  full_name: company.full_name || "",
  registration_at: company.registration_at || null,
  inn: company.inn || "",
  ogrn: company.ogrn || "",
  kpp: company.kpp || "",
  okpo: company.okpo || "",
  okato: company.okato || "",
  okfs: company.okfs || "",
  oktmo: company.oktmo || "",
  okogu: company.okogu || "",
  okopf: company.okopf || "",
  opf: company.opf || "",
  legalAddress: company.legalAddress || "",
  email: company.email || "",
  email2: company.email2 || "",
  mobilePhone: company.mobilePhone || "",
  telephone: company.telephone || "",
});

function CompanyForm({ intl, classes, company, submitAction }) {
  const formRef = useRef();

  useEffect(() => {
    company && company.id && formRef.current.resetForm({ values: getInitialValues(company) });
  }, [company]);

  const schema = Yup.object().shape({
    email1: Yup.string().email(intl.formatMessage({ id: "AUTH.VALIDATION.INVALID_FIELD" })),
    email2: Yup.string().email(intl.formatMessage({ id: "AUTH.VALIDATION.INVALID_FIELD" })),
    short_name: Yup.string().required(intl.formatMessage({ id: "PROFILE.VALIDATION.REQUIRED_FIELD" })),
    registration_at: Yup.date().max(new Date()),
  });

  return (
    <Paper className={classes.container}>
      <Formik
        autoComplete="off"
        initialValues={getInitialValues(company)}
        validationSchema={schema}
        onSubmit={(values, { setStatus, setSubmitting, resetForm }) => {
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
          setFieldValue,
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

              <TextField
                type="text"
                label={intl.formatMessage({
                  id: "COMPANY.FORM.NAME",
                })}
                margin="normal"
                name="short_name"
                value={values.short_name}
                variant="outlined"
                onBlur={handleBlur}
                onChange={handleChange}
                helperText={touched.short_name && errors.short_name}
                error={Boolean(touched.short_name && errors.short_name)}
              />
              <TextField
                type="text"
                label={intl.formatMessage({
                  id: "COMPANY.FORM.FULL_NAME",
                })}
                margin="normal"
                name="full_name"
                value={values.full_name}
                variant="outlined"
                onBlur={handleBlur}
                onChange={handleChange}
              />
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  name="registration_at"
                  variant="inline"
                  format="dd/MM/yyyy"
                  margin="normal"
                  id="date-picker-inline"
                  label={intl.formatMessage({
                    id: "COMPANY.FORM.DATE",
                  })}
                  value={values.registration_at}
                  onChange={date=>{
                      setFieldValue("registration_at", date)                    
                  }}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                  inputVariant="outlined"
                  autoOk
                  maxDateMessage={intl.formatMessage({id: "COMPANY.FORM.VALIDATION.MAX_DATA"})}
                  invalidDateMessage={intl.formatMessage({id: "COMPANY.FORM.VALIDATION.WRONG_DATA"})}
                  disableFuture
                />
              </MuiPickersUtilsProvider>
              <TextField
                type="text"
                label={intl.formatMessage({
                  id: "COMPANY.FORM.INN",
                })}
                margin="normal"
                name="inn"
                value={values.inn}
                variant="outlined"
                onBlur={handleBlur}
                onChange={handleChange}
              />
              <TextField
                type="text"
                label={intl.formatMessage({
                  id: "COMPANY.FORM.OGRN",
                })}
                margin="normal"
                name="ogrn"
                value={values.ogrn}
                variant="outlined"
                onBlur={handleBlur}
                onChange={handleChange}
              />
              <TextField
                type="text"
                label={intl.formatMessage({
                  id: "COMPANY.FORM.KPP",
                })}
                margin="normal"
                name="kpp"
                value={values.kpp}
                variant="outlined"
                onBlur={handleBlur}
                onChange={handleChange}
              />
              <TextField
                type="text"
                label={intl.formatMessage({
                  id: "COMPANY.FORM.OKPO",
                })}
                margin="normal"
                name="okpo"
                value={values.okpo}
                variant="outlined"
                onBlur={handleBlur}
                onChange={handleChange}
              />
              <TextField
                type="text"
                label={intl.formatMessage({
                  id: "COMPANY.FORM.OKATO",
                })}
                margin="normal"
                name="okato"
                value={values.okato}
                variant="outlined"
                onBlur={handleBlur}
                onChange={handleChange}
              />
              <TextField
                type="text"
                label={intl.formatMessage({
                  id: "COMPANY.FORM.OKFS",
                })}
                margin="normal"
                name="okfs"
                value={values.okfs}
                variant="outlined"
                onBlur={handleBlur}
                onChange={handleChange}
              />

              <TextField
                type="text"
                label={intl.formatMessage({
                  id: "COMPANY.FORM.OKTMO",
                })}
                margin="normal"
                name="oktmo"
                value={values.oktmo}
                variant="outlined"
                onBlur={handleBlur}
                onChange={handleChange}
              />
              <TextField
                type="text"
                label={intl.formatMessage({
                  id: "COMPANY.FORM.OKOGU",
                })}
                margin="normal"
                name="okogu"
                value={values.okogu}
                variant="outlined"
                onBlur={handleBlur}
                onChange={handleChange}
              />
              <TextField
                type="text"
                label={intl.formatMessage({
                  id: "COMPANY.FORM.OKOPF",
                })}
                margin="normal"
                name="okopf"
                value={values.okopf}
                variant="outlined"
                onBlur={handleBlur}
                onChange={handleChange}
              />

              <TextField
                type="text"
                label={intl.formatMessage({
                  id: "COMPANY.FORM.OPF",
                })}
                margin="normal"
                name="opf"
                value={values.opf}
                variant="outlined"
                onBlur={handleBlur}
                onChange={handleChange}
              />

              <TextField
                type="text"
                label={intl.formatMessage({
                  id: "COMPANY.FORM.ADDRESS",
                })}
                margin="normal"
                name="legalAddress"
                value={values.legalAddress}
                variant="outlined"
                onBlur={handleBlur}
                onChange={handleChange}
              />

              <TextField
                type="text"
                label={intl.formatMessage({
                  id: "COMPANY.FORM.EMAIL1",
                })}
                margin="normal"
                name="email"
                value={values.email}
                variant="outlined"
                onBlur={handleBlur}
                onChange={handleChange}
                helperText={touched.email1 && errors.email1}
                error={Boolean(touched.email1 && errors.email1)}
              />
              <TextField
                type="text"
                label={intl.formatMessage({
                  id: "COMPANY.FORM.EMAIL2",
                })}
                margin="normal"
                name="email2"
                value={values.email2}
                variant="outlined"
                onBlur={handleBlur}
                onChange={handleChange}
                helperText={touched.email2 && errors.email2}
                error={Boolean(touched.email2 && errors.email2)}
              />

              <TextField
                type="text"
                label={intl.formatMessage({
                  id: "COMPANY.FORM.MOBILE_PHONE",
                })}
                margin="normal"
                name="mobilePhone"
                value={values.mobilePhone}
                variant="outlined"
                onBlur={handleBlur}
                onChange={handleChange}
              />

              <TextField
                type="text"
                label={intl.formatMessage({
                  id: "COMPANY.FORM.HOME_PHONE",
                })}
                margin="normal"
                name="telephone"
                value={values.telephone}
                variant="outlined"
                onBlur={handleBlur}
                onChange={handleChange}
              />
              <StatusAlert status={status} />
              <div className={classes.buttonContainer}>
                <ButtonWithLoader onPress={handleSubmit} loading={status && status.loading}>
                  {intl.formatMessage({ id: "PROFILE.BUTTON.SAVE" })}
                </ButtonWithLoader>
              </div>
            </Form>
          </div>
        )}
      </Formik>
    </Paper>
  );
}

export default injectIntl(CompanyForm);
