import React, { useState, useEffect, useCallback } from "react";
import { useSelector, shallowEqual, connect } from "react-redux";
import { compose } from "redux";
import { injectIntl } from "react-intl";
import {
  makeStyles,
  Dialog,
  DialogTitle,
  AppBar,
  Tabs,
  Tab,
  Grid,
  Box,
  Typography,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  Badge,
  Button,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSnackbar } from "notistack";

import { actions as myFiltersActions } from "../../../../../store/ducks/myFilters.duck";
import { actions as bidsActions } from "../../../../../store/ducks/bids.duck";

import FilterForm from "./FilterForm";
import ButtonWithLoader from "../../../../../components/ui/Buttons/ButtonWithLoader";
import MyFilters from "./MyFilters";
import { filterForCreate, filterForSubmit } from "../../../myFilters/utils";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3} style={{ height: "100%" }}>
          {children}
        </Box>
      )}
    </Typography>
  );
}

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const useStyles = makeStyles(theme => ({
  container: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    transition: "10",
  },
  dialogTitle: {
    padding: 0,
  },
  dialog: {
    height: "100%",
  },
  appBar: {
    boxShadow: "none",
    backgroundColor: "white",
    paddingTop: theme.spacing(0.5),
  },
  closeButton: {
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(0.5),
  },
  buttonContainer: {
    margin: theme.spacing(1),
  },
  textField: {
    width: 300,
  },
  badge: {
    paddingRight: theme.spacing(2),
  },
  tabPanel: {
    height: "100%",
  },
}));

