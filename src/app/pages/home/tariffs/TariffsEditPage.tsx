import React, { useEffect, useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { injectIntl, WrappedComponentProps } from "react-intl";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  makeStyles,
  createStyles,
} from "@material-ui/core";

import { actions as tariffsActions } from "../../../store/ducks/tariffs.duck";

import TopTableCell from "../../../components/ui/Table/TopTableCell";
import useStyles from "../styles";
import { IAppState } from "../../../store/rootDuck";
import { Skeleton } from "@material-ui/lab";
import { LayoutSubheader } from "../../../../_metronic";
import { TTariffField, ITariff } from "../../../interfaces/tariffs";
import EditableCell from "./components/EditableCell";

const useInnerStyles = makeStyles(theme =>
  createStyles({
    tabCell: {
      height: 53,
      minWidth: 63,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    tabCellText: {
      cursor: "pointer",
      width: "max-content",
      padding: 10,
    },
    textField: {
      margin: 0,
      width: 63,
      height: 53,
    },
  })
);

const TariffsEditPage: React.FC<TPropsFromRedux & WrappedComponentProps> = ({
  intl,
  me,

  clearFetch,
  fetch,
  tariffs,
  loading,
  error,

  clearEdit,
  edit,
  editLoading,
  editSuccess,
  editError,
}) => {
  const classes = useStyles();

  const [cell, setCell] = useState<{ id: number; field: TTariffField | undefined }>({
    id: 0,
    field: undefined,
  });

  useEffect(() => {
    fetch();
    return () => {
      clearFetch();
    };
  }, [clearFetch, fetch]);

  if (error) {
    setTimeout(() => {
      window.location.reload();
    }, 10000);
  }

  // console.log("tariffs: ", tariffs);

  return (
    <Paper className={classes.paperWithTable}>
      <LayoutSubheader title={intl.formatMessage({ id: "TARIFFS.MAIN_TITLE" })} />
      <div className={classes.bottomMargin2}></div>
      {!tariffs ? (
        <>
          <Skeleton width="100%" height={52} animation="wave" />
          <Skeleton width="100%" height={77} animation="wave" />
          <Skeleton width="100%" height={77} animation="wave" />
          <Skeleton width="100%" height={77} animation="wave" />
          <Skeleton width="100%" height={77} animation="wave" />
          <Skeleton width="100%" height={77} animation="wave" />
          <Skeleton width="100%" height={77} animation="wave" />
          <Skeleton width="100%" height={77} animation="wave" />
          <Skeleton width="100%" height={77} animation="wave" />
          <Skeleton width="100%" height={77} animation="wave" />
          <Skeleton width="100%" height={77} animation="wave" />
          <Skeleton width="100%" height={52} animation="wave" />
        </>
      ) : (
        <div className={classes.table}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TopTableCell></TopTableCell>
                <TopTableCell colSpan={3} align="center">
                  {intl.formatMessage({ id: "TARIFFS.NAME.FREE" })}
                </TopTableCell>
                <TopTableCell colSpan={2} align="center">
                  {intl.formatMessage({ id: "TARIFFS.NAME.PREMIUM" })}
                </TopTableCell>
                <TopTableCell align="center">{tariffs[19].tariff.name.split("/")[0]}</TopTableCell>
                <TopTableCell colSpan={2} align="center">
                  {intl.formatMessage({ id: "TARIFFS.NAME.INSIDE" })}
                </TopTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell></TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.4)" }}>
                  <b>{intl.formatMessage({ id: "AUTH.REGISTER.BUYER" })}</b>
                </TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.4)" }}>
                  <b>{intl.formatMessage({ id: "AUTH.REGISTER.VENDOR" })}</b>
                </TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.4)" }}>
                  <b>{intl.formatMessage({ id: "AUTH.REGISTER.TRADER" })}</b>
                </TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.4)" }}>
                  <b>{intl.formatMessage({ id: "AUTH.REGISTER.BUYER" })}</b>
                </TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.4)" }}>
                  <b>{intl.formatMessage({ id: "AUTH.REGISTER.VENDOR" })}</b>
                </TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.4)" }}>
                  <b>{intl.formatMessage({ id: "AUTH.REGISTER.TRADER" })}</b>
                </TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(93, 120, 255, 0.4)" }}>
                  <b>{tariffs[23].tariff.name}</b>
                </TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(93, 120, 255, 0.4)" }}>
                  <b>{tariffs[24].tariff.name}</b>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>
                  <b>{intl.formatMessage({ id: "TARIFFS.TITLE1" })}</b>
                </TableCell>
                <TableCell style={{ backgroundColor: "rgba(150, 150, 150, 0.2)" }}></TableCell>
                <TableCell style={{ backgroundColor: "rgba(150, 150, 150, 0.2)" }}></TableCell>
                <TableCell style={{ backgroundColor: "rgba(150, 150, 150, 0.2)" }}></TableCell>
                <TableCell style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}></TableCell>
                <TableCell style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}></TableCell>
                <TableCell style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}></TableCell>
                <TableCell style={{ backgroundColor: "rgba(93, 120, 255, 0.2)" }}></TableCell>
                <TableCell style={{ backgroundColor: "rgba(93, 120, 255, 0.2)" }}></TableCell>
              </TableRow>

              <TableRow>
                <TableCell>{intl.formatMessage({ id: "TARIFFS.TEXT11" })}</TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.2)" }}>
                  <EditableCell
                    useInnerStyles={useInnerStyles}
                    cell={cell}
                    setCell={setCell}
                    tariff={tariffs.find(item => item.id === 2)?.tariff_limits as any}
                    realCell={{ id: 2, field: "priority_places_bids_count" }}
                  />
                </TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.2" }}>
                  <EditableCell
                    useInnerStyles={useInnerStyles}
                    cell={cell}
                    setCell={setCell}
                    tariff={tariffs.find(item => item.id === 6)?.tariff_limits as any}
                    realCell={{ id: 6, field: "priority_places_bids_count" }}
                  />
                </TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.2" }}>
                  <EditableCell
                    useInnerStyles={useInnerStyles}
                    cell={cell}
                    setCell={setCell}
                    tariff={tariffs.find(item => item.id === 22)?.tariff_limits as any}
                    realCell={{ id: 22, field: "priority_places_bids_count" }}
                  />
                </TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}>
                  <EditableCell
                    useInnerStyles={useInnerStyles}
                    cell={cell}
                    setCell={setCell}
                    tariff={tariffs.find(item => item.id === 10)?.tariff_limits as any}
                    realCell={{ id: 10, field: "priority_places_bids_count" }}
                  />
                </TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}>
                  <EditableCell
                    useInnerStyles={useInnerStyles}
                    cell={cell}
                    setCell={setCell}
                    tariff={tariffs.find(item => item.id === 14)?.tariff_limits as any}
                    realCell={{ id: 14, field: "priority_places_bids_count" }}
                  />
                </TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}>
                  <EditableCell
                    useInnerStyles={useInnerStyles}
                    cell={cell}
                    setCell={setCell}
                    tariff={tariffs.find(item => item.id === 18)?.tariff_limits as any}
                    realCell={{ id: 18, field: "priority_places_bids_count" }}
                  />
                </TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(93, 120, 255, 0.2)" }}>
                  <EditableCell
                    useInnerStyles={useInnerStyles}
                    cell={cell}
                    setCell={setCell}
                    tariff={tariffs.find(item => item.id === 100)?.tariff_limits as any}
                    realCell={{ id: 100, field: "priority_places_bids_count" }}
                  />
                </TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(93, 120, 255, 0.2)" }}>
                  <EditableCell
                    useInnerStyles={useInnerStyles}
                    cell={cell}
                    setCell={setCell}
                    tariff={tariffs.find(item => item.id === 101)?.tariff_limits as any}
                    realCell={{ id: 101, field: "priority_places_bids_count" }}
                  />
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>{intl.formatMessage({ id: "TARIFFS.TEXT12" })}</TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.2)" }}>
                  <EditableCell
                    useInnerStyles={useInnerStyles}
                    cell={cell}
                    setCell={setCell}
                    tariff={tariffs.find(item => item.id === 2)?.tariff_limits as any}
                    realCell={{ id: 2, field: "priority_places_bids_on_mailing_count" }}
                  />
                </TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.2" }}>
                  <EditableCell
                    useInnerStyles={useInnerStyles}
                    cell={cell}
                    setCell={setCell}
                    tariff={tariffs.find(item => item.id === 6)?.tariff_limits as any}
                    realCell={{ id: 6, field: "priority_places_bids_on_mailing_count" }}
                  />
                </TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.2" }}>
                  <EditableCell
                    useInnerStyles={useInnerStyles}
                    cell={cell}
                    setCell={setCell}
                    tariff={tariffs.find(item => item.id === 22)?.tariff_limits as any}
                    realCell={{ id: 22, field: "priority_places_bids_on_mailing_count" }}
                  />
                </TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}>
                  <EditableCell
                    useInnerStyles={useInnerStyles}
                    cell={cell}
                    setCell={setCell}
                    tariff={tariffs.find(item => item.id === 10)?.tariff_limits as any}
                    realCell={{ id: 10, field: "priority_places_bids_on_mailing_count" }}
                  />
                </TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}>
                  <EditableCell
                    useInnerStyles={useInnerStyles}
                    cell={cell}
                    setCell={setCell}
                    tariff={tariffs.find(item => item.id === 14)?.tariff_limits as any}
                    realCell={{ id: 14, field: "priority_places_bids_on_mailing_count" }}
                  />
                </TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}>
                  <EditableCell
                    useInnerStyles={useInnerStyles}
                    cell={cell}
                    setCell={setCell}
                    tariff={tariffs.find(item => item.id === 18)?.tariff_limits as any}
                    realCell={{ id: 18, field: "priority_places_bids_on_mailing_count" }}
                  />
                </TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(93, 120, 255, 0.2)" }}>
                  <EditableCell
                    useInnerStyles={useInnerStyles}
                    cell={cell}
                    setCell={setCell}
                    tariff={tariffs.find(item => item.id === 100)?.tariff_limits as any}
                    realCell={{ id: 100, field: "priority_places_bids_on_mailing_count" }}
                  />
                </TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(93, 120, 255, 0.2)" }}>
                  <EditableCell
                    useInnerStyles={useInnerStyles}
                    cell={cell}
                    setCell={setCell}
                    tariff={tariffs.find(item => item.id === 101)?.tariff_limits as any}
                    realCell={{ id: 101, field: "priority_places_bids_on_mailing_count" }}
                  />
                </TableCell>
              </TableRow>

              {/*=========================*/}
              <TableRow>
                <TableCell>{intl.formatMessage({ id: "TARIFFS.TEXT13" })}</TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.2)" }}>
                  <EditableCell
                    useInnerStyles={useInnerStyles}
                    cell={cell}
                    setCell={setCell}
                    tariff={tariffs.find(item => item.id === 2)?.tariff_limits as any}
                    realCell={{ id: 2, field: "days_to_bid_archiving" }}
                  />
                </TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.2" }}>
                  <EditableCell
                    useInnerStyles={useInnerStyles}
                    cell={cell}
                    setCell={setCell}
                    tariff={tariffs.find(item => item.id === 6)?.tariff_limits as any}
                    realCell={{ id: 6, field: "days_to_bid_archiving" }}
                  />
                </TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.2" }}>
                  <EditableCell
                    useInnerStyles={useInnerStyles}
                    cell={cell}
                    setCell={setCell}
                    tariff={tariffs.find(item => item.id === 22)?.tariff_limits as any}
                    realCell={{ id: 22, field: "days_to_bid_archiving" }}
                  />
                </TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}>
                  <EditableCell
                    useInnerStyles={useInnerStyles}
                    cell={cell}
                    setCell={setCell}
                    tariff={tariffs.find(item => item.id === 10)?.tariff_limits as any}
                    realCell={{ id: 10, field: "days_to_bid_archiving" }}
                  />
                </TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}>
                  <EditableCell
                    useInnerStyles={useInnerStyles}
                    cell={cell}
                    setCell={setCell}
                    tariff={tariffs.find(item => item.id === 14)?.tariff_limits as any}
                    realCell={{ id: 14, field: "days_to_bid_archiving" }}
                  />
                </TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}>
                  <EditableCell
                    useInnerStyles={useInnerStyles}
                    cell={cell}
                    setCell={setCell}
                    tariff={tariffs.find(item => item.id === 18)?.tariff_limits as any}
                    realCell={{ id: 18, field: "days_to_bid_archiving" }}
                  />
                </TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(93, 120, 255, 0.2)" }}>
                  <EditableCell
                    useInnerStyles={useInnerStyles}
                    cell={cell}
                    setCell={setCell}
                    tariff={tariffs.find(item => item.id === 100)?.tariff_limits as any}
                    realCell={{ id: 100, field: "days_to_bid_archiving" }}
                  />
                </TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(93, 120, 255, 0.2)" }}>
                  <EditableCell
                    useInnerStyles={useInnerStyles}
                    cell={cell}
                    setCell={setCell}
                    tariff={tariffs.find(item => item.id === 101)?.tariff_limits as any}
                    realCell={{ id: 101, field: "days_to_bid_archiving" }}
                  />
                </TableCell>
              </TableRow>
              {/*=========================*/}

              <TableRow>
                <TableCell>
                  <b>{intl.formatMessage({ id: "TARIFFS.TITLE3" })}</b>
                </TableCell>
                <TableCell style={{ backgroundColor: "rgba(150, 150, 150, 0.2)" }}></TableCell>
                <TableCell style={{ backgroundColor: "rgba(150, 150, 150, 0.2)" }}></TableCell>
                <TableCell style={{ backgroundColor: "rgba(150, 150, 150, 0.2)" }}></TableCell>
                <TableCell style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}></TableCell>
                <TableCell style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}></TableCell>
                <TableCell style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}></TableCell>
                <TableCell style={{ backgroundColor: "rgba(93, 120, 255, 0.2)" }}></TableCell>
                <TableCell style={{ backgroundColor: "rgba(93, 120, 255, 0.2)" }}></TableCell>
              </TableRow>

              <TableRow>
                <TableCell>{intl.formatMessage({ id: "TARIFFS.TEXT31" })}</TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.2)" }}>
                  <EditableCell
                    useInnerStyles={useInnerStyles}
                    cell={cell}
                    setCell={setCell}
                    tariff={tariffs.find(item => item.id === 2)?.tariff_limits as any}
                    realCell={{ id: 2, field: "max_filters_count" }}
                  />
                </TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.2" }}>
                  <EditableCell
                    useInnerStyles={useInnerStyles}
                    cell={cell}
                    setCell={setCell}
                    tariff={tariffs.find(item => item.id === 6)?.tariff_limits as any}
                    realCell={{ id: 6, field: "max_filters_count" }}
                  />
                </TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.2" }}>
                  <EditableCell
                    useInnerStyles={useInnerStyles}
                    cell={cell}
                    setCell={setCell}
                    tariff={tariffs.find(item => item.id === 22)?.tariff_limits as any}
                    realCell={{ id: 22, field: "max_filters_count" }}
                  />
                </TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}>
                  <EditableCell
                    useInnerStyles={useInnerStyles}
                    cell={cell}
                    setCell={setCell}
                    tariff={tariffs.find(item => item.id === 10)?.tariff_limits as any}
                    realCell={{ id: 10, field: "max_filters_count" }}
                  />
                </TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}>
                  <EditableCell
                    useInnerStyles={useInnerStyles}
                    cell={cell}
                    setCell={setCell}
                    tariff={tariffs.find(item => item.id === 14)?.tariff_limits as any}
                    realCell={{ id: 14, field: "max_filters_count" }}
                  />
                </TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}>
                  <EditableCell
                    useInnerStyles={useInnerStyles}
                    cell={cell}
                    setCell={setCell}
                    tariff={tariffs.find(item => item.id === 18)?.tariff_limits as any}
                    realCell={{ id: 18, field: "max_filters_count" }}
                  />
                </TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(93, 120, 255, 0.2)" }}>
                  <EditableCell
                    useInnerStyles={useInnerStyles}
                    cell={cell}
                    setCell={setCell}
                    tariff={tariffs.find(item => item.id === 100)?.tariff_limits as any}
                    realCell={{ id: 100, field: "max_filters_count" }}
                  />
                </TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(93, 120, 255, 0.2)" }}>
                  <EditableCell
                    useInnerStyles={useInnerStyles}
                    cell={cell}
                    setCell={setCell}
                    tariff={tariffs.find(item => item.id === 101)?.tariff_limits as any}
                    realCell={{ id: 101, field: "max_filters_count" }}
                  />
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>{intl.formatMessage({ id: "TARIFFS.TEXT32" })}</TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.2)" }}>
                  <EditableCell
                    useInnerStyles={useInnerStyles}
                    cell={cell}
                    setCell={setCell}
                    tariff={tariffs.find(item => item.id === 2)?.tariff_limits as any}
                    realCell={{ id: 2, field: "max_sms_count" }}
                  />
                </TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.2" }}>
                  <EditableCell
                    useInnerStyles={useInnerStyles}
                    cell={cell}
                    setCell={setCell}
                    tariff={tariffs.find(item => item.id === 6)?.tariff_limits as any}
                    realCell={{ id: 6, field: "max_sms_count" }}
                  />
                </TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.2" }}>
                  <EditableCell
                    useInnerStyles={useInnerStyles}
                    cell={cell}
                    setCell={setCell}
                    tariff={tariffs.find(item => item.id === 22)?.tariff_limits as any}
                    realCell={{ id: 22, field: "max_sms_count" }}
                  />
                </TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}>
                  <EditableCell
                    useInnerStyles={useInnerStyles}
                    cell={cell}
                    setCell={setCell}
                    tariff={tariffs.find(item => item.id === 10)?.tariff_limits as any}
                    realCell={{ id: 10, field: "max_sms_count" }}
                  />
                </TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}>
                  <EditableCell
                    useInnerStyles={useInnerStyles}
                    cell={cell}
                    setCell={setCell}
                    tariff={tariffs.find(item => item.id === 14)?.tariff_limits as any}
                    realCell={{ id: 14, field: "max_sms_count" }}
                  />
                </TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}>
                  <EditableCell
                    useInnerStyles={useInnerStyles}
                    cell={cell}
                    setCell={setCell}
                    tariff={tariffs.find(item => item.id === 18)?.tariff_limits as any}
                    realCell={{ id: 18, field: "max_sms_count" }}
                  />
                </TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(93, 120, 255, 0.2)" }}>
                  <EditableCell
                    useInnerStyles={useInnerStyles}
                    cell={cell}
                    setCell={setCell}
                    tariff={tariffs.find(item => item.id === 100)?.tariff_limits as any}
                    realCell={{ id: 100, field: "max_sms_count" }}
                  />
                </TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(93, 120, 255, 0.2)" }}>
                  <EditableCell
                    useInnerStyles={useInnerStyles}
                    cell={cell}
                    setCell={setCell}
                    tariff={tariffs.find(item => item.id === 101)?.tariff_limits as any}
                    realCell={{ id: 101, field: "max_sms_count" }}
                  />
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>
                  <b>{intl.formatMessage({ id: "TARIFFS.TITLE4" })}</b>
                </TableCell>
                <TableCell style={{ backgroundColor: "rgba(150, 150, 150, 0.2)" }}></TableCell>
                <TableCell style={{ backgroundColor: "rgba(150, 150, 150, 0.2)" }}></TableCell>
                <TableCell style={{ backgroundColor: "rgba(150, 150, 150, 0.2)" }}></TableCell>
                <TableCell style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}></TableCell>
                <TableCell style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}></TableCell>
                <TableCell style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}></TableCell>
                <TableCell style={{ backgroundColor: "rgba(93, 120, 255, 0.2)" }}></TableCell>
                <TableCell style={{ backgroundColor: "rgba(93, 120, 255, 0.2)" }}></TableCell>
              </TableRow>

              <TableRow>
                <TableCell>{intl.formatMessage({ id: "TARIFFS.TEXT41" })}</TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.2)" }}>
                  <EditableCell
                    useInnerStyles={useInnerStyles}
                    cell={cell}
                    setCell={setCell}
                    tariff={tariffs.find(item => item.id === 2)?.tariff_limits as any}
                    realCell={{ id: 2, field: "max_crops_count" }}
                  />
                </TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.2" }}>
                  <EditableCell
                    useInnerStyles={useInnerStyles}
                    cell={cell}
                    setCell={setCell}
                    tariff={tariffs.find(item => item.id === 6)?.tariff_limits as any}
                    realCell={{ id: 6, field: "max_crops_count" }}
                  />
                </TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.2" }}>
                  <EditableCell
                    useInnerStyles={useInnerStyles}
                    cell={cell}
                    setCell={setCell}
                    tariff={tariffs.find(item => item.id === 22)?.tariff_limits as any}
                    realCell={{ id: 22, field: "max_crops_count" }}
                  />
                </TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}>
                  <EditableCell
                    useInnerStyles={useInnerStyles}
                    cell={cell}
                    setCell={setCell}
                    tariff={tariffs.find(item => item.id === 10)?.tariff_limits as any}
                    realCell={{ id: 10, field: "max_crops_count" }}
                  />
                </TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}>
                  <EditableCell
                    useInnerStyles={useInnerStyles}
                    cell={cell}
                    setCell={setCell}
                    tariff={tariffs.find(item => item.id === 14)?.tariff_limits as any}
                    realCell={{ id: 14, field: "max_crops_count" }}
                  />
                </TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}>
                  <EditableCell
                    useInnerStyles={useInnerStyles}
                    cell={cell}
                    setCell={setCell}
                    tariff={tariffs.find(item => item.id === 18)?.tariff_limits as any}
                    realCell={{ id: 18, field: "max_crops_count" }}
                  />
                </TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(93, 120, 255, 0.2)" }}>
                  <EditableCell
                    useInnerStyles={useInnerStyles}
                    cell={cell}
                    setCell={setCell}
                    tariff={tariffs.find(item => item.id === 100)?.tariff_limits as any}
                    realCell={{ id: 100, field: "max_crops_count" }}
                  />
                </TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(93, 120, 255, 0.2)" }}>
                  <EditableCell
                    useInnerStyles={useInnerStyles}
                    cell={cell}
                    setCell={setCell}
                    tariff={tariffs.find(item => item.id === 101)?.tariff_limits as any}
                    realCell={{ id: 101, field: "max_crops_count" }}
                  />
                </TableCell>
              </TableRow>

              {/* // * grain-467 | Tariffs contact view count */}

              <TableRow>
                <TableCell>
                  <b>{intl.formatMessage({ id: "TARIFFS.TITLE6" })}</b>
                </TableCell>
                <TableCell style={{ backgroundColor: "rgba(150, 150, 150, 0.2)" }}></TableCell>
                <TableCell style={{ backgroundColor: "rgba(150, 150, 150, 0.2)" }}></TableCell>
                <TableCell style={{ backgroundColor: "rgba(150, 150, 150, 0.2)" }}></TableCell>
                <TableCell style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}></TableCell>
                <TableCell style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}></TableCell>
                <TableCell style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}></TableCell>
                <TableCell style={{ backgroundColor: "rgba(93, 120, 255, 0.2)" }}></TableCell>
                <TableCell style={{ backgroundColor: "rgba(93, 120, 255, 0.2)" }}></TableCell>
              </TableRow>

              <TableRow>
                <TableCell>{intl.formatMessage({ id: "TARIFFS.TEXT61" })}</TableCell>
                <TableCell style={{ backgroundColor: "rgba(150, 150, 150, 0.2)" }}>
                  <EditableCell
                    useInnerStyles={useInnerStyles}
                    cell={cell}
                    setCell={setCell}
                    tariff={tariffs.find(item => item.id === 2)?.tariff_limits as any}
                    realCell={{ id: 2, field: "contact_view_limit" }}
                  />
                </TableCell>
                <TableCell style={{ backgroundColor: "rgba(150, 150, 150, 0.2)" }}>
                  <EditableCell
                    useInnerStyles={useInnerStyles}
                    cell={cell}
                    setCell={setCell}
                    tariff={tariffs.find(item => item.id === 6)?.tariff_limits as any}
                    realCell={{ id: 6, field: "contact_view_limit" }}
                  />
                </TableCell>
                <TableCell style={{ backgroundColor: "rgba(150, 150, 150, 0.2)" }}>
                  <EditableCell
                    useInnerStyles={useInnerStyles}
                    cell={cell}
                    setCell={setCell}
                    tariff={tariffs.find(item => item.id === 22)?.tariff_limits as any}
                    realCell={{ id: 22, field: "contact_view_limit" }}
                  />
                </TableCell>
                <TableCell style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}>
                  <EditableCell
                    useInnerStyles={useInnerStyles}
                    cell={cell}
                    setCell={setCell}
                    tariff={tariffs.find(item => item.id === 10)?.tariff_limits as any}
                    realCell={{ id: 10, field: "contact_view_limit" }}
                  />
                </TableCell>
                <TableCell style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}>
                  <EditableCell
                    useInnerStyles={useInnerStyles}
                    cell={cell}
                    setCell={setCell}
                    tariff={tariffs.find(item => item.id === 14)?.tariff_limits as any}
                    realCell={{ id: 14, field: "contact_view_limit" }}
                  />
                </TableCell>
                <TableCell style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}>
                  <EditableCell
                    useInnerStyles={useInnerStyles}
                    cell={cell}
                    setCell={setCell}
                    tariff={tariffs.find(item => item.id === 18)?.tariff_limits as any}
                    realCell={{ id: 18, field: "contact_view_limit" }}
                  />
                </TableCell>
                <TableCell style={{ backgroundColor: "rgba(93, 120, 255, 0.2)" }}></TableCell>
                <TableCell style={{ backgroundColor: "rgba(93, 120, 255, 0.2)" }}></TableCell>
              </TableRow>

              {/* // * grain-439 | Tarrifs prices */}

              <TableRow>
                <TableCell></TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.4)" }}>
                  <b>{intl.formatMessage({ id: "AUTH.REGISTER.BUYER" })}</b>
                </TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.4)" }}>
                  <b>{intl.formatMessage({ id: "AUTH.REGISTER.VENDOR" })}</b>
                </TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.4)" }}>
                  <b>{intl.formatMessage({ id: "AUTH.REGISTER.TRADER" })}</b>
                </TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.4)" }}>
                  <b>{intl.formatMessage({ id: "AUTH.REGISTER.BUYER" })}</b>
                </TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.4)" }}>
                  <b>{intl.formatMessage({ id: "AUTH.REGISTER.VENDOR" })}</b>
                </TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.4)" }}>
                  <b>{intl.formatMessage({ id: "AUTH.REGISTER.TRADER" })}</b>
                </TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(93, 120, 255, 0.4)" }}>
                  <b>{tariffs[23].tariff.name}</b>
                </TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(93, 120, 255, 0.4)" }}>
                  <b>{tariffs[24].tariff.name}</b>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>
                  <b>{intl.formatMessage({ id: "TARIFFS.TITLE5" })}</b>
                </TableCell>
                <TableCell style={{ backgroundColor: "rgba(150, 150, 150, 0.2)" }}></TableCell>
                <TableCell style={{ backgroundColor: "rgba(150, 150, 150, 0.2)" }}></TableCell>
                <TableCell style={{ backgroundColor: "rgba(150, 150, 150, 0.2)" }}></TableCell>
                <TableCell style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}></TableCell>
                <TableCell style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}></TableCell>
                <TableCell style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}></TableCell>
                <TableCell style={{ backgroundColor: "rgba(93, 120, 255, 0.2)" }}></TableCell>
                <TableCell style={{ backgroundColor: "rgba(93, 120, 255, 0.2)" }}></TableCell>
              </TableRow>

              {/* // * Tariff Cost */}

              <TableRow>
                <TableCell
                  style={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}
                >
                  Количество дней: (пробный период)
                  <EditableCell
                    useInnerStyles={useInnerStyles}
                    cell={cell}
                    setCell={setCell}
                    tariff={
                      (tariffs.find(item => item.id === 2)?.tariff_period as unknown) as ITariff
                    }
                    realCell={{ id: 1, field: "period" }}
                  />
                </TableCell>
                <TableCell
                  style={{
                    backgroundColor: "rgba(150, 150, 150, 0.2)",
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  0
                </TableCell>
                <TableCell
                  style={{
                    backgroundColor: "rgba(150, 150, 150, 0.2)",
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  0
                </TableCell>
                <TableCell
                  style={{
                    backgroundColor: "rgba(150, 150, 150, 0.2)",
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  0
                </TableCell>
                <TableCell style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}>
                  <EditableCell
                    useInnerStyles={useInnerStyles}
                    cell={cell}
                    setCell={setCell}
                    tariff={(tariffs.find(item => item.id === 10) as unknown) as ITariff}
                    realCell={{ id: 10, field: "price" }}
                  />
                </TableCell>
                <TableCell style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}>
                  <EditableCell
                    useInnerStyles={useInnerStyles}
                    cell={cell}
                    setCell={setCell}
                    tariff={(tariffs.find(item => item.id === 14) as unknown) as ITariff}
                    realCell={{ id: 14, field: "price" }}
                  />
                </TableCell>
                <TableCell style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}>
                  <EditableCell
                    useInnerStyles={useInnerStyles}
                    cell={cell}
                    setCell={setCell}
                    tariff={(tariffs.find(item => item.id === 18) as unknown) as ITariff}
                    realCell={{ id: 18, field: "price" }}
                  />
                </TableCell>
                <TableCell style={{ backgroundColor: "rgba(93, 120, 255, 0.2)" }}></TableCell>
                <TableCell style={{ backgroundColor: "rgba(93, 120, 255, 0.2)" }}></TableCell>
              </TableRow>

              <TableRow>
                <TableCell
                  style={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}
                >
                  Количество дней:
                  <EditableCell
                    useInnerStyles={useInnerStyles}
                    cell={cell}
                    setCell={setCell}
                    tariff={
                      (tariffs.find(item => item.id === 3)?.tariff_period as unknown) as ITariff
                    }
                    realCell={{ id: 2, field: "period" }}
                  />
                </TableCell>
                <TableCell
                  style={{
                    backgroundColor: "rgba(150, 150, 150, 0.2)",
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  0
                </TableCell>
                <TableCell
                  style={{
                    backgroundColor: "rgba(150, 150, 150, 0.2)",
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  0
                </TableCell>
                <TableCell
                  style={{
                    backgroundColor: "rgba(150, 150, 150, 0.2)",
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  0
                </TableCell>
                <TableCell style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}>
                  <EditableCell
                    useInnerStyles={useInnerStyles}
                    cell={cell}
                    setCell={setCell}
                    tariff={(tariffs.find(item => item.id === 11) as unknown) as ITariff}
                    realCell={{ id: 11, field: "price" }}
                  />
                </TableCell>
                <TableCell style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}>
                  <EditableCell
                    useInnerStyles={useInnerStyles}
                    cell={cell}
                    setCell={setCell}
                    tariff={(tariffs.find(item => item.id === 15) as unknown) as ITariff}
                    realCell={{ id: 15, field: "price" }}
                  />
                </TableCell>
                <TableCell style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}>
                  <EditableCell
                    useInnerStyles={useInnerStyles}
                    cell={cell}
                    setCell={setCell}
                    tariff={(tariffs.find(item => item.id === 19) as unknown) as ITariff}
                    realCell={{ id: 19, field: "price" }}
                  />
                </TableCell>
                <TableCell style={{ backgroundColor: "rgba(93, 120, 255, 0.2)" }}></TableCell>
                <TableCell style={{ backgroundColor: "rgba(93, 120, 255, 0.2)" }}></TableCell>
              </TableRow>

              <TableRow>
                <TableCell
                  style={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}
                >
                  Количество дней:
                  <EditableCell
                    useInnerStyles={useInnerStyles}
                    cell={cell}
                    setCell={setCell}
                    tariff={
                      (tariffs.find(item => item.id === 4)?.tariff_period as unknown) as ITariff
                    }
                    realCell={{ id: 3, field: "period" }}
                  />
                </TableCell>
                <TableCell
                  style={{
                    backgroundColor: "rgba(150, 150, 150, 0.2)",
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  0
                </TableCell>
                <TableCell
                  style={{
                    backgroundColor: "rgba(150, 150, 150, 0.2)",
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  0
                </TableCell>
                <TableCell
                  style={{
                    backgroundColor: "rgba(150, 150, 150, 0.2)",
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  0
                </TableCell>
                <TableCell style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}>
                  <EditableCell
                    useInnerStyles={useInnerStyles}
                    cell={cell}
                    setCell={setCell}
                    tariff={(tariffs.find(item => item.id === 12) as unknown) as ITariff}
                    realCell={{ id: 12, field: "price" }}
                  />
                </TableCell>
                <TableCell style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}>
                  <EditableCell
                    useInnerStyles={useInnerStyles}
                    cell={cell}
                    setCell={setCell}
                    tariff={(tariffs.find(item => item.id === 16) as unknown) as ITariff}
                    realCell={{ id: 16, field: "price" }}
                  />
                </TableCell>
                <TableCell style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}>
                  <EditableCell
                    useInnerStyles={useInnerStyles}
                    cell={cell}
                    setCell={setCell}
                    tariff={(tariffs.find(item => item.id === 20) as unknown) as ITariff}
                    realCell={{ id: 20, field: "price" }}
                  />
                </TableCell>
                <TableCell style={{ backgroundColor: "rgba(93, 120, 255, 0.2)" }}></TableCell>
                <TableCell style={{ backgroundColor: "rgba(93, 120, 255, 0.2)" }}></TableCell>
              </TableRow>

              <TableRow>
                <TableCell
                  style={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}
                >
                  Количество дней:
                  <EditableCell
                    useInnerStyles={useInnerStyles}
                    cell={cell}
                    setCell={setCell}
                    tariff={
                      (tariffs.find(item => item.id === 5)?.tariff_period as unknown) as ITariff
                    }
                    realCell={{ id: 4, field: "period" }}
                  />
                </TableCell>
                <TableCell
                  style={{
                    backgroundColor: "rgba(150, 150, 150, 0.2)",
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  0
                </TableCell>
                <TableCell
                  style={{
                    backgroundColor: "rgba(150, 150, 150, 0.2)",
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  0
                </TableCell>
                <TableCell
                  style={{
                    backgroundColor: "rgba(150, 150, 150, 0.2)",
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  0
                </TableCell>
                <TableCell style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}>
                  <EditableCell
                    useInnerStyles={useInnerStyles}
                    cell={cell}
                    setCell={setCell}
                    tariff={(tariffs.find(item => item.id === 13) as unknown) as ITariff}
                    realCell={{ id: 13, field: "price" }}
                  />
                </TableCell>
                <TableCell style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}>
                  <EditableCell
                    useInnerStyles={useInnerStyles}
                    cell={cell}
                    setCell={setCell}
                    tariff={(tariffs.find(item => item.id === 17) as unknown) as ITariff}
                    realCell={{ id: 17, field: "price" }}
                  />
                </TableCell>
                <TableCell style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}>
                  <EditableCell
                    useInnerStyles={useInnerStyles}
                    cell={cell}
                    setCell={setCell}
                    tariff={(tariffs.find(item => item.id === 21) as unknown) as ITariff}
                    realCell={{ id: 21, field: "price" }}
                  />
                </TableCell>
                <TableCell style={{ backgroundColor: "rgba(93, 120, 255, 0.2)" }}></TableCell>
                <TableCell style={{ backgroundColor: "rgba(93, 120, 255, 0.2)" }}></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      )}
    </Paper>
  );
};

const connector = connect(
  (state: IAppState) => ({
    me: state.auth.user,
    tariffs: state.tariffs.tariffs,
    loading: state.tariffs.loading,
    error: state.tariffs.error,

    editLoading: state.tariffs.editLoading,
    editSuccess: state.tariffs.editSuccess,
    editError: state.tariffs.editError,
  }),
  {
    clearFetch: tariffsActions.clearFetch,
    fetch: tariffsActions.fetchRequest,
    clearEdit: tariffsActions.clearEdit,
    edit: tariffsActions.editRequest,
  }
);

type TPropsFromRedux = ConnectedProps<typeof connector>;

export default connector(injectIntl(TariffsEditPage));
