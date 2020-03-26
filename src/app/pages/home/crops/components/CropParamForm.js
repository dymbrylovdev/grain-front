import React, { useRef, useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import ButtonWithLoader from "../../../../components/ui/Buttons/ButtonWithLoader";
import StatusAlert from "../../../../components/ui/Messages/StatusAlert";
import { injectIntl, FormattedMessage } from "react-intl";
import { TextField, RadioGroup, Radio, FormControlLabel, Box, IconButton } from "@material-ui/core";

const getInitialValues = cropParam => {
  const params = {
    name: cropParam.name,
    enum: cropParam.enum,
    type: cropParam.type || "number",
    id: cropParam.id,
  };
  if (cropParam.enum) {
    if (cropParam.enum.length > 0) {
      cropParam.enum.map((item, index) => (params[`parameter${index}`] = item));
    }
  }
  return params;
};
function CropParamForm({ intl, classes, cropParam, editCropParamAction }) {
  const formRef = useRef();
  const enumDefault = cropParam.enum && cropParam.enum.length > 0 ? cropParam.enum : [""];
  const [enumParams, setEnumParams] = useState(enumDefault);
  const addEmptyEnumParam = () => {
    setEnumParams([...enumParams, ...[""]]);
  };
  const deleteEnumValue = index => {
    if (index < enumParams.length - 1) {
      for (let i = index; i < enumParams.length; i++) {
        formRef.current.setFieldValue(`parameter${i}`, formRef.current.values[`parameter${i + 1}`]);
      }
    }
    formRef.current.setFieldValue(`parameter${enumParams.length - 1}`, null);
    const newEnumArray = enumParams.slice(0, -1);
    setEnumParams(newEnumArray);
  };

  const setIdValue = value => {
    formRef.current.setFieldValue("id", value);
  };
  return (
    <Box className={classes.paramContainer} border={1} borderColor="#eeeeee" borderRadius={5}>
      <Formik
        autoComplete="off"
        initialValues={getInitialValues(cropParam)}
        validationSchema={Yup.object().shape({
          name: Yup.string().required(<FormattedMessage id="PROFILE.VALIDATION.REQUIRED_FIELD" />),
        })}
        onSubmit={(values, { setStatus, setSubmitting }) => {
          if (values.type === "enum") {
            const enumArray = [];
            Object.keys(values).forEach(param => {
              if (param.indexOf("parameter") !== -1 && values[param] && values[param] !== "") {
                enumArray.push(values[param]);
              }
            });
            editCropParamAction(
              { ...values, enum: enumArray },
              setStatus,
              setSubmitting,
              setIdValue
            );
          } else {
            editCropParamAction(values, setStatus, setSubmitting, setIdValue);
          }
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
        }) => (
          <div>
            <form noValidate autoComplete="off" className="kt-form" onSubmit={handleSubmit}>
              <StatusAlert status={status} />
              <TextField
                type="text"
                label={intl.formatMessage({
                  id: "CROP.FORM.PARAM_NAME",
                })}
                margin="normal"
                name="name"
                value={values.name}
                variant="outlined"
                onBlur={handleBlur}
                onChange={handleChange}
                helperText={touched.name && errors.name}
                error={Boolean(touched.name && errors.name)}
              />
              <RadioGroup name="type" value={values.type} onChange={handleChange}>
                <FormControlLabel
                  value="number"
                  control={<Radio />}
                  label={intl.formatMessage({
                    id: "CROP.FORM.PARAM_NUMBER",
                  })}
                  disabled={(status && status.id) || values.id}
                />
                <FormControlLabel
                  value="enum"
                  control={<Radio />}
                  label={intl.formatMessage({
                    id: "CROP.FORM.PARAM_LIST",
                  })}
                  disabled={(status && status.id) || values.id}
                />
              </RadioGroup>
              {values.type === "enum" && enumParams && (
                <div>
                  {enumParams.map((enumParam, index) => (
                    <div className={classes.textFieldContainer} key={`i${index}`}>
                      <TextField
                        type="text"
                        label={intl.formatMessage({
                          id: "CROP.FORM.PARAM_NAME_NUMBER",
                        })}
                        margin="normal"
                        name={`parameter${index}`}
                        value={values[`parameter${index}`]}
                        variant="outlined"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        helperText={touched[`parameter${index}`] && errors[`parameter${index}`]}
                        error={Boolean(touched[`parameter${index}`] && errors[`parameter${index}`])}
                        className={classes.textField}
                      />
                      <IconButton
                        size="small"
                        onClick={() => {
                          deleteEnumValue(index);
                        }}
                        className={classes.leftIcon}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  ))}{" "}
                  <IconButton size="small" onClick={addEmptyEnumParam} className={classes.leftIcon}>
                    <AddIcon />
                  </IconButton>
                </div>
              )}
              <div className={classes.buttonContainer}>
                <ButtonWithLoader loading={status && status.loading} onPress={handleSubmit}>
                  <FormattedMessage id="CROP.FORM.PARAM_SAVE" />
                </ButtonWithLoader>
              </div>
            </form>
          </div>
        )}
      </Formik>
    </Box>
  );
}

export default injectIntl(CropParamForm);