const FilterModal = ({
  isOpen,
  handleClose,
  handleSubmit,
  me,
  cropId,
  enumParams,
  numberParams,
  classes,
  intl,
  salePurchaseMode,
  setCurrentFilter,
  currentFilter,
  clearBids,
  fetchFilters,
  myFilters,
  loadingFilters,

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
  const innerClasses = useStyles();
  const [delFilterId, setDelFilterId] = useState(0);
  const [valueTabs, setValueTabs] = useState(0);

  const { crops } = useSelector(
    ({ crops }) => ({
      crops: (crops.crops && crops.crops.data) || [],
    }),
    shallowEqual
  );

  const getInitialValues = useCallback(
    filter => {
      const crop = crops.find(crop => crop.id === cropId);
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
      // console.log(filterForCreate(params, enumParams, numberParams));
      createFilter(filterForCreate(params, enumParams, numberParams));
    },
    validationSchema: Yup.object().shape({
      name: Yup.string()
        .required(intl.formatMessage({ id: "FILTER.FORM.NAME.REQUIRED" }))
        .trim(),
    }),
  });
  const { resetForm, values, handleBlur } = formik;

  const handleTabsChange = (event, newValue) => {
    setValueTabs(newValue);
  };

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
    if (delSuccess || delError) {
      enqueueSnackbar(
        delSuccess
          ? intl.formatMessage({ id: "NOTISTACK.ERRORS.DEL_FILTER" })
          : `${intl.formatMessage({ id: "NOTISTACK.ERRORS.ERROR" })} ${delError}`,
        {
          variant: delSuccess ? "success" : "error",
        }
      );
      clearDelFilter();
      if (delSuccess) {
        // console.log("delFilterId: ", delFilterId);
        // console.log("currentFilter: ", currentFilter);
        if (!!delFilterId && currentFilter && currentFilter.id === delFilterId) {
          setCurrentFilter(cropId, undefined);
          formik.resetForm({ values: getInitialValues(currentFilter) });
          clearBids();
          handleClose();
          setDelFilterId(0);
        }
        fetchFilters(salePurchaseMode);
      }
    }
  }, [
    clearBids,
    clearDelFilter,
    createSuccess,
    cropId,
    currentFilter,
    delError,
    delFilterId,
    delSuccess,
    enqueueSnackbar,
    fetchFilters,
    formik,
    getInitialValues,
    handleClose,
    intl,
    me,
    salePurchaseMode,
    setCurrentFilter,
  ]);

  const newCropName = () => {
    const crop = crops.find(crop => crop.id === cropId);
    const now = new Date();
    const name = `${crop.name} ${now.toLocaleDateString()} - ${now
      .toLocaleTimeString()
      .slice(0, -3)}`;
    return name;
  };

  const handleClear = () => {
    setCurrentFilter(cropId, undefined);
    formik.resetForm({ values: getInitialValues(currentFilter) });
    clearBids();
    handleClose();
  };

  useEffect(() => {
    if (isOpen) {
      resetForm({ values: getInitialValues(currentFilter) });
    }
  }, [cropId, currentFilter, getInitialValues, isOpen, resetForm]);

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      classes={{ paper: innerClasses.dialog }}
    >
      <DialogTitle className={innerClasses.dialogTitle}>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
          className={innerClasses.appBar}
        >
          <Grid item>
            <AppBar position="static" color="default" className={innerClasses.appBar}>
              <Tabs
                value={valueTabs}
                onChange={handleTabsChange}
                indicatorColor="primary"
                textColor="primary"
                aria-label="full width tabs example"
              >
                <Tab
                  label={intl.formatMessage({ id: "FILTER.FORM.TABS.CREATE_FILTER" })}
                  {...a11yProps(0)}
                />

                <Tab
                  icon={
                    <Badge
                      badgeContent={
                        myFilters &&
                        myFilters
                          .filter(
                            myFilter =>
                              myFilter.crop.id === cropId && myFilter.bid_type === salePurchaseMode
                          )
                          .length.toString()
                      }
                      color={
                        !myFilters ||
                        createLoading ||
                        delLoading ||
                        (myFilters &&
                          !myFilters.filter(
                            myFilter =>
                              myFilter.crop.id === cropId && myFilter.bid_type === salePurchaseMode
                          ).length)
                          ? "primary"
                          : "secondary"
                      }
                      className={innerClasses.badge}
                      variant={!myFilters || createLoading || delLoading ? "dot" : "standard"}
                    >
                      {intl.formatMessage({ id: "FILTER.FORM.TABS.MY_FILTERS" })}
                    </Badge>
                  }
                  {...a11yProps(1)}
                />
              </Tabs>
            </AppBar>
          </Grid>
          <Grid item>
            <IconButton onClick={handleClose} className={innerClasses.closeButton}>
              <CloseIcon color="primary" />
            </IconButton>
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogContent dividers>
        <TabPanel value={valueTabs} index={0}>
          <FilterForm
            classes={classes}
            handleSubmit={handleSubmit}
            cropId={cropId}
            enumParams={enumParams}
            numberParams={numberParams}
            openInfoAlert={openInfoAlert}
            setOpenInfoAlert={setOpenInfoAlert}
            salePurchaseMode={salePurchaseMode}
            formik={formik}
          />
        </TabPanel>
        <TabPanel value={valueTabs} index={1} classes={{ root: innerClasses.tabPanel }}>
          <MyFilters
            classes={classes}
            handleSubmit={handleSubmit}
            handleClear={handleClear}
            setDelFilterId={setDelFilterId}
            cropId={cropId}
            enumParams={enumParams}
            numberParams={numberParams}
            filters={
              myFilters &&
              myFilters.filter(
                myFilter => myFilter.crop.id === cropId && myFilter.bid_type === salePurchaseMode
              )
            }
            cropName={
              crops && crops.find(crop => crop.id === cropId)
                ? crops.find(crop => crop.id === cropId).name
                : ""
            }
            savedFilter={currentFilter}
            delFilter={delFilter}
            delLoading={delLoading}
            editFilter={editFilter}
            editLoading={editLoading}
            salePurchaseMode={salePurchaseMode}
          />
        </TabPanel>
      </DialogContent>
      {valueTabs === 0 && (
        <DialogActions className={innerClasses.buttonContainer}>
          <Grid container direction="row" justify="space-between" alignItems="center" spacing={1}>
            <Grid item>
              <Grid container direction="row" justify="center" alignItems="center">
                <TextField
                  autoComplete="off"
                  type="text"
                  label={intl.formatMessage({
                    id: "FILTER.FORM.NAME.INPUT_NAME",
                  })}
                  name="name"
                  value={values.name || ""}
                  variant="outlined"
                  onBlur={e => handleBlur(e)}
                  onChange={formik.handleChange}
                  className={innerClasses.textField}
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
              </Grid>
            </Grid>
            <Grid item>
              <Grid container direction="row" justify="center" alignItems="center" spacing={1}>
                <Grid item>
                  <ButtonWithLoader
                    loading={createLoading}
                    disabled={createLoading || me.tariff.max_filters_count - myFilters?.length <= 0}
                    onPress={() => {
                      if (!!currentFilter && currentFilter.name === formik.values.name) {
                        const crop = crops.find(crop => crop.id === cropId);
                        const now = new Date();
                        const name = `${
                          crop.name
                        } ${now.toLocaleDateString()} - ${now.toLocaleTimeString().slice(0, -3)}`;
                        formik.setFieldValue("name", name);
                      }
                      formik.handleSubmit();
                    }}
                  >
                    {intl.formatMessage({ id: "FILTER.FORM.BUTTON.SAVE" })}
                  </ButtonWithLoader>
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      let params = { ...values };
                      params.name = values.name.trim();
                      params.cropId = cropId;
                      // console.log(values);
                      setCurrentFilter(
                        cropId,
                        filterForSubmit(currentFilter, params, newCropName())
                      );
                      clearBids();
                      handleClose();
                    }}
                  >
                    {intl.formatMessage({ id: "FILTER.FORM.BUTTON.SUBMIT" })}
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleClear}
                    disabled={!currentFilter}
                  >
                    {intl.formatMessage({ id: "FILTER.FORM.BUTTON.RESET" })}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default compose(
  connect(
    state => ({
      me: state.auth.user,
      myFilters: state.myFilters.myFilters,
      loadingFilters: state.myFilters.loading,
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
  ),
  injectIntl
)(FilterModal);
