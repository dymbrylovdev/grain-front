import React, { useState, useEffect, useCallback } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { Link } from "@material-ui/core";
import { toAbsoluteUrl } from "../../../_metronic";
import "../../../_metronic/_assets/sass/pages/login/login-1.scss";
import Login from "./Login";
import Registration from "./Registration";
import ForgotPassword from "./ForgotPassword";
import EmailSentPage from "./EmailSentPage";
import ChangePassword from "./ChangePassword";
import useFetch from "../../hooks/useFetch";
import TermDialog from "./components/TermDialog";

export default function AuthPage() {
  const [openUserAgreement, setOpenUserAgreement] = useState(false);
  const [{ response }, requestUserAgreement] = useFetch("api/_public/document/user_agreement");

  useEffect(() => {
    requestUserAgreement();
  }, [requestUserAgreement]);

  const closeUserAgreement = useCallback(()=>{
      setOpenUserAgreement(false);
  },[])

  return (
    <>
      <div className="kt-grid kt-grid--ver kt-grid--root">
        <div id="kt_login" className="kt-grid kt-grid--hor kt-grid--root kt-login kt-login--v1">
          <div className="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--desktop kt-grid--ver-desktop kt-grid--hor-tablet-and-mobile">
            <div
              className="kt-grid__item kt-grid__item--order-tablet-and-mobile-2 kt-grid kt-grid--hor kt-login__aside"
              style={{
                backgroundImage: `url(${toAbsoluteUrl("/media/bg/bg-4.jpg")})`,
              }}
            >
              <div className="kt-grid__item"></div>
              <div className="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--ver">
                <div className="kt-grid__item kt-grid__item--middle">
                  <h3 className="kt-login__title">
                    <FormattedMessage id="START.WELCOME" />
                  </h3>
                  <h4 className="kt-login__subtitle">
                    <FormattedMessage id="START.DESCRIPTION" />
                  </h4>
                </div>
              </div>
              <div className="kt-grid__item">
                <div className="kt-login__info">
                  <div className="kt-login__copyright">
                    <div className="kt-login__menu">
                      <a
                        href={"https://start-mobile.net"}
                        className="kt-link"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                      <FormattedMessage id="AUTH.CREATOR.COMPANY" />
                      </a>
                    </div>
                  </div>
                  <div className="kt-login__menu">
                    <Link className="kt-link" onClick={() => setOpenUserAgreement(true)}>
                      <FormattedMessage id="SUBMENU.LEGAL" />
                    </Link>
                    <div>
                      <TermDialog isOpen={openUserAgreement} response={response} handleClose={closeUserAgreement}/>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="kt-grid__item kt-grid__item--fluid  kt-grid__item--order-tablet-and-mobile-1  kt-login__wrapper">
              <Switch>
                <Route path="/auth/login" component={Login} />
                <Route path="/auth/registration" component={Registration} />
                <Route path="/auth/forgot-password" component={ForgotPassword} />
                <Route path="/auth/email-sent/forgot" component={EmailSentPage}/>
                <Route path="/auth/email-sent/registration" component={EmailSentPage}/>
                <Route path="/auth/change_password/:code" component={ChangePassword}/>
                <Redirect from="/auth" exact={true} to="/auth/login" />
                <Redirect to="/auth/login" />
              </Switch>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
