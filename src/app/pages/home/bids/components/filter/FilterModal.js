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
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSnackbar } from "notistack";

import { actions as myFiltersActions } from "../../../../../store/ducks/myFilters.duck";
import { actions as bidsActions } from "../../../../../store/ducks/bids.duck";

import FilterForm from "./FilterForm";
import ButtonWithLoader from "../../../../../components/ui/Buttons/ButtonWithLoader";
import { isFilterEmpty } from "../../../../../utils";
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
  const innerClasses = useStyles();
  const [valueTabs, setValueTabs] = useState(0);

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
        fetchFilters(salePurchaseMode);
      }
    }
  }, [
    clearCreateFilter,
    createError,
    createSuccess,
    enqueueSnackbar,
    fetchFilters,
    intl,
    me,
    salePurchaseMode,
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
        fetchFilters(salePurchaseMode);
      }
    }
  }, [
    clearDelFilter,
    createSuccess,
    delError,
    delSuccess,
    enqueueSnackbar,
    fetchFilters,
    intl,
    me,
    salePurchaseMode,
  ]);

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

  const newCropName = () => {
    const crop = crops.find(crop => crop.id === cropId);
    const now = new Date();
    const name = `${crop.name} ${now.toLocaleDateString()} - ${now
      .toLocaleTimeString()
      .slice(0, -3)}`;
    return name;
  };

  const formik = useFormik({
    initialValues: getInitialValues(currentFilter),
    onSubmit: (values, { setStatus, setSubmitting }) => {
      //console.log(values);
      //handleSubmit(values, setStatus, setSubmitting);
    },
    validationSchema: Yup.object().shape({
      filter_name: Yup.string().required(intl.formatMessage({ id: "FILTER.FORM.NAME.REQUIRED" })),
    }),
  });
  const { resetForm, values } = formik;

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
            formik={formik}
          />
        </TabPanel>
        <TabPanel value={valueTabs} index={1} classes={{ root: innerClasses.tabPanel }}>
          <MyFilters
            classes={classes}
            handleSubmit={handleSubmit}
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
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  className={innerClasses.textField}
                  helperText={formik.touched.name && formik.errors.name}
                  error={Boolean(formik.touched.name && formik.errors.name)}
                />
                <IconButton onClick={() => formik.setFieldValue("name", "")}>
                  <CloseIcon />
                </IconButton>
              </Grid>
            </Grid>
            <Grid item>
              <Grid container direction="row" justify="center" alignItems="center" spacing={1}>
                <Grid item>
                  <ButtonWithLoader
                    loading={createLoading}
                    disabled={createLoading}
                    onPress={() => {
                      let params = { ...values };
                      delete params.point_prices;
                      params.cropId = cropId;
                      params.bid_type = salePurchaseMode;
                      //console.log(filterForCreate(params, enumParams, numberParams));
                      createFilter(filterForCreate(params, enumParams, numberParams));
                    }}
                  >
                    {intl.formatMessage({ id: "FILTER.FORM.BUTTON.SAVE" })}
                  </ButtonWithLoader>
                </Grid>
                <Grid item>
                  <ButtonWithLoader
                    onPress={() => {
                      values.cropId = cropId;
                      // console.log(values);
                      setCurrentFilter(
                        cropId,
                        filterForSubmit(currentFilter, values, newCropName())
                      );
                      clearBids();
                    }}
                  >
                    {intl.formatMessage({ id: "FILTER.FORM.BUTTON.SUBMIT" })}
                  </ButtonWithLoader>
                </Grid>
                <Grid item>
                  <ButtonWithLoader
                    onPress={() => {
                      setCurrentFilter(cropId, undefined);
                      formik.resetForm({ values: getInitialValues(currentFilter) });
                      clearBids();
                    }}
                    disabled={isFilterEmpty(formik.values, enumParams, numberParams)}
                  >
                    {intl.formatMessage({ id: "FILTER.FORM.BUTTON.RESET" })}
                  </ButtonWithLoader>
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
      clearBids: bidsActions.clearBestRequest,
      clearCreateFilter: myFiltersActions.clearCreate,
      createFilter: myFiltersActions.createRequest,
      clearDelFilter: myFiltersActions.clearDel,
      delFilter: myFiltersActions.delRequest,
      clearEditFilter: myFiltersActions.clearEdit,
      editFilter: myFiltersActions.editRequest,
    }
  ),
  injectIntl
)(FilterModal);
