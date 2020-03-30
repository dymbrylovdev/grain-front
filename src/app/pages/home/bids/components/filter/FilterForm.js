import React from "react";

import { TextField, Divider, IconButton } from "@material-ui/core";
import { Row, Col } from "react-bootstrap";
import { injectIntl } from "react-intl";
import CloseIcon from "@material-ui/icons/Close";
import CheckBoxParamGroup from "./CheckBoxParamGroup";
import NumberParam from "./NumberParam";

function FilterForm({ classes, intl, enumParams, numberParams, formik }) {
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
        />
        <IconButton onClick={() => formik.setFieldValue("max_full_price", "")}>
          <CloseIcon />
        </IconButton>
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
        />
        <IconButton onClick={() => formik.setFieldValue("max_destination", "")}>
          <CloseIcon />
        </IconButton>
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
            {index !== numberParams.length - 1 && <Divider />}
          </div>
        ))}
    </form>
  );
}

export default injectIntl(FilterForm);
