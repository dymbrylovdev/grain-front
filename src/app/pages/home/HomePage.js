import React, { Suspense, useEffect, useState } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { LayoutSplashScreen } from "../../../_metronic";
import getMenuConfig from "../../router/MenuConfig";
import UserDocPage from "./userDocs/UserDocPage";
import { useSelector, shallowEqual, connect } from "react-redux";
import { ProfilePage, UserListPage, CreateUserPage, EditUserPage } from "./users";
import { BidsListPage, BidCreatePage, MyBidsListPage, AllBidsPage } from "./bids";
import { CropsListPage, CropPage } from "./crops";
import * as builder from "../../../_metronic/ducks/builder";
import * as crops from "../../store/ducks/crops.duck";
import * as users from "../../store/ducks/users.duck";

function HomePage({ setMenuConfig, getCrops, getStatuses }) {
  const { crops, user } = useSelector(
    ({ crops: { crops }, auth }) => ({ crops: (crops && crops.data) || [], user: auth.user }),
    shallowEqual
  );
  const [menuConfig] = useState(getMenuConfig(crops, user));
  const getCropsAction = () => {
    getCrops(user);
  };
  useEffect(() => {
    setMenuConfig(menuConfig);
    getStatuses();
    getCropsAction();
  }, []); // eslint-disable-line
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          /* Redirect from root URL to /dashboard. */
          <Redirect exact from="/" to={`${user.is_buyer ? "/user/profile" : "/myBidsList"}`} />
        }
        <Route path="/userDocs/legacy" component={UserDocPage} />
        <Route path="/user/profile" exact component={ProfilePage} />
        <Route path="/userList" component={UserListPage} />
        <Route path="/user/create" component={CreateUserPage} />
        <Route path="/user/edit/:id" component={EditUserPage} />
        <Route path="/bidsList" exact component={BidsListPage} />
        <Route path="/myBidsList" exact component={MyBidsListPage} />
        <Route path="/bidsList/:cropId" exact component={BidsListPage} />
        <Route path="/bid/create" exact component={BidCreatePage} />
        <Route path="/bid/create/:vendorId" component={BidCreatePage} />
        <Route path="/bid/edit/:bidId" exact component={BidCreatePage} />
        <Route path="/bid/view/:bidId" exact component={BidCreatePage} />
        <Route path="/bid/view/:bidId/fromMy" component={BidCreatePage} />
        <Route path="/bid/view/:bidId/fromAdmin" component={BidCreatePage} />
        <Route path="/bid/edit/:bidId/fromMy" component={BidCreatePage} />
        <Route path="/bid/edit/:bidId/fromAdmin" component={BidCreatePage} />
        <Route path="/allBidsList/:cropId" component={AllBidsPage} />
        <Route path="/cropList" component={CropsListPage} />
        <Route path="/crop/create" component={CropPage} />
        <Route path="/crop/edit/:id" component={CropPage} />
      </Switch>
    </Suspense>
  );
}

export default connect(null, { ...builder.actions, ...crops.actions, ...users.actions })(HomePage);
