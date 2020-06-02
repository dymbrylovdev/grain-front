import React, { useEffect, useState, useRef } from "react";
import { IntlShape } from "react-intl";
import { Link } from "react-router-dom";
import { TextField, MenuItem, Grid, makeStyles, Button } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { Skeleton } from "@material-ui/lab";
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

const useInnerStyles = makeStyles(theme => ({
  calcTitle: {
    fontSize: 14,
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
  me: IUser | undefined
) => {
  const values: { [x: string]: any } = {
    volume: bid?.volume || "",
    price: bid?.price || "",
    description: bid?.description || "",
    crop_id: bid?.crop_id ? bid?.crop_id : cropId ? cropId : 0,
    location2: bid?.location || { text: "" },
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

  fetchCropParams,
  cropParams,
  cropParamsLoading,

  buttonLoading,
  setAlertOpen,
}) => {
  const history = useHistory();
  const classes = useStyles();
  const innerClasses = useInnerStyles();

  const inputEl = useRef<HTMLButtonElement>(null);
  const [goToRef, setGoToRef] = useState(false);

  useEffect(() => {
    if (goToRef) {
      inputEl.current?.focus();
      setGoToRef(false);
    }
  }, [goToRef]);

  const currentCropId: number = !!bid ? bid.crop_id : !!cropId ? cropId : 0;
  const vendor_id =
    (!bid && +vendorId) || (bid && bid.vendor && bid.vendor.id) || (me?.id as number);

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
        .min(0, intl.formatMessage({ id: "YUP.NUMBERS.MIN" }, { min: 0 }))
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
      crop_id: Yup.number().min(1, intl.formatMessage({ id: "PROFILE.VALIDATION.REQUIRED_FIELD" })),
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
    resetForm({
      values: getInitialValues(bid, currentCropId, salePurchaseMode, editMode, vendorId, user, me),
    });
  }, [bid, currentCropId, editMode, me, resetForm, salePurchaseMode, user, vendorId]);

  useEffect(() => {
    if (!!bid && bid.crop_id) fetchCropParams(bid.crop_id);
    if (!!cropId) fetchCropParams(cropId);
  }, [bid, cropId, fetchCropParams]);

  const loading = !me || !crops || (editMode !== "create" && !bid) || (!!vendorId && !user);

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
            disabled={buttonLoading || loading}
          >
            {intl.formatMessage({ id: "ALL.BUTTONS.PREV" })}
          </Button>
        </div>
      </div>
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
            (!!me && !me.is_admin) ||
            (!!me && me.is_admin && !!vendorId && !!user && !user.is_admin)
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
          disabled={editMode === "view"}
          autoComplete="off"
        />
      )}

      {editMode === "view" &&
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
        <div className={classes.box}>
          <p>{intl.formatMessage({ id: "BID.LOCATION.ABOUT" })}</p>
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
            <>
              <p>{intl.formatMessage({ id: "BIDLIST.NO_POINTS" })}</p>
            </>
          )}
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
        <TextField
          select
          margin="normal"
          label={intl.formatMessage({
            id: "BIDSLIST.TABLE.CROP",
          })}
          value={values.crop_id}
          onBlur={handleBlur}
          onChange={event => {
            if (+event.target.value) fetchCropParams(+event.target.value);
            handleChange(event);
          }}
          name="crop_id"
          variant="outlined"
          helperText={touched.crop_id && errors.crop_id}
          error={Boolean(touched.crop_id && errors.crop_id)}
          disabled={editMode === "view"}
        >
          <MenuItem value={0}>{intl.formatMessage({ id: "ALL.SELECTS.EMPTY" })}</MenuItem>
          {crops &&
            crops.map(option => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
        </TextField>
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
                type="text"
                label={cropParam.name}
                margin="normal"
                name={`parameter${cropParam.id}`}
                value={values[`parameter${cropParam.id}`] || ""}
                variant="outlined"
                onBlur={handleBlur}
                disabled={editMode === "view"}
                onChange={handleChange}
                key={cropParam.id}
                autoComplete="off"
              />
            ) : (
              <TextField
                select
                type="text"
                label={cropParam.name}
                margin="normal"
                name={`parameter${cropParam.id}`}
                value={values[`parameter${cropParam.id}`] || ""}
                variant="outlined"
                onBlur={handleBlur}
                onChange={handleChange}
                disabled={editMode === "view"}
                key={cropParam.id}
              >
                {cropParam.enum.map(option => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
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

      {loading ? (
        <Skeleton width="100%" height={127} animation="wave" />
      ) : (
        bid?.vendor && (
          <Link
            to={
              me?.id === (!!bid && bid.vendor && bid.vendor.id)
                ? "/user/profile"
                : `/user/view/${!!bid && bid.vendor && bid.vendor.id}`
            }
          >
            <div className={innerClasses.authorText}>
              {`${intl.formatMessage({ id: "BID.FORM.AUTHOR" })} ${bid.vendor.fio ||
                bid.vendor.login}`}
            </div>
          </Link>
        )
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
                  ? intl.formatMessage({ id: "ALL.BUTTONS.CREATE" })
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
    </div>
  );
};

export default BidForm;
