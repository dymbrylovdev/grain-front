import React from "react";
import { Checkbox, FormControlLabel } from "@material-ui/core";
import { Col, Row } from "react-bootstrap";

const CheckBoxParamGroup = ({
  values,
  handleChange,
  param,
  isEditable = true,
  handleSubmit = null,
}) => {
  const onSubmit = () => {
    if (handleSubmit) {
      handleSubmit()
    }
  };

  return (
    <Col>
      <Row>{param.name}</Row>
      {param.enum &&
        param.enum.map((item, index) => {
          const valueName = `parameter${param.id}enum${index}`;
          return (
            <Row key={item}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={values[valueName] || false}
                    onChange={handleChange}
                    onBlur={onSubmit}
                  />
                }
                label={item}
                name={valueName}
                disabled={!isEditable}
              />
            </Row>
          );
        })}
    </Col>
  );
};

export default CheckBoxParamGroup;
