import React, { useState, useEffect, useRef } from "react";
import { injectIntl, FormattedMessage } from "react-intl";
import { TextField, CircularProgress, MenuItem, Box } from "@material-ui/core";
import { Formik } from "formik";
import { Paper } from "@material-ui/core";
import NumberFormat from "react-number-format";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/styles";
import AutocompleteLocations from "../../../../components/AutocompleteLocations";
import ButtonWithLoader from "../../../../components/ui/Buttons/ButtonWithLoader";
import StatusAlert from "../../../../components/ui/Messages/StatusAlert";
import { getCropParams } from "../../../../crud/crops.crud";
import LocationBlock from "../components/location/LocationBlock";

const getInitialValues = (bid, crop) => {
  const values = {
    volume: bid.volume || "",
    price: bid.price || "",
    description: bid.description || "",
    crop: crop,
    location: bid.location || {},
    pricePerKm: bid.price_delivery_per_km,
  };
  if (bid.parameter_values && bid.parameter_values.length > 0) {
    bid.parameter_values.map(item => {
      values[`parameter${item.parameter_id}`] = item.value;
    });
  }
  return values;
};

const getFinalPrice = (bid, pricePerKm) => {
  const distance = !bid.distance || bid.distance < 100 ? 100 : bid.distance;
  return Math.round(bid.price * bid.volume + pricePerKm * distance);
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
  bid,
  isEditable,
  fetchLocations,
  clearLocations,
  openLocation,
  user,
}) {
  const formRef = useRef();

  const innerClasses = useInnerStyles();
  const [cropParams, setCropParams] = useState([]);
  const [isParamLoading, setCropParamLoading] = useState(false);

  const { locations, isLoadingLocations } = useSelector(state => state.locations);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const filterCrops = crops.filter(item => item.id === bid.crop_id);
  const currentCrop = filterCrops && filterCrops.length > 0 ? filterCrops[0] : null;

  const getCropParamsAction = cropId => {
    setCropParamLoading(true);
    setCropParams([]);
    getCropParams(cropId)
      .then(({ data }) => {
        setCropParamLoading(false);
        if (data && data.data) {
          setCropParams(data.data);
        }
      })
      .catch(error => {
        setCropParamLoading(false);
        setCropParams([]);
      });
  };
  useEffect(() => {
    if (currentCrop) {
      getCropParamsAction(currentCrop.id);
    }
  }, []); // eslint-disable-line
  useEffect(() => {
    !isEditable && formRef.current.resetForm({ values: getInitialValues(bid) });
  }, [bid]);
  return (
    <Paper className={classes.container}>
      <Formik
        autoComplete="off"
        initialValues={getInitialValues(bid, currentCrop)}
        validationSchema={Yup.object().shape({
          volume: Yup.string().required(
            <FormattedMessage id="PROFILE.VALIDATION.REQUIRED_FIELD" />
          ),
          price: Yup.string().required(<FormattedMessage id="PROFILE.VALIDATION.REQUIRED_FIELD" />),
          crop: Yup.mixed().required(<FormattedMessage id="PROFILE.VALIDATION.REQUIRED_FIELD" />),
        })}
        onSubmit={(values, { setStatus, setSubmitting, resetForm }) => {
          const paramValues = [];
          cropParams.map(param => {
            const id = param.id;
            if (values[`parameter${id}`] && values[`parameter${id}`] !== "") {
              paramValues.push({ parameter_id: id, value: values[`parameter${id}`].toString() });
            }
          });
          const cropId = values.crop.id;
          values.description === "" && delete values.description;

          if (selectedLocation) {
            values.location = { ...selectedLocation };
          } else {
            delete values.location;
          }
          submitAction(
            { ...values, crop_id: cropId, parameter_values: paramValues },
            setStatus,
            setSubmitting
          );
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
        }) => (
          <div className={classes.form}>
            <form noValidate autoComplete="off" className="kt-form" onSubmit={handleSubmit}>
              <StatusAlert status={status} />
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
                  <LocationBlock
                    handleClick={openLocation}
                    location={user.location && user.location.text}
                  />
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
                  <div className={innerClasses.calcDescriptionContainer}>
                    <div className={innerClasses.calcDescription}>
                      {`${intl.formatMessage({ id: "BID.CALCULATOR.FINAL_PRICE" })}`}
                    </div>
                    <div className={innerClasses.calcFinalPrice}>
                      {getFinalPrice(bid, values.pricePerKm)}
                    </div>
                  </div>
                </Box>
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

              <AutocompleteLocations
                options={locations}
                loading={isLoadingLocations}
                defaultValue={{
                  text: values.location && values.location.text ? values.location.text : "",
                }}
                editable={!(values.location && values.location.text)}
                label={intl.formatMessage({
                  id: "PROFILE.INPUT.LOCATION",
                })}
                inputClassName={classes.textField}
                inputError={Boolean(touched.location && errors.location)}
                inputHelperText={touched.location && errors.location}
                fetchLocations={fetchLocations}
                clearLocations={clearLocations}
                setSelectedLocation={setSelectedLocation}
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
                  {crops.map(option => (
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
                  >
                    {cropParam.enum.map(option => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                )
              )}
              {isEditable && (
                <div className={classes.buttonContainer}>
                  <ButtonWithLoader loading={loading} onPress={handleSubmit}>
                    {bid && bid.id
                      ? intl.formatMessage({ id: "BIDSLIST.BUTTON.EDIT_BID" })
                      : intl.formatMessage({ id: "BIDSLIST.BUTTON.CREATE_BID" })}
                  </ButtonWithLoader>
                </div>
              )}
            </form>
          </div>
        )}
      </Formik>
    </Paper>
  );
}

export default injectIntl(BidForm);
