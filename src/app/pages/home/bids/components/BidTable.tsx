import React, { useEffect, useState } from "react";
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
  Tooltip,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { useHistory } from "react-router-dom";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import VisibilityIcon from "@material-ui/icons/Visibility";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import ReportProblemIcon from "@material-ui/icons/ReportProblem";
import ArchiveIcon from "@material-ui/icons/Archive";
import UnarchiveIcon from "@material-ui/icons/Unarchive";

import TopTableCell from "../../../../components/ui/Table/TopTableCell";
import { IBid, IProfit } from "../../../../interfaces/bids";
import { IUser } from "../../../../interfaces/users";
import { TablePaginator2 } from "../../../../components/ui/Table/TablePaginator2";
import { accessByRoles } from "../../../../utils/utils";
import MiniTrafficLight from "../../users/components/miniTrafficLight/MiniTrafficLight";
import { ICrop } from "../../../../interfaces/crops";
import { ActionWithPayload } from "../../../../utils/action-helper";
import EmailIcon from "@material-ui/icons/Email";
import { useSnackbar } from "notistack";
import SubDialog from "../../../../components/ui/Dialogs/SubscribeDialog";

interface IProps {
  intl: any;
  classes: any;
  bids: IBid[] | undefined;
  isHaveRules?: (user: any, id: number) => boolean;
  handleDeleteDialiog: (id: number) => void;
  user: IUser;
  title?: string;
  paginationData?: { page: number; perPage: number; total: number };
  fetcher?: (page: number, perPage: number) => void;
  filter?: any;
  loading: boolean;
  addUrl?: string;
  salePurchaseMode?: "sale" | "purchase";
  bestAllMyMode?: "best-bids" | "all-bids" | "my-bids" | "edit";
  crops: ICrop[] | undefined;
  setProfit: (
    profit: IProfit
  ) => ActionWithPayload<
    "bids/SET_PROFIT",
    {
      profit: IProfit;
    }
  >;
  archive?: ({ id, is_archived }: { id: number; is_archived: boolean }) => void;

  post?: any;
  clearPost?: any;
  postLoading?: boolean;
  postSuccess?: boolean;
  postError?: string | null;
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
  filter,
  salePurchaseMode,
  bestAllMyMode,
  crops,
  setProfit,
  archive,

