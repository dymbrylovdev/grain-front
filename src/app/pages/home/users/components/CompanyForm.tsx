import React, { useEffect, useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { WrappedComponentProps, injectIntl } from "react-intl";
import { TextField, IconButton, Button } from "@material-ui/core";
import { useFormik } from "formik";
import DeleteIcon from "@material-ui/icons/Delete";
import { useSnackbar } from "notistack";

import { actions as usersActions } from "../../../../store/ducks/users.duck";
import { actions as authActions } from "../../../../store/ducks/auth.duck";

import useStyles from "../../styles";
import { getInitialValues } from "../utils/companyForm";
import CompanyConfirmBlock from "../../companies/components/CompanyConfirmBlock";
import CompanySearchForm from "../../companies/components/CompanySearchForm";
import { IAppState } from "../../../../store/rootDuck";
import CompanyConfirmDialog from "./CompanyConfirmDialog";
import { Skeleton } from "@material-ui/lab";
import AlertDialog from "../../../../components/ui/Dialogs/AlertDialog";
import { IUser } from "../../../../interfaces/users";
import { accessByRoles } from "../../../../utils/utils";
import { TrafficLight } from ".";
import ButtonWithLoader from "../../../../components/ui/Buttons/ButtonWithLoader";
import { useHistory } from "react-router-dom";

const isNonConfirm = (values: {
  company_confirmed_by_email: any;
  company_confirmed_by_phone: any;
  company_confirmed_by_payment: any;
  company_name?: string;
  company_id?: number;
}) => {
  return (
    !values.company_confirmed_by_email ||
    // !values.company_confirmed_by_phone ||
    !values.company_confirmed_by_payment
  );
};

interface IProps {
  editMode: "profile" | "create" | "edit" | "view";
  userId?: number;
}

const CompanyForm: React.FC<IProps & TPropsFromRedux & WrappedComponentProps> = ({
  intl,

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
  const classes = useStyles();
  const history = useHistory();

  const [isOpenCompanyConfirm, setIsOpenCompanyConfirm] = useState<boolean>(false);
  const [companyConfirmId, setCompanyConfirmId] = useState<number>(0);
  const [isAlertOpen, setAlertOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<IUser>();

  // useEffect(() => {
  //   switch (editMode) {
  //     case "profile":
  //       fetchMe();
  //       break;
  //     case "edit":
  //     case "view":
  //       if (userId) fetchUser({ id: userId });
  //       break;
  //   }
  // }, [editMode, fetchMe, fetchUser, userId]);

  // useEffect(() => {
  //   if (meSuccess) {
  //     setEditNoNoti(false);
  //     clearMe();
  //   }
  // }, [clearMe, meSuccess, setEditNoNoti]);

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
  }, [clearEditUser, editError, editSuccess, enqueueSnackbar, intl, userId]);

  useEffect(() => {
    if (editMeSuccess || editMeError) {
      if (!editMeNoNoti) {
        enqueueSnackbar(
          editMeSuccess
            ? intl.formatMessage({ id: "NOTISTACK.USERS.SAVE_COMPANY" })
            : `${intl.formatMessage({ id: "NOTISTACK.ERRORS.ERROR" })} ${editMeError}`,
          {
            variant: editMeSuccess ? "success" : "error",
          }
        );
      }
      setEditNoNoti(false);
      clearEditMe();
    }
  }, [
    clearEditMe,
    editError,
    editMeError,
    editMeNoNoti,
    editMeSuccess,
    enqueueSnackbar,
    intl,
    setEditNoNoti,
  ]);

  const { values, handleSubmit, handleChange, handleBlur, resetForm, setFieldValue } = useFormik({
    initialValues: getInitialValues(undefined),
    onSubmit: values => {
      if (editMode === "profile") editMe({ data: values });
      if (editMode === "edit" && userId) editUser({ id: userId, data: values });
    },
  });

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
  }, [editMode, me, resetForm, setCurrentUser, user]);

  return (
    <div>
      {currentUser && currentUser.company ? (
        <>
          <div className={classes.textFieldContainer}>
            {/* {meLoading || userLoading || editLoading ? (
              <Skeleton width="100%" height={70} animation="wave" />
            ) : (
              <> */}
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
              <IconButton size={"medium"} color="secondary" onClick={() => setAlertOpen(true)}>
                <DeleteIcon />
              </IconButton>
            )}
            {/* </>
            )} */}
          </div>
          <CompanyConfirmBlock
            user={editMode === "profile" ? me : user}
            values={values}
            handleChange={
              editMode === "profile"
                ? editMe
                : ({ data }: any) => editUser({ id: userId as number, data: data })
            }
            disabled={
              editMode === "profile" ||
              editMode === "view" ||
              !accessByRoles(me, ["ROLE_ADMIN", "ROLE_MANAGER"])
            }
            loading={editMeLoading || editLoading}
            // loading={!currentUser || meLoading || userLoading || editLoading}
          />
          {isNonConfirm(values) &&
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
      {(!!currentUser?.company_confirmed_by_email || !!currentUser?.company_confirmed_by_payment) &&
        !!currentUser?.company?.colors && (
          <TrafficLight intl={intl} colors={currentUser.company.colors} />
        )}

      {editMode !== "view" &&
        accessByRoles(me, ["ROLE_ADMIN", "ROLE_MANAGER"]) &&
        !!currentUser &&
        !!currentUser.company && (
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
          classes={classes}
          company={currentUser && currentUser.company}
          setCompanyAction={(company: any) => {
            setFieldValue("company_id", company && company.id);
            setFieldValue("company_name", company && company.short_name);
            setFieldValue("company_confirmed_by_email", false);
            setFieldValue("company_confirmed_by_phone", false);
            setFieldValue("company_confirmed_by_payment", false);
          }}
          editAction={
            editMode === "profile"
              ? editMe
              : ({ data }: any) => editUser({ id: userId as number, data: data })
          }
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
        isOpen={isAlertOpen}
        text={intl.formatMessage({
          id: "COMPANY.DIALOGS.DELETE_TEXT",
        })}
        okText={intl.formatMessage({
          id: "COMPANY.DIALOGS.AGREE_TEXT",
        })}
        cancelText={intl.formatMessage({
          id: "COMPANY.DIALOGS.CANCEL_TEXT",
        })}
        handleClose={() => setAlertOpen(false)}
        handleAgree={() => {
          setFieldValue("company_id", 0);
          setFieldValue("company_confirmed_by_email", false);
          setFieldValue("company_confirmed_by_phone", false);
          setFieldValue("company_confirmed_by_payment", false);
          handleSubmit();
          setAlertOpen(false);
        }}
        loadingText={intl.formatMessage({
          id: "COMPANY.DIALOGS.LOADING_TEXT",
        })}
        isLoading={editMeLoading || editLoading}
      />
    </div>
  );
};

const connector = connect(
  (state: IAppState) => ({
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
    clearMe: authActions.clearFetch,
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

    setEditNoNoti: authActions.setEditNoNoti,
  }
);

type TPropsFromRedux = ConnectedProps<typeof connector>;

export default connector(injectIntl(CompanyForm));
