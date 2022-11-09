import React, { useEffect } from "react";
import { Paper } from "@material-ui/core";
import { connect, ConnectedProps } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { useSnackbar } from "notistack";

import { actions as myFiltersActions } from "../../../store/ducks/myFilters.duck";
import { actions as authActions } from "../../../store/ducks/auth.duck";

import { LayoutSubheader } from "../../../../_metronic/layout/LayoutContext";
import useStyles from "../styles";
import { PricesEdit } from "./components";
import { IAppState } from "../../../store/rootDuck";

const MyFiltersMoneyPage: React.FC<TPropsFromRedux & WrappedComponentProps & RouteComponentProps> = ({
  match,
  intl,
  editSuccess,
  editError,
  clearEdit,
  fetch,
  fetchMe,
  me,
}) => {
  const classes = useStyles();
  let salePurchaseMode: "sale" | "purchase" = "sale";
  if (match.url.indexOf("sale") !== -1) salePurchaseMode = "sale";
  if (match.url.indexOf("purchase") !== -1) salePurchaseMode = "purchase";

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (editSuccess || editError) {
      enqueueSnackbar(
        editSuccess
          ? intl.formatMessage({ id: "NOTISTACK.ERRORS.SAVE_FILTER" })
          : `${intl.formatMessage({ id: "NOTISTACK.ERRORS.ERROR" })} ${editError}`,
        {
          variant: editSuccess ? "success" : "error",
        }
      );
      clearEdit();
      if (editSuccess) fetch(salePurchaseMode);
    }
  }, [clearEdit, editError, editSuccess, enqueueSnackbar, fetch, intl, me, salePurchaseMode]);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  return (
    <Paper className={classes.paperWithForm}>
      <LayoutSubheader
        title={`${intl.formatMessage({ id: "SUBHEADER.PARTS.EDIT" })} ${intl.formatMessage({
          id: "SUBHEADER.PARTS.PRICE",
        })}`}
        breadcrumb={undefined}
        description={undefined}
      />
      <div className={classes.form}>
        <PricesEdit />
      </div>
    </Paper>
  );
};

const connector = connect(
  (state: IAppState) => ({
    me: state.auth.user,
    editSuccess: state.myFilters.editSuccess,
    editError: state.myFilters.editError,
  }),
  {
    fetch: myFiltersActions.fetchRequest,
    fetchMe: authActions.fetchRequest,
    clearEdit: myFiltersActions.clearEdit,
  }
);

type TPropsFromRedux = ConnectedProps<typeof connector>;

export default connector(injectIntl(MyFiltersMoneyPage));
