import React, { useRef, useEffect } from "react";
import { Formik } from "formik";
import { useSelector, shallowEqual } from "react-redux";
import {
  TextField,
  Divider,
  DialogContent,
  DialogActions,
  IconButton,
  Dialog,
  DialogTitle,
  Button,
} from "@material-ui/core";
import { Row, Col } from "react-bootstrap";
import { injectIntl } from "react-intl";
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import ButtonWithLoader from "../../../../../components/ui/Buttons/ButtonWithLoader";
import CheckBoxParamGroup from "./CheckBoxParamGroup";
import NumberParam from "./NumberParam";
import { isFilterEmpty } from "../../../../../utils";
const getInitialValues = filter => {
  return filter || {};
};
const innerStyle = makeStyles(theme => ({
  buttonContainer: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  closeContainer: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  dialog: {},
}));
function FilterForm({
  isOpen,
  handleClose,
  handleSubmit,
  classes,
  intl,
  enumParams,
  numberParams,
  cropId,
}) {
  const innerClasses = innerStyle();
  const formRef = useRef();
  const { filter } = useSelector(
    ({ crops }) => ({
      filter: (crops.filters && crops.filters[cropId]) || { crop_id: Number.parseInt(cropId) },
    }),
    shallowEqual
  );
  useEffect(() => {
    formRef.current.resetForm({ values: getInitialValues(filter) });
  }, [filter]);
  const clearAction = param => {
    formRef.current.setFieldValue(param, undefined);
  };
  return (
    <Formik
      autoComplete="off"
      initialValues={getInitialValues(filter)}
      onSubmit={(values, { setStatus, setSubmitting }) => {
        handleSubmit(values, setStatus, setSubmitting);
      }}
      innerRef={formRef}
    >
      {({
        values,
        status,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
        resetForm,
        initialValues,
      }) => (
        <Dialog
          open={isOpen}
          onClose={handleClose}
          className={innerClasses.dialog}
          maxWidth={"sm"}
          fullWidth
        >
          <DialogTitle className={innerClasses.closeContainer}>
            <Button color="primary" onClick={handleClose}>
              {intl.formatMessage({ id: "FILTER.BUTTON.CLOSE" })}
            </Button>
          </DialogTitle>
          <DialogContent dividers>
            <Row>
              {enumParams &&
                enumParams.map(param => (
                  <Col key={param.id}>
                    <CheckBoxParamGroup param={param} values={values} handleChange={handleChange} />
                  </Col>
                ))}
            </Row>
            <div className={classes.textFieldContainer}>
              <TextField
                type="text"
                label={intl.formatMessage({
                  id: "FILTER.FORM.MAX_PRICE",
                })}
                margin="normal"
                name="max_full_price"
                value={values.max_full_price || ""}
                variant="outlined"
                onBlur={handleBlur}
                onChange={handleChange("max_full_price")}
              />
              <IconButton onClick={() => clearAction("max_full_price")}>
                <CloseIcon />
              </IconButton>
            </div>
            <div className={classes.textFieldContainer}>
              <TextField
                type="text"
                label={intl.formatMessage({
                  id: "FILTER.FORM.MAX_DESTINATION",
                })}
                margin="normal"
                name="max_destination"
                value={values.max_destination || ""}
                variant="outlined"
                onBlur={handleBlur}
                onChange={handleChange("max_destination")}
              />
              <IconButton onClick={() => clearAction("max_destination")}>
                <CloseIcon />
              </IconButton>
            </div>
            {numberParams &&
              numberParams.map((param, index) => (
                <div key={param.id}>
                  <NumberParam
                    param={param}
                    values={values}
                    handleChange={handleChange}
                    
                    clearAction={clearAction}
                  />
                  {index !== numberParams.length - 1 && <Divider />}
                </div>
              ))}
          </DialogContent>
          <DialogActions className={innerClasses.buttonContainer}>
            <ButtonWithLoader onPress={handleSubmit}>
              {intl.formatMessage({ id: "FILTER.FORM.BUTTON.SUBMIT" })}
            </ButtonWithLoader>
            <ButtonWithLoader
              onPress={() => {
                resetForm({ values: { crop_id: cropId } });
                handleSubmit();
              }}
              disabled={isFilterEmpty(values, enumParams, numberParams)}
            >
              {intl.formatMessage({ id: "FILTER.FORM.BUTTON.RESET" })}
            </ButtonWithLoader>
          </DialogActions>
        </Dialog>
      )}
    </Formik>
  );
}

export default injectIntl(FilterForm);
