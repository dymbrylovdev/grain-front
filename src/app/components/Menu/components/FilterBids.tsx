import React, { useEffect, useCallback } from "react";
import { MenuItem, Collapse, Button, TextField, IconButton, Divider } from "@material-ui/core";
import useStyles from "../../../pages/home/styles";
import CloseIcon from "@material-ui/icons/Close";
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
import NumberFormatCustom from "../../NumberFormatCustom/NumberFormatCustom";
import { useSnackbar } from "notistack";
import NumberParam from "../../../pages/home/bids/components/filter/NumberParam";
import ButtonWithLoader from "../../ui/Buttons/ButtonWithLoader";

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
  const classes = useStyles();
  const location = useLocation();

  const [, , route, cropId] = location.pathname.split("/");

  const enumParams: any = cropParams && cropParams.filter(item => item.type === "enum");
  const numberParams: any = cropParams && cropParams.filter(item => item.type === "number");

  const currentFilter =
    salePurchaseMode === "sale" ? currentSaleFilters[cropId] : currentPurchaseFilters[cropId];

  const setCurrentFilter = useCallback(
    (cropId: number, filter: { [x: string]: any }) => {
      salePurchaseMode === "sale"
        ? setCurrentSaleFilter(cropId, filter)
        : setCurrentPurchaseFilter(cropId, filter);
    },
    [salePurchaseMode, setCurrentPurchaseFilter, setCurrentSaleFilter]
  );

  const newCropName = useCallback((): any => {
    const crop = crops ? crops.find(crop => crop.id === +cropId) : undefined;
    const now = new Date();
    const name =
      crop && `${crop.name} ${now.toLocaleDateString()} - ${now.toLocaleTimeString().slice(0, -3)}`;
    return name;
  }, [cropId, crops]);

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

  const filterSubmit = () => {
    let params = { ...values };
    params.name = values.name.trim();
    params.cropId = cropId;
    console.log("PARAMS===>", params);
    setCurrentFilter(+cropId, filterForSubmit(currentFilter, params, newCropName()));
    clearBids();
  };

  const handleSubmit = useCallback(
    (values: any) => {
      let params = { ...values };
      params.name = values.name.trim();
      setCurrentFilter(+cropId, { ...params, cropId: +cropId });
    },
    [cropId, setCurrentFilter]
  );

  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    if (createSuccess || createError) {
      enqueueSnackbar(
        createSuccess
          ? intl.formatMessage({ id: "NOTISTACK.ERRORS.CREATE_FILTER" })
          : `${intl.formatMessage({ id: "NOTISTACK.ERRORS.ERROR" })} ${createError}`,
        {
          variant: createSuccess ? "success" : "error",
        }
      );
      clearCreateFilter();
      if (createSuccess) {
        if (createdFilterId) {
          handleSubmit({ ...values, id: createdFilterId });
        }
        //@ts-ignore
        fetchFilters(salePurchaseMode);
      }
    }
  }, [
    clearCreateFilter,
    createError,
    createSuccess,
    createdFilterId,
    enqueueSnackbar,
    fetchFilters,
    handleSubmit,
    intl,
    salePurchaseMode,
    values,
  ]);

  useEffect(() => {
    resetForm({ values: getInitialValues(currentFilter) });
  }, [currentFilter, getInitialValues, resetForm]);

  console.log("VALUES===>", values);

  return (
    <form onSubmit={formik.handleSubmit} autoComplete="off">
      {enumParams &&
        //@ts-ignore
        enumParams.map(param => (
          <MenuItem key={param.id}>
            <CheckBoxParamGroup
              param={param}
              values={formik.values}
              handleChange={formik.handleChange}
              handleSubmit={filterSubmit}
            />
          </MenuItem>
        ))}

      {salePurchaseMode === "purchase" && (
        <div className={classes.textFieldContainer}>
          <TextField
            type="text"
            label="Макс. срок расчета"
            margin="normal"
            name="max_payment_term"
            value={formik.values.max_payment_term || ""}
            variant="outlined"
            onBlur={filterSubmit}
            onChange={e => {
              let newValue = e.target.value;
              if (+newValue < 0) {
                newValue = "0";
              }
              if (+newValue > 999) {
                newValue = "999";
              }
              formik.setFieldValue("max_payment_term", newValue);
            }}
            InputProps={{
              // inputComponent: NumberFormatCustom,
              endAdornment: (
                <IconButton onClick={() => formik.setFieldValue("max_payment_term", "")}>
                  <CloseIcon />
                </IconButton>
              ),
            }}
            autoComplete="off"
          />
        </div>
      )}

      <div className={classes.textFieldContainer}>
        <TextField
          type="text"
          label={intl.formatMessage({
            id: "FILTER.FORM.MAX_PRICE",
          })}
          margin="normal"
          name="max_full_price"
          value={formik.values.max_full_price || ""}
          variant="outlined"
          onBlur={filterSubmit}
          //@ts-ignore
          onChange={formik.handleChange("max_full_price")}
          InputProps={{
            // inputComponent: NumberFormatCustom,
            endAdornment: (
              <IconButton onClick={() => formik.setFieldValue("max_full_price", "")}>
                <CloseIcon />
              </IconButton>
            ),
          }}
          helperText={formik.touched.max_full_price && formik.errors.max_full_price}
          error={Boolean(formik.touched.max_full_price && formik.errors.max_full_price)}
          autoComplete="off"
        />
      </div>
      <div className={classes.textFieldContainer}>
        <TextField
          type="text"
          label={intl.formatMessage({
            id: "FILTER.FORM.MIN_PRICE",
          })}
          margin="normal"
          name="min_full_price"
          value={formik.values.min_full_price || ""}
          variant="outlined"
          onBlur={filterSubmit}
          //@ts-ignore
          onChange={formik.handleChange("min_full_price")}
          InputProps={{
            // inputComponent: NumberFormatCustom,
            endAdornment: (
              <IconButton onClick={() => formik.setFieldValue("min_full_price", "")}>
                <CloseIcon />
              </IconButton>
            ),
          }}
          helperText={formik.touched.min_full_price && formik.errors.min_full_price}
          error={Boolean(formik.touched.min_full_price && formik.errors.min_full_price)}
          autoComplete="off"
        />
      </div>
      <div className={classes.textFieldContainer}>
        <TextField
          type="text"
          label={intl.formatMessage({
            id: "FILTER.FORM.MAX_DESTINATION",
          })}
          margin="normal"
          name="max_destination"
          value={formik.values.max_destination || ""}
          variant="outlined"
          onBlur={filterSubmit}
          //@ts-ignore
          onChange={formik.handleChange("max_destination")}
          InputProps={{
            // inputComponent: NumberFormatCustom,
            endAdornment: (
              <IconButton onClick={() => formik.setFieldValue("max_destination", "")}>
                <CloseIcon />
              </IconButton>
            ),
          }}
          autoComplete="off"
        />
      </div>

      <Divider style={{ marginTop: 10, marginBottom: 18 }} />

      {numberParams &&
        numberParams.map((param, index) => (
          <div key={param.id}>
            <NumberParam
              param={param}
              values={formik.values}
              handleChange={formik.handleChange}
              clearAction={formik.setFieldValue}
              handleSubmit={filterSubmit}
            />
            {/* {index !== numberParams.length - 1 && <Divider />} */}
            {/* <Divider /> */}
          </div>
        ))}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "column",
          marginBottom: 15,
        }}
      >
        <ButtonWithLoader
          loading={createLoading}
          disabled={
            createLoading ||
            (me?.tariff_matrix &&
              myFilters &&
              me.tariff_matrix.max_filters_count - myFilters?.length <= 0)
          }
          onPress={() => {
            if (!!currentFilter && currentFilter.name === formik.values.name) {
              const crop = crops ? crops.find(crop => crop.id === +cropId) : undefined;
              const now = new Date();
              const name = `${
                crop ? crop.name : undefined
              } ${now.toLocaleDateString()} - ${now.toLocaleTimeString().slice(0, -3)}`;
              formik.setFieldValue("name", name);
            }
            formik.handleSubmit();
          }}
        >
          {/* {intl.formatMessage({ id: "FILTER.FORM.BUTTON.SAVE" })} */}
          Сохранить фильтр
        </ButtonWithLoader>

        {/* <Button
          style={{ marginTop: 15 }}
          variant="contained"
          color="primary"
          onClick={() => {
            let params = { ...values };
            params.name = values.name.trim();
            params.cropId = cropId;
            setCurrentFilter(+cropId, filterForSubmit(currentFilter, params, newCropName()));
            clearBids();
          }}
        >
          {intl.formatMessage({ id: "FILTER.FORM.BUTTON.SUBMIT" })}
        </Button> */}
      </div>

      <div className={classes.textFieldContainer} style={{ paddingBottom: 10 }}>
        <TextField
          style={{ width: 500, marginTop: 10, marginBottom: 10 }}
          autoComplete="off"
          type="text"
          label={intl.formatMessage({
            id: "FILTER.FORM.NAME.INPUT_NAME",
          })}
          name="name"
          value={values.name || ""}
          variant="outlined"
          onBlur={filterSubmit}
          onChange={formik.handleChange}
          helperText={formik.touched.name && formik.errors.name}
          error={Boolean(formik.touched.name && formik.errors.name)}
          InputProps={{
            endAdornment: (
              <IconButton onClick={() => formik.setFieldValue("name", "")}>
                <CloseIcon />
              </IconButton>
            ),
          }}
        />
      </div>

      {/* <Button
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
      </Button> */}
    </form>
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
    setCurrentSaleFilter: myFiltersActions.setCurrentSaleFilter,
    setCurrentPurchaseFilter: myFiltersActions.setCurrentPurchaseFilter,
  }
);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(injectIntl(FilterBids));
