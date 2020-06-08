import React, { useEffect, useCallback } from "react";
import { injectIntl } from "react-intl";
import { connect, useSelector, shallowEqual } from "react-redux";
import { Paper, Button } from "@material-ui/core";
import { useHistory } from "react-router-dom";

import * as companies from "../../../store/ducks/companies.duck";
import useStyles from "../styles";
import CompanyTable from "./components/CompanyTable";
import Preloader from "../../../components/ui/Loaders/Preloader";
import { LoadError } from "../../../components/ui/Errors";
import { LayoutSubheader } from "../../../../_metronic";

function CompaniesListPage({ intl, getCompanies }) {
  const classes = useStyles();
  const history = useHistory();
  const { companies, page, per_page, total, loading, errors } = useSelector(
    ({ companies: { companies, errors } }) => {
      if (!companies) return { companies: [], page: 1, per_page: 20, total: 0, loading: false };
      return {
        companies: companies.data,
        page: companies.page,
        per_page: companies.per_page,
        total: companies.total,
        loading: companies.loading,
        errors: errors || {},
      };
    },
    shallowEqual
  );

  const getCompaniessAction = useCallback(
    page => {
      getCompanies(page);
    },
    [getCompanies]
  );
  useEffect(() => {
    getCompaniessAction(1);
  }, [getCompaniessAction]);

  const handleChangePage = (event, page) => {
    getCompaniessAction(page + 1);
  };
  const paginationData = {
    page,
    per_page,
    total,
    handleChangePage,
  };

  useEffect(() => {
    // eslint-disable-next-line no-unused-expressions
    document.getElementById("kt_aside_close_btn")?.click();
  });

  if (loading) return <Preloader />;
  if (errors.all) return <LoadError handleClick={() => getCompaniessAction(page)} />;
  return (
    <Paper className={classes.tableContainer}>
      <LayoutSubheader title={intl.formatMessage({ id: "SUBMENU.COMPANY.LIST" })} />
      <div className={classes.topMargin}>
        <Button variant="contained" color="primary" onClick={() => history.push("/company/create")}>
          {intl.formatMessage({ id: "COMPANY.BUTTON.ADD" })}
        </Button>
      </div>
      <CompanyTable
        classes={classes}
        companies={companies}
        paginationData={paginationData}
        title={intl.formatMessage({ id: "COMPANY.TABLE.TITLE" })}
      />
    </Paper>
  );
}

export default injectIntl(connect(null, companies.actions)(CompaniesListPage));
