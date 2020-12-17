import React, { useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { Paper, AppBar, Tabs, Divider, Tab } from "@material-ui/core";

import { actions as funnelStatesActions } from "../../../store/ducks/funnelStates.duck";

import { a11yProps, TabPanel } from "../../../components/ui/Table/TabPanel";
import useStyles from "../styles";
import { IAppState } from "../../../store/rootDuck";
import { LayoutSubheader } from "../../../../_metronic";
import ActivityReport from "./components/ActivityReport";

const ActivityReportPage: React.FC<TPropsFromRedux & WrappedComponentProps> = ({
  intl,
  me,
  tab,
  setTab,
  fetch,
  reports,
  loading,
  error,
}) => {
  const classes = useStyles();
  // const history = useHistory();

  const handleTabsChange = (event: any, newValue: number) => {
    setTab(newValue);
  };

  useEffect(() => {
    fetch();
  }, [fetch]);

  if (error) {
    setTimeout(() => {
      window.location.reload();
    }, 10000);
  }

  return (
    <Paper className={classes.paperWithForm}>
      <div className={classes.form2}>
        <LayoutSubheader title={intl.formatMessage({ id: "SUBMENU.ACTIVITY_REPORT" })} />
        <AppBar position="static" color="default" className={classes.appBar}>
          <Tabs
            value={tab}
            onChange={handleTabsChange}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab
              label={intl.formatMessage({ id: "FUNNEL_STATES.TABS.BUYERS" })}
              {...a11yProps(0)}
            />
            <Tab
              label={intl.formatMessage({ id: "FUNNEL_STATES.TABS.SELLERS" })}
              {...a11yProps(1)}
            />
          </Tabs>
        </AppBar>
        <Divider />
        <TabPanel value={tab} index={0} style={{ margin: 0 }}>
          <ActivityReport
            intl={intl}
            reports={reports && reports.filter(item => item.role === "ROLE_BUYER")}
          />
        </TabPanel>
        <TabPanel value={tab} index={1} style={{ margin: 0 }}>
          <ActivityReport
            intl={intl}
            reports={reports && reports.filter(item => item.role === "ROLE_VENDOR")}
          />
        </TabPanel>
      </div>
    </Paper>
  );
};

const connector = connect(
  (state: IAppState) => ({
    me: state.auth.user,
    tab: state.funnelStates.reportTab,
    reports: state.funnelStates.reports,
    loading: state.funnelStates.reportLoading,
    error: state.funnelStates.reportError,
  }),
  {
    setTab: funnelStatesActions.setReportTab,
    fetch: funnelStatesActions.fetchReportRequest,
  }
);

type TPropsFromRedux = ConnectedProps<typeof connector>;

export default connector(injectIntl(ActivityReportPage));
