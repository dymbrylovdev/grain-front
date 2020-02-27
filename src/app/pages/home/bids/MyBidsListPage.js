import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual, connect } from "react-redux";
import { injectIntl, FormattedMessage } from "react-intl";
import { Paper } from "@material-ui/core";
import { Link } from "react-router-dom";
import useStyles from "../styles";
import AlertDialog from "../../../components/ui/Dialogs/AlertDialog";
import * as ads from "../../../store/ducks/ads.duck";
import { deleteAd } from "../../../crud/ads.crud";
import Preloader from "../../../components/ui/Loaders/Preloader";
import BidTable from "./components/BidTable";

function MyBidsListPage({ intl, deleteAdSuccess, getMyAds }) {
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
      .catch(error => {});
  };
  const getMyAdsAction = () => {
    getMyAds();
  };
  useEffect(() => {
    getMyAdsAction();
  }, []);
  const { myBids, user, loading } = useSelector(
    ({ ads, auth }) => ({
      myBids: ads.myAds && ads.myAds.list,
      user: auth.user,
      loading: ads.myAds && ads.myAds.loading,
    }),
    shallowEqual
  );
  if (loading) return <Preloader />;
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
        <div className={classes.topMargin}>
          <button className={"btn btn-primary btn-elevate kt-login__btn-primary"}>
            <FormattedMessage id="BIDSLIST.BUTTON.CREATE_BID" />
          </button>
        </div>
      </Link>
      <BidTable
        classes={classes}
        bids={myBids}
        isHaveRules={() => true}
        handleDeleteDialiog={handleDeleteDialiog}
        user={user}
        title={intl.formatMessage({ id: "SUBMENU.MY_BIDS" })}
        addUrl={"fromMy"}
      />
    </Paper>
  );
}

export default injectIntl(connect(null, ads.actions)(MyBidsListPage));
