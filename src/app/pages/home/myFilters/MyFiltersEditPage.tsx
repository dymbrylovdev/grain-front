import React, { useEffect, useState } from "react";
import { compose } from "redux";
import { connect, ConnectedProps } from "react-redux";
import { RouteComponentProps, useHistory } from "react-router-dom";
import {
  makeStyles,
  TextField,
  Divider,
  IconButton,
  Grid,
  Paper,
  MenuItem,
  Button,
} from "@material-ui/core";
import { Row, Col } from "react-bootstrap";
import { injectIntl, WrappedComponentProps } from "react-intl";
import CloseIcon from "@material-ui/icons/Close";
import { useSnackbar } from "notistack";
import { Formik } from "formik";
import * as Yup from "yup";

import { actions as myFiltersActions } from "../../../store/ducks/myFilters.duck";
import { actions as cropsActions } from "../../../store/ducks/crops2.duck";
import AlertDialog from "../../../components/ui/Dialogs/AlertDialog";
import ButtonWithLoader from "../../../components/ui/Buttons/ButtonWithLoader";
import CheckBoxParamGroup from "../bids/components/filter/CheckBoxParamGroup";
import { fromApiToFilter, filterForCreate } from "./utils";
import NumberParam from "../bids/components/filter/NumberParam";
import { IAppState } from "../../../store/rootDuck";
import useStyles from "../styles";
import Preloader from "../../../components/ui/Loaders/Preloader";
import { LayoutSubheader } from "../../../../_metronic/layout/LayoutContext";
import { IMyFilterItem } from "./interfaces";
import { OutlinedRedButton } from "../../../components/ui/Buttons/RedButtons";

const useInnerStyles = makeStyles(theme => ({
  buttonContainer: {
    marginTop: theme.spacing(1),
  },
  closeContainer: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  textFieldContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  xButton: {
    paddingRight: theme.spacing(0),
  },
}));

