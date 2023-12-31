import React, { useState, useEffect, useCallback } from "react";
import { MenuItem, TextField, IconButton, Divider, Checkbox, FormControlLabel } from "@material-ui/core";
import useStyles from "../../../pages/home/styles";
import CloseIcon from "@material-ui/icons/Close";
import { connect, ConnectedProps } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { useFormik } from "formik";
import * as Yup from "yup";

import { IAppState } from "../../../store/rootDuck";
import { actions as myFiltersActions } from "../../../store/ducks/myFilters.duck";
import { actions as bidsActions } from "../../../store/ducks/bids.duck";

import CheckBoxParamGroup from "../../../pages/home/bids/components/filter/CheckBoxParamGroup";
import { filterForCreate, filterForSubmit } from "../../../pages/home/myFilters/utils";
import { useSnackbar } from "notistack";
import NumberParam from "../../../pages/home/bids/components/filter/NumberParam";
import ButtonWithLoader from "../../ui/Buttons/ButtonWithLoader";
import { isEqual } from "lodash";
import Modal from "../../ui/Modal";
import CheckBoxOverload from "../../../pages/home/bids/components/filter/CheckBoxOverload";

const FilterBids: React.FC<PropsFromRedux & WrappedComponentProps> = ({
  me,
  intl,
  crops,
  cropParams,
  fetchFilters,
  // loadingFilters,
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

  // clearDelFilter,
  // delFilter,
  // delLoading,
  // delSuccess,
  // delError,

  // clearEditFilter,
  // editFilter,
  // editLoading,
  // editSuccess,
  // editError,

  // openInfoAlert,
  // setOpenInfoAlert,
}) => {
  const [hasUserPointsActive, setUserPointsActive] = useState(false);
  const history = useHistory();
  const classes = useStyles();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [updatedValues, setUpdatedValues] = useState(false);
  const [, , , cropId] = location.pathname.split("/");

  const enumParams: any = cropParams && cropParams.filter(item => item.type === "enum");
  const numberParams: any = cropParams && cropParams.filter(item => item.type === "number");

  const currentFilter = salePurchaseMode === "sale" ? currentSaleFilters[cropId] : currentPurchaseFilters[cropId];

  const setCurrentFilter = useCallback(
    (cropId: number, filter: { [x: string]: any }) => {
      salePurchaseMode === "sale" ? setCurrentSaleFilter(cropId, filter) : setCurrentPurchaseFilter(cropId, filter);
    },
    [salePurchaseMode, setCurrentPurchaseFilter, setCurrentSaleFilter]
  );

  const newCropName = useCallback((): any => {
    const crop = crops ? crops.find(crop => crop.id === +cropId) : undefined;
    const now = new Date();
    const name = crop && `${crop.name} ${now.toLocaleDateString()} - ${now.toLocaleTimeString().slice(0, -3)}`;
    return name;
  }, [cropId, crops]);

  const getInitialValues = useCallback(
    filter => {
      const crop = crops ? crops.find(crop => crop.id === +cropId) : undefined;
      const now = new Date();
      const name = crop ? `${crop.name} ${now.toLocaleDateString()} - ${now.toLocaleTimeString().slice(0, -3)}` : "";
      return filter ? { name, ...filter } : { name };
    },
    [cropId, crops]
  );

  const formik = useFormik({
    initialValues: getInitialValues(currentFilter),
    onSubmit: values => {
      let params = { ...values };
      params.name = values.name && values.name.trim();
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
      min_prepayment_amount: Yup.number().typeError(intl.formatMessage({ id: "YUP.NUMBERS" })),
    }),
  });
  const { resetForm, values, handleChange } = formik;

  const filterSubmit = useCallback(() => {
    let params = { ...values };
    params.name = values.name && values.name.trim();
    if (params.min_prepayment_amount === "100") params.max_payment_term = "";
    params.cropId = cropId;
    setCurrentFilter(+cropId, filterForSubmit(currentFilter, params, newCropName()));
    clearBids();
  }, [values, cropId, currentFilter]);

  const handleSubmit = useCallback(
    (values: any) => {
      let params = { ...values };
      if (params.min_prepayment_amount === "100") params.max_payment_term = "";
      params.name = values.name.trim();
      setCurrentFilter(+cropId, { ...params, cropId: +cropId });
    },
    [cropId, setCurrentFilter]
  );

  const saveValueAndSubmit = useCallback(
    (e: any) => {
      handleChange(e);
      enumParams &&
        enumParams.forEach((param: any) => {
          param.enum.forEach((item, index) => {
            const valueName = `parameter${param.id}enum${index}`;
            if (valueName === e.target.name) {
              setSubmit(true);
            }
          });
        });
    },
    [enumParams]
  );

  useEffect(() => {
    if (updatedValues) {
      filterSubmit();
      setUpdatedValues(false);
    }
  }, [updatedValues]);

  useEffect(() => {
    if (submit) {
      setSubmit(false);
      filterSubmit();
    }
  }, [submit]);

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

  useEffect(() => {
    currentFilter &&
      !isEqual(currentFilter, values) &&
      Object.keys(currentFilter).length > 1 &&
      resetForm({ values: getInitialValues(currentFilter) });
  }, [currentSaleFilters, currentPurchaseFilters]);

  useEffect(() => {
    if (me && me.points && me.points.length) {
      setUserPointsActive(me.points.some(point => point.active === true));
    }
  }, [me]);

  useEffect(() => {
    if (values.min_prepayment_amount === "100") {
      values.max_payment_term = "";
    }
    filterSubmit();
  }, [values.min_prepayment_amount]);

  return (
    <form onSubmit={formik.handleSubmit} autoComplete="off">
      {salePurchaseMode === "sale" && (
        <MenuItem>
          <CheckBoxOverload value={formik.values.overload} handleChange={formik.handleChange} handleSubmit={filterSubmit} />
        </MenuItem>
      )}
      {enumParams &&
        enumParams.map((param: any) => (
          <MenuItem key={param.id}>
            <CheckBoxParamGroup param={param} values={formik.values} handleChange={saveValueAndSubmit} handleSubmit={() => {}} />
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
                <IconButton onClick={() => formik.setFieldValue("max_payment_term", "")} disabled={values.min_prepayment_amount === "100"}>
                  <CloseIcon />
                </IconButton>
              ),
            }}
            autoComplete="off"
            disabled={values.min_prepayment_amount === "100"}
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
              <IconButton
                onClick={() => {
                  formik.setFieldValue("max_full_price", "");
                  setUpdatedValues(true);
                }}
              >
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
              <IconButton
                onClick={() => {
                  formik.setFieldValue("min_full_price", "");
                  setUpdatedValues(true);
                }}
              >
                <CloseIcon />
              </IconButton>
            ),
          }}
          helperText={formik.touched.min_full_price && formik.errors.min_full_price}
          error={Boolean(formik.touched.min_full_price && formik.errors.min_full_price)}
          autoComplete="off"
        />
      </div>

      {salePurchaseMode === "purchase" && (
        <FormControlLabel
          control={
            <Checkbox
              checked={values.min_prepayment_amount === "100"}
              onChange={() => {
                formik.setFieldValue("min_prepayment_amount", values.min_prepayment_amount === "" ? "100" : "");
              }}
            />
          }
          label={"Только с предоплатой"}
          name="fullPrepayment"
        />
      )}

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
              <IconButton
                onClick={() => {
                  formik.setFieldValue("max_destination", "");
                  setUpdatedValues(true);
                }}
              >
                <CloseIcon />
              </IconButton>
            ),
          }}
          disabled={!hasUserPointsActive}
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
              updateValues={() => setUpdatedValues(true)}
            />
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
            createLoading || (me?.tariff_matrix && myFilters && me.tariff_matrix.tariff_limits.max_filters_count - myFilters?.length <= 0)
          }
          onPress={() => {
            if (me) {
              if (!!currentFilter && currentFilter.name === formik.values.name) {
                const crop = crops ? crops.find(crop => crop.id === +cropId) : undefined;
                const now = new Date();
                const name = `${crop ? crop.name : undefined} ${now.toLocaleDateString()} - ${now.toLocaleTimeString().slice(0, -3)}`;
                formik.setFieldValue("name", name);
              }
              formik.handleSubmit();
            } else {
              setOpen(true);
            }
          }}
        >
          {intl.formatMessage({ id: "FILTER.FORM.BUTTON.ADD" })}
        </ButtonWithLoader>
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
          onChange={me && formik.handleChange}
          helperText={formik.touched.name && formik.errors.name}
          error={Boolean(formik.touched.name && formik.errors.name)}
          InputProps={{
            endAdornment: (
              <IconButton onClick={() => me && formik.setFieldValue("name", "")}>
                <CloseIcon />
              </IconButton>
            ),
          }}
        />
      </div>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={"Чтобы продолжить действие с редактированием профиля или объявления, авторизуйтесь!"}
        actions={[
          {
            title: "Cancel",
            onClick: () => setOpen(false),
          },
          {
            title: "OK",
            onClick: () => history.push("/auth"),
          },
        ]}
      />
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
