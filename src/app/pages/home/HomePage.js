import React, { Suspense, lazy, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import Builder from "./Builder";
import Dashboard from "./Dashboard";
import DocsPage from "./docs/DocsPage";
import { LayoutSplashScreen } from "../../../_metronic";
import getMenuConfig from "../../router/MenuConfig";
import { mockcCereals } from "../../router/mockMenuConsts";
import UserDocPage from "./userDocs/UserDocPage";
import ProfilePage from "./users/ProfilePage";
import * as builder from "../../../_metronic/ducks/builder";
import * as routerHelpers from "../../router/RouterHelpers";

const GoogleMaterialPage = lazy(() =>
  import("./google-material/GoogleMaterialPage")
);
const ReactBootstrapPage = lazy(() =>
  import("./react-bootstrap/ReactBootstrapPage")
);

const userMenuConfig = getMenuConfig(mockcCereals);

export default function HomePage() {
  // useEffect(() => {
  //   console.log('Home page');
  // }, []) // [] - is required if you need only one call
  // https://reactjs.org/docs/hooks-reference.html#useeffect

  const dispatch = useDispatch();
  useEffect(() => 
  {  
    dispatch(builder.actions.setMenuConfig(userMenuConfig));
  });

  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          /* Redirect from root URL to /dashboard. */
          <Redirect exact from="/" to="/dashboard" />
        }
        <Route path="/builder" component={Builder} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/google-material" component={GoogleMaterialPage} />
        <Route path="/react-bootstrap" component={ReactBootstrapPage} />
        <Route path="/docs" component={DocsPage} />
        <Route path="/userDocs/legacy" component={UserDocPage} />
        <Route path="/user/profile" component={ProfilePage}/>
        <Redirect to="/error/error-v1" />
      </Switch>
    </Suspense>
  );
}
