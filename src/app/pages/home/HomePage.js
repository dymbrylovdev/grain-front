import React, { Suspense, useEffect, useState } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { LayoutSplashScreen } from "../../../_metronic";
import getMenuConfig from "../../router/MenuConfig";
import UserDocPage from "./userDocs/UserDocPage";
import { useSelector, shallowEqual, connect } from "react-redux";
import { UsersPage, UserEditPage } from "./users";
import { CropsListPage, CropPage } from "./crops";
import { CompanyPage, CompaniesListPage, CompanyConfirmPage } from "./companies";
import * as builder from "../../../_metronic/ducks/builder";
import * as crops from "../../store/ducks/crops.duck";
import * as users from "../../store/ducks/users.duck";
import { actions as statusesActions } from "../../store/ducks/statuses.duck";
import { MyFiltersPage, MyFiltersEditPage, MyFiltersMoneyPage } from "./myFilters";
import Dashboard from "./Dashboard";
import { FunnelStatesPage, FunnelStateEditPage } from "./funnelStates";
import { ActivityReportPage } from "./activityReport";
import { BidsPage, BidCreatePage } from "./bids";
import { DealsPage } from "./deals";

function HomePage({ setMenuConfig, getCrops, fetchStatuses }) {
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
    fetchStatuses();
    getCropsAction();
  }, []); // eslint-disable-line
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          /* Redirect from root URL to /dashboard. */
          <Redirect exact from="/" to="/user/profile" />
        }
        <Route path="/userDocs/legacy" component={UserDocPage} />
        <Route path="/user/profile" exact component={UserEditPage} />
        <Route path="/user-list" component={UsersPage} />
        <Route path="/user/create" component={UserEditPage} />
        <Route path="/user/edit/:id" component={UserEditPage} />

        <Route path="/sale/filters/view/:id" component={MyFiltersEditPage} />
        <Route path="/sale/filters/edit/:id" component={MyFiltersEditPage} />
        <Route path="/sale/filters/prices" component={MyFiltersMoneyPage} />
        <Route path="/sale/filters" component={MyFiltersPage} />

        <Route path="/purchase/filters/view/:id" component={MyFiltersEditPage} />
        <Route path="/purchase/filters/edit/:id" component={MyFiltersEditPage} />
        <Route path="/purchase/filters/prices" component={MyFiltersMoneyPage} />
        <Route path="/purchase/filters" component={MyFiltersPage} />

        <Route path="/activity-report" component={ActivityReportPage} />

        <Route path="/funnel-states/new-buyer" component={FunnelStateEditPage} />
        <Route path="/funnel-states/new-seller" component={FunnelStateEditPage} />
        <Route path="/funnel-states/edit/:id" component={FunnelStateEditPage} />
        <Route path="/funnel-states" component={FunnelStatesPage} />

        <Route path="/bid/create" exact component={BidCreatePage} />
        <Route path="/bid/create/:vendorId" component={BidCreatePage} />
        <Route path="/bid/edit/:bidId" exact component={BidCreatePage} />
        <Route path="/bid/view/:bidId" exact component={BidCreatePage} />
        <Route path="/bid/view/:bidId/fromMy" component={BidCreatePage} />
        <Route path="/bid/view/:bidId/fromAdmin" component={BidCreatePage} />
        <Route path="/bid/edit/:bidId/fromMy" component={BidCreatePage} />
        <Route path="/bid/edit/:bidId/fromAdmin" component={BidCreatePage} />

        <Route path="/sale/best-bids/:cropId" component={BidsPage} />
        <Route path="/purchase/best-bids/:cropId" component={BidsPage} />
        <Route path="/sale/my-bids" component={BidsPage} />
        <Route path="/purchase/my-bids" component={BidsPage} />
        <Route path="/sale/all-bids/:cropId" component={BidsPage} />
        <Route path="/purchase/all-bids/:cropId" component={BidsPage} />

        <Route path="/cropList" component={CropsListPage} />
        <Route path="/crop/create" component={CropPage} />
        <Route path="/crop/edit/:id" component={CropPage} />

        <Route path="/company/create" exact component={CompanyPage} />
        <Route path="/company/edit/:companyId" exact component={CompanyPage} />
        <Route path="/companyList" component={CompaniesListPage} />
        <Route path="/company/confirm/:companyId" component={CompanyConfirmPage} />

        <Route path="/deals" component={DealsPage} />

        <Route path="/dash" component={Dashboard} />

        {
          // Редиректы для старых ссылок
        }

        {/*<Route path="/myBidsList" exact component={MyBidsListPage} />
        <Route path="/bidsList/:cropId" exact component={BidsListPage} /> 
        <Route path="/allBidsList/:cropId" component={AllBidsPage} /> */}

        {user.is_buyer ? (
          <Redirect from="/bidsList/:cropId" to="/sale/best-bids/:cropId" />
        ) : (
          <Redirect from="/bidsList/:cropId" to="/purchase/best-bids/:cropId" />
        )}

        {user.is_buyer ? (
          <Redirect from="/myBidsList" to="/purchase/my-bids" />
        ) : (
          <Redirect from="/myBidsList" to="/sale/my-bids" />
        )}

        <Redirect from="/allBidsList/:cropId" to="/sale/all-bids/:cropId" />
      </Switch>
    </Suspense>
  );
}

export default connect(null, {
  ...builder.actions,
  ...crops.actions,
  ...users.actions,
  fetchStatuses: statusesActions.fetchRequest,
})(HomePage);
