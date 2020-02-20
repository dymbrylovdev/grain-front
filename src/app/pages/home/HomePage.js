import React, { Suspense, lazy, useEffect, useState } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Builder from "./Builder";
import Dashboard from "./Dashboard";
import DocsPage from "./docs/DocsPage";
import { LayoutSplashScreen } from "../../../_metronic";
import getMenuConfig from "../../router/MenuConfig";
import UserDocPage from "./userDocs/UserDocPage";
import { useSelector, shallowEqual, connect } from "react-redux";
import { ProfilePage, UserListPage, CreateUserPage, EditUserPage } from "./users";
import { BidsListPage, BidCreatePage } from "./bids";
import { CropsListPage, CropPage } from "./crops";
import * as builder from "../../../_metronic/ducks/builder";
import * as crops from "../../store/ducks/crops.duck";
import { getCrops } from "../../crud/crops.crud";

const GoogleMaterialPage = lazy(() => import("./google-material/GoogleMaterialPage"));
const ReactBootstrapPage = lazy(() => import("./react-bootstrap/ReactBootstrapPage"));

function HomePage({ setMenuConfig, setCrops }) {
  const { crops, user } = useSelector(({ crops, auth }) => ({ crops: crops.crops, user: auth.user }), shallowEqual);
  const [menuConfig] = useState(getMenuConfig(crops, user.is_admin));
  const getCropsAction = () => {
    getCrops()
      .then(({ data }) => {
        if (data && data.data) {
          setCrops(data.data, user.is_admin);
        }
      })
      .catch(error => {
      });
  };
  useEffect(() => {
    setMenuConfig(menuConfig);
    getCropsAction();
  }, []);
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          /* Redirect from root URL to /dashboard. */
          <Redirect exact from="/" to="/bidsList" />
        }
        <Route path="/builder" component={Builder} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/google-material" component={GoogleMaterialPage} />
        <Route path="/react-bootstrap" component={ReactBootstrapPage} />
        <Route path="/docs" component={DocsPage} />
        <Route path="/userDocs/legacy" component={UserDocPage} />
        <Route path="/user/profile" exact component={ProfilePage} />
        <Route path="/userList" component={UserListPage} />
        <Route path="/user/create" component={CreateUserPage} />
        <Route path="/user/edit/:id" component={EditUserPage} />
        <Route path="/bidsList" exact component={BidsListPage} />
        <Route path="/bidsList/:cropId" component={BidsListPage} />
        <Route path="/bid/create"  exact component={BidCreatePage} />
        <Route path="/bid/create/:vendorId" component={BidCreatePage} />
        <Route path="/bid/edit/:bidId" component={BidCreatePage} />
        <Route path ="/cropList" component={CropsListPage}/>
        <Route path="/crop/create" component={CropPage}/>
        <Route path="/crop/edit/:id" component={CropPage}/>

      </Switch>
    </Suspense>
  );
}

export default connect(null, { ...builder.actions, ...crops.actions })(HomePage);
