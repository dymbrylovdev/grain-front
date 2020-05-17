import React, { useState, useEffect, useRef } from "react";
import { injectIntl, FormattedMessage } from "react-intl";
import { TextField, CircularProgress, MenuItem, Box, Grid } from "@material-ui/core";
import { Link } from "react-router-dom";
import { Formik } from "formik";
import { useSnackbar } from "notistack";
import { Paper } from "@material-ui/core";
import NumberFormat from "react-number-format";
import * as Yup from "yup";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/styles";

import AutocompleteLocations from "../../../../components/AutocompleteLocations";
import ButtonWithLoader from "../../../../components/ui/Buttons/ButtonWithLoader";
import StatusAlert from "../../../../components/ui/Messages/StatusAlert";

const getInitialValues = (bid, crop, userRole) => {
  // debugger;
  const values = {
    volume: bid?.volume || "",
    price: bid?.price || "",
    description: bid?.description || "",
    crop: crop,
    location: bid?.location || { text: "" },
    pricePerKm: bid?.price_delivery_per_km || 4,
    bid_type: !!bid ? bid.type : userRole === "buyer" ? "purchase" : "sale",
  };
  if (bid && bid.parameter_values && bid.parameter_values.length > 0) {
    bid.parameter_values.forEach(item => {
      values[`parameter${item.parameter_id}`] = item.value;
    });
  }
  return values;
};

const getFinalPrice = (bid, i, pricePerKm) => {
  const distance =
    !bid.point_prices[i].distance || bid.point_prices[i].distance < 100
      ? 100
      : bid.point_prices[i].distance;
  return Math.round(bid.price + pricePerKm * distance);
};

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
}));

function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={values => {
        onChange(values.value);
      }}
      decimalScale={2}
    />
  );
}

