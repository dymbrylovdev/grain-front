import React, { useEffect, useCallback } from "react";
import { MenuItem, Collapse, Button } from "@material-ui/core";
import { Col } from "react-bootstrap";
import { connect, ConnectedProps, shallowEqual, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { useFormik } from "formik";
import * as Yup from "yup";

import { IAppState } from "../../../store/rootDuck";
import { actions as myFiltersActions } from "../../../store/ducks/myFilters.duck";
import { actions as bidsActions } from "../../../store/ducks/bids.duck";

import CheckBoxParamGroup from "../../../pages/home/bids/components/filter/CheckBoxParamGroup";
import { filterForCreate, filterForSubmit } from "../../../pages/home/myFilters/utils";

const FilterBids: React.FC<PropsFromRedux & WrappedComponentProps> = ({
  me,
  intl,
  crops,
  cropParams,
  fetchFilters,
  loadingFilters,
  myFilters,
  clearBids,

  salePurchaseMode,
  currentSaleFilters,
  currentPurchaseFilters,
  setCurrentSaleFilter,
  setCurrentPurchaseFilter,

  clearCreateFilter,
  createdFilterId,
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

  openInfoAlert,
  setOpenInfoAlert,
}) => {
  const location = useLocation();

  const [, , route, cropId] = location.pathname.split("/");

  const enumParams: any = cropParams && cropParams.filter(item => item.type === "enum");
  const numberParams: any = cropParams && cropParams.filter(item => item.type === "number");

  const setCurrentFilter =
    salePurchaseMode === "sale" ? setCurrentSaleFilter : setCurrentPurchaseFilter;

  const currentFilter =
    salePurchaseMode === "sale" ? currentSaleFilters[cropId] : currentPurchaseFilters[cropId];

  console.log(currentFilter);

  const getInitialValues = useCallback(
    filter => {
      const crop = crops ? crops.find(crop => crop.id === +cropId) : undefined;
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
      createFilter(filterForCreate(params, enumParams, numberParams));
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
    }),
  });
  const { resetForm, values, handleBlur } = formik;

  const newCropName = (): any => {
    const crop = crops ? crops.find(crop => crop.id === +cropId) : undefined;
    const now = new Date();
    const name =
      crop && `${crop.name} ${now.toLocaleDateString()} - ${now.toLocaleTimeString().slice(0, -3)}`;
    return name;
  };

  useEffect(() => {
    resetForm({ values: getInitialValues(currentFilter) });
  }, [cropId, currentFilter, getInitialValues, resetForm]);

  return (
    <>
      {enumParams &&
        //@ts-ignore
        enumParams.map(param => (
          <MenuItem key={param.id}>
            <CheckBoxParamGroup
              param={param}
              values={formik.values}
              handleChange={formik.handleChange}
            />
          </MenuItem>
        ))}

      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          let params = { ...values };
          params.name = values.name.trim();
          params.cropId = cropId;
          setCurrentFilter(
            +cropId, 
            filterForSubmit(currentFilter, params, newCropName())
          );
          clearBids();
          // handleClose();
        }}
      >
        {intl.formatMessage({ id: "FILTER.FORM.BUTTON.SUBMIT" })}
      </Button>
    </>
  );
};

const connector = connect(
  (state: IAppState) => ({
    me: state.auth.user,

    crops: state.crops2.crops,
    cropParams: state.crops2.cropParams,

    myFilters: state.myFilters.myFilters,
    loadingFilters: state.myFilters.loading,

    salePurchaseMode: state.leftMenu.salePurchaseMode,
    currentSaleFilters: state.myFilters.currentSaleFilters,
    currentPurchaseFilters: state.myFilters.currentPurchaseFilters,
    setCurrentSaleFilter: myFiltersActions.setCurrentSaleFilter,
    setCurrentPurchaseFilter: myFiltersActions.setCurrentPurchaseFilter,

    createdFilterId: state.myFilters.createdFilterId,
    createLoading: state.myFilters.createLoading,
    createSuccess: state.myFilters.createSuccess,
    createError: state.myFilters.createError,

    delLoading: state.myFilters.delLoading,
    delSuccess: state.myFilters.delSuccess,
    delError: state.myFilters.delError,

    editLoading: state.myFilters.editLoading,
    editSuccess: state.myFilters.editSuccess,
    editError: state.myFilters.editError,

    openInfoAlert: state.myFilters.openInfoAlert,
  }),
  {
    fetchFilters: myFiltersActions.fetchRequest,
    clearBids: bidsActions.clearBestRequest,
    clearCreateFilter: myFiltersActions.clearCreate,
    createFilter: myFiltersActions.createRequest,
    clearDelFilter: myFiltersActions.clearDel,
    delFilter: myFiltersActions.delRequest,
    clearEditFilter: myFiltersActions.clearEdit,
    editFilter: myFiltersActions.editRequest,
    setOpenInfoAlert: myFiltersActions.setOpenInfoAlert,
  }
);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(injectIntl(FilterBids));
