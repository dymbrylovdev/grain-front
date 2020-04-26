import React, { useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { WrappedComponentProps, injectIntl } from "react-intl";
import { TextField, MenuItem, Theme, Button, FormControlLabel, Checkbox } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/styles";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSnackbar } from "notistack";

import { actions as usersActions } from "../../../../store/ducks/users.duck";
import { actions as authActions } from "../../../../store/ducks/auth.duck";
import { actions as funnelStatesActions } from "../../../../store/ducks/funnelStates.duck";

import ButtonWithLoader from "../../../../components/ui/Buttons/ButtonWithLoader";
import useStyles from "../../styles";
import { OutlinedRedButton } from "../../../../components/ui/Buttons/RedButtons";
import { getInitialValues, roles } from "../utils/profileForm";
import { setMeValues, setCreateValues, setEditValues } from "../utils/submitValues";
import { IAppState } from "../../../../store/rootDuck";
import { Skeleton } from "@material-ui/lab";
import { IUserForEdit } from "../../../../interfaces/users";

const innerStyles = makeStyles((theme: Theme) => ({
  companyContainer: {
    flexDirection: "row",
    display: "flex",
  },
  companyText: {
    flex: 1,
  },
  buttonConfirm: {
    paddingBottom: theme.spacing(2),
  },
  pulseRoot: {
    "& fieldset": {
      animation: "2000ms ease-in-out infinite both TextFieldBorderPulse",
    },
  },
}));

interface IProps {
  editMode: "profile" | "create" | "edit";
  setAlertOpen: React.Dispatch<React.SetStateAction<boolean>>;
  userId?: number;
}

const ProfileForm: React.FC<IProps & TPropsFromRedux & WrappedComponentProps> = ({
  intl,
  createdUserId,

  fetchFunnelStates,
  funnelStates,
  funnelStatesLoading,
  funnelStatesError,

  fetchMe,
  me,
  meLoading,
  meError,

  clearEditMe,
  editMe,
  editMeLoading,
  editMeSuccess,
  editMeError,

  clearUser,
  fetchUser,
  user,
  userLoading,
  userError,

  clearCreateUser,
  createUser,
  createLoading,
  createSuccess,
  createError,

  clearEditUser,
  editUser,
  editLoading,
  editSuccess,
  editError,

  clearDelUser,
  delUser,
  delLoading,
  delSuccess,
  delError,

  mergeUser,

  statuses,
  prompterRunning,
  prompterStep,
  editMode,
  setAlertOpen,
  userId,
}) => {
  const innerClasses = innerStyles();
  const classes = useStyles();
  const history = useHistory();

  const { values, handleSubmit, handleChange, handleBlur, resetForm, touched, errors } = useFormik({
    initialValues: getInitialValues(undefined),
    onSubmit: values => {
      if (editMode === "profile") editMe({ data: setMeValues(values) });
      if (editMode === "create") createUser(setCreateValues(values));
      if (editMode === "edit" && user) {
        let params: IUserForEdit = setEditValues(values);
        params.funnel_state_id = values.funnel_state_id;
        params.is_funnel_state_automate = values.is_funnel_state_automate;
        editUser({ id: user.id, data: params });
      }
    },
    validationSchema: Yup.object().shape({
      role: Yup.string().matches(
        /(ROLE_ADMIN|ROLE_VENDOR|ROLE_BUYER)/,
        intl.formatMessage({ id: "PROFILE.VALIDATION.REQUIRED_FIELD" })
      ),
      status: Yup.string().matches(
        /(На модерации|Верифицированный|Активный)/,
        intl.formatMessage({ id: "PROFILE.VALIDATION.REQUIRED_FIELD" })
      ),
      email: Yup.string()
        .email(intl.formatMessage({ id: "AUTH.VALIDATION.INVALID_FIELD" }))
        .required(intl.formatMessage({ id: "PROFILE.VALIDATION.REQUIRED_FIELD" })),
      password:
        editMode === "create"
          ? Yup.string().required(intl.formatMessage({ id: "PROFILE.VALIDATION.REQUIRED_FIELD" }))
          : Yup.string(),
      login: Yup.string().required(intl.formatMessage({ id: "PROFILE.VALIDATION.REQUIRED_FIELD" })),
      repeatPassword: Yup.string().oneOf(
        [Yup.ref("password"), null],
        intl.formatMessage({ id: "PROFILE.VALIDATION.SIMILAR_PASSWORD" })
      ),
    }),
  });

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (createSuccess || createError) {
      enqueueSnackbar(
        createSuccess
          ? intl.formatMessage({ id: "NOTISTACK.USERS.SAVE_CREATE" })
          : `${intl.formatMessage({ id: "NOTISTACK.ERRORS.ERROR" })} ${createError}`,
        {
          variant: createSuccess ? "success" : "error",
        }
      );
      clearCreateUser();
    }
    if (createSuccess) {
      history.push(`/user/edit/${createdUserId}`);
    }
  }, [
    clearCreateUser,
    createError,
    createSuccess,
    createdUserId,
    editError,
    editMode,
    enqueueSnackbar,
    fetchUser,
    history,
    intl,
  ]);

  useEffect(() => {
    if (editSuccess || editError) {
      enqueueSnackbar(
        editSuccess
          ? intl.formatMessage({ id: "NOTISTACK.USERS.SAVE_USER" })
          : `${intl.formatMessage({ id: "NOTISTACK.ERRORS.ERROR" })} ${editError}`,
        {
          variant: editSuccess ? "success" : "error",
        }
      );
      clearEditUser();
    }
    if (editSuccess) {
      if (userId) fetchUser({ id: userId });
    }
  }, [clearEditUser, editError, editSuccess, enqueueSnackbar, fetchUser, intl, userId]);

  useEffect(() => {
    if (editMeSuccess || editMeError) {
      enqueueSnackbar(
        editMeSuccess
          ? intl.formatMessage({ id: "NOTISTACK.USERS.SAVE_PROFILE" })
          : `${intl.formatMessage({ id: "NOTISTACK.ERRORS.ERROR" })} ${editMeError}`,
        {
          variant: editMeSuccess ? "success" : "error",
        }
      );
      clearEditMe();
    }
    if (editMeSuccess) {
      fetchMe();
    }
  }, [clearEditMe, editError, editMeError, editMeSuccess, enqueueSnackbar, fetchMe, intl]);

  useEffect(() => {
    switch (editMode) {
      case "profile":
        fetchMe();
        break;
      case "edit":
        if (userId) fetchUser({ id: userId });
        break;
    }
  }, [editMode, fetchMe, fetchUser, userId]);

  useEffect(() => {
    switch (editMode) {
      case "profile":
        resetForm({ values: getInitialValues(me) });
        break;
      case "edit":
        resetForm({ values: getInitialValues(user) });
        break;
      case "create":
        resetForm({ values: getInitialValues(undefined) });
        break;
    }
  }, [editMode, me, resetForm, user]);

  useEffect(() => {
    fetchFunnelStates();
  }, [fetchFunnelStates]);

  return (
    <>
      {editMode !== "profile" && (
        <div className={classes.textFieldContainer}>
          {meLoading || userLoading || !funnelStates ? (
            <Skeleton width="100%" height={70} animation="wave" />
          ) : (
            <TextField
              select
              margin="normal"
              label={intl.formatMessage({ id: "PROFILE.INPUT.ROLE" })}
              value={values.role}
              onChange={handleChange}
              name="role"
              variant="outlined"
              helperText={touched.role && errors.role}
              error={Boolean(touched.role && errors.role)}
              disabled={editMode === "edit"}
            >
              <MenuItem value="EMPTY">{intl.formatMessage({ id: "ALL.SELECTS.EMPTY" })}</MenuItem>
              {roles.map((item, i) => (
                <MenuItem key={i} value={item.id}>
                  {item.value}
                </MenuItem>
              ))}
            </TextField>
          )}
        </div>
      )}

      {editMode !== "profile" && (
        <div className={classes.textFieldContainer}>
          {meLoading || userLoading || !funnelStates ? (
            <Skeleton width="100%" height={70} animation="wave" />
          ) : (
            <TextField
              select
              margin="normal"
              label={intl.formatMessage({
                id: "PROFILE.INPUT.STATUS",
              })}
              value={values.status}
              onChange={handleChange}
              name="status"
              variant="outlined"
              helperText={touched.status && errors.status}
              error={Boolean(touched.status && errors.status)}
            >
              <MenuItem value="EMPTY">{intl.formatMessage({ id: "ALL.SELECTS.EMPTY" })}</MenuItem>
              {statuses &&
                statuses.map(option => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
            </TextField>
          )}
        </div>
      )}
      {user && !user.is_admin && editMode === "edit" && (
        <>
          <div className={classes.textFieldContainer}>
            {meLoading || userLoading || !funnelStates ? (
              <Skeleton width="100%" height={70} animation="wave" />
            ) : (
              <TextField
                select
                margin="normal"
                label={intl.formatMessage({
                  id: "USERLIST.TABLE.ACTIVITY",
                })}
                value={values.funnel_state_id}
                onChange={handleChange}
                name="funnel_state_id"
                variant="outlined"
                disabled={values.is_funnel_state_automate}
              >
                <MenuItem value={0} style={{ backgroundColor: "#f2f2f2" }}>
                  {intl.formatMessage({ id: "USERLIST.FUNNEL_STATE.NO_NAME" })}
                </MenuItem>
                {user && user.is_buyer
                  ? funnelStates
                      .filter(fs => fs.role === "ROLE_BUYER")
                      .map(option => (
                        <MenuItem
                          key={option.id}
                          value={option.id}
                          style={{ backgroundColor: `${option.color || "#ededed"}` }}
                        >
                          {`${option.engagement || "0"} • ${option.name}`}
                        </MenuItem>
                      ))
                  : funnelStates
                      .filter(fs => fs.role === "ROLE_VENDOR")
                      .map(option => (
                        <MenuItem
                          key={option.id}
                          value={option.id}
                          style={{ backgroundColor: `${option.color || "#ededed"}` }}
                        >
                          {`${option.engagement || "0"} • ${option.name}`}
                        </MenuItem>
                      ))}
              </TextField>
            )}
          </div>
          <div>
            {meLoading || userLoading || !funnelStates ? (
              <Skeleton width={322} height={37.5} animation="wave" />
            ) : (
              <FormControlLabel
                control={
                  <Checkbox checked={values.is_funnel_state_automate} onChange={handleChange} />
                }
                label={intl.formatMessage({ id: "USERLIST.FUNNEL_STATE.AUTO" })}
                name="is_funnel_state_automate"
              />
            )}
          </div>
        </>
      )}
      <div className={classes.textFieldContainer}>
        {meLoading || userLoading || !funnelStates ? (
          <Skeleton width="100%" height={70} animation="wave" />
        ) : (
          <TextField
            type="text"
            label={intl.formatMessage({
              id: "PROFILE.INPUT.LOGIN",
            })}
            margin="normal"
            className={classes.textField}
            name="login"
            value={values.login}
            variant="outlined"
            onBlur={handleBlur}
            onChange={handleChange}
            helperText={touched.login && errors.login}
            error={Boolean(touched.login && errors.login)}
          />
        )}
      </div>

      <div className={classes.textFieldContainer}>
        {meLoading || userLoading || !funnelStates ? (
          <Skeleton width="100%" height={70} animation="wave" />
        ) : (
          <TextField
            type="text"
            label={intl.formatMessage({
              id: "PROFILE.INPUT.FIO",
            })}
            margin="normal"
            className={classes.textField}
            classes={
              prompterRunning && prompterStep === 0 && !values.fio
                ? { root: innerClasses.pulseRoot }
                : {}
            }
            name="fio"
            value={values.fio}
            variant="outlined"
            onBlur={handleBlur}
            onChange={handleChange}
            helperText={touched.fio && errors.fio}
            error={Boolean(touched.fio && errors.fio)}
          />
        )}
      </div>

      <div className={classes.textFieldContainer}>
        {meLoading || userLoading || !funnelStates ? (
          <Skeleton width="100%" height={70} animation="wave" />
        ) : (
          <TextField
            type="text"
            label={intl.formatMessage({
              id: "PROFILE.INPUT.EMAIL",
            })}
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
        {meLoading || userLoading || !funnelStates ? (
          <Skeleton width="100%" height={70} animation="wave" />
        ) : (
          <TextField
            type="tel"
            label={intl.formatMessage({
              id: "PROFILE.INPUT.PHONE",
            })}
            margin="normal"
            className={classes.textField}
            name="phone"
            value={values.phone}
            variant="outlined"
            onBlur={handleBlur}
            onChange={handleChange}
            helperText={touched.phone && errors.phone}
            error={Boolean(touched.phone && errors.phone)}
          />
        )}
      </div>

      <div className={classes.textFieldContainer}>
        {meLoading || userLoading || !funnelStates ? (
          <Skeleton width="100%" height={70} animation="wave" />
        ) : (
          <TextField
            type="password"
            label={intl.formatMessage({
              id: "PROFILE.INPUT.PASSWORD",
            })}
            margin="normal"
            className={classes.textField}
            name="password"
            value={values.password}
            variant="outlined"
            onBlur={handleBlur}
            onChange={handleChange}
            helperText={touched.password && errors.password}
            error={Boolean(touched.password && errors.password)}
            autoComplete="new-password"
          />
        )}
      </div>

      <div className={classes.textFieldContainer}>
        {meLoading || userLoading || !funnelStates ? (
          <Skeleton width="100%" height={70} animation="wave" />
        ) : (
          <TextField
            type="password"
            label={intl.formatMessage({
              id: "PROFILE.INPUT.REPEATPASSWORD",
            })}
            margin="normal"
            className={classes.textField}
            name="repeatPassword"
            value={values.repeatPassword}
            variant="outlined"
            onBlur={handleBlur}
            onChange={handleChange}
            helperText={touched.repeatPassword && errors.repeatPassword}
            error={Boolean(touched.repeatPassword && errors.repeatPassword)}
          />
        )}
      </div>

      <div className={classes.bottomButtonsContainer}>
        {editMode !== "profile" && (
          <div className={classes.button}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => history.push("/user-list")}
              disabled={meLoading || userLoading || !funnelStates}
            >
              {intl.formatMessage({ id: "ALL.BUTTONS.PREV" })}
            </Button>
          </div>
        )}
        <div className={classes.button}>
          <ButtonWithLoader
            loading={editMeLoading || createLoading || editLoading}
            disabled={
              editMeLoading ||
              createLoading ||
              editLoading ||
              meLoading ||
              userLoading ||
              !funnelStates
            }
            onPress={handleSubmit}
          >
            {editMode === "create"
              ? intl.formatMessage({ id: "ALL.BUTTONS.CREATE" })
              : intl.formatMessage({ id: "ALL.BUTTONS.SAVE" })}
          </ButtonWithLoader>
        </div>
        {editMode === "edit" && (
          <div className={classes.button}>
            <OutlinedRedButton
              variant="outlined"
              onClick={() => setAlertOpen(true)}
              disabled={meLoading || userLoading || !funnelStates}
            >
              {intl.formatMessage({ id: "ALL.BUTTONS.DELETE" })}
            </OutlinedRedButton>
          </div>
        )}
      </div>
    </>
  );
};

const connector = connect(
  (state: IAppState) => ({
    funnelStates: state.funnelStates.funnelStates,
    funnelStatesLoading: state.funnelStates.loading,
    funnelStatesError: state.funnelStates.error,

    me: state.auth.user,
    meLoading: state.auth.loading,
    meError: state.auth.error,

    editMeLoading: state.auth.editLoading,
    editMeSuccess: state.auth.editSuccess,
    editMeError: state.auth.editError,

    user: state.users.user,
    userLoading: state.users.byIdLoading,
    userError: state.users.byIdError,

    createdUserId: state.users.createdUserId,

    createLoading: state.users.createLoading,
    createSuccess: state.users.createSuccess,
    createError: state.users.createError,
    editLoading: state.users.editLoading,
    editSuccess: state.users.editSuccess,
    editError: state.users.editError,
    delLoading: state.users.delLoading,
    delSuccess: state.users.delSuccess,
    delError: state.users.delError,

    statuses: state.statuses.statuses,
    prompterRunning: state.prompter.running,
    prompterStep: state.prompter.activeStep,
  }),
  {
    fetchFunnelStates: funnelStatesActions.fetchRequest,

    fetchMe: authActions.fetchRequest,
    clearEditMe: authActions.clearEdit,
    editMe: authActions.editRequest,

    clearUser: usersActions.clearFetchById,
    fetchUser: usersActions.fetchByIdRequest,

    clearCreateUser: usersActions.clearCreate,
    createUser: usersActions.createRequest,
    clearDelUser: usersActions.clearDel,
    delUser: usersActions.delRequest,
    clearEditUser: usersActions.clearEdit,
    editUser: usersActions.editRequest,

    mergeUser: authActions.mergeUser,
  }
);

type TPropsFromRedux = ConnectedProps<typeof connector>;

export default connector(injectIntl(ProfileForm));
