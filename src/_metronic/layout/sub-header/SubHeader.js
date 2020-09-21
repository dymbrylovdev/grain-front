/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import { connect } from "react-redux";
import objectPath from "object-path";
import { withRouter } from "react-router-dom";
//import SaveIcon from "@material-ui/icons/Save";
//import IconButton from "@material-ui/core/IconButton";
import ReportProblemIcon from "@material-ui/icons/ReportProblem";

import { LayoutContextConsumer } from "../LayoutContext";
import * as builder from "../../ducks/builder";
// import { QuickActions } from './components/QuickActions';
// import { ReactComponent as SortNum1Icon } from '../../../_metronic/layout/assets/layout-svg-icons/SortNum1.svg';
import BreadCrumbs from "./components/BreadCrumbs";
import { Button, Tooltip } from "@material-ui/core";
import { roles } from "../../../app/pages/home/users/utils/profileForm";
import { injectIntl } from "react-intl";

class SubHeader extends React.Component {
  render() {
    const {
      subheaderCssClasses,
      subheaderContainerCssClasses,
      subheaderMobileToggle,
      me,
      history,
      intl,
    } = this.props;
    return (
      <div id="kt_subheader" className={`kt-subheader ${subheaderCssClasses} kt-grid__item`}>
        <div className={`kt-container ${subheaderContainerCssClasses}`}>
          <div className="kt-subheader__main">
            {subheaderMobileToggle && (
              <button
                className="kt-subheader__mobile-toggle kt-subheader__mobile-toggle--left"
                id="kt_subheader_mobile_toggle"
              >
                <span />
              </button>
            )}

            <LayoutContextConsumer>
              {/*{({ subheader: { title, breadcrumb } }) => (*/}

              {({ subheader: { title, breadcrumb } }) => (
                <>
                  <h3 className="kt-subheader__title">{title}</h3>
                  <BreadCrumbs items={breadcrumb} />
                </>
              )}
            </LayoutContextConsumer>

            {/*<span className="kt-subheader__separator kt-subheader__separator--v" />*/}
            {/* <span className="kt-subheader__desc">#XRS-45670</span> */}
            {/* <a href="#" className="btn btn-label-warning btn-bold btn-sm btn-icon-h kt-margin-l-10">
              Add New
            </a> */}
          </div>

          <div className="kt-subheader__toolbar">
            {!!me && !me.company_confirmed_by_payment && !me.company_confirmed_by_email && (
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
            )}
            <div className="kt-subheader__wrapper" style={{ marginRight: 16 }}>
              <div>email: {me.login}</div>
              <div>
                роль:{" "}
                {me?.roles?.length > 0 ? roles.find(item => item.id === me.roles[0])?.value : ""}
              </div>
              {/* <button type="button" className="btn kt-subheader__btn-primary">
                Actions &nbsp;
                <SortNum1Icon className="kt-svg-icon kt-svg-icon--sm" />
              </button>
              <QuickActions /> */}
              {/* <IconButton>
                <SaveIcon className="kt-svg-icon kt-svg-icon--primary kt-svg-icon--md" />
              </IconButton> */}
            </div>
            {me && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => history.push(`/bid/create/${me.is_buyer ? "purchase" : "sale"}/0`)}
              >
                Добавить объявление
              </Button>
            )}
          </div>
        </div>
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
