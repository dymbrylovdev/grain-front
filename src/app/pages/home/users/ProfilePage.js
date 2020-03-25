import React, { useState, useEffect, useCallback } from "react";
import { shallowEqual, useSelector, connect } from "react-redux";
import { injectIntl } from "react-intl";
import * as auth from "../../../store/ducks/auth.duck";
import * as locations from "../../../store/ducks/locations.duck";
import * as prompter from "../../../store/ducks/prompter.duck";
import useStyles from "../styles";
import UserForm from "./components/UserForm";
import Preloader from "../../../components/ui/Loaders/Preloader";
import { LoadError } from "../../../components/ui/Erros";
import Prompter from "../prompter/Prompter";

function ProfilePage({
  intl,
  fetchLocationsRequest,
  clearLocations,
  getUser,
  editUser,
  mergeUser,
  runPrompter,
  setActiveStep,
}) {
  const [loading, setLoading] = useState(false);
  const { user, preloading, errors } = useSelector(
    ({ auth: { user, errors } }) => ({
      user,
      preloading: user && user.loading,
      errors: errors || {},
    }),
    shallowEqual
  );

  const classes = useStyles();

  const submitAction = (values, setStatus, setSubmitting) => {
    setTimeout(() => {
      setLoading(true);
      const params = values;
      const successCallback = () => {
        setLoading(false);
        setStatus({
          error: false,
          message: intl.formatMessage({
            id: "PROFILE.STATUS.SUCCESS",
          }),
        });
      };
      const failCallback = () => {
        setLoading(false);
        setSubmitting(false);
        setStatus({
          error: true,
          message: intl.formatMessage({
            id: "PROFILE.STATUS.ERROR",
          }),
        });
      };
      editUser(params, successCallback, failCallback);
    }, 1000);
  };

  const setEmptyConfirmAction = useCallback(() => {
    mergeUser({
      company_confirmed_by_email: false,
      company_confirmed_by_phone: false,
      company_confirmed_by_payment: false,
    });
  }, [mergeUser]);

  useEffect(() => {
    getUser();
  }, [getUser]);

  useEffect(() => {
    if (user) {
      if (!user.fio || !user.location) {
        if (user.is_buyer) runPrompter("buyer");
        if (user.is_vendor) runPrompter("seller");
      } else {
        setActiveStep(1);
      }
    }
  }, [user, runPrompter, setActiveStep]);

  if (errors.get) return <LoadError handleClick={() => getUser()} />;
  return (
    <>
      {preloading ? (
        <Preloader />
      ) : (
        <>
          <Prompter />
          <UserForm
            fetchLocations={fetchLocationsRequest}
            clearLocations={clearLocations}
            user={user}
            classes={classes}
            loading={loading}
            submitAction={submitAction}
            isEditable={true}
            byAdmin={user.is_admin}
            emptyConfirm={setEmptyConfirmAction}
          />
        </>
      )}
    </>
  );
}

export default injectIntl(
  connect(null, { ...auth.actions, ...locations.actions, ...prompter.actions })(ProfilePage)
);
