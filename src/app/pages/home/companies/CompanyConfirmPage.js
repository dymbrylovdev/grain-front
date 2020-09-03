import React, { useEffect, useCallback } from "react";
import { injectIntl } from "react-intl";
import { connect, shallowEqual, useSelector } from "react-redux";

import * as companyDuck from "../../../store/ducks/companies.duck";
import Preloader from "../../../components/ui/Loaders/Preloader";
import { LoadError } from "../../../components/ui/Errors";
import useStyles from "../styles";
import EmailBlock from "./components/comfirm/EmailBlock";
// import PhoneBlock from "./components/comfirm/PhoneBlock";
import PayBlock from "./components/comfirm/PayBlock";

function CompanyConfirmPage({ intl, getCompanyById, companyId }) {
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
  }, [companyId, getCompanyById]);
  useEffect(() => {
    companyAction();
  }, [companyAction, companyId]);
  if (loading) return <Preloader />;
  return (
    <>
      {errors && errors.get ? (
        <LoadError handleClick={companyAction} />
      ) : (
        <>
          <EmailBlock company={company} user={user} classes={classes} />
          {/* <PhoneBlock company={company} user={user} classes={classes} /> */}
          <PayBlock company={company} user={user} classes={classes} />
        </>
      )}
    </>
  );
}

export default injectIntl(connect(null, companyDuck.actions)(CompanyConfirmPage));
