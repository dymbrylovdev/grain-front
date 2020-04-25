import React, { useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { TextField, Divider, MenuItem, Button } from "@material-ui/core";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { useFormik } from "formik";

import { actions as myFiltersActions } from "../../../../store/ducks/myFilters.duck";
import { IAppState } from "../../../../store/rootDuck";
import useStyles from "../../styles";
import { IMyFilterItem } from "../../../../interfaces/filters";
import { Skeleton } from "@material-ui/lab";
import { PointsPrices } from ".";
import { itemById } from "../../../../utils/utils";

const PricesEdit: React.FC<TPropsFromRedux & WrappedComponentProps & RouteComponentProps> = ({
  match,
  intl,
  me,

  selectedFilterId,
  fetchFilters,
  myFilters,
  myFiltersLoading,

  clearCreateFilter,
  createFilter,
  createLoading,
  createSuccess,
  createError,

  clearDelFilter,
  delFilter,
  delLoading,
  delSuccess,
  delError,

  clearEditFilter,
  editFilter,
  editLoading,
  editSuccess,
  editError,
}) => {
  const classes = useStyles();
  let salePurchaseMode: "sale" | "purchase" = "sale";
  if (match.url.indexOf("sale") !== -1) salePurchaseMode = "sale";
  if (match.url.indexOf("purchase") !== -1) salePurchaseMode = "purchase";

  const { values, handleChange, resetForm } = useFormik({
    initialValues: { filter_id: "" },
    onSubmit: values => {
      //console.log(values);
      //handleSubmit(values, setStatus, setSubmitting);
    },
  });

  useEffect(() => {
    fetchFilters(salePurchaseMode);
  }, [fetchFilters, me, salePurchaseMode]);

  useEffect(() => {
    if (selectedFilterId) resetForm({ values: { filter_id: selectedFilterId.toString() } });
  }, [resetForm, selectedFilterId]);

  return (
    <>
      <div className={classes.bottomMargin1}>
        {intl.formatMessage({ id: "MONEY.INTRODUCTION" })}
      </div>
      <div className={classes.textFieldContainer}>
        {!myFilters ? (
          <Skeleton width="100%" height={70} animation="wave" />
        ) : !myFilters.length ? (
          <div className={classes.bottomMargin1}>
            {intl.formatMessage({ id: "MONEY.NO_FILTERS" })}
          </div>
        ) : (
          <TextField
            select
            label={intl.formatMessage({
              id: "FILTER",
            })}
            margin="normal"
            name="filter_id"
            variant="outlined"
            value={values.filter_id}
            onChange={handleChange}
            className={classes.textField}
          >
            {myFilters.map(item => (
              <MenuItem key={item.id} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
          </TextField>
        )}
      </div>
      {!myFilters
        ? me?.points.map((point, index) => (
            <div key={index}>
              <div className={classes.textFieldContainer}>
                <Skeleton width="100%" height={70} animation="wave" />
              </div>
              {index !== me?.points.length - 1 && <Divider />}
            </div>
          ))
        : !!myFilters.length &&
          +values.filter_id && (
            <PointsPrices currentFilter={itemById(myFilters, +values.filter_id) as IMyFilterItem} />
          )}
      {!myFilters && (
        <div className={classes.bottomMargin2}>
          <div className={classes.bottomButtonsContainer}>
            <Button className={classes.button} variant="contained" color="primary" disabled>
              {intl.formatMessage({ id: "ALL.BUTTONS.SAVE" })}
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

const connector = connect(
  (state: IAppState) => ({
    selectedFilterId: state.myFilters.selectedFilterId,
    me: state.auth.user,
    myFilters: state.myFilters.myFilters,
    myFiltersLoading: state.myFilters.loading,
    createLoading: state.myFilters.createLoading,
    createSuccess: state.myFilters.createSuccess,
    createError: state.myFilters.createError,
    delLoading: state.myFilters.delLoading,
    delSuccess: state.myFilters.delSuccess,
    delError: state.myFilters.delError,
    editLoading: state.myFilters.editLoading,
    editSuccess: state.myFilters.editSuccess,
    editError: state.myFilters.editError,
  }),
  {
    fetchFilters: myFiltersActions.fetchRequest,
    clearCreateFilter: myFiltersActions.clearCreate,
    createFilter: myFiltersActions.createRequest,
    clearDelFilter: myFiltersActions.clearDel,
    delFilter: myFiltersActions.delRequest,
    clearEditFilter: myFiltersActions.clearEdit,
    editFilter: myFiltersActions.editRequest,
  }
);

type TPropsFromRedux = ConnectedProps<typeof connector>;

export default connector(withRouter(injectIntl(PricesEdit)));
