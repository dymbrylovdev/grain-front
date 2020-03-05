import React, { useState } from "react";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import { Redirect } from "react-router-dom";
import * as locations from "../../../store/ducks/locations.duck";
import * as users from "../../../store/ducks/users.duck";
import useStyles from "./styles";
import UserForm from "./components/UserForm";

function CreateUserPage({ intl, fetchLocationsRequest, clearLocations, createUser }) {

  const [loading, setLoading] = useState(false);
  const [backRedirect, setBackRedirect] = useState(false);
  const user = {};
  const classes = useStyles();

  const submitAction = (values, setStatus, setSubmitting) => {
    setTimeout(() => {
      setLoading(true);
      const roleId = values.role.id;
      const params = { ...values, roles: [roleId] };
      const successCallback = () => {
        setLoading(false);
        setStatus({
          error: false,
          message: intl.formatMessage({
            id: "PROFILE.STATUS.SUCCESS",
          }),
        });
        setBackRedirect(true);
      }
      const failCallback =() => {
        setLoading(false);
        setSubmitting(false);
        setStatus({
          error: true,
          message: intl.formatMessage({
            id: "PROFILE.STATUS.ERROR",
          }),
        });
      }
      createUser(params,successCallback,failCallback)
    }, 1000);
  };
  
  if (backRedirect) {
    return <Redirect to="/userList" />;
  }
  return (
    <UserForm
      fetchLocations={fetchLocationsRequest}
      clearLocations={clearLocations}
      user={user}
      classes={classes}
      loading={loading}
      submitAction={submitAction}
      isCreate={true}
      isEditable={true}
    />
  );
}

export default injectIntl(connect(null, {...locations.actions, ...users.actions})(CreateUserPage));
