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
    // marginBottom: theme.spacing(0),
    // marginTop: theme.spacing(1),
    flexWrap: "wrap",
    width: "100%",
  },
  numContainer: {
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(0),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    flex: 1,
  },
  radioGroup: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  paramName: {
    fontSize: 16.5,
    width: 200,
  },
  textField: {
    marginBottom: theme.spacing(0),
    marginTop: theme.spacing(0),
    // minWidth: 20,
    // maxWidth: 200,
    // marginLeft: theme.spacing(2),
  },
}));

function NumberParam({ values, param, handleChange, clearAction, isEditable = true, handleSubmit = null }) {
  const composeName = `compose${param.id}`;
  const numberName = `number${param.id}`;
  const classes = useStyles();

  const onSubmit = () => {
    if (handleSubmit) {
      handleSubmit();
    }
  }

  return (
    <div className={classes.container}>
      {/* <div className={classes.paramName}>{param.name}</div> */}
      <div className={classes.numContainer}>
        <TextField
          className={classes.textField}
          type="text"
          label={param.name}
          margin="normal"
          name={numberName}
          value={values[numberName] || ""}
          variant="outlined"
          onChange={handleChange}
          onBlur={onSubmit}
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

        <RadioGroup
          name={composeName}
          value={values[composeName] || "≤"}
          onChange={handleChange}
          onBlur={onSubmit}
          className={classes.radioGroup}
          row={true}
        >
          <FormControlLabel
            value="≤"
            control={<Radio />}
            label="≤&nbsp;Меньше"
            disabled={!isEditable}
            style={{ fontSize: 15 }}
          />
          <FormControlLabel
            value="≥"
            control={<Radio />}
            label=" ≥&nbsp;Больше"
            disabled={!isEditable}
            style={{ fontSize: 15 }}
          />
        </RadioGroup>
      </div>
    </div>
  );
}

export default NumberParam;
