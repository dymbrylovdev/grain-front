/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import { connect } from "react-redux";
import objectPath from "object-path";
import { withRouter } from "react-router-dom";

import { LayoutContextConsumer } from "../LayoutContext";
import * as builder from "../../ducks/builder";
import BreadCrumbs from "./components/BreadCrumbs";
import { Button } from "@material-ui/core";
import { injectIntl } from "react-intl";
import { accessByRoles } from "../../../app/utils/utils";
import Modal from "../../../app/components/ui/Modal";

class SubHeader extends React.Component {
  constructor() {
    super();
    this.state = {
      open: false,
    };
  }
  render() {
    const { subheaderCssClasses, subheaderContainerCssClasses, subheaderMobileToggle, me, history } = this.props;

    return (
      <div
        id="kt_subheader"
        className={`kt-subheader ${subheaderCssClasses} kt-grid__item`}
        style={{
          top: 50,
          left: 0,
          boxShadow: "0 0 5px rgba(0,0,0,0.15)",
          zIndex: 100,
        }}
      >
        <div className={`kt-container ${subheaderContainerCssClasses}`}>
          <div className="kt-subheader__main">
            {subheaderMobileToggle && (
              <button className="kt-subheader__mobile-toggle kt-subheader__mobile-toggle--left" id="kt_subheader_mobile_toggle">
                <span />
              </button>
            )}

            <LayoutContextConsumer>
              {({ subheader: { title, breadcrumb } }) => (
                <>
                  <h3 className="kt-subheader__title">{title}</h3>
                  <BreadCrumbs items={breadcrumb} />
                </>
              )}
            </LayoutContextConsumer>

            {/* <span className="kt-subheader__separator kt-subheader__separator--v" /> */}
            {/* <span className="kt-subheader__desc">#XRS-45670</span> */}
            {/* <a href="#" className="btn btn-label-warning btn-bold btn-sm btn-icon-h kt-margin-l-10">
              Add New
            </a> */}
          </div>

          <div className="kt-subheader__toolbar">
            {/* {!!me && !me.company_confirmed_by_payment && !me.company_confirmed_by_email && (
              <div>
                <Tooltip
                  title={intl.formatMessage({
                    id: "COMPANY.CONFIRM.NO_CONFIRM",
                  })}
                >
                  <ReportProblemIcon
                    color="error"
                    style={{ marginRight: 16, width: 16, height: 16 }}
                  />
                </Tooltip>
              </div>
            )} */}
            <div className="kt-subheader__wrapper">
              {/* <div>email: {me.login}</div>
              <div>
                роль:{" "}
                {me?.roles?.length > 0 ? roles.find(item => item.id === me.roles[0])?.value : ""}
              </div> */}
              {/* <button type="button" className="btn kt-subheader__btn-primary">
                Actions &nbsp;
                <SortNum1Icon className="kt-svg-icon kt-svg-icon--sm" />
              </button>
              <QuickActions /> */}
              {/* <IconButton>
                <SaveIcon className="kt-svg-icon kt-svg-icon--primary kt-svg-icon--md" />
              </IconButton> */}
            </div>
            {!me && (
              <Button className="kt-subheader__btn" variant="contained" color="secondary" onClick={() => history.push(`/auth`)}>
                Авторизоваться
              </Button>
            )}
            {me && accessByRoles(me, ["ROLE_ADMIN", "ROLE_MANAGER"]) && (
              <Button variant="contained" color="primary" onClick={() => history.push("/user/create")} className="kt-subheader__top-btn">
                Добавить пользователя
              </Button>
            )}

            {(!accessByRoles(me, ["ROLE_MANAGER", "ROLE_TRANSPORTER"]) || !me) && (
              <Button
                className="kt-subheader__btn"
                variant="contained"
                color="primary"
                onClick={() => (me ? history.push(`/bid/create/${me.is_buyer ? "purchase" : "sale"}/0`) : this.setState({ open: true }))}
              >
                Добавить объявление
              </Button>
            )}

            {(accessByRoles(me, ["ROLE_BUYER", "ROLE_VENDOR", "ROLE_TRADER"]) || !me) && (
              <Button
                className="kt-subheader__btn"
                variant="contained"
                color="secondary"
                onClick={() => (me ? history.push(`/user/profile/tariffs`) : this.setState({ open: true }))}
              >
                Купить тариф
              </Button>
            )}
          </div>
        </div>
        <Modal
          open={this.state.open}
          onClose={() => this.setState({ open: false })}
          title={"Чтобы продолжить действие с редактированием профиля или объявления, авторизуйтесь!"}
          actions={[
            {
              title: "Cancel",
              onClick: () => this.setState({ open: false }),
            },
            {
              title: "OK",
              onClick: () => history.push(`/auth`),
            },
          ]}
        />
      </div>
    );
  }
}

const mapStateToProps = store => ({
  config: store.builder.layoutConfig,
  menuConfig: store.builder.menuConfig,
  subheaderMobileToggle: objectPath.get(store.builder.layoutConfig, "subheader.mobile-toggle"),
  subheaderCssClasses: builder.selectors.getClasses(store, {
    path: "subheader",
    toString: true,
  }),
  subheaderContainerCssClasses: builder.selectors.getClasses(store, {
    path: "subheader_container",
    toString: true,
  }),
  me: store.auth.user,
});

export default injectIntl(withRouter(connect(mapStateToProps)(SubHeader)));
