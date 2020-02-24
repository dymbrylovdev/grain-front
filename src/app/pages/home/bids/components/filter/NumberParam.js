import React from "react";
import { Radio, FormControlLabel, RadioGroup, TextField, IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { Row, Col } from "react-bootstrap";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  container: {
    alignItems: "center",
    paddingTop: theme.spacing(1),
  },
}));

function NumberParam({ values, param, handleChange, clearAction }) {
  const composeName = `compose${param.id}`;
  const numberName = `number${param.id}`;
  const classes = useStyles();
  return (
    <Row className={classes.container}>
      <Col >
        {param.name}
        </Col>
        <Col md="auto">
        <RadioGroup
          name={composeName}
          value={values[composeName] || "≤"}
          onChange={handleChange}
          row={true}
        >
          <FormControlLabel value="≤" control={<Radio />} label="≤" />
          <FormControlLabel value="≥" control={<Radio />} label=" ≥" />
        </RadioGroup>
      </Col>
      <Col>
        <TextField
          type="text"
          margin="normal"
          name={numberName}
          value={values[numberName] || ""}
          variant="outlined"
          onChange={handleChange}
        />
      </Col>
      <Row md="auto">
        <IconButton
          onClick={() => {
            clearAction(composeName);
            clearAction(numberName);
          }}
        >
          <CloseIcon />
        </IconButton>
      </Row>
    </Row>
  );
}

export default NumberParam;
