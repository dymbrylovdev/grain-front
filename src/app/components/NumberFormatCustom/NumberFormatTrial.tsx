import React from "react";
import NumberFormat from "react-number-format";

interface NumberFormatCustomProps {
  inputRef: (instance: any) => void;
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

function NumberFormatTrial(props: NumberFormatCustomProps) {
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
      type="tel"
      format="# (###) ### - ####"
      allowEmptyFormatting
      mask=" . "
    />
  );
}
export default NumberFormatTrial;
