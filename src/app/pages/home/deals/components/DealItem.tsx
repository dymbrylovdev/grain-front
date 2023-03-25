import React, {ChangeEvent, FC, useCallback, useEffect, useMemo, useState} from 'react';
import {
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  IconButton,
  TableCell,
  TableRow, TextField,
  Tooltip
} from "@material-ui/core";
import AgricultureIcon from '@mui/icons-material/Agriculture';
import {сompareRoles} from "../../../../utils/utils";
import {thousands} from "../utils/utils";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import VisibilityIcon from "@material-ui/icons/Visibility";
import {IDeal} from "../../../../interfaces/deals";
import { ICrop } from '../../../../interfaces/crops';
import {TRole} from "../../../../interfaces/users";
import {IntlShape} from "react-intl";
import {ILocalDeals} from "../DealViewPage";
import {useHistory} from "react-router-dom";
import { IBid } from '../../../../interfaces/bids';
import moment from 'moment';
import NumberFormatCustom from "../../../../components/NumberFormatCustom/NumberFormatCustom";

interface IProps {
  item: IDeal;
  crops: ICrop[];
  rolesBidUser?: TRole[] | null;
  classes: any;
  intl: IntlShape;
  bidSelected: IBid | null;
  loadFuncRef: any;
  handleLoadingDist: (deal: IDeal, setLoadDistanation: (load: boolean) => void) => void;
}

