import React, { useCallback, useEffect, useMemo, useState } from "react";
import { injectIntl } from "react-intl";
import { Divider, FormControlLabel, Checkbox } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { useHistory } from "react-router-dom";

import { IBid, IProfit } from "../../../../interfaces/bids";
import { IUser } from "../../../../interfaces/users";
import { TablePaginator2 } from "../../../../components/ui/Table/TablePaginator2";
import { ICrop } from "../../../../interfaces/crops";
import { ActionWithPayload } from "../../../../utils/action-helper";
import { useSnackbar } from "notistack";
import SubDialog from "../../../../components/ui/Dialogs/SubscribeDialog";
import AlertDialog from "../../../../components/ui/Dialogs/AlertDialog";
import Bid from "./Bid";

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
  archive?: ({ id: number, is_archived: boolean }) => void;

  post?: any;
  clearPost?: any;
  postLoading?: boolean;
  postSuccess?: boolean;
  postError?: string | null;
}

const BidsList: React.FC<IProps> = ({
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
  const [showPhoneDialog, setShowPhoneDialog] = useState(false);
  const isBuyerTariff = useMemo(() => user.tariff_matrix.tariff.id !== 1, [user]);
  const [showsPhones, setShowsPhones] = useState<number[]>([]);

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
  }, [clearPost, postError, postSuccess, enqueueSnackbar]);

  const handleClickEditOrViewBid = useCallback(
    (bid: IBid) => {
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
    },
    [history, setProfit, user, bestAllMyMode]
  );

  const handleShowPhone = useCallback(
    (id: number) => {
      const isOpen = showsPhones.find(item => item === id);
      if (!isOpen) {
        isBuyerTariff ? setShowsPhones([...showsPhones, id]) : setShowPhoneDialog(true);
      }
    },
    [showsPhones, isBuyerTariff, setShowsPhones, setShowPhoneDialog]
  );

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
        <>
          {bids.map(bid => (
            <Bid
              key={bid.id}
              isHaveRules={isHaveRules}
              handleDeleteDialiog={handleDeleteDialiog}
              user={user}
              salePurchaseMode={salePurchaseMode}
              bestAllMyMode={bestAllMyMode}
              crops={crops}
              archive={archive}
              bid={bid}
              hasActivePoints={hasActivePoints}
              setSubDialogOpen={setSubDialogOpen}
              setOpenedSubBidId={setOpenedSubBidId}
              handleClickEditOrViewBid={handleClickEditOrViewBid}
              handleShowPhone={handleShowPhone}
              showsPhones={showsPhones}
            />
          ))}
          {!!paginationData && !!fetcher && (
            <TablePaginator2
              page={paginationData.page}
              realPerPage={bids.length}
              perPage={paginationData.perPage}
              total={paginationData.total}
              fetchRows={(page: number, perPage: number) => fetcher(page, perPage)}
            />
          )}
        </>
      ) : (
        <>
          <div className={classes.emptyTitle}>{intl.formatMessage({ id: "BIDLIST.NO_BIDS" })}</div>
          <Divider />
        </>
      )}
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
        <FormControlLabel control={<Checkbox checked={isSendingSms} onChange={e => onCheckboxChange(e, 2)} />} label={"Подписка по смс"} />
      </SubDialog>
      <AlertDialog
        isOpen={showPhoneDialog}
        text={`У вас "Бесплатный" тариф, чтобы увидеть номер телефона продавца, перейдите на премиум тариф`}
        okText={"Подключить тариф"}
        cancelText={"Отмена"}
        handleClose={() => setShowPhoneDialog(false)}
        handleAgree={() => history.push("/user/profile/tariffs")}
      />
    </>
  );
};

export default injectIntl(BidsList);
