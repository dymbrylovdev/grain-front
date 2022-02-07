import React, { useCallback, useMemo, useRef, useState } from "react";
import { IconButton, Tooltip, CardMedia, Button, useMediaQuery } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import EditIcon from "@material-ui/icons/Edit";
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
import AliceCarousel from "react-alice-carousel";
import "../../../../libs/react-alice-carousel/alice-carousel.css";
import { API_DOMAIN } from "../../../../constants";
import { useIntl } from "react-intl";

interface IProps {
  isHaveRules?: (user: any, id: number) => boolean;
  handleDeleteDialiog: (id: number) => void;
  user: IUser;
  salePurchaseMode?: "sale" | "purchase";
  bestAllMyMode?: "best-bids" | "all-bids" | "my-bids" | "edit";
  crops: ICrop[] | undefined;
  archive?: ({ id: number, is_archived: boolean }) => void;
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
  handleShowImage: (index: number, photos?: string[] | undefined) => void;
}

const Bid = React.memo<IProps>(
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
  }) => {
    const intl = useIntl();
    const history = useHistory();
    const caruselRef: any = useRef();
    const isMobile = useMediaQuery("(max-width:1000px)");
    const innerClasses = useBidTableStyles();
    const currentCrop = useMemo(() => crops?.find(item => item.id === bid.crop_id), [crops, bid]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const newBid = useMemo(() => {
      if (localBids && localBids.length > 0) {
        return localBids.find(
          item =>
            item.useId === user.id &&
            item.salePurchaseMode === salePurchaseMode &&
            item.currentBid.id === bid.id &&
            (bid.price_delivery_per_km ? item.currentBid.price_delivery_per_km.toString() === bid.price_delivery_per_km.toString() : false)
        );
      }
    }, [localBids, bid, salePurchaseMode, user]);

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

    return (
      <div className={innerClasses.container} onClick={() => handleClickEditOrViewBid(bid)}>
        <div className={innerClasses.imageBlock}>
          <div className={innerClasses.imageBlocks} style={{ zIndex: 1 }}>
            {bid.vendor.company && (
              <>
                {bid?.vendor?.company_confirmed_by_payment &&
                  !!bid?.vendor?.company?.colors &&
                  bid.vendor.company.colors.length > 0 &&
                  bid.vendor.company.colors.find(item => item === "green") && (
                    <div className={innerClasses.imageTwoBlock}>
                      <div className={innerClasses.fontImageText}>Надежный контрагент</div>
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
          {/* <CardMedia component="img" title="image" image={toAbsoluteUrl("/images/defaultImage.jpg")} className={innerClasses.image} /> */}
        </div>
        <div className={innerClasses.wrapperFirstInfoBlock}>
          <div className={innerClasses.containerInfoBlock}>
            {isMobile ? (
              <>
                {bestAllMyMode !== "my-bids" && accessByRoles(user, ["ROLE_ADMIN", "ROLE_MANAGER", "ROLE_TRADER", "ROLE_BUYER"]) && (
                  <>
                    {bestAllMyMode !== "edit" && (
                      <div className={innerClasses.wrapperPrice}>
                        <b className={innerClasses.delivery}>
                          {salePurchaseMode === "sale" ? "С учётом доставки до:" : "Цена указана с учётом доставки до:"}
                          {/* {salePurchaseMode === "sale" &&
                          ((user.use_vat && !bid.vendor_use_vat) ||
                            (user.use_vat && bid.vendor_use_vat) ||
                            (!user.use_vat && bid.vendor_use_vat))
                            ? "Цена с учётом НДС и доставки до:"
                            : salePurchaseMode === "sale"
                            ? "Цена без НДС с учетом доставки до:"
                            : "Цена указана с учётом доставки до:"}{" "} */}
                          <b className={innerClasses.deliveryAddress}>
                            {!!bid?.point_prices && !!bid.point_prices.length
                              ? bid.point_prices.map(
                                  (item, i) =>
                                    i === 0 &&
                                    (i === 0 ? (
                                      <b key={i} className={innerClasses.deliveryAddress}>
                                        {` в ${item.point.name}`}
                                      </b>
                                    ) : (
                                      <b key={i} className={innerClasses.deliveryAddress}>
                                        {` в ${item.point.name}`}
                                      </b>
                                    ))
                                )
                              : "-"}
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
                {bestAllMyMode !== "my-bids" && hasActivePoints && (
                  <>
                    {bestAllMyMode !== "edit" && (
                      <div className={innerClasses.wrapperPrice}>
                        <div className={innerClasses.price}>
                          {newBid
                            ? formatAsThousands(newBid.finalPrice)
                            : bid?.price_with_delivery_with_vat
                            ? formatAsThousands(Math.round(bid.price_with_delivery_with_vat))
                            : "-"}{" "}
                        </div>
                        <div className={innerClasses.rybl}>₽</div>
                        {salePurchaseMode === "sale" && (
                          <div className={innerClasses.nds}>
                            {(user.use_vat && !bid.vendor_use_vat) ||
                            (user.use_vat && bid.vendor_use_vat) ||
                            (!user.use_vat && bid.vendor_use_vat)
                              ? "Цена указана с НДС"
                              : "Цена указана без НДС"}{" "}
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </>
            ) : (
              <>
                {bestAllMyMode !== "my-bids" && hasActivePoints && (
                  <>
                    {bestAllMyMode !== "edit" && (
                      <div className={innerClasses.wrapperPrice}>
                        <div className={innerClasses.price}>
                          {newBid
                            ? formatAsThousands(newBid.finalPrice)
                            : bid?.price_with_delivery_with_vat
                            ? formatAsThousands(Math.round(bid.price_with_delivery_with_vat))
                            : "-"}{" "}
                        </div>
                        <div className={innerClasses.rybl}>₽</div>
                        {salePurchaseMode === "sale" && (
                          <div className={innerClasses.nds}>
                            {(user.use_vat && !bid.vendor_use_vat) ||
                            (user.use_vat && bid.vendor_use_vat) ||
                            (!user.use_vat && bid.vendor_use_vat)
                              ? "Цена указана с НДС"
                              : "Цена указана без НДС"}{" "}
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
                {bestAllMyMode !== "my-bids" && accessByRoles(user, ["ROLE_ADMIN", "ROLE_MANAGER", "ROLE_TRADER", "ROLE_BUYER"]) && (
                  <>
                    {bestAllMyMode !== "edit" && (
                      <div className={innerClasses.wrapperPrice}>
                        <b className={innerClasses.delivery}>
                          {salePurchaseMode === "sale" ? "С учётом доставки до:" : "Цена указана с учётом доставки до:"}
                          {/* {salePurchaseMode === "sale" &&
                          ((user.use_vat && !bid.vendor_use_vat) ||
                            (user.use_vat && bid.vendor_use_vat) ||
                            (!user.use_vat && bid.vendor_use_vat))
                            ? "Цена с учётом НДС и доставки до:"
                            : salePurchaseMode === "sale"
                            ? "Цена без НДС с учетом доставки до:"
                            : "Цена указана с учётом доставки до:"}{" "} */}
                          <b className={innerClasses.deliveryAddress}>
                            {!!bid?.point_prices && !!bid.point_prices.length
                              ? bid.point_prices.map(
                                  (item, i) =>
                                    i === 0 &&
                                    (i === 0 ? (
                                      <b key={i} className={innerClasses.deliveryAddress}>
                                        {` в ${item.point.name}`}
                                      </b>
                                    ) : (
                                      <b key={i} className={innerClasses.deliveryAddress}>
                                        {` в ${item.point.name}`}
                                      </b>
                                    ))
                                )
                              : "-"}
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
                <div className={innerClasses.wrapperPrice}>
                  <b className={innerClasses.delivery}>
                    {salePurchaseMode === "sale" ? (
                      <>
                        Место отгрузки: <b className={innerClasses.deliveryAddress}>{`${bid.location.text}`}</b>
                      </>
                    ) : (
                      <>
                        Цена <b className={innerClasses.deliveryAddress}>{`(${bid.location.text})`}</b>
                      </>
                    )}
                  </b>
                </div>
                <div className={innerClasses.wrapperPrice}>
                  {salePurchaseMode === "sale" ? (
                    <>
                      {bid.price ? (
                        <>
                          {/*Если покупатель работает с НДС, а объявление продавца было установлено без работы с ндс, то мы добавляем +10 процент*/}
                          {user.use_vat && !bid.vendor_use_vat && (
                            <>
                              <div className={innerClasses.price}>
                                {formatAsThousands(!!bid && Math.round(bid.price * ((bid.vat || 0) / 100 + 1)))}{" "}
                              </div>
                              <div className={innerClasses.rybl}>₽</div>
                              <div className={innerClasses.nds}>{`Цена указана с НДС`}</div>
                            </>
                          )}

                          {/*Если покупатель работает с НДС, а объявление продавца было установлено, когда он работал с НДС*/}
                          {user.use_vat && bid.vendor_use_vat && (
                            <>
                              <div className={innerClasses.price}>{formatAsThousands(Math.round(bid.price))} </div>
                              <div className={innerClasses.rybl}>₽</div>
                              <div className={innerClasses.nds}>{`Цена указана с НДС`}</div>
                            </>
                          )}

                          {/*Когда покупатель не работает с НДС, а у продавца установлено объявление, когда тот не работал с НДС*/}
                          {!user.use_vat && !bid.vendor_use_vat && (
                            <>
                              <div className={innerClasses.price}>{formatAsThousands(Math.round(bid.price))} </div>
                              <div className={innerClasses.rybl}>₽</div>
                              <div className={innerClasses.nds}>Цена указана без НДС</div>
                            </>
                          )}

                          {/*Когда покупатель не работает с НДС, а у продавец выставил объявление работая с НДС*/}
                          {!user.use_vat && bid.vendor_use_vat && (
                            <>
                              <div className={innerClasses.price}>{formatAsThousands(Math.round(bid.price))} </div>
                              <div className={innerClasses.rybl}>₽</div>
                              <div className={innerClasses.nds}>{`Цена указана с НДС`}</div>
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
                          <div className={innerClasses.price}>{formatAsThousands(Math.round(bid.price))} </div>
                          <div className={innerClasses.rybl}>₽</div>
                        </>
                      ) : (
                        <div className={innerClasses.rybl}>-</div>
                      )}
                    </>
                  )}
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
                  <>
                    <div className={innerClasses.textDrop}>{newBid?.distance || bid.distance || "-"}</div>
                    <Button
                      variant="text"
                      color="primary"
                      className={innerClasses.btnCard}
                      onClick={e => {
                        stopProp(e);
                        handleOpenMap(bid);
                      }}
                    >
                      <div className={innerClasses.textCard}>Посмотреть на карте</div>
                    </Button>
                  </>
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
                    {user && ["ROLE_ADMIN", "ROLE_MANAGER"].includes(user.roles[0]) && bestAllMyMode === "edit" && (
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
                    {user && ["ROLE_ADMIN", "ROLE_MANAGER"].includes(user.roles[0]) && bestAllMyMode === "edit" ? (
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
              </div>
            )}
          </div>
        </div>
        <div className={innerClasses.wrapperInfoBlock}>
          <div className={innerClasses.containerInfoBlock}>
            {!isMobile && (
              <>
                <div className={innerClasses.wrapperPrice}>
                  {salePurchaseMode === "sale" ? (
                    <>
                      {bid.price ? (
                        <>
                          {/*Если покупатель работает с НДС, а объявление продавца было установлено без работы с ндс, то мы добавляем +10 процент*/}
                          {user.use_vat && !bid.vendor_use_vat && (
                            <>
                              <div className={innerClasses.price}>
                                {formatAsThousands(!!bid && Math.round(bid.price * ((bid.vat || 0) / 100 + 1)))}{" "}
                              </div>
                              <div className={innerClasses.rybl}>₽</div>
                              <div className={innerClasses.nds}>{`Цена указана с НДС`}</div>
                            </>
                          )}

                          {/*Если покупатель работает с НДС, а объявление продавца было установлено, когда он работал с НДС*/}
                          {user.use_vat && bid.vendor_use_vat && (
                            <>
                              <div className={innerClasses.price}>{formatAsThousands(Math.round(bid.price))} </div>
                              <div className={innerClasses.rybl}>₽</div>
                              <div className={innerClasses.nds}>{`Цена указана с НДС`}</div>
                            </>
                          )}

                          {/*Когда покупатель не работает с НДС, а у продавца установлено объявление, когда тот не работал с НДС*/}
                          {!user.use_vat && !bid.vendor_use_vat && (
                            <>
                              <div className={innerClasses.price}>{formatAsThousands(Math.round(bid.price))} </div>
                              <div className={innerClasses.rybl}>₽</div>
                              <div className={innerClasses.nds}>Цена указана без НДС</div>
                            </>
                          )}

                          {/*Когда покупатель не работает с НДС, а у продавец выставил объявление работая с НДС*/}
                          {!user.use_vat && bid.vendor_use_vat && (
                            <>
                              <div className={innerClasses.price}>{formatAsThousands(Math.round(bid.price))} </div>
                              <div className={innerClasses.rybl}>₽</div>
                              <div className={innerClasses.nds}>{`Цена указана с НДС`}</div>
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
                          <div className={innerClasses.price}>{formatAsThousands(Math.round(bid.price))} </div>
                          <div className={innerClasses.rybl}>₽</div>
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
                        Цена <b className={innerClasses.deliveryAddress}>{`(${bid.location.text})`}</b>
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
                  <div className={innerClasses.textPhone}>{`${bid.created_at.slice(8, 10)}.${bid.created_at.slice(
                    5,
                    7
                  )}.${bid.created_at.slice(0, 4)}`}</div>
                </div>
                {bid.vendor.phone && (
                  <Button
                    variant="outlined"
                    color="primary"
                    className={innerClasses.btnShowPhone}
                    onClick={e => {
                      stopProp(e);
                      handleShowPhone(bid.id);
                    }}
                  >
                    <div className={innerClasses.wrapperTextShowBtn}>
                      {showsPhones.find(item => item === bid.id) ? (
                        <div className={innerClasses.textPhone} style={{ textAlign: "center" }}>
                          <a href={`tel:${formatPhone(bid.vendor.phone)}`}>{formatPhone(bid.vendor.phone)}</a>
                        </div>
                      ) : (
                        <>
                          <div className={innerClasses.textPhone}>+7 *** *** ***</div>
                          <div className={innerClasses.btnTextShowPhone}>Показать номер</div>
                        </>
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
                    className={innerClasses.btnShowPhone}
                    onClick={e => {
                      stopProp(e);
                      handleShowPhone(bid.id);
                    }}
                  >
                    <div className={innerClasses.wrapperTextShowBtn}>
                      {showsPhones.find(item => item === bid.id) ? (
                        <div className={innerClasses.textPhone} style={{ textAlign: "center" }}>
                          <a href={`tel:${formatPhone(bid.vendor.phone)}`}>{formatPhone(bid.vendor.phone)}</a>
                        </div>
                      ) : (
                        <>
                          <div className={innerClasses.textPhone}>+7 *** *** ***</div>
                          <div className={innerClasses.btnTextShowPhone}>Показать номер</div>
                        </>
                      )}
                    </div>
                  </Button>
                )}
              </>
            )}

            <div className={innerClasses.wrapperInfoCompany} style={{ justifyContent: "space-between" }}>
              <div className={innerClasses.companyWrapper}>
                <div className={innerClasses.nameVendor}>
                  {Boolean(bid.vendor.surname || bid.vendor.firstName || bid.vendor.firstName)
                    ? `${bid.vendor.surname || ""} ${bid.vendor.firstName || ""} ${bid.vendor.lastName || ""}`
                    : bid.vendor.login || ""}
                </div>
                {bid.vendor?.company?.short_name && <div className={innerClasses.nameCompany}>{bid.vendor.company.short_name}</div>}
              </div>
              {!isMobile && (
                <div className={innerClasses.companyInfo} style={{ marginLeft: 20 }}>
                  <div className={innerClasses.datePublic}>Дата публикации:</div>
                  <div className={innerClasses.textCreateAt}>{`${bid.created_at.slice(8, 10)}.${bid.created_at.slice(
                    5,
                    7
                  )}.${bid.created_at.slice(0, 4)}`}</div>
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
                    style={{ width: "100%", marginBottom: 4, marginTop: 16, padding: "4px 8px" }}
                    onClick={e => {
                      stopProp(e);
                      handleOpenMap(bid);
                    }}
                  >
                    <div className={innerClasses.textCard}>Посмотреть на карте</div>
                  </Button>
                  {user && ["ROLE_ADMIN", "ROLE_MANAGER"].includes(user.roles[0]) && bestAllMyMode === "edit" && (
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

                  {user && ["ROLE_ADMIN", "ROLE_MANAGER"].includes(user.roles[0]) && bestAllMyMode === "edit" ? (
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
    );
  }
);

export default Bid;
