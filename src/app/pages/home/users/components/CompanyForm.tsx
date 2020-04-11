import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { connect, ConnectedProps } from "react-redux";
import { WrappedComponentProps, injectIntl } from "react-intl";
import { TextField, Theme, IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { useFormik } from "formik";
import DeleteIcon from "@material-ui/icons/Delete";
import { useSnackbar } from "notistack";

import { actions as usersActions } from "../../../../store/ducks/users.duck";
import { actions as authActions } from "../../../../store/ducks/auth.duck";

import useStyles from "../../styles";
import { setMeValues, setEditValues } from "../utils/submitValues";
import { getInitialValues } from "../utils/companyForm";
import CompanyConfirmBlock from "../../companies/components/CompanyConfirmBlock";
import ButtonWithLoader from "../../../../components/ui/Buttons/ButtonWithLoader";
import CompanySearchForm from "../../companies/components/CompanySearchForm";
import { IAppState } from "../../../../store/rootDuck";

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

const isNonConfirm = (values: {
  company_confirmed_by_email: any;
  company_confirmed_by_phone: any;
  company_confirmed_by_payment: any;
  company_name?: string;
  company_id?: number;
}) => {
  return (
    !values.company_confirmed_by_email ||
    !values.company_confirmed_by_phone ||
    !values.company_confirmed_by_payment
  );
};

interface IProps {
  editMode: "profile" | "create" | "edit";
  userId?: number;
}

const CompanyForm: React.FC<IProps & TPropsFromRedux & WrappedComponentProps> = ({
  intl,

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
  userId,
}) => {
  const innerClasses = innerStyles();
  const classes = useStyles();

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

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (editSuccess || editError) {
      enqueueSnackbar(
        editSuccess
          ? intl.formatMessage({ id: "NOTISTACK.USERS.SAVE_COMPANY" })
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
          ? intl.formatMessage({ id: "NOTISTACK.USERS.SAVE_COMPANY" })
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

  const { values, handleSubmit, handleChange, handleBlur, resetForm, setFieldValue } = useFormik({
    initialValues: getInitialValues(undefined),
    onSubmit: values => {
      if (editMode === "profile") editMe({ data: setMeValues(values) });
      if (editMode === "edit" && userId) editUser({ id: userId, data: setEditValues({}) });
    },
  });

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

  return (
    <div>
      {values.company_name ? (
        <>
          <div className={innerClasses.companyContainer}>
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
              className={innerClasses.companyText}
            />
            {
              <IconButton
                size={"medium"}
                onClick={() => {
                  setFieldValue("company_id", null);
                  setFieldValue("company_name", "");
                  setFieldValue("company_confirmed_by_email", false);
                  setFieldValue("company_confirmed_by_phone", false);
                  setFieldValue("company_confirmed_by_payment", false);
                  handleSubmit();
                }}
              >
                <DeleteIcon />
              </IconButton>
            }
          </div>
          <CompanyConfirmBlock
            values={values}
            handleChange={handleChange}
            disabled={!user?.is_admin}
          />
          {isNonConfirm(values) && !user?.is_admin && (
            <div className={innerClasses.buttonConfirm}>
              {user?.company ? (
                <Link
                  to={`/company/confirm/${values.company_id}`}
                  onClick={() => {
                    if (
                      !values.company_confirmed_by_email &&
                      !values.company_confirmed_by_phone &&
                      !values.company_confirmed_by_payment
                    ) {
                      mergeUser({
                        company_confirmed_by_email: false,
                        company_confirmed_by_phone: false,
                        company_confirmed_by_payment: false,
                      });
                    }
                  }}
                >
                  <ButtonWithLoader>
                    {intl.formatMessage({ id: "COMPANY.CONFIRM.BUTTON" })}
                  </ButtonWithLoader>
                </Link>
              ) : (
                <p className={classes.text}>
                  {intl.formatMessage({ id: "COMPANY.CONFIRM.NO_COMPANY" })}
                </p>
              )}
            </div>
          )}
        </>
      ) : (
        <p className={classes.text}>{intl.formatMessage({ id: "COMPANY.FORM.NO_COMPANY" })}</p>
      )}
      {
        <CompanySearchForm
          classes={classes}
          company={user && user.company}
          setCompanyAction={(company: any) => {
            setFieldValue("company_id", company && company.id);
            setFieldValue("company_name", company && company.short_name);
            setFieldValue("company_confirmed_by_email", false);
            setFieldValue("company_confirmed_by_phone", false);
            setFieldValue("company_confirmed_by_payment", false);
          }}
        />
      }
    </div>
  );
};

const connector = connect(
  (state: IAppState) => ({
    me: state.auth.user,
    meLoading: state.auth.loading,
    meError: state.auth.error,

    editMeLoading: state.auth.editLoading,
    editMeSuccess: state.auth.editSuccess,
    editMeError: state.auth.editError,

    user: state.users.user,
    userLoading: state.users.byIdLoading,
    userError: state.users.byIdError,

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

export default connector(injectIntl(CompanyForm));
