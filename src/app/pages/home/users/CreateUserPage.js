import React, { useState } from "react";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import { Redirect } from "react-router-dom";
import * as users from "../../../store/ducks/users.duck";
import { createUser } from "../../../crud/users.crud";
import useStyles from "./styles";
import UserForm from "./components/UserForm";

function CreateUserPage({ intl, fetchLocationsRequest, clearFoundResult }) {
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
          console.log("loginError", error);

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
      clearFoundResult={clearFoundResult}
      user={user}
      classes={classes}
      loading={loading}
      submitAction={submitAction}
      isCreate={true}
    />
  );
}

export default injectIntl(connect(null, users.actions)(CreateUserPage));
