import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { connect, ConnectedProps } from "react-redux";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { Paper, TextField } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSnackbar } from "notistack";

import { actions as trialActions } from "../../../store/ducks/trial.duck";

import useStyles from "../styles";
import { IAppState } from "../../../store/rootDuck";
import { LayoutSubheader } from "../../../../_metronic/layout/LayoutContext";
import ButtonWithLoader from "../../../components/ui/Buttons/ButtonWithLoader";
import NumberFormatCustom from "../../../components/NumberFormatCustom/NumberFormatCustom";
import NumberFormatTrial from "../../../components/NumberFormatCustom/NumberFormatTrial";

const TrialEditPage: React.FC<TPropsFromRedux & WrappedComponentProps> = ({
  intl,
  me,
  trial,
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
  const isTrial = true;

  const { values, handleSubmit, handleChange, handleBlur, resetForm, touched, errors } = useFormik({
    initialValues: { trial_days: "", manager_email: "", manager_phone: "" },
    onSubmit: values => {
      edit({
        trial_days: +values.trial_days,
        manager_email: values.manager_email,
        manager_phone: values.manager_phone,
      });
    },
    validationSchema: Yup.object().shape({
      trial_days: Yup.string().required(intl.formatMessage({ id: "YUP.REQUIRED" })),
      manager_email: Yup.string()
        .required(intl.formatMessage({ id: "YUP.REQUIRED" }))
        .email(intl.formatMessage({ id: "AUTH.VALIDATION.INVALID_FIELD" })),
      manager_phone: Yup.string().required(intl.formatMessage({ id: "YUP.REQUIRED" })),
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
  }, [clearEdit, editError, editSuccess, enqueueSnackbar, history, intl]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  useEffect(() => {
    if (trial)
      resetForm({
        values: {
          trial_days: trial.trial_days.toString(),
          manager_email: trial.manager_email,
          manager_phone: trial.manager_phone,
        },
      });
  }, [resetForm, trial]);

  if (error) {
    setTimeout(() => {
      window.location.reload();
    }, 10000);
  }

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
              label={intl.formatMessage({ id: "TRIAL.FORM.EMAIL" })}
              margin="normal"
              className={classes.textField}
              name="manager_email"
              value={values.manager_email}
              variant="outlined"
              onBlur={handleBlur}
              onChange={handleChange}
              helperText={touched.manager_email && errors.manager_email}
              error={Boolean(touched.manager_email && errors.manager_email)}
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
              name="manager_phone"
              value={values.manager_phone}
              variant="outlined"
              onBlur={handleBlur}
              onChange={handleChange}
              helperText={touched.manager_phone && errors.manager_phone}
              error={Boolean(touched.manager_phone && errors.manager_phone)}
              InputProps={{
                inputComponent: NumberFormatTrial as any, 
              }}
              autoComplete="off"
            />
          )}
        </div>

        <div className={classes.bottomButtonsContainer}>
          <div className={classes.button}>
            <ButtonWithLoader
              loading={editLoading}
              disabled={loading || editLoading}
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
    me: state.auth.user,
    trial: state.trial.trial,
    loading: state.trial.loading,
    error: state.trial.error,

    editLoading: state.trial.editLoading,
    editSuccess: state.trial.editSuccess,
    editError: state.trial.editError,
  }),
  {
    fetch: trialActions.fetchRequest,
    clearEdit: trialActions.clearEdit,
    edit: trialActions.editRequest,
  }
);

type TPropsFromRedux = ConnectedProps<typeof connector>;

export default connector(injectIntl(TrialEditPage));
