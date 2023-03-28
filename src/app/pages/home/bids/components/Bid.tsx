import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { IconButton, Tooltip, CardMedia, Button, useMediaQuery, CircularProgress, DialogProps, FormControlLabel, Checkbox } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { YMaps, Map } from "react-yandex-maps";
import EditIcon from "@material-ui/icons/Edit";
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import DeleteIcon from "@material-ui/icons/Delete";
import ReportProblemIcon from "@material-ui/icons/ReportProblem";
import ArchiveIcon from "@material-ui/icons/Archive";
import UnarchiveIcon from "@material-ui/icons/Unarchive";
import { IBid } from "../../../../interfaces/bids";
import { IUser } from "../../../../interfaces/users";
import { accessByRoles, formatAsThousands, formatPhone } from "../../../../utils/utils";
import { ICrop, ICropParam } from "../../../../interfaces/crops";
import EmailIcon from "@material-ui/icons/Email";
import { toAbsoluteUrl } from "../../../../../_metronic/utils/utils";
import { useBidTableStyles } from "./hooks/useStyles";
import { ILocalBids } from "./BidsList";
import AliceCarousel, { Classnames } from "react-alice-carousel";
import "../../../../libs/react-alice-carousel/alice-carousel.css";
import { API_DOMAIN, REACT_APP_GOOGLE_API_KEY } from "../../../../constants";
import { injectIntl, useIntl, WrappedComponentProps } from "react-intl";
import { useIsViewed } from "./hooks/useViewedBid";
import { getPoint } from "../../../../utils/localPoint";
import Modal from "../../../../components/ui/Modal";
import { distance, getFinalPrice } from "./BidForm";
import { ILocation } from "../../../../interfaces/locations";
import { useSnackbar } from "notistack";
import { useDispatch, shallowEqual, useSelector, connect, ConnectedProps } from "react-redux";
import { actions as usersActions } from '../../../../store/ducks/users.duck'
import clsx from 'clsx'
import TransporterTable from './transporterTable/TransporterTable'
import InsertCommentIcon from '@material-ui/icons/InsertComment';
import moment from 'moment'
import { editOverloadBid } from "../../../../crud/bids.crud";
import { IAppState } from "../../../../store/rootDuck";
import { actions as bidsActions } from "../../../../store/ducks/bids.duck";
import { compose } from "redux";

interface IProps {
  isHaveRules?: (user?: any, id?: number) => boolean;
  handleDeleteDialiog: (id: number) => void;
  user?: IUser;
  salePurchaseMode?: "sale" | "purchase";
  bestAllMyMode?: "best-bids" | "all-bids" | "my-bids" | "edit";
  crops: ICrop[] | undefined;
  archive?: ({ id, is_archived }: { id: number; is_archived: boolean }) => void;
  bid: IBid;
  hasActivePoints: boolean;
  setSubDialogOpen: (value: React.SetStateAction<boolean>) => void;
  setOpenedSubBidId: (value: React.SetStateAction<number | null>) => void;
  handleClickEditOrViewBid: (bid: IBid) => void;
  handleShowPhone: (id: number) => void;
  showsPhones: number[];
  handleOpenMap: (bid: IBid) => void;
  localBids: ILocalBids[] | null;
  numberParams?: ICropParam[];
  toggleLocationsModal?: () => void;
  points?: ILocation[];
  changeLocalStore: () => void;
  handleShowImage: (index: number, photos?: string[] | undefined) => void;
}

