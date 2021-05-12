/**
 * High level router.
 *
 * Note: It's recommended to compose related routes in internal router
 * components (e.g: `src/pages/auth/AuthPage`, `src/pages/home/HomePage`).
 */

import React, {useEffect, useMemo} from "react";
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
  
  const jwtToken = new URL(window.location.href).searchParams.get('bearer');
  useEffect(() => {
    if (jwtToken) dispatch(authActions.loginByJwtRequest({jwt: jwtToken}));
  }, [dispatch])

  const {
    isAuthorized,
    menuConfig,
    userLastLocation,
    user,
    loginByJwtLoading,
    loginByJwtError,
  } = useSelector(
    ({ auth, builder: { menuConfig } }) => {
      return {
        menuConfig,
        isAuthorized: auth.user != null,
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
    if (loginByJwtError) {
      enqueueSnackbar(loginByJwtError, {
        variant: "error",
      });
    }
  }, [loginByJwtError, enqueueSnackbar])

  const redirectFromAuth = useMemo(() => {
    // console.log(user);
    if (isAuthorized && user) {
      if (user.roles.includes('ROLE_ADMIN') || user.roles.includes('ROLE_MANAGER') || user.roles.includes('ROLE_TRADER') || user.roles.includes('ROLE_BUYER')) {
        return `/sale/best-bids/${user.main_crop ? user.main_crop.id : 0}`;
      } else {
        return `/purchase/best-bids/${user.main_crop ? user.main_crop.id : 0}`;
      }
    }
    return '/auth';
  }, [isAuthorized, user])

  if (((!user && jwtToken) || loginByJwtLoading) && !loginByJwtError) {
    return <Preloader/>;
  }

  return (
    <>
      {/* Create `LayoutContext` from current `history` and `menuConfig`. */}
      <LayoutContextProvider history={history} menuConfig={menuConfig}>
        <Switch>
          {isAuthorized ? (
            /* Otherwise redirect to root page (`/`) */
            <Redirect from="/auth" to={redirectFromAuth} />
          ) : (
            /* Render auth page when user at `/auth` and not authorized. */
            <AuthPage />
          )}

          <Route path="/error" component={ErrorsPage} />
          <Route path="/logout" component={LogoutPage} />

          {isAuthorized ? (
            <Layout>
              <HomePage userLastLocation={userLastLocation} />
            </Layout>
          ) : (
            /* Redirect to `/auth` when user is not authorized */
            <Redirect to="/auth/login" />
          )}
        </Switch>
      </LayoutContextProvider>
    </>
  );
});
