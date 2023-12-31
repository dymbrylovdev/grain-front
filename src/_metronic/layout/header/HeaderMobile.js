import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import objectPath from "object-path";
import * as builder from "../../ducks/builder";
import KTToggle from "../../_assets/js/toggle";

class HeaderMobile extends React.Component {
  toggleButtonRef = React.createRef();

  componentDidMount() {
    new KTToggle(this.toggleButtonRef.current, this.props.toggleOptions);
  }

  render() {
    const {
      //headerLogo,
      asideDisplay,
      //headerMenuSelfDisplay,
      headerMobileCssClasses,
      headerMobileAttributes,
      running,
      activeStep,
    } = this.props;

    return (
      <div
        id="kt_header_mobile"
        className={`kt-header-mobile ${headerMobileCssClasses}`}
        {...headerMobileAttributes}
      >
        <div className="kt-header-mobile__logo">
          <Link to="/">{/*<img alt="logo" src={headerLogo} />*/}</Link>
        </div>

        <div className="kt-header-mobile__toolbar">
          {asideDisplay && (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                color: "#ffffff",
                fontSize: 14,
                fontWeight: "bold",
                cursor: "pointer",
                padding: 4,
                borderRadius: 4,
              }}
              className={`${running && activeStep === 1 && "old_menu_item_text"}`}
              id="kt_aside_mobile_toggler"
            >
              <div>Меню</div>
              <button
                // className="kt-header-mobile__toggler kt-header-mobile__toggler--left old_menu_item_text"
                className={`kt-header-mobile__toggler kt-header-mobile__toggler--left`}
                onClick={() => {}}
              >
                <span />
              </button>
            </div>
          )}

          {/* {headerMenuSelfDisplay && (
            <button className="kt-header-mobile__toggler" id="kt_header_mobile_toggler">
              <span />
            </button>
          )} */}

          {/* <button
            ref={this.toggleButtonRef}
            className="kt-header-mobile__topbar-toggler"
            id="kt_header_mobile_topbar_toggler"
          >
            <i className="flaticon-more" />
          </button> */}
        </div>
      </div>
    );
  }
}

const mapStateToProps = store => ({
  headerLogo: builder.selectors.getStickyLogo(store),
  asideDisplay: objectPath.get(store.builder.layoutConfig, "aside.self.display"),
  headerMenuSelfDisplay:
    objectPath.get(store.builder.layoutConfig, "header.menu.self.display") === true,
  toggleOptions: {
    target: "body",
    targetState: "kt-header__topbar--mobile-on",
    togglerState: "kt-header-mobile__toolbar-topbar-toggler--active",
  },
  headerMobileCssClasses: builder.selectors.getClasses(store, {
    path: "header_mobile",
    toString: true,
  }),
  headerMobileAttributes: builder.selectors.getAttributes(store, {
    path: "aside_menu",
  }),
  running: store.prompter.running,
  activeStep: store.prompter.activeStep,
});

export default connect(mapStateToProps)(HeaderMobile);
