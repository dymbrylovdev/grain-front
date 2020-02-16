import React, { useState } from "react";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import BidForm from "./components/BidForm";
import useStyles from "./styles";
import { createAd } from "../../../crud/ads.crud";
import * as ads from "../../../store/ducks/ads.duck";

function BidCreatePage({ intl, createAdSuccess }) {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [backRedirect, setBackRedirect] = useState(false);
  const submitAction = (values, setStatus, setSubmitting) => {
    setTimeout(() => {
      setLoading(true);
      createAd(values)
        .then(({ data }) => {
          setLoading(false);
          if (data.data) {
            setStatus({
              error: false,
              message: intl.formatMessage({
                id: "BID.STATUS.CREATE_SUCCESS",
              }),
            });
            createAdSuccess();
            setBackRedirect(true);
          }
        })
        .catch(error => {
            console.log('errorBid', error);
            
          setLoading(false);
          setSubmitting(false);
          setStatus({
            error: true,
            message: intl.formatMessage({
              id: "BID.STATUS.ERROR",
            }),
          });
        });
    }, 1000);
  };
  if (backRedirect) {
    return <Redirect to="/bidsList" />;
  }

  return <BidForm classes={classes} loading={loading} submitAction={submitAction} />;
}

export default injectIntl(connect(null, ads.actions)(BidCreatePage));
