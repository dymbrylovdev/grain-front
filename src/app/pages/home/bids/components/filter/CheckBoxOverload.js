import React, { useCallback, useEffect, useState } from "react";
import { Checkbox, FormControlLabel } from "@material-ui/core";
import { Col, Row } from "react-bootstrap";

const CheckBoxOverload = ({ value, handleChange, isEditable = true, handleSubmit }) => {
  const [prevValue, setPrevValue] = useState(undefined);
  const onSubmit = useCallback(() => {
    if (handleSubmit) {
      handleSubmit();
    }
  }, [handleSubmit]);

  useEffect(() => {
    if (prevValue !== value && prevValue !== undefined) {
      onSubmit();
    }
    setPrevValue(value);
  }, [value]);

  return (
    <Col>
      <Row>Перегруз</Row>
      <Row>
        <FormControlLabel
          control={<Checkbox checked={value || false} onChange={handleChange} />}
          label={"Перегруз"}
          name="overload"
          disabled={!isEditable}
        />
      </Row>
    </Col>
  );
};

export default CheckBoxOverload;
