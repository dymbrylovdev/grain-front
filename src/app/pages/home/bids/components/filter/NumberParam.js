import React from "react";
import { Radio, FormControlLabel, RadioGroup, TextField, IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { makeStyles } from "@material-ui/core";
import NumberFormatCustom from "../../../../../components/NumberFormatCustom/NumberFormatCustom";

const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(1),
    flexWrap: "wrap",
    width: "100%",
  },
  numContainer: {
    marginLeft: theme.spacing(2),
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    flex: 1,
  },
  radioGroup: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "nowrap",
    width: 100,
  },
  paramName: {
    width: 200,
  },
  textField: {
    marginBottom: 0,
    marginTop: 0,
    minWidth: 20,
    maxWidth: 200,
  },
}));

function NumberParam({ values, param, handleChange, clearAction, isEditable = true }) {
  const composeName = `compose${param.id}`;
  const numberName = `number${param.id}`;
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <div className={classes.paramName}>{param.name}</div>
      <div className={classes.numContainer}>
        <RadioGroup
          name={composeName}
          value={values[composeName] || "≤"}
          onChange={handleChange}
          className={classes.radioGroup}
          row={true}
        >
          <FormControlLabel value="≤" control={<Radio />} label="≤" disabled={!isEditable} />
          <FormControlLabel value="≥" control={<Radio />} label=" ≥" disabled={!isEditable} />
        </RadioGroup>

        <TextField
          className={classes.textField}
          type="text"
          margin="normal"
          name={numberName}
          value={values[numberName] || ""}
          variant="outlined"
          onChange={handleChange}
          InputProps={
            isEditable
              ? {
                  inputComponent: NumberFormatCustom,
                  endAdornment: (
                    <IconButton
                      onClick={() => {
                        clearAction(composeName, "");
                        clearAction(numberName, "");
                      }}
                    >
                      <CloseIcon />
                    </IconButton>
                  ),
                }
              : undefined
          }
          disabled={!isEditable}
          autoComplete="off"
        />
      </div>
    </div>
  );
}

export default NumberParam;
