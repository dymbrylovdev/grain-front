import React, { useState } from "react";
import { injectIntl, FormattedMessage } from "react-intl";
import { TextField, CircularProgress, MenuItem } from "@material-ui/core";
import { Formik } from "formik";
import { Paper } from "@material-ui/core";
import NumberFormat from "react-number-format";
import * as Yup from "yup";
import ButtonWithLoader from "../../../../components/ui/Buttons/ButtonWithLoader";
import StatusAlert from "../../../../components/ui/Messages/StatusAlert";
import { getCropParams } from "../../../../crud/crops.crud";

const getInitialValues = () => ({
  volume: "",
  price: "",
  description: "",
  crop: null,
});

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

function BidForm({ loading, submitAction, intl, classes, crops }) {
  const [cropParams, setCropParams] = useState([]);
  const [isParamLoading, setCropParamLoading] = useState(false);
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

  return (
    <Paper className={classes.container}>
      <Formik
        autoComplete="off"
        initialValues={getInitialValues()}
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
              paramValues.push({ parameter_id: id, value: values[`parameter${id}`] });
            }
          });
          const cropId = values.crop.id;
          delete values.crop;
          values.description === "" && delete values.description;
          submitAction(
            { ...values, crop_id: cropId, parameter_values: paramValues },
            setStatus,
            setSubmitting
          );
        }}
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
              />
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
                    onChange={handleChange}
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
                  >
                    {cropParam.enum.map(option => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                )
              )}
              <div className={classes.buttonContainer}>
                <ButtonWithLoader loading={loading} onPress={handleSubmit}>
                  <FormattedMessage id="BIDSLIST.BUTTON.CREATE_BID" />
                </ButtonWithLoader>
              </div>
            </form>
          </div>
        )}
      </Formik>
    </Paper>
  );
}

export default injectIntl(BidForm);
