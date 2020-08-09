import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { connect, ConnectedProps } from "react-redux";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { Paper, TextField } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSnackbar } from "notistack";

import { actions as funnelStatesActions } from "../../../store/ducks/funnelStates.duck";

import useStyles from "../styles";
import { IAppState } from "../../../store/rootDuck";
import { LayoutSubheader } from "../../../../_metronic/layout/LayoutContext";
import { ErrorPage } from "../../../components/ErrorPage";
import ButtonWithLoader from "../../../components/ui/Buttons/ButtonWithLoader";
import NumberFormatCustom from "../../../components/NumberFormatCustom/NumberFormatCustom";
import NumberFormatPhone from "../../../components/NumberFormatCustom/NumberFormatPhone";

const TrialEditPage: React.FC<TPropsFromRedux & WrappedComponentProps> = ({
  intl,
  fetch,
  loading,
  error,

  clearEdit,
  edit,
  editLoading,
  editSuccess,
  editError,
}) => {
  const classes = useStyles();
  const history = useHistory();

  const { values, handleSubmit, handleChange, handleBlur, resetForm, touched, errors } = useFormik({
    initialValues: { time: "", email: "", phone: "" },
    onSubmit: values => {},
    validationSchema: Yup.object().shape({
      time: Yup.string().required(intl.formatMessage({ id: "YUP.REQUIRED" })),
      email: Yup.string()
        .required(intl.formatMessage({ id: "YUP.REQUIRED" }))
        .email(intl.formatMessage({ id: "AUTH.VALIDATION.INVALID_FIELD" })),
      phone: Yup.string().required(intl.formatMessage({ id: "YUP.REQUIRED" })),
    }),
  });

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (editSuccess || editError) {
      enqueueSnackbar(
        editSuccess
          ? intl.formatMessage({ id: "NOTISTACK.FUNNEL_STATES.EDIT" })
          : `${intl.formatMessage({ id: "NOTISTACK.ERRORS.ERROR" })} ${editError}`,
        {
          variant: editSuccess ? "success" : "error",
        }
      );
      clearEdit();
    }
    if (editSuccess) {
      history.push(`/funnel-states`);
    }
  }, [clearEdit, editError, editSuccess, enqueueSnackbar, history, intl]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  useEffect(() => {
    resetForm({ values: { time: "", email: "", phone: "" } });
  }, [resetForm]);

  if (error) return <ErrorPage />;

  return (
    <Paper className={classes.paperWithForm}>
      <LayoutSubheader title={intl.formatMessage({ id: "TRIAL.TITLE" })} />
      <div className={classes.form}>
        <div className={classes.textFieldContainer}>
          {loading ? (
            <Skeleton width="100%" height={70} animation="wave" />
          ) : (
            <TextField
              type="text"
              label={intl.formatMessage({ id: "TRIAL.FORM.TIME" })}
              margin="normal"
              className={classes.textField}
              name="time"
              value={values.time}
              variant="outlined"
              onBlur={handleBlur}
              onChange={handleChange}
              helperText={touched.time && errors.time}
              error={Boolean(touched.time && errors.time)}
              InputProps={{
                inputComponent: NumberFormatCustom as any,
              }}
              autoComplete="off"
            />
          )}
        </div>
        <div className={classes.textFieldContainer}>
          {loading ? (
            <Skeleton width="100%" height={70} animation="wave" />
          ) : (
            <TextField
              type="text"
              label={intl.formatMessage({ id: "TRIAL.FORM.EMAIL" })}
              margin="normal"
              className={classes.textField}
              name="email"
              value={values.email}
              variant="outlined"
              onBlur={handleBlur}
              onChange={handleChange}
              helperText={touched.email && errors.email}
              error={Boolean(touched.email && errors.email)}
              autoComplete="off"
            />
          )}
        </div>

        <div className={classes.textFieldContainer}>
          {loading ? (
            <Skeleton width="100%" height={70} animation="wave" />
          ) : (
            <TextField
              type="text"
              label={intl.formatMessage({ id: "TRIAL.FORM.PHONE" })}
              margin="normal"
              className={classes.textField}
              name="phone"
              value={values.phone}
              variant="outlined"
              onBlur={handleBlur}
              onChange={handleChange}
              helperText={touched.phone && errors.phone}
              error={Boolean(touched.phone && errors.phone)}
              InputProps={{
                inputComponent: NumberFormatPhone as any,
              }}
              autoComplete="off"
            />
          )}
        </div>

        <div className={classes.bottomButtonsContainer}>
          <div className={classes.button}>
            <ButtonWithLoader
              loading={editLoading}
              disabled
              // disabled={loading || createLoading || editLoading}
              onPress={handleSubmit}
            >
              {intl.formatMessage({ id: "ALL.BUTTONS.SAVE" })}
            </ButtonWithLoader>
          </div>
        </div>
      </div>
    </Paper>
  );
};

const connector = connect(
  (state: IAppState) => ({
    loading: state.funnelStates.loading,
    error: state.funnelStates.error,

    editLoading: state.funnelStates.editLoading,
    editSuccess: state.funnelStates.editSuccess,
    editError: state.funnelStates.editError,
  }),
  {
    fetch: funnelStatesActions.fetchRequest,
    clearEdit: funnelStatesActions.clearEdit,
    edit: funnelStatesActions.editRequest,
  }
);

type TPropsFromRedux = ConnectedProps<typeof connector>;

export default connector(injectIntl(TrialEditPage));
