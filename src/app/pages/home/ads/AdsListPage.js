import React, { useEffect } from "react";
import { injectIntl, FormattedMessage } from "react-intl";
import { connect, useSelector, shallowEqual } from "react-redux";
import { Table, TableBody, TableCell, TableHead, TableRow, Paper } from "@material-ui/core";
import * as ads from "../../../store/ducks/ads.duck";
import { getBestAds } from "../../../crud/ads.crud";

function AdsListPage({ setBestAds }) {
  const { ads } = useSelector(({ ads }) => ({ ads: ads.bestAds }), shallowEqual);
  const getAdsAction = () => {
    getBestAds().then(({ data }) => {
      console.log("myBestAds", data);
      data && data.data && setBestAds(data.data);
    }).catch( error => console.log('adsError', error));
  };
  useEffect(() => {
    getAdsAction();
  }, []);
  return (
    <Paper>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>
              <FormattedMessage id="ADSLIST.TABLE.ID" />
            </TableCell>
            <TableCell>
              <FormattedMessage id="ADSLIST.TABLE.COST" />
            </TableCell>
            <TableCell>
              <FormattedMessage id="ADSLIST.TABLE.VOLUME" />
            </TableCell>
            <TableCell>
              <FormattedMessage id="ADSLIST.TABLE.DESCRIPTION" />
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

export default injectIntl(connect(null, ads.actions)(AdsListPage));
