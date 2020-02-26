import React from "react";
import { injectIntl, FormattedMessage } from "react-intl";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Divider,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import VisibilityIcon from "@material-ui/icons/Visibility";
import Footer from "../../../../components/ui/Table/TableFooter";

function BidTable({
  intl,
  classes,
  bids,
  isHaveRules,
  handleDeleteDialiog,
  user,
  title,
  addUrl,
  paginationData,
}) {
    const fromAdmin = addUrl === "fromAdmin";
  return (
    <>
      {title && <div className={classes.tableTitle}>{title}</div>}
      {bids && bids.map && bids.length > 0 && (
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
              {fromAdmin &&               <TableCell>
                <FormattedMessage id="BIDSLIST.TABLE.AUTHOR" />
              </TableCell>}
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
            {bids.map(bid => (
              <TableRow key={bid.id}>
                <TableCell>{bid.id}</TableCell>
                <TableCell>{bid.price}</TableCell>
                <TableCell>{bid.volume}</TableCell>
                <TableCell>{bid.description}</TableCell>
                {fromAdmin &&  <TableCell>{`${bid.vendor.login} ${bid.vendor.company}`}</TableCell>}
                <TableCell>{bid.distance || "-"}</TableCell>
                <TableCell>{bid.price_with_delivery || "-"}</TableCell>
                <TableCell>
                  <Link to={`/bid/edit/${bid.id}/${addUrl || ""}`}>
                    <IconButton size="small">
                      {isHaveRules(user, bid.vendor.id) ? <EditIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </Link>
                  {isHaveRules(user, bid.vendor.id) && (
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteDialiog(bid.id)}
                      color="secondary"
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          {paginationData && (
            <Footer
              page={paginationData.page - 1}
              perPage={paginationData.per_page || 0}
              total={paginationData.total || 0}
              handleChangePage={paginationData.handleChangePage}
              fromLabel={intl.formatMessage({ id: "TABLE.FROM.LABEL" })}
            />
          )}
        </Table>
      )}
      {(!bids || bids.length === 0) && (
        <>
          <div className={classes.emptyTitle}>{intl.formatMessage({ id: "BIDLIST.NO_BIDS" })}</div>
          <Divider />
        </>
      )}
    </>
  );
}

export default injectIntl(BidTable);
