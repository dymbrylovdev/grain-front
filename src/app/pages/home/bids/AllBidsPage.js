import React, { useState, useEffect } from "react";
import { connect, useSelector, shallowEqual } from "react-redux";
import { injectIntl } from "react-intl";
import { Paper } from "@material-ui/core";
import { Link } from "react-router-dom";
import useStyles from "../styles";
import AlertDialog from "../../../components/ui/Dialogs/AlertDialog";
import * as ads from "../../../store/ducks/ads.duck";
import { deleteAd } from "../../../crud/ads.crud";
import BidTable from "./components/BidTable";
import Preloader from "../../../components/ui/Loaders/Preloader";

function AllBidsPage({
  intl,
  deleteAdSuccess,
  getAllAds,
  match: {
    params: { cropId },
  },
}) {
  const classes = useStyles();
  const [deleteBidId, setDeleteBidId] = useState(-1);
  const [isAlertOpen, setAlertOpen] = useState(false);
  const handleDeleteDialiog = id => {
    setDeleteBidId(id);
    setAlertOpen(true);
  };
  const { user } = useSelector(({ auth }) => ({ muser: auth.user }), shallowEqual);
  const { bids, page, per_page, total, loading } = useSelector(({ ads }) => {
    if (!ads.allBids) return { bids: [], page: 1, per_page: 20, total: 0, loading: false };
    return {
      bids: ads.allBids.data,
      page: ads.allBids.page,
      per_page: ads.allBids.per_page,
      total: ads.allBids.total,
      loading: ads.allBids.loading,
    };
  });

  const deleteBidAction = () => {
    setAlertOpen(false);
    deleteAd(deleteBidId)
      .then(() => {
        deleteAdSuccess(deleteBidId);
        getAllAdsAction(cropId, page);
      })
      .catch(error => {});
  };
  const getAllAdsAction = (cropId, page) => {
    getAllAds(cropId, page);
  };
  useEffect(() => {
    getAllAdsAction(cropId, 1);
  }, [cropId]);

  const handleChangePage = (event, page) => {
    getAllAdsAction(cropId, page + 1);
  };
  const paginationData = {
    page,
    per_page,
    total,
    handleChangePage,
  };
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
            {intl.formatMessage({ id: "BIDSLIST.BUTTON.CREATE_BID" })}
          </button>
        </div>
      </Link>
      <BidTable
        classes={classes}
        bids={bids}
        isHaveRules={() => true}
        handleDeleteDialiog={handleDeleteDialiog}
        user={user}
        title={intl.formatMessage({ id: "SUBMENU.ALL_BIDS" })}
        addUrl={"fromAdmin"}
        paginationData={paginationData}
      />
    </Paper>
  );
}

export default injectIntl(connect(null, ads.actions)(AllBidsPage));