function BidForm({
  loading,
  submitAction,
  intl,
  classes,
  crops,
  cropId,
  bid,
  bidId,
  isEditable,
  fetchLocations,
  clearLocations,
  getCropParams,
  openLocation,
  user,
  userRole,
  locations,
  isLoadingLocations,
}) {
  const formRef = useRef();

  const innerClasses = useInnerStyles();
  const [cropParams, setCropParams] = useState([]);
  const [isParamLoading, setCropParamLoading] = useState(false);

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

  const filterCrops =
    bid && crops && crops.filter(item => item.id === bid.crop_id)
      ? crops.filter(item => item.id === bid.crop_id)
      : null;

  const currentCrop =
    filterCrops && filterCrops.length > 0
      ? filterCrops[0]
      : !!cropId && !!crops
      ? crops.find(item => item.id === +cropId)
      : null;
  // console.log("crops: ", crops);
  // console.log("currentCrop: ", currentCrop);
  const getCropParamsAction = cropId => {
    setCropParamLoading(true);
    setCropParams([]);
    const successCallback = data => {
      setCropParamLoading(false);
      setCropParams(data || []);
    };
    const failCallback = () => {
      setCropParamLoading(false);
      setCropParams([]);
    };
    getCropParams(cropId, successCallback, failCallback);
  };

  useEffect(() => {
    if (currentCrop) {
      getCropParamsAction(currentCrop.id);
    }
  }, [currentCrop]); // eslint-disable-line

  useEffect(() => {
    //console.log("--currentBid", bid);
    formRef.current.resetForm({ values: getInitialValues(bid, currentCrop, userRole) });
    if (!bid || !bid.id) {
      setCropParams([]);
    }
  }, [bidId, currentCrop]); // eslint-disable-line

  const toUserPath =
    user.id === (!!bid && bid.vendor && bid.vendor.id)
      ? "/user/profile"
      : `/user/view/${!!bid && bid.vendor && bid.vendor.id}`;

  return (
    <Paper className={classes.container}>
      <Formik
        autoComplete="off"
        initialValues={getInitialValues(bid, currentCrop, userRole)}
        validationSchema={Yup.object().shape({
          volume: Yup.string().required(
            <FormattedMessage id="PROFILE.VALIDATION.REQUIRED_FIELD" />
          ),
          price: Yup.string().required(<FormattedMessage id="PROFILE.VALIDATION.REQUIRED_FIELD" />),
          location: Yup.object({
            text: Yup.string().required(
              <FormattedMessage id="PROFILE.VALIDATION.REQUIRED_FIELD" />
            ),
          }),
          crop: Yup.mixed().required(<FormattedMessage id="PROFILE.VALIDATION.REQUIRED_FIELD" />),
        })}
        onSubmit={(values, { setStatus, setSubmitting, resetForm }) => {
          const paramValues = [];
          cropParams.forEach(param => {
            const id = param.id;
            if (values[`parameter${id}`] && values[`parameter${id}`] !== "") {
              paramValues.push({ parameter_id: id, value: values[`parameter${id}`].toString() });
            }
          });
          const cropId = values.crop.id;
          values.description === "" && delete values.description;
          console.log(values);
          submitAction({ ...values, crop_id: cropId, parameter_values: paramValues });
        }}
        innerRef={formRef}
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
          setFieldValue,
        }) => {
          console.log("values: ", values);
          return (
            <div className={classes.form}>
              <form noValidate autoComplete="off" className="kt-form" onSubmit={handleSubmit}>
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
                  onChange={handleChange("bid_type")}
                  disabled={!isEditable || userRole !== "admin"}
                >
                  <MenuItem value={"sale"}>{intl.formatMessage({ id: "BID.TYPE.SALE" })}</MenuItem>
                  <MenuItem value={"purchase"}>
                    {intl.formatMessage({ id: "BID.TYPE.PURCHASE" })}
                  </MenuItem>
                </TextField>
                <TextField
                  type="text"
                  label={intl.formatMessage({
                    id: "BIDSLIST.TABLE.COST",
                  })}
                  margin="normal"
                  name="price"
                  value={values.price}
                  variant="outlined"
                  onBlur={handleBlur}
                  onChange={handleChange("price")}
                  helperText={touched.price && errors.price}
                  error={Boolean(touched.price && errors.price)}
                  InputProps={{
                    inputComponent: NumberFormatCustom,
                  }}
                  disabled={!isEditable}
                />
                {!!user &&
                  user.use_vat &&
                  values.bid_type === "sale" &&
                  !!bid &&
                  !!bid.vat &&
                  !bid.vendor.use_vat && (
                    <>
                      <TextField
                        type="text"
                        label={intl.formatMessage(
                          { id: "BIDSLIST.TABLE.COST_WITH_VAT" },
                          { vat: bid.vat }
                        )}
                        margin="normal"
                        name="price"
                        value={Math.round(+values.price * (+bid.vat / 100 + 1))}
                        variant="outlined"
                        InputProps={{
                          inputComponent: NumberFormatCustom,
                        }}
                        disabled
                      />
                      <p>
                        {intl.formatMessage(
                          { id: "BIDSLIST.TABLE.COST_WITH_VAT.ABOUT" },
                          { vat: Math.round((+values.price * +bid.vat) / 100) }
                        )}
                      </p>
                    </>
                  )}
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
                  onChange={handleChange("volume")}
                  helperText={touched.volume && errors.volume}
                  error={Boolean(touched.volume && errors.volume)}
                  InputProps={{
                    inputComponent: NumberFormatCustom,
                  }}
                  disabled={!isEditable}
                />
                {!isEditable && (
                  <Box
                    className={classes.paramContainer}
                    border={1}
                    borderColor="#eeeeee"
                    borderRadius={5}
                  >
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
                      onChange={handleChange("pricePerKm")}
                      InputProps={{
                        inputComponent: NumberFormatCustom,
                      }}
                    />
                    <div className={innerClasses.calcDescription}>
                      {!!user &&
                      user.use_vat &&
                      values.bid_type === "sale" &&
                      !!bid &&
                      !bid.vendor.use_vat
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
                        bid.point_prices.map((item, i) => (
                          <div key={i}>
                            {!!user &&
                            user.use_vat &&
                            values.bid_type === "sale" &&
                            !!bid &&
                            !bid.vendor.use_vat ? (
                              <strong>
                                {Math.round(
                                  getFinalPrice(bid, i, values.pricePerKm) * (+bid.vat / 100 + 1)
                                )}
                              </strong>
                            ) : (
                              <strong>{getFinalPrice(bid, i, values.pricePerKm)}</strong>
                            )}
                            {` • ${item.point.name}`}
                          </div>
                        ))}
                    </Grid>
                  </Box>
                )}
                <AutocompleteLocations
                  options={locations || []}
                  loading={isLoadingLocations}
                  inputValue={values.location}
                  editable={!(values.location && values.location.text)}
                  label={intl.formatMessage({
                    id: "PROFILE.INPUT.LOCATION",
                  })}
                  inputClassName={classes.textField}
                  inputError={Boolean(touched.location && errors.location && errors.location.text)}
                  inputHelperText={touched.location && errors.location && errors.location.text}
                  fetchLocations={fetchLocations}
                  clearLocations={clearLocations}
                  setSelectedLocation={location =>
                    !!location ? setFieldValue("location", location) : setFieldValue("location", {})
                  }
                  handleBlur={handleBlur}
                  disable={!isEditable}
                />
                <div className={classes.textFieldContainer}>
                  <TextField
                    select
                    margin="normal"
                    className={classes.textSelect}
                    label={intl.formatMessage({
                      id: "BIDSLIST.TABLE.CROP",
                    })}
                    value={values.crop}
                    onChange={event => {
                      getCropParamsAction(event.target.value.id);
                      handleChange(event);
                    }}
                    name="crop"
                    variant="outlined"
                    helperText={touched.crop && errors.crop}
                    error={Boolean(touched.crop && errors.crop)}
                    disabled={!isEditable}
                  >
                    {crops &&
                      crops.map(option => (
                        <MenuItem key={option.id} value={option}>
                          {option.name}
                        </MenuItem>
                      ))}
                  </TextField>
                  {isParamLoading && <CircularProgress className={classes.leftIcon} />}
                </div>
                {cropParams.map(cropParam =>
                  cropParam.type === "number" ? (
                    <TextField
                      type="text"
                      label={cropParam.name}
                      margin="normal"
                      name={`parameter${cropParam.id}`}
                      value={values[`parameter${cropParam.id}`]}
                      variant="outlined"
                      onBlur={handleBlur}
                      disabled={!isEditable}
                      onChange={handleChange(`parameter${cropParam.id}`)}
                      InputProps={{
                        inputComponent: NumberFormatCustom,
                      }}
                      key={cropParam.id}
                    />
                  ) : (
                    <TextField
                      select
                      type="text"
                      label={cropParam.name}
                      margin="normal"
                      name={`parameter${cropParam.id}`}
                      value={values[`parameter${cropParam.id}`]}
                      variant="outlined"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      disabled={!isEditable}
                      key={cropParam.id}
                    >
                      {cropParam.enum.map(option => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
                  )
                )}
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
                  disabled={!isEditable}
                />
                {bid?.vendor && (
                  <Link to={toUserPath}>
                    <div className={innerClasses.authorText}>
                      {`${intl.formatMessage({ id: "BID.FORM.AUTHOR" })} ${bid.vendor.fio ||
                        bid.vendor.login}`}
                    </div>
                  </Link>
                )}
                <StatusAlert status={status} />
                {isEditable && (
                  <div className={classes.buttonContainer}>
                    <ButtonWithLoader
                      loading={loading}
                      disabled={loading}
                      onPress={() => {
                        // console.log(errors);
                        !values.location.text || !values.volume || !values.price || !values.crop
                          ? setFormikErrored(true)
                          : setFormikErrored(false);
                        handleSubmit();
                      }}
                    >
                      {bid && bid.id
                        ? intl.formatMessage({ id: "BIDSLIST.BUTTON.EDIT_BID" })
                        : intl.formatMessage({ id: "BIDSLIST.BUTTON.CREATE_BID" })}
                    </ButtonWithLoader>
                  </div>
                )}
              </form>
            </div>
          );
        }}
      </Formik>
    </Paper>
  );
}

export default connect(state => ({
  locations: state.yaLocations.yaLocations,
  isLoadingLocations: state.yaLocations.loading,
}))(injectIntl(BidForm));
