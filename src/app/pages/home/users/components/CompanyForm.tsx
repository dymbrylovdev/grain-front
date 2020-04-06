import React from "react";
import { Link } from "react-router-dom";
import { IntlShape } from "react-intl";
import { TextField, Theme, IconButton, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { Formik, Form } from "formik";
import DeleteIcon from "@material-ui/icons/Delete";

import { IUser, IUserForEdit, IUserForCreate } from "../../../../interfaces/users";
import useStyles from "../../styles";
import { ActionWithPayload } from "../../../../utils/action-helper";
import { setMeValues, setCreateValues, setEditValues } from "../utils/submitValues";
import { getInitialValues } from "../utils/companyForm";
import CompanyConfirmBlock from "../../companies/components/CompanyConfirmBlock";
import ButtonWithLoader from "../../../../components/ui/Buttons/ButtonWithLoader";
import CompanySearchForm from "../../companies/components/CompanySearchForm";

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
  mergeUser: (payload: any) => ActionWithPayload<"auth/MERGE_USER", any>;
  intl: IntlShape;
  statuses: string[];
  user: IUser | undefined;
  editMode: "profile" | "create" | "edit";
  prompterRunning: boolean;
  prompterStep: number;
  loading: boolean;
  setAlertOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const CompanyForm: React.FC<IProps> = ({
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
  mergeUser,
}) => {
  const innerClasses = innerStyles();
  const classes = useStyles();

  return (
    <Formik
      initialValues={getInitialValues(user)}
      onSubmit={values => {
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
        setFieldValue,
        resetForm,
      }) => {
        return (
          <Form autoComplete="off" className="kt-form">
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
              <p className={classes.text}>
                {intl.formatMessage({ id: "COMPANY.FORM.NO_COMPANY" })}
              </p>
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
            <Grid
              container
              direction="row"
              justify="flex-end"
              alignItems="center"
              spacing={1}
              className={classes.buttonContainer}
            >
              <Grid item>
                <ButtonWithLoader
                  loading={loading}
                  disabled={loading || !values.company_id}
                  onPress={handleSubmit}
                >
                  {intl.formatMessage({ id: "COMPANY.BUTTON.SAVE" })}
                </ButtonWithLoader>
              </Grid>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

export default CompanyForm;
