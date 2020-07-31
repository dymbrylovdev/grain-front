import React, { useEffect, useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { WrappedComponentProps, injectIntl } from "react-intl";
import {
  TextField,
  MenuItem,
  Theme,
  Button,
  FormControlLabel,
  Checkbox,
  IconButton,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/styles";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
import isEqual from "lodash.isequal";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import ReportProblemIcon from "@material-ui/icons/ReportProblem";

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
  editMode: "profile" | "create" | "edit" | "view";
  setAlertOpen: React.Dispatch<React.SetStateAction<boolean>>;
  userId?: number;
  setLocTabPulse: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProfileForm: React.FC<IProps & TPropsFromRedux & WrappedComponentProps> = ({
  intl,
  createdUserId,

  fetchFunnelStates,
  funnelStates,
  funnelStatesLoading,
  funnelStatesError,

  clearMe,
  fetchMe,
  me,
  meLoading,
  meSuccess,
  meError,

  setEditNoNoti,
  editMeNoNoti,
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

  statuses,
  prompterRunning,
  prompterStep,
  editMode,
  setAlertOpen,
  userId,
  setLocTabPulse,
}) => {
  const innerClasses = innerStyles();
  const classes = useStyles();
  const history = useHistory();

  const [oldValues, setOldValues] = useState<any | undefined>(undefined);
  const [visiblePass, setVisiblePass] = useState(true);

  const { values, handleSubmit, handleChange, handleBlur, resetForm, touched, errors } = useFormik({
    initialValues: getInitialValues(undefined),
    onSubmit: values => {
      if (editMode === "profile" && !isEqual(oldValues, values))
        editMe({ data: setMeValues(values) });

      if (editMode === "create") createUser(setCreateValues({ ...values, crop_ids: [1] }));
      if (editMode === "edit" && user) {
        let params: IUserForEdit = setEditValues(values);
        params.funnel_state_id = values.funnel_state_id;
        params.is_funnel_state_automate = values.is_funnel_state_automate;
        params.use_vat = values.use_vat;
        editUser({ id: user.id, data: params });
      }
    },
    validationSchema: Yup.object().shape({
      role: Yup.string().required(intl.formatMessage({ id: "PROFILE.VALIDATION.REQUIRED_FIELD" })),
      status: Yup.string().required(
        intl.formatMessage({ id: "PROFILE.VALIDATION.REQUIRED_FIELD" })
      ),
      email: Yup.string()
        .email(intl.formatMessage({ id: "AUTH.VALIDATION.INVALID_FIELD" }))
        .required(intl.formatMessage({ id: "PROFILE.VALIDATION.REQUIRED_FIELD" })),
      password:
        editMode === "create"
          ? Yup.string().required(intl.formatMessage({ id: "PROFILE.VALIDATION.REQUIRED_FIELD" }))
          : Yup.string(),
      // login: Yup.string()
      //   .required(intl.formatMessage({ id: "PROFILE.VALIDATION.REQUIRED_FIELD" }))
      //   .trim(),
      // repeatPassword: Yup.string().test(
      //   "passwords-match",
      //   intl.formatMessage({ id: "PROFILE.VALIDATION.SIMILAR_PASSWORD" }),
      //   function(value) {
      //     return this.parent.password === value;
      //   }
      // ),
    }),
  });

  useEffect(() => {
    if (meSuccess && !!values && !!me && isEqual(getInitialValues(me), values)) {
      setEditNoNoti(false);
      clearMe();
      setOldValues(values);
    }
  }, [clearMe, editMode, me, meSuccess, oldValues, setEditNoNoti, user, values]);

  useEffect(() => {
    return () => {
      if (editMode === "profile" && !!oldValues) {
        setEditNoNoti(true);
        handleSubmit();
      }
    };
  }, [editMode, handleSubmit, oldValues, setEditNoNoti]);

  useEffect(() => {
    if (!values.fio) setLocTabPulse(false);
    if (
      prompterRunning &&
      prompterStep === 0 &&
      !!values.fio &&
      !!values.phone &&
      me?.points.length === 0
    )
      setLocTabPulse(true);
    if (!!values.fio && !values.phone) setLocTabPulse(false);
  }, [me, prompterRunning, prompterStep, setLocTabPulse, values.fio, values.phone]);

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
  }, [
    clearEditUser,
    editError,
    editMeNoNoti,
    editSuccess,
    enqueueSnackbar,
    fetchUser,
    intl,
    setEditNoNoti,
    userId,
  ]);

  useEffect(() => {
    if (editMeSuccess || editMeError) {
      if (!editMeNoNoti) {
        enqueueSnackbar(
          editMeSuccess
            ? intl.formatMessage({ id: "NOTISTACK.USERS.SAVE_PROFILE" })
            : `${intl.formatMessage({ id: "NOTISTACK.ERRORS.ERROR" })} ${editMeError}`,
          {
            variant: editMeSuccess ? "success" : "error",
          }
        );
      }
      setEditNoNoti(false);
      clearEditMe();
    }
    if (editMeSuccess) {
      fetchMe();
    }
  }, [
    clearEditMe,
    editError,
    editMeError,
    editMeNoNoti,
    editMeSuccess,
    enqueueSnackbar,
    fetchMe,
    intl,
    setEditNoNoti,
  ]);

  useEffect(() => {
    switch (editMode) {
      case "profile":
        fetchMe();
        break;
      case "edit":
      case "view":
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
      case "view":
        resetForm({ values: getInitialValues(user) });
        break;
      case "create":
        resetForm({ values: getInitialValues(undefined) });
        break;
    }
  }, [editMode, me, resetForm, user]);

  useEffect(() => {
    if (!!me && me.is_admin && !funnelStates) fetchFunnelStates();
  }, [editMode, fetchFunnelStates, funnelStates, me]);

  return (
    <>
      <div className={classes.textFieldContainer}>
        {meLoading || userLoading || (editMode !== "profile" && funnelStatesLoading) ? (
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
            disabled={editMode !== "create"}
          >
            {roles.map((item, i) => (
              <MenuItem key={i} value={item.id}>
                {item.value}
              </MenuItem>
            ))}
          </TextField>
        )}
      </div>

      {editMode !== "profile" && (
        <div className={classes.textFieldContainer}>
          {meLoading || userLoading || funnelStatesLoading || !statuses ? (
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
              disabled={editMode === "view"}
            >
              {statuses.map(option => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          )}
        </div>
      )}
      {!!user &&
        !user.is_admin &&
        !!me &&
        me.is_admin &&
        (editMode === "edit" || editMode === "view") && (
          <>
            <div className={classes.textFieldContainer}>
              {meLoading || userLoading || funnelStatesLoading ? (
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
                  disabled={values.is_funnel_state_automate || editMode === "view"}
                >
                  <MenuItem value={0} style={{ backgroundColor: "#f2f2f2" }}>
                    {intl.formatMessage({ id: "USERLIST.FUNNEL_STATE.NO_NAME" })}
                  </MenuItem>
                  {user && user.is_buyer
                    ? !!funnelStates &&
                      funnelStates
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
                    : !!funnelStates &&
                      funnelStates
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
            {editMode !== "view" && (
              <div>
                {meLoading || userLoading || funnelStatesLoading ? (
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
            )}
          </>
        )}
      {/* <div className={classes.textFieldContainer}>
        {meLoading || userLoading || (editMode !== "profile" && funnelStatesLoading) ? (
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
            autoComplete="off"
            disabled={editMode === "view"}
          />
        )}
      </div> */}

      <div className={classes.textFieldContainer}>
        {meLoading || userLoading || (editMode !== "profile" && funnelStatesLoading) ? (
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
            disabled={editMode === "view"}
          />
        )}
      </div>

      <div className={classes.textFieldContainer}>
        {meLoading || userLoading || (editMode !== "profile" && funnelStatesLoading) ? (
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
            autoComplete="off"
            disabled={editMode === "view"}
          />
        )}
      </div>

      <div>
        {meLoading || userLoading || (editMode !== "profile" && funnelStatesLoading) ? (
          <Skeleton width={135} height={37.5} animation="wave" />
        ) : (
          <FormControlLabel
            control={<Checkbox checked={values.use_vat} onChange={handleChange} />}
            label={intl.formatMessage({ id: "USER.EDIT_FORM.USE_VAT" })}
            name="use_vat"
            disabled={editMode === "view"}
          />
        )}
      </div>

      {prompterRunning && prompterStep === 0 && !values.use_vat && (
        <div>
          {meLoading || userLoading || (editMode !== "profile" && funnelStatesLoading) ? (
            <Skeleton width="100%" height={37.5} animation="wave" />
          ) : (
            <div style={{ color: "#fd397a", marginBottom: 16 }}>
              <ReportProblemIcon color="error" />{" "}
              <b>{intl.formatMessage({ id: "USER.EDIT_FORM.ATTENTION" })}</b>
            </div>
          )}
        </div>
      )}

      <div className={classes.textFieldContainer}>
        {meLoading || userLoading || (editMode !== "profile" && funnelStatesLoading) ? (
          <Skeleton width="100%" height={70} animation="wave" />
        ) : (
          <TextField
            type="tel"
            label={intl.formatMessage({
              id: "PROFILE.INPUT.PHONE",
            })}
            margin="normal"
            className={classes.textField}
            classes={
              prompterRunning && prompterStep === 0 && !!values.fio && !values.phone
                ? { root: innerClasses.pulseRoot }
                : {}
            }
            name="phone"
            value={values.phone}
            variant="outlined"
            onBlur={handleBlur}
            onChange={handleChange}
            helperText={touched.phone && errors.phone}
            error={Boolean(touched.phone && errors.phone)}
            disabled={editMode === "view"}
            autoComplete="off"
          />
        )}
      </div>

      {editMode !== "view" && (
        <div className={classes.box}>
          {meLoading || userLoading || (editMode !== "profile" && funnelStatesLoading) ? (
            <Skeleton width="100%" height={32} animation="wave" />
          ) : editMode === "create" ? (
            <p>{intl.formatMessage({ id: "PROFILE.INPUT.PASSWORD.CREATE_TITLE" })}</p>
          ) : (
            <p>{intl.formatMessage({ id: "PROFILE.INPUT.PASSWORD.EDIT_TITLE" })}</p>
          )}
          {meLoading || userLoading || (editMode !== "profile" && funnelStatesLoading) ? (
            <Skeleton width="100%" height={70} animation="wave" />
          ) : (
            <TextField
              type={!visiblePass ? "password" : "text"}
              label={intl.formatMessage({
                id: "PROFILE.INPUT.PASSWORD",
              })}
              margin="normal"
              name="password"
              value={values.password}
              variant="outlined"
              onBlur={handleBlur}
              onChange={handleChange}
              helperText={touched.password && errors.password}
              error={Boolean(touched.password && errors.password)}
              InputProps={{
                endAdornment: !visiblePass ? (
                  <IconButton onClick={() => setVisiblePass(true)}>
                    <VisibilityIcon />
                  </IconButton>
                ) : (
                  <IconButton onClick={() => setVisiblePass(false)}>
                    <VisibilityOffIcon />
                  </IconButton>
                ),
              }}
              autoComplete="off"
            />
          )}

          {/* {meLoading || userLoading || (editMode !== "profile" && funnelStatesLoading) ? (
            <Skeleton width="100%" height={70} animation="wave" />
          ) : (
            <TextField
              type="password"
              label={intl.formatMessage({
                id: "PROFILE.INPUT.REPEATPASSWORD",
              })}
              margin="normal"
              name="repeatPassword"
              value={values.repeatPassword}
              variant="outlined"
              onBlur={handleBlur}
              onChange={handleChange}
              helperText={touched.repeatPassword && errors.repeatPassword}
              error={Boolean(touched.repeatPassword && errors.repeatPassword)}
            />
          )} */}
        </div>
      )}

      {/* <div className={classes.button}>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => {
            throw Error("Ошибка ошибка");
            console.log(Error);
          }}
          disabled={meLoading || userLoading || funnelStatesLoading}
        >
          Error
        </Button>
      </div> */}

      {editMode !== "view" && (
        <div className={classes.bottomButtonsContainer}>
          {editMode !== "profile" && (
            <div className={classes.button}>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => history.push("/user-list")}
                disabled={meLoading || userLoading || funnelStatesLoading}
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
                (editMode !== "profile" && funnelStatesLoading) ||
                isEqual(oldValues, values)
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
                disabled={meLoading || userLoading || funnelStatesLoading}
              >
                {intl.formatMessage({ id: "ALL.BUTTONS.DELETE" })}
              </OutlinedRedButton>
            </div>
          )}
        </div>
      )}
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
    meSuccess: state.auth.success,
    meError: state.auth.error,

    editMeNoNoti: state.auth.editNoNoti,
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

    statuses: state.statuses.statuses,
    prompterRunning: state.prompter.running,
    prompterStep: state.prompter.activeStep,
  }),
  {
    fetchFunnelStates: funnelStatesActions.fetchRequest,

    clearMe: authActions.clearFetch,
    fetchMe: authActions.fetchRequest,
    clearEditMe: authActions.clearEdit,
    editMe: authActions.editRequest,

    clearUser: usersActions.clearFetchById,
    fetchUser: usersActions.fetchByIdRequest,

    clearCreateUser: usersActions.clearCreate,
    createUser: usersActions.createRequest,
    clearEditUser: usersActions.clearEdit,
    editUser: usersActions.editRequest,

    setEditNoNoti: authActions.setEditNoNoti,
  }
);

type TPropsFromRedux = ConnectedProps<typeof connector>;

export default connector(injectIntl(ProfileForm));