const MyFiltersEditPage: React.FC<TPropsFromRedux &
  WrappedComponentProps &
  RouteComponentProps<{ id: string }>> = ({
  match: {
    params: { id },
  },
  match,
  intl,

  fetchFilters,
  myFilters,
  myFiltersLoading,

  fetchCrops,
  crops,
  cropsLoading,

  clearCropParams,
  fetchCropParams,
  cropParams,
  cropParamsLoading,

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
  const innerClasses = useInnerStyles();
  const classes = useStyles();
  const history = useHistory();
  const isEditable = match.url.indexOf("view") === -1;

  const [isAlertOpen, setAlertOpen] = useState(false);
  const [formikErrored, setFormikErrored] = useState(false);

  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    if (formikErrored) {
      enqueueSnackbar(intl.formatMessage({ id: "NOTISTACK.ERRORS.EMPTY_FIELDS" }), {
        variant: "error",
      });
      setFormikErrored(false);
    }
  }, [enqueueSnackbar, formikErrored, intl]);

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
    }
  }, [clearCreateFilter, createError, createSuccess, enqueueSnackbar, intl]);

  useEffect(() => {
    if (delError) {
      enqueueSnackbar(`${intl.formatMessage({ id: "NOTISTACK.ERRORS.ERROR" })} ${delError}`, {
        variant: "error",
      });
      setAlertOpen(false);
      clearDelFilter();
    }
  }, [clearDelFilter, delError, delSuccess, enqueueSnackbar, intl]);

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
      clearEditFilter();
    }
  }, [clearEditFilter, editError, editSuccess, enqueueSnackbar, intl]);

  useEffect(() => {
    if (createSuccess || editSuccess || delSuccess) history.push("/user/filters");
  }, [createSuccess, delSuccess, editSuccess, history]);

  useEffect(() => {
    if (!myFilters && !myFiltersLoading) {
      fetchFilters();
    }
  }, [delFilter, fetchFilters, myFiltersLoading, myFilters]);

  useEffect(() => {
    if (!crops && !cropsLoading) {
      fetchCrops();
    }
  }, [delFilter, fetchCrops, cropsLoading, crops]);

  useEffect(() => {
    if (myFilters && +id) {
      const myFilter = myFilters.find(item => item.id === +id);
      if (myFilter) fetchCropParams({ cropId: myFilter.crop.id });
    }
    return () => {
      clearCropParams();
    };
  }, [crops, myFilters, id, fetchCropParams, clearCropParams]);

  if (!myFilters || !crops) return <Preloader />;

  return (
    <Paper className={classes.container}>
      <LayoutSubheader
        title={`${
          +id
            ? isEditable
              ? intl.formatMessage({ id: "SUBHEADER.PARTS.EDIT" })
              : intl.formatMessage({ id: "SUBHEADER.PARTS.VIEW" })
            : intl.formatMessage({ id: "SUBHEADER.PARTS.CREATE" })
        } ${intl.formatMessage({ id: "SUBHEADER.PARTS.FILTER" })}`}
        breadcrumb={undefined}
        description={undefined}
      />
      <Formik
        initialValues={
          +id
            ? fromApiToFilter(myFilters.find(item => item.id === +id) as IMyFilterItem)
            : { name: "" }
        }
        onSubmit={(values, { setStatus, setSubmitting }) => {
          cropParams &&
            (+id
              ? editFilter({
                  id: myFilters.find(item => item.id === +id)?.id as number,
                  data: filterForCreate(
                    values,
                    cropParams.filter(item => item.type === "enum"),
                    cropParams.filter(item => item.type === "number")
                  ),
                })
              : createFilter(
                  filterForCreate(
                    values,
                    cropParams.filter(item => item.type === "enum"),
                    cropParams.filter(item => item.type === "number")
                  )
                ));
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string().required(intl.formatMessage({ id: "FILTER.FORM.NAME.REQUIRED" })),
        })}
      >
        {({
          values,
          status,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          resetForm,
          initialValues,
          setFieldValue,
        }) => {
          return (
            <div className={classes.form}>
              <TextField
                type="text"
                label={intl.formatMessage({
                  id: "FILTER.FORM.NAME.INPUT_NAME",
                })}
                margin="normal"
                name="name"
                value={values.name || ""}
                variant="outlined"
                onBlur={handleBlur}
                onChange={handleChange}
                InputProps={
                  isEditable
                    ? {
                        endAdornment: (
                          <IconButton onClick={() => setFieldValue("name", "")}>
                            <CloseIcon />
                          </IconButton>
                        ),
                      }
                    : undefined
                }
                helperText={touched.name && errors.name}
                error={Boolean(touched.name && errors.name)}
                disabled={!isEditable}
              />

              <TextField
                select
                label={intl.formatMessage({
                  id: "FILTER.FORM.NAME.CROP",
                })}
                margin="normal"
                name="crop_id"
                value={values.crop_id || 0}
                variant="outlined"
                onBlur={handleBlur}
                onChange={e => {
                  setFieldValue("crop_id", +e.target.value);
                  +e.target.value
                    ? fetchCropParams({ cropId: +e.target.value })
                    : clearCropParams();
                }}
                disabled={id !== "new" || cropParamsLoading}
              >
                <MenuItem value={0}>Не выбрано</MenuItem>
                {crops.map(item => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </TextField>

              <div className={classes.tableTitle}>
                {!cropParams ? (
                  cropParamsLoading ? (
                    <Preloader size={24} />
                  ) : (
                    <div style={{ textAlign: "center" }}>
                      {intl.formatMessage({
                        id: "FILTER.FORM.CROPS.EMPTY",
                      })}
                    </div>
                  )
                ) : (
                  <div>
                    <Row>
                      {cropParams
                        .filter(item => item.type === "enum")
                        .map(param => (
                          <Col key={param.id}>
                            <CheckBoxParamGroup
                              param={param}
                              values={values}
                              handleChange={handleChange}
                              isEditable={isEditable}
                            />
                          </Col>
                        ))}
                    </Row>

                    <TextField
                      type="text"
                      label={intl.formatMessage({
                        id: "FILTER.FORM.MAX_PRICE",
                      })}
                      margin="normal"
                      name="max_full_price"
                      value={values.max_full_price || ""}
                      variant="outlined"
                      onBlur={handleBlur}
                      onChange={handleChange("max_full_price")}
                      InputProps={
                        isEditable
                          ? {
                              endAdornment: (
                                <IconButton onClick={() => setFieldValue("max_full_price", "")}>
                                  <CloseIcon />
                                </IconButton>
                              ),
                            }
                          : undefined
                      }
                      disabled={!isEditable}
                    />

                    <TextField
                      type="text"
                      label={intl.formatMessage({
                        id: "FILTER.FORM.MAX_DESTINATION",
                      })}
                      margin="normal"
                      name="max_destination"
                      value={values.max_destination || ""}
                      variant="outlined"
                      onBlur={handleBlur}
                      onChange={handleChange("max_destination")}
                      InputProps={
                        isEditable
                          ? {
                              endAdornment: (
                                <IconButton onClick={() => setFieldValue("max_destination", "")}>
                                  <CloseIcon />
                                </IconButton>
                              ),
                            }
                          : undefined
                      }
                      disabled={!isEditable}
                    />

                    {cropParams
                      .filter(item => item.type === "number")
                      .map((param, index) => (
                        <div key={param.id}>
                          <NumberParam
                            param={param}
                            values={values}
                            handleChange={handleChange}
                            clearAction={setFieldValue}
                            isEditable={isEditable}
                          />
                          {index !==
                            cropParams.filter(item => item.type === "number").length - 1 && (
                            <Divider />
                          )}
                        </div>
                      ))}

                    <Grid
                      container
                      direction="row"
                      justify="flex-end"
                      alignItems="center"
                      spacing={1}
                      className={innerClasses.buttonContainer}
                    >
                      <Grid item>
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() => history.push("/user/filters")}
                        >
                          {isEditable
                            ? intl.formatMessage({ id: "ALL.BUTTONS.CANCEL" })
                            : intl.formatMessage({ id: "ALL.BUTTONS.PREV" })}
                        </Button>
                      </Grid>
                      {isEditable && (
                        <Grid item>
                          <ButtonWithLoader
                            loading={editLoading || createLoading}
                            disabled={editLoading || createLoading}
                            onPress={() => {
                              values.name === "" && setFormikErrored(true);
                              handleSubmit();
                            }}
                          >
                            {+id
                              ? intl.formatMessage({ id: "ALL.BUTTONS.SAVE" })
                              : intl.formatMessage({ id: "ALL.BUTTONS.CREATE" })}
                          </ButtonWithLoader>
                        </Grid>
                      )}
                      {isEditable && Boolean(+id) && (
                        <Grid item>
                          <OutlinedRedButton variant="outlined" onClick={() => setAlertOpen(true)}>
                            {intl.formatMessage({ id: "ALL.BUTTONS.DELETE" })}
                          </OutlinedRedButton>
                        </Grid>
                      )}
                    </Grid>
                  </div>
                )}
              </div>
            </div>
          );
        }}
      </Formik>
      <AlertDialog
        isOpen={isAlertOpen}
        text={intl.formatMessage({
          id: "FILTER.DIALOGS.DELETE_TEXT",
        })}
        okText={intl.formatMessage({
          id: "FILTER.DIALOGS.AGREE_TEXT",
        })}
        cancelText={intl.formatMessage({
          id: "FILTER.DIALOGS.CANCEL_TEXT",
        })}
        handleClose={() => setAlertOpen(false)}
        handleAgree={() => {
          delFilter(+id);
        }}
        loadingText={intl.formatMessage({
          id: "FILTER.DIALOGS.LOADING_TEXT",
        })}
        isLoading={delLoading}
      />
    </Paper>
  );
};

const connector = connect(
  (state: IAppState) => ({
    myFilters: state.myFilters.myFilters,
    myFiltersLoading: state.myFilters.loading,
    crops: state.crops2.crops,
    cropsLoading: state.crops2.loading,
    cropParams: state.crops2.cropParams,
    cropParamsLoading: state.crops2.cropParamsLoading,
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
    fetchCrops: cropsActions.fetchRequest,
    clearCropParams: cropsActions.clearCropParams,
    fetchCropParams: cropsActions.cropParamsRequest,
    clearCreateFilter: myFiltersActions.clearCreate,
    createFilter: myFiltersActions.createRequest,
    clearDelFilter: myFiltersActions.clearDel,
    delFilter: myFiltersActions.delRequest,
    clearEditFilter: myFiltersActions.clearEdit,
    editFilter: myFiltersActions.editRequest,
  }
);

type TPropsFromRedux = ConnectedProps<typeof connector>;

export default compose(connector, injectIntl)(MyFiltersEditPage);
