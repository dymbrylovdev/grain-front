import React, { useState } from "react";
import { connect, useSelector, shallowEqual } from "react-redux";
import { injectIntl} from "react-intl";
import * as users from "../../../store/ducks/users.duck";
import { editUser } from "../../../crud/users.crud";
import useStyles from './styles';
import UserForm from './components/UserForm';




function EditUserPage({ intl, editUserSuccess, match }) {
  const [loading, setLoading] = useState(false);
  const id = match.params.id;
  const user = useSelector(({ users: { users } }) => {   
      const myUser = users.filter(item => item.id == id);
      if (myUser.length > 0){
          return myUser[0];
      }
      return {}}, shallowEqual);
  const classes = useStyles();
  const submitAction = (values, setStatus, setSubmitting) => {
    setTimeout(() => {
      setLoading(true)
        console.log('editUserValues', values);  
        editUser(values, id)
          .then(({ data }) => {
            setLoading(false);
            if (data.data) {
              setStatus({
                error: false,
                message: intl.formatMessage({
                  id: "PROFILE.STATUS.SUCCESS",
                }),
              });
              editUserSuccess(data.data)
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
  }
  return (

    <UserForm user = {user} classes = {classes} loading= {loading} submitAction={submitAction} isEdit={true} />
  );
}

export default injectIntl(connect(null, users.actions)(EditUserPage));
