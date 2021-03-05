import React, { useEffect, useState, useCallback } from "react";
import { connect, ConnectedProps } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { TextField, Divider, MenuItem, Button } from "@material-ui/core";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { useFormik } from "formik";
import * as Yup from "yup";

import { actions as myFiltersActions } from "../../../../store/ducks/myFilters.duck";
import { actions as bidsActions } from "../../../../store/ducks/bids.duck";
import { IAppState } from "../../../../store/rootDuck";
import useStyles from "../../styles";
import { IMyFilterItem } from "../../../../interfaces/filters";
import { Skeleton } from "@material-ui/lab";
import { PointsPrices } from ".";
import { itemById } from "../../../../utils/utils";
import { filterForCreate, filterForSubmit } from "../utils";

interface IProps {
  cropId?: number;
}

const PricesEdit: React.FC<IProps &
  TPropsFromRedux &
  WrappedComponentProps &
  RouteComponentProps> = ({
  match,
  intl,
  me,

  cropId,

  selectedFilterId,
  fetchFilters,
  myFilters,
  myFiltersLoading,
  setSelectedFilterId,

  currentSaleFilters,
  currentPurchaseFilters,

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

  crops,
  cropParams,

  setCurrentSaleFilter,
  setCurrentPurchaseFilter,

  clearBids,

  clearPointPrices,
}) => {
  const classes = useStyles();

  const [filterId, setFilterId] = useState("");

  let salePurchaseMode: "sale" | "purchase" = "sale";
  if (match.url.indexOf("sale") !== -1) salePurchaseMode = "sale";
  if (match.url.indexOf("purchase") !== -1) salePurchaseMode = "purchase";

  const currentFilter = myFilters ? itemById(myFilters, +filterId) : undefined;

  const setCurrentFilter = useCallback(
    (cropId: number, filter: { [x: string]: any }) => {
      salePurchaseMode === "sale"
        ? setCurrentSaleFilter(cropId, filter)
        : setCurrentPurchaseFilter(cropId, filter);
    },
    [salePurchaseMode, setCurrentPurchaseFilter, setCurrentSaleFilter]
  );

  const newCropName = useCallback((): any => {
    const crop = crops && cropId ? crops.find(crop => crop.id === cropId) : undefined;
    const now = new Date();
    const name =
      crop && `${crop.name} ${now.toLocaleDateString()} - ${now.toLocaleTimeString().slice(0, -3)}`;
    return name;
  }, [cropId, crops]);

  const getInitialValues = useCallback(
    filter => {
      const crop = crops && cropId ? crops.find(crop => crop.id === cropId) : undefined;
      const now = new Date();
      const name = crop
        ? `${crop.name} ${now.toLocaleDateString()} - ${now.toLocaleTimeString().slice(0, -3)}`
        : "";
      return filter ? { name, ...filter } : { name };
    },
    [cropId, crops]
  );

  const formik = useFormik({
    initialValues: getInitialValues(currentFilter),
    onSubmit: values => {
      let params = { ...values };
      params.name = values.name.trim();
      delete params.point_prices;
      params.cropId = cropId;
      params.bid_type = salePurchaseMode;
    },
    validationSchema: Yup.object().shape({
      name: Yup.string()
        .required(intl.formatMessage({ id: "FILTER.FORM.NAME.REQUIRED" }))
        .trim(),
      max_full_price: Yup.number()
        .min(1000, intl.formatMessage({ id: "YUP.PRICE_OF_1000" }))
        .typeError(intl.formatMessage({ id: "YUP.NUMBERS" })),
      min_full_price: Yup.number()
        .min(1000, intl.formatMessage({ id: "YUP.PRICE_OF_1000" }))
        .typeError(intl.formatMessage({ id: "YUP.NUMBERS" })),
      min_prepayment_amount: Yup.number().typeError(intl.formatMessage({ id: "YUP.NUMBERS" })),
    }),
  });
  const { resetForm, values } = formik;

  const filterSubmit = () => {
    let params = { ...values };
    params.name = values.name.trim();
    if (params.min_prepayment_amount === '100') params.max_payment_term = '';
    params.cropId = cropId;
    if (cropId) setCurrentFilter(cropId, filterForSubmit(currentFilter as any, params, newCropName()));
    clearBids();
  };

  useEffect(() => {
    fetchFilters(salePurchaseMode);
  }, [fetchFilters, me, salePurchaseMode]);

  useEffect(() => {
    if (selectedFilterId) setFilterId(selectedFilterId.toString());
  }, [selectedFilterId]);

  useEffect(() => {
    if (!!myFilters) {
      if (!!cropId) {
        if (salePurchaseMode === "sale") {
          if (currentSaleFilters[cropId]) {
            if (currentSaleFilters[cropId].id) {
              setSelectedFilterId(currentSaleFilters[cropId].id);
            } else {
              if (!!myFilters.find(item => item.crop.id === cropId))
                setSelectedFilterId(myFilters.find(item => item.crop.id === cropId)?.id || 0);
            }
          } else {
            if (!!myFilters.find(item => item.crop.id === cropId))
              setSelectedFilterId(myFilters.find(item => item.crop.id === cropId)?.id || 0);
          }
        }
        if (salePurchaseMode === "purchase") {
          if (currentPurchaseFilters[cropId]) {
            if (currentPurchaseFilters[cropId].id) {
              setSelectedFilterId(currentPurchaseFilters[cropId].id);
            } else {
              if (!!myFilters.find(item => item.crop.id === cropId))
                setSelectedFilterId(myFilters.find(item => item.crop.id === cropId)?.id || 0);
            }
          } else {
            if (!!myFilters.find(item => item.crop.id === cropId))
              setSelectedFilterId(myFilters.find(item => item.crop.id === cropId)?.id || 0);
          }
        }
      } else {
        if (!!myFilters[0] && myFilters[0].id) {
          if (+filterId) {
            setSelectedFilterId(+filterId);
          } else {
            setSelectedFilterId(myFilters[0].id);
          }
        }
      }
    }
  }, [
    cropId,
    currentPurchaseFilters,
    currentSaleFilters,
    filterId,
    myFilters,
    salePurchaseMode,
    setSelectedFilterId,
  ]);

  return (
    <>
      <div className={classes.bottomMargin1}>
        {intl.formatMessage({ id: "MONEY.INTRODUCTION" })}
      </div>
      <div className={classes.textFieldContainer}>
        {!myFilters ? (
          <Skeleton width="100%" height={70} animation="wave" />
        ) : !myFilters.length || !selectedFilterId ? (
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
            name="filterId"
            variant="outlined"
            value={filterId}
            onChange={(e) => {
              setFilterId(e.target.value);
            }}
            className={classes.textField}
          >
            {myFilters
              .filter(item => (cropId ? item.crop.id === cropId : item))
              .map(item => (
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
          !!selectedFilterId &&
          !!+filterId && (
            <PointsPrices
              currentFilter={itemById(myFilters, +filterId) as IMyFilterItem}
              setFilterId={setFilterId}
              newFilter={currentFilter}
              filterSubmit={filterSubmit}
            />
          )}
      {(!myFilters || !selectedFilterId) && (
        <div>
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
    currentSaleFilters: state.myFilters.currentSaleFilters,
    currentPurchaseFilters: state.myFilters.currentPurchaseFilters,

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

    crops: state.crops2.crops,
    cropParams: state.crops2.cropParams,
  }),
  {
    fetchFilters: myFiltersActions.fetchRequest,
    setSelectedFilterId: myFiltersActions.setSelectedFilterId,
    clearCreateFilter: myFiltersActions.clearCreate,
    createFilter: myFiltersActions.createRequest,
    clearDelFilter: myFiltersActions.clearDel,
    delFilter: myFiltersActions.delRequest,
    clearEditFilter: myFiltersActions.clearEdit,
    editFilter: myFiltersActions.editRequest,
    setCurrentSaleFilter: myFiltersActions.setCurrentSaleFilter,
    setCurrentPurchaseFilter: myFiltersActions.setCurrentPurchaseFilter,
    clearBids: bidsActions.clearBestRequest,
    clearPointPrices: myFiltersActions.clearPointPrices,
  }
);

type TPropsFromRedux = ConnectedProps<typeof connector>;

export default connector(withRouter(injectIntl(PricesEdit)));
