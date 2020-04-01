import React, { useRef, useEffect, useState } from "react";
import { Formik } from "formik";
import { makeStyles, TextField, Divider, IconButton, Grid, Button } from "@material-ui/core";
import { Row, Col } from "react-bootstrap";
import { injectIntl } from "react-intl";
import CloseIcon from "@material-ui/icons/Close";
import ButtonWithLoader from "../../../../../components/ui/Buttons/ButtonWithLoader";
import CheckBoxParamGroup from "./CheckBoxParamGroup";
import NumberParam from "./NumberParam";
import { fromApiToFilter } from "../../../myFilters/utils";
import { filterForCreate } from "../../../myFilters/utils";
import AlertDialog from "../../../../../components/ui/Dialogs/AlertDialog";

const innerStyle = makeStyles(theme => ({
  buttonContainer: {
    marginTop: theme.spacing(1),
  },
  closeContainer: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  textFieldContainer: {
    display: "flex",
    flexDirection: "row",
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

function MyFiltersForm({
  handleSubmit,
  classes,
  intl,
  enumParams,
  numberParams,
  cropId,
  filter,
  delFilter,
  delLoading,
  editFilter,
  editLoading,
}) {
  const innerClasses = innerStyle();
  const formRef = useRef();

  const [isAlertOpen, setAlertOpen] = useState(false);

  useEffect(() => {
    formRef.current.resetForm({ values: fromApiToFilter(filter) });
  }, [filter]);

  const clearAction = param => {
    formRef.current.setFieldValue(param, undefined);
  };

  return (
    <Formik
      autoComplete="off"
      initialValues={fromApiToFilter(filter)}
      onSubmit={(values, { setStatus, setSubmitting }) => {
        handleSubmit({ ...values, id: filter.id }, setStatus, setSubmitting);
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
        <Col>
          <AlertDialog
            isOpen={isAlertOpen}
            text={`${intl.formatMessage({
              id: "FILTER.DIALOGS.DELETE_TEXT",
            })}"${filter.name}"`}
            okText={intl.formatMessage({
              id: "FILTER.DIALOGS.AGREE_TEXT",
            })}
            cancelText={intl.formatMessage({
              id: "FILTER.DIALOGS.CANCEL_TEXT",
            })}
            handleClose={() => setAlertOpen(false)}
            handleAgree={() => {
              setAlertOpen(false);
              delFilter(filter.id);
            }}
          />
          <ButtonWithLoader onPress={handleSubmit}>
            {intl.formatMessage({ id: "FILTER.FORM.BUTTON.SUBMIT" })}
          </ButtonWithLoader>
          <div className={innerClasses.textFieldContainer}>
            <TextField
              type="text"
              label={intl.formatMessage({
                id: "FILTER.FORM.NAME.INPUT_NAME",
              })}
              margin="normal"
              name="name"
              value={values.name || ""}
              variant="outlined"
              onBlur={handleBlur}
              onChange={handleChange("name")}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={() => clearAction("name")}>
                    <CloseIcon />
                  </IconButton>
                ),
              }}
            />
          </div>
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
              InputProps={{
                endAdornment: (
                  <IconButton onClick={() => clearAction("max_full_price")}>
                    <CloseIcon />
                  </IconButton>
                ),
              }}
            />
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
              InputProps={{
                endAdornment: (
                  <IconButton onClick={() => clearAction("max_destination")}>
                    <CloseIcon />
                  </IconButton>
                ),
              }}
            />
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
          <Grid
            container
            direction="row"
            justify="flex-end"
            alignItems="center"
            spacing={1}
            className={innerClasses.buttonContainer}
          >
            <Grid item>
              <ButtonWithLoader
                loading={editLoading}
                disabled={editLoading}
                onPress={() => {
                  editFilter({
                    id: filter.id,
                    data: filterForCreate(values, enumParams, numberParams),
                  });
                }}
              >
                {intl.formatMessage({ id: "FILTER.FORM.BUTTON.SAVE" })}
              </ButtonWithLoader>
            </Grid>
            <Grid item>
              <Button variant="outlined" color="secondary" onClick={() => setAlertOpen(true)}>
                {intl.formatMessage({ id: "ALL.BUTTONS.DELETE" })}
              </Button>
            </Grid>
          </Grid>
        </Col>
      )}
    </Formik>
  );
}

export default injectIntl(MyFiltersForm);
