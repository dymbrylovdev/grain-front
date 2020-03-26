import React, { useState, useEffect, useCallback } from "react";
import { useSelector, shallowEqual, connect } from "react-redux";
import { injectIntl, FormattedMessage } from "react-intl";
import { Paper } from "@material-ui/core";
import { Link } from "react-router-dom";
import useStyles from "../styles";

import AlertDialog from "../../../components/ui/Dialogs/AlertDialog";
import * as bids from "../../../store/ducks/bids.duck";
import Preloader from "../../../components/ui/Loaders/Preloader";
import BidTable from "./components/BidTable";
import { ErrorDialog, LoadError } from "../../../components/ui/Erros";

function MyBidsListPage({ intl, getMyBids, deleteBid, clearErrors }) {
  const classes = useStyles();
  const [deleteBidId, setDeleteBidId] = useState(-1);
  const [isAlertOpen, setAlertOpen] = useState(false);
  const handleDeleteDialiog = id => {
    setDeleteBidId(id);
    setAlertOpen(true);
  };
  const deleteBidAction = () => {
    setAlertOpen(false);
    deleteBid(deleteBidId, bids.bidTypes.MyBids);
  };
  const getMyBidsAction = useCallback(() => {
    getMyBids();
  }, [getMyBids]);

  useEffect(() => {
    getMyBidsAction();
  }, [getMyBidsAction]);
  const { myBids, user, loading, errors } = useSelector(
    ({ bids, auth }) => ({
      myBids: bids.myBids && bids.myBids.list,
      user: auth.user,
      loading: bids.myBids && bids.myBids.loading,
      errors: bids.errors || {},
    }),
    shallowEqual
  );
  if (loading) return <Preloader />;
  if (errors.my) return <LoadError handleClick={() => getMyBidsAction()} />;
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
      <div className={classes.tableFooterText}>{intl.formatMessage({ id: "BID.BOTTOM.TEXT" })}</div>
    </Paper>
  );
}

export default injectIntl(connect(null, bids.actions)(MyBidsListPage));
