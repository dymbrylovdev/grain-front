import React, { useState, useEffect } from "react";
import { connect, useSelector } from "react-redux";
import { injectIntl } from "react-intl";
import * as users from "../../../store/ducks/users.duck";
import * as locations from "../../../store/ducks/locations.duck";
import { editUser } from "../../../crud/users.crud";
import useStyles from "./styles";
import UserForm from "./components/UserForm";
import { LayoutSubheader } from "../../../../_metronic/layout/LayoutContext";
import Preloader from "../../../components/ui/Loaders/Preloader";

function EditUserPage({ intl, editUserSuccess, fetchLocationsRequest, match, clearLocations, getUserById }) {
  const [loading, setLoading] = useState(false);
  const {id: userId} = match.params;
  const { user, preloading, myUser } = useSelector(({users: { currentUser}, auth: {user: myUser}}) => ({
    user: currentUser, preloading: currentUser && currentUser.loading, myUser
  }))
  const classes = useStyles();

  const submitAction = (values, setStatus, setSubmitting) => {
    setTimeout(() => {
      setLoading(true);
      editUser(values, userId)
        .then(({ data }) => {
          setLoading(false);
          if (data.data) {
            setStatus({
              error: false,
              message: intl.formatMessage({
                id: "PROFILE.STATUS.SUCCESS",
              }),
            });
            editUserSuccess(data.data);
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
  useEffect(()=>{
    getUserById(userId);
  },[userId])
  const isEditable = myUser.is_admin;
  const title = isEditable ? intl.formatMessage({id: "PROFILE.TITLE.EDIT"}) : intl.formatMessage({id: "PROFILE.TITLE.VIEW"});
  return (
    <>
      <LayoutSubheader title={`${title} ${(user && user.login)  ? user.login : ""}`}/>
      {preloading ? <Preloader/> :        <UserForm
        fetchLocations={fetchLocationsRequest}
        clearLocations={clearLocations}
        user={user}
        classes={classes}
        loading={loading}
        submitAction={submitAction}
        isEdit={true}
        isEditable = {myUser.is_admin}
      />}

    </>
  );
}

export default injectIntl(connect(null, { ...users.actions, ...locations.actions })(EditUserPage));
