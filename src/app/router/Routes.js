/**
 * High level router.
 *
 * Note: It's recommended to compose related routes in internal router
 * components (e.g: `src/pages/auth/AuthPage`, `src/pages/home/HomePage`).
 */

import React, { useEffect, useMemo } from "react";
import { Redirect, Route, Switch, withRouter } from "react-router-dom";
import { shallowEqual, useSelector, useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import HomePage from "../pages/home/HomePage";
import ErrorsPage from "../pages/errors/ErrorsPage";
import LogoutPage from "../pages/auth/Logout";
import { LayoutContextProvider } from "../../_metronic";
import Layout from "../../_metronic/layout/Layout";
import * as routerHelpers from "../router/RouterHelpers";
import AuthPage from "../pages/auth/AuthPage";
import Preloader from "../components/ui/Loaders/Preloader";
import { actions as authActions } from "../store/ducks/auth.duck";

export const Routes = withRouter(({ history }) => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const jwtToken = new URL(window.location.href).searchParams.get("bearer");
  useEffect(() => {
    if (jwtToken) dispatch(authActions.loginByJwtRequest({ jwt: jwtToken }));
  }, [dispatch]);

  useEffect(() => {
    const unlisten = history.listen((location, action) => {
      if (location.pathname.includes("/bid/edit")) {
        localStorage.setItem("WasBidEditPage", true);
      }
    });

    return () => {
      unlisten();
    };
  }, []);

  const { isAuthorized, menuConfig, userLastLocation, user, loginByJwtLoading, loginByJwtError } = useSelector(
    ({ auth, builder: { menuConfig } }) => {
      return {
        menuConfig,
        isAuthorized: Boolean(auth.authToken),
        userLastLocation: routerHelpers.getLastLocation(),
        user: auth.user,
        loginByJwtLoading: auth.loginByJwtLoading,
        loginByJwtError: auth.loginByJwtError,
        loginByJwtSuccess: auth.loginByJwtSuccess,
        clearLoginByJwt: auth.clearLoginByJwt,
      };
    },
    shallowEqual
  );

  useEffect(() => {
    isAuthorized && !user && dispatch(authActions.fetchRequest());
  }, [user, isAuthorized, dispatch]);

  useEffect(() => {
    if (loginByJwtError) {
      enqueueSnackbar(loginByJwtError, {
        variant: "error",
      });
    }
  }, [loginByJwtError, enqueueSnackbar]);

  const redirectFromAuth = useMemo(() => {
    if (isAuthorized && user) {
      if (user.roles.includes("ROLE_TRANSPORTER")) return '/user/profile'
      if (
        user.roles.includes("ROLE_ADMIN") ||
        user.roles.includes("ROLE_MANAGER") ||
        user.roles.includes("ROLE_TRADER") ||
        user.roles.includes("ROLE_BUYER")
      ) {
        return `/sale/best-bids/${user.main_crop ? user.main_crop.id : 0}`;
      } else {
        return `/purchase/best-bids/${user.main_crop ? user.main_crop.id : 0}`;
      }
    }
    return "/auth";
  }, [isAuthorized, user]);

  if (((!user && jwtToken) || loginByJwtLoading) && !loginByJwtError) {
    return <Preloader />;
  }

  return (
    <>
      {/* Create `LayoutContext` from current `history` and `menuConfig`. */}
      <LayoutContextProvider history={history} menuConfig={menuConfig}>
        <Switch>
          {isAuthorized && <Redirect from="/auth" to={redirectFromAuth} />}
          {/* {isAuthorized ? (
            <Redirect from="/auth" to={redirectFromAuth} />
          ) : (
            <AuthPage />
          )} */}

          <Route path="/error" component={ErrorsPage} />
          <Route path="/logout" component={LogoutPage} />
          {!isAuthorized && <Route path="/auth" component={AuthPage} />}
          <Layout>
            <HomePage userLastLocation={userLastLocation} />
          </Layout>

          {/* {isAuthorized ? (
            <Layout>
              <HomePage userLastLocation={userLastLocation} />
            </Layout>
          ) : (
            <Redirect to="/auth/login" />
          )} */}
        </Switch>
      </LayoutContextProvider>
    </>
  );
});
