import React, { useEffect, useCallback, useState } from "react";
import { useSelector, connect, shallowEqual } from "react-redux";
import { injectIntl } from "react-intl";
import { Redirect } from "react-router-dom";

import * as companies from "../../../store/ducks/companies.duck";
import Preloader from "../../../components/ui/Loaders/Preloader";
import { LoadError } from "../../../components/ui/Errors";
import { LayoutSubheader } from "../../../../_metronic/layout/LayoutContext";
import CompanyForm from "./components/CompanyForm";
import useStyles from "../styles";

function CompanyPage({ intl, match: { params }, getCompanyById, createCompany, editCompany }) {
  const classes = useStyles();
  const [isRedirect, setRedirect] = useState(false);

  const { companyId } = params;
  const { company, loading, errors } = useSelector(
    ({ companies: { currentCompany, errors } }) => ({
      company: currentCompany || {},
      loading: currentCompany && currentCompany.loading,
      errors: errors || {},
    }),
    shallowEqual
  );
  const companyAction = useCallback(() => {
    getCompanyById(companyId);
  }, [companyId, getCompanyById]);

  const createAction = (values, setStatus, setSubmitting) => {
    setTimeout(() => {
      setStatus({ loading: true });
      const params = values;
      const successCallback = () => {
        setStatus({ loading: false });
        setStatus({
          error: false,
          message: intl.formatMessage({
            id: "COMPANY.STATUS.CREATE",
          }),
        });
        setRedirect(true);
      };
      const failCallback = error => {
        setSubmitting(false);
        setStatus({
          loading: false,
          error: true,
          message:
            error ||
            intl.formatMessage({
              id: "COMPANY.STATUS.ERROR",
            }),
        });
      };
      createCompany(params, successCallback, failCallback);
    }, 1000);
  };

  const editAction = (values, setStatus, setSubmitting) => {
    //console.log("editValues", values);
    setTimeout(() => {
      setStatus({ loading: true });
      const params = values;
      const successCallback = () => {
        setStatus({
          loading: false,
          error: false,
          message: intl.formatMessage({
            id: "COMPANY.STATUS.CREATE",
          }),
        });
      };
      const failCallback = error => {
        setSubmitting(false);
        setStatus({
          loading: false,
          error: true,
          message:
            error ||
            intl.formatMessage({
              id: "COMPANY.STATUS.ERROR",
            }),
        });
      };
      editCompany(companyId, params, successCallback, failCallback);
    }, 1000);
  };

  const submitAction = companyId ? editAction : createAction;

  useEffect(() => {
    companyAction();
  }, [companyAction, companyId]);

  const title = companyId
    ? intl.formatMessage({ id: "COMPANY.EDIT.TITLE" })
    : intl.formatMessage({ id: "COMPANY.CREATE.TITLE" });
  if (isRedirect) return <Redirect to="/companyList" />;
  if (loading) return <Preloader />;
  return (
    <>
      {title && <LayoutSubheader title={title} />}
      {errors && errors.get ? (
        <LoadError handleClick={companyAction} />
      ) : (
        <CompanyForm
          classes={classes}
          company={company}
          submitAction={submitAction}
          companyId={companyId}
        />
      )}
    </>
  );
}

export default injectIntl(connect(null, companies.actions)(CompanyPage));
