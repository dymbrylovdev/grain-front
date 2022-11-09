import React from "react";
import NumberFormat from "react-number-format";

interface NumberFormatCustomProps {
  inputRef: (instance: any) => void;
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

function NumberFormatFloat(props: NumberFormatCustomProps) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values: any) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator={false}
      isNumericString
    />
  );
}
export default NumberFormatFloat;
