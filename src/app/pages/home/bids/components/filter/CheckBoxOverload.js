import React, { useEffect } from "react";
import { Checkbox, FormControlLabel } from "@material-ui/core";
import { Col, Row } from "react-bootstrap";

const CheckBoxOverload = ({ values, handleChange, isEditable = true, handleSubmit }) => {
  const onSubmit = () => {
    if (handleSubmit) {
      handleSubmit();
    }
  };

  useEffect(() => {
    onSubmit();
  }, [values]);

  return (
    <Col>
      <Row>Перегруз</Row>
      <Row>
        <FormControlLabel
          control={<Checkbox checked={values.overload} onChange={handleChange} />}
          label={"Перегруз"}
          name="overload"
          disabled={!isEditable}
        />
      </Row>
    </Col>
  );
};

export default CheckBoxOverload;