const Bid = React.memo<IProps & PropsFromRedux & WrappedComponentProps>(
  ({
    isHaveRules,
    handleDeleteDialiog,
    user,
    salePurchaseMode,
    bestAllMyMode,
    crops,
    archive,
    bid,
    hasActivePoints,
    setSubDialogOpen,
    setOpenedSubBidId,
    handleClickEditOrViewBid,
    handleShowPhone,
    showsPhones,
    handleOpenMap,
    localBids,
    numberParams,
    toggleLocationsModal,
    handleShowImage,
    points,
    changeLocalStore,
    fetchById,
    bidData
  }) => {
    const intl = useIntl();
    const history = useHistory();
    const caruselRef: any = useRef();
    const isMobile = useMediaQuery("(max-width:1000px)");
    const innerClasses = useBidTableStyles();
    const routeRef = useRef();
    const currentCrop = useMemo(() => crops?.find(item => item.id === bid.crop_id), [crops, bid]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [open, setOpen] = useState(false);
    const [bidOverload, setBidOverload] = useState<any>(false);
    const [overloadBoolean, setOverloadBoolean] = useState<any>(false);
    const [currentBid, setCurrentBid] = useState<IBid | null>(null);
    const [loadDistanation, setLoadDistanation] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const [mySelectedMapPoint, setMySelectedMapPoint] = useState<ILocation | null>();
    const [map, setMap] = useState<any>();
    const [ymaps, setYmaps] = useState<any>();
    const isViewed = useIsViewed(bid.id);
    const guestLocation = useMemo(() => getPoint(), []);
    const isBestBids = useMemo(() => bestAllMyMode === "best-bids", [bestAllMyMode]);
    const dispatch = useDispatch()
    const { me } = useSelector(
      ({ auth }: any) => ({ me: auth.user }),
      shallowEqual
    );

    const [authAlert, setAuthAlert] = useState(false);
    const [openDialogCompanies, setOpenDialogCompanies] = useState(false);

    const openCompaniesDialog = useCallback(() => {
      setOpenDialogCompanies(true);
    }, [openDialogCompanies]);

    const openAuthAlert = useCallback(() => {
      setAuthAlert(true);
    }, [me]);

    const newBid = useMemo(() => {
      if (localBids && localBids.length > 0) {
        const userPoint = bid.point_prices && bid.point_prices.length && bid.point_prices[0].point;
        if (user) {
          return localBids.find(
            item =>
              item.useId === user.id &&
              item.salePurchaseMode === salePurchaseMode &&
              item.currentBid.id === bid.id &&
              userPoint &&
              userPoint.lat === item.userLocation?.lat &&
              userPoint.lng === item.userLocation?.lng &&
              (bid.price_delivery_per_km
                ? item.currentBid.price_delivery_per_km.toString() === bid.price_delivery_per_km.toString()
                : false)
          );
        }
        return localBids.find(
          item =>
            item.useId === 0 &&
            item.salePurchaseMode === salePurchaseMode &&
            item.currentBid.id === bid.id &&
            userPoint &&
            userPoint.lat === item.userLocation?.lat &&
            userPoint.lng === item.userLocation?.lng &&
            (bid.price_delivery_per_km ? item.currentBid.price_delivery_per_km.toString() === bid.price_delivery_per_km.toString() : false)
        );
      }
    }, [localBids, bid, salePurchaseMode, user]);

    useEffect(() => {
      if (ymaps && map && currentBid && currentBid.location && mySelectedMapPoint) {
        addRoute(currentBid.location, mySelectedMapPoint);
      }
    }, [ymaps, map, currentBid, mySelectedMapPoint]);

    const addRoute = useCallback(
      async (pointA: any, pointB: any) => {
        map.geoObjects.remove(routeRef.current);
        const multiRoute = await ymaps.route([pointA.text, pointB.text], {
          multiRoute: true,
          mapStateAutoApply: true,
        });
        routeRef.current = multiRoute;
        await map.geoObjects.add(multiRoute);
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
            if (newLocalBid && currentBid) {
              editOverloadBid(bid.id, overloadBoolean, bid.point_prices, bid.location, Number(newLocalBid.distance)).then(res => {
                setBidOverload(res.data.data)
              })
              if (localBids) {
                const existBidsIndex = localBids.findIndex(item => {
                  if (user) {
                    return item.useId === user.id && item.salePurchaseMode === salePurchaseMode && currentBid.id === item.currentBid.id;
                  }
                  return item.useId === 0 && item.salePurchaseMode === salePurchaseMode && currentBid.id === item.currentBid.id;
                });
                if (existBidsIndex > -1) {
                  const newArr = localBids;
                  newArr[existBidsIndex] = newLocalBid;
                  localStorage.setItem("bids", JSON.stringify(newArr));
                } else {
                  localStorage.setItem("bids", JSON.stringify([...localBids, newLocalBid]));
                }
              } else {
                localStorage.setItem("bids", JSON.stringify([newLocalBid]));
              }
            }
          } else {
            enqueueSnackbar(intl.formatMessage({ id: "NOTISTACK.DEALS.NO_DISTANCE" }), {
              variant: "error",
            });
          }
          changeLocalStore();
        } else {
          enqueueSnackbar(intl.formatMessage({ id: "NOTISTACK.DEALS.NO_DISTANCE" }), {
            variant: "error",
          });
        }
        setCurrentBid(null);
        setLoadDistanation(false);
      },
      [ymaps, map, routeRef, currentBid, salePurchaseMode, user, localBids]
    );

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
        setMySelectedMapPoint(guestLocation?.active ? guestLocation : null);
      }
    }, [currentBid, points, user, guestLocation]);

    const mapState = useMemo(() => {
      if (currentBid && currentBid.location) {
        return { center: [currentBid.location.lat, currentBid.location.lng], zoom: 7, margin: [10, 10, 10, 10] };
      } else {
        return null;
      }
    }, [currentBid]);

    const getParametrName = useCallback(
      (item: { id: number; value: string; parameter_id: number }) => {
        const nameParam = numberParams?.find(param => param.id === item.parameter_id)?.name;
        return nameParam ? `${nameParam}: ${item.value}` : `${item.value}`;
      },
      [numberParams]
    );

    const stopProp = useCallback((e: React.MouseEvent) => e.stopPropagation(), []);

    const items = useMemo(() => {
      const arrImg: any = [];
      if (bid.photos && bid.photos.length > 0) {
        const photosUrls = bid.photos.map(item => `${API_DOMAIN}${item.path}`);
        bid.photos.forEach((item, index) => {
          const url = `${API_DOMAIN}${item.path}`;
          arrImg.push(
            <div
              className={innerClasses.wrapperImage}
              onClick={e => {
                stopProp(e);
                handleShowImage(index, photosUrls);
              }}
            >
              <img src={url} className={innerClasses.image} alt={index.toString()} />
            </div>
          );
        });
      } else {
        const defaultUrl = currentCrop?.photo
          ? `${API_DOMAIN}${currentCrop.photo.small}`
          : `${API_DOMAIN}${"/uploaded/images/bid/default.jpg"}`;
        arrImg.push(
          <div
            className={innerClasses.wrapperImage}
            onClick={e => {
              stopProp(e);
              handleShowImage(0, [defaultUrl]);
            }}
          >
            <img src={defaultUrl} className={innerClasses.image} alt={"defaulImage"} />
          </div>
        );
      }
      return arrImg;
    }, []);

    const arrImgIndex = useMemo(() => {
      if (bid.photos && bid.photos.length > 1) {
        const arrImg: number[] = [];
        bid.photos.forEach((_, index) => arrImg.push(index));
        return arrImg;
      }
      return null;
    }, [bid.photos]);

    const handleDot = useCallback(
      (index: number) => {
        setCurrentIndex(index);
        caruselRef.current.slideTo(index);
      },
      [caruselRef]
    );

    const bidCountController = useCallback(() => {
      Boolean(me?.contact_view_count === 0) &&
        enqueueSnackbar("Вы достигли максимального лимита в количестве просмотров контактов. Просмотр контактов будет доступен завтра, либо оформите новый тариф!", {
          variant: "error",
        });
      return Boolean(me?.contact_view_count === 0)
    }, [me]);

    const checkBidAge = useCallback((bid) => {
      const now = moment(new Date());
      const end = moment(bid?.modified_at);
      const duration = moment.duration(now.diff(end));
      const days = duration.asDays();
      return days > 30 ? true : false
    }, []);

    const displayManager = (manager) => {
      if (manager) {
        if (manager.surname) {
          return manager.surname
        }
        if (manager.login) {
          return manager.login
        }
        if (manager.email) {
          return manager.email
        }
        if (manager.phone) {
          return manager.phone
        }
      } else {
        return null
      }
    };




    return (
      <>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title={"Чтобы продолжить действие с редактированием профиля или объявления, авторизуйтесь!"}
          actions={[
            {
              title: "Cancel",
              onClick: () => setOpen(false),
            },
            {
              title: "OK",
              onClick: () => history.push("/auth"),
            },
          ]}
        />

        <Modal
          DialogProps={{ maxWidth: "md" } as any}
          open={openDialogCompanies}
          onClose={false ? () => { } : () => setOpenDialogCompanies(false)}
          title={""}
          // loading={loadTransporters}
          content={
            <TransporterTable
              transportersList={bidData?.transports}
              fetch={() => { }}
              page={1}
              perPage={bidData?.transports?.length || 0}
              total={bidData && bidData.transports?.length > 0 ? 1 : 0}
            />
          }
          actions={[
            {
              title: "Закрыть",
              onClick: () => {
                setOpenDialogCompanies(false);
              },
            },
          ]}
        />

        <Modal
          open={authAlert}
          onClose={() => setAuthAlert(false)}
          title={"Чтобы продолжить действие с редактированием профиля или объявления, авторизуйтесь!"}
          actions={[
            {
              title: "Cancel",
              onClick: () => setAuthAlert(false),
            },
            {
              title: "OK",
              onClick: () => history.push("/auth"),
            },
          ]}
        />

        <div className={clsx(innerClasses.container, {
          [innerClasses.isOldBid]: checkBidAge(bid)
        })} onClick={() => handleClickEditOrViewBid(bid)}>
          <div className={innerClasses.imageBlock}>
            <div className={innerClasses.imageBlocks} style={{ zIndex: 1 }}>
              {bid.vendor.company && (
                <>
                  {bid?.vendor?.company_confirmed_by_payment &&
                    !!bid?.vendor?.company?.colors &&
                    bid.vendor.company.colors.length > 0 &&
                    bid.vendor.company.colors.find(item => item === "green") && (
                      <div className={innerClasses.imageFirstBlock}>
                        <div className={innerClasses.fontImageText}>Надежный контрагент</div>
                      </div>
                    )}
                </>
              )}
              <div className={innerClasses.iconsRow}>

                {!bid?.vendor?.company_confirmed_by_payment && (
                  <Tooltip
                    title={
                      <div style={{ fontSize: 14 }}>
                        {intl.formatMessage({
                          id: "USERLIST.TOOLTIP.NO_COMPANY",
                        })}
                      </div>
                    }
                  >
                    <div className={innerClasses.icon}>
                      <div style={{ height: 15, backgroundColor: "white", position: "absolute", left: 12, top: 13, width: 8 }} />
                      <ReportProblemIcon color="error" style={{ width: 36, height: 36 }} />
                    </div>
                  </Tooltip>
                )}
                {accessByRoles(user, ["ROLE_ADMIN", "ROLE_MANAGER"]) && bid?.description?.length > 0 && (
                  <Tooltip
                    title={
                      <div style={{ fontSize: 14 }}>
                        {bid.description}
                        {bid.vendor.manager && (
                          <div>
                            С ним работает менеджер <span>{displayManager(bid.vendor.manager)}</span>
                          </div>
                        )}

                      </div>
                    }
                  >
                    <div className={innerClasses.icon}>
                      <div style={{ height: 15, backgroundColor: "white", position: "absolute", left: 8, top: 8, width: 22 }} />
                      <InsertCommentIcon color="primary" style={{ width: 36, height: 36 }} />
                    </div>
                  </Tooltip>
                )}
              </div>

              {isViewed && (
                <div className={innerClasses.imageTwoBlock} style={{ position: "absolute" }}>
                  <div className={innerClasses.fontImageText}>Просмотрено</div>
                </div>
              )}
            </div>
            {arrImgIndex && (
              <div className={innerClasses.containerDot}>
                {arrImgIndex.map(item => (
                  <div
                    key={item}
                    className={innerClasses.wrapperDot}
                    onClick={e => {
                      stopProp(e);
                      handleDot(item);
                    }}
                  >
                    <div className={innerClasses.dot} style={{ backgroundColor: currentIndex === item ? "#6164FF" : "white" }} />
                  </div>
                ))}
              </div>
            )}
            <div className={innerClasses.wrapperCarusel}>
              <AliceCarousel
                ref={caruselRef}
                mouseTracking={isMobile}
                items={items}
                disableDotsControls
                disableButtonsControls
                onSlideChanged={e => setCurrentIndex(e.item)}
                infinite
              />
            </div>
            {/* <CardMedia component="img" title="image"image={toAbsoluteUrl("/images/defaultImage.jpg")} className={innerClasses.image} /> */}
          </div>
          <div className={innerClasses.wrapperFirstInfoBlock}>
            <div className={innerClasses.containerInfoBlock}>
              {isMobile ? (
                <>
                  {bestAllMyMode !== "my-bids" && (hasActivePoints || (!user && guestLocation.active)) && (
                    <>
                      {bestAllMyMode !== "edit" && (
                        <>
                          <div className={innerClasses.wrapperPrice} style={{ marginBottom: salePurchaseMode === "purchase" ? 0 : 8 }}>
                            {!bidOverload?
                              <div className={innerClasses.price}>
                                {newBid
                                  ? formatAsThousands(newBid.finalPrice)
                                  : bid?.price_with_delivery_with_vat
                                    ? `≈ ${formatAsThousands(Math.floor(bid.price_with_delivery_with_vat))}`
                                    : "-"}{" "}
                              </div>
                              :
                              <div className={innerClasses.price}>
                                {formatAsThousands(Math.floor(bidOverload.price_with_delivery_with_vat))}{" "}
                              </div>
                            }
                            <div className={innerClasses.rybl}>₽</div>
                            {(salePurchaseMode === "sale" || salePurchaseMode === "purchase") && (
                              <div className={innerClasses.nds}>
                                {((user?.use_vat || !user) && !bid.vendor_use_vat) ||
                                  (!user?.use_vat && user && bid.vendor_use_vat) ||
                                  ((user?.use_vat || !user) && bid.vendor_use_vat)
                                  ? "Цена указана с НДС"
                                  : "Цена указана без НДС"}{" "}
                                {salePurchaseMode === "purchase" && (
                                  <div className={innerClasses.nds} style={{ marginBottom: 8 }}>
                                    С учетом доставки
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </>
                  )}
                  {bestAllMyMode !== "my-bids" &&
                    (accessByRoles(user, ["ROLE_ADMIN", "ROLE_MANAGER", "ROLE_TRADER", "ROLE_BUYER", "ROLE_VENDOR"]) || (!user && guestLocation)) && (
                      <>
                        {bestAllMyMode !== "edit" && (
                          <div className={innerClasses.wrapperPrice}>
                            <b className={innerClasses.delivery}>
                              {salePurchaseMode === "sale" ? "С учётом доставки до: " : "Место отгрузки: "}
                              <b className={innerClasses.deliveryAddress}>
                                {!user ? (
                                  <b className={innerClasses.deliveryAddress}>{`${guestLocation.active ? `${guestLocation.name}` : "-"
                                    }`}</b>
                                ) : (
                                  <>
                                    {!!bid?.point_prices && !!bid.point_prices.length
                                      ? bid.point_prices.map(
                                        (item, i) =>
                                          i === 0 &&
                                          (i === 0 ? (
                                            <b key={i} className={innerClasses.deliveryAddress}>
                                              {` ${item.point.name}`}
                                            </b>
                                          ) : (
                                            <b key={i} className={innerClasses.deliveryAddress}>
                                              {` ${item.point.name}`}
                                            </b>
                                          ))
                                      )
                                      : "-"}
                                  </>
                                )}
                              </b>{" "}
                              <b
                                className={innerClasses.btnChangeDelivery}
                                onClick={e => {
                                  stopProp(e);
                                  toggleLocationsModal && toggleLocationsModal();
                                }}
                              >
                                (Изменить адрес)
                              </b>
                            </b>
                          </div>
                        )}
                      </>
                    )}
                </>
              ) : (
                <>
                  {bestAllMyMode !== "my-bids" && (hasActivePoints || (!user && guestLocation.active)) && (
                    <>
                      {bestAllMyMode !== "edit" && (
                        <>
                          <div className={innerClasses.wrapperPrice} style={{ marginBottom: salePurchaseMode === "purchase" ? 0 : 8 }}>
                            {!bidOverload?
                              <div className={innerClasses.price}>
                                {newBid
                                  ? formatAsThousands(newBid.finalPrice)
                                  : bid?.price_with_delivery_with_vat
                                    ? `≈ ${formatAsThousands(Math.floor(bid.price_with_delivery_with_vat))}`
                                    : "-"}{" "}
                              </div>
                              :
                              <div className={innerClasses.price}>
                                {formatAsThousands(Math.floor(bidOverload.price_with_delivery_with_vat))}{" "}
                              </div>
                            }
                            <div className={innerClasses.rybl}>₽</div>
                            {(salePurchaseMode === "sale" || salePurchaseMode === "purchase") && (
                              <div className={innerClasses.nds}>
                                {((user?.use_vat || !user) && !bid.vendor_use_vat) ||
                                  (!user?.use_vat && user && bid.vendor_use_vat) ||
                                  ((user?.use_vat || !user) && bid.vendor_use_vat)
                                  ? "Цена указана с НДС"
                                  : "Цена указана без НДС"}{" "}
                                {salePurchaseMode === "purchase" && (
                                  <div className={innerClasses.nds} style={{ marginBottom: 8 }}>
                                    С учетом доставки
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </>
                  )}
                  {bestAllMyMode !== "my-bids" &&
                    (accessByRoles(user, ["ROLE_ADMIN", "ROLE_MANAGER", "ROLE_TRADER", "ROLE_BUYER", "ROLE_VENDOR"]) || (!user && guestLocation)) && (
                      <>
                        {bestAllMyMode !== "edit" && (
                          <div className={innerClasses.wrapperPrice}>
                            <b className={innerClasses.delivery}>
                              {salePurchaseMode === "sale" ? "С учётом доставки до: " : "Место отгрузки: "}
                              <b className={innerClasses.deliveryAddress}>
                                {!user ? (
                                  <b className={innerClasses.deliveryAddress}>{`${guestLocation.active ? ` ${guestLocation.name}` : "-"
                                    }`}</b>
                                ) : (
                                  <>
                                    {!!bid?.point_prices && !!bid.point_prices.length
                                      ? bid.point_prices.map(
                                        (item, i) =>
                                          i === 0 &&
                                          (i === 0 ? (
                                            <b key={i} className={innerClasses.deliveryAddress}>
                                              {` ${item.point.name}`}
                                            </b>
                                          ) : (
                                            <b key={i} className={innerClasses.deliveryAddress}>
                                              {` ${item.point.name}`}
                                            </b>
                                          ))
                                      )
                                      : "-"}
                                  </>
                                )}
                              </b>{" "}
                              <b
                                className={innerClasses.btnChangeDelivery}
                                onClick={e => {
                                  stopProp(e);
                                  toggleLocationsModal && toggleLocationsModal();
                                }}
                              >
                                (Изменить адрес)
                              </b>
                            </b>
                          </div>
                        )}
                      </>
                    )}
                </>
              )}
              {isMobile && (
                <>
                  <div className={innerClasses.wrapperPriceVat}>
                    {salePurchaseMode === "sale" ? (
                      <>
                        {bid.price ? (
                          <>
                            {/*Если покупатель работает с НДС, а объявление продавца было установлено без работы с ндс, то мы добавляем +10 процент*/}
                            {(user?.use_vat || !user) && !bid.vendor_use_vat && (
                              <>
                                <div className={innerClasses.priceVat}>
                                  <div className={innerClasses.price}>
                                    {formatAsThousands(!!bid && Math.round(bid.price * ((bid.vat || 0) / 100 + 1)))}{" "}
                                  </div>
                                  <div className={innerClasses.rybl}>₽</div>
                                  <div className={innerClasses.nds}>{`Цена указана с НДС`}</div>
                                </div>
                                <div className={innerClasses.price} style={{ fontWeight: "normal" }}>{`${bid.price &&
                                  Math.round(bid.price)} + ${bid.vat}% НДС`}</div>
                              </>
                            )}

                            {/*Если покупатель работает с НДС, а объявление продавца было установлено, когда он работал с НДС*/}
                            {(user?.use_vat || !user) && bid.vendor_use_vat && (
                              <>
                                <div className={innerClasses.priceVat}>
                                  <div className={innerClasses.price}>{formatAsThousands(Math.round(bid.price))} </div>
                                  <div className={innerClasses.rybl}>₽</div>
                                  <div className={innerClasses.nds}>{`Цена указана с НДС`}</div>
                                </div>
                                {/* <div className={innerClasses.price}>{`С учётом НДС`}</div> */}
                              </>
                            )}

                            {/*Когда покупатель не работает с НДС, а у продавца установлено объявление, когда тот не работал с НДС*/}
                            {user && !user.use_vat && !bid.vendor_use_vat && (
                              <>
                                <div className={innerClasses.priceVat}>
                                  <div className={innerClasses.price}>{formatAsThousands(Math.round(bid.price))} </div>
                                  <div className={innerClasses.rybl}>₽</div>
                                  <div className={innerClasses.nds}>Цена указана без НДС</div>
                                </div>
                              </>
                            )}

                            {/*Когда покупатель не работает с НДС, а у продавец выставил объявление работая с НДС*/}
                            {user && !user?.use_vat && bid.vendor_use_vat && (
                              <>
                                <div className={innerClasses.priceVat}>
                                  <div className={innerClasses.price}>{formatAsThousands(Math.round(bid.price))} </div>
                                  <div className={innerClasses.rybl}>₽</div>
                                  <div className={innerClasses.nds}>{`Цена указана с НДС`}</div>
                                </div>
                                {/* <div className={innerClasses.price}>{`С учётом НДС`}</div> */}
                              </>
                            )}
                          </>
                        ) : (
                          <div className={innerClasses.rybl}>-</div>
                        )}
                      </>
                    ) : (
                      <>
                        {bid.price ? (
                          <>
                            <div className={innerClasses.priceVat}>
                              <div className={innerClasses.price}>{formatAsThousands(Math.round(bid.price))} </div>
                              <div className={innerClasses.rybl}>₽</div>
                              <div className={innerClasses.nds}>
                                {((user?.use_vat || !user) && !bid.vendor_use_vat) ||
                                  (!user?.use_vat && user && bid.vendor_use_vat) ||
                                  ((user?.use_vat || !user) && bid.vendor_use_vat)
                                  ? "Цена указана с НДС"
                                  : "Цена указана без НДС"}{" "}
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className={innerClasses.rybl}>-</div>
                        )}
                      </>
                    )}
                  </div>
                  <div className={innerClasses.wrapperPrice}>
                    <b className={innerClasses.delivery}>
                      {salePurchaseMode === "sale" ? (
                        <>
                          Место отгрузки: <b className={innerClasses.deliveryAddress}>{`${bid.location.text}`}</b>
                        </>
                      ) : (
                        <>
                          Место выгрузки: <b className={innerClasses.deliveryAddress}>{`(${bid.location.text})`}</b>
                        </>
                      )}
                    </b>
                  </div>
                </>
              )}
              <div className={innerClasses.wrapperNonRow}>
                <div style={{ display: "flex", flexDirection: "row", alignItems: "baseline" }}>
                  <div className={innerClasses.drop}>Расстояние, км</div>
                  {isMobile && (
                    <div className={innerClasses.textDrop} style={{ fontSize: 18, marginLeft: 8 }}>
                      {newBid?.distance || bid.distance || "-"}
                    </div>
                  )}
                </div>

                <div className={innerClasses.wrapperDrop}>
                  {!isMobile && (
                    <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
                      <div className={innerClasses.textDrop}>{newBid?.distance || bid.distance || "-"}</div>
                      <Button
                        variant="text"
                        color="primary"
                        className={innerClasses.btnCard}
                        style={{ marginRight: 16, marginBottom: 8 }}
                        onClick={e => {
                          stopProp(e);
                          handleOpenMap(bid);
                        }}
                      >
                        <div className={innerClasses.textCard}>Посмотреть на карте</div>
                      </Button>
                      {isBestBids && (
                        <Button
                          variant="text"
                          color="primary"
                          className={innerClasses.btnCard}
                          style={{ marginBottom: 8 }}
                          onClick={e => {
                            e.stopPropagation();
                            if (!loadDistanation) {
                              setCurrentBid(bid);
                              setLoadDistanation(true);
                            }
                            editOverloadBid(bid.id, overloadBoolean, bid.point_prices, bid.location, newBid? Number(newBid.distance) : null).then(res => {
                              setBidOverload(res.data.data)
                            })
                          }}
                        >
                          {loadDistanation ? <CircularProgress size={20} /> : <div className={innerClasses.textCard}>Уточнить цену</div>}
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className={innerClasses.wrapperPrice}>
                {currentCrop && <div className={innerClasses.infoText}>{currentCrop.name}</div>}
                <div className={innerClasses.infoTwoText}>
                  {": " +
                    bid.parameter_values.map(item => getParametrName(item)).join(" / ") +
                    `${bid.parameter_values.length > 0 ? " / " : ""}${bid.volume} тонн`}
                </div>
              </div>
              {!isMobile && (
                <div style={{ minWidth: 150 }}>
                  {bestAllMyMode !== "my-bids" && (
                    <>
                      {user && ["ROLE_ADMIN", "ROLE_MANAGER"].includes(user?.roles[0]) && bestAllMyMode === "edit" && (
                        <IconButton size="medium" color="primary" className={innerClasses.iconBtn}>
                          <EmailIcon
                            onClick={e => {
                              stopProp(e);
                              setSubDialogOpen(true);
                              setOpenedSubBidId(bid.id);
                            }}
                          />
                        </IconButton>
                      )}
                      {user && ["ROLE_ADMIN", "ROLE_MANAGER"].includes(user?.roles[0]) && bestAllMyMode === "edit" ? (
                        <IconButton
                          className={innerClasses.iconBtn}
                          size="medium"
                          color="primary"
                          onClick={e => {
                            stopProp(e);
                            handleClickEditOrViewBid(bid);
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      ) : (
                        <Button
                          color="primary"
                          variant="contained"
                          className={innerClasses.btnDetailed}
                          onClick={e => {
                            stopProp(e);
                            handleClickEditOrViewBid(bid);
                          }}
                        >
                          <div className={innerClasses.textBtnDetailed}>Подробнее</div>
                          <CardMedia
                            component="img"
                            title="image"
                            image={toAbsoluteUrl("/images/Vector.png")}
                            className={innerClasses.imgBtnDetailed}
                          />
                        </Button>
                      )}
                      <IconButton
                        style={{ marginLeft: "20px" }}
                        className={innerClasses.iconBtn}
                        color="primary"
                        onClick={e => {
                          stopProp(e);
                          fetchById(bid.id, { filter: {
                            point_prices: []
                          }})
                          !me ? openAuthAlert() : openCompaniesDialog()
                        }}
                      >
                        <LocalShippingIcon fontSize="large" />
                      </IconButton>
                    </>
                  )}
                  {bestAllMyMode === "my-bids" && archive && (
                    <Tooltip title={bid.is_archived ? "убрать с архива" : "добавить в архив"}>
                      <IconButton
                        className={innerClasses.iconBtn}
                        size="medium"
                        color={bid.is_archived ? "secondary" : "primary"}
                        onClick={e => {
                          stopProp(e);
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
                      {isHaveRules && isHaveRules(user, bid.vendor.id) ? (
                        <IconButton
                          className={innerClasses.iconBtn}
                          size="medium"
                          color="primary"
                          onClick={e => {
                            stopProp(e);
                            history.push(`/bid/edit/${bid.type}/${bid.id}/${bid.crop_id}`);
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      ) : (
                        <Button
                          color="primary"
                          variant="contained"
                          className={innerClasses.btnDetailed}
                          onClick={e => {
                            stopProp(e);
                            history.push(`/bid/edit/${bid.type}/${bid.id}/${bid.crop_id}`);
                          }}
                        >
                          <div className={innerClasses.textBtnDetailed}>Подробнее</div>
                          <CardMedia
                            component="img"
                            title="image"
                            image={toAbsoluteUrl("/images/Vector.png")}
                            className={innerClasses.imgBtnDetailed}
                          />
                        </Button>
                      )}
                      <IconButton
                        className={innerClasses.iconBtn}
                        size="medium"
                        onClick={e => {
                          stopProp(e);
                          handleDeleteDialiog(bid.id);
                        }}
                        color="secondary"
                      >
                        <DeleteIcon />
                      </IconButton>

                    </>
                  )}
                   {salePurchaseMode === "sale" && (
                        <FormControlLabel
                          control={
                            <Checkbox
                              onClick={e => {
                                stopProp(e);
                              }}
                              onChange={(e) => {
                                setOverloadBoolean(e.target.checked)
                                editOverloadBid(bid.id, e.target.checked, bid.point_prices, bid.location, newBid? Number(newBid.distance) : null).then(res => {
                                  setBidOverload(res.data.data)
                                })
                              }}
                            />
                          }
                          label={"Перегруз"}
                        />
                      )}
                </div>
              )}
            </div>
          </div>
          <div className={innerClasses.wrapperInfoBlock}>
            <div className={innerClasses.containerInfoBlock}>
              {!isMobile && (
                <>
                  <div className={innerClasses.wrapperPriceVat}>
                    {salePurchaseMode === "sale" ? (
                      <>
                        {bid.price ? (
                          <>
                            {/*Если покупатель работает с НДС, а объявление продавца было установлено без работы с ндс, то мы добавляем +10 процент*/}
                            {(user?.use_vat || !user) && !bid.vendor_use_vat && (
                              <>
                                <div className={innerClasses.priceVat}>
                                  <div className={innerClasses.price}>
                                    {formatAsThousands(!!bid && Math.round(bid.price * ((bid.vat || 0) / 100 + 1)))}{" "}
                                  </div>
                                  <div className={innerClasses.rybl}>₽</div>
                                  <div className={innerClasses.nds}>{`Цена указана с НДС`}</div>
                                </div>
                                <div className={innerClasses.price} style={{ fontWeight: "normal" }}>{`${bid.price &&
                                  Math.round(bid.price)} + ${bid.vat}% НДС`}</div>
                              </>
                            )}

                            {/*Если покупатель работает с НДС, а объявление продавца было установлено, когда он работал с НДС*/}
                            {(user?.use_vat || !user) && bid.vendor_use_vat && (
                              <>
                                <div className={innerClasses.priceVat}>
                                  <div className={innerClasses.price}>{formatAsThousands(Math.round(bid.price))} </div>
                                  <div className={innerClasses.rybl}>₽</div>
                                  <div className={innerClasses.nds}>{`Цена указана с НДС`}</div>
                                </div>
                                {/* <div className={innerClasses.price}>{`С учётом НДС`}</div> */}
                              </>
                            )}

                            {/*Когда покупатель не работает с НДС, а у продавца установлено объявление, когда тот не работал с НДС*/}
                            {user && !user?.use_vat && !bid.vendor_use_vat && (
                              <>
                                <div className={innerClasses.priceVat}>
                                  <div className={innerClasses.price}>{formatAsThousands(Math.round(bid.price))} </div>
                                  <div className={innerClasses.rybl}>₽</div>
                                  <div className={innerClasses.nds}>Цена указана без НДС</div>
                                </div>
                              </>
                            )}

                            {/*Когда покупатель не работает с НДС, а у продавец выставил объявление работая с НДС*/}
                            {user && !user?.use_vat && bid.vendor_use_vat && (
                              <>
                                <div className={innerClasses.priceVat}>
                                  <div className={innerClasses.price}>{formatAsThousands(Math.round(bid.price))} </div>
                                  <div className={innerClasses.rybl}>₽</div>
                                  <div className={innerClasses.nds}>{`Цена указана с НДС`}</div>
                                </div>
                                {/* <div className={innerClasses.price}>{`С учётом НДС`}</div> */}
                              </>
                            )}
                          </>
                        ) : (
                          <div className={innerClasses.rybl}>-</div>
                        )}
                      </>
                    ) : (
                      <>
                        {bid.price ? (
                          <>
                            <div className={innerClasses.priceVat}>
                              <div className={innerClasses.price}>{formatAsThousands(Math.round(bid.price))} </div>
                              <div className={innerClasses.rybl}>₽</div>
                              <div className={innerClasses.nds}>
                                {((user?.use_vat || !user) && !bid.vendor_use_vat) ||
                                  (!user?.use_vat && user && bid.vendor_use_vat) ||
                                  ((user?.use_vat || !user) && bid.vendor_use_vat)
                                  ? "Цена указана с НДС"
                                  : "Цена указана без НДС"}{" "}
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className={innerClasses.rybl}>-</div>
                        )}
                      </>
                    )}
                  </div>
                  <div className={innerClasses.wrapperPrice}>
                    <b className={innerClasses.delivery}>
                      {salePurchaseMode === "sale" ? (
                        <>
                          Место отгрузки: <b className={innerClasses.deliveryAddress}>{`${bid.location.text}`}</b>
                        </>
                      ) : (
                        <>
                          Место выгрузки: <b className={innerClasses.deliveryAddress}>{`(${bid.location.text})`}</b>
                        </>
                      )}
                    </b>
                  </div>
                </>
              )}
              {isMobile && (
                <div className={innerClasses.wrapperInfoCompany} style={{ justifyContent: "space-between" }}>
                  <div className={innerClasses.companyInfo} style={{ marginBottom: 16 }}>
                    <div className={innerClasses.datePublic}>Дата публикации:</div>
                    <div className={innerClasses.textPhone}>{`${bid.modified_at.slice(8, 10)}.${bid.modified_at.slice(
                      5,
                      7
                    )}.${bid.modified_at.slice(0, 4)}`}</div>
                  </div>
                  {bid.vendor.phone && (
                    <Button
                      variant="outlined"
                      color="primary"
                      className={clsx(innerClasses.btnShowPhone, {})}
                      onClick={e => {
                        stopProp(e);
                        if (!bidCountController()) {
                          if (user) {
                            handleShowPhone(bid.id);
                          } else {
                            setOpen(true);
                          }
                        }
                      }}
                    >
                      <div className={clsx(innerClasses.wrapperTextShowBtn)}>
                        {showsPhones.find(item => item === bid.id) ? (
                          <div className={innerClasses.textPhone} style={{ textAlign: "center" }}>
                            <a href={`tel:${formatPhone(bid.vendor.phone)}`}>{formatPhone(bid.vendor.phone)}</a>
                          </div>
                        ) : (
                          <div onClick={() => me?.contact_view_count &&
                            dispatch(usersActions.contactViewCountRequest({ data: { contact_view_count: me.contact_view_count - 1 } }))
                          }>
                            <div className={innerClasses.textPhone}>+7 *** *** ***</div>
                            <div className={innerClasses.btnTextShowPhone}>Показать номер</div>
                          </div>
                        )}
                      </div>
                    </Button>
                  )}
                </div>
              )}
              {!isMobile && (
                <>
                  {bid.vendor.phone && (
                    <Button
                      variant="outlined"
                      color="primary"
                      className={clsx(innerClasses.btnShowPhone, {})}
                      onClick={e => {
                        stopProp(e);
                        if (!bidCountController()) {
                          if (user) {
                            handleShowPhone(bid.id);
                          } else {
                            setOpen(true);
                          }
                        }
                      }}
                    >
                      <div className={clsx(innerClasses.wrapperTextShowBtn)}>
                        {showsPhones.find(item => item === bid.id) ? (
                          <div className={innerClasses.textPhone} style={{ textAlign: "center" }}>
                            <a href={`tel:${formatPhone(bid.vendor.phone)}`}>{formatPhone(bid.vendor.phone)}</a>
                          </div>
                        ) : (
                          <div onClick={() => me?.contact_view_count &&
                            dispatch(usersActions.contactViewCountRequest({ data: { contact_view_count: me.contact_view_count - 1 } }))
                          }>
                            <div className={innerClasses.textPhone}>+7 *** *** ***</div>
                            <div className={innerClasses.btnTextShowPhone}>Показать номер</div>
                          </div>
                        )}
                      </div>
                    </Button>
                  )}
                </>
              )}

              <div className={innerClasses.wrapperInfoCompany} style={{ justifyContent: "space-between" }}>
                <div className={innerClasses.companyWrapper}>
                  {bid?.vendor.firstname && (
                    <div className={innerClasses.nameVendor}>
                      {bid?.vendor.firstname} {bid?.vendor?.lastname}
                    </div>
                  )}
                  {bid.vendor?.company?.short_name && <div className={innerClasses.nameCompany}>{bid.vendor.company.short_name}</div>}
                </div>
                {!isMobile && (
                  <div className={innerClasses.companyInfo} style={{ marginLeft: 20 }}>
                    <div className={innerClasses.datePublic}>Дата публикации:</div>
                    <div className={innerClasses.textCreateAt}>{`${bid.modified_at.slice(8, 10)}.${bid.modified_at.slice(
                      5,
                      7
                    )}.${bid.modified_at.slice(0, 4)}`}</div>
                  </div>
                )}
              </div>
            </div>
            {isMobile && (
              <div style={{ minWidth: 150 }}>
                {bestAllMyMode !== "my-bids" && (
                  <>
                    <Button
                      variant="text"
                      color="primary"
                      className={innerClasses.btnCard}
                      style={{ width: "100%", marginTop: 16, padding: "4px 8px" }}
                      onClick={e => {
                        stopProp(e);
                        handleOpenMap(bid);
                      }}
                    >
                      <div className={innerClasses.textCard}>Посмотреть на карте</div>
                    </Button>
                    {isBestBids && (
                      <Button
                        variant="text"
                        color="primary"
                        className={innerClasses.btnCard}
                        style={{ width: "100%", marginBottom: 4, marginTop: 4, padding: "4px 8px" }}
                        onClick={e => {
                          e.stopPropagation();
                          if (!loadDistanation) {
                            setCurrentBid(bid);
                            setLoadDistanation(true);
                          }
                          editOverloadBid(bid.id, overloadBoolean, bid.point_prices, bid.location, newBid? Number(newBid.distance) : null).then(res => {
                            setBidOverload(res.data.data)
                          })
                        }}
                      >
                        {loadDistanation ? <CircularProgress size={20} /> : <div className={innerClasses.textCard}>Уточнить цену</div>}
                      </Button>
                    )}
                    {user && ["ROLE_ADMIN", "ROLE_MANAGER"].includes(user?.roles[0]) && bestAllMyMode === "edit" && (
                      <IconButton size="medium" color="primary" className={innerClasses.iconBtn}>
                        <EmailIcon
                          onClick={e => {
                            stopProp(e);
                            setSubDialogOpen(true);
                            setOpenedSubBidId(bid.id);
                          }}
                        />
                      </IconButton>
                    )}

                    {user && ["ROLE_ADMIN", "ROLE_MANAGER"].includes(user?.roles[0]) && bestAllMyMode === "edit" ? (
                      <IconButton
                        className={innerClasses.iconBtn}
                        size="medium"
                        color="primary"
                        onClick={e => {
                          stopProp(e);
                          handleClickEditOrViewBid(bid);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    ) : (
                      <Button
                        color="primary"
                        variant="contained"
                        className={innerClasses.btnDetailed}
                        style={{ width: "100%" }}
                        onClick={e => {
                          stopProp(e);
                          handleClickEditOrViewBid(bid);
                        }}
                      >
                        <div className={innerClasses.textBtnDetailed}>Подробнее</div>
                        <CardMedia
                          component="img"
                          title="image"
                          image={toAbsoluteUrl("/images/Vector.png")}
                          className={innerClasses.imgBtnDetailed}
                        />
                      </Button>
                    )}
                  </>
                )}
                {bestAllMyMode === "my-bids" && (
                  <Tooltip title={bid.is_archived ? "убрать с архива" : "добавить в архив"}>
                    <IconButton
                      className={innerClasses.iconBtn}
                      size="medium"
                      color={bid.is_archived ? "secondary" : "primary"}
                      onClick={e => {
                        stopProp(e);
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
                    {isHaveRules && isHaveRules(user, bid.vendor.id) ? (
                      <IconButton
                        className={innerClasses.iconBtn}
                        size="medium"
                        color="primary"
                        onClick={e => {
                          stopProp(e);
                          history.push(`/bid/edit/${bid.type}/${bid.id}/${bid.crop_id}`);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    ) : (
                      <Button
                        color="primary"
                        variant="contained"
                        className={innerClasses.btnDetailed}
                        onClick={e => {
                          stopProp(e);
                          history.push(`/bid/edit/${bid.type}/${bid.id}/${bid.crop_id}`);
                        }}
                      >
                        <div className={innerClasses.textBtnDetailed}>Подробнее</div>
                        <CardMedia
                          component="img"
                          title="image"
                          image={toAbsoluteUrl("/images/Vector.png")}
                          className={innerClasses.imgBtnDetailed}
                        />
                      </Button>
                    )}
                    <IconButton
                      className={innerClasses.iconBtn}
                      size="medium"
                      onClick={e => {
                        stopProp(e);
                        handleDeleteDialiog(bid.id);
                      }}
                      color="secondary"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        <div style={{ display: "none" }}>
          {mapState && (
            <YMaps query={{ apikey: REACT_APP_GOOGLE_API_KEY }}>
              <Map
                state={mapState}
                instanceRef={ref => setMap(ref)}
                onLoad={ymaps => {
                  setYmaps(ymaps);
                }}
                modules={["templateLayoutFactory", "route", "geoObject.addon.balloon"]}
              />
            </YMaps>
          )}
        </div>
      </>
    );
  }
);

const connector = connect(
  (state: IAppState) => ({
    bidData: state.bids.bid,
    loading: state.bids.byIdLoading,
  }),
  {
    fetchById: bidsActions.fetchByIdRequest,
  }
);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(injectIntl(Bid));