import React, {useCallback, useEffect, useMemo, useState} from "react";
import { compose } from "redux";
import { useHistory } from "react-router-dom";
import { connect, ConnectedProps } from "react-redux";
import {injectIntl, FormattedMessage, WrappedComponentProps, IntlShape} from "react-intl";
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  Paper,
  TableFooter,
  Button, TableCell,
} from "@material-ui/core";

import {actions as userActions, actions as usersActions} from "../../../store/ducks/users.duck";
import { actions as funnelStatesActions } from "../../../store/ducks/funnelStates.duck";
import { actions as authActions } from "../../../store/ducks/auth.duck";
import { actions as tariffActions } from "../../../store/ducks/tariffs.duck";

import TopTableCell from "../../../components/ui/Table/TopTableCell";
import useStyles from "../styles";
import { IAppState } from "../../../store/rootDuck";
import { TablePaginator } from "../../../components/ui/Table/TablePaginator";
import { Skeleton } from "@material-ui/lab";
import { LayoutSubheader } from "../../../../_metronic";
import {actions as crops2Actions} from "../../../store/ducks/crops2.duck";
import {actions as bidsActions} from "../../../store/ducks/bids.duck";
import {actions as myFiltersActions} from "../../../store/ducks/myFilters.duck";
import {IBid} from "../../../interfaces/bids";

interface IProps {
  onClose: () => {} | void;
}

const UsersPageList: React.FC<IProps & TPropsFromRedux & WrappedComponentProps> = ({
  me,
  intl,
  userBids,

  fetchCrops,
  crops,
  onClose,

  clearUserBids,
  fetchUserBids,


  page,
  perPage,
  total,
  cropParams,
}) => {
  const classes = useStyles();
  const prevBids = Array.apply(null, Array(5));
  const numberParams = useMemo(() => cropParams && cropParams.filter(item => item.type === "number"), [cropParams]);

  useEffect(() => {
    if (me && me?.id) fetchUserBids({ userId: me.id, page, perPage });
  }, [fetchUserBids, me]);

  useEffect(() => {
    clearUserBids();
  }, [clearUserBids]);

  const handleToBid = (bid: IBid) => {
    console.log('bid:', bid);
    onClose();
  }

  const getParametrName = useCallback(
    (item: { id: number; value: string; parameter_id: number }) => {
      const nameParam = numberParams?.find(param => param.id === item.parameter_id)?.name;
      return nameParam ? `${nameParam}: ${item.value}` : `${item.value}`;
    },
    [numberParams]
  );

  return (
    <Paper className={classes.paperWithTable}>
      <LayoutSubheader title={intl.formatMessage({ id: "SUBMENU.USER.LIST" })} />
      {!userBids && !crops? (
        <>
          <Skeleton width="100%" height={52} animation="wave" />
          {prevBids.map((item, index) => (
            <Skeleton width="100%" height={77} key={index} animation="wave" />
          ))}
          <Skeleton width="100%" height={53} animation="wave" />
        </>
      ) : (
        <div className={classes.table}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TopTableCell>
                  <FormattedMessage id="DEALS.TABLE.CROP" />
                </TopTableCell>
                <TopTableCell>
                  <FormattedMessage id="USER.EDIT_FORM.OPTIONS" />
                </TopTableCell>
                <TopTableCell>
                  <FormattedMessage id="PROFILE.INPUT.LOCATION.SALE" />
                </TopTableCell>
                <TopTableCell>
                </TopTableCell>
                <TopTableCell></TopTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userBids && crops &&
                userBids.map(item => {
                  const crop = item?.crop_id && crops?.find(crop => crop?.id === item?.crop_id)?.name
                  return <TableRow key={item.id}>
                    <TableCell>{crop}</TableCell>
                    <TableCell>{item.parameter_values.map(item => getParametrName(item)).join(" / ") +
                      `${item.parameter_values.length > 0 ? " / " : ""}${item.volume} тонн`}</TableCell>
                    <TableCell>
                        <b>{`${item.location.text}`}</b>
                    </TableCell>
                    <TableCell>
                      <Button style={{color: '#3c5fe8'}}
                              onClick={() => handleToBid(item)}
                      >
                        <FormattedMessage id="TARIFFS.PAYMENT.PAY" />
                      </Button>
                    </TableCell>
                  </TableRow>
                })}
            </TableBody>
            <TableFooter>
              <TableRow>

              </TableRow>
            </TableFooter>
          </Table>
        </div>
      )}
    </Paper>
  );
};

const connector = connect(
  (state: IAppState) => ({
    me: state.auth.user,

    crops: state.crops2.crops,
    cropParams: state.crops2.cropParams,

    userBids: state.users.userBids,
    userBidsLoading: state.users.userBidsLoading,
    userBidsSuccess: state.users.userBidsSuccess,
    userBidsError: state.users.userBidsError,
    page: state.users.bids_page,
    perPage: state.users.bids_per_page,
    total: state.users.bids_total,

    postLoading: state.myFilters.postLoading,
    postSuccess: state.myFilters.postSuccess,
    postError: state.myFilters.postError,
  }),
  {
    clearUserBids: userActions.clearUserBids,
    fetchUserBids: userActions.userBidsRequest,

    fetchCrops: crops2Actions.fetchRequest,

    setProfit: bidsActions.setProfit,

    clearPost: myFiltersActions.clearPost,
    post: myFiltersActions.postFilter,
  }
);

type TPropsFromRedux = ConnectedProps<typeof connector>;

export default compose(connector, injectIntl)(UsersPageList);
