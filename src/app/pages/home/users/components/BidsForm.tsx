import React, { useState, useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { injectIntl, IntlShape, WrappedComponentProps } from "react-intl";
import { useHistory } from "react-router-dom";
import { Button } from "@material-ui/core";

import BidTable from "../../bids/components/BidTable";

import { IAppState } from "../../../../store/rootDuck";
import { IUser } from "../../../../interfaces/users";
import { actions as userActions } from "../../../../store/ducks/users.duck";
import { actions as crops2Actions } from "../../../../store/ducks/crops2.duck";
import { actions as bidsActions } from "../../../../store/ducks/bids.duck";

import { actions as myFiltersActions } from "../../../../store/ducks/myFilters.duck";
import Preloader from "../../../../components/ui/Loaders/Preloader";

interface IProps {
  intl: IntlShape;
  classes: any;
  userId?: number;
  isBuyer?: boolean;
}

const BidsForm: React.FC<IProps & TPropsFromRedux & WrappedComponentProps> = ({
  me,
  intl,
  userId,
  userBids,
  isBuyer,
  classes,

  fetchCrops,
  crops,

  setProfit,

  clearUserBids,
  fetchUserBids,
  userBidsLoading,
  userBidsSuccess,
  userBidsError,

  post,
  clearPost,
  postLoading,
  postSuccess,
  postError,

  page,
  perPage,
  total,
}) => {
  const history = useHistory();

  const [deleteBidId, setDeleteBidId] = useState(-1);
  const [isAlertOpen, setAlertOpen] = useState(false);

  useEffect(() => {
    fetchCrops();
  }, [fetchCrops]);

  useEffect(() => {
    if (userId) fetchUserBids({ userId, page, perPage });
  }, [fetchUserBids, userId]);

  useEffect(() => {
    clearUserBids();
  }, [clearUserBids]);

  if (userBidsLoading) return <Preloader />;

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
        post={post}
        clearPost={clearPost}
        postLoading={postLoading}
        postSuccess={postSuccess}
        postError={postError}
        paginationData={{ page, perPage, total }}
        fetcher={(newPage: number, newPerPage: number) => {
          if (userId) {
            fetchUserBids({ userId, page: newPage, perPage: newPerPage });
          }
        }}
      />

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 15 }}>
        <Button
          color="primary"
          variant="contained"
          onClick={() => {
            history.push(`/bid/create/${isBuyer ? "purchase" : "sale"}/0/0/${userId}`);
          }}
        >
          Добавить объявление
        </Button>
      </div>
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

export default connector(injectIntl(BidsForm));
