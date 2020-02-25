import React from "react";
import { injectIntl, FormattedMessage } from "react-intl";
import { Table, TableHead, TableRow, TableCell, TableBody, IconButton } from "@material-ui/core";
import { Link } from "react-router-dom";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import VisibilityIcon from "@material-ui/icons/Visibility";

function BidTable({ intl, classes, ads, isHaveRules, handleDeleteDialiog, user }) {
  return (
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
            <FormattedMessage id="BIDSLIST.TABLE.DESTINATION" />
          </TableCell>
          <TableCell>
            <FormattedMessage id="BIDSLIST.TABLE.FINAL_PRICE" />
          </TableCell>
          <TableCell>
            <FormattedMessage id="BIDSLIST.TABLE.ACTIONS" />
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {ads &&
          ads.map &&
          ads.map(ad => (
            <TableRow key={ad.id}>
              <TableCell>{ad.id}</TableCell>
              <TableCell>{ad.price}</TableCell>
              <TableCell>{ad.volume}</TableCell>
              <TableCell>{ad.description}</TableCell>
              <TableCell>{ad.distance || "-"}</TableCell>
              <TableCell>{ad.price_with_delivery || "-"}</TableCell>
              <TableCell>
                <Link to={`/bid/edit/${ad.id}`}>
                  <IconButton size="small">
                    {isHaveRules(user, ad.vendor.id) ? <EditIcon /> : <VisibilityIcon />}
                  </IconButton>
                </Link>
                {isHaveRules(user, ad.vendor.id) && (
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteDialiog(ad.id)}
                    color="secondary"
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}

export default injectIntl(BidTable);
