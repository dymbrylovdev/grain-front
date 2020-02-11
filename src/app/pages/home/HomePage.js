import React, { Suspense, lazy, useEffect, useState } from "react";
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
import UserListPage from "./users/UserListPage";
import * as builder from "../../../_metronic/ducks/builder";

const GoogleMaterialPage = lazy(() =>
  import("./google-material/GoogleMaterialPage")
);
const ReactBootstrapPage = lazy(() =>
  import("./react-bootstrap/ReactBootstrapPage")
);

export default function HomePage() {
  // useEffect(() => {
  //   console.log('Home page');
  // }, []) // [] - is required if you need only one call
  // https://reactjs.org/docs/hooks-reference.html#useeffect

  const dispatch = useDispatch();
  const [menuConfig, setMenuConfig] = useState(getMenuConfig(mockcCereals));
  useEffect(() => 
  {  
    dispatch(builder.actions.setMenuConfig(menuConfig));
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
        <Route path="/user/profile" exact component={ProfilePage}/>
        <Route path="/userList" component={UserListPage}/>
        <Route path="/user/create" component={ProfilePage}/>
        <Route path="/user/edit/:id" component={ProfilePage}/>
      </Switch>
    </Suspense>
  );
}
