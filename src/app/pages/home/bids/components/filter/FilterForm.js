import React from "react";
import { useSelector } from "react-redux";
import { TextField, Divider, IconButton } from "@material-ui/core";
import { Row, Col } from "react-bootstrap";
import { injectIntl } from "react-intl";
import CloseIcon from "@material-ui/icons/Close";
import CheckBoxParamGroup from "./CheckBoxParamGroup";

import { declOfNum } from "../../../../../utils/index";
import NumberParam from "./NumberParam";
import NumberFormatCustom from "../../../../../components/ui/NumberFormatCustom";

function FilterForm({ classes, intl, enumParams, numberParams, formik }) {
  const { me, myFilters } = useSelector(state => ({
    me: state.auth.user,
    myFilters: state.myFilters.myFilters,
  }));

  return (
    <form onSubmit={formik.handleSubmit} autoComplete="off">
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
      <div className={classes.topMargin} style={{ fontWeight: "bold" }}>
        {intl.formatMessage(
          { id: "FILTER.FORM.LIMIT" },
          {
            count: me.tariff.max_filters_count - myFilters?.length || "",
            word: declOfNum(me.tariff.max_filters_count - myFilters?.length, [
              "фильтр",
              "фильтра",
              "фильтров",
            ]),
            fullCount: me.tariff.max_filters_count,
          }
        )}
      </div>
    </form>
  );
}

export default injectIntl(FilterForm);
