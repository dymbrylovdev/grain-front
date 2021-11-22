import React, { useCallback, useMemo, useRef, useState } from "react";
import { IconButton, Tooltip, CardMedia, Button, useMediaQuery } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
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
import "react-alice-carousel/lib/alice-carousel.css";

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
  }) => {
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

    const photos = ["/images/defaultImage.jpg", "/images//wheat (1).jpg", "/images//wheat (2).jpg", "/images//wheat (3).jpg"];

    const items = useMemo(() => {
      const arrImg: any = [];
      photos.forEach((item, index) =>
        arrImg.push(
          <div className={innerClasses.wrapperImage}>
            <img src={toAbsoluteUrl(item)} className={innerClasses.image} alt={index.toString()} />
          </div>
        )
      );
      return arrImg;
    }, []);

    const arrImgIndex = useMemo(() => {
      if (photos && photos.length > 0) {
        const arrImg: number[] = [];
        photos.forEach((_, index) => arrImg.push(index));
        return arrImg;
      }
      return null;
    }, [photos]);

    const handleDot = useCallback(
      (index: number) => {
        setCurrentIndex(index);
        caruselRef.current.slideTo(index);
      },
      [caruselRef]
    );

    return (
      <div className={innerClasses.container}>
        <div className={innerClasses.imageBlock}>
          <div className={innerClasses.imageBlocks} style={{ zIndex: 1 }}>
            {!!bid?.vendor && (bid.vendor.company_confirmed_by_payment || bid.vendor.company_confirmed_by_email) && (
              <div className={innerClasses.imageFirstBlock}>
                <div className={innerClasses.fontImageText}>Связь подтверждена</div>
              </div>
            )}
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
          </div>
          {arrImgIndex && (
            <div className={innerClasses.containerDot}>
              {arrImgIndex.map(item => (
                <div className={innerClasses.wrapperDot} onClick={() => handleDot(item)}>
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
                          С доставкой:{" "}
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
                          <b className={innerClasses.btnChangeDelivery}>(Изменить)</b>
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
                        {/* <div className={innerClasses.nds}>БЕЗ НДС</div> */}
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
                        {/* <div className={innerClasses.nds}>БЕЗ НДС</div> */}
                      </div>
                    )}
                  </>
                )}
                {bestAllMyMode !== "my-bids" && accessByRoles(user, ["ROLE_ADMIN", "ROLE_MANAGER", "ROLE_TRADER", "ROLE_BUYER"]) && (
                  <>
                    {bestAllMyMode !== "edit" && (
                      <div className={innerClasses.wrapperPrice}>
                        <b className={innerClasses.delivery}>
                          С доставкой:{" "}
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
                          <b className={innerClasses.btnChangeDelivery}>(Изменить)</b>
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
                    Цена
                    <b className={innerClasses.deliveryAddress}>{` (${bid.location.text})`}</b>
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
                              <div className={innerClasses.nds}> {`${bid.price && Math.round(bid.price)} + ${bid.vat}% НДС`}</div>
                            </>
                          )}

                          {/*Если покупатель работает с НДС, а объявление продавца было установлено, когда он работал с НДС*/}
                          {user.use_vat && bid.vendor_use_vat && (
                            <>
                              <div className={innerClasses.price}>{formatAsThousands(Math.round(bid.price))} </div>
                              <div className={innerClasses.rybl}>₽</div>
                              <div className={innerClasses.nds}>С НДС</div>
                            </>
                          )}

                          {/*Когда покупатель не работает с НДС, а у продавца установлено объявление, когда тот не работал с НДС*/}
                          {!user.use_vat && !bid.vendor_use_vat && (
                            <>
                              <div className={innerClasses.price}>{formatAsThousands(Math.round(bid.price))} </div>
                              <div className={innerClasses.rybl}>₽</div>
                              <div className={innerClasses.nds}>БЕЗ НДС</div>
                            </>
                          )}

                          {/*Когда покупатель не работает с НДС, а у продавец выставил объявление работая с НДС*/}
                          {!user.use_vat && bid.vendor_use_vat && (
                            <>
                              <div className={innerClasses.price}>{formatAsThousands(Math.round(bid.price))} </div>
                              <div className={innerClasses.rybl}>₽</div>
                              <div className={innerClasses.nds}>C НДС</div>
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
                    <Button variant="text" color="primary" className={innerClasses.btnCard} onClick={() => handleOpenMap(bid)}>
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
                      <IconButton size="medium" color="primary">
                        <EmailIcon
                          onClick={() => {
                            setSubDialogOpen(true);
                            setOpenedSubBidId(bid.id);
                          }}
                        />
                      </IconButton>
                    )}
                    {user && ["ROLE_ADMIN", "ROLE_MANAGER"].includes(user.roles[0]) && bestAllMyMode === "edit" ? (
                      <IconButton size="medium" color="primary" onClick={() => handleClickEditOrViewBid(bid)}>
                        <EditIcon />
                      </IconButton>
                    ) : (
                      <Button
                        color="primary"
                        variant="contained"
                        className={innerClasses.btnDetailed}
                        onClick={() => handleClickEditOrViewBid(bid)}
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
                    {isHaveRules && isHaveRules(user, bid.vendor.id) ? (
                      <IconButton
                        size="medium"
                        color="primary"
                        onClick={() => history.push(`/bid/edit/${bid.type}/${bid.id}/${bid.crop_id}`)}
                      >
                        <EditIcon />
                      </IconButton>
                    ) : (
                      <Button
                        color="primary"
                        variant="contained"
                        className={innerClasses.btnDetailed}
                        onClick={() => history.push(`/bid/edit/${bid.type}/${bid.id}/${bid.crop_id}`)}
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
                    <IconButton size="medium" onClick={() => handleDeleteDialiog(bid.id)} color="secondary">
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
                              <div className={innerClasses.nds}> {`${bid.price && Math.round(bid.price)} + ${bid.vat}% НДС`}</div>
                            </>
                          )}

                          {/*Если покупатель работает с НДС, а объявление продавца было установлено, когда он работал с НДС*/}
                          {user.use_vat && bid.vendor_use_vat && (
                            <>
                              <div className={innerClasses.price}>{formatAsThousands(Math.round(bid.price))} </div>
                              <div className={innerClasses.rybl}>₽</div>
                              <div className={innerClasses.nds}>С НДС</div>
                            </>
                          )}

                          {/*Когда покупатель не работает с НДС, а у продавца установлено объявление, когда тот не работал с НДС*/}
                          {!user.use_vat && !bid.vendor_use_vat && (
                            <>
                              <div className={innerClasses.price}>{formatAsThousands(Math.round(bid.price))} </div>
                              <div className={innerClasses.rybl}>₽</div>
                              <div className={innerClasses.nds}>БЕЗ НДС</div>
                            </>
                          )}

                          {/*Когда покупатель не работает с НДС, а у продавец выставил объявление работая с НДС*/}
                          {!user.use_vat && bid.vendor_use_vat && (
                            <>
                              <div className={innerClasses.price}>{formatAsThousands(Math.round(bid.price))} </div>
                              <div className={innerClasses.rybl}>₽</div>
                              <div className={innerClasses.nds}>C НДС</div>
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
                    Цена <b className={innerClasses.deliveryAddress}>{`(${bid.location.text})`}</b>
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
                  <Button variant="outlined" color="primary" className={innerClasses.btnShowPhone} onClick={() => handleShowPhone(bid.id)}>
                    <div className={innerClasses.wrapperTextShowBtn}>
                      {showsPhones.find(item => item === bid.id) ? (
                        <div className={innerClasses.textPhone}>{formatPhone(bid.vendor.phone)}</div>
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
                  <Button variant="outlined" color="primary" className={innerClasses.btnShowPhone} onClick={() => handleShowPhone(bid.id)}>
                    <div className={innerClasses.wrapperTextShowBtn}>
                      {showsPhones.find(item => item === bid.id) ? (
                        <div className={innerClasses.textPhone}>{formatPhone(bid.vendor.phone)}</div>
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

            <div className={innerClasses.wrapperInfoCompany}>
              <div className={innerClasses.companyWrapper}>
                <div className={innerClasses.nameVendor}>
                  {Boolean(bid.vendor.surname || bid.vendor.firstName || bid.vendor.firstName)
                    ? `${bid.vendor.surname || ""} ${bid.vendor.firstName || ""} ${bid.vendor.lastName || ""}`
                    : bid.vendor.login || ""}
                </div>
                {bid.vendor?.company?.short_name && <div className={innerClasses.nameCompany}>{bid.vendor.company.short_name}</div>}
              </div>
              {!isMobile && (
                <div className={innerClasses.companyInfo} style={{ marginLeft: 80 }}>
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
                    style={{ width: "100%", marginBottom: 4, marginTop: 16 }}
                    onClick={() => handleOpenMap(bid)}
                  >
                    <div className={innerClasses.textCard}>Посмотреть на карте</div>
                  </Button>
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

                  {user && ["ROLE_ADMIN", "ROLE_MANAGER"].includes(user.roles[0]) && bestAllMyMode === "edit" ? (
                    <IconButton size="medium" color="primary" onClick={() => handleClickEditOrViewBid(bid)}>
                      <EditIcon />
                    </IconButton>
                  ) : (
                    <Button
                      color="primary"
                      variant="contained"
                      className={innerClasses.btnDetailed}
                      style={{ width: "100%" }}
                      onClick={() => handleClickEditOrViewBid(bid)}
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
                  {isHaveRules && isHaveRules(user, bid.vendor.id) ? (
                    <IconButton
                      size="medium"
                      color="primary"
                      onClick={() => history.push(`/bid/edit/${bid.type}/${bid.id}/${bid.crop_id}`)}
                    >
                      <EditIcon />
                    </IconButton>
                  ) : (
                    <Button
                      color="primary"
                      variant="contained"
                      className={innerClasses.btnDetailed}
                      onClick={() => history.push(`/bid/edit/${bid.type}/${bid.id}/${bid.crop_id}`)}
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
                  <IconButton size="medium" onClick={() => handleDeleteDialiog(bid.id)} color="secondary">
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