const DealItem: FC<IProps> = ({
  item,
  crops,
  rolesBidUser,
  classes,
  intl,
  bidSelected,
  handleLoadingDist,
  loadFuncRef,
}) => {
  const [overloadCheck, setOverloadCheck] = useState<boolean>(false);
  const [coefficientValue, setCoefficientValue] = useState<number | null | undefined | string>(null);
  const [loadDistanation, setLoadDistanation] = useState<boolean>(false);
  const history = useHistory();

  // memo **************

  const localDeals: ILocalDeals[] | null = useMemo(() => {
    const storageDeals = localStorage.getItem("deals");
    return storageDeals ? JSON.parse(storageDeals) : null;
  }, [item, loadDistanation]);

  const currentCrop = useMemo<ICrop | undefined>(() => crops?.find(crop => crop.id === item.sale_bid.crop_id), [crops, item]);

  // handlers **************

  const handleLoad = (load: boolean) => {
    setLoadDistanation(load)
  }

  const changeCoefficientValue = (coefficientUser?: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> & {nativeEvent: {data: string}}) => {
    const value = coefficientUser?.target.value;
    if ( value || value === '' ) {
      if (Number(value) <= 0) {
        setCoefficientValue("")
        return;
      }
      setCoefficientValue( Boolean(value) ?
        Number(value) : 0)
    } else {
      const newCoefficient = !overloadCheck ?
        crops.find(crop => crop.id === item.sale_bid.crop_id)?.delivery_price_overload :
        crops.find(crop => crop.id === item.sale_bid.crop_id)?.delivery_price_coefficient;
      newCoefficient && setCoefficientValue(newCoefficient);
      setOverloadCheck(!overloadCheck);
    }
  }

  const handleKeyPress = (event) => {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode !== 8 && charCode !== 0 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
    }
  };

  const getDistance = useCallback(
    (currentDeal: IDeal, noneElement?: boolean) => {
      if (localDeals) {
        const localDistance = localDeals.find(
          item =>
            item.purchase_bid.lat === currentDeal.purchase_bid.location.lat &&
            item.purchase_bid.lng === currentDeal.purchase_bid.location.lng &&
            item.sale_bid.lat === currentDeal.sale_bid.location.lat &&
            item.sale_bid.lng === currentDeal.sale_bid.location.lng
        );
        if (localDistance) {
          return {
            isLocal: true,
            data: noneElement ? (
              localDistance.distance
            ) : (
              <div className={classes.tableCellModifed}>{localDistance.distance}</div>
            ),
          };
        }
      }
      return {
        isLocal: false,
        data: noneElement ? currentDeal.distance : <div>{currentDeal.distance}</div>,
      };
    },
    [localDeals]
  );

  const localDistance : {
    isLocal: boolean;
    data: number | JSX.Element;
  } = useMemo(() => getDistance(item, true), [getDistance, item]);

  const getProfit = useCallback(
    (currentDeal: IDeal) => {
      if (localDistance.data && typeof localDistance.data === "number" && (coefficientValue || coefficientValue === 0)) {
        const distance = localDistance.data > 100 ? localDistance.data : 100;
        const deliveryPrice = distance * +coefficientValue;
        return (
          <TableCell className={localDistance.isLocal ? classes.tableCellModifed : undefined} style={{
            paddingTop: 8,
            paddingBottom: 8,
            color: (currentDeal.purchase_bid.price -
              Math.round(currentDeal.sale_bid.price * (currentDeal.sale_bid.vat / 100 + 1)) -
              distance * +coefficientValue) < 0 ? "#000000" : "#21BA88"
          }}>
            {!!currentDeal?.purchase_bid?.vendor.use_vat && !!currentDeal?.sale_bid?.vat && !currentDeal.sale_bid.vendor.use_vat ? (
              <>
                {currentDeal.purchase_bid.price -
                  Math.round(currentDeal.sale_bid.price * (currentDeal.sale_bid.vat / 100 + 1)) - deliveryPrice}
              </>
            ) : (
              <>{currentDeal.purchase_bid.price - currentDeal.sale_bid.price - deliveryPrice}</>
            )}
          </TableCell>
        );
      }
      return <TableCell className={classes.tableCell} style={{
        color: currentDeal.profit_with_delivery_price < 0? "#000000" : "#21BA88"
      }}>{Math.round(currentDeal.profit_with_delivery_price)}</TableCell>;
    },
    [getDistance, coefficientValue, localDistance, item]
  );

  const getPercent = useCallback(
    (currentDeal: IDeal) => {
      // console.log("distance", currentDeal.distance)
      // console.log("data", localDistance.data)
      if (localDistance.data && typeof localDistance.data === "number" && coefficientValue) {
        const distance = localDistance.data > 100 ? localDistance.data : 100;
        const deliveryPrice = distance * +coefficientValue;
        const result = Number((((currentDeal.purchase_bid.price - currentDeal.sale_bid.price - deliveryPrice)
          / (currentDeal.purchase_bid.price + deliveryPrice)) * 100).toFixed(0));
        return (
          <TableCell className={classes.tableCell}>
            <div style={{
              color: result < 0 ? "#000000" : "#21BA88"
            }}>
              {result}%
            </div>
          </TableCell>
        );
      }
      return <TableCell className={classes.tableCell}>
        <div style={{
          color: item.profit_with_delivery_price / item.purchase_bid.price_with_delivery < 0 ? "#000000" : "#21BA88"
        }}>
          {Number(((item.profit_with_delivery_price / item.purchase_bid.price_with_delivery) * 100).toFixed(0))}%
        </div>
      </TableCell>
    },
    [getDistance, coefficientValue, localDistance, item]
  );

  const checkDealAge = useCallback((bid) => {
    const now = moment(new Date());
    const end = moment(bid?.modified_at);
    const duration = moment.duration(now.diff(end));
    const days = duration.asDays();
    return days > 30 ? true : false
  }, []);

  // useEffects **************

  useEffect(() => {
    currentCrop && setCoefficientValue(currentCrop?.delivery_price_coefficient);
  },[currentCrop])

  return (
    <TableRow key={item.sale_bid.id}>
      {!bidSelected && (<TableCell className={classes.tableCell}>{crops.find(crop => crop.id === item.sale_bid.crop_id)?.name}</TableCell>)}
      {rolesBidUser && сompareRoles(rolesBidUser, "ROLE_VENDOR") ? (
        <></>
      ) : (
        <TableCell
          className={classes.tableCell}
          style={{
            backgroundColor:  checkDealAge(item.sale_bid)? '#ffeaea' : '#ffffff'
          }}
        >
          <div className={classes.flexColumn}>
            {(rolesBidUser && bidSelected && сompareRoles(rolesBidUser, "ROLE_BUYER")) ? (
              <></>
            ) : (
              <div>
                <div style={{ display: "flex" }}>
                  <strong style={{ marginRight: 5 }}>{intl.formatMessage({ id: "DEALS.TABLE.PRICE" })}</strong>
                  <strong>
                    {!!item?.purchase_bid?.vendor.use_vat && !!item?.sale_bid?.vat && !item.sale_bid.vendor.use_vat ? (
                      !item.sale_bid.price ? (
                        "-"
                      ) : (
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <p style={{ marginBottom: "1px", marginRight: 10 }}>
                            {!!item.sale_bid && thousands(Math.round(item.sale_bid.price * (item.sale_bid.vat / 100 + 1)))}
                          </p>
                          <p style={{ marginBottom: 0, color: "#999999", fontSize: "10px" }}>
                            ({`${item.sale_bid.price && thousands(Math.round(item.sale_bid.price))} + ${item.sale_bid.vat}% НДС`})
                          </p>
                        </div>
                      )
                    ) : item.sale_bid.price ? (
                      thousands(Math.round(item.sale_bid.price))
                    ) : (
                      "-"
                    )}
                  </strong>
                </div>
                <div>
                  <strong>{intl.formatMessage({ id: "DEALS.TABLE.VOLUME" })}</strong>
                  <strong>{item.sale_bid.volume}</strong>
                </div>
              </div>
            )}
            <div>
              <div>
                {!item?.sale_bid.vendor.company && (
                  <span>
                    {item?.sale_bid.vendor.surname || ""} {item?.sale_bid.vendor.firstname || ""} {item?.sale_bid.vendor.lastname || ""}
                  </span>
                )}
              </div>
              {item?.sale_bid.vendor.company && (
                <div className={classes.flexRow}>
                  <div>{`${item?.sale_bid.vendor.company.short_name || ""}`}</div>
                </div>
              )}
            </div>
            <div style={{
              fontSize: 12,
            }}>
              {item.sale_bid.modified_at && (
                intl.formatDate(item.sale_bid.modified_at)
              )}
            </div>
          </div>
        </TableCell>
      )}
      {rolesBidUser && сompareRoles(rolesBidUser, "ROLE_BUYER") ? (
        <></>
      ) : (
        <TableCell
          className={classes.tableCell}
          style={{
            backgroundColor:  checkDealAge(item.purchase_bid)? '#ffeaea' : '#ffffff'
          }}
        >
          <div className={classes.flexColumn}>
          {(rolesBidUser && bidSelected && сompareRoles(rolesBidUser, "ROLE_VENDOR")) ? (
              <></>
            ) : (
              <div>
                <div>
                  <strong>{intl.formatMessage({ id: "DEALS.TABLE.PRICE" })}</strong>
                  <strong>{item.purchase_bid.price}</strong>
                </div>
                <div>
                  <strong>{intl.formatMessage({ id: "DEALS.TABLE.VOLUME" })}</strong>
                  <strong>{item.purchase_bid.volume}</strong>
                </div>
              </div>
            )}
            <div>
              <div>
                {!item?.purchase_bid.vendor.company && (
                  <span>
                    {item?.purchase_bid.vendor.surname || ""} {item?.purchase_bid.vendor.firstname || ""} {item?.purchase_bid.vendor.lastname || ""}
                  </span>
                )}
              </div>
              {item?.purchase_bid.vendor.company && (
                <div className={classes.flexRow}>
                  <div>{`${item?.purchase_bid.vendor.company.short_name || ""}`}</div>
                </div>
              )}
            </div>
            <div style={{
              fontSize: 12,
            }}>
              {item.purchase_bid.modified_at && (
                intl.formatDate(item.purchase_bid.modified_at)
              )}
            </div>
          </div>
        </TableCell>
      )}
      {!(rolesBidUser && bidSelected && сompareRoles(rolesBidUser, "ROLE_BUYER")) ? (
        <></>
      ) : (
        <TableCell className={classes.tableCell}>
          <div style={{ display: "flex" }}>
            <strong>
              {!!item?.purchase_bid?.vendor.use_vat && !!item?.sale_bid?.vat && !item.sale_bid.vendor.use_vat ? (
                !item.sale_bid.price ? (
                  "-"
                ) : (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <p style={{ marginBottom: "1px", marginRight: 10 }}>
                      {!!item.sale_bid && thousands(Math.round(item.sale_bid.price * (item.sale_bid.vat / 100 + 1)))}
                    </p>
                    <p style={{ marginBottom: 0, color: "#999999", fontSize: "10px" }}>
                      ({`${item.sale_bid.price && thousands(Math.round(item.sale_bid.price))} + ${item.sale_bid.vat}% НДС`})
                    </p>
                  </div>
                )
              ) : item.sale_bid.price ? (
                thousands(Math.round(item.sale_bid.price))
              ) : (
                "-"
              )} руб.
            </strong>
          </div>
        </TableCell>
      )}
      {!(rolesBidUser && bidSelected && сompareRoles(rolesBidUser, "ROLE_BUYER")) ? (
        <></>
      ) : (
        <TableCell className={classes.tableCell}>
          <div>
            <strong>{item.sale_bid.volume} т.</strong>
          </div>
        </TableCell>
      )}
      {!(rolesBidUser && bidSelected && сompareRoles(rolesBidUser, "ROLE_VENDOR")) ? (
        <></>
      ) : (
        <TableCell className={classes.tableCell}>
          <div>
            <strong>{item.purchase_bid.price} руб.</strong>
          </div>
        </TableCell>
      )}
      {!(rolesBidUser && bidSelected && сompareRoles(rolesBidUser, "ROLE_VENDOR")) ? (
        <></>
      ) : (
        <TableCell className={classes.tableCell}>
          <div>
            <strong>{item.purchase_bid.volume} т.</strong>
          </div>
        </TableCell>
      )}
      <TableCell className={classes.tableCell}>
        <div>Цена доставки: {localDistance.data && typeof localDistance.data === "number" && (coefficientValue || coefficientValue === "") ? (
            (localDistance.data > 100 ? localDistance.data : 100) * Number(coefficientValue)
          ) : '-'}</div>
      </TableCell>
      <TableCell className={classes.tableCell}>
        <FormControlLabel
          control={<Checkbox
            checked={overloadCheck}
            onClick={() => changeCoefficientValue()}/>}
            label={intl.formatMessage({
              id: "OPTIONS.OVERLOAD",
            })}
        />
        <div className={classes.tariffBlock}>
          <div style={{marginRight: 5}}>Тариф:</div>
          <TextField
            type="text"
            margin="dense"
            variant="outlined"
            autoComplete="off"
            style={{width: 60}}
            InputProps={{
              inputComponent: NumberFormatCustom as any,
              style: {
                height: 25
              },
            }}
            onKeyPress={handleKeyPress}
            value={coefficientValue}
            onChange={(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> & {nativeEvent: {data: string}}) => {
              changeCoefficientValue(event);
            }}
          />
        </div>
      </TableCell>
      {getProfit(item)}
      {getPercent(item)}
      <TableCell className={classes.tableCell}>{item.purchase_bid.payment_term || "-"}</TableCell>
      <TableCell className={classes.tableCell} align="center">
        {getDistance(item).data}
      </TableCell>
      <TableCell>
        <div>
          <Button
            size="medium"
            color="primary"
            onClick={() => history.push(`/deals/view/${item.purchase_bid.crop_id}/${item.sale_bid.id}/${item.purchase_bid.id}`)}
          >
            <VisibilityIcon />
          </Button>
        </div>
        <div>
          <Button
            disabled={loadDistanation || loadFuncRef}
            variant="text"
            color="primary"
            onClick={() => {
              handleLoadingDist(item, handleLoad);
            }}
          >
            {loadDistanation ? <CircularProgress size={20} /> : <div><AgricultureIcon /></div>}
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default React.memo(DealItem);
