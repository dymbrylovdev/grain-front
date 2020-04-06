import React from "react";
import {
  Radio,
  FormControlLabel,
  RadioGroup,
  TextField,
  IconButton,
  Grid,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  container: {
    alignItems: "center",
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
    width: "100%",
  },
  textField: {
    marginBottom: 0,
    marginTop: 0,
  },
}));

function NumberParam({ values, param, handleChange, clearAction, isEditable = true }) {
  const composeName = `compose${param.id}`;
  const numberName = `number${param.id}`;
  const classes = useStyles();
  return (
    <Grid
      container
      direction="row"
      justify="space-between"
      alignItems="center"
      className={classes.container}
    >
      <Grid item>{param.name}</Grid>
      <Grid item>
        <Grid container direction="row" justify="space-between" alignItems="center" spacing={10}>
          <Grid item>
            <RadioGroup
              name={composeName}
              value={values[composeName] || "≤"}
              onChange={handleChange}
              row={true}
            >
              <FormControlLabel value="≤" control={<Radio />} label="≤" disabled={!isEditable} />
              <FormControlLabel value="≥" control={<Radio />} label=" ≥" disabled={!isEditable} />
            </RadioGroup>
          </Grid>
          <Grid item>
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
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default NumberParam;
