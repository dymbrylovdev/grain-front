import React, {useEffect} from "react";
import { injectIntl } from "react-intl";
import {connect, useSelector, shallowEqual } from "react-redux";
import { Paper } from "@material-ui/core";
import { Link } from "react-router-dom";

import * as companies from "../../../store/ducks/companies.duck";
import useStyles from "../styles";
import CompanyTable from "./components/CompanyTable";
import Preloader from "../../../components/ui/Loaders/Preloader";
import { LoadError } from "../../../components/ui/Erros";


function CompaniesListPage({intl, getCompanies}){
    const classes = useStyles();
    const { companies, page, per_page, total, loading, errors } = useSelector(({ companies: {companies} }) => {
        if (!companies) return { companies: [], page: 1, per_page: 20, total: 0, loading: false };
        return {
          companies: companies.data,
          page: companies.page,
          per_page: companies.per_page,
          total: companies.total,
          loading: companies.loading,
          errors: companies.errors || {}
        };
      }, shallowEqual);


      const getCompaniessAction = (page) => {
        getCompanies(page);
      };
      useEffect(() => {
        getCompaniessAction( 1);
      }, []);
    
      const handleChangePage = (event, page) => {
        getCompaniessAction(page + 1);
      };
      const paginationData = {
        page,
        per_page,
        total,
        handleChangePage,
      };

      if (loading) return <Preloader />;
      if (errors.all) return <LoadError handleClick={() => getCompaniessAction(page)} />;
      return (
        <Paper className={classes.tableContainer}>
          <Link to="/company/create">
            <div className={classes.topMargin}>
              <button className={"btn btn-primary btn-elevate kt-login__btn-primary"}>
                {intl.formatMessage({ id: "COMPANY.BUTTON.ADD" })}
              </button>
            </div>
          </Link>
          <CompanyTable
            classes={classes}
            companies={companies}
            paginationData={paginationData}
            title = {intl.formatMessage({id: "COMPANY.TABLE.TITLE"})}
          />
        </Paper>
      )

}

export default injectIntl(connect(null, companies.actions)(CompaniesListPage))
