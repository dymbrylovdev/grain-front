import React, { useState, useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { injectIntl, IntlShape, WrappedComponentProps } from "react-intl";

import BidTable from "../../bids/components/BidTable";

import { IAppState } from "../../../../store/rootDuck";
import { IUser } from "../../../../interfaces/users";
import { actions as userActions } from "../../../../store/ducks/users.duck";
import { actions as crops2Actions } from "../../../../store/ducks/crops2.duck";
import { actions as bidsActions } from "../../../../store/ducks/bids.duck";

interface IProps {
  intl: IntlShape;
  classes: any;
  userId?: number;
}

const BidsForm: React.FC<IProps & TPropsFromRedux & WrappedComponentProps> = ({
  me,
  intl,
  userId,
  userBids,
  classes,

  fetchCrops,
  crops,

  setProfit,

  clearUserBids,
  fetchUserBids,
  userBidsLoading,
  userBidsSuccess,
  userBidsError,
}) => {
  const [deleteBidId, setDeleteBidId] = useState(-1);
  const [isAlertOpen, setAlertOpen] = useState(false);

  useEffect(() => {
    fetchCrops();
  }, [fetchCrops]);

  useEffect(() => {
    if (userId) fetchUserBids(userId);
  }, [fetchUserBids, userId]);

  useEffect(() => {
    clearUserBids();
  }, [clearUserBids]);

  return (
    <div>
      <BidTable
        classes={classes}
        bids={userBids}
        handleDeleteDialiog={(id: number) => {
          setDeleteBidId(id);
          setAlertOpen(true);
        }}
        bestAllMyMode={"edit"}
        user={me as IUser}
        loading={!userBids}
        crops={crops}
        setProfit={setProfit}
      />
    </div>
  );
};

const connector = connect(
  (state: IAppState) => ({
    me: state.auth.user,

    crops: state.crops2.crops,

    userBids: state.users.userBids,
    userBidsLoading: state.users.userBidsLoading,
    userBidsSuccess: state.users.userBidsSuccess,
    userBidsError: state.users.userBidsError,
  }),
  {
    clearUserBids: userActions.clearUserBids,
    fetchUserBids: userActions.userBidsRequest,

    fetchCrops: crops2Actions.fetchRequest,

    setProfit: bidsActions.setProfit,
  }
);

type TPropsFromRedux = ConnectedProps<typeof connector>;

export default connector(injectIntl(BidsForm));
