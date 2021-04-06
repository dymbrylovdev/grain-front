/**
 * High level router.
 *
 * Note: It's recommended to compose related routes in internal router
 * components (e.g: `src/pages/auth/AuthPage`, `src/pages/home/HomePage`).
 */

import React, {useEffect} from "react";
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
    clearLoginByJwt,
    loginByJwtSuccess
  } = useSelector(
    ({ auth, urls, builder: { menuConfig }, builder }) => {
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

  // useEffect(() => {
    // if (loginByJwtSuccess && !loginByJwtLoading) {
      // window.location.href = window.location.href.replace(`${jwtToken}`, '');;     
    // }
  // }, [loginByJwtSuccess, loginByJwtLoading])

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
            <Redirect from="/auth" to={userLastLocation} />
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
