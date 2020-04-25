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
  TableFooter,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import VisibilityIcon from "@material-ui/icons/Visibility";

import TopTableCell from "../../../../components/ui/Table/TopTableCell";

import { Skeleton } from "@material-ui/lab";
import { IBid } from "../../../../interfaces/bids";
import { IUser } from "../../../../interfaces/users";
import { TablePaginator2 } from "../../../../components/ui/Table/TablePaginator2";

interface IProps {
  intl: any;
  classes: any;
  bids: IBid[] | undefined;
  isHaveRules: (user: any, id: number) => boolean;
  handleDeleteDialiog: (id: number) => void;
  user: IUser;
  title?: string;
  paginationData?: { page: number; perPage: number; total: number };
  fetcher?: (page: number, perPage: number) => void;
  loading: boolean;
  addUrl?: string;
}

const BidTable: React.FC<IProps> = ({
  intl,
  classes,
  bids,
  isHaveRules,
  handleDeleteDialiog,
  user,
  title,
  paginationData,
  loading,
  fetcher,
  addUrl,
}) => {
  const history = useHistory();
  return (
    <>
      <div className={classes.tableTitle}>{title || ""}</div>
      {loading || !bids ? (
        <div style={{ marginTop: -24 }}>
          <Skeleton width="100%" height={100} animation="wave" />
          <Skeleton width="100%" height={30} animation="wave" />
          <Skeleton width="100%" height={30} animation="wave" />
          <Skeleton width="100%" height={30} animation="wave" />
        </div>
      ) : bids.length > 0 ? (
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
              <TopTableCell></TopTableCell>
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

                <TableCell align="right">
                  <IconButton
                    size="medium"
                    color="primary"
                    onClick={() => history.push(`/bid/view/${bid.id}/${addUrl || ""}`)}
                  >
                    <VisibilityIcon />
                  </IconButton>
                  {isHaveRules(user, bid.vendor.id) && (
                    <>
                      <IconButton
                        size="medium"
                        color="primary"
                        onClick={() => history.push(`/bid/edit/${bid.id}/${addUrl || ""}`)}
                      >
                        {isHaveRules(user, bid.vendor.id) ? <EditIcon /> : <VisibilityIcon />}
                      </IconButton>
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
          {!!paginationData && !!fetcher && (
            <TableFooter>
              <TableRow>
                <TablePaginator2
                  page={paginationData.page}
                  realPerPage={bids.length}
                  perPage={paginationData.perPage}
                  total={paginationData.total}
                  fetchRows={(page: number, perPage: number) => fetcher(page, perPage)}
                />
              </TableRow>
            </TableFooter>
          )}
        </Table>
      ) : (
        <>
          <div className={classes.emptyTitle}>{intl.formatMessage({ id: "BIDLIST.NO_BIDS" })}</div>
          <Divider />
        </>
      )}
    </>
  );
};

export default injectIntl(BidTable);
