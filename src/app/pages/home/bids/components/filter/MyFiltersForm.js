import React, { useRef, useEffect, useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  makeStyles,
  TextField,
  Divider,
  IconButton,
  Grid,
  FormControlLabel,
  Checkbox,
  Button,
} from "@material-ui/core";
import { Row, Col } from "react-bootstrap";
import { injectIntl } from "react-intl";
import CloseIcon from "@material-ui/icons/Close";
import ButtonWithLoader from "../../../../../components/ui/Buttons/ButtonWithLoader";
import CheckBoxParamGroup from "./CheckBoxParamGroup";
import NumberParam from "./NumberParam";
import { fromApiToFilter } from "../../../myFilters/utils";
import { filterForCreate } from "../../../myFilters/utils";
import AlertDialog from "../../../../../components/ui/Dialogs/AlertDialog";
import { OutlinedRedButton } from "../../../../../components/ui/Buttons/RedButtons";
import NumberFormatCustom from "../../../../../components/ui/NumberFormatCustom";

const innerStyle = makeStyles(theme => ({
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
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

function MyFiltersForm({
  handleSubmitFilter,
  classes,
  intl,
  enumParams,
  numberParams,
  cropId,
  filter,
  savedFilter,
  handleClear,
  setDelFilterId,
  delFilter,
  delLoading,
  editFilter,
  editLoading,
}) {
  const innerClasses = innerStyle();
  const formRef = useRef();

  const [isAlertOpen, setAlertOpen] = useState(false);

  useEffect(() => {
    formRef.current.resetForm({ values: fromApiToFilter(filter) });
  }, [filter]);

  const clearAction = param => {
    formRef.current.setFieldValue(param, undefined);
  };

  return (
    <Formik
      autoComplete="off"
      initialValues={fromApiToFilter(filter)}
      onSubmit={values => {
        //console.log("values: ", values);
        // handleSubmit({ ...values, id: filter.id });
        let params = { ...values };
        params.name = values.name.trim();
        params.point_prices = [];
        filter.point_prices.forEach(item => {
          params.point_prices.push({ point_id: item.point.id, price: item.price });
        });
        editFilter({
          id: filter.id,
          data: filterForCreate(params, enumParams, numberParams),
        });
      }}
      validationSchema={Yup.object().shape({
        name: Yup.string()
          .required(intl.formatMessage({ id: "FILTER.FORM.NAME.REQUIRED" }))
          .trim(),
      })}
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
        resetForm,
        initialValues,
      }) => (
        <Col>
          <div style={{ marginBottom: "16px" }}>
            {savedFilter && savedFilter.id && savedFilter.id === filter.id ? (
              <Button variant="contained" color="secondary" onClick={handleClear}>
                {intl.formatMessage({ id: "FILTER.FORM.BUTTON.RESET" })}
              </Button>
            ) : (
              <ButtonWithLoader onPress={() => handleSubmitFilter({ ...values, id: filter.id })}>
                {intl.formatMessage({ id: "FILTER.FORM.BUTTON.SUBMIT" })}
              </ButtonWithLoader>
            )}
          </div>
          <div className={innerClasses.textFieldContainer}>
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
              onChange={handleChange("name")}
              helperText={touched.name && errors.name}
              error={Boolean(touched.name && errors.name)}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={() => clearAction("name")}>
                    <CloseIcon />
                  </IconButton>
                ),
              }}
              autoComplete="off"
            />
          </div>
          <Row>
            {enumParams &&
              enumParams.map(param => (
                <Col key={param.id}>
                  <CheckBoxParamGroup param={param} values={values} handleChange={handleChange} />
                </Col>
              ))}
          </Row>
          <div className={classes.textFieldContainer}>
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
              InputProps={{
                inputComponent: NumberFormatCustom,
                endAdornment: (
                  <IconButton onClick={() => clearAction("max_full_price")}>
                    <CloseIcon />
                  </IconButton>
                ),
              }}
              autoComplete="off"
            />
          </div>
          <div className={classes.textFieldContainer}>
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
              InputProps={{
                inputComponent: NumberFormatCustom,
                endAdornment: (
                  <IconButton onClick={() => clearAction("min_full_price")}>
                    <CloseIcon />
                  </IconButton>
                ),
              }}
              autoComplete="off"
            />
          </div>
          <div className={classes.textFieldContainer}>
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
              InputProps={{
                inputComponent: NumberFormatCustom,
                endAdornment: (
                  <IconButton onClick={() => clearAction("max_destination")}>
                    <CloseIcon />
                  </IconButton>
                ),
              }}
              autoComplete="off"
            />
          </div>
          {numberParams &&
            numberParams.map((param, index) => (
              <div key={param.id}>
                <NumberParam
                  param={param}
                  values={values}
                  handleChange={handleChange}
                  clearAction={clearAction}
                />
                <Divider />
              </div>
            ))}

          <FormControlLabel
            className={classes.switcher}
            control={<Checkbox checked={values.subscribed} onChange={handleChange} />}
            label={intl.formatMessage({ id: "FILTERS.TABLE.HEADER.SUBSCRIPTION" })}
            name="subscribed"
          />
          <Grid
            container
            direction="row"
            justify="flex-end"
            alignItems="center"
            spacing={1}
            className={innerClasses.buttonContainer}
          >
            <Grid item>
              <ButtonWithLoader loading={editLoading} disabled={editLoading} onPress={handleSubmit}>
                {intl.formatMessage({ id: "FILTER.FORM.BUTTON.SAVE" })}
              </ButtonWithLoader>
            </Grid>
            <Grid item>
              <OutlinedRedButton variant="outlined" onClick={() => setAlertOpen(true)}>
                {intl.formatMessage({ id: "ALL.BUTTONS.DELETE" })}
              </OutlinedRedButton>
            </Grid>
          </Grid>
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
              setDelFilterId(filter.id);
              setAlertOpen(false);
              delFilter(filter.id);
            }}
          />
        </Col>
      )}
    </Formik>
  );
}

export default injectIntl(MyFiltersForm);
