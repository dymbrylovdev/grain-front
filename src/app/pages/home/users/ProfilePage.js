import React, { useState } from "react";
import { shallowEqual, useSelector, connect } from "react-redux";
import { injectIntl} from "react-intl";
import * as auth from "../../../store/ducks/auth.duck";
import { setUser } from "../../../crud/auth.crud";
import useStyles from './styles';
import UserForm from './components/UserForm';




function ProfilePage({ intl, fulfillUser }) {
  const [loading, setLoading] = useState(false);
  const user = useSelector(({ auth: { user } }) => user, shallowEqual);
  const classes = useStyles();
  const submitAction = (values, setStatus, setSubmitting) => {
    setTimeout(() => {
      setLoading(true)
        setUser(values)
          .then(({ data }) => {
            setLoading(false);
            if (data.data) {
              setStatus({
                error: false,
                message: intl.formatMessage({
                  id: "PROFILE.STATUS.SUCCESS",
                }),
              });
              fulfillUser(data.data);
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
  }
  return (
    <UserForm user = {user} classes = {classes} loading= {loading} submitAction={submitAction} />
  );
}

export default injectIntl(connect(null, auth.actions)(ProfilePage));
