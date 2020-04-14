import React, { useCallback, useState, useEffect, useRef } from "react";
import { injectIntl } from "react-intl";
import { Formik } from "formik";
import { TextField, Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import { searchCompanies } from "../../../../crud/companies.crud";
import ButtonWithLoader from "../../../../components/ui/Buttons/ButtonWithLoader";
import StatusAlert from "../../../../components/ui/Messages/StatusAlert";
import CompanySearchDialog from "./CompanySearchDialog";

const innerStyles = makeStyles(theme => ({
  title: {
    fontSize: 14,
    marginBottom: theme.spacing(2),
  },
  companyContainer: {
    flexDirection: "row",
    display: "flex",
  },
  companyText: {
    flex: 1,
  },
}));

const getInitialValues = company => ({
  short_name: "",
  inn: "",
});

const isSearchEmpty = values => {
  if ((!values.inn || values.inn === "") && (!values.short_name || values.short_name === "")) {
    return true;
  }
  return false;
};

function CompanySearchForm({ intl, setCompanyAction, classes, company, editAction, confirms }) {
  const formRef = useRef();
  const innerClasses = innerStyles();
  const [companies, setCompanies] = useState([]);
  //const [currentCompany, setCurrentCompany] = useState(company);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const searchAction = useCallback((values, successCallback, emptyCallback, failCallback) => {
    searchCompanies(values)
      .then(({ data }) => {
        if (data && data.data) {
          setCompanies(data.data);
          if (data.data.length > 0) {
            successCallback();
          } else {
            emptyCallback();
          }
        } else {
          failCallback();
        }
      })
      .catch(() => failCallback());
  }, []);
  const closeDialog = useCallback(() => {
    setDialogOpen(false);
  }, []);
  const chooseAction = useCallback(
    company => {
      //setCompanyAction(company);
      //setCurrentCompany(company);
      //console.log(company);
      editAction({
        data: {
          company_id: company.id,
          company_confirmed_by_email: confirms,
          company_confirmed_by_phone: confirms,
          company_confirmed_by_payment: confirms,
        },
      });
      setDialogOpen(false);
    },
    [confirms, editAction]
  );
  useEffect(() => {
    formRef.current.resetForm({ values: getInitialValues(company) });
  }, [company]);
  return (
    <>
      <CompanySearchDialog
        classes={classes}
        companies={companies}
        isOpen={isDialogOpen}
        handleClose={closeDialog}
        chooseAction={chooseAction}
        title={intl.formatMessage({ id: "COMPANY.CHOOSE.TITLE" })}
      />
      <Formik
        autoComplete="off"
        initialValues={getInitialValues(company)}
        innerRef={formRef}
        onSubmit={(values, { setStatus, setSubmitting, resetForm }) => {
          setTimeout(() => {
            setStatus({
              loading: true,
            });
            const successCallback = () => {
              setDialogOpen(true);
              setStatus({
                loading: false,
              });
            };
            const failCallback = () => {
              setStatus({
                loading: false,
                error: true,
                message: intl.formatMessage({ id: "COMPANY.STATUS.SEARCH_ERROR" }),
              });
            };
            const emptyCallback = () => {
              setStatus({
                loading: false,
                message: intl.formatMessage({ id: "COMPANY.STATUS.NO_FOUND" }),
              });
            };
            searchAction(values, successCallback, emptyCallback, failCallback);
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
          <div noValidate autoComplete="off" className="kt-form" onSubmit={handleSubmit}>
            <Box
              className={classes.paramContainer}
              border={1}
              borderColor="#eeeeee"
              borderRadius={5}
            >
              <div className={innerClasses.title}>
                {`${intl.formatMessage({ id: "COMPANY.SEARCH.TITLE" })}`}
              </div>
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
                  id: "COMPANY.FORM.INN",
                })}
                margin="normal"
                name="inn"
                value={values.inn}
                variant="outlined"
                onBlur={handleBlur}
                onChange={handleChange}
                helperText={touched.short_name && errors.short_name}
                error={Boolean(touched.short_name && errors.short_name)}
              />
              <StatusAlert status={status} />
              <div className={classes.buttonContainer}>
                <ButtonWithLoader
                  onPress={handleSubmit}
                  loading={status && status.loading}
                  disabled={isSearchEmpty(values) || (status && status.loading)}
                >
                  {intl.formatMessage({ id: "COMPANY.SEARCH.BUTTON" })}
                </ButtonWithLoader>
              </div>
            </Box>
          </div>
        )}
      </Formik>
    </>
  );
}

export default injectIntl(CompanySearchForm);
