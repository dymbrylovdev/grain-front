import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Divider, CardMedia, Button, TextField, useMediaQuery, Tooltip } from "@material-ui/core";
import ReportProblemIcon from "@material-ui/icons/ReportProblem";
import { accessByRoles, formatAsThousands, formatPhone } from "../../../../utils/utils";
import ImageGallery from "./imageGallery/ImageGallery";
import { IntlShape } from "react-intl";
import { IUser } from "../../../../interfaces/users";
import { ICrop, ICropParam } from "../../../../interfaces/crops";
import { IBid } from "../../../../interfaces/bids";
import { ActionWithPayload } from "../../../../utils/action-helper";
import { ILocation } from "../../../../interfaces/locations";
import { Placemark, YMaps, Map } from "react-yandex-maps";
import { REACT_APP_GOOGLE_API_KEY } from "../../../../constants";
import { distance, getDeliveryPrice, getFinalPrice } from "./BidForm";
import { toAbsoluteUrl } from "../../../../../_metronic/utils/utils";
import AlertDialog from "../../../../components/ui/Dialogs/AlertDialog";
import { Link, useHistory } from "react-router-dom";
import { Alert, Skeleton } from "@material-ui/lab";
import NumberFormatCustom from "../../../../components/NumberFormatCustom/NumberFormatCustom";
import { thousands } from "../../deals/utils/utils";
import { useViewBidStyles } from "./hooks/useStyles";
import { ILocalBids } from "./BidsList";
import { setViewed } from "./hooks/useViewedBid";
import Modal from "../../../../components/ui/Modal";

interface IProps {
  intl: IntlShape;
  vendorId: number;
  user: IUser | undefined;
  salePurchaseMode: string;
  editMode: string;
  cropId: number;
  crops: ICrop[] | undefined;
  bid: IBid | undefined;
  me: IUser | undefined;
  fetchCropParams: (
    cropId: number
  ) => ActionWithPayload<
    "crops2/CROP_PARAMS_REQUEST",
    {
      cropId: number;
    }
  >;
  cropParams: ICropParam[] | undefined;
  guestPoint?: ILocation;
}

