import React from "react";
import { useSelector } from "react-redux";
import { TextField, Divider, IconButton, Collapse } from "@material-ui/core";
import { Row, Col } from "react-bootstrap";
import { injectIntl } from "react-intl";
import CloseIcon from "@material-ui/icons/Close";
import { Alert } from "@material-ui/lab";

import CheckBoxParamGroup from "./CheckBoxParamGroup";
import { declOfNum } from "../../../../../utils/index";
import NumberParam from "./NumberParam";
import NumberFormatCustom from "../../../../../components/NumberFormatCustom/NumberFormatCustom";

function FilterForm({
  classes,
  intl,
  enumParams,
  numberParams,
  formik,
  openInfoAlert,
  setOpenInfoAlert,
  salePurchaseMode,
}) {
  const { me, filterCount } = useSelector(state => ({
    me: state.auth.user,
    filterCount: state.myFilters.filterCount,
  }));

  return (
    <form onSubmit={formik.handleSubmit} autoComplete="off">
      <Collapse in={openInfoAlert}>
        <Alert
          className={classes.infoAlert}
          severity="info"
          color="info"
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
          {intl.formatMessage({ id: "FILTERS.INFO_TEXT" })}
        </Alert>
      </Collapse>
      
      {/* // * Информация о фильтрах в рамках данного тарифа */}

      <div className={classes.bottomMargin2} style={{ fontWeight: "bold" }}>
        {intl.formatMessage(
          { id: "FILTER.FORM.LIMIT" },
          {
            count:
              !me?.tariff || (me?.tariff && me.tariff.max_filters_count - filterCount <= 0)
                ? "0"
                : me?.tariff?.max_filters_count - filterCount,
            word: declOfNum(me?.tariff?.max_filters_count - filterCount, [
              "фильтр",
              "фильтра",
              "фильтров",
            ]),
            fullCount: me?.tariff?.max_filters_count,
          }
        )}
      </div>

      <Row>
        {enumParams &&
          enumParams.map(param => (
            <Col key={param.id}>
              <CheckBoxParamGroup
                param={param}
                values={formik.values}
                handleChange={formik.handleChange}
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
            value={formik.values.max_payment_term || ""}
            variant="outlined"
            onBlur={formik.handleBlur}
            onChange={e => {
              let newValue = e.target.value;
              if (+newValue < 0) {
                newValue = "0";
              }
              if (+newValue > 999) {
                newValue = "999";
              }
              formik.setFieldValue("max_payment_term", newValue);
            }}
            InputProps={{
              inputComponent: NumberFormatCustom,
              endAdornment: (
                <IconButton onClick={() => formik.setFieldValue("max_payment_term", "")}>
                  <CloseIcon />
                </IconButton>
              ),
            }}
            autoComplete="off"
          />
        </div>
      )}

      <div className={classes.textFieldContainer}>
        <TextField
          type="text"
          label={intl.formatMessage({
            id: "FILTER.FORM.MAX_PRICE",
          })}
          margin="normal"
          name="max_full_price"
          value={formik.values.max_full_price || ""}
          variant="outlined"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange("max_full_price")}
          InputProps={{
            inputComponent: NumberFormatCustom,
            endAdornment: (
              <IconButton onClick={() => formik.setFieldValue("max_full_price", "")}>
                <CloseIcon />
              </IconButton>
            ),
          }}
          helperText={formik.touched.max_full_price && formik.errors.max_full_price}
          error={Boolean(formik.touched.max_full_price && formik.errors.max_full_price)}
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
          value={formik.values.min_full_price || ""}
          variant="outlined"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange("min_full_price")}
          InputProps={{
            inputComponent: NumberFormatCustom,
            endAdornment: (
              <IconButton onClick={() => formik.setFieldValue("min_full_price", "")}>
                <CloseIcon />
              </IconButton>
            ),
          }}
          helperText={formik.touched.min_full_price && formik.errors.min_full_price}
          error={Boolean(formik.touched.min_full_price && formik.errors.min_full_price)}
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
          value={formik.values.max_destination || ""}
          variant="outlined"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange("max_destination")}
          InputProps={{
            inputComponent: NumberFormatCustom,
            endAdornment: (
              <IconButton onClick={() => formik.setFieldValue("max_destination", "")}>
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
              values={formik.values}
              handleChange={formik.handleChange}
              clearAction={formik.setFieldValue}
            />
            {/* {index !== numberParams.length - 1 && <Divider />} */}
            <Divider />
          </div>
        ))}
      
    </form>
  );
}

export default injectIntl(FilterForm);
