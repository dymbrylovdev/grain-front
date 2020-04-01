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

import { actions as myFiltersActions } from "../../../../../store/ducks/myFilters.duck";
import FilterForm from "./FilterForm";
import ButtonWithLoader from "../../../../../components/ui/Buttons/ButtonWithLoader";
import { isFilterEmpty } from "../../../../../utils";
import MyFilters from "./MyFilters";
import { filterForCreate } from "../../../myFilters/utils";

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
  cropId,
  enumParams,
  numberParams,
  classes,
  intl,
  fetchFilters,
  myFilters,
  loadingFilters,
  clearCreateFilter,
  createFilter,
  createLoading,
  createSuccess,
  clearDelFilter,
  delFilter,
  delLoading,
  delSuccess,
  clearEditFilter,
  editFilter,
  editLoading,
  editSuccess,
}) => {
  const innerClasses = useStyles();
  const [valueTabs, setValueTabs] = useState(0);

  const handleTabsChange = (event, newValue) => {
    setValueTabs(newValue);
  };

  const { filter, crops } = useSelector(
    ({ crops }) => ({
      crops: (crops.crops && crops.crops.data) || [],
      filter: (crops.filters && crops.filters[cropId]) || { crop_id: cropId },
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
    initialValues: getInitialValues(filter),
    onSubmit: (values, { setStatus, setSubmitting }) => {
      console.log(values);
      //handleSubmit(values, setStatus, setSubmitting);
    },
    validationSchema: Yup.object().shape({
      filter_name: Yup.string().required(intl.formatMessage({ id: "FILTER.FORM.NAME.REQUIRED" })),
    }),
  });
  const { resetForm, values } = formik;

  useEffect(() => {
    if (isOpen) {
      resetForm({ values: getInitialValues(filter) });
    }
  }, [cropId, filter, getInitialValues, isOpen, resetForm]);

  useEffect(() => {
    if (!myFilters && !loadingFilters) {
      fetchFilters();
      //delFilter(52);
    }
  }, [delFilter, fetchFilters, loadingFilters, myFilters]);

  return (
    <div className={innerClasses.container}>
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
                            .filter(myFilter => myFilter.crop.id === cropId)
                            .length.toString()
                        }
                        color={
                          !myFilters ||
                          createLoading ||
                          (myFilters &&
                            !myFilters.filter(myFilter => myFilter.crop.id === cropId).length)
                            ? "primary"
                            : "secondary"
                        }
                        className={innerClasses.badge}
                        variant={!myFilters || createLoading ? "dot" : "standard"}
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
              filters={myFilters && myFilters.filter(myFilter => myFilter.crop.id === cropId)}
              cropName={
                crops && crops.find(crop => crop.id === cropId)
                  ? crops.find(crop => crop.id === cropId).name
                  : ""
              }
              savedFilter={filter}
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
                    onClick={() => console.log(values)}
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
                      onPress={() =>
                        createFilter(filterForCreate(values, enumParams, numberParams))
                      }
                    >
                      {intl.formatMessage({ id: "FILTER.FORM.BUTTON.SAVE" })}
                    </ButtonWithLoader>
                  </Grid>
                  <Grid item>
                    <ButtonWithLoader
                      onPress={() => {
                        handleSubmit(values, formik.setStatus, formik.setSubmitting);
                      }}
                    >
                      {intl.formatMessage({ id: "FILTER.FORM.BUTTON.SUBMIT" })}
                    </ButtonWithLoader>
                  </Grid>
                  <Grid item>
                    <ButtonWithLoader
                      onPress={() => {
                        formik.resetForm({ values: getInitialValues(filter) });
                        handleSubmit();
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
    </div>
  );
};

export default compose(
  connect(
    state => ({
      myFilters: state.myFilters.myFilters,
      loadingFilters: state.myFilters.loading,
      createLoading: state.myFilters.createLoading,
      createSuccess: state.myFilters.createSuccess,
      delLoading: state.myFilters.delLoading,
      delSuccess: state.myFilters.delSuccess,
      editLoading: state.myFilters.editLoading,
      editSuccess: state.myFilters.editSuccess,
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
  ),
  injectIntl
)(FilterModal);