const ViewBidForm: React.FC<IProps> = ({
  intl,
  vendorId,
  user,
  salePurchaseMode,
  editMode,
  cropId,
  crops,
  bid,
  me,
  fetchCropParams,
  cropParams,
  guestPoint,
}) => {
  const classes = useViewBidStyles();
  const routeRef = useRef();
  const calcRef: any = useRef(null);
  const inputEl = useRef<HTMLButtonElement>(null);
  const [goToRef, setGoToRef] = useState(false);
  const currentCrop = useMemo(() => crops?.find(item => item.id === bid?.crop_id), [crops, bid]);
  const [showPhoneDialog, setShowPhoneDialog] = useState(false);
  const isBuyerTariff = useMemo(() => me?.tariff_matrix?.tariff?.id !== 1, [me]);

  useEffect(() => {
    if (goToRef) {
      inputEl.current?.focus();
      setGoToRef(false);
    }
  }, [goToRef]);
  const isMobile = useMediaQuery("(max-width:840px)");
  const vendor_id = (!bid && +vendorId) || (bid && bid.vendor && bid.vendor.id) || (me?.id as number);
  const vendor = me?.id === vendor_id ? me : user;
  const currentCropId: number = !!bid ? bid.crop_id : !!cropId ? cropId : vendor?.crops.length === 1 ? vendor.crops[0].id : 0;
  const history = useHistory();
  // * yandex map --------------->

  const [open, setOpen] = useState(false);
  const [ymaps, setYmaps] = useState<any>();
  const [map, setMap] = useState<any>();
  const [routeLoading, setRouteLoading] = useState(false);
  const [showsPhones, setShowsPhones] = useState(false);
  const [showPlacemark, setShowPlacemark] = useState(false);
  const [pricePerKm, setPricePerKm] = useState(bid?.price_delivery_per_km || 4);
  const [mySelectedMapPoint, setMySelectedMapPoint] = useState<ILocation | null>();

  const [selectedRoute, setSelectedRoute] = useState<any | null>();

  const localBids: ILocalBids[] | null = useMemo(() => {
    const storageBids = localStorage.getItem("bids");
    return storageBids ? JSON.parse(storageBids) : null;
  }, []);

  const newBid = useMemo(() => {
    if (me && bid && localBids && localBids.length > 0) {
      return localBids.find(
        item =>
          item.useId === me.id &&
          item.salePurchaseMode === salePurchaseMode &&
          item.currentBid.id === bid.id &&
          (bid.price_delivery_per_km ? item.currentBid.price_delivery_per_km.toString() === bid.price_delivery_per_km.toString() : false)
      );
    }
  }, [localBids, bid, salePurchaseMode, me]);

  useEffect(() => {
    if (bid?.id) {
      setViewed(bid?.id);
    }
  }, [bid]);

  useEffect(() => {
    routeLoading && setSelectedRoute(null);
  }, [routeLoading]);

  useEffect(() => {
    if (me) {
      setMySelectedMapPoint(me?.points.filter(el => el.active)[0] || null);
    } else {
      setMySelectedMapPoint(guestPoint?.active ? guestPoint : null);
    }
  }, [me, guestPoint]);

  const mapState = useMemo(() => {
    if (bid && bid.location) {
      return { center: [bid.location.lat, bid.location.lng], zoom: 7, margin: [10, 10, 10, 10] };
    } else {
      return null;
    }
  }, [bid]);

  const newPrice = useMemo(() => {
    if (selectedRoute && bid) {
      return salePurchaseMode === "sale" &&
        (((me?.use_vat || !me) && !bid?.vendor_use_vat) ||
          ((me?.use_vat || !me) && bid?.vendor_use_vat) ||
          (!me?.use_vat && me && bid?.vendor_use_vat))
        ? thousands(
            Math.round(getFinalPrice(bid, selectedRoute.distance.value / 1000, pricePerKm, salePurchaseMode, bid.vat || 10)).toString()
          )
        : thousands(Math.round(getFinalPrice(bid, selectedRoute.distance.value / 1000, pricePerKm, salePurchaseMode, 0)).toString());
    }
    return null;
  }, [selectedRoute, bid, pricePerKm, salePurchaseMode, me]);

  const selectedPrice = useMemo(() => {
    if (!me) {
      return newBid
        ? formatAsThousands(newBid.finalPrice)
        : newPrice
        ? newPrice
        : bid?.price_with_delivery
        ? formatAsThousands(Math.round(bid.price_with_delivery))
        : "-";
    }
    return newBid
      ? formatAsThousands(newBid.finalPrice)
      : newPrice
      ? newPrice
      : bid?.price_with_delivery_with_vat
      ? formatAsThousands(Math.round(bid.price_with_delivery_with_vat))
      : "-";
  }, [newBid, bid, newPrice, me]);

  useEffect(() => {
    if (me && bid && bid.location) {
      const locations = me?.points.filter(el => el.active);
      const position = bid.location;
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
    }
  }, [bid, me]);

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
      for (let i = 0, l = routes.getLength(); i < l; i++) {
        const route = routes.get(i);
        // if (!route.properties.get('blocked')) {
        multiRoute.setActiveRoute(route);
        route.balloon.open();
        break;
        // }
      }

      const activeProperties = multiRoute.getActiveRoute();

      if (activeProperties) {
        setSelectedRoute(activeProperties.properties.getAll());
        // set selected route, update on change
        multiRoute.events.add("activeroutechange", () => {
          setSelectedRoute(activeProperties.properties.getAll());
        });
      }

      setRouteLoading(false);
    },
    [ymaps, map, routeRef]
  );

  const getParametrName = useCallback(
    (item: { id: number; value: string; parameter_id: number }) => {
      const nameParam = cropParams?.find(param => param.id === item.parameter_id)?.name;
      return nameParam || "";
    },
    [cropParams]
  );

  useEffect(() => {
    if (ymaps && map && bid && bid.location && mySelectedMapPoint) {
      setShowPlacemark(false);
      setRouteLoading(true);
      addRoute(bid.location, mySelectedMapPoint);
    } else if (ymaps && map && bid && bid.location) {
      setShowPlacemark(true);
    }
  }, [ymaps, map, bid, mySelectedMapPoint]);

  useEffect(() => {
    if (currentCropId) fetchCropParams(currentCropId);
  }, [currentCropId, fetchCropParams]);

  const vendorUseVat = bid?.vendor_use_vat;

  const loading = !crops || (editMode !== "create" && !bid) || (!!vendorId && !user);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (!loading) {
      setTimeout(() => {
        if (isMobile) {
          calcRef.current.scrollIntoView();
        } else {
          window.scrollTo(0, 0);
        }
      }, 1000);
    }
  }, [loading, calcRef]);

  return (
    <>
      {loading && <Skeleton width="100%" height={70} animation="wave" />}
      <AlertDialog
        isOpen={showPhoneDialog}
        text={`У вас "Бесплатный" тариф, чтобы увидеть номер телефона продавца, перейдите на премиум тариф`}
        okText={"Подключить тариф"}
        cancelText={"Отмена"}
        handleClose={() => setShowPhoneDialog(false)}
        handleAgree={() => history.push("/user/profile/tariffs")}
      />
      {bid && user && (
        <div className={classes.container}>
          <div className={classes.card}>
            <Button
              variant="outlined"
              onClick={() => {
                history.goBack();
              }}
              disabled={loading}
              className={classes.btnGoBack}
            >
              <CardMedia
                component="img"
                title="image"
                image={toAbsoluteUrl("/images/goBack.png")}
                className={classes.imgBtnDetailed}
                style={{ objectFit: "none" }}
              />
            </Button>
            <div className={classes.wrapperPrice}>{currentCrop && <div className={classes.infoText}>{currentCrop.name}</div>}</div>
            <>
              <div className={classes.imageBlocks}>
                {bid.vendor.company && (
                  <>
                    {bid?.vendor?.company_confirmed_by_payment &&
                      !!bid?.vendor?.company?.colors &&
                      bid.vendor.company.colors.length > 0 &&
                      bid.vendor.company.colors.find(item => item === "green") && (
                        <div className={classes.imageTwoBlock}>
                          <div className={classes.fontImageText}>Надежный контрагент</div>
                        </div>
                      )}
                  </>
                )}
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
                    <div>
                      <div style={{ height: 15, backgroundColor: "white", position: "absolute", right: 13, top: 13, width: 10 }} />
                      <ReportProblemIcon color="error" style={{ width: 36, height: 36 }} />
                    </div>
                  </Tooltip>
                )}
              </div>
              <div className={classes.wrapperMedia}>
                <CardMedia
                  component="img"
                  title="image"
                  image={toAbsoluteUrl("/images/arrorRight.png")}
                  className={classes.imgBtnDetailed}
                  style={{ objectFit: "none" }}
                />
              </div>
              {bid.vendor?.company?.short_name && <div className={classes.nameCompany}>{bid.vendor.company.short_name}</div>}
            </>
            <div style={{ width: "100%" }}>
              <Divider style={{ marginBottom: 14 }} />
            </div>
            <div className={classes.containerCols}>
              <div className={classes.leftCol}>
                <div style={{ maxWidth: "100%" }}>
                  <ImageGallery photos={bid.photos} currentCrop={currentCrop} />
                </div>
                <div className={classes.header}>
                  {mapState && bid && (
                    <YMaps query={{ apikey: REACT_APP_GOOGLE_API_KEY }}>
                      <div className={classes.yaMap}>
                        <Map
                          state={mapState}
                          instanceRef={ref => setMap(ref)}
                          width={"100%"}
                          height={400}
                          onLoad={ymaps => {
                            setYmaps(ymaps);
                          }}
                          modules={["templateLayoutFactory", "route", "geoObject.addon.balloon"]}
                        >
                          {showPlacemark && (
                            <Placemark
                              geometry={mapState.center}
                              properties={{ iconCaption: bid.location.text }}
                              modules={["geoObject.addon.balloon"]}
                            />
                          )}
                        </Map>
                      </div>
                    </YMaps>
                  )}
                </div>
              </div>

              <div className={classes.rightCol}>
                <>
                  <div
                    className={classes.wrapperPrice}
                    style={{ marginBottom: salePurchaseMode === "purchase" && selectedPrice !== "-" ? 0 : 8 }}
                  >
                    <div className={classes.price}>{selectedPrice}</div>
                    <div className={classes.rybl}>₽</div>
                    {selectedPrice !== "-" && (salePurchaseMode === "sale" || salePurchaseMode === "purchase") && (
                      <div className={classes.nds}>
                        {((me?.use_vat || !me) && !bid.vendor_use_vat) ||
                        ((me?.use_vat || !me) && bid.vendor_use_vat) ||
                        (!me?.use_vat && me && bid.vendor_use_vat)
                          ? "Цена указана с НДС"
                          : "Цена указана без НДС"}{" "}
                        <div>
                          {salePurchaseMode === "purchase" && (
                            <div className={classes.nds} style={{ marginBottom: 8 }}>
                              С учетом доставки
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className={classes.wrapperPrice}>
                    <b className={classes.delivery}>
                      {salePurchaseMode === "sale" ? "С учётом доставки до:" : "Место отгрузки: "}
                      <b className={classes.deliveryAddress}>
                        {!me && guestPoint?.active ? (
                          <b className={classes.deliveryAddress}>{` ${guestPoint.name}`}</b>
                        ) : (
                          <>
                            {!!bid?.point_prices && !!bid.point_prices.length
                              ? bid.point_prices.map(
                                  (item, i) =>
                                    i === 0 &&
                                    (i === 0 ? (
                                      <b key={i} className={classes.deliveryAddress}>
                                        {` ${item.point.name}`}
                                      </b>
                                    ) : (
                                      <b key={i} className={classes.deliveryAddress}>
                                        {` ${item.point.name}`}
                                      </b>
                                    ))
                                )
                              : "-"}
                          </>
                        )}
                      </b>{" "}
                      {/* <b className={classes.btnChangeDelivery}>(Изменить)</b> */}
                    </b>
                  </div>
                </>
                <div className={classes.wrapperPrice} style={{ flexDirection: "column", marginBottom: 10 }}>
                  <div className={classes.wrapperPriceVat}>
                    {salePurchaseMode === "sale" ? (
                      <>
                        {bid.price ? (
                          <>
                            {/*Если покупатель работает с НДС, а объявление продавца было установлено без работы с ндс, то мы добавляем +10 процент*/}
                            {(me?.use_vat || !me) && !bid.vendor_use_vat && (
                              <>
                                <div className={classes.priceVat}>
                                  <div className={classes.price}>
                                    {formatAsThousands(!!bid && Math.round(bid.price * ((bid.vat || 0) / 100 + 1)))}{" "}
                                  </div>
                                  <div className={classes.rybl}>₽</div>
                                  <div className={classes.nds}>{`Цена указана с НДС`}</div>
                                </div>
                                <div className={classes.price} style={{ fontWeight: "normal" }}>{`${bid.price && Math.round(bid.price)} + ${
                                  bid.vat
                                }% НДС`}</div>
                              </>
                            )}

                            {/*Если покупатель работает с НДС, а объявление продавца было установлено, когда он работал с НДС*/}
                            {(me?.use_vat || !me) && bid.vendor_use_vat && (
                              <>
                                <div className={classes.priceVat}>
                                  <div className={classes.price}>{formatAsThousands(Math.round(bid.price))} </div>
                                  <div className={classes.rybl}>₽</div>
                                  <div className={classes.nds}>{`Цена указана с НДС`}</div>
                                </div>
                                {/* <div className={classes.price}>{`С учётом НДС`}</div> */}
                              </>
                            )}

                            {/*Когда покупатель не работает с НДС, а у продавца установлено объявление, когда тот не работал с НДС*/}
                            {me && !me?.use_vat && !bid.vendor_use_vat && (
                              <>
                                <div className={classes.priceVat}>
                                  <div className={classes.price}>{formatAsThousands(Math.round(bid.price))} </div>
                                  <div className={classes.rybl}>₽</div>
                                  <div className={classes.nds}>Цена указана без НДС</div>
                                </div>
                              </>
                            )}

                            {/*Когда покупатель не работает с НДС, а у продавец выставил объявление работая с НДС*/}
                            {me && !me?.use_vat && bid.vendor_use_vat && (
                              <>
                                <div className={classes.priceVat}>
                                  <div className={classes.price}>{formatAsThousands(Math.round(bid.price))} </div>
                                  <div className={classes.rybl}>₽</div>
                                  <div className={classes.nds}>{`Цена указана с НДС`}</div>
                                </div>
                                {/* <div className={classes.price}>{`С учётом НДС`}</div> */}
                              </>
                            )}
                          </>
                        ) : (
                          <div className={classes.rybl}>-</div>
                        )}
                      </>
                    ) : (
                      <>
                        {bid.price ? (
                          <>
                            <div className={classes.priceVat}>
                              <div className={classes.price}>{formatAsThousands(Math.round(bid.price))} </div>
                              <div className={classes.rybl}>₽</div>
                              <div className={classes.nds}>
                                {((user?.use_vat || !user) && !bid.vendor_use_vat) ||
                                (!user?.use_vat && user && bid.vendor_use_vat) ||
                                ((user?.use_vat || !user) && bid.vendor_use_vat)
                                  ? "Цена указана с НДС"
                                  : "Цена указана без НДС"}{" "}
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className={classes.rybl}>-</div>
                        )}
                      </>
                    )}
                  </div>
                  <div className={classes.delivery}>
                    {salePurchaseMode === "sale" ? (
                      <>
                        Место отгрузки: <b className={classes.deliveryAddress}>{`${bid.location.text}`}</b>
                      </>
                    ) : (
                      <>
                        Место выгрузки: <b className={classes.deliveryAddress}>{`(${bid.location.text})`}</b>
                      </>
                    )}
                  </div>
                </div>
                {!isMobile && (
                  <div className={classes.wrapperParameters}>
                    {currentCrop && (
                      <div className={classes.wrapperParameter}>
                        <div className={classes.nameParameter}>Культура</div>
                        <div className={classes.parameterValue}>{currentCrop.name}</div>
                      </div>
                    )}
                    {bid.parameter_values.map(item => (
                      <div key={item.id} className={classes.wrapperParameter}>
                        <div className={classes.nameParameter}>{getParametrName(item)}</div>
                        <div className={classes.parameterValue}>{item.value}</div>
                      </div>
                    ))}
                    <div className={classes.wrapperParameter}>
                      <div className={classes.nameParameter}>Объем, тонн</div>
                      <div className={classes.parameterValue}>{bid.volume}</div>
                    </div>
                  </div>
                )}
                <div className={classes.wrapperVendor}>
                  <div>
                    <div className={classes.nameParameter}>Продавец:</div>
                    {Boolean(bid.vendor.surname || bid.vendor.firstName || bid.vendor.lastName) && (
                      <div className={classes.vendorCompany}>
                        {`${bid.vendor.surname || ""} ${bid.vendor.firstName || ""} ${bid.vendor.lastName || ""}`}
                      </div>
                    )}
                    {Boolean(bid.vendor.login) && <div className={classes.parameterValue}>{bid.vendor.login}</div>}
                    {bid.vendor?.company?.short_name && (
                      <div className={classes.vendorCompany} style={{ marginBottom: isMobile ? 0 : 16 }}>
                        {bid.vendor?.company?.short_name}
                      </div>
                    )}
                    {!isMobile && (
                      <>
                        {Boolean(bid.modified_at) && (
                          <div className={classes.modifedAt}>{`Дата последнего изменения: ${bid.modified_at.slice(
                            8,
                            10
                          )}.${bid.modified_at.slice(5, 7)}.${bid.modified_at.slice(0, 4)}`}</div>
                        )}
                      </>
                    )}
                  </div>
                  {!isMobile && bid.vendor.phone && (
                    <Button
                      variant="outlined"
                      color="primary"
                      className={classes.btnShowPhone}
                      onClick={() => {
                        if (me) {
                          isBuyerTariff ? setShowsPhones(true) : setShowPhoneDialog(true);
                        } else {
                          setOpen(true);
                        }
                      }}
                    >
                      <div className={classes.wrapperTextShowBtn}>
                        {showsPhones ? (
                          <div className={classes.textPhone} style={{ textAlign: "center" }}>
                            <a href={`tel:${formatPhone(bid.vendor.phone)}`}>{formatPhone(bid.vendor.phone)}</a>
                          </div>
                        ) : (
                          <>
                            <div className={classes.textPhone}>+7 *** *** ***</div>
                            <div className={classes.btnTextShowPhone}>Показать номер</div>
                          </>
                        )}
                      </div>
                    </Button>
                  )}
                </div>
                {isMobile && (
                  <>
                    {bid.vendor.phone && (
                      <Button
                        variant="outlined"
                        color="primary"
                        className={classes.btnShowPhone}
                        onClick={() => {
                          if (me) {
                            isBuyerTariff ? setShowsPhones(true) : setShowPhoneDialog(true);
                          } else {
                            setOpen(true);
                          }
                        }}
                      >
                        <div className={classes.wrapperTextShowBtn}>
                          {showsPhones ? (
                            <div className={classes.textPhone} style={{ textAlign: "center" }}>
                              <a href={`tel:${formatPhone(bid.vendor.phone)}`}>{formatPhone(bid.vendor.phone)}</a>
                            </div>
                          ) : (
                            <>
                              <div className={classes.textPhone}>+7 *** *** ***</div>
                              <div className={classes.btnTextShowPhone}>Показать номер</div>
                            </>
                          )}
                        </div>
                      </Button>
                    )}
                    {Boolean(bid.modified_at) && (
                      <div className={classes.modifedAt}>{`Дата последнего изменения: ${bid.modified_at.slice(
                        8,
                        10
                      )}.${bid.modified_at.slice(5, 7)}.${bid.modified_at.slice(0, 4)}`}</div>
                    )}
                    {accessByRoles(me, ["ROLE_BUYER", "ROLE_VENDOR", "ROLE_TRADER"]) && (
                      <>
                        {bid?.author.id === me?.id ? null : (
                          <Alert className={classes.infoAlert} severity="warning" color="error">
                            {`Сегодня вам доступен просмотр ${me?.contact_view_count} контактов. ${intl.formatMessage({
                              id: "BID.CONTACTS.LIMIT",
                            })}`}{" "}
                            <Link to={"/user/profile/tariffs"}>Снять ограничения</Link>
                          </Alert>
                        )}
                      </>
                    )}
                    <div className={classes.wrapperParameters}>
                      {bid.parameter_values.map(item => (
                        <div className={classes.wrapperParameter}>
                          <div className={classes.nameParameter}>{getParametrName(item)}</div>
                          <div className={classes.parameterValue}>{item.value}</div>
                        </div>
                      ))}
                      <div className={classes.wrapperParameter}>
                        <div className={classes.nameParameter}>Объем, тонн</div>
                        <div className={classes.parameterValue}>{bid.volume}</div>
                      </div>
                    </div>
                  </>
                )}
                {!isMobile && (
                  <>
                    {accessByRoles(me, ["ROLE_BUYER", "ROLE_VENDOR", "ROLE_TRADER"]) && (
                      <>
                        {bid?.author.id === me?.id ? null : (
                          <Alert className={classes.infoAlert} severity="warning" color="error">
                            {`Сегодня вам доступен просмотр ${me?.contact_view_count} контактов. ${intl.formatMessage({
                              id: "BID.CONTACTS.LIMIT",
                            })}`}{" "}
                            <Link to={"/user/profile/tariffs"}>Снять ограничения</Link>
                          </Alert>
                        )}
                      </>
                    )}
                  </>
                )}

                <div className={classes.wrapperCalc} ref={calcRef}>
                  <div className={classes.titleCalc}>Калькулятор доставки</div>
                  <div style={{ width: "100%" }}>
                    <Divider style={{ marginBottom: 26 }} />
                    <div>
                      <div className={classes.modifedAt}>
                        {intl.formatMessage({
                          id: "BID.CALCULATOR.PRICE_PER_KM",
                        })}
                      </div>
                    </div>
                    <TextField
                      type="text"
                      margin="normal"
                      name="pricePerKm"
                      value={pricePerKm}
                      variant="outlined"
                      InputProps={{
                        inputComponent: NumberFormatCustom as any,
                      }}
                      autoComplete="off"
                      autoFocus={true}
                      className={classes.textField}
                      onChange={text => setPricePerKm(Number(text.target.value))}
                    />
                    <div className={classes.wrapperValCalc}>
                      <div>
                        <div>
                          <div className={classes.calcParam}>
                            {salePurchaseMode === "sale" &&
                            (((me?.use_vat || !me) && !bid?.vendor_use_vat) ||
                              ((me?.use_vat || !me) && bid?.vendor_use_vat) ||
                              (me && !me?.use_vat && bid?.vendor_use_vat))
                              ? intl.formatMessage({ id: "BID.CALCULATOR.FINAL_PRICE_WITH_VAT" })
                              : intl.formatMessage({ id: "BID.CALCULATOR.FINAL_PRICE" })}
                            {/* {!!me && me.use_vat && salePurchaseMode === "sale" && !!bid && !vendorUseVat
                              ? intl.formatMessage({ id: "BID.CALCULATOR.FINAL_PRICE_WITH_VAT" })
                              : intl.formatMessage({ id: "BID.CALCULATOR.FINAL_PRICE" })} */}
                          </div>
                          {!!bid?.point_prices &&
                            (bid.point_prices.length > 0 ? (
                              <div className={classes.calcVal}>
                                {salePurchaseMode === "sale" &&
                                bid &&
                                (((me?.use_vat || !me) && !bid?.vendor_use_vat) ||
                                  ((me?.use_vat || !me) && bid?.vendor_use_vat) ||
                                  (me && !me?.use_vat && bid?.vendor_use_vat)) ? (
                                  <b className={classes.calcVal}>
                                    {selectedRoute
                                      ? thousands(
                                          Math.round(
                                            getFinalPrice(
                                              bid,
                                              selectedRoute.distance.value / 1000,
                                              pricePerKm,
                                              salePurchaseMode,
                                              bid.vat || 10
                                            )
                                          ).toString()
                                        ) + " • "
                                      : ""}
                                  </b>
                                ) : (
                                  <b className={classes.calcVal}>
                                    {selectedRoute
                                      ? thousands(
                                          Math.round(
                                            getFinalPrice(bid, selectedRoute.distance.value / 1000, pricePerKm, salePurchaseMode, 0)
                                          ).toString()
                                        ) + " • "
                                      : ""}
                                  </b>
                                )}
                                {`${selectedRoute ? selectedRoute.distance.text + " •" : ""} ${
                                  mySelectedMapPoint ? mySelectedMapPoint.text : ""
                                }`}
                              </div>
                            ) : !me && guestPoint?.active ? (
                              <>
                                {salePurchaseMode === "sale" && (bid?.vendor_use_vat || !me) ? (
                                  <b className={classes.calcVal}>
                                    {selectedRoute
                                      ? thousands(
                                          Math.round(
                                            getFinalPrice(
                                              bid,
                                              selectedRoute.distance.value / 1000,
                                              pricePerKm,
                                              salePurchaseMode,
                                              bid.vat || 10
                                            )
                                          ).toString()
                                        ) + " • "
                                      : ""}
                                  </b>
                                ) : (
                                  <b className={classes.calcVal}>
                                    {selectedRoute
                                      ? thousands(
                                          Math.round(
                                            getFinalPrice(bid, selectedRoute.distance.value / 1000, pricePerKm, salePurchaseMode, 0)
                                          ).toString()
                                        ) + " • "
                                      : ""}
                                  </b>
                                )}
                                <b className={classes.calcVal}>
                                  {`${selectedRoute ? selectedRoute.distance.text + " •" : ""} ${
                                    mySelectedMapPoint ? mySelectedMapPoint.text : ""
                                  }`}
                                </b>
                              </>
                            ) : (
                              <p className={classes.calcVal}>{intl.formatMessage({ id: "BIDLIST.NO_POINTS" })}</p>
                            ))}
                        </div>
                        <div>
                          <div className={classes.calcParam}>
                            {(me?.use_vat || !me) && salePurchaseMode === "sale" && !!bid && !vendorUseVat
                              ? intl.formatMessage({ id: "BID.CALCULATOR.FINAL_PRICE_DELIVERY" })
                              : intl.formatMessage({ id: "BID.CALCULATOR.FINAL_PRICE_DELIVERY" })}
                          </div>
                          {bid &&
                            bid.point_prices &&
                            (bid.point_prices.length > 0 ? (
                              <div className={classes.calcVal}>
                                {salePurchaseMode === "sale" &&
                                bid &&
                                (((me?.use_vat || !me) && !bid?.vendor_use_vat) ||
                                  ((me?.use_vat || !me) && bid?.vendor_use_vat) ||
                                  (me && !me?.use_vat && bid?.vendor_use_vat)) ? (
                                  <b className={classes.calcVal}>
                                    {selectedRoute
                                      ? thousands(
                                          Math.round(
                                            getDeliveryPrice(
                                              bid,
                                              selectedRoute.distance.value / 1000,
                                              pricePerKm,
                                              salePurchaseMode,
                                              bid.vat || 10
                                            )
                                          ).toString()
                                        ) + " • "
                                      : ""}
                                  </b>
                                ) : (
                                  <b className={classes.calcVal}>
                                    {selectedRoute
                                      ? thousands(
                                          Math.round(
                                            getDeliveryPrice(bid, selectedRoute.distance.value / 1000, pricePerKm, salePurchaseMode, 0)
                                          ).toString()
                                        ) + " • "
                                      : ""}
                                  </b>
                                )}
                                {`${selectedRoute ? selectedRoute.distance.text + " •" : ""} ${
                                  mySelectedMapPoint ? mySelectedMapPoint.text : ""
                                }`}
                              </div>
                            ) : !me && guestPoint?.active ? (
                              <>
                                {salePurchaseMode === "sale" && bid?.vendor_use_vat ? (
                                  <b className={classes.calcVal}>
                                    {selectedRoute
                                      ? thousands(
                                          Math.round(
                                            getDeliveryPrice(
                                              bid,
                                              selectedRoute.distance.value / 1000,
                                              pricePerKm,
                                              salePurchaseMode,
                                              bid.vat || 10
                                            )
                                          ).toString()
                                        ) + " • "
                                      : ""}
                                  </b>
                                ) : (
                                  <b className={classes.calcVal}>
                                    {selectedRoute
                                      ? thousands(
                                          Math.round(
                                            getDeliveryPrice(bid, selectedRoute.distance.value / 1000, pricePerKm, salePurchaseMode, 0)
                                          ).toString()
                                        ) + " • "
                                      : ""}
                                  </b>
                                )}
                                <b className={classes.calcVal}>
                                  {`${selectedRoute ? selectedRoute.distance.text + " •" : ""} ${
                                    mySelectedMapPoint ? mySelectedMapPoint.text : ""
                                  }`}
                                </b>
                              </>
                            ) : (
                              <p className={classes.calcVal}>{intl.formatMessage({ id: "BIDLIST.NO_POINTS" })}</p>
                            ))}
                        </div>
                      </div>
                      {/* <div>
                        <div>
                          <div className={classes.calcParam}>
                            {!!me && me.use_vat && salePurchaseMode === "sale" && !!bid && !vendorUseVat
                              ? intl.formatMessage({ id: "BID.CALCULATOR.FINAL_PRICE_DELIVERY_ALL" })
                              : intl.formatMessage({ id: "BID.CALCULATOR.FINAL_PRICE_DELIVERY_ALL" })}
                          </div>
                          {bid &&
                            bid.point_prices &&
                            (bid.point_prices.length > 0 ? (
                              <div className={classes.calcVal}>
                                {!!me && me.use_vat && salePurchaseMode === "sale" && !!bid && !!bid.vat && !vendorUseVat ? (
                                  <b className={classes.calcVal}>
                                    {selectedRoute
                                      ? thousands(
                                          Math.round(
                                            bid.volume *
                                              getDeliveryPrice(
                                                bid,
                                                selectedRoute.distance.value / 1000,
                                                pricePerKm,
                                                salePurchaseMode,
                                                +bid.vat
                                              )
                                          ).toString()
                                        ) + " • "
                                      : ""}
                                  </b>
                                ) : (
                                  <b className={classes.calcVal}>
                                    {selectedRoute
                                      ? thousands(
                                          Math.round(
                                            bid.volume *
                                              getDeliveryPrice(bid, selectedRoute.distance.value / 1000, pricePerKm, salePurchaseMode, 0)
                                          ).toString()
                                        ) + " • "
                                      : ""}
                                  </b>
                                )}
                                {`${selectedRoute ? selectedRoute.distance.text + " •" : ""} ${
                                  mySelectedMapPoint ? mySelectedMapPoint.text : ""
                                }`}
                              </div>
                            ) : (
                              <p className={classes.calcVal}>{intl.formatMessage({ id: "BIDLIST.NO_POINTS" })}</p>
                            ))}
                        </div>
                        <div>
                          <div className={classes.calcParam}>
                            {!!me && me.use_vat && salePurchaseMode === "sale" && !!bid && !vendorUseVat
                              ? intl.formatMessage({ id: "BID.CALCULATOR.FINAL_PRICE_WITH_VAT_ALL" }, { vat: bid.vat })
                              : intl.formatMessage({ id: "BID.CALCULATOR.FINAL_PRICE_ALL" })}
                          </div>
                          {bid &&
                            bid.point_prices &&
                            (bid.point_prices.length > 0 ? (
                              <div className={classes.calcVal}>
                                {!!me && me.use_vat && salePurchaseMode === "sale" && !!bid && !!bid.vat && !vendorUseVat ? (
                                  <b className={classes.calcVal}>
                                    {selectedRoute
                                      ? thousands(
                                          Math.round(
                                            bid.volume *
                                              getFinalPrice(
                                                bid,
                                                selectedRoute.distance.value / 1000,
                                                pricePerKm,
                                                salePurchaseMode,
                                                +bid.vat
                                              )
                                          ).toString()
                                        ) + " • "
                                      : ""}
                                  </b>
                                ) : (
                                  <b className={classes.calcVal}>
                                    {selectedRoute
                                      ? thousands(
                                          Math.round(
                                            bid.volume *
                                              getFinalPrice(bid, selectedRoute.distance.value / 1000, pricePerKm, salePurchaseMode, 0)
                                          ).toString()
                                        ) + " • "
                                      : ""}
                                  </b>
                                )}
                                {`${selectedRoute ? selectedRoute.distance.text + " •" : ""} ${
                                  mySelectedMapPoint ? mySelectedMapPoint.text : ""
                                }`}
                              </div>
                            ) : (
                              <p className={classes.calcVal}>{intl.formatMessage({ id: "BIDLIST.NO_POINTS" })}</p>
                            ))}
                        </div>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
        </div>
      )}
    </>
  );
};

export default ViewBidForm;
