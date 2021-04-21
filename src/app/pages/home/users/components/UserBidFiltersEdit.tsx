import React, { useEffect, useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { RouteComponentProps, useHistory } from "react-router-dom";
import {
  makeStyles,
  TextField,
  Divider,
  IconButton,
  Grid,
  Paper,
  Button,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";
import { Row, Col } from "react-bootstrap";
import { injectIntl, WrappedComponentProps } from "react-intl";
import CloseIcon from "@material-ui/icons/Close";
import { useSnackbar } from "notistack";
import { Formik } from "formik";
import * as Yup from "yup";

import { actions as myFiltersActions } from "../../../../store/ducks/myFilters.duck";
import { actions as cropsActions } from "../../../../store/ducks/crops2.duck";
import { actions as authActions } from "../../../../store/ducks/auth.duck";
import { actions as userActions } from "../../../../store/ducks/users.duck";

import AlertDialog from "../../../../components/ui/Dialogs/AlertDialog";
import ButtonWithLoader from "../../../../components/ui/Buttons/ButtonWithLoader";
import CheckBoxParamGroup from "../../bids/components/filter/CheckBoxParamGroup";
import { fromApiToFilter, filterForCreate } from "../../myFilters/utils";
import NumberParam from "../../bids/components/filter/NumberParam";
import { IAppState } from "../../../../store/rootDuck";
import useStyles from "../../styles";
import Preloader from "../../../../components/ui/Loaders/Preloader";
import { LayoutSubheader } from "../../../../../_metronic/layout/LayoutContext";
import { IMyFilterItem } from "../../../../interfaces/filters";
import { OutlinedRedButton } from "../../../../components/ui/Buttons/RedButtons";
import { itemById } from "../../../../utils/utils";
import { Autocomplete } from "@material-ui/lab";
import { ICrop } from "../../../../interfaces/crops";
import NumberFormatCustom from "../../../../components/NumberFormatCustom/NumberFormatCustom";

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

const UserBidFiltersEdit: React.FC<TPropsFromRedux &
  WrappedComponentProps &
  RouteComponentProps<{ id: string; userId: string }>> = ({
  match: {
    params: { id, userId },
  },
  match,
  intl,

  fetchMe,
  me,
  meError,

  fetchUser,
  user,

  fetchCrops,
  crops,
  cropsLoading,
  cropsError,

  clearCropParams,
  fetchCropParams,
  cropParams,
  cropParamsLoading,
  cropParamsError,

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

  setCurrentPurchaseFilter,
  setCurrentSaleFilter,
  currentPurchaseFilters,
  currentSaleFilters,

  userBidFilters,
  userBidFiltersLoading,
  userBidFiltersSuccess,
  userBidFiltersError,
  clearUserBidFilters,
  fetchUserBidFilters,

  clearCreateUserFilter,
  createUserFilter,
  createUserFilterLoading,
  createUserFilterSuccess,
  createUserFilterError,

  salePurchaseMode,
}) => {
  const innerClasses = useInnerStyles();
  const classes = useStyles();
  const history = useHistory();
  const isEditable = match.url.indexOf("view") === -1;
  const isNew = match.url.indexOf("new") !== -1;
  // let salePurchaseMode: "sale" | "purchase" = "sale";
  // if (match.url.indexOf("sale") !== -1) salePurchaseMode = "sale";
  // if (match.url.indexOf("purchase") !== -1) salePurchaseMode = "purchase";

  const [isAlertOpen, setAlertOpen] = useState(false);
  const [formikErrored, setFormikErrored] = useState(false);

  const [deleteFilterId, setDeleteFilterId] = useState(0);
  const [deleteFilterCropId, setDeleteFilterCropId] = useState(0);

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
    if (createUserFilterSuccess || createUserFilterError) {
      enqueueSnackbar(
        createUserFilterSuccess
          ? intl.formatMessage({ id: "NOTISTACK.ERRORS.CREATE_FILTER" })
          : `${intl.formatMessage({ id: "NOTISTACK.ERRORS.ERROR" })} ${createUserFilterError}`,
        {
          variant: createUserFilterSuccess ? "success" : "error",
        }
      );
      clearCreateUserFilter();
    }
  }, [
    clearCreateUserFilter,
    createUserFilterError,
    createUserFilterSuccess,
    enqueueSnackbar,
    intl,
  ]);

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
    if (delSuccess) {
      if (salePurchaseMode === "sale") {
        if (
          !!deleteFilterId &&
          currentSaleFilters[deleteFilterCropId] &&
          currentSaleFilters[deleteFilterCropId].id === deleteFilterId
        ) {
          setCurrentSaleFilter(deleteFilterCropId, undefined);
        }
      }
      if (salePurchaseMode === "purchase") {
        if (
          !!deleteFilterId &&
          currentPurchaseFilters[deleteFilterCropId] &&
          currentPurchaseFilters[deleteFilterCropId].id === deleteFilterId
        ) {
          setCurrentPurchaseFilter(deleteFilterCropId, undefined);
        }
      }
      history.push(`/${salePurchaseMode}/user/${userId}/filters`);
    }
  }, [
    currentPurchaseFilters,
    currentSaleFilters,
    delSuccess,
    deleteFilterCropId,
    deleteFilterId,
    history,
    salePurchaseMode,
    setCurrentPurchaseFilter,
    setCurrentSaleFilter,
    userId,
  ]);

  useEffect(() => {
    if (createUserFilterSuccess || editSuccess) history.push(`/user/edit/${userId}`);
  }, [createUserFilterSuccess, editSuccess, history, userId]);

  useEffect(() => {
    fetchUserBidFilters({ id: +userId });
  }, [fetchUserBidFilters, userId]);

  useEffect(() => {
    if (!crops && !cropsLoading) {
      fetchCrops();
    }
  }, [delFilter, fetchCrops, cropsLoading, crops]);

  useEffect(() => {
    if (userBidFilters?.filters && +id) {
      const userFilter = userBidFilters?.filters.find(item => item.id === +id);
      if (userFilter) fetchCropParams(userFilter.crop.id);
    }
    return () => {
      clearCropParams();
    };
  }, [crops, userBidFilters, id, fetchCropParams, clearCropParams]);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  if (!me || !userBidFilters || !crops) return <Preloader />;

  if (meError || userBidFiltersError || cropsError || cropParamsError) {
    setTimeout(() => {
      window.location.reload();
    }, 10000);
  }

  return (
    <Paper className={classes.paperWithForm}>
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
            ? fromApiToFilter(
                userBidFilters?.filters.find(item => item.id === +id) as IMyFilterItem
              )
            : { name: "" }
        }
        onSubmit={(values, { setStatus, setSubmitting }) => {
          let params: { [x: string]: any } = { ...values };
          params.name = values.name.trim();
          params.point_prices = [];
          if (userBidFilters)
            itemById(userBidFilters?.filters, +id)?.point_prices.forEach(item => {
              params.point_prices.push({ point_id: item.point.id, price: item.price });
            });
          params.bid_type = salePurchaseMode;
          cropParams &&
            (+id
              ? editFilter({
                  id: +id,
                  data: filterForCreate(
                    params,
                    cropParams.filter(item => item.type === "enum"),
                    cropParams.filter(item => item.type === "number")
                  ),
                })
              : createUserFilter({
                  id: +userId,
                  data: filterForCreate(
                    params,
                    cropParams.filter(item => item.type === "enum"),
                    cropParams.filter(item => item.type === "number")
                  ),
                }));
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string()
            .required(intl.formatMessage({ id: "FILTER.FORM.NAME.REQUIRED" }))
            .trim(),
          max_full_price: Yup.number()
            .min(1000, intl.formatMessage({ id: "YUP.PRICE_OF_1000" }))
            .typeError(intl.formatMessage({ id: "YUP.NUMBERS" })),
          min_full_price: Yup.number()
            .min(1000, intl.formatMessage({ id: "YUP.PRICE_OF_1000" }))
            .typeError(intl.formatMessage({ id: "YUP.NUMBERS" })),
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
              <div className={classes.topButtonsContainer}>
                <div className={classes.button}>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                      history.goBack();
                    }}
                    style={{ marginTop: "-16px" }}
                  >
                    {intl.formatMessage({ id: "ALL.BUTTONS.PREV" })}
                  </Button>
                </div>
              </div>

              <Autocomplete
                id="cropId"
                options={me?.crops || []}
                getOptionLabel={option => option.name}
                noOptionsText={intl.formatMessage({
                  id: "ALL.AUTOCOMPLIT.EMPTY",
                })}
                value={crops ? crops.find(item => item.id === values.cropId) || null : null}
                onChange={(e: any, val: ICrop | null) => {
                  const now = new Date();
                  if (val) {
                    setFieldValue(
                      "name",
                      `${val.name} ${now.toLocaleDateString()} - ${now
                        .toLocaleTimeString()
                        .slice(0, -3)}`
                    );
                  }
                  setFieldValue("cropId", val?.id || "");
                  !!val?.id ? fetchCropParams(val.id) : clearCropParams();
                }}
                renderInput={params => (
                  <TextField
                    {...params}
                    margin="normal"
                    label={intl.formatMessage({
                      id: "FILTER.FORM.NAME.CROP",
                    })}
                    variant="outlined"
                    onBlur={handleBlur}
                    helperText={touched.cropId && errors.cropId}
                    error={Boolean(touched.cropId && errors.cropId)}
                  />
                )}
              />

              <div>
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

                    {salePurchaseMode === "purchase" && (
                      <div className={classes.textFieldContainer}>
                        <TextField
                          type="text"
                          label={intl.formatMessage({
                            id: "FILTER.FORM.MAX_PAYMENT_TERM",
                          })}
                          margin="normal"
                          name="max_payment_term"
                          value={values.max_payment_term || ""}
                          variant="outlined"
                          onBlur={handleBlur}
                          onChange={e => {
                            let newValue = e.target.value;
                            if (+newValue < 0) {
                              newValue = "0";
                            }
                            if (+newValue > 999) {
                              newValue = "999";
                            }
                            setFieldValue("max_payment_term", newValue);
                          }}
                          InputProps={
                            isEditable
                              ? {
                                  inputComponent: NumberFormatCustom as any,
                                  endAdornment: (
                                    <IconButton
                                      onClick={() => setFieldValue("max_payment_term", "")}
                                    >
                                      <CloseIcon />
                                    </IconButton>
                                  ),
                                }
                              : undefined
                          }
                          autoComplete="off"
                          disabled={!isEditable}
                        />
                      </div>
                    )}

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
                              inputComponent: NumberFormatCustom as any,
                              endAdornment: (
                                <IconButton onClick={() => setFieldValue("max_full_price", "")}>
                                  <CloseIcon />
                                </IconButton>
                              ),
                            }
                          : undefined
                      }
                      helperText={touched.max_full_price && errors.max_full_price}
                      error={Boolean(touched.max_full_price && errors.max_full_price)}
                      disabled={!isEditable}
                      autoComplete="off"
                    />

                    <TextField
                      type="text"
                      label={intl.formatMessage({
                        id: "FILTER.FORM.MIN_PRICE",
                      })}
                      margin="normal"
                      name="min_full_price"
                      value={values.min_full_price || ""}
                      variant="outlined"
                      onBlur={handleBlur}
                      onChange={handleChange("min_full_price")}
                      InputProps={
                        isEditable
                          ? {
                              inputComponent: NumberFormatCustom as any,
                              endAdornment: (
                                <IconButton onClick={() => setFieldValue("min_full_price", "")}>
                                  <CloseIcon />
                                </IconButton>
                              ),
                            }
                          : undefined
                      }
                      helperText={touched.min_full_price && errors.min_full_price}
                      error={Boolean(touched.min_full_price && errors.min_full_price)}
                      disabled={!isEditable}
                      autoComplete="off"
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
                              inputComponent: NumberFormatCustom as any,
                              endAdornment: (
                                <IconButton onClick={() => setFieldValue("max_destination", "")}>
                                  <CloseIcon />
                                </IconButton>
                              ),
                            }
                          : undefined
                      }
                      disabled={!isEditable}
                      autoComplete="off"
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
                          <Divider />
                        </div>
                      ))}

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
                      autoComplete="off"
                    />

                    {!isNew && (
                      <>
                        <FormControlLabel
                          className={classes.switcher}
                          control={<Checkbox checked={values.subscribed} onChange={handleChange} />}
                          label={intl.formatMessage({ id: "FILTERS.TABLE.HEADER.SUBSCRIPTION" })}
                          name="subscribed"
                          disabled={!isEditable || !me?.email}
                        />

                        <FormControlLabel
                          className={classes.switcher}
                          control={
                            <Checkbox checked={values.is_sending_sms} onChange={handleChange} />
                          }
                          label={intl.formatMessage({ id: "FILTERS.TABLE.HEADER.SMS.SENDING" })}
                          name="is_sending_sms"
                          disabled={!isEditable || !me?.phone}
                        />
                      </>
                    )}

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
                          onClick={() => history.push(`/${salePurchaseMode}/filters`)}
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
                              values.name.trim() === "" && setFormikErrored(true);
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
                          <OutlinedRedButton
                            variant="outlined"
                            onClick={() => {
                              setDeleteFilterId(+id);
                              setDeleteFilterCropId(values.cropId);
                              setAlertOpen(true);
                            }}
                          >
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
    me: state.auth.user,
    meError: state.auth.error,
    user: state.users.user,

    userBidFilters: state.users.userBidFilters,
    userBidFiltersLoading: state.users.userBidFiltersLoading,
    userBidFiltersSuccess: state.users.userBidFiltersSuccess,
    userBidFiltersError: state.users.userBidFiltersError,

    crops: state.crops2.crops,
    cropsLoading: state.crops2.loading,
    cropsError: state.crops2.error,

    cropParams: state.crops2.cropParams,
    cropParamsLoading: state.crops2.cropParamsLoading,
    cropParamsError: state.crops2.cropParamsError,

    createLoading: state.myFilters.createLoading,
    createSuccess: state.myFilters.createSuccess,
    createError: state.myFilters.createError,
    delLoading: state.myFilters.delLoading,
    delSuccess: state.myFilters.delSuccess,
    delError: state.myFilters.delError,
    editLoading: state.myFilters.editLoading,
    editSuccess: state.myFilters.editSuccess,
    editError: state.myFilters.editError,

    currentSaleFilters: state.myFilters.currentSaleFilters,
    currentPurchaseFilters: state.myFilters.currentPurchaseFilters,

    createUserFilterLoading: state.users.createUserFilterLoading,
    createUserFilterSuccess: state.users.createUserFilterSuccess,
    createUserFilterError: state.users.createUserFilterError,

    salePurchaseMode: state.leftMenu.salePurchaseMode,
  }),
  {
    fetchMe: authActions.fetchRequest,
    fetchUser: userActions.fetchByIdRequest,
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
    clearUserBidFilters: userActions.clearUserBidFilters,
    fetchUserBidFilters: userActions.userBidFiltersRequest,

    setCurrentSaleFilter: myFiltersActions.setCurrentSaleFilter,
    setCurrentPurchaseFilter: myFiltersActions.setCurrentPurchaseFilter,

    clearCreateUserFilter: userActions.clearCreateUserFilter,
    createUserFilter: userActions.createUserFilterRequest,
  }
);

type TPropsFromRedux = ConnectedProps<typeof connector>;

export default connector(injectIntl(UserBidFiltersEdit));
