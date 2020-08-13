import React, { useEffect, useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { Table, TableBody, TableCell, TableHead, TableRow, Paper } from "@material-ui/core";

import { actions as tariffsActions } from "../../../store/ducks/tariffs.duck";

import TopTableCell from "../../../components/ui/Table/TopTableCell";
import useStyles from "../styles";
import { IAppState } from "../../../store/rootDuck";
import { Skeleton } from "@material-ui/lab";
import { ErrorPage } from "../../../components/ErrorPage";
import { LayoutSubheader } from "../../../../_metronic";
import { TTariffField, ITariff } from "../../../interfaces/tariffs";
import EditableCell from "./components/EditableCell";

const TariffsEditPage: React.FC<TPropsFromRedux & WrappedComponentProps> = ({
  intl,

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

  if (error) return <ErrorPage />;

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
                <TopTableCell colSpan={2} align="center">
                  {intl.formatMessage({ id: "TARIFFS.NAME.INSIDE" })}
                </TopTableCell>
                <TopTableCell colSpan={2} align="center">
                  {tariffs[0].name}
                </TopTableCell>
                <TopTableCell colSpan={2} align="center">
                  {tariffs[3].name}
                </TopTableCell>
                <TopTableCell align="center">{tariffs[6].name.split("/")[0]}</TopTableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              <TableRow>
                <TableCell></TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(93, 120, 255, 0.4)" }}>
                  <b>{tariffs[4].name}</b>
                </TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(93, 120, 255, 0.4)" }}>
                  <b>{tariffs[5].name}</b>
                </TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.4)" }}>
                  <b>{intl.formatMessage({ id: "AUTH.REGISTER.BUYER" })}</b>
                </TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.4)" }}>
                  <b>{intl.formatMessage({ id: "AUTH.REGISTER.VENDOR" })}</b>
                </TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.4)" }}>
                  <b>{intl.formatMessage({ id: "AUTH.REGISTER.BUYER" })}</b>
                </TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.4)" }}>
                  <b>{intl.formatMessage({ id: "AUTH.REGISTER.VENDOR" })}</b>
                </TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(253, 57, 122, 0.4)" }}>
                  <b>{tariffs[6].name.split("/")[1]}</b>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>
                  <b>{intl.formatMessage({ id: "TARIFFS.TITLE1" })}</b>
                </TableCell>
                <TableCell style={{ backgroundColor: "rgba(93, 120, 255, 0.2)" }}></TableCell>
                <TableCell style={{ backgroundColor: "rgba(93, 120, 255, 0.2)" }}></TableCell>
                <TableCell style={{ backgroundColor: "rgba(150, 150, 150, 0.2)" }}></TableCell>
                <TableCell style={{ backgroundColor: "rgba(150, 150, 150, 0.2)" }}></TableCell>
                <TableCell style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}></TableCell>
                <TableCell style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}></TableCell>
                <TableCell style={{ backgroundColor: "rgba(253, 57, 122, 0.2)" }}></TableCell>
              </TableRow>

              <TableRow>
                <TableCell>{intl.formatMessage({ id: "TARIFFS.TEXT11" })}</TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(93, 120, 255, 0.2)" }}>
                  <EditableCell
                    cell={cell}
                    setCell={setCell}
                    tariff={tariffs.find(item => item.id === 100) as ITariff}
                    realCell={{ id: 100, field: "priority_places_bids_count" }}
                  />
                </TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(93, 120, 255, 0.2)" }}>
                  <EditableCell
                    cell={cell}
                    setCell={setCell}
                    tariff={tariffs.find(item => item.id === 101) as ITariff}
                    realCell={{ id: 101, field: "priority_places_bids_count" }}
                  />
                </TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.2)" }}>
                  {intl.formatMessage({ id: "TARIFFS.GENERAL_TERMS" })}
                </TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.2" }}>
                  {intl.formatMessage({ id: "TARIFFS.GENERAL_TERMS" })}
                </TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}>
                  <EditableCell
                    cell={cell}
                    setCell={setCell}
                    tariff={tariffs.find(item => item.id === 4) as ITariff}
                    realCell={{ id: 4, field: "priority_places_bids_count" }}
                  />
                </TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}>
                  <EditableCell
                    cell={cell}
                    setCell={setCell}
                    tariff={tariffs.find(item => item.id === 3) as ITariff}
                    realCell={{ id: 3, field: "priority_places_bids_count" }}
                  />
                </TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(253, 57, 122, 0.2)" }}>
                  <EditableCell
                    cell={cell}
                    setCell={setCell}
                    tariff={tariffs.find(item => item.id === 102) as ITariff}
                    realCell={{ id: 102, field: "priority_places_bids_count" }}
                  />
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>{intl.formatMessage({ id: "TARIFFS.TEXT12" })}</TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(93, 120, 255, 0.2)" }}>
                  <EditableCell
                    cell={cell}
                    setCell={setCell}
                    tariff={tariffs.find(item => item.id === 100) as ITariff}
                    realCell={{ id: 100, field: "priority_places_bids_on_mailing_count" }}
                  />
                </TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(93, 120, 255, 0.2)" }}>
                  <EditableCell
                    cell={cell}
                    setCell={setCell}
                    tariff={tariffs.find(item => item.id === 101) as ITariff}
                    realCell={{ id: 101, field: "priority_places_bids_on_mailing_count" }}
                  />
                </TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.2)" }}>
                  {intl.formatMessage({ id: "TARIFFS.GENERAL_TERMS" })}
                </TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.2" }}>
                  {intl.formatMessage({ id: "TARIFFS.GENERAL_TERMS" })}
                </TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}>
                  <EditableCell
                    cell={cell}
                    setCell={setCell}
                    tariff={tariffs.find(item => item.id === 4) as ITariff}
                    realCell={{ id: 4, field: "priority_places_bids_on_mailing_count" }}
                  />
                </TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}>
                  <EditableCell
                    cell={cell}
                    setCell={setCell}
                    tariff={tariffs.find(item => item.id === 3) as ITariff}
                    realCell={{ id: 3, field: "priority_places_bids_on_mailing_count" }}
                  />
                </TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(253, 57, 122, 0.2)" }}>
                  <EditableCell
                    cell={cell}
                    setCell={setCell}
                    tariff={tariffs.find(item => item.id === 102) as ITariff}
                    realCell={{ id: 102, field: "priority_places_bids_on_mailing_count" }}
                  />
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>
                  <b>{intl.formatMessage({ id: "TARIFFS.TITLE1" })}</b>
                </TableCell>
                <TableCell style={{ backgroundColor: "rgba(93, 120, 255, 0.2)" }}></TableCell>
                <TableCell style={{ backgroundColor: "rgba(93, 120, 255, 0.2)" }}></TableCell>
                <TableCell style={{ backgroundColor: "rgba(150, 150, 150, 0.2)" }}></TableCell>
                <TableCell style={{ backgroundColor: "rgba(150, 150, 150, 0.2)" }}></TableCell>
                <TableCell style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}></TableCell>
                <TableCell style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}></TableCell>
                <TableCell style={{ backgroundColor: "rgba(253, 57, 122, 0.2)" }}></TableCell>
              </TableRow>

              <TableRow>
                <TableCell>{intl.formatMessage({ id: "TARIFFS.TEXT31" })}</TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(93, 120, 255, 0.2)" }}>
                  <EditableCell
                    cell={cell}
                    setCell={setCell}
                    tariff={tariffs.find(item => item.id === 100) as ITariff}
                    realCell={{ id: 100, field: "max_filters_count" }}
                  />
                </TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(93, 120, 255, 0.2)" }}>
                  <EditableCell
                    cell={cell}
                    setCell={setCell}
                    tariff={tariffs.find(item => item.id === 101) as ITariff}
                    realCell={{ id: 101, field: "max_filters_count" }}
                  />
                </TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.2)" }}>
                  <EditableCell
                    cell={cell}
                    setCell={setCell}
                    tariff={tariffs.find(item => item.id === 1) as ITariff}
                    realCell={{ id: 1, field: "max_filters_count" }}
                  />
                </TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.2" }}>
                  <EditableCell
                    cell={cell}
                    setCell={setCell}
                    tariff={tariffs.find(item => item.id === 2) as ITariff}
                    realCell={{ id: 2, field: "max_filters_count" }}
                  />
                </TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}>
                  <EditableCell
                    cell={cell}
                    setCell={setCell}
                    tariff={tariffs.find(item => item.id === 4) as ITariff}
                    realCell={{ id: 4, field: "max_filters_count" }}
                  />
                </TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}>
                  <EditableCell
                    cell={cell}
                    setCell={setCell}
                    tariff={tariffs.find(item => item.id === 3) as ITariff}
                    realCell={{ id: 3, field: "max_filters_count" }}
                  />
                </TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(253, 57, 122, 0.2)" }}>
                  <EditableCell
                    cell={cell}
                    setCell={setCell}
                    tariff={tariffs.find(item => item.id === 102) as ITariff}
                    realCell={{ id: 102, field: "max_filters_count" }}
                  />
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>
                  <b>{intl.formatMessage({ id: "TARIFFS.TITLE1" })}</b>
                </TableCell>
                <TableCell style={{ backgroundColor: "rgba(93, 120, 255, 0.2)" }}></TableCell>
                <TableCell style={{ backgroundColor: "rgba(93, 120, 255, 0.2)" }}></TableCell>
                <TableCell style={{ backgroundColor: "rgba(150, 150, 150, 0.2)" }}></TableCell>
                <TableCell style={{ backgroundColor: "rgba(150, 150, 150, 0.2)" }}></TableCell>
                <TableCell style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}></TableCell>
                <TableCell style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}></TableCell>
                <TableCell style={{ backgroundColor: "rgba(253, 57, 122, 0.2)" }}></TableCell>
              </TableRow>

              <TableRow>
                <TableCell>{intl.formatMessage({ id: "TARIFFS.TEXT41" })}</TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(93, 120, 255, 0.2)" }}>
                  <EditableCell
                    cell={cell}
                    setCell={setCell}
                    tariff={tariffs.find(item => item.id === 100) as ITariff}
                    realCell={{ id: 100, field: "max_crops_count" }}
                  />
                </TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(93, 120, 255, 0.2)" }}>
                  <EditableCell
                    cell={cell}
                    setCell={setCell}
                    tariff={tariffs.find(item => item.id === 101) as ITariff}
                    realCell={{ id: 101, field: "max_crops_count" }}
                  />
                </TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.2)" }}>
                  <EditableCell
                    cell={cell}
                    setCell={setCell}
                    tariff={tariffs.find(item => item.id === 1) as ITariff}
                    realCell={{ id: 1, field: "max_crops_count" }}
                  />
                </TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.2" }}>
                  <EditableCell
                    cell={cell}
                    setCell={setCell}
                    tariff={tariffs.find(item => item.id === 2) as ITariff}
                    realCell={{ id: 2, field: "max_crops_count" }}
                  />
                </TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}>
                  <EditableCell
                    cell={cell}
                    setCell={setCell}
                    tariff={tariffs.find(item => item.id === 4) as ITariff}
                    realCell={{ id: 4, field: "max_crops_count" }}
                  />
                </TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}>
                  <EditableCell
                    cell={cell}
                    setCell={setCell}
                    tariff={tariffs.find(item => item.id === 3) as ITariff}
                    realCell={{ id: 3, field: "max_crops_count" }}
                  />
                </TableCell>
                <TableCell align="center" style={{ backgroundColor: "rgba(253, 57, 122, 0.2)" }}>
                  <EditableCell
                    cell={cell}
                    setCell={setCell}
                    tariff={tariffs.find(item => item.id === 102) as ITariff}
                    realCell={{ id: 102, field: "max_crops_count" }}
                  />
                </TableCell>
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
