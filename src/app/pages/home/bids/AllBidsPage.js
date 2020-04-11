import React, { useState, useEffect, useCallback } from "react";
import { connect, useSelector, shallowEqual } from "react-redux";
import { injectIntl } from "react-intl";
import { Paper } from "@material-ui/core";
import { Link } from "react-router-dom";
import useStyles from "../styles";

import AlertDialog from "../../../components/ui/Dialogs/AlertDialog";
import * as bidsDuck from "../../../store/ducks/bids.duck";
import BidTable from "./components/BidTable";
import Preloader from "../../../components/ui/Loaders/Preloader";
import { ErrorDialog, LoadError } from "../../../components/ui/Errors";

function AllBidsPage({
  intl,
  getAllBids,
  match: {
    params: { cropId },
  },
  deleteBid,
  clearErrors,
}) {
  const classes = useStyles();
  const [deleteBidId, setDeleteBidId] = useState(-1);
  const [isAlertOpen, setAlertOpen] = useState(false);
  const handleDeleteDialiog = id => {
    setDeleteBidId(id);
    setAlertOpen(true);
  };
  const { user } = useSelector(({ auth }) => ({ muser: auth.user }), shallowEqual);
  const { bids, page, per_page, total, loading, errors } = useSelector(({ bids }) => {
    if (!bids.allBids) return { bids: [], page: 1, per_page: 20, total: 0, loading: false };
    return {
      bids: bids.allBids.data,
      page: bids.allBids.page,
      per_page: bids.allBids.per_page,
      total: bids.allBids.total,
      loading: bids.allBids.loading,
      errors: bids.errors || {},
    };
  }, shallowEqual);

  const deleteBidAction = () => {
    setAlertOpen(false);
    deleteBid(deleteBidId, bidsDuck.bidTypes.AllBids, { id: cropId, page });
  };
  const getAllBidsAction = useCallback(
    (cropId, page) => {
      getAllBids(cropId, page);
    },
    [getAllBids]
  );
  useEffect(() => {
    getAllBidsAction(cropId, 1);
  }, [cropId, getAllBidsAction]);

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
  if (errors.all) return <LoadError handleClick={() => getAllBidsAction(cropId, page)} />;
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
      <ErrorDialog
        isOpen={errors.delete || false}
        text={intl.formatMessage({ id: "ERROR.BID.DELETE" })}
        handleClose={() => clearErrors()}
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
        loading={loading}
      />
      <div className={classes.tableFooterText}>{intl.formatMessage({ id: "BID.BOTTOM.TEXT" })}</div>
    </Paper>
  );
}

export default injectIntl(connect(null, bidsDuck.actions)(AllBidsPage));
