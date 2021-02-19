import React, { useEffect } from "react";
import { FormControlLabel, Radio, RadioGroup } from "@material-ui/core";
import { Col, Row } from "react-bootstrap";

const RadioParamGroup = ({
  value,
  handleChange,
  data = [],
  isEditable = true,
  name,
}: {
  value: string;
  handleChange: any;
  data: { label: string; value: string }[];
  isEditable?: boolean;
  name: string;
}) => {
  return (
    <Col>
      <Row>{name}</Row>
      <RadioGroup name={name} value={value}>
        {data.map((item, index) => {
          return (
            <Row key={index.toString()}>
              <FormControlLabel
                control={<Radio onClick={() => handleChange(item.value)} />}
                value={item.value}
                label={item.label}
                disabled={!isEditable}
              />
            </Row>
          );
        })}
      </RadioGroup>
    </Col>
  );
};

export default RadioParamGroup;
