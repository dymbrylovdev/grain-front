import React, { useState, useEffect } from "react";
import { connect, useSelector } from "react-redux";
import { injectIntl } from "react-intl";
import * as users from "../../../store/ducks/users.duck";
import * as locations from "../../../store/ducks/locations.duck";
import useStyles from "./styles";
import UserForm from "./components/UserForm";
import { LayoutSubheader } from "../../../../_metronic/layout/LayoutContext";
import Preloader from "../../../components/ui/Loaders/Preloader";
import { LoadError } from "../../../components/ui/Erros";

function EditUserPage({ intl, editUser, fetchLocationsRequest, match, clearLocations, getUserById }) {
  const [loading, setLoading] = useState(false);
  const {id: userId} = match.params;
  const { user, preloading, myUser, errors } = useSelector(({users: { currentUser, errors}, auth: {user: myUser}}) => ({
    user: currentUser, preloading: currentUser && currentUser.loading, myUser, errors: errors || {}
  }))
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
      }
      const failCallback = () => {
        setLoading(false);
        setSubmitting(false);
        setStatus({
          error: true,
          message: intl.formatMessage({
            id: "PROFILE.STATUS.ERROR",
          }),
        });
      }
      editUser(userId, params, successCallback, failCallback) 
    }, 1000);
  };
  
  useEffect(()=>{
    getUserById(userId);
  },[userId])
  const isEditable = myUser.is_admin;
  const title = isEditable ? intl.formatMessage({id: "PROFILE.TITLE.EDIT"}) : intl.formatMessage({id: "PROFILE.TITLE.VIEW"});
  if (errors.current) return <LoadError handleClick={() => getUserById(userId)} />;
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
