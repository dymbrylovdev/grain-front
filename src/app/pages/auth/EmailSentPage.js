import React  from "react";
import { injectIntl } from "react-intl";
import { Link  } from "react-router-dom";
import { useSelector, shallowEqual } from "react-redux";

function EmailSentPage({ intl, match: { url } }) {
  const { email } = useSelector(
    ({ auth: { emailRequested } }) => ({ email: emailRequested }),
    shallowEqual
  );

  const by =
  (url.indexOf("registration") !== -1 && "registration") ||
  (url.indexOf("forgot") !== -1 && "forgot");

  return (
    <div className="kt-login__body">
      <div className="kt-login__form">
        <div className="kt-login__title">
          <h3>{intl.formatMessage({ id: "AUTH.EMAIL.TITLE" })}</h3>
        </div>
        <div className="kt-login__subtitle">
          <h5>{intl.formatMessage({ id: "AUTH.EMAIL.DESCRIPTION" }, { name: email })}</h5>
        </div>
        <div className="kt-login__actions">
          <Link to= {`${by === "forgot" ? "/auth/forgot-password" : "/auth" }`}>
            <button type="button" className="btn btn-secondary btn-elevate kt-login__btn-secondary">
              {intl.formatMessage({ id: "AUTH.BUTTON.BACK" })}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default injectIntl(EmailSentPage);
