import React, { useState, useEffect } from "react";
import { connect, useSelector, shallowEqual } from "react-redux";
import { injectIntl } from "react-intl";
import { Paper } from "@material-ui/core";
import { Link } from "react-router-dom";
import useStyles from "../styles";
import AlertDialog from "../../../components/ui/Dialogs/AlertDialog";
import * as bids from "../../../store/ducks/bids.duck";
import { deleteBid } from "../../../crud/bids.crud";
import BidTable from "./components/BidTable";
import Preloader from "../../../components/ui/Loaders/Preloader";

function AllBidsPage({
  intl,
  deleteBidSuccess,
  getAllBids,
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
  const { bids, page, per_page, total, loading } = useSelector(({ bids }) => {
    if (!bids.allBids) return { bids: [], page: 1, per_page: 20, total: 0, loading: false };
    return {
      bids: bids.allBids.data,
      page: bids.allBids.page,
      per_page: bids.allBids.per_page,
      total: bids.allBids.total,
      loading: bids.allBids.loading,
    };
  }, shallowEqual);

  const deleteBidAction = () => {
    setAlertOpen(false);
    deleteBid(deleteBidId)
      .then(() => {
        deleteBidSuccess(deleteBidId);
        getAllBidsAction(cropId, page);
      })
      .catch(error => {});
  };
  const getAllBidsAction = (cropId, page) => {
    getAllBids(cropId, page);
  };
  useEffect(() => {
    getAllBidsAction(cropId, 1);
  }, [cropId]);

  const handleChangePage = (event, page) => {
    getAllBidsAction(cropId, page + 1);
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

export default injectIntl(connect(null, bids.actions)(AllBidsPage));
