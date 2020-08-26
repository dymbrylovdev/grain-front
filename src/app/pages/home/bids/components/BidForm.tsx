import React, { useEffect, useState, useRef } from "react";
import { IntlShape } from "react-intl";
import { Link } from "react-router-dom";
import { TextField, MenuItem, Grid, makeStyles, Button, IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { useHistory } from "react-router-dom";
import { Skeleton, Autocomplete } from "@material-ui/lab";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSnackbar } from "notistack";

import AutocompleteLocations from "../../../../components/AutocompleteLocations";
import { IBid, TBidType, IBidToRequest } from "../../../../interfaces/bids";
import { IUser } from "../../../../interfaces/users";
import { ActionWithPayload, Action } from "../../../../utils/action-helper";
import { ICropParam, ICrop } from "../../../../interfaces/crops";
import { ILocation } from "../../../../interfaces/locations";
import useStyles from "../../styles";
import ButtonWithLoader from "../../../../components/ui/Buttons/ButtonWithLoader";
import { OutlinedRedButton } from "../../../../components/ui/Buttons/RedButtons";
import { IParamValue } from "../../../../interfaces/filters";
import NumberFormatCustom from "../../../../components/NumberFormatCustom/NumberFormatCustom";
import { accessByRoles, getConfirmCompanyString } from "../../../../utils/utils";
import { TrafficLight } from "../../users/components";
import AlertDialog from "../../../../components/ui/Dialogs/AlertDialog";

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
    fontSize: 16,
    paddingRight: theme.spacing(1),
  },
  calcFinalPrice: {
    fontSize: 16,
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
  me: IUser | undefined
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

interface IProps {
  intl: IntlShape;
  vendorId: number;
  user: IUser | undefined;
  salePurchaseMode: string;
  editMode: string;
  cropId: number;
  crops: ICrop[] | undefined;
  bid: IBid | undefined;
  me: IUser | undefined;
  fetchLocations: (payload: any) => ActionWithPayload<"yaLocations/FETCH_REQUEST", any>;
  locations: ILocation[] | undefined;
  loadingLocations: boolean;
  clearLocations: () => Action<"yaLocations/CLEAR">;
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
    data: IBidToRequest
  ) => ActionWithPayload<
    "bids/CREATE_REQUEST",
    {
      type: TBidType;
      data: IBidToRequest;
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
  me,

  create,
  edit,

  fetchLocations,
  locations,
  loadingLocations,
  clearLocations,

  clearCropParams,
  fetchCropParams,
  cropParams,
  cropParamsLoading,

  buttonLoading,
  setAlertOpen,

  createSuccess,
  createError,
  clearCreate,
}) => {
  const history = useHistory();
  const classes = useStyles();
  const innerClasses = useInnerStyles();

  const inputEl = useRef<HTMLButtonElement>(null);
  const [goToRef, setGoToRef] = useState(false);
  const [isMoreBidOpen, setMoreBidOpen] = useState(false);

  useEffect(() => {
    if (goToRef) {
      inputEl.current?.focus();
      setGoToRef(false);
    }
  }, [goToRef]);

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
      me
    ),
    onSubmit: values => {
      const paramValues: IParamValue[] = [];
      cropParams?.forEach(param => {
        const id = param.id;
        if (values[`parameter${id}`] && values[`parameter${id}`] !== "") {
          paramValues.push({ parameter_id: id, value: values[`parameter${id}`].toString() });
        }
      });
      const params: { [x: string]: any } = {
        ...values,
        vendor_id,
        price: +values.price,
        volume: +values.volume,
        payment_term: +values.payment_term,
        parameter_values: paramValues,
      };
      const bidType = params.bid_type;
      delete params.bid_type;
      if (editMode === "create") create(bidType, params);
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
    }),
  });

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
          ? intl.formatMessage({ id: "NOTISTACK.BIDS.ADD" })
          : `${intl.formatMessage({ id: "NOTISTACK.ERRORS.ERROR" })} ${createError}`,
        {
          variant: createSuccess ? "success" : "error",
        }
      );
      clearCreate();
      if (createSuccess) {
        setMoreBidOpen(true);
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
  ]);

  useEffect(() => {
    resetForm({
      values: getInitialValues(bid, currentCropId, salePurchaseMode, editMode, vendorId, user, me),
    });
  }, [bid, currentCropId, editMode, me, resetForm, salePurchaseMode, user, vendorId]);

  useEffect(() => {
    if (currentCropId) fetchCropParams(currentCropId);
  }, [currentCropId, fetchCropParams]);

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
                  !values.location.text || !values.volume || !values.price || !values.crop_id
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
                    {bid.author.fio || bid.author.login}
                  </div>
                </Link>
              </div>
            )}
            <div>
              <Link
                to={
                  me?.id === (!!bid && bid.vendor && bid.vendor.id)
                    ? "/user/profile"
                    : `/user/view/${!!bid && bid.vendor && bid.vendor.id}`
                }
              >
                <div className={innerClasses.authorText}>
                  {`${
                    bid.type === "sale"
                      ? intl.formatMessage({ id: "AUTH.REGISTER.VENDOR" })
                      : intl.formatMessage({ id: "AUTH.REGISTER.BUYER" })
                  }: ${bid.vendor.fio || bid.vendor.login}`}
                </div>
              </Link>
              {!!bid.vendor.company && <div>{bid.vendor.company.short_name}</div>}
              <p>{getConfirmCompanyString(bid.vendor as IUser, intl)}</p>
            </div>
          </>
        )
      )}

      {!!bid?.vendor?.company?.colors && (
        <TrafficLight intl={intl} colors={bid.vendor.company.colors} />
      )}

      {loading ? (
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
          <MenuItem value={"purchase"}>{intl.formatMessage({ id: "BID.TYPE.PURCHASE" })}</MenuItem>
        </TextField>
      )}

      {loading ? (
        <Skeleton width="100%" height={70} animation="wave" />
      ) : (
        <TextField
          type="text"
          label={intl.formatMessage({
            id: "ALL.PRICE_OF_TON",
          })}
          margin="normal"
          name="price"
          value={values.price}
          variant="outlined"
          onBlur={handleBlur}
          onChange={handleChange}
          helperText={touched.price && errors.price}
          error={Boolean(touched.price && errors.price)}
          InputProps={
            editMode !== "view"
              ? {
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

      {!!me &&
        me.use_vat &&
        values.bid_type === "sale" &&
        !!bid &&
        !!bid.vat &&
        !bid.vendor.use_vat &&
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
              value={Math.round(+values.price * (+bid.vat / 100 + 1))}
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
          value={values.volume}
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
                      <IconButton onClick={() => setFieldValue("payment_term", "")}>
                        <CloseIcon />
                      </IconButton>
                    ),
                  }
                : undefined
            }
            disabled={editMode === "view"}
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
            />
            <div className={innerClasses.calcDescription}>
              {!!me && me.use_vat && values.bid_type === "sale" && !!bid && !bid.vendor.use_vat
                ? intl.formatMessage(
                    { id: "BID.CALCULATOR.FINAL_PRICE_WITH_VAT" },
                    { vat: bid.vat }
                  )
                : intl.formatMessage({ id: "BID.CALCULATOR.FINAL_PRICE" })}
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
                      !bid.vendor.use_vat ? (
                        <b>
                          {Math.round(
                            getFinalPrice(bid, i, values.pricePerKm, salePurchaseMode, +bid.vat)
                          )}
                        </b>
                      ) : (
                        <b>{getFinalPrice(bid, i, values.pricePerKm, salePurchaseMode, 0)}</b>
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
          cropParams.map(cropParam =>
            cropParam.type === "number" ? (
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
                          <IconButton onClick={() => setFieldValue(`parameter${cropParam.id}`, "")}>
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
            )
          )
        ))}

      {loading ? (
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
      )}

      <div className={classes.bottomButtonsContainer}>
        {/* <div className={classes.button}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => history.goBack()}
            disabled={buttonLoading || loading}
          >
            {intl.formatMessage({ id: "ALL.BUTTONS.PREV" })}
          </Button>
        </div> */}
        {editMode !== "view" && (
          <>
            <div className={classes.button}>
              <ButtonWithLoader
                loading={buttonLoading}
                disabled={buttonLoading || loading}
                onPress={() => {
                  !values.location.text || !values.volume || !values.price || !values.crop_id
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
            history.push("/user-list");
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
              me
            ),
          });
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
          setMoreBidOpen(false);
        }}
      />
    </div>
  );
};

export default BidForm;
