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
import TopTableCell from "../../../../components/ui/Table/TopTableCell";
import { PortletHeaderTitle } from "../../../../../app/partials/content/Portlet";

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
  console.log(bids);
  return (
    <>
      {title && <PortletHeaderTitle className={classes.tableTitle}>{title}</PortletHeaderTitle>}
      {bids && bids.map && bids.length > 0 && (
        <Table aria-label="simple table" className={classes.table}>
          <TableHead>
            <TableRow>
              <TopTableCell>
                <FormattedMessage id="BIDSLIST.TABLE.ID" />
              </TopTableCell>
              <TopTableCell>
                <FormattedMessage id="BIDSLIST.TABLE.COST" />
              </TopTableCell>
              <TopTableCell>
                <FormattedMessage id="BIDSLIST.TABLE.FINAL_PRICE" />
              </TopTableCell>
              <TopTableCell>
                <FormattedMessage id="BIDSLIST.TABLE.VOLUME" />
              </TopTableCell>
              <TopTableCell>
                <FormattedMessage id="BIDSLIST.TABLE.AUTHOR" />
              </TopTableCell>
              <TopTableCell>
                <FormattedMessage id="BIDSLIST.TABLE.DESTINATION" />
              </TopTableCell>
              <TopTableCell>
                <FormattedMessage id="BIDSLIST.TABLE.ACTIONS" />
              </TopTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bids.map(bid => (
              <TableRow key={bid.id}>
                <TableCell>{bid.id}</TableCell>
                <TableCell>{bid.price}</TableCell>
                <TableCell>{bid.price_with_delivery || "-"}</TableCell>
                <TableCell>{bid.volume}</TableCell>
                <TableCell>
                  <div>
                    <div>{`${bid.vendor.fio || ""}`}</div>
                  </div>
                </TableCell>
                <TableCell>{bid.distance || "-"}</TableCell>

                <TableCell>
                  <Link to={`/bid/view/${bid.id}/${addUrl || ""}`}>
                    <IconButton size="medium" color="primary">
                      <VisibilityIcon />
                    </IconButton>
                  </Link>
                  {isHaveRules(user, bid.vendor.id) && (
                    <>
                      <Link to={`/bid/edit/${bid.id}/${addUrl || ""}`}>
                        <IconButton size="medium" color="primary">
                          {isHaveRules(user, bid.vendor.id) ? <EditIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </Link>
                      <IconButton
                        size="medium"
                        onClick={() => handleDeleteDialiog(bid.id)}
                        color="secondary"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </>
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
