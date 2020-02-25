import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual, connect } from "react-redux";
import { injectIntl, FormattedMessage } from "react-intl";
import { Paper } from "@material-ui/core";
import { Link } from "react-router-dom";
import useStyles from "../styles";
import AlertDialog from "../../../components/ui/Dialogs/AlertDialog";
import * as ads from "../../../store/ducks/ads.duck";
import { deleteAd, getMyAds } from "../../../crud/ads.crud";
import BidTable from "./components/BidTable";

function MyBidsListPage({ intl, deleteAdSuccess, setMyAds }) {
  const classes = useStyles();
  const [deleteBidId, setDeleteBidId] = useState(-1);
  const [isAlertOpen, setAlertOpen] = useState(false);
  const handleDeleteDialiog = id => {
    setDeleteBidId(id);
    setAlertOpen(true);
  };
  const deleteBidAction = () => {
    setAlertOpen(false);
    deleteAd(deleteBidId)
      .then(() => {
        deleteAdSuccess(deleteBidId);
        getMyAdsAction();
      })
      .catch(error => {
        console.log("deleteUserError", error);
      });
  };
  const getMyAdsAction = ()=> {
    getMyAds()
      .then(({ data }) => {
        console.log("myAdsData", data);
        data  && setMyAds(data);
      })
      .catch(error => {
        console.log("getMyAdsError", error);
      });
  }
  useEffect(() => {
    getMyAdsAction();
  }, []);
  const { myBids, user } = useSelector(
    ({ ads, auth }) => ({ myBids: ads.myAds && ads.myAds.list, user: auth.user }),
    shallowEqual
  );
  return (
    <Paper className={classes.tableContainer}>
      <AlertDialog
        isOpen={isAlertOpen}
        text={intl.formatMessage({
          id: "BIDSLIST.DIALOGS.DELETE_TEXT",
        })}
        okText={intl.formatMessage({
          id: "USERLIST.DIALOGS.AGREE_TEXT",
        })}
        cancelText={intl.formatMessage({
          id: "USERLIST.DIALOGS.CANCEL_TEXT",
        })}
        handleClose={() => setAlertOpen(false)}
        handleAgree={() => deleteBidAction()}
      />
      <Link to="/bid/create">
        <button className={"btn btn-primary btn-elevate kt-login__btn-primary"}>
          <FormattedMessage id="BIDSLIST.BUTTON.CREATE_BID" />
        </button>
      </Link>
      <BidTable
        classes={classes}
        bids={myBids}
        isHaveRules={() => true}
        handleDeleteDialiog={handleDeleteDialiog}
        user={user}
        title={intl.formatMessage({ id: "SUBMENU.MY_BIDS" })}
      />
    </Paper>
  );
}

export default injectIntl(connect(null, ads.actions)(MyBidsListPage));
