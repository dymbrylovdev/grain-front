import React from "react";
import NumberFormat from "react-number-format";

const NumberFormatCustom = (props: any) => {
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
};

export default NumberFormatCustom;