  post,
  clearPost,
  postLoading,
  postSuccess,
  postError,
}) => {
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const [clientWidth, setClientWidth] = useState(document.body.clientWidth);
  const [hasActivePoints, setHasActivePoints] = useState(false);
  const [subDialogOpen, setSubDialogOpen] = useState(false);

  const updateWindowDimensions = () => {
    setClientWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", updateWindowDimensions);
    return () => {
      window.removeEventListener("resize", updateWindowDimensions);
    };
  }, []);

  useEffect(() => {
    if (user.points.find(el => el.active)) {
      setHasActivePoints(true);
    } else {
      setHasActivePoints(false);
    }
  }, [user.points]);

  useEffect(() => {
    if (postSuccess || postError) {
      enqueueSnackbar(
        postSuccess
          ? intl.formatMessage({ id: "NOTISTACK.ERRORS.SAVE_FILTER" })
          : `${intl.formatMessage({ id: "NOTISTACK.ERRORS.ERROR" })} ${postError}`,
        {
          variant: postSuccess ? "success" : "error",
        }
      );
      clearPost();
    }
  }, [clearPost, postError, postSuccess, enqueueSnackbar, intl]);

  const [isSendingEmail, setSendingEmail] = useState(true);
  const [isSendingSms, setSendingSms] = useState(false);
  const [openedSubBidId, setOpenedSubBidId] = useState<number | null>(null);

  const onCheckboxChange = (e: any, val: number) => {
    if (val === 1) setSendingEmail(!isSendingEmail);
    if (val === 2) setSendingSms(!isSendingSms);
  };

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
        <div className={classes.table}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow className={classes.mobileHide}>
                {clientWidth > 1024 && accessByRoles(user, ["ROLE_ADMIN", "ROLE_MANAGER"]) && (
                  <TopTableCell>
                    <FormattedMessage id="BIDSLIST.TABLE.ID" />
                  </TopTableCell>
                )}
                {bestAllMyMode === "my-bids" && (
                  <TopTableCell>
                    <FormattedMessage id="BIDSLIST.TABLE.CROP" />
                  </TopTableCell>
                )}
                {(bestAllMyMode === "edit" || bestAllMyMode === "all-bids") && (
                  <TopTableCell>
                    <FormattedMessage id="BIDSLIST.TABLE.CROP" />
                  </TopTableCell>
                )}
                <TopTableCell>
                  <FormattedMessage
                    id={
                      user.is_buyer ? "BIDSLIST.TABLE.COST.sale" : user.is_vendor ? "BIDSLIST.TABLE.COST.purchase" : "BIDSLIST.TABLE.COST"
                    }
                  />
                </TopTableCell>

                {bestAllMyMode !== "my-bids" && bestAllMyMode !== "all-bids" && hasActivePoints && (
                  <TopTableCell>{bestAllMyMode !== "edit" ? <FormattedMessage id="BIDSLIST.TABLE.FINAL_PRICE" /> : null}</TopTableCell>
                )}

                {bestAllMyMode !== "my-bids" &&
                  accessByRoles(user, ["ROLE_ADMIN", "ROLE_MANAGER", "ROLE_TRADER"]) &&
                  bestAllMyMode !== "all-bids" && (
                    <TopTableCell>{bestAllMyMode !== "edit" ? <FormattedMessage id="BIDSLIST.TABLE.PROFIT" /> : null}</TopTableCell>
                  )}
                <TopTableCell>
                  <FormattedMessage id="BIDSLIST.TABLE.VOLUME" />
                </TopTableCell>
                {clientWidth > 1024 && bestAllMyMode !== "my-bids" && (
                  <TopTableCell>
                    {bestAllMyMode !== "edit" ? (
                      <>
                        {salePurchaseMode === "sale" ? (
                          <FormattedMessage id="BIDSLIST.TABLE.AUTHOR" />
                        ) : (
                          <FormattedMessage id="BIDSLIST.TABLE.BUYER" />
                        )}
                      </>
                    ) : null}
                  </TopTableCell>
                )}
                {bestAllMyMode === "my-bids" && (
                  <>
                    <TopTableCell>
                      {salePurchaseMode === "sale" ? (
                        <FormattedMessage id="PROFILE.INPUT.LOCATION.SALE" />
                      ) : (
                        <FormattedMessage id="PROFILE.INPUT.LOCATION.PURCHASE" />
                      )}
                    </TopTableCell>

                    <TopTableCell>
                      <FormattedMessage id="PROFILE.INPUT.STATUS.HEADER" />
                    </TopTableCell>
                  </>
                )}
                {bestAllMyMode === "all-bids" && (
                  <>
                    <TopTableCell>
                      {salePurchaseMode === "sale" ? (
                        <FormattedMessage id="PROFILE.INPUT.LOCATION.SALE" />
                      ) : (
                        <FormattedMessage id="PROFILE.INPUT.LOCATION.PURCHASE" />
                      )}
                    </TopTableCell>
                  </>
                )}
                {bestAllMyMode !== "my-bids" &&
                  bestAllMyMode !== "all-bids" &&
                  (clientWidth > 1024 || (clientWidth <= 1024 && accessByRoles(user, ["ROLE_BUYER", "ROLE_VENDOR"]))) && (
                    <TopTableCell>{bestAllMyMode !== "edit" ? <FormattedMessage id="BIDSLIST.TABLE.DESTINATION" /> : null}</TopTableCell>
                  )}
                {salePurchaseMode === "purchase" && (
                  <TopTableCell>
                    <FormattedMessage id="BIDSLIST.TABLE.TIME" />
                  </TopTableCell>
                )}

                <TopTableCell></TopTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bids.map(bid => (
                <TableRow
                  key={bid.id}
                  style={{
                    backgroundColor: `${bestAllMyMode === "best-bids" && bid.is_pro ? "rgba(10, 187, 135, 0.1)" : ""}`,
                  }}
                >
                  {clientWidth > 1024 && accessByRoles(user, ["ROLE_ADMIN", "ROLE_MANAGER"]) && <TableCell>{bid.id}</TableCell>}
                  {bestAllMyMode === "my-bids" && <TableCell>{crops?.find(crop => crop.id === bid.crop_id)?.name || ""}</TableCell>}

                  {(bestAllMyMode === "edit" || bestAllMyMode === "all-bids") && bids && crops && (
                    <TableCell>{crops?.find(crop => crop.id === bid.crop_id)?.name || ""}</TableCell>
                  )}

                  <TableCell>
                    <div style={{ display: "flex", flexDirection: "row", flexWrap: "nowrap" }}>
                      {bestAllMyMode === "my-bids" && bid?.vendor_use_vat !== bid?.vendor?.use_vat && (
                        <Tooltip
                          title={intl.formatMessage({
                            id: "BID.PRICE.ERROR",
                          })}
                        >
                          <ReportProblemIcon color="error" style={{ marginRight: 4, width: 16, height: 16, alignSelf: "center" }} />
                        </Tooltip>
                      )}

                      {salePurchaseMode === "sale" ? (
                        <>
                          {bid.price ? (
                            <>
                              {/*Если покупатель работает с НДС, а объявление продавца было установлено без работы с ндс, то мы добавляем +10 процент*/}
                              {user.use_vat && !bid.vendor_use_vat && (
                                <div>
                                  <p style={{ marginBottom: "1px" }}>{!!bid && Math.round(bid.price * ((bid.vat || 0) / 100 + 1))}</p>
                                  <p style={{ marginBottom: 0, color: "#999999", fontSize: "10px" }}>
                                    {`${bid.price && Math.round(bid.price)} + ${bid.vat}% НДС`}
                                  </p>
                                </div>
                              )}

                              {/*Если покупатель работает с НДС, а объявление продавца было установлено, когда он работал с НДС*/}
                              {user.use_vat && bid.vendor_use_vat && (
                                <div>
                                  {Math.round(bid.price)} <br />
                                  <p style={{ marginBottom: 0, color: "#999999", fontSize: "10px" }}>С НДС</p>
                                </div>
                              )}

                              {/*Когда покупатель не работает с НДС, а у продавца установлено объявление, когда тот не работал с НДС*/}
                              {!user.use_vat && !bid.vendor_use_vat && (
                                <div>
                                  {Math.round(bid.price)} <br />
                                  <p style={{ marginBottom: 0, color: "#999999", fontSize: "10px" }}>БЕЗ НДС</p>
                                </div>
                              )}

                              {/*Когда покупатель не работает с НДС, а у продавец выставил объявление работая с НДС*/}
                              {!user.use_vat && bid.vendor_use_vat && (
                                <div>
                                  {Math.round(bid.price)} <br />
                                  <p style={{ marginBottom: 0, color: "#999999", fontSize: "10px" }}>С НДС</p>
                                </div>
                              )}
                            </>
                          ) : (
                            <>-</>
                          )}
                        </>
                      ) : (
                        <div>{bid.price ? Math.round(bid.price) : "-"}</div>
                      )}
                    </div>
                  </TableCell>

                  {bestAllMyMode !== "my-bids" && bestAllMyMode !== "all-bids" && hasActivePoints && (
                    <TableCell>
                      {bestAllMyMode !== "edit"
                        ? bid?.price_with_delivery_with_vat
                          ? Math.round(bid.price_with_delivery_with_vat)
                          : "-"
                        : null}
                    </TableCell>
                  )}

                  {bestAllMyMode !== "my-bids" &&
                    accessByRoles(user, ["ROLE_ADMIN", "ROLE_MANAGER", "ROLE_TRADER"]) &&
                    bestAllMyMode !== "all-bids" && (
                      <TableCell>
                        {bestAllMyMode !== "edit" ? (
                          <Grid container direction="column" justify="center" alignItems="flex-start">
                            {!!bid?.point_prices && !!bid.point_prices.length
                              ? bid.point_prices.map(
                                  (item, i) =>
                                    i === 0 &&
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
                                )
                              : "-"}
                          </Grid>
                        ) : null}
                      </TableCell>
                    )}
                  <TableCell>{bid.volume}</TableCell>
                  {clientWidth > 1024 && bestAllMyMode !== "my-bids" && (
                    <TableCell>
                      {bestAllMyMode !== "edit" ? (
                        <Grid container direction="column" justify="center" alignItems="flex-start">
                          <div className={classes.flexRow}>
                            {!!bid?.vendor && (bid.vendor.company_confirmed_by_payment || bid.vendor.company_confirmed_by_email) ? (
                              <Tooltip
                                title={intl.formatMessage({
                                  id: "USERLIST.TOOLTIP.COMPANY",
                                })}
                              >
                                <CheckCircleOutlineIcon color="secondary" style={{ marginRight: 4, width: 16, height: 16 }} />
                              </Tooltip>
                            ) : (
                              <Tooltip
                                title={intl.formatMessage({
                                  id: "USERLIST.TOOLTIP.NO_COMPANY",
                                })}
                              >
                                <ReportProblemIcon color="error" style={{ marginRight: 4, width: 16, height: 16 }} />
                              </Tooltip>
                            )}
                            <div>{`${bid.vendor.fio || bid.vendor.login || ""}`}</div>
                          </div>
                          {bid.vendor.company && (
                            <div className={classes.flexRow} style={{ marginTop: 10 }}>
                              {bid?.vendor?.company_confirmed_by_payment &&
                              !!bid?.vendor?.company?.colors &&
                              bid.vendor.company.colors.length > 0 ? (
                                <MiniTrafficLight intl={intl} colors={bid.vendor.company.colors} />
                              ) : (
                                <div style={{ width: 20, flex: "none" }}></div>
                              )}
                              <div>{`${bid.vendor.company.short_name || ""}`}</div>
                            </div>
                          )}
                        </Grid>
                      ) : null}
                    </TableCell>
                  )}
                  {bestAllMyMode !== "my-bids" &&
                    bestAllMyMode !== "all-bids" &&
                    (clientWidth > 1024 || (clientWidth <= 1024 && accessByRoles(user, ["ROLE_BUYER", "ROLE_VENDOR"]))) && (
                      <TableCell>{bestAllMyMode !== "edit" ? bid.distance || "-" : null}</TableCell>
                    )}

                  {(bestAllMyMode === "my-bids" || bestAllMyMode === "all-bids") && <TableCell>{bid?.location?.text}</TableCell>}

                  {bestAllMyMode === "my-bids" && (
                    <TableCell>
                      {intl.formatMessage({
                        id: bid?.is_archived ? "PROFILE.INPUT.STATUS_ARCHIVED" : "PROFILE.INPUT.STATUS_ACTIVE",
                      })}
                    </TableCell>
                  )}

                  {salePurchaseMode === "purchase" && <TableCell>{bid.payment_term || "-"}</TableCell>}

                  <TableCell align="right">
                    <div style={{ minWidth: 150 }}>
                      {bestAllMyMode !== "my-bids" && (
                        <>
                          {user && ["ROLE_ADMIN", "ROLE_MANAGER"].includes(user.roles[0]) && bestAllMyMode === "edit" && (
                            <IconButton size="medium" color="primary">
                              <EmailIcon
                                onClick={() => {
                                  setSubDialogOpen(true);
                                  setOpenedSubBidId(bid.id);
                                }}
                              />
                            </IconButton>
                          )}
                          <IconButton
                            size="medium"
                            color="primary"
                            onClick={() => {
                              let maxProfit = 0;
                              if (bid?.point_prices && bid?.point_prices.length) {
                                maxProfit = bid?.point_prices[0]?.profit;
                                bid.point_prices.forEach(item => {
                                  if (item.profit && item.profit > maxProfit) {
                                    maxProfit = item.profit;
                                  }
                                });
                              }
                              maxProfit = Math.round(maxProfit);
                              setProfit({
                                bid_id: bid.id,
                                value: maxProfit || 0,
                              });
                              history.push(
                                ["ROLE_ADMIN", "ROLE_MANAGER"].includes(user.roles[0]) && bestAllMyMode === "edit"
                                  ? `/bid/edit/${bid.type}/${bid.id}/${bid.crop_id}`
                                  : `/bid/view/${bid.type}/${bid.id}/${bid.crop_id}`
                              );
                            }}
                          >
                            {user && ["ROLE_ADMIN", "ROLE_MANAGER"].includes(user.roles[0]) && bestAllMyMode === "edit" ? (
                              <EditIcon />
                            ) : (
                              <VisibilityIcon />
                            )}
                          </IconButton>
                        </>
                      )}
                      {bestAllMyMode === "my-bids" && (
                        <Tooltip title={bid.is_archived ? "убрать с архива" : "добавить в архив"}>
                          <IconButton
                            size="medium"
                            color={bid.is_archived ? "secondary" : "primary"}
                            onClick={() => {
                              if (archive) {
                                archive({ id: bid.id, is_archived: !bid.is_archived });
                              }
                            }}
                          >
                            {bid.is_archived ? <UnarchiveIcon /> : <ArchiveIcon />}
                          </IconButton>
                        </Tooltip>
                      )}
                      {isHaveRules && isHaveRules(user, bid.vendor.id) && (
                        <>
                          <IconButton
                            size="medium"
                            color="primary"
                            onClick={() => history.push(`/bid/edit/${bid.type}/${bid.id}/${bid.crop_id}`)}
                          >
                            {isHaveRules && isHaveRules(user, bid.vendor.id) ? <EditIcon /> : <VisibilityIcon />}
                          </IconButton>
                          <IconButton size="medium" onClick={() => handleDeleteDialiog(bid.id)} color="secondary">
                            <DeleteIcon />
                          </IconButton>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              <SubDialog
                handleClose={() => {
                  setSubDialogOpen(false);
                  setOpenedSubBidId(null);
                }}
                isOpen={subDialogOpen}
                handleSubmit={() => {
                  if (openedSubBidId) {
                    post({
                      id: openedSubBidId,
                      is_sending_email: isSendingEmail ? 1 : 0,
                      is_sending_sms: isSendingSms ? 1 : 0,
                    });
                  }
                  setSubDialogOpen(false);
                  setOpenedSubBidId(null);
                }}
                disabledSubmit={!isSendingEmail && !isSendingSms}
              >
                <FormControlLabel
                  control={<Checkbox checked={isSendingEmail} onChange={e => onCheckboxChange(e, 1)} />}
                  label={"Подписка по e-mail"}
                />
                <FormControlLabel
                  control={<Checkbox checked={isSendingSms} onChange={e => onCheckboxChange(e, 2)} />}
                  label={"Подписка по смс"}
                />
              </SubDialog>
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
        </div>
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
