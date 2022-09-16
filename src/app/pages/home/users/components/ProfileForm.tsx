import React, { useEffect, useState, useCallback } from "react";
import { connect, ConnectedProps } from "react-redux";
import { WrappedComponentProps, injectIntl } from "react-intl";
import {
  TextField,
  MenuItem,
  Theme,
  FormControlLabel,
  Checkbox,
  IconButton,
  Collapse,
  Button,
  Dialog,
  DialogActions,
} from "@material-ui/core";
import { Alert, Skeleton } from "@material-ui/lab";
import { Link, useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import { useFormik, validateYupSchema } from "formik";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
import isEqual from "lodash.isequal";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import ReportProblemIcon from "@material-ui/icons/ReportProblem";
import CloseIcon from "@material-ui/icons/Close";

import { actions as usersActions } from "../../../../store/ducks/users.duck";
import { actions as authActions } from "../../../../store/ducks/auth.duck";
import { actions as funnelStatesActions } from "../../../../store/ducks/funnelStates.duck";

import ButtonWithLoader from "../../../../components/ui/Buttons/ButtonWithLoader";
import useStyles from "../../styles";
import { OutlinedRedButton } from "../../../../components/ui/Buttons/RedButtons";
import { roles } from "../utils/profileForm";
import { setMeValues, setCreateValues, setEditValues } from "../utils/submitValues";
import { IAppState } from "../../../../store/rootDuck";
import { IUser, IUserForEdit } from "../../../../interfaces/users";
import NumberFormatForProfile from "../../../../components/NumberFormatCustom/NumberFormatForProfile";
import { accessByRoles } from "../../../../utils/utils";
import AlertDialog from "../../../../components/ui/Dialogs/AlertDialog";
import { TrafficLight } from ".";
import CompanyConfirmBlock from "../../companies/components/CompanyConfirmBlock";
import CompanySearchForm from "../../companies/components/CompanySearchForm";
import CompanyConfirmDialog from "./CompanyConfirmDialog";
import { phoneCountryCodes, countries } from "../../../auth/phoneCountryCodes";
import PhoneButton from "../../../../components/PhoneButton";

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
  userSuccess,
  userError,

  editUserLoading,
  editUserSuccess,
  editUserError,

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

  clearActivateUser,
  activateUser,
  userActivateLoading,
  userActivateSuccess,
  userActivateError,

  openInfoAlert,
  setOpenInfoAlert,
  editNoNoti,
  userView,
  cropsLoading,
}) => {
  const innerClasses = innerStyles();
  const classes = useStyles();
  const history = useHistory();

  const [oldValues, setOldValues] = useState<any | undefined>(undefined);
  const [oldUserValues, setOldUserValues] = useState<any | undefined>(undefined);
  const [visiblePass, setVisiblePass] = useState(true);
  const [isOpenCompanyConfirm, setIsOpenCompanyConfirm] = useState<boolean>(false);
  const [companyConfirmId, setCompanyConfirmId] = useState<number>(0);
  const [currentUser, setCurrentUser] = useState<IUser>();
  const [isCompanyAlertOpen, setCompanyAlertOpen] = useState(false);
  const [isChangePasswordModalOpen, setChangePasswordModalOpen] = useState<boolean>(false);
  const [countryCode, setCountryCode] = useState(countries[0].code);
  const [countryName, setCountryName] = useState(phoneCountryCodes[0]);
  const [isPasswordChange, setPasswordChange] = useState<boolean>(false);

  const handleCountryNameChange = (e: any) => {
    setCountryName(e.target.value);
  };

  const handleCountryCodeChange = (e: any) => {
    const countryName = e.target.value;

    countries.forEach(country => {
      if (country.country === countryName) {
        setCountryCode(country.code);
      }
    });
  };

  const getInitialValues = (user: IUser | undefined) => ({
    login: user?.login || "",
    fio: user?.fio || "",
    firstname: user?.firstname || "",
    surname: user?.surname || "",
    lastname: user?.lastname || "",
    phone: user?.phone || `${countryCode}`,
    email: user?.email || "",
    password: "",
    repeatPassword: "",
    role: user?.roles?.length ? user.roles[0] : "",
    status: user?.status || "",
    funnel_state_id: user?.funnel_state?.id || 0,
    is_funnel_state_automate: user?.is_funnel_state_automate || false,
    use_vat: user?.use_vat === undefined ? false : user.use_vat,
    company_confirmed_by_email: user ? user.company_confirmed_by_email : false,
    company_confirmed_by_phone: user ? user.company_confirmed_by_phone : false,
    company_confirmed_by_payment: user ? user.company_confirmed_by_payment : false,
    company_name: user && user.company ? user.company.short_name : "",
    company_id: user && user.company ? user.company.id : 0,
  });

  const validationSchema = Yup.object().shape(
    {
      role: Yup.string()
        .test("role", intl.formatMessage({ id: "PROFILE.VALIDATION.REQUIRED_FIELD" }), value =>
          roles.find(el => el.id === value) ? true : false
        )
        .required(intl.formatMessage({ id: "PROFILE.VALIDATION.REQUIRED_FIELD" })),
      status: editMode !== "create" ? Yup.string().required(intl.formatMessage({ id: "PROFILE.VALIDATION.REQUIRED_FIELD" })) : Yup.string(),
      email: Yup.string().email(intl.formatMessage({ id: "AUTH.VALIDATION.INVALID_FIELD" })),
      phone:
        countryCode.length === 1
          ? Yup.string()
            .required(intl.formatMessage({ id: "PROFILE.VALIDATION.REQUIRED_FIELD" }))
            .matches(/^(\d{1}|\d{11})$/, intl.formatMessage({ id: "PROFILE.VALIDATION.PHONE" }))
            .when(["email"], {
              is: email => !email,
              then: Yup.string().matches(/^(\d{11})$/, intl.formatMessage({ id: "PROFILE.VALIDATION.PHONE" })),
            })
          : Yup.string()
            .required(intl.formatMessage({ id: "PROFILE.VALIDATION.REQUIRED_FIELD" }))
            .matches(/^(\d{3}|\d{13})$/, intl.formatMessage({ id: "PROFILE.VALIDATION.PHONE" })),
      // fio: Yup.string().required(intl.formatMessage({ id: "PROFILE.VALIDATION.REQUIRED_FIELD" })),
    },
    [["email", "phone"]]
  );

  const validationSchemaPassword = Yup.object().shape({
    password: Yup.string(),
    repeatPassword: Yup.string().test("passwords-match", intl.formatMessage({ id: "PROFILE.VALIDATION.SIMILAR_PASSWORD" }), function (
      value
    ) {
      return this.parent.password === value;
    }),
  });

  const { values, handleSubmit, handleChange, handleBlur, resetForm, setFieldValue, touched, errors } = useFormik({
    initialValues: getInitialValues(undefined),
    onSubmit: values => {
      if (roles.find(el => el.id === values.role) === undefined) return;

      if (editMode === "profile" && !isEqual(oldValues, values)) {
        let params: IUserForEdit = setMeValues(values);
        params.company_id = values.company_id;
        editMe({ data: params });
      }

      if (editMode === "create") {
        values.status = "Активный";
        createUser(setCreateValues({ ...values, crop_ids: [1] }));
      }
      if (editMode === "edit" && user && !isEqual(oldUserValues, values)) {
        let params: IUserForEdit = setEditValues(values);
        params.funnel_state_id = values.funnel_state_id;
        params.is_funnel_state_automate = values.is_funnel_state_automate;
        params.use_vat = values.use_vat;
        params.company_id = values.company_id;
        editUser({ id: user.id, data: params });
      }
    },
    validationSchema: isPasswordChange ? validationSchemaPassword : validationSchema,
  });

  const onEmailConfirm = () => {
    if (user) activateUser({ email: user.email });
  };

  useEffect(() => {
    if (meSuccess && !!values && !!me && isEqual(getInitialValues(me), values)) {
      setEditNoNoti(false);
      clearMe();
      setOldValues(values);
    }

    if (userSuccess && !!values && !!user && isEqual(getInitialValues(user), values)) {
      setEditNoNoti(false);
      setOldUserValues(values);
    }
  }, [clearMe, editMode, me, meSuccess, userSuccess, oldValues, oldUserValues, setEditNoNoti, user, values]);

  useEffect(() => {
    return () => {
      if ((editMode === "profile" && !!oldValues) || (editMode === "edit" && !!oldUserValues)) {
        setEditNoNoti(true);
        handleSubmit();
      }
    };
  }, [editMode, handleSubmit, oldValues, oldUserValues, setEditNoNoti]);

  useEffect(() => {
    if (!values.fio) setLocTabPulse(false);
    if (prompterRunning && prompterStep === 0 && !!values.fio && !!values.phone && me?.points.length === 0) setLocTabPulse(true);
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
  }, [clearCreateUser, createError, createSuccess, createdUserId, editError, editMode, enqueueSnackbar, fetchUser, history, intl]);

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
  }, [clearEditUser, editError, editMeNoNoti, editSuccess, enqueueSnackbar, fetchUser, intl, setEditNoNoti, userId]);

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
  }, [clearEditMe, editError, editMeError, editMeNoNoti, editMeSuccess, enqueueSnackbar, fetchMe, intl, setEditNoNoti]);

  useEffect(() => {
    if (editUserSuccess || editUserError) {
      if (!editMeNoNoti) {
        enqueueSnackbar(
          editUserSuccess
            ? intl.formatMessage({ id: "NOTISTACK.USERS.SAVE_PROFILE" })
            : `${intl.formatMessage({ id: "NOTISTACK.ERRORS.ERROR" })} ${editUserError}`,
          {
            variant: editUserSuccess ? "success" : "error",
          }
        );
      }
      setEditNoNoti(false);
      clearUser();
    }
    if (editUserSuccess && userId) {
      fetchUser({ id: userId });
    }
  }, [clearUser, editUserError, editUserSuccess, editMeNoNoti, enqueueSnackbar, fetchUser, intl, setEditNoNoti, userId]);

  useEffect(() => {
    if (userActivateSuccess || userActivateError) {
      enqueueSnackbar(
        userActivateSuccess
          ? intl.formatMessage({ id: "NOTISTACK.USERS.ACTIVATE.SUCCESS" })
          : `${intl.formatMessage({ id: "NOTISTACK.ERRORS.ERROR" })} ${userActivateError}`,
        {
          variant: userActivateSuccess ? "success" : "error",
        }
      );
      clearActivateUser();
    }
  }, [clearActivateUser, userActivateSuccess, userActivateError, intl, enqueueSnackbar]);

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
  }, [editMode, fetchMe, fetchUser, userId, setEditNoNoti]);

  useEffect(() => {
    switch (editMode) {
      case "profile":
        resetForm({ values: getInitialValues(me) });
        setCurrentUser(me);
        break;
      case "edit":
      case "view":
        resetForm({ values: getInitialValues(user) });
        setCurrentUser(user);
        break;
      case "create":
        resetForm({ values: getInitialValues(undefined) });
        break;
    }
  }, [editMode, me, resetForm, user, setCurrentUser]);

  useEffect(() => {
    if (accessByRoles(me, ["ROLE_ADMIN", "ROLE_MANAGER"]) && !funnelStates) fetchFunnelStates();
  }, [editMode, fetchFunnelStates, funnelStates, me]);

  useEffect(() => {
    setFieldValue("phone", countryCode);
  }, [countryCode, setFieldValue]);

  const newRoles = [...roles];
  if (accessByRoles(me, ["ROLE_MANAGER"]) && editMode === "create") {
    newRoles.splice(0, 2);
  }


  const accessTransporter = useCallback(() => {
    return accessByRoles(me, ["ROLE_TRANSPORTER"])
  }, [me]);


  return (
    <>
      <div className={classes.textFieldContainer}>
        {meLoading || userLoading || cropsLoading || (editMode !== "profile" && funnelStatesLoading) ? (
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
            disabled={editMode !== "create" || !me}
          >
            {newRoles.map((item, i) => (
              <MenuItem key={i} value={item.id}>
                {item.value}
              </MenuItem>
            ))}
          </TextField>
        )}
      </div>

      {editMode !== "profile" && editMode !== "create" && (
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
              disabled={editMode === "view" || !me}
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
        !accessByRoles(user, ["ROLE_ADMIN", "ROLE_MANAGER"]) &&
        !!me &&
        accessByRoles(me, ["ROLE_ADMIN", "ROLE_MANAGER"]) &&
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
                  disabled={values.is_funnel_state_automate || editMode === "view" || !me}
                >
                  <MenuItem value={0} style={{ backgroundColor: "#f2f2f2" }}>
                    {intl.formatMessage({ id: "USERLIST.FUNNEL_STATE.NO_NAME" })}
                  </MenuItem>
                  {user && user.is_buyer
                    ? !!funnelStates &&
                    funnelStates
                      .filter(fs => fs.role === "ROLE_BUYER")
                      .map(option => (
                        <MenuItem key={option.id} value={option.id} style={{ backgroundColor: `${option.color || "#ededed"}` }}>
                          {`${option.engagement || "0"} • ${option.name}`}
                        </MenuItem>
                      ))
                    : !!funnelStates &&
                    funnelStates
                      .filter(fs => fs.role === "ROLE_VENDOR")
                      .map(option => (
                        <MenuItem key={option.id} value={option.id} style={{ backgroundColor: `${option.color || "#ededed"}` }}>
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
                    control={<Checkbox checked={values.is_funnel_state_automate} onChange={handleChange} />}
                    label={intl.formatMessage({ id: "USERLIST.FUNNEL_STATE.AUTO" })}
                    name="is_funnel_state_automate"
                  />
                )}
              </div>
            )}
          </>
        )}

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
            disabled={editMode === "view" || !me}
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

      <div className={classes.textFieldContainer}>
        {meLoading || userLoading || (editMode !== "profile" && funnelStatesLoading) ? (
          <Skeleton width="100%" height={70} animation="wave" />
        ) : (
          <TextField
            type="text"
            label={intl.formatMessage({
              id: "PROFILE.INPUT.SURNAME",
            })}
            margin="normal"
            className={classes.textField}
            classes={prompterRunning && prompterStep === 0 && !values.surname ? { root: innerClasses.pulseRoot } : {}}
            name="surname"
            value={values.surname}
            variant="outlined"
            onBlur={handleBlur}
            onChange={handleChange}
            helperText={touched.surname && errors.surname}
            error={Boolean(touched.surname && errors.surname)}
            autoComplete="off"
            disabled={editMode === "view" || !me}
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
              id: "PROFILE.INPUT.NAME",
            })}
            margin="normal"
            className={classes.textField}
            classes={prompterRunning && prompterStep === 0 && !values.firstname ? { root: innerClasses.pulseRoot } : {}}
            name="firstname"
            value={values.firstname}
            variant="outlined"
            onBlur={handleBlur}
            onChange={handleChange}
            helperText={touched.firstname && errors.firstname}
            error={Boolean(touched.firstname && errors.firstname)}
            autoComplete="off"
            disabled={editMode === "view" || !me}
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
              id: "PROFILE.INPUT.PATRONYMIC",
            })}
            margin="normal"
            className={classes.textField}
            classes={prompterRunning && prompterStep === 0 && !values.lastname ? { root: innerClasses.pulseRoot } : {}}
            name="lastname"
            value={values.lastname}
            variant="outlined"
            onBlur={handleBlur}
            onChange={handleChange}
            helperText={touched.lastname && errors.lastname}
            error={Boolean(touched.lastname && errors.lastname)}
            autoComplete="off"
            disabled={editMode === "view" || !me}
          />
        )}
      </div>

      {!accessTransporter() && !(meLoading || userLoading || (editMode !== "profile" && funnelStatesLoading)) && editMode === "profile" && me && (
        <Collapse in={openInfoAlert}>
          <Alert
            className={classes.infoAlert}
            severity="info"
            color="info"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setOpenInfoAlert(false);
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            <div>{intl.formatMessage({ id: "PROFILE.VAT.INFO" })}</div>
            <Link to={accessByRoles(me, ["ROLE_BUYER"]) ? "/purchase/my-bids" : "/sale/my-bids"}>
              {intl.formatMessage({ id: "PROFILE.VAT.INFO.LINK" })}
            </Link>
          </Alert>
        </Collapse>
      )}

      {prompterRunning && prompterStep === 0 && !values.use_vat && (
        <div>
          {meLoading || userLoading || (editMode !== "profile" && funnelStatesLoading) ? (
            <Skeleton width="100%" height={37.5} animation="wave" />
          ) : (
            <div style={{ color: "#fd397a", marginBottom: 16 }}>
              <ReportProblemIcon color="error" /> <b>{intl.formatMessage({ id: "USER.EDIT_FORM.ATTENTION" })}</b>
            </div>
          )}
        </div>
      )}

      {
        !accessTransporter() && !accessByRoles(userView, ["ROLE_TRANSPORTER"]) &&
        <div>
          {meLoading || userLoading || (editMode !== "profile" && funnelStatesLoading) ? (
            <Skeleton width={135} height={37.5} animation="wave" />
          ) : (
            <FormControlLabel
              control={<Checkbox checked={me ? values.use_vat : true} onChange={handleChange} />}
              label={intl.formatMessage({ id: "USER.EDIT_FORM.USE_VAT" })}
              name="use_vat"
              disabled={editMode === "view" || !me}
            />
          )}
        </div>
      }




      {editMode === "create" && (
        <div className={classes.textFieldContainer}>
          {meLoading || userLoading || funnelStatesLoading ? (
            <Skeleton width="100%" height={70} animation="wave" />
          ) : (
            <TextField
              select
              type="country"
              label={intl.formatMessage({
                id: "AUTH.INPUT.COUNTRIES",
              })}
              margin="normal"
              className={classes.textField}
              name="country"
              variant="outlined"
              onBlur={handleBlur}
              //@ts-ignore
              onChange={e => {
                handleCountryNameChange(e);
                handleCountryCodeChange(e);
              }}
              value={countryName}
              fullWidth
              disabled={!me}
            >
              {countries.map(item => (
                <MenuItem key={item.id} value={item.country}>
                  {item.country}
                </MenuItem>
              ))}
            </TextField>
          )}
        </div>
      )}

      {/*{editMode === "view" && !accessByRoles(me, ["ROLE_ADMIN", "ROLE_MANAGER"]) ? null : (*/}
      <div className={classes.textFieldContainer}>
        {meLoading || userLoading || (editMode !== "profile" && funnelStatesLoading) ? (
          <Skeleton width="100%" height={70} animation="wave" />
        ) : (
          <div style={{ width: "100%", display: "flex", alignItems: "center" }}>
            <div style={{ fontSize: "26px", marginTop: "3px", marginRight: "5px" }}>+</div>
            <TextField
              type="tel"
              label={intl.formatMessage({
                id: "PROFILE.INPUT.PHONE",
              })}
              margin="normal"
              className={classes.textField}
              classes={prompterRunning && prompterStep === 0 && !!values.fio && !values.phone ? { root: innerClasses.pulseRoot } : {}}
              name="phone"
              value={values.phone}
              variant="outlined"
              onBlur={handleBlur}
              onChange={handleChange}
              helperText={touched.phone && errors.phone}
              error={Boolean(touched.phone && errors.phone)}
              InputLabelProps={{ shrink: true }}
              autoComplete="off"
              disabled={editMode === "view" || !me}
            />
          </div>
        )}
      </div>
      {/*)}*/}

      {/*{user && (editMode === "view" || editMode === "edit") && (
        <div style={{ marginTop: 15, marginBottom: 15 }}>
          <PhoneButton userId={user?.id || 0} realNumber={values.phone} />
        </div>
      )}*/}

      {me && editMode !== "create" && (
        <div>
          {currentUser && currentUser.company ? (
            <>
              <div className={classes.textFieldContainer}>
                {meLoading || userLoading || editLoading ? (
                  <Skeleton width="100%" height={70} animation="wave" />
                ) : (
                  <>
                    <TextField
                      type="text"
                      label={intl.formatMessage({
                        id: "PROFILE.INPUT.COMPANY",
                      })}
                      margin="normal"
                      name="company_name"
                      value={values.company_name}
                      variant="outlined"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      disabled={true}
                      className={classes.textField}
                    />
                    {editMode !== "view" && (
                      <IconButton size={"medium"} color="secondary" onClick={() => setCompanyAlertOpen(true)}>
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </>
                )}
              </div>
              <CompanyConfirmBlock
                user={editMode === "profile" ? me : user}
                values={values}
                handleChange={editMode === "profile" ? editMe : ({ data }: any) => editUser({ id: userId as number, data: data })}
                disabled={editMode === "profile" || editMode === "view" || !accessByRoles(me, ["ROLE_ADMIN", "ROLE_MANAGER"])}
                loading={editMeLoading || editLoading}
              // loading={!currentUser || meLoading || userLoading || editLoading}
              />
              {!values.company_confirmed_by_email &&
                !values.company_confirmed_by_payment &&
                !accessByRoles(me, ["ROLE_ADMIN", "ROLE_MANAGER"]) &&
                editMode !== "view" && (
                  <div className={classes.textFieldContainer}>
                    {!currentUser || meLoading || userLoading ? (
                      <Skeleton width={170} height={70} animation="wave" />
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          setCompanyConfirmId(values.company_id);
                          setIsOpenCompanyConfirm(true);
                        }}
                      >
                        {intl.formatMessage({ id: "COMPANY.CONFIRM.BUTTON" })}
                      </Button>
                    )}
                  </div>
                )}
            </>
          ) : !currentUser || meLoading || userLoading ? (
            <div className={classes.textFieldContainer}>
              <Skeleton width="100%" height={70} animation="wave" />
            </div>
          ) : (
            <div className={classes.textFieldContainer} style={{ fontSize: 16 }}>
              {intl.formatMessage({ id: "COMPANY.FORM.NO_COMPANY" })}
            </div>
          )}
          {(!!currentUser?.company_confirmed_by_email || !!currentUser?.company_confirmed_by_payment) && !!currentUser?.company?.colors && (
            <TrafficLight intl={intl} colors={currentUser.company.colors} />
          )}

          {me && editMode !== "view" && accessByRoles(me, ["ROLE_ADMIN", "ROLE_MANAGER"]) && !!currentUser && !!currentUser.company && (
            <div className={classes.bottomButtonsContainer}>
              <div className={classes.button}>
                <ButtonWithLoader
                  loading={false}
                  disabled={editMeLoading || createLoading || editLoading || meLoading || userLoading}
                  onPress={() => history.push(`/company/edit/${currentUser.company?.id}`)}
                >
                  {intl.formatMessage({ id: "COMPANY.EDIT.TITLE" })}
                </ButtonWithLoader>
              </div>
            </div>
          )}

          {editMode !== "view" && !!currentUser && !currentUser.company && (
            <CompanySearchForm
              me={me}
              classes={classes}
              company={currentUser && currentUser.company}
              setCompanyAction={(company: any) => {
                setFieldValue("company_id", company && company.id);
                setFieldValue("company_name", company && company.short_name);
                setFieldValue("company_confirmed_by_email", false);
                setFieldValue("company_confirmed_by_phone", false);
                setFieldValue("company_confirmed_by_payment", false);
              }}
              editAction={editMode === "profile" ? editMe : ({ data }: any) => editUser({ id: userId as number, data: data })}
              values={values}
              confirms={editMode === "profile" && accessByRoles(me, ["ROLE_ADMIN", "ROLE_MANAGER"])}
            />
          )}
          <CompanyConfirmDialog
            id={companyConfirmId}
            intl={intl}
            isOpen={isOpenCompanyConfirm}
            handleClose={() => setIsOpenCompanyConfirm(false)}
          />
          <AlertDialog
            isOpen={isCompanyAlertOpen}
            text={intl.formatMessage({
              id: "COMPANY.DIALOGS.DELETE_TEXT",
            })}
            okText={intl.formatMessage({
              id: "COMPANY.DIALOGS.AGREE_TEXT",
            })}
            cancelText={intl.formatMessage({
              id: "COMPANY.DIALOGS.CANCEL_TEXT",
            })}
            handleClose={() => setCompanyAlertOpen(false)}
            handleAgree={() => {
              setFieldValue("company_id", 0);
              setFieldValue("company_confirmed_by_email", false);
              setFieldValue("company_confirmed_by_phone", false);
              setFieldValue("company_confirmed_by_payment", false);
              handleSubmit();
              setCompanyAlertOpen(false);
            }}
            loadingText={intl.formatMessage({
              id: "COMPANY.DIALOGS.LOADING_TEXT",
            })}
            isLoading={editMeLoading || editLoading}
          />
        </div>
      )}

      {me && (
        <div className={classes.bottomButtonsContainer} style={{ flexWrap: "wrap" }}>
          {editMode === "edit" && accessByRoles(me, ["ROLE_ADMIN", "ROLE_MANAGER"]) && (
            <div className={classes.button} style={{ marginTop: 4, marginBottom: 4 }}>
              <ButtonWithLoader
                disabled={!user}
                onPress={() => history.push(`/bid/create/${user?.is_buyer ? "purchase" : "sale"}/0/0/${user?.id}`)}
              >
                {intl.formatMessage({ id: "ALL.BUTTONS.BID_CREATE" })}
              </ButtonWithLoader>
            </div>
          )}

          <div className={classes.flexRow} style={{ marginTop: 4, marginBottom: 4 }}>
            {accessByRoles(me, ["ROLE_ADMIN", "ROLE_MANAGER"]) && (
              <div className={classes.button}>
                <ButtonWithLoader
                  loading={editMeLoading || createLoading || editLoading}
                  disabled={
                    editMeLoading ||
                    createLoading ||
                    editLoading ||
                    meLoading ||
                    userLoading ||
                    userActivateLoading ||
                    (editMode !== "profile" && funnelStatesLoading) ||
                    isEqual(oldValues, values)
                  }
                  onPress={onEmailConfirm}
                >
                  {intl.formatMessage({ id: "USER.EDIT_FORM.ACTIVATE" })}
                </ButtonWithLoader>
              </div>
            )}

            {editMode !== "view" && (
              <div className={classes.button}>
                <ButtonWithLoader
                  loading={editMeLoading || createLoading || editLoading}
                  disabled={editMeLoading || createLoading || editLoading || meLoading || userLoading}
                  onPress={() => {
                    setPasswordChange(true);
                    setChangePasswordModalOpen(true);
                  }}
                >
                  {intl.formatMessage({ id: "ALL.BUTTONS.CHANGE.PASSWORD" })}
                </ButtonWithLoader>
              </div>
            )}

            {editMode !== "view" && (
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
            )}

            {editMode === "edit" && me?.is_admin && (
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
        </div>
      )}

      <Dialog
        open={isChangePasswordModalOpen}
        onClose={() => {
          setPasswordChange(false);
          setChangePasswordModalOpen(false);
        }}
        maxWidth="sm"
        fullWidth
      >
        {editMode !== "view" && (
          <div className={classes.box} style={{ marginTop: 20, marginBottom: 20, marginRight: 20, marginLeft: 20 }}>
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

            {meLoading || userLoading || (editMode !== "profile" && funnelStatesLoading) ? (
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
            )}

            {me && (
              <div className={classes.button} style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
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
                  onPress={() => {
                    handleSubmit();
                    setPasswordChange(false);
                    setChangePasswordModalOpen(false);
                  }}
                >
                  {intl.formatMessage({ id: "ALL.BUTTONS.SAVE" })}
                </ButtonWithLoader>
              </div>
            )}
          </div>
        )}
      </Dialog>
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
    userSuccess: state.users.byIdSuccess,
    userError: state.users.byIdError,

    editUserLoading: state.users.editLoading,
    editUserSuccess: state.users.editSuccess,
    editUserError: state.users.editError,

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

    userActivateLoading: state.users.userActivateLoading,
    userActivateSuccess: state.users.userActivateSuccess,
    userActivateError: state.users.userActivateError,

    openInfoAlert: state.users.openInfoAlert,
    userView: state.users.user,

    editNoNoti: state.auth.editNoNoti,

    cropsLoading: state.crops2.loading,
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

    clearActivateUser: usersActions.clearUserActive,
    activateUser: usersActions.userActiveRequest,

    setEditNoNoti: authActions.setEditNoNoti,
    setOpenInfoAlert: usersActions.setOpenInfoAlert,
  }
);

type TPropsFromRedux = ConnectedProps<typeof connector>;

export default connector(injectIntl(ProfileForm));
