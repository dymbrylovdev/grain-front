import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { injectIntl } from "react-intl";
import { Divider, FormControlLabel, Checkbox } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { useHistory } from "react-router-dom";
import { IBid, IProfit } from "../../../../interfaces/bids";
import { IUser } from "../../../../interfaces/users";
import { TablePaginator2 } from "../../../../components/ui/Table/TablePaginator2";
import { ICrop, ICropParam } from "../../../../interfaces/crops";
import { ActionWithPayload } from "../../../../utils/action-helper";
import { useSnackbar } from "notistack";
import SubDialog from "../../../../components/ui/Dialogs/SubscribeDialog";
import AlertDialog from "../../../../components/ui/Dialogs/AlertDialog";
import Bid from "./Bid";
import { ILocation } from "../../../../interfaces/locations";
import { distance } from "./BidForm";
import YaMapDialog from "./YaMapDialog";
import ImageDialog from "./imageDialog/imageDialog";

export interface ILocalBids {
  currentBid: IBid;
  useId: number;
  finalPrice: number;
  salePurchaseMode: "sale" | "purchase" | string;
  distance: any;
  userLocation?: {
    lat?: number;
    lng?: number;
  };
}

interface IProps {
  intl: any;
  classes: any;
  bids: IBid[] | undefined;
  isHaveRules?: (user?: any, id?: number) => boolean;
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
  toggleLocationsModal?: () => void;
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
  points?: ILocation[];
  numberParams?: ICropParam[];
  currentCropName?: string;
  guestPoint?: ILocation;
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
  points,
  numberParams,
  toggleLocationsModal,
  currentCropName,
  guestPoint,
}) => {
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const routeRef = useRef();
  const [clientWidth, setClientWidth] = useState(document.body.clientWidth);
  const [hasActivePoints, setHasActivePoints] = useState(false);
  const [subDialogOpen, setSubDialogOpen] = useState(false);
  const [showPhoneDialog, setShowPhoneDialog] = useState(false);
  const [showYaMap, setShowYaMap] = useState(false);
  const [ymaps, setYmaps] = useState<any>();
  const [map, setMap] = useState<any>();
  const [currentBid, setCurrentBid] = useState<IBid | null>(null);
  const [showPlacemark, setShowPlacemark] = useState(false);
  const [mySelectedMapPoint, setMySelectedMapPoint] = useState<ILocation | null>();
  const [currentMark, setCurrentMark] = useState<ILocalBids | null>(null);
  const isBuyerTariff = useMemo(() => user?.tariff_matrix?.tariff?.id !== 1, [user]);
  const [showsPhones, setShowsPhones] = useState<number[]>([]);
  const [isShowImage, setIsShowImage] = useState(false);
  const [changeStore, setChangeStore] = useState(false);
  const [currentImages, setCurrentImages] = useState({
    photos: [""],
    index: 0,
  });

  const updateWindowDimensions = () => {
    setClientWidth(window.innerWidth);
  };

  const mapState = useMemo(() => {
    if (currentBid && currentBid.location) {
      return { center: [currentBid.location.lat, currentBid.location.lng], zoom: 7, margin: [10, 10, 10, 10] };
    } else {
      return null;
    }
  }, [currentBid]);

  useEffect(() => {
    if (currentMark && currentBid) {
      if (localBids) {
        const existBidsIndex = localBids.findIndex(item => {
          if (user) {
            return item.useId === user.id && item.salePurchaseMode === salePurchaseMode && currentBid.id === item.currentBid.id;
          }
          return item.useId === 0 && item.salePurchaseMode === salePurchaseMode && currentBid.id === item.currentBid.id;
        });
        if (existBidsIndex > -1) {
          const newArr = localBids;
          newArr[existBidsIndex] = currentMark;
          localStorage.setItem("bids", JSON.stringify(newArr));
        } else {
          localStorage.setItem("bids", JSON.stringify([...localBids, currentMark]));
        }
      } else {
        localStorage.setItem("bids", JSON.stringify([currentMark]));
      }
    }
  }, [currentMark]);

  const localBids: ILocalBids[] | null = useMemo(() => {
    const storageBids = localStorage.getItem("bids");
    return storageBids ? JSON.parse(storageBids) : null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changeStore, bids, user, crops, showYaMap, currentBid, mySelectedMapPoint, ymaps, map, routeRef, salePurchaseMode]);

  useEffect(() => {
    window.addEventListener("resize", updateWindowDimensions);
    return () => {
      window.removeEventListener("resize", updateWindowDimensions);
    };
  }, []);

  const scrollPosition = useCallback(() => {
    const scrollBidList = localStorage.getItem("scrollBidList");
    const parseScroll = scrollBidList ? JSON.parse(scrollBidList) : null;
    if (
      parseScroll &&
      salePurchaseMode === parseScroll.salePurchaseMode &&
      currentCropName === parseScroll.currentCropName &&
      bestAllMyMode === parseScroll.bestAllMyMode
    ) {
      setTimeout(() => window.scrollTo(0, parseScroll.position), 1000);
      localStorage.removeItem("scrollBidList");
    }
  }, [currentCropName, bestAllMyMode, salePurchaseMode]);

  useEffect(() => {
    if (!loading || bids) {
      scrollPosition();
    }
  }, [loading, bids, salePurchaseMode, scrollPosition]);

  useEffect(() => {
    if (user?.points?.find(el => el.active)) {
      setHasActivePoints(true);
    } else {
      setHasActivePoints(false);
    }
  }, [user?.points]);

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

  useEffect(() => {
    if (points && currentBid && currentBid.location) {
      const locations = points && points.filter(el => el.active);
      const position = currentBid.location;
      if (locations.length > 0) {
        let closest = locations[0];
        let closestDistance = distance(closest, position);
        for (let i = 1; i < locations.length; i++) {
          if (distance(locations[i], position) < closestDistance) {
            closestDistance = distance(locations[i], position);
            closest = locations[i];
          }
        }
        setMySelectedMapPoint(closest);
      }
    } else if (!user) {
      setMySelectedMapPoint(guestPoint?.active ? guestPoint : null);
    }
  }, [currentBid, points, user, guestPoint]);

  useEffect(() => {
    if (ymaps && map && currentBid && currentBid.location && mySelectedMapPoint) {
      setShowPlacemark(false);
      addRoute(currentBid.location, mySelectedMapPoint);
    } else if (ymaps && map && currentBid && currentBid.location) {
      setShowPlacemark(true);
    }
  }, [ymaps, map, currentBid, mySelectedMapPoint]);

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
      localStorage.setItem(
        "scrollBidList",
        JSON.stringify({
          currentCropName,
          bestAllMyMode,
          salePurchaseMode,
          position: window.pageYOffset,
        })
      );
      history.push(
        ["ROLE_ADMIN", "ROLE_MANAGER"].includes(user?.roles[0]) && bestAllMyMode === "edit"
          ? `/bid/edit/${bid.type}/${bid.id}/${bid.crop_id}`
          : `/bid/view/${bid.type}/${bid.id}/${bid.crop_id}`
      );
    },
    [history, setProfit, user, bestAllMyMode, salePurchaseMode, currentCropName]
  );


  const handleShowImage = useCallback((index: number, photos?: string[]) => {
    setCurrentImages(state => ({
      photos: photos || state.photos,
      index: index,
    }));
    setIsShowImage(true);
  }, []);

  const handleArrowImage = useCallback(
    (operation: "prev" | "next") => {
      const maxIndex = currentImages.photos.length - 1;
      if (operation === "next") {
        setCurrentImages(state => ({
          photos: state.photos,
          index: currentImages.index === maxIndex ? 0 : currentImages.index + 1,
        }));
      }
      if (operation === "prev") {
        setCurrentImages(state => ({
          photos: state.photos,
          index: currentImages.index === 0 ? maxIndex : currentImages.index - 1,
        }));
      }
    },
    [currentImages]
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

  const getFinalPrice = useCallback((bid: IBid, distanceKm: number, pricePerKm: number, salePurchaseMode: string, vat: number) => {
    const newDistance = 100 > distanceKm ? 100 : distanceKm;
    if (salePurchaseMode === "sale") {
      return Math.round(bid.price * (vat / 100 + 1) + pricePerKm * newDistance);
    } else if (salePurchaseMode === "purchase") {
      return Math.round(bid.price - pricePerKm * newDistance);
    } else {
      return Math.round(bid.price * (vat / 100 + 1) - pricePerKm * newDistance);
    }
  }, []);

  const handleOpenMap = useCallback((bid: IBid) => {
    setShowYaMap(true);
    setCurrentBid(bid);
  }, []);

  const addRoute = useCallback(
    async (pointA: any, pointB: any) => {
      map.geoObjects.remove(routeRef.current);

      // create multiroute and add to the map
      const multiRoute = await ymaps.route([pointA.text, pointB.text], {
        multiRoute: true,
        mapStateAutoApply: true,
      });
      routeRef.current = multiRoute;
      await map.geoObjects.add(multiRoute);

      // open active route balloon
      const routes = multiRoute.getRoutes();
      let newRoute: any = null;
      for (let i = 0, l = routes.getLength(); i < l; i++) {
        const route = routes.get(i);
        if (!route.properties.get("blocked")) {
          if (!newRoute) {
            newRoute = route;
          } else {
            const newRouteDistance = newRoute.properties.getAll().distance.value;
            const distance = route.properties.getAll().distance.value;
            if (newRouteDistance > distance) {
              newRoute = route;
            }
          }
        }
      }

      if (newRoute) {
        multiRoute.setActiveRoute(newRoute);
        newRoute.balloon.open();
      }

      const activeProperties = multiRoute.getActiveRoute();
      if (activeProperties) {
        const { distance } = activeProperties.properties.getAll();
        const distanceArr = /\d+/gm.exec(distance.text.replace(/\s/g, ""));
        const newDistance = distanceArr ? Number(distanceArr[0]) : null;
        if (newDistance && newDistance > 0 && currentBid && salePurchaseMode && typeof currentBid.vat === "number") {
          const isVat = (user?.use_vat || !user) && !currentBid.vendor_use_vat;
          const isMatch = isVat && salePurchaseMode === "sale";
          const finalPrice = getFinalPrice(
            currentBid,
            newDistance,
            currentBid.price_delivery_per_km,
            salePurchaseMode,
            isMatch ? +currentBid.vat : 0
          );
          const newLocalBid = {
            currentBid,
            useId: user?.id || 0,
            finalPrice,
            salePurchaseMode,
            distance: newDistance.toString(),
            userLocation: {
              lat: pointB.lat,
              lng: pointB.lng,
            },
          };
          setCurrentMark(newLocalBid);
        }
      }
    },
    [ymaps, map, routeRef, currentBid, salePurchaseMode, user, getFinalPrice]
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
      // { !bids ? (
        <div style={{ marginTop: -24 }}>
          <Skeleton width="100%" height={100} animation="wave" />
          <Skeleton width="100%" height={30} animation="wave" />
          <Skeleton width="100%" height={30} animation="wave" />
          <Skeleton width="100%" height={30} animation="wave" />
        </div>
      ) : bids?.length > 0 ? (
        <>
          {bids?.map(bid => (
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
              handleOpenMap={handleOpenMap}
              localBids={localBids}
              numberParams={numberParams}
              toggleLocationsModal={toggleLocationsModal}
              handleShowImage={handleShowImage}
              points={points}
              changeLocalStore={() => setChangeStore(prev => !prev)}
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
      <YaMapDialog
        mapState={mapState}
        showYaMap={showYaMap}
        setShowYaMap={setShowYaMap}
        currentBid={currentBid}
        setMap={setMap}
        setYmaps={setYmaps}
        showPlacemark={showPlacemark}
      />
      <ImageDialog
        open={isShowImage}
        url={currentImages.photos[currentImages.index]}
        handleClose={() => setIsShowImage(false)}
        noneArrows={currentImages.photos.length < 2}
        handleArrow={handleArrowImage}
      />
    </>
  );
};

export default  injectIntl(BidsList);
