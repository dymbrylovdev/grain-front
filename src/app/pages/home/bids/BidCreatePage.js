import React, { useState } from "react";
import { injectIntl } from "react-intl";
import { connect, useSelector, shallowEqual } from "react-redux";
import { Redirect } from "react-router-dom";
import BidForm from "./components/BidForm";
import useStyles from "../styles";
import { createAd } from "../../../crud/ads.crud";
import userSelector from "../../../store/selectors/user";
import { LayoutSubheader } from "../../../../_metronic/layout/LayoutContext";
import * as ads from "../../../store/ducks/ads.duck";

function BidCreatePage({ intl, createAdSuccess, match }) {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [backRedirect, setBackRedirect] = useState(false);
  const { crops } = useSelector(({crops}) =>({crops: crops.crops}), shallowEqual);
  const vendorId = match.params.id;
  const { user } = userSelector(vendorId);
  const submitAction = (values, setStatus, setSubmitting) => {
    const  valuesWithVendor = values;
    if(vendorId){
      valuesWithVendor.vendor_id = Number.parseInt(vendorId);
    }
    console.log('bidCreateValues', valuesWithVendor);
    setTimeout(() => {
      setLoading(true);
      createAd(valuesWithVendor)
        .then(({ data }) => {
          console.log('createBidData', data);
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

  return (
  <>
  {user && user.id && <LayoutSubheader title={`${intl.formatMessage({id: "BID.TITLE.BY_VENDOR"})} [${user.login}]`}/>}
  <BidForm classes={classes} loading={loading} submitAction={submitAction} crops={crops}/>
  </>)
}

export default injectIntl(connect(null, ads.actions)(BidCreatePage));
