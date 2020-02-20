import React, { useEffect, useState } from "react";
import { injectIntl, FormattedMessage } from "react-intl";
import { connect, useSelector, shallowEqual } from "react-redux";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  IconButton
} from "@material-ui/core";
import VisibilityIcon from "@material-ui/icons/Visibility";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import AlertDialog from "../../../components/ui/Dialogs/AlertDialog";
import * as ads from "../../../store/ducks/ads.duck";
import { getBestAds, deleteAd } from "../../../crud/ads.crud";
import useStyles from "../styles";

const isHaveRules = (user, id) => {
  return user.is_admin || user.id === Number.parseInt(id);
};

function BidsListPage({ setBestAds, deleteAdSuccess, intl }) {
  const { ads, user } = useSelector(
    ({ ads, auth }) => ({ ads: ads.bestAds, user: auth.user }),
    shallowEqual
  );
  console.log('myUser', user);
  const [deleteBidId, setDeleteBidId] = useState(-1);
  const [isAlertOpen, setAlertOpen] = useState(false);
  const handleDeleteDialiog = id => {
    setDeleteBidId(id);
    setAlertOpen(true);
  };
  const classes = useStyles();
  const getAdsAction = () => {
    getBestAds()
      .then(({ data }) => {
        data && data.data && setBestAds(data.data);
      })
      .catch(error => console.log("adsError", error));
  };
  useEffect(() => {
    getAdsAction();
  }, []);
  const deleteBidAction = () => {
    setAlertOpen(false);
    deleteAd(deleteBidId)
      .then(() => {
        deleteAdSuccess(deleteBidId);
      })
      .catch(error => {
        console.log("deleteUserError", error);
      });
  };
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
      <div className={classes.buttonContainer}>
        <Link to="/bid/create">
          <button className={"btn btn-primary btn-elevate kt-login__btn-primary"}>
            <FormattedMessage id="BIDSLIST.BUTTON.CREATE_BID" />
          </button>
        </Link>
      </div>
      <Table aria-label="simple table" className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>
              <FormattedMessage id="BIDSLIST.TABLE.ID" />
            </TableCell>
            <TableCell>
              <FormattedMessage id="BIDSLIST.TABLE.COST" />
            </TableCell>
            <TableCell>
              <FormattedMessage id="BIDSLIST.TABLE.VOLUME" />
            </TableCell>
            <TableCell>
              <FormattedMessage id="BIDSLIST.TABLE.DESCRIPTION" />
            </TableCell>
            <TableCell>
              <FormattedMessage id="BIDSLIST.TABLE.ACTIONS" />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {ads.map(ad => (
            <TableRow key={ad.id}>
              <TableCell>{ad.id}</TableCell>
              <TableCell>{ad.price}</TableCell>
              <TableCell>{ad.volume}</TableCell>
              <TableCell>{ad.description}</TableCell>
              <TableCell>
                <Link to={`/bid/edit/${ad.id}`}>
                  <IconButton size="small">
                    {isHaveRules(user, ad.vendor.id) ? <EditIcon /> : <VisibilityIcon />}
                  </IconButton>
                </Link>
                {isHaveRules(user, ad.vendor.id) && (
                  <IconButton size="small" onClick={() => handleDeleteDialiog(ad.id)} color="secondary">
                    <DeleteIcon />
                  </IconButton>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

export default injectIntl(connect(null, ads.actions)(BidsListPage));
