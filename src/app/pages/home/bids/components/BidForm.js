import React from "react";
import { injectIntl, FormattedMessage } from "react-intl";
import { TextField } from "@material-ui/core";
import { Formik } from "formik";
import { Paper } from "@material-ui/core";
import NumberFormat from "react-number-format";
import * as Yup from "yup";
import ButtonWithLoader from "../../../../components/ui/Buttons/ButtonWithLoader";
import StatusAlert from "../../../../components/ui/Messages/StatusAlert";

const getInitialValues = () => ({
  volume: "",
  price: "",
  description: "",
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

function BidForm({ loading, submitAction, intl, classes }) {
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
        })}
        onSubmit={(values, { setStatus, setSubmitting, resetForm }) => {
          submitAction({...values, crop_id:1}, setStatus, setSubmitting);
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
