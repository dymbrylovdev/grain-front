import React, { useState, useEffect, useCallback } from "react";
import { injectIntl } from "react-intl";
import { connect, shallowEqual, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Paper } from "@material-ui/core";

import * as companyDuck from "../../../store/ducks/companies.duck";
import Preloader from "../../../components/ui/Loaders/Preloader";
import { LoadError } from "../../../components/ui/Erros";
import { LayoutSubheader } from "../../../../_metronic/layout/LayoutContext";
import useStyles from "../styles";
import EmailBlock from "./components/comfirm/EmailBlock";
import PhoneBlock from "./components/comfirm/PhoneBlock";
import PayBlock from "./components/comfirm/PayBlock";

function CompanyConfirmPage({ intl, getCompanyById }) {
  const { companyId } = useParams();
  const classes = useStyles();
  const { company, loading, errors, user } = useSelector(
    ({ companies: { currentCompany, errors }, auth: { user } }) => ({
      company: currentCompany || {},
      loading: currentCompany && currentCompany.loading,
      errors: errors || {},
      user,
    }),
    shallowEqual
  );
  const companyAction = useCallback(() => {
    getCompanyById(companyId);
  }, [companyId]);
  useEffect(() => {
    companyAction();
  }, [companyId]);
  if (loading) return <Preloader />;
  return (
    <>
      {<LayoutSubheader title={intl.formatMessage({ id: "COMPANY.CONFIRM.MAIN.TITLE" })} />}
      {errors && errors.get ? (
        <LoadError handleClick={companyAction} />
      ) : (
        <Paper className={classes.container}>
          <EmailBlock company={company} user={user} classes={classes} />
          <PhoneBlock company={company} user={user} classes={classes} />
          <PayBlock company={company} user={user} classes={classes} />
          

        </Paper>
      )}
    </>
  );
}

export default injectIntl(connect(null, companyDuck.actions)(CompanyConfirmPage));
