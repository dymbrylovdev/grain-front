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
import {сompareRoles} from "../../../../utils/utils";
import {thousands} from "../utils/utils";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import MiniTrafficLight from "../../users/components/miniTrafficLight/MiniTrafficLight";
import VisibilityIcon from "@material-ui/icons/Visibility";
import {IDeal} from "../../../../interfaces/deals";
import { ICrop } from '../../../../interfaces/crops';
import {TRole} from "../../../../interfaces/users";
import {IntlShape} from "react-intl";
import {ILocalDeals} from "../DealViewPage";
import {useHistory} from "react-router-dom";
import {log} from "util";

interface IProps {
  item: IDeal;
  crops: ICrop[];
  rolesBidUser?: TRole[] | null;
  classes: any;
  intl: IntlShape;
  index: number;
}

const DealItem: FC<IProps> = ({
  item,
  crops,
  rolesBidUser,
  classes,
  intl,
  index
}) => {
  const [currentDeal, setCurrentDeal] = useState<IDeal | null>(null);
  const [overloadCheck, setOverloadCheck] = useState<boolean>(false);
  const [loadDistanation, setLoadDistanation] = useState<number | null>(null);
  const [coefficientValue, setCoefficientValue] = useState<number | null | undefined | string>(null);
  const history = useHistory();

  const localDeals: ILocalDeals[] | null = useMemo(() => {
    const storageDeals = localStorage.getItem("deals");
    return storageDeals ? JSON.parse(storageDeals) : null;
  }, [currentDeal]);

  const currentCrop = useMemo<ICrop | undefined>(() => crops?.find(crop => crop.id === item.sale_bid.crop_id), [crops, item]);

  const changeCoefficientValue = (coefficientUser?: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> & {nativeEvent: {data: string}}) => {
    console.log(coefficientUser?.target.value)
    if (coefficientUser?.target.value) {
      if (coefficientUser?.target.value === '') {
        setCoefficientValue(1)
      }
      setCoefficientValue( coefficientUser.target.value.length ?
        Number(coefficientUser.target.value) : "")
    } else {
      const newCoefficient = !overloadCheck ?
        crops.find(crop => crop.id === item.sale_bid.crop_id)?.delivery_price_overload :
        crops.find(crop => crop.id === item.sale_bid.crop_id)?.delivery_price_coefficient;
      console.log("newCoefficient ", newCoefficient)
      newCoefficient && setCoefficientValue(newCoefficient);
      setOverloadCheck(!overloadCheck);
    }
  }

  useEffect(() => {
    currentCrop && setCoefficientValue(currentCrop?.delivery_price_coefficient);
  },[currentCrop])

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
        console.log(localDistance)
        console.log(currentDeal.distance)
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

  const getProfit = useCallback(
    (currentDeal: IDeal) => {
      // const localDistance = getDistance(currentDeal, true);
      const localDistance = getDistance(currentDeal, true);
      if (localDistance.data && typeof localDistance.data === "number" &&  coefficientValue) {
        const distance = localDistance.data > 100 ? localDistance.data : 100;
        // console.log(Math.round(currentDeal.profit_with_delivery_price))
        // console.log(currentDeal.purchase_bid.price_with_delivery)
        // console.log( distance * +coefficientValue)
        return (
          <TableCell className={localDistance.isLocal ? classes.tableCellModifed : undefined} style={{
            color: (currentDeal.purchase_bid.price -
              Math.round(currentDeal.sale_bid.price * (currentDeal.sale_bid.vat / 100 + 1)) -
              distance * +coefficientValue) < 0 ? "#000000" : "#21BA88"
          }}>
            {!!currentDeal?.purchase_bid?.vendor.use_vat && !!currentDeal?.sale_bid?.vat && !currentDeal.sale_bid.vendor.use_vat ? (
              <>
                {currentDeal.purchase_bid.price -
                  Math.round(currentDeal.sale_bid.price * (currentDeal.sale_bid.vat / 100 + 1)) -
                  distance * +coefficientValue}
              </>
            ) : (
              <>{currentDeal.purchase_bid.price - currentDeal.sale_bid.price - distance * +coefficientValue}</>
            )}
          </TableCell>
        );
      }
      return <TableCell style={{
        color: currentDeal.profit_with_delivery_price < 0? "#000000" : "#21BA88"
      }}>{Math.round(currentDeal.profit_with_delivery_price)}</TableCell>;
    },
    [getDistance, coefficientValue]
  );

  return (
    <TableRow key={item.sale_bid.id}>
      <TableCell>{crops.find(crop => crop.id === item.sale_bid.crop_id)?.name}</TableCell>
      {rolesBidUser && сompareRoles(rolesBidUser, "ROLE_VENDOR") ? (
        <></>
      ) : (
        <TableCell>
          <div className={classes.flexColumn}>
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
            <div>
              <div className={classes.flexRow}>
                {item?.sale_bid?.vendor?.company_confirmed_by_payment && (
                  <Tooltip
                    title={intl.formatMessage({
                      id: "USERLIST.TOOLTIP.COMPANY",
                    })}
                  >
                    <CheckCircleOutlineIcon color="secondary" style={{ marginRight: 4, width: 16, height: 16 }} />
                  </Tooltip>
                )}
                <div>{`${item?.sale_bid.vendor.login || ""}`}</div>
              </div>
              <div>{` ${item?.sale_bid.vendor.surname || ""} ${item?.sale_bid.vendor.firstname || ""} ${item?.sale_bid.vendor
                .lastname || ""}`}</div>
              {item?.sale_bid.vendor.company && (
                <div className={classes.flexRow} style={{ marginTop: 10 }}>
                  {!!item?.sale_bid?.vendor?.company?.colors && item?.sale_bid.vendor.company.colors.length > 0 && (
                    <MiniTrafficLight intl={intl} colors={item?.sale_bid.vendor.company.colors} />
                  )}
                  <div>{`${item?.sale_bid.vendor.company.short_name || ""}`}</div>
                </div>
              )}
            </div>
            <div>
              {item.sale_bid.modified_at && (
                'Обновлено: ' + intl.formatDate(item.purchase_bid.modified_at)
              )}
            </div>
          </div>
        </TableCell>
      )}
      {rolesBidUser && сompareRoles(rolesBidUser, "ROLE_BUYER") ? (
        <></>
      ) : (
        <TableCell>
          <div className={classes.flexColumn}>
            <div>
              <strong>{intl.formatMessage({ id: "DEALS.TABLE.PRICE" })}</strong>
              <strong>{item.purchase_bid.price}</strong>
            </div>
            <div>
              <strong>{intl.formatMessage({ id: "DEALS.TABLE.VOLUME" })}</strong>
              <strong>{item.purchase_bid.volume}</strong>
            </div>
            <div>
              <div className={classes.flexRow}>
                {item?.purchase_bid?.vendor?.company_confirmed_by_payment && (
                  <Tooltip
                    title={intl.formatMessage({
                      id: "USERLIST.TOOLTIP.COMPANY",
                    })}
                  >
                    <CheckCircleOutlineIcon color="secondary" style={{ marginRight: 4, width: 16, height: 16 }} />
                  </Tooltip>
                )}
                <div>{`${item?.purchase_bid.vendor.login || ""}`}</div>
              </div>
              <div>{`${item?.purchase_bid.vendor.surname || ""} ${item?.purchase_bid.vendor.firstname || ""} ${item
                ?.purchase_bid.vendor.lastname || ""}`}</div>
              {item?.purchase_bid.vendor.company && (
                <div className={classes.flexRow} style={{ marginTop: 10 }}>
                  {!!item?.purchase_bid?.vendor?.company?.colors && item?.purchase_bid.vendor.company.colors.length > 0 && (
                    <MiniTrafficLight intl={intl} colors={item?.purchase_bid.vendor.company.colors} />
                  )}
                  <div>{`${item?.purchase_bid.vendor.company.short_name || ""}`}</div>
                </div>
              )}
            </div>
            <div>
              {item.purchase_bid.modified_at && (
                'Обновлено: ' + intl.formatDate(item.purchase_bid.modified_at)
              )}
            </div>
          </div>
        </TableCell>
      )}
      <TableCell>
        <FormControlLabel
          control={<Checkbox
            checked={overloadCheck}
            onClick={() => changeCoefficientValue()}/>}
            label={intl.formatMessage({
              id: "OPTIONS.OVERLOAD",
            })}
        />
        <div>Цена доставки: {item.delivery_price ? item.delivery_price : '-'}</div>
        <div>Тариф:</div>
        <TextField
          type="number"
          margin="dense"
          variant="outlined"
          autoComplete="off"
          value={coefficientValue}
          onChange={(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> & {nativeEvent: {data: string}}) => {
            changeCoefficientValue(event);
          }}
        />
      </TableCell>
      {getProfit(item)}
      <TableCell>
        <div style={{
          color: item.profit_with_delivery_price / item.purchase_bid.price_with_delivery <0? "#000000" : "#21BA88"
        }}>
          {Math.abs(Number(((item.profit_with_delivery_price / item.purchase_bid.price_with_delivery) * 100).toFixed(0)))}%
        </div>
      </TableCell>
      <TableCell>{item.purchase_bid.payment_term || "-"}</TableCell>
      <TableCell align="center">
        {getDistance(item).data}
        <div>
          <IconButton
            size="medium"
            color="primary"
            onClick={() => history.push(`/deals/view/${item.purchase_bid.crop_id}/${item.sale_bid.id}/${item.purchase_bid.id}`)}
          >
            <VisibilityIcon />
          </IconButton>
        </div>
        <Button
          disabled={typeof loadDistanation === "number"}
          variant="text"
          color="primary"
          onClick={() => {
            setCurrentDeal(item);
            setLoadDistanation(index);
          }}
        >
          {loadDistanation === index ? <CircularProgress size={20} /> : <div>Уточнить</div>}
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default React.memo(DealItem);
