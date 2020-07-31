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
  salePurchaseMode?: "sale" | "purchase";
  bestAllMyMode?: "best-bids" | "all-bids" | "my-bids";
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
  salePurchaseMode,
  bestAllMyMode,
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
              {salePurchaseMode === "sale" && (
                <TopTableCell>
                  <FormattedMessage id="BIDSLIST.TABLE.PROFIT" />
                </TopTableCell>
              )}
              <TopTableCell>
                <FormattedMessage id="BIDSLIST.TABLE.VOLUME" />
              </TopTableCell>
              <TopTableCell>
                {salePurchaseMode === "sale" ? (
                  <FormattedMessage id="BIDSLIST.TABLE.AUTHOR" />
                ) : (
                  <FormattedMessage id="BIDSLIST.TABLE.BUYER" />
                )}
              </TopTableCell>
              <TopTableCell>
                <FormattedMessage id="BIDSLIST.TABLE.DESTINATION" />
              </TopTableCell>
              <TopTableCell></TopTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bids.map(bid => (
              <TableRow
                key={bid.id}
                style={{
                  backgroundColor: `${
                    bestAllMyMode === "best-bids" && bid.tariff.name !== "Стандартный"
                      ? "rgba(10, 187, 135, 0.1)"
                      : ""
                  }`,
                }}
              >
                <TableCell>{bid.id}</TableCell>
                <TableCell>
                  {!!user &&
                  user.use_vat &&
                  salePurchaseMode === "sale" &&
                  !!bid &&
                  !!bid.vat &&
                  !bid.vendor.use_vat ? (
                    !bid.price ? (
                      "-"
                    ) : (
                      <>
                        <p style={{ marginBottom: "1px" }}>
                          {!!bid && Math.round(bid.price * (bid.vat / 100 + 1))}
                        </p>
                        <p style={{ marginBottom: 0, color: "#999999", fontSize: "10px" }}>
                          {`${bid.price && Math.round(bid.price)} + ${bid.vat}% НДС`}
                        </p>
                      </>
                    )
                  ) : bid.price ? (
                    Math.round(bid.price)
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>
                  {!!user && user.use_vat && !!bid && !!bid.vat && !bid.vendor.use_vat
                    ? !bid.price
                      ? "-"
                      : salePurchaseMode === "sale"
                      ? !!bid && Math.round(bid.price * (bid.vat / 100 + 1) + bid.price_delivery)
                      : !!bid && Math.round(bid.price * (bid.vat / 100 + 1) - bid.price_delivery)
                    : bid.price
                    ? salePurchaseMode === "sale"
                      ? Math.round(bid.price + bid.price_delivery)
                      : Math.round(bid.price - bid.price_delivery)
                    : "-"}
                </TableCell>
                {salePurchaseMode === "sale" && (
                  <TableCell>
                    <Grid container direction="column" justify="center" alignItems="flex-start">
                      {bid.point_prices.map(
                        (item, i) =>
                          !!item.profit &&
                          (i === 0 ? (
                            <div key={i}>
                              <strong>{Math.round(item.profit)}</strong>
                              {` • ${item.point.name}`}
                            </div>
                          ) : (
                            <div key={i}>
                              {Math.round(item.profit)}
                              {` • ${item.point.name}`}
                            </div>
                          ))
                      )}
                    </Grid>
                  </TableCell>
                )}
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
                    onClick={() => history.push(`/bid/view/${bid.type}/${bid.id}/${bid.crop_id}`)}
                  >
                    <VisibilityIcon />
                  </IconButton>
                  {isHaveRules(user, bid.vendor.id) && (
                    <>
                      <IconButton
                        size="medium"
                        color="primary"
                        onClick={() =>
                          history.push(`/bid/edit/${bid.type}/${bid.id}/${bid.crop_id}`)
                        }
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
