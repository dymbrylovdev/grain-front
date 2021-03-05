/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState, useRef, useCallback } from "react";
import { IntlShape } from "react-intl";
import { Link } from "react-router-dom";
import {
  TextField,
  MenuItem,
  Grid,
  makeStyles,
  Button,
  IconButton,
  Collapse,
  FormControlLabel,
  Checkbox,
  Divider,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { useHistory } from "react-router-dom";
import { Skeleton, Autocomplete, Alert } from "@material-ui/lab";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import ReportProblemIcon from "@material-ui/icons/ReportProblem";

import AutocompleteLocations from "../../../../components/AutocompleteLocations";
import { IBid, TBidType, IBidToRequest, IProfit, IBidsPair } from "../../../../interfaces/bids";
import { IUser } from "../../../../interfaces/users";
import { ActionWithPayload, Action } from "../../../../utils/action-helper";
import { ICropParam, ICrop } from "../../../../interfaces/crops";
import { ILocation } from "../../../../interfaces/locations";
import useStyles from "../../styles";
import ButtonWithLoader from "../../../../components/ui/Buttons/ButtonWithLoader";
import { OutlinedRedButton } from "../../../../components/ui/Buttons/RedButtons";
import { IMyFilterItem, IParamValue } from "../../../../interfaces/filters";
import NumberFormatCustom from "../../../../components/NumberFormatCustom/NumberFormatCustom";
import { accessByRoles, getConfirmCompanyString } from "../../../../utils/utils";
import { TrafficLight } from "../../users/components";
import AlertDialog from "../../../../components/ui/Dialogs/AlertDialog";
import { thousands } from "../../deals/utils/utils";

const useInnerStyles = makeStyles(theme => ({
  calcTitle: {
    fontSize: 16,
    marginBottom: theme.spacing(2),
  },
  calcDescriptionContainer: {
    display: "flex",
    marginTop: theme.spacing(2),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  calcDescription: {
    fontSize: 14,
    paddingRight: theme.spacing(1),
  },
  calcFinalPrice: {
    fontSize: 14,
    fontWeight: "bold",
    flex: 1,
  },
  authorText: {
    marginBottom: theme.spacing(1),
  },
  autoLoc: {
    width: "100%",
  },
}));

const getInitialValues = (
  bid: IBid | undefined,
  cropId: number,
  salePurchaseMode: string,
  editMode: string,
  vendorId: number,
  user: IUser | undefined,
  me: IUser | undefined,
  isSendingEmail: boolean,
  isSendingSms: boolean
) => {
  let newCropId: number | string = "";
  if (editMode === "view" || editMode === "edit") {
    newCropId = bid?.crop_id || "";
  }
  if (editMode === "create") {
    if (vendorId) {
      if (user && user.crops.length === 1) {
        newCropId = user.crops[0].id;
      } else {
        newCropId = "";
      }
    } else {
      if (me && me.crops.length === 1) {
        newCropId = me.crops[0].id;
      } else {
        newCropId = "";
      }
    }
  }
  const values: { [x: string]: any } = {
    volume: bid?.volume || "",
    price: bid?.price || "",
    description: bid?.description || "",
    crop_id: newCropId,
    is_sending_email: isSendingEmail ? 1 : 0,
    is_sending_sms: isSendingSms ? 1 : 0,
    location:
      editMode === "create"
        ? !!vendorId
          ? !!user && user.points.length === 1
            ? user.points[0]
            : { text: "" }
          : !!me && me.points.length === 1
          ? me.points[0]
          : { text: "" }
        : bid?.location || { text: "" },
    pricePerKm: bid?.price_delivery_per_km || 4,
    bid_type: !!bid ? bid.type : salePurchaseMode,
    payment_term: bid?.payment_term || "",
    prepayment_amount: bid?.prepayment_amount || "",
  };
  if (bid && bid.parameter_values && bid.parameter_values.length > 0) {
    bid.parameter_values.forEach(item => {
      values[`parameter${item.parameter_id}`] = item.value;
    });
  }

  return values;
};

const getFinalPrice = (
  bid: IBid,
  i: number,
  pricePerKm: number,
  salePurchaseMode: string,
  vat: number
) => {
  const distance =
    !bid.point_prices[i].distance || bid.point_prices[i].distance < 100
      ? 100
      : bid.point_prices[i].distance;
  if (salePurchaseMode === "sale") {
    return Math.round(bid.price * (vat / 100 + 1) + pricePerKm * distance);
  } else {
    return Math.round(bid.price * (vat / 100 + 1) - pricePerKm * distance);
  }
};

const getDeliveryPrice = (
  bid: IBid,
  i: number,
  pricePerKm: number,
  salePurchaseMode: string,
  vat: number
) => {
  const distance =
    !bid.point_prices[i].distance || bid.point_prices[i].distance < 100
      ? 100
      : bid.point_prices[i].distance;
  if (salePurchaseMode === "sale") {
    return Math.round(pricePerKm * distance);
  } else {
    return Math.round(pricePerKm * distance);
  }
};
interface IProps {
  intl: IntlShape;
  vendorId: number;
  user: IUser | undefined;
  salePurchaseMode: string;
  editMode: string;
  cropId: number;
  crops: ICrop[] | undefined;
  bid: IBid | undefined;
  bidsPair: IBidsPair | undefined;
  fetchMe: any;
  me: IUser | undefined;
  fetchLocations: (payload: any) => ActionWithPayload<"yaLocations/FETCH_REQUEST", any>;
  locations: ILocation[] | undefined;
  loadingLocations: boolean;
  clearLocations: () => Action<"yaLocations/CLEAR">;
  clearBidsPair: () => Action<"bids/CLEAR_BIDS_PAIR">;
  fetchBidsPair: any;
  bidsPairSuccess: boolean;
  bidsPairError: string | null;
  bidsPairLoading: boolean;
  clearCropParams: () => Action<"crops2/CLEAR_CROP_PARAMS">;
  fetchCropParams: (
    cropId: number
  ) => ActionWithPayload<
    "crops2/CROP_PARAMS_REQUEST",
    {
      cropId: number;
    }
  >;
  cropParams: ICropParam[] | undefined;
  cropParamsLoading: boolean;
  buttonLoading: boolean;
  setAlertOpen: React.Dispatch<React.SetStateAction<boolean>>;
  create: (
    type: TBidType,
    data: IBidToRequest,
    is_sending_email: number,
    is_sending_sms: number
  ) => ActionWithPayload<
    "bids/CREATE_REQUEST",
    {
      type: TBidType;
      data: IBidToRequest;
      is_sending_email: number;
      is_sending_sms: number;
    }
  >;
  edit: (
    id: number,
    data: IBidToRequest
  ) => ActionWithPayload<
    "bids/EDIT_REQUEST",
    {
      id: number;
      data: IBidToRequest;
    }
  >;
  createSuccess: boolean;
  createError: string | null;
  clearCreate: () => Action<"bids/CLEAR_CREATE">;
  post: (id: number) => ActionWithPayload<"myFilters/POST_FILTER", number>;
  postSuccess: boolean;
  postError: string | null;
  clearPost: () => Action<"myFilters/CLEAR_POST">;
  profit: IProfit;
  editContactViewCount: any;
  setOpenInfoAlert: (
    openInfoAlert: boolean
  ) => ActionWithPayload<
    "bids/SET_OPEN_INFO_ALERT",
    {
      openInfoAlert: boolean;
    }
  >;
  openInfoAlert: boolean;
  fetchFilters: any;
  filterCount: number;
}

const BidForm: React.FC<IProps> = ({
  intl,
  vendorId,
  user,
  salePurchaseMode,
  editMode,
  cropId,
  crops,
  bid,

  fetchMe,
  me,

  create,
  edit,
  post,
  editContactViewCount,

  fetchLocations,
  locations,
  loadingLocations,
  clearLocations,

  bidsPair,
  clearBidsPair,
  fetchBidsPair,
  bidsPairSuccess,
  bidsPairError,
  bidsPairLoading,

  clearCropParams,
  fetchCropParams,
  cropParams,
  cropParamsLoading,

  buttonLoading,
  setAlertOpen,

  createSuccess,
  createError,
  clearCreate,

  postSuccess,
  postError,
  clearPost,

  profit,
  openInfoAlert,
  setOpenInfoAlert,

  fetchFilters,
  filterCount,
}) => {
  const history = useHistory();
  const classes = useStyles();
  const innerClasses = useInnerStyles();

  const inputEl = useRef<HTMLButtonElement>(null);
  const [goToRef, setGoToRef] = useState(false);
  const [isMoreBidOpen, setMoreBidOpen] = useState(false);
  const [isSendingEmail, setSendingEmail] = useState(true);
  const [isSendingSms, setSendingSms] = useState(false);
  const [isContactAlertOpen, setContactAlertOpen] = useState(false);
  const [fullPrepayment, setFullPrepayment] = useState(false);

  const createFilter = (id: number) => {
    if (editMode === "edit") post(id);
  };

  useEffect(() => {
    if (goToRef) {
      inputEl.current?.focus();
      setGoToRef(false);
    }
  }, [goToRef]);

  const bidId: number = !!bid ? bid.id : 0;
  const vendor_id =
    (!bid && +vendorId) || (bid && bid.vendor && bid.vendor.id) || (me?.id as number);
  const vendor = me?.id === vendor_id ? me : user;
  const currentCropId: number = !!bid
    ? bid.crop_id
    : !!cropId
    ? cropId
    : vendor?.crops.length === 1
    ? vendor.crops[0].id
    : 0;

  const onCheckboxChange = (e: any, val: number) => {
    if (val === 1) setSendingEmail(!isSendingEmail);
    if (val === 2) setSendingSms(!isSendingSms);
  };

  const linkToContact = () => {
    let contactViewCount = me?.contact_view_count;
    //@ts-ignore
    if (contactViewCount > 0 || ["ROLE_ADMIN", "ROLE_MANAGER"].includes(me.roles[0])) {
      history.push(
        me?.id === (!!bid && bid.vendor && bid.vendor.id)
          ? "/user/profile"
          : `/user/view/${!!bid && bid.vendor && bid.vendor.id}`
      );
      //@ts-ignore
      if (
        //@ts-ignore
        !["ROLE_ADMIN", "ROLE_MANAGER"].includes(me.roles[0]) &&
        history.location.pathname !== "/user/profile"
      )
        //@ts-ignore
        editContactViewCount({ data: { contact_view_count: contactViewCount - 1 } });
    } else {
      setContactAlertOpen(!isContactAlertOpen);
      setTimeout(() => setContactAlertOpen(false), 5000);
    }
  };

  const {
    values,
    errors,
    touched,
    resetForm,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    initialValues: getInitialValues(
      bid,
      currentCropId,
      salePurchaseMode,
      editMode,
      vendorId,
      user,
      me,
      isSendingEmail,
      isSendingSms
    ),
    onSubmit: values => {
      const is_sending_email = isSendingEmail ? 1 : 0;
      const is_sending_sms = isSendingSms ? 1 : 0;
      const newParamValues = initializeParamValues();

      const params: { [x: string]: any } = {
        ...values,
        vendor_id,
        price: +values.price,
        volume: +values.volume,
        payment_term: fullPrepayment ? 0 : +values.payment_term,
        parameter_values: newParamValues,
        prepayment_amount: fullPrepayment ? 100 : 0,
      };
      const bidType = params.bid_type;
      delete params.bid_type;
      if (editMode === "create") create(bidType, params, is_sending_email, is_sending_sms);
      if (editMode === "edit" && !!bid) {
        delete params.vendor_id;
        edit(bid.id, params);
      }
    },
    validationSchema: Yup.object().shape({
      volume: Yup.number()
        .required(intl.formatMessage({ id: "PROFILE.VALIDATION.REQUIRED_FIELD" }))
        .min(1, intl.formatMessage({ id: "YUP.NUMBERS.MIN" }, { min: 1 }))
        .typeError(intl.formatMessage({ id: "YUP.NUMBERS" })),
      price: Yup.number()
        .required(intl.formatMessage({ id: "PROFILE.VALIDATION.REQUIRED_FIELD" }))
        .min(1000, intl.formatMessage({ id: "YUP.PRICE_OF_1000" }))
        .typeError(intl.formatMessage({ id: "YUP.NUMBERS" })),
      location: Yup.object({
        text: Yup.string().required(
          intl.formatMessage({ id: "PROFILE.VALIDATION.REQUIRED_FIELD" })
        ),
      }),
      crop_id: Yup.string().required(
        intl.formatMessage({ id: "PROFILE.VALIDATION.REQUIRED_FIELD" })
      ),
      payment_term:
        salePurchaseMode === "purchase" && !fullPrepayment
          ? Yup.string().required(intl.formatMessage({ id: "PROFILE.VALIDATION.REQUIRED_FIELD" }))
          : Yup.string(),
    }),
  });

  const [formikErrored, setFormikErrored] = useState(false);

  const initializeParamValues = useCallback(() => {
    const paramValues: IParamValue[] = [];
    cropParams?.forEach(param => {
      const id = param.id;
      if (values[`parameter${id}`] && values[`parameter${id}`] !== "") {
        paramValues.push({ parameter_id: id, value: values[`parameter${id}`].toString() });
      }
    });

    return paramValues;
  }, [cropParams, values]);

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
          ? intl.formatMessage({ id: "NOTISTACK.BIDS.ADD" })
          : `${intl.formatMessage({ id: "NOTISTACK.ERRORS.ERROR" })} ${createError}`,
        {
          variant: createSuccess ? "success" : "error",
        }
      );
      clearCreate();
      if (createSuccess) {
        setMoreBidOpen(true);
        fetchMe();
        fetchFilters();
      }
    }
  }, [
    clearCreate,
    createError,
    createSuccess,
    enqueueSnackbar,
    history,
    intl,
    salePurchaseMode,
    vendorId,
    fetchMe,
    fetchFilters,
  ]);

  useEffect(() => {
    if (postSuccess || postError) {
      enqueueSnackbar(
        postSuccess
          ? intl.formatMessage({ id: "NOTISTACK.ERRORS.SAVE_FILTER" })
          : `${intl.formatMessage({ id: "NOTISTACK.ERRORS.ERROR" })} ${postError}`,
        {
          variant: postSuccess ? "success" : "error",
        }
      );
      clearPost();
    }
  }, [clearPost, postError, postSuccess, enqueueSnackbar, history, intl, salePurchaseMode]);

  useEffect(() => {
    resetForm({
      values: getInitialValues(
        bid,
        currentCropId,
        salePurchaseMode,
        editMode,
        vendorId,
        user,
        me,
        isSendingEmail,
        isSendingSms
      ),
    });
  }, [bid, currentCropId, editMode, me, resetForm, salePurchaseMode, user, vendorId]);

  useEffect(() => {
    if (editMode === "create" && me && ["ROLE_ADMIN", "ROLE_MANAGER"].includes(me.roles[0])) {
      let params = {};
      const newParamsValues = initializeParamValues();

      params = {
        crop_id: values.crop_id,
        parameter_values: newParamsValues,
        location: values.location,
      };

      //@ts-ignore
      if (params.crop_id !== "") fetchBidsPair(values.bid_type, params);
    }
  }, [values.bid_type, values.crop_id, values.location, initializeParamValues, fetchBidsPair]);

  useEffect(() => {
    clearBidsPair();
  }, [history, clearBidsPair]);

  useEffect(() => {
    if (currentCropId) fetchCropParams(currentCropId);
  }, [currentCropId, fetchCropParams]);

  useEffect(() => {
    if (!!me?.tariff_matrix && me.tariff_matrix.max_filters_count - filterCount <= 0) {
      setSendingEmail(false);
    }
  }, [me, filterCount]);

  useEffect(() => {
    if (values.prepayment_amount === 100) setFullPrepayment(true);
  }, [values.prepayment_amount]);

  useEffect(() => {
    if (fullPrepayment) setFieldValue("payment_term", "");
  }, [fullPrepayment]);

  const vendorUseVat = editMode === "view" ? bid?.vendor_use_vat : bid?.vendor?.use_vat;

  const loading = !me || !crops || (editMode !== "create" && !bid) || (!!vendorId && !user);

  return (
    <div className={classes.form}>
      <div className={classes.topButtonsContainer}>
        <div
          className={classes.flexRow}
          style={{ width: "100%", alignItems: "center", justifyContent: "space-between" }}
        >
          <div className={classes.button}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                history.goBack();
              }}
              disabled={buttonLoading || loading}
            >
              {intl.formatMessage({ id: "ALL.BUTTONS.PREV" })}
            </Button>
          </div>
          {editMode !== "view" && !loading && (
            <div className={classes.button}>
              <ButtonWithLoader
                loading={buttonLoading}
                disabled={buttonLoading}
                onPress={() => {
                  !values.location.text ||
                  !values.volume ||
                  !values.price ||
                  !values.crop_id ||
                  (salePurchaseMode === "purchase" && !fullPrepayment && !values.payment_term)
                    ? setFormikErrored(true)
                    : setFormikErrored(false);
                  handleSubmit();
                }}
              >
                {editMode === "create"
                  ? intl.formatMessage({ id: "ALL.BUTTONS.BID_CREATE" })
                  : intl.formatMessage({ id: "ALL.BUTTONS.SAVE" })}
              </ButtonWithLoader>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <Skeleton width="100%" height={127} animation="wave" />
      ) : (
        bid?.vendor &&
        bid?.author && (
          <>
            {accessByRoles(me, ["ROLE_ADMIN", "ROLE_MANAGER"]) && (
              <div>
                <Link
                  to={
                    me?.id === bid?.author?.id ? "/user/profile" : `/user/view/${bid?.author?.id}`
                  }
                >
                  <div className={innerClasses.authorText}>
                    {intl.formatMessage({ id: "BID.FORM.AUTHOR" })}{" "}
                    {bid.author.fio || bid.author.login || `ID ${bid.author.id}`}
                  </div>
                </Link>
              </div>
            )}
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div
                  className={innerClasses.authorText}
                  style={{ cursor: "pointer", color: "blue" }}
                  onClick={linkToContact}
                >
                  {`${
                    bid.type === "sale"
                      ? intl.formatMessage({ id: "AUTH.REGISTER.VENDOR" })
                      : intl.formatMessage({ id: "AUTH.REGISTER.BUYER" })
                  }: ${bid.vendor.fio || bid.vendor.login || `ID ${bid.vendor.id}`}`}
                </div>
              </div>

              {accessByRoles(me, ["ROLE_BUYER", "ROLE_VENDOR", "ROLE_TRADER"]) && (
                <Alert
                  className={classes.infoAlert}
                  severity="warning"
                  color="error"
                  style={{ marginTop: 8, marginBottom: 8 }}
                >
                  {`Сегодня вам доступен просмотр ${
                    me?.contact_view_count
                  } контактов. ${intl.formatMessage({ id: "BID.CONTACTS.LIMIT" })}`}
                </Alert>
              )}

              {!!bid.vendor.company && (
                <div className={classes.bottomMargin1}>{bid.vendor.company.short_name}</div>
              )}
              <div className={`${classes.flexRow} ${classes.bottomMargin1}`}>
                {!!bid?.vendor?.company && (
                  <div className={classes.rightMargin1}>
                    {!bid?.vendor?.company_confirmed_by_payment &&
                    !bid?.vendor?.company_confirmed_by_email ? (
                      <ReportProblemIcon color="error" />
                    ) : (
                      <CheckCircleOutlineIcon color="secondary" />
                    )}
                  </div>
                )}
                <div>{getConfirmCompanyString(bid.vendor as IUser, intl)}</div>
              </div>
            </div>
          </>
        )
      )}

      {!!bid &&
        (loading ? (
          <Skeleton width="100%" height={20} animation="wave" />
        ) : (
          <p>
            {intl.formatMessage({ id: "DEALS.DEAL.DATE" })}:{" "}
            {`${bid.modified_at.slice(8, 10)}.${bid.modified_at.slice(
              5,
              7
            )}.${bid.modified_at.slice(0, 4)}`}
          </p>
        ))}

      {!!bid?.vendor?.company?.colors && !!bid?.vendor?.company_confirmed_by_payment && (
        <TrafficLight intl={intl} colors={bid.vendor.company.colors} />
      )}

      {accessByRoles(me, ["ROLE_ADMIN", "ROLE_MANAGER", "ROLE_TRADER"]) &&
        (loading ? (
          <Skeleton width="100%" height={70} animation="wave" />
        ) : (
          <TextField
            select
            type="text"
            label={intl.formatMessage({
              id: "BIDSLIST.TABLE.BID_TYPE",
            })}
            margin="normal"
            name="bid_type"
            value={values.bid_type}
            variant="outlined"
            onBlur={handleBlur}
            onChange={handleChange}
            disabled={
              editMode !== "create" ||
              (!!me && !accessByRoles(me, ["ROLE_ADMIN", "ROLE_MANAGER"])) ||
              (!!me &&
                accessByRoles(me, ["ROLE_ADMIN", "ROLE_MANAGER"]) &&
                !!vendorId &&
                !!user &&
                !accessByRoles(user, ["ROLE_ADMIN", "ROLE_MANAGER"]))
            }
          >
            <MenuItem value={"sale"}>{intl.formatMessage({ id: "BID.TYPE.SALE" })}</MenuItem>
            <MenuItem value={"purchase"}>
              {intl.formatMessage({ id: "BID.TYPE.PURCHASE" })}
            </MenuItem>
          </TextField>
        ))}

      {loading ? (
        <Skeleton width="100%" height={70} animation="wave" />
      ) : (
        <Autocomplete
          id="crop_id"
          options={vendor?.crops || []}
          getOptionLabel={option => option.name}
          noOptionsText={intl.formatMessage({
            id: "ALL.AUTOCOMPLIT.EMPTY",
          })}
          value={vendor?.crops?.find(item => item.id === values.crop_id) || null}
          onChange={(e: any, val: ICrop | null) => {
            setFieldValue("crop_id", val?.id || "");
            !!val?.id ? fetchCropParams(val.id) : clearCropParams();
          }}
          disabled={editMode === "view"}
          renderInput={params => (
            <TextField
              {...params}
              margin="normal"
              label={intl.formatMessage({
                id: "FILTER.FORM.NAME.CROP",
              })}
              variant="outlined"
              onBlur={handleBlur}
              helperText={touched.crop_id && errors.crop_id}
              error={Boolean(touched.crop_id && errors.crop_id)}
            />
          )}
        />
      )}

      {editMode === "edit" &&
        bid?.vendor_use_vat !== bid?.vendor?.use_vat &&
        (loading ? (
          <Skeleton width="100%" height={70} animation="wave" />
        ) : (
          <Collapse in={openInfoAlert}>
            <Alert
              className={classes.infoAlert}
              severity="warning"
              color="error"
              style={{ marginTop: 8, marginBottom: 8 }}
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setOpenInfoAlert(false);
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
            >
              {intl.formatMessage({ id: "BID.PRICE.WARNING" })}
            </Alert>
          </Collapse>
        ))}

      {loading ? (
        <Skeleton width="100%" height={70} animation="wave" />
      ) : (
        <TextField
          type="text"
          label={intl.formatMessage({
            id: `${"BIDSLIST.TABLE.COST." + values.bid_type}`,
          })}
          margin="normal"
          name="price"
          value={thousands(values.price.toString())}
          variant="outlined"
          onBlur={handleBlur}
          onChange={handleChange}
          helperText={touched.price && errors.price}
          error={Boolean(touched.price && errors.price)}
          InputProps={
            editMode !== "view"
              ? {
                  style:
                    editMode === "edit" && bid?.vendor_use_vat !== bid?.vendor?.use_vat
                      ? {
                          color: "#fd397a",
                        }
                      : {},
                  inputComponent: NumberFormatCustom as any,
                  endAdornment: (
                    <IconButton onClick={() => setFieldValue("price", "")}>
                      <CloseIcon />
                    </IconButton>
                  ),
                }
              : undefined
          }
          disabled={editMode === "view"}
          autoComplete="off"
        />
      )}

      {editMode === "create" && bidsPair && (
        <>
          {bidsPairLoading ? (
            <Skeleton width="100%" height={70} animation="wave" />
          ) : (
            <>
              {bidsPairError && (
                <Alert
                  className={classes.infoAlert}
                  severity="warning"
                  color="error"
                  style={{ marginTop: 15 }}
                >
                  {`${intl.formatMessage({ id: "BID.CREATE.BEST.PRICE" })}${intl.formatMessage({
                    id: "BID.CREATE.NOT.FOUND",
                  })}`}
                </Alert>
              )}

              {bidsPairSuccess && (
                <>
                  {bidsPair.price_with_delivery ? (
                    <Alert
                      className={classes.infoAlert}
                      severity="info"
                      color="info"
                      style={{ marginTop: 15 }}
                    >
                      {`${intl.formatMessage({ id: "BID.CREATE.BEST.PRICE" })}${
                        bidsPair.price_with_delivery
                      } ${intl.formatMessage({ id: "BID.CREATE.WITH.DELIVIRY" })}`}
                    </Alert>
                  ) : (
                    <Alert
                      className={classes.infoAlert}
                      severity="info"
                      color="info"
                      style={{ marginTop: 15 }}
                    >
                      {`${intl.formatMessage({ id: "BID.CREATE.BEST.PRICE" })}${
                        bidsPair.price
                      } ${intl.formatMessage({ id: "BID.CREATE.WITHOUT.DELIVIRY" })}`}
                    </Alert>
                  )}
                </>
              )}
            </>
          )}
        </>
      )}

      {loading ? (
        <Skeleton width="100%" height={70} animation="wave" />
      ) : (
        <>
          {values.bid_type === "purchase" && (
            <>
              <FormControlLabel
                control={
                  <Checkbox checked={fullPrepayment} onChange={() => setFullPrepayment(s => !s)} />
                }
                label={"Предоплата 100%"}
                name="fullPrepayment"
                style={{ marginBottom: 10, marginTop: 10 }}
                disabled={editMode === "view"}
              />
            </>
          )}
        </>
      )}

      {!!me &&
        me.use_vat &&
        values.bid_type === "sale" &&
        !!bid &&
        !!bid.vat &&
        !vendorUseVat &&
        (loading ? (
          <>
            <Skeleton width="100%" height={70} animation="wave" />
            <Skeleton width="100%" height={37} animation="wave" />
          </>
        ) : (
          <>
            <TextField
              type="text"
              label={intl.formatMessage({ id: "BIDSLIST.TABLE.COST_WITH_VAT" }, { vat: bid.vat })}
              margin="normal"
              name="price"
              value={thousands(Math.round(+values.price * (+bid.vat / 100 + 1)).toString())}
              variant="outlined"
              disabled
            />
            <p>
              {intl.formatMessage(
                { id: "BIDSLIST.TABLE.COST_WITH_VAT.ABOUT" },
                { vat: Math.round((+values.price * +bid.vat) / 100) }
              )}
            </p>
          </>
        ))}

      {accessByRoles(me, ["ROLE_ADMIN", "ROLE_MANAGER", "ROLE_TRADER"]) &&
        editMode === "view" &&
        !!bid &&
        !!bid.point_prices &&
        bid.point_prices.length > 0 &&
        (loading ? (
          <Skeleton width="100%" height={70} animation="wave" />
        ) : (
          <TextField
            type="text"
            label={intl.formatMessage({ id: "DEALS.TABLE.PROFIT_BY_TONN" })}
            margin="normal"
            value={thousands(Math.round(bid.point_prices[0].profit).toString())}
            variant="outlined"
            disabled
          />
        ))}

      {accessByRoles(me, ["ROLE_ADMIN", "ROLE_MANAGER", "ROLE_TRADER"]) &&
        editMode === "view" &&
        !!bid &&
        !!bid.point_prices &&
        bid.point_prices.length > 0 &&
        (loading ? (
          <Skeleton width="100%" height={70} animation="wave" />
        ) : (
          <TextField
            type="text"
            label={intl.formatMessage({ id: "DEALS.TABLE.TOTAL_PROFIT" })}
            margin="normal"
            value={thousands(Math.round(bid.point_prices[0].profit * values.volume).toString())}
            variant="outlined"
            disabled
          />
        ))}

      {salePurchaseMode === "purchase" &&
        (loading ? (
          <Skeleton width="100%" height={70} animation="wave" />
        ) : (
          <TextField
            type="text"
            label={intl.formatMessage({
              id: "BIDSLIST.TABLE.PAYMENT_TERM",
            })}
            margin="normal"
            name="payment_term"
            value={values.payment_term}
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
              setFieldValue("payment_term", newValue);
            }}
            helperText={touched.payment_term && errors.payment_term}
            error={Boolean(touched.payment_term && errors.payment_term)}
            InputProps={
              editMode !== "view"
                ? {
                    inputComponent: NumberFormatCustom as any,
                    endAdornment: (
                      <IconButton
                        onClick={() => setFieldValue("payment_term", "")}
                        disabled={fullPrepayment}
                      >
                        <CloseIcon />
                      </IconButton>
                    ),
                  }
                : undefined
            }
            disabled={editMode === "view" || fullPrepayment}
            autoComplete="off"
          />
        ))}

      {editMode === "view" &&
        accessByRoles(me, [
          "ROLE_ADMIN",
          "ROLE_MANAGER",
          "ROLE_TRADER",
          "ROLE_BUYER",
          "ROLE_VENDOR",
        ]) &&
        me?.id !== bid?.vendor.id &&
        (loading ? (
          <Skeleton width="100%" height={225} animation="wave" />
        ) : (
          <div className={classes.box}>
            <div className={innerClasses.calcTitle}>
              {`${intl.formatMessage({ id: "BID.CALCULATOR.TITLE" })}`}
            </div>
            {/* //* HERE */}
            <TextField
              type="text"
              label={intl.formatMessage({
                id: "BID.CALCULATOR.PRICE_PER_KM",
              })}
              margin="normal"
              name="pricePerKm"
              value={values.pricePerKm}
              variant="outlined"
              onBlur={handleBlur}
              onChange={handleChange}
              InputProps={{
                inputComponent: NumberFormatCustom as any,
              }}
              autoComplete="off"
              autoFocus={true}
            />
            <div className={innerClasses.calcDescription}>
              {!!me && me.use_vat && values.bid_type === "sale" && !!bid && !vendorUseVat
                ? intl.formatMessage(
                    { id: "BID.CALCULATOR.FINAL_PRICE_WITH_VAT" },
                    { vat: bid.vat }
                  )
                : intl.formatMessage({ id: "BID.CALCULATOR.FINAL_PRICE" })}
            </div>
            <div style={{ height: 8 }}></div>
            <Grid container direction="column" justify="center" alignItems="flex-start">
              {!!bid?.point_prices &&
                (bid.point_prices.length > 0 ? (
                  bid.point_prices.map((item, i) => (
                    <div key={i}>
                      {!!me &&
                      me.use_vat &&
                      values.bid_type === "sale" &&
                      !!bid &&
                      !!bid.vat &&
                      !vendorUseVat ? (
                        <b>
                          {thousands(
                            Math.round(
                              getFinalPrice(bid, i, values.pricePerKm, salePurchaseMode, +bid.vat)
                            ).toString()
                          )}
                        </b>
                      ) : (
                        <b>
                          {thousands(
                            Math.round(
                              getFinalPrice(bid, i, values.pricePerKm, salePurchaseMode, 0)
                            ).toString()
                          )}
                        </b>
                      )}
                      {` • ${Math.round(item.distance)} км • ${item.point.name}`}
                    </div>
                  ))
                ) : (
                  <p>{intl.formatMessage({ id: "BIDLIST.NO_POINTS" })}</p>
                ))}
            </Grid>

            <div style={{ height: 8 }}></div>

            <div className={innerClasses.calcDescription}>
              {!!me && me.use_vat && values.bid_type === "sale" && !!bid && !vendorUseVat
                ? intl.formatMessage({ id: "BID.CALCULATOR.FINAL_PRICE_DELIVERY" })
                : intl.formatMessage({ id: "BID.CALCULATOR.FINAL_PRICE_DELIVERY" })}
            </div>
            <div style={{ height: 8 }}></div>
            <Grid container direction="column" justify="center" alignItems="flex-start">
              {bid &&
                bid.point_prices &&
                (bid.point_prices.length > 0 ? (
                  bid.point_prices.map((item, i) => (
                    <div key={i}>
                      {!!me &&
                      me.use_vat &&
                      values.bid_type === "sale" &&
                      !!bid &&
                      !!bid.vat &&
                      !vendorUseVat ? (
                        <b>
                          {thousands(
                            Math.round(
                              getDeliveryPrice(
                                bid,
                                i,
                                values.pricePerKm,
                                salePurchaseMode,
                                +bid.vat
                              )
                            ).toString()
                          )}
                        </b>
                      ) : (
                        <b>
                          {thousands(
                            Math.round(
                              getDeliveryPrice(bid, i, values.pricePerKm, salePurchaseMode, 0)
                            ).toString()
                          )}
                        </b>
                      )}
                      {` • ${Math.round(item.distance)} км • ${item.point.name}`}
                    </div>
                  ))
                ) : (
                  <p>{intl.formatMessage({ id: "BIDLIST.NO_POINTS" })}</p>
                ))}
            </Grid>

            <div style={{ height: 8 }}></div>

            <div className={innerClasses.calcDescription}>
              {!!me && me.use_vat && values.bid_type === "sale" && !!bid && !vendorUseVat
                ? intl.formatMessage({ id: "BID.CALCULATOR.FINAL_PRICE_DELIVERY_ALL" })
                : intl.formatMessage({ id: "BID.CALCULATOR.FINAL_PRICE_DELIVERY_ALL" })}
            </div>
            <div style={{ height: 8 }}></div>
            <Grid container direction="column" justify="center" alignItems="flex-start">
              {bid &&
                bid.point_prices &&
                (bid.point_prices.length > 0 ? (
                  bid.point_prices.map((item, i) => (
                    <div key={i}>
                      {!!me &&
                      me.use_vat &&
                      values.bid_type === "sale" &&
                      !!bid &&
                      !!bid.vat &&
                      !vendorUseVat ? (
                        <b>
                          {thousands(
                            Math.round(
                              values.volume *
                                getDeliveryPrice(
                                  bid,
                                  i,
                                  values.pricePerKm,
                                  salePurchaseMode,
                                  +bid.vat
                                )
                            ).toString()
                          )}
                        </b>
                      ) : (
                        <b>
                          {thousands(
                            Math.round(
                              values.volume *
                                getDeliveryPrice(bid, i, values.pricePerKm, salePurchaseMode, 0)
                            ).toString()
                          )}
                        </b>
                      )}
                      {` • ${Math.round(item.distance)} км • ${item.point.name}`}
                    </div>
                  ))
                ) : (
                  <p>{intl.formatMessage({ id: "BIDLIST.NO_POINTS" })}</p>
                ))}
            </Grid>

            <div style={{ height: 8 }}></div>

            <div className={innerClasses.calcDescription}>
              {!!me && me.use_vat && values.bid_type === "sale" && !!bid && !vendorUseVat
                ? intl.formatMessage(
                    { id: "BID.CALCULATOR.FINAL_PRICE_WITH_VAT_ALL" },
                    { vat: bid.vat }
                  )
                : intl.formatMessage({ id: "BID.CALCULATOR.FINAL_PRICE_ALL" })}
            </div>
            <div style={{ height: 8 }}></div>
            <Grid container direction="column" justify="center" alignItems="flex-start">
              {bid &&
                bid.point_prices &&
                (bid.point_prices.length > 0 ? (
                  bid.point_prices.map((item, i) => (
                    <div key={i}>
                      {!!me &&
                      me.use_vat &&
                      values.bid_type === "sale" &&
                      !!bid &&
                      !!bid.vat &&
                      !vendorUseVat ? (
                        <b>
                          {thousands(
                            Math.round(
                              values.volume *
                                getFinalPrice(bid, i, values.pricePerKm, salePurchaseMode, +bid.vat)
                            ).toString()
                          )}
                        </b>
                      ) : (
                        <b>
                          {thousands(
                            Math.round(
                              values.volume *
                                getFinalPrice(bid, i, values.pricePerKm, salePurchaseMode, 0)
                            ).toString()
                          )}
                        </b>
                      )}
                      {` • ${Math.round(item.distance)} км • ${item.point.name}`}
                    </div>
                  ))
                ) : (
                  <p>{intl.formatMessage({ id: "BIDLIST.NO_POINTS" })}</p>
                ))}
            </Grid>
          </div>
        ))}

      {loading ? (
        <Skeleton width="100%" height={70} animation="wave" />
      ) : (
        <TextField
          type="text"
          label={intl.formatMessage({
            id: "BIDSLIST.TABLE.VOLUME",
          })}
          margin="normal"
          name="volume"
          value={thousands(values.volume.toString())}
          variant="outlined"
          onBlur={handleBlur}
          onChange={handleChange}
          helperText={touched.volume && errors.volume}
          error={Boolean(touched.volume && errors.volume)}
          InputProps={
            editMode !== "view"
              ? {
                  inputComponent: NumberFormatCustom as any,
                  endAdornment: (
                    <IconButton onClick={() => setFieldValue("volume", "")}>
                      <CloseIcon />
                    </IconButton>
                  ),
                }
              : undefined
          }
          disabled={editMode === "view"}
          autoComplete="off"
        />
      )}

      {editMode === "view" ? (
        loading ? (
          <Skeleton width="100%" height={70} animation="wave" />
        ) : (
          <AutocompleteLocations
            options={locations || []}
            loading={loadingLocations}
            inputValue={values.location}
            editable={editMode !== "view"}
            label={intl.formatMessage({
              id: "PROFILE.INPUT.LOCATION",
            })}
            inputClassName={innerClasses.autoLoc}
            // @ts-ignore
            inputError={Boolean(touched.location && errors.location && errors.location.text)}
            // @ts-ignore
            inputHelperText={touched.location && errors.location && errors.location.text}
            fetchLocations={fetchLocations}
            clearLocations={clearLocations}
            setSelectedLocation={location =>
              !!location ? setFieldValue("location", location) : setFieldValue("location", {})
            }
            handleBlur={handleBlur}
            disable={true}
          />
        )
      ) : loading ? (
        <Skeleton width="100%" height={202} animation="wave" />
      ) : (
        <div
          className={classes.box}
          style={!!values.location.text ? { borderColor: "#0abb87" } : {}}
        >
          {!values.location.text ? (
            <p>
              {values.bid_type === "sale"
                ? intl.formatMessage({ id: "BID.LOCATION.ABOUT.SALE" })
                : intl.formatMessage({ id: "BID.LOCATION.ABOUT.PURCHASE" })}
            </p>
          ) : (
            <p style={{ color: "#0abb87" }}>
              {values.bid_type === "sale"
                ? intl.formatMessage({ id: "BID.LOCATION.DONE.SALE" })
                : intl.formatMessage({ id: "BID.LOCATION.DONE.PURCHASE" })}
            </p>
          )}
          {(editMode === "edit" && !!user && user.points.length > 0) ||
          (editMode !== "edit" && !vendorId && !!me && me.points.length > 0) ||
          (editMode !== "edit" && !!vendorId && !!user && user.points.length > 0) ? (
            ((editMode === "edit" && !!user && user.points.length > 1) ||
              (editMode !== "edit" && !vendorId && !!me && me.points.length > 1) ||
              (editMode !== "edit" && !!vendorId && !!user && user.points.length > 1)) && (
              <TextField
                select
                margin="normal"
                label={intl.formatMessage({
                  id: "BIDSLIST.TABLE.MY_POINT",
                })}
                value={""}
                onBlur={handleBlur}
                onChange={event => {
                  setGoToRef(true);
                  if (editMode === "edit") {
                    if (!!user) {
                      let myLocation = user.points.find(item => item.id === +event.target.value);
                      if (!!myLocation) {
                        let newLocation = { ...myLocation };
                        delete newLocation.id;
                        delete newLocation.name;
                        setFieldValue("location", newLocation);
                      }
                    }
                  } else {
                    if (!vendorId && !!me) {
                      let myLocation = me.points.find(item => item.id === +event.target.value);
                      if (!!myLocation) {
                        let newLocation = { ...myLocation };
                        delete newLocation.id;
                        delete newLocation.name;
                        setFieldValue("location", newLocation);
                      }
                    }
                    if (!!vendorId && !!user) {
                      let myLocation = user.points.find(item => item.id === +event.target.value);
                      if (!!myLocation) {
                        let newLocation = { ...myLocation };
                        delete newLocation.id;
                        delete newLocation.name;
                        setFieldValue("location", newLocation);
                      }
                    }
                  }
                }}
                name="my_points"
                variant="outlined"
                autoComplete="off"
              >
                {editMode === "edit" ? (
                  !!user ? (
                    user.points.map(option => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value={0}>Пусто</MenuItem>
                  )
                ) : !vendorId && !!me ? (
                  me.points.map(option => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  ))
                ) : (
                  !!user &&
                  user.points.map(option => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  ))
                )}
              </TextField>
            )
          ) : (
            <p>{intl.formatMessage({ id: "BIDLIST.NO_POINTS" })}</p>
          )}
          <AutocompleteLocations
            options={locations || []}
            loading={loadingLocations}
            inputValue={values.location}
            editable={editMode !== "view"}
            label={
              values.bid_type === "sale"
                ? intl.formatMessage({ id: "PROFILE.INPUT.LOCATION.SALE" })
                : intl.formatMessage({ id: "PROFILE.INPUT.LOCATION.PURCHASE" })
            }
            inputClassName={innerClasses.autoLoc}
            // @ts-ignore
            inputError={Boolean(touched.location && errors.location && errors.location.text)}
            // @ts-ignore
            inputHelperText={touched.location && errors.location && errors.location.text}
            fetchLocations={fetchLocations}
            clearLocations={clearLocations}
            setSelectedLocation={location =>
              !!location ? setFieldValue("location", location) : setFieldValue("location", {})
            }
            handleBlur={handleBlur}
            disable={false}
          />
          <Button
            variant="outlined"
            color="primary"
            onFocus={() => inputEl.current?.blur()}
            ref={inputEl}
            disabled={buttonLoading || loading}
            style={{ position: "absolute", width: 50, height: 50, zIndex: -100 }}
          >
            .
          </Button>
        </div>
      )}

      {!loading &&
        !!values.crop_id &&
        (cropParamsLoading ? (
          <>
            <Skeleton width="100%" height={70} animation="wave" />
            <Skeleton width="100%" height={70} animation="wave" />
            <Skeleton width="100%" height={70} animation="wave" />
            <Skeleton width="100%" height={70} animation="wave" />
            <Skeleton width="100%" height={70} animation="wave" />
          </>
        ) : (
          !!cropParams &&
          cropParams.map(
            cropParam =>
              ((editMode === "view" &&
                bid?.parameter_values.find(item => item.parameter_id === cropParam.id)) ||
                editMode !== "view") &&
              (cropParam.type === "number" ? (
                <TextField
                  key={cropParam.id}
                  type="text"
                  label={cropParam.name}
                  margin="normal"
                  name={`parameter${cropParam.id}`}
                  value={values[`parameter${cropParam.id}`] || ""}
                  variant="outlined"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  InputProps={
                    editMode !== "view"
                      ? {
                          inputComponent: NumberFormatCustom as any,
                          endAdornment: (
                            <IconButton
                              onClick={() => setFieldValue(`parameter${cropParam.id}`, "")}
                            >
                              <CloseIcon />
                            </IconButton>
                          ),
                        }
                      : undefined
                  }
                  disabled={editMode === "view"}
                  autoComplete="off"
                />
              ) : (
                <Autocomplete
                  key={cropParam.id}
                  id={`parameter${cropParam.id}`}
                  options={cropParam.enum}
                  getOptionLabel={option => option}
                  noOptionsText={intl.formatMessage({
                    id: "ALL.AUTOCOMPLIT.EMPTY",
                  })}
                  value={values[`parameter${cropParam.id}`] || null}
                  onChange={(e: any, val: string | null) => {
                    setFieldValue(`parameter${cropParam.id}`, val || "");
                  }}
                  disabled={editMode === "view"}
                  renderInput={params => (
                    <TextField
                      {...params}
                      margin="normal"
                      label={cropParam.name}
                      variant="outlined"
                      onBlur={handleBlur}
                    />
                  )}
                />
              ))
          )
        ))}

      {((editMode === "view" && bid?.description === "") || editMode !== "view") &&
        (loading ? (
          <Skeleton width="100%" height={127} animation="wave" />
        ) : (
          <TextField
            type="text"
            label={intl.formatMessage({
              id: "BIDSLIST.TABLE.DESCRIPTION",
            })}
            margin="normal"
            name="description"
            value={values.description}
            variant="outlined"
            onBlur={handleBlur}
            onChange={handleChange}
            rows="6"
            multiline
            disabled={editMode === "view"}
          />
        ))}

      <div className={classes.bottomButtonsContainer}>
        {me && editMode !== "view" && (
          <>
            {editMode === "edit" ? (
              <div className={classes.button}>
                <ButtonWithLoader onPress={() => createFilter(bidId)}>
                  {intl.formatMessage({ id: "ALL.BUTTONS.CREATE_FILTER" })}
                </ButtonWithLoader>
              </div>
            ) : (
              <div className={classes.button}>
                {!!me?.tariff_matrix &&
                me.tariff_matrix.max_filters_count - filterCount <= 0 ? null : (
                  <>
                    {me && me.email ? (
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={isSendingEmail}
                            onChange={e => onCheckboxChange(e, 1)}
                          />
                        }
                        label={"Подписка по e-mail"}
                      />
                    ) : null}
                    {me && me.phone ? (
                      <FormControlLabel
                        control={
                          <Checkbox checked={isSendingSms} onChange={e => onCheckboxChange(e, 2)} />
                        }
                        label={"Подписка по смс"}
                      />
                    ) : null}
                  </>
                )}
              </div>
            )}

            <div className={classes.button}>
              <ButtonWithLoader
                loading={buttonLoading}
                disabled={buttonLoading || loading}
                onPress={() => {
                  !values.location.text ||
                  !values.volume ||
                  !values.price ||
                  !values.crop_id ||
                  (salePurchaseMode === "purchase" && !fullPrepayment && !values.payment_term)
                    ? setFormikErrored(true)
                    : setFormikErrored(false);
                  handleSubmit();
                }}
              >
                {editMode === "create"
                  ? intl.formatMessage({ id: "ALL.BUTTONS.BID_CREATE" })
                  : intl.formatMessage({ id: "ALL.BUTTONS.SAVE" })}
              </ButtonWithLoader>
            </div>
            {editMode === "edit" && (
              <div className={classes.button}>
                <OutlinedRedButton
                  variant="outlined"
                  onClick={() => setAlertOpen(true)}
                  disabled={buttonLoading || loading}
                >
                  {intl.formatMessage({ id: "ALL.BUTTONS.DELETE" })}
                </OutlinedRedButton>
              </div>
            )}
          </>
        )}
      </div>
      <AlertDialog
        isOpen={isMoreBidOpen}
        text={intl.formatMessage({
          id: "BIDLIST.MORE_BID.TEXT",
        })}
        okText={intl.formatMessage({
          id: "BIDLIST.MORE_BID.AGREE_TEXT",
        })}
        cancelText={intl.formatMessage({
          id: "BIDLIST.MORE_BID.CANCEL_TEXT",
        })}
        handleClose={() => {
          if (!!+vendorId) {
            history.push(`/user/edit/${vendorId}`);
          } else {
            history.push(`/${salePurchaseMode}/my-bids`);
          }
          setMoreBidOpen(false);
        }}
        handleAgree={() => {
          resetForm({
            values: getInitialValues(
              bid,
              currentCropId,
              salePurchaseMode,
              editMode,
              vendorId,
              user,
              me,
              isSendingEmail,
              isSendingSms
            ),
          });
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
          setMoreBidOpen(false);
          clearBidsPair();
        }}
      />
    </div>
  );
};

export default BidForm;
