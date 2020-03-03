import React, { useState } from "react";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import { Redirect } from "react-router-dom";
import * as locations from "../../../store/ducks/locations.duck";
import { createUser } from "../../../crud/users.crud";
import useStyles from "./styles";
import UserForm from "./components/UserForm";

function CreateUserPage({ intl, fetchLocationsRequest, clearLocations }) {

  const [loading, setLoading] = useState(false);
  const [backRedirect, setBackRedirect] = useState(false);
  const user = {};
  const classes = useStyles();

  const submitAction = (values, setStatus, setSubmitting) => {
    setTimeout(() => {
      setLoading(true);
      const roleId = values.role.id;
      const valuesWithRole = { ...values, roles: [roleId] };
      createUser(valuesWithRole)
        .then(({ data }) => {
          setLoading(false);
          if (data.data) {
            setStatus({
              error: false,
              message: intl.formatMessage({
                id: "PROFILE.STATUS.SUCCESS",
              }),
            });
            setBackRedirect(true);
          }
        })
        .catch(error => {
          setLoading(false);
          setSubmitting(false);
          setStatus({
            error: true,
            message: intl.formatMessage({
              id: "PROFILE.STATUS.ERROR",
            }),
          });
        });
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

export default injectIntl(connect(null, locations.actions)(CreateUserPage));
