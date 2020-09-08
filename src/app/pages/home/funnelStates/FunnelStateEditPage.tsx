import React, { useEffect, useState } from "react";
import { useHistory, RouteComponentProps } from "react-router-dom";
import { connect, ConnectedProps } from "react-redux";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { Paper, TextField, Button, FormControlLabel, Checkbox } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSnackbar } from "notistack";

import { actions as funnelStatesActions } from "../../../store/ducks/funnelStates.duck";

import AlertDialog from "../../../components/ui/Dialogs/AlertDialog";
import useStyles from "../styles";
import { IAppState } from "../../../store/rootDuck";
import { LayoutSubheader } from "../../../../_metronic/layout/LayoutContext";
import { initFunnelState, getFunnelStateToRequest } from "./utils";
import DraftEditor from "../../../components/DraftEditor";
import ButtonWithLoader from "../../../components/ui/Buttons/ButtonWithLoader";
import { OutlinedRedButton } from "../../../components/ui/Buttons/RedButtons";
import { TRole } from "../../../interfaces/users";

const FunnelStateEditPage: React.FC<TPropsFromRedux &
  WrappedComponentProps &
  RouteComponentProps<{ id: string }>> = ({
  match: {
    params: { id },
  },
  match,
  intl,
  fetch,
  funnelStates,
  loading,
  error,

  clearCreate,
  create,
  createLoading,
  createSuccess,
  createError,

  clearEdit,
  edit,
  editLoading,
  editSuccess,
  editError,

  clearDel,
  del,
  delLoading,
  delSuccess,
  delError,
}) => {
  const classes = useStyles();
  const history = useHistory();

  let role: TRole | undefined;
  if (match.url.indexOf("new-buyer") !== -1) {
    role = "ROLE_BUYER";
  } else if (match.url.indexOf("new-seller") !== -1) {
    role = "ROLE_VENDOR";
  } else {
    role = undefined;
  }

  const [isAlertOpen, setAlertOpen] = useState(false);

  const { values, handleSubmit, handleChange, handleBlur, resetForm, touched, errors } = useFormik({
    initialValues: initFunnelState(undefined),
    onSubmit: values => {
      if (+id) {
        edit(+id, getFunnelStateToRequest(values));
      } else {
        create(getFunnelStateToRequest(values, role));
      }
    },
    validationSchema: Yup.object().shape({
      name: Yup.string()
        .required(intl.formatMessage({ id: "YUP.REQUIRED" }))
        .trim(),
      color: Yup.string().matches(/^#[a-f0-9]{6}$/, intl.formatMessage({ id: "YUP.HEX" })),
      engagement: Yup.number()
        .typeError(intl.formatMessage({ id: "YUP.NUMBERS" }))
        .min(0, intl.formatMessage({ id: "YUP.NUMBERS.MIN" }, { min: 0 }))
        .max(100, intl.formatMessage({ id: "YUP.NUMBERS.MAX" }, { max: 100 }))
        .required(intl.formatMessage({ id: "YUP.REQUIRED" })),
    }),
  });

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (delError) {
      enqueueSnackbar(`${intl.formatMessage({ id: "NOTISTACK.ERRORS.ERROR" })} ${delError}`, {
        variant: "error",
      });
      setAlertOpen(false);
      clearDel();
    }
    if (delSuccess) {
      history.push(`/funnel-states`);
    }
  }, [clearDel, delError, delSuccess, enqueueSnackbar, history, intl]);

  useEffect(() => {
    if (createSuccess || createError) {
      enqueueSnackbar(
        createSuccess
          ? intl.formatMessage({ id: "NOTISTACK.FUNNEL_STATES.ADD" })
          : `${intl.formatMessage({ id: "NOTISTACK.ERRORS.ERROR" })} ${createError}`,
        {
          variant: createSuccess ? "success" : "error",
        }
      );
      clearCreate();
    }
    if (createSuccess) {
      history.push(`/funnel-states`);
    }
  }, [clearCreate, createError, createSuccess, editError, enqueueSnackbar, history, intl]);

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
    if (+id) {
      resetForm({ values: initFunnelState(funnelStates?.find(item => item.id === +id)) });
    } else {
      resetForm({ values: initFunnelState(undefined) });
    }
  }, [funnelStates, id, resetForm]);

  if (error) {
    setTimeout(() => {
      window.location.reload();
    }, 10000);
  }

  return (
    <Paper className={classes.paperWithForm}>
      {!!funnelStates && (
        <LayoutSubheader
          title={`${
            !+id
              ? intl.formatMessage({ id: "SUBHEADER.PARTS.CREATE" })
              : intl.formatMessage({ id: "SUBHEADER.PARTS.EDIT" })
          } ${intl.formatMessage({ id: "SUBHEADER.PARTS.FUNNEL_STATUS" })} ${
            (!role &&
              +id &&
              funnelStates &&
              funnelStates.find(item => item.id === +id)?.role === "ROLE_BUYER") ||
            role === "ROLE_BUYER"
              ? intl.formatMessage({ id: "SUBHEADER.PARTS.FUNNEL_STATUS.BUYER" })
              : intl.formatMessage({ id: "SUBHEADER.PARTS.FUNNEL_STATUS.SELLER" })
          }`}
        />
      )}
      <div className={classes.form}>
        <div className={classes.textFieldContainer}>
          {!funnelStates ? (
            <Skeleton width="100%" height={70} animation="wave" />
          ) : (
            <TextField
              type="text"
              label={intl.formatMessage({
                id: "FUNNEL_STATES.INPUT.NAME",
              })}
              margin="normal"
              className={classes.textField}
              name="name"
              value={values.name}
              variant="outlined"
              onBlur={handleBlur}
              onChange={handleChange}
              helperText={touched.name && errors.name}
              error={Boolean(touched.name && errors.name)}
            />
          )}
        </div>
        <div className={classes.textFieldContainer}>
          {!funnelStates ? (
            <Skeleton width="100%" height={70} animation="wave" />
          ) : (
            <TextField
              type="text"
              label={intl.formatMessage({
                id: "FUNNEL_STATES.INPUT.COLOR",
              })}
              margin="normal"
              className={classes.textField}
              name="color"
              value={values.color}
              variant="outlined"
              onBlur={handleBlur}
              onChange={handleChange}
              helperText={touched.color && errors.color}
              error={Boolean(touched.color && errors.color)}
            />
          )}
        </div>

        <div className={classes.textFieldContainer}>
          {!funnelStates ? (
            <Skeleton width="100%" height={70} animation="wave" />
          ) : (
            <TextField
              type="text"
              label={intl.formatMessage({
                id: "FUNNEL_STATES.INPUT.ENGAGEMENT",
              })}
              margin="normal"
              className={classes.textField}
              name="engagement"
              value={values.engagement}
              variant="outlined"
              onBlur={handleBlur}
              onChange={handleChange}
              helperText={touched.engagement && errors.engagement}
              error={Boolean(touched.engagement && errors.engagement)}
            />
          )}
        </div>

        <div className={classes.textFieldContainer}>
          {!funnelStates ? (
            <Skeleton width="100%" height={70} animation="wave" />
          ) : (
            <TextField
              type="text"
              label={intl.formatMessage({
                id: "FUNNEL_STATES.INPUT.CODE",
              })}
              margin="normal"
              className={classes.textField}
              name="code"
              value={values.code}
              variant="outlined"
              disabled
            />
          )}
        </div>

        {!funnelStates ? (
          <Skeleton width={120} height={37.5} animation="wave" />
        ) : (
          <FormControlLabel
            control={<Checkbox checked={values.auto} />}
            label={intl.formatMessage({ id: "FUNNEL_STATES.TABLE.AUTO" })}
            name="auto"
            disabled
          />
        )}

        {!funnelStates ? (
          <>
            <Skeleton width={100} height={40} animation="wave" />
            <Skeleton width="100%" height={49} animation="wave" />
            <Skeleton width="100%" height={40} animation="wave" />
            <Skeleton width="100%" height={40} animation="wave" />
            <Skeleton width="100%" height={40} animation="wave" />
            <Skeleton width="100%" height={40} animation="wave" />
            <Skeleton width="100%" height={40} animation="wave" />
            <Skeleton width="100%" height={40} animation="wave" />
            <Skeleton width="100%" height={40} animation="wave" />
            <Skeleton width="100%" height={40} animation="wave" />
            <Skeleton width="100%" height={40} animation="wave" />
            <Skeleton width="100%" height={40} animation="wave" />
          </>
        ) : (
          <>
            <div className={classes.text}>
              {intl.formatMessage({ id: "FUNNEL_STATES.INPUT.HINT" })}
            </div>
            <div>
              <DraftEditor
                initialState={funnelStates.find(item => item.id === +id)?.hint || ""}
                handleEditorChange={handleChange("hint")}
              />
            </div>
          </>
        )}
        <div className={classes.bottomButtonsContainer}>
          <div className={classes.button}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => history.push("/funnel-states")}
              disabled={loading}
            >
              {intl.formatMessage({ id: "ALL.BUTTONS.PREV" })}
            </Button>
          </div>
          <div className={classes.button}>
            <ButtonWithLoader
              loading={createLoading || editLoading}
              disabled={loading || createLoading || editLoading}
              onPress={handleSubmit}
            >
              {!+id
                ? intl.formatMessage({ id: "ALL.BUTTONS.CREATE" })
                : intl.formatMessage({ id: "ALL.BUTTONS.SAVE" })}
            </ButtonWithLoader>
          </div>
          <div className={classes.button}>
            <OutlinedRedButton
              variant="outlined"
              onClick={() => setAlertOpen(true)}
              disabled={loading}
            >
              {intl.formatMessage({ id: "ALL.BUTTONS.DELETE" })}
            </OutlinedRedButton>
          </div>
        </div>
      </div>
      <AlertDialog
        isOpen={isAlertOpen}
        text={intl.formatMessage({
          id: "FUNNEL_STATES.DIALOGS.DELETE_TEXT",
        })}
        okText={intl.formatMessage({
          id: "FUNNEL_STATES.DIALOGS.AGREE_TEXT",
        })}
        cancelText={intl.formatMessage({
          id: "FUNNEL_STATES.DIALOGS.CANCEL_TEXT",
        })}
        handleClose={() => setAlertOpen(false)}
        handleAgree={() => del(+id)}
        loadingText={intl.formatMessage({
          id: "FUNNEL_STATES.DIALOGS.LOADING_TEXT",
        })}
        isLoading={delLoading}
      />
    </Paper>
  );
};

const connector = connect(
  (state: IAppState) => ({
    funnelStates: state.funnelStates.funnelStates,
    loading: state.funnelStates.loading,
    error: state.funnelStates.error,
    createLoading: state.funnelStates.createLoading,
    createSuccess: state.funnelStates.createSuccess,
    createError: state.funnelStates.createError,
    editLoading: state.funnelStates.editLoading,
    editSuccess: state.funnelStates.editSuccess,
    editError: state.funnelStates.editError,
    delLoading: state.funnelStates.delLoading,
    delSuccess: state.funnelStates.delSuccess,
    delError: state.funnelStates.delError,
  }),
  {
    fetch: funnelStatesActions.fetchRequest,
    clearCreate: funnelStatesActions.clearCreate,
    create: funnelStatesActions.createRequest,
    clearEdit: funnelStatesActions.clearEdit,
    edit: funnelStatesActions.editRequest,
    clearDel: funnelStatesActions.clearDel,
    del: funnelStatesActions.delRequest,
  }
);

type TPropsFromRedux = ConnectedProps<typeof connector>;

export default connector(injectIntl(FunnelStateEditPage));
