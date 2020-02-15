import React, { useEffect } from "react";
import { injectIntl, FormattedMessage } from "react-intl";
import { connect, useSelector, shallowEqual } from "react-redux";
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableRow, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import * as ads from "../../../store/ducks/ads.duck";
import { getBestAds } from "../../../crud/ads.crud";
import useStyles from './styles';

function BidsListPage({ setBestAds }) {
  const { ads } = useSelector(({ ads }) => ({ ads: ads.bestAds }), shallowEqual);
  const classes = useStyles();
  const getAdsAction = () => {
    getBestAds().then(({ data }) => {
      data && data.data && setBestAds(data.data);
    }).catch( error => console.log('adsError', error));
  };
  useEffect(() => {
    getAdsAction();
  }, []);
  return (
    <Paper className={classes.tableContainer}>
      <div className={classes.buttonContainer}>
        <Link to="/bid/create" >
          <button className={"btn btn-primary btn-elevate kt-login__btn-primary"}>
            <FormattedMessage id="BIDSLIST.BUTTON.CREATE_BID" />
          </button>
        </Link>
      </div>
      <Table aria-label="simple table">
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
          </TableRow>
        </TableHead>
        <TableBody>
          {ads.map(ad => (
            <TableRow key={ad.id}>
              <TableCell>{ad.id}</TableCell>
              <TableCell>{ad.price}</TableCell>
              <TableCell>{ad.volume}</TableCell>
              <TableCell>{ad.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

export default injectIntl(connect(null, ads.actions)(BidsListPage));
