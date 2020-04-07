import React from "react";
import { IntlShape } from "react-intl";
import { TextField, MenuItem, Theme, Grid, Button } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/styles";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import ButtonWithLoader from "../../../../components/ui/Buttons/ButtonWithLoader";
import { IUser, IUserForEdit, IUserForCreate } from "../../../../interfaces/users";
import useStyles from "../../styles";
import { OutlinedRedButton } from "../../../../components/ui/Buttons/RedButtons";
import { ActionWithPayload } from "../../../../utils/action-helper";
import { getInitialValues, roles } from "../utils/profileForm";
import { setMeValues, setCreateValues, setEditValues } from "../utils/submitValues";

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
  editMe: (payload: {
    data: IUserForEdit;
  }) => ActionWithPayload<
    "auth/EDIT_REQUEST",
    {
      data: IUserForEdit;
    }
  >;
  editUser: (payload: {
    id: number;
    data: IUserForEdit;
  }) => ActionWithPayload<
    "users/EDIT_REQUEST",
    {
      id: number;
      data: IUserForEdit;
    }
  >;
  createUser: (
    payload: IUserForCreate
  ) => ActionWithPayload<"users/CREATE_REQUEST", IUserForCreate>;

  intl: IntlShape;
  statuses: string[];
  user: IUser | undefined;
  editMode: "profile" | "create" | "edit";
  prompterRunning: boolean;
  prompterStep: number;
  loading: boolean;
  setAlertOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProfileSkeleton: React.FC<IProps> = ({
  editMe,
  editUser,
  createUser,
  intl,
  statuses,
  user,
  editMode,
  prompterRunning,
  prompterStep,
  loading,
  setAlertOpen,
}) => {
  const innerClasses = innerStyles();
  const classes = useStyles();
  const history = useHistory();

  return (
    <Formik
      initialValues={getInitialValues(user)}
      validationSchema={Yup.object().shape({
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
        login: Yup.string().required(
          intl.formatMessage({ id: "PROFILE.VALIDATION.REQUIRED_FIELD" })
        ),
        repeatPassword: Yup.string().oneOf(
          [Yup.ref("password"), null],
          intl.formatMessage({ id: "PROFILE.VALIDATION.SIMILAR_PASSWORD" })
        ),
      })}
      onSubmit={(values, errors) => {
        if (editMode === "profile") editMe({ data: setMeValues(values) });
        if (editMode === "create") createUser(setCreateValues(values));
        if (editMode === "edit" && user) editUser({ id: user.id, data: setEditValues(values) });
      }}
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
      }) => {
        return (
          <Form autoComplete="off" className="kt-form">
            {editMode !== "profile" && (
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

            {editMode !== "profile" && (
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
            <Grid
              container
              direction="row"
              justify="flex-end"
              alignItems="center"
              spacing={1}
              className={classes.buttonContainer}
            >
              {editMode !== "profile" && (
                <Grid item>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => history.push("/user-list")}
                  >
                    {intl.formatMessage({ id: "ALL.BUTTONS.PREV" })}
                  </Button>
                </Grid>
              )}
              <Grid item>
                <ButtonWithLoader loading={loading} disabled={loading} onPress={handleSubmit}>
                  {editMode === "create"
                    ? intl.formatMessage({ id: "ALL.BUTTONS.CREATE" })
                    : intl.formatMessage({ id: "ALL.BUTTONS.SAVE" })}
                </ButtonWithLoader>
              </Grid>
              {editMode === "edit" && (
                <Grid item>
                  <OutlinedRedButton variant="outlined" onClick={() => setAlertOpen(true)}>
                    {intl.formatMessage({ id: "ALL.BUTTONS.DELETE" })}
                  </OutlinedRedButton>
                </Grid>
              )}
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

export default ProfileSkeleton;
