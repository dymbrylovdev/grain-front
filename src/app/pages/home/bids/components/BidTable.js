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
  Grid,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import VisibilityIcon from "@material-ui/icons/Visibility";
import Footer from "../../../../components/ui/Table/TableFooter";
import TopTableCell from "../../../../components/ui/Table/TopTableCell";
import { PortletHeaderTitle } from "../../../../../app/partials/content/Portlet";
import { Skeleton } from "@material-ui/lab";

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
  loading,
}) {
  //const fromAdmin = addUrl === "fromAdmin";

  return (
    <>
      {title && <PortletHeaderTitle className={classes.tableTitle}>{title}</PortletHeaderTitle>}
      {loading ? (
        <div style={{ marginTop: -24 }}>
          <Skeleton width="100%" height={100} animation="wave" />
          <Skeleton width="100%" height={30} animation="wave" />
          <Skeleton width="100%" height={30} animation="wave" />
          <Skeleton width="100%" height={30} animation="wave" />
        </div>
      ) : (
        bids &&
        bids.map &&
        bids.length > 0 && (
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
                    <Grid container direction="column" justify="center" alignItems="flex-start">
                      <div>{`${bid.vendor.fio || ""}`}</div>
                      {bid.vendor.company && (
                        <div style={{ marginTop: 10 }}>{`${bid.vendor.company.short_name ||
                          ""}`}</div>
                      )}
                    </Grid>
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
        )
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
