import React, { useEffect, useState } from "react";
// import { useHistory } from "react-router-dom";
import { connect, ConnectedProps } from "react-redux";
import { injectIntl, WrappedComponentProps } from "react-intl";
import {
  Paper,
  // Button,
  AppBar,
  Tabs,
  Divider,
  Tab,
} from "@material-ui/core";
import { useSnackbar } from "notistack";

import { actions as funnelStatesActions } from "../../../store/ducks/funnelStates.duck";

import { a11yProps, TabPanel } from "../../../components/ui/Table/TabPanel";
import AlertDialog from "../../../components/ui/Dialogs/AlertDialog";
import useStyles from "../styles";
import { IAppState } from "../../../store/rootDuck";
import { LayoutSubheader } from "../../../../_metronic";
import { ErrorPage } from "../../../components/ErrorPage";
import FunnelStatesTable from "./components/FunnelStatesTable";

const FunnelStatesPage: React.FC<TPropsFromRedux & WrappedComponentProps> = ({
  intl,
  tab,
  setTab,
  fetch,
  funnelStates,
  loading,
  error,

  clearCreate,
  create,
  createLoading,
  createSuccess,
  createError,

  clearEdit,
  edit,
  editLoading,
  editSuccess,
  editError,

  clearDel,
  del,
  delLoading,
  delSuccess,
  delError,
}) => {
  const classes = useStyles();
  // const history = useHistory();

  const handleTabsChange = (event: any, newValue: number) => {
    setTab(newValue);
  };

  const [deleteUserId, setDeleteUserId] = useState(-1);
  const [isAlertOpen, setAlertOpen] = useState(false);

  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    if (delSuccess || delError) {
      enqueueSnackbar(
        delSuccess
          ? intl.formatMessage({ id: "NOTISTACK.ERRORS.DEL_USER" })
          : `${intl.formatMessage({ id: "NOTISTACK.ERRORS.ERROR" })} ${delError}`,
        {
          variant: delSuccess ? "success" : "error",
        }
      );
      setAlertOpen(false);
      clearDel();
      fetch();
    }
  }, [clearDel, delError, delSuccess, enqueueSnackbar, fetch, intl]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  useEffect(() => {
    document.getElementById("kt_aside_close_btn")?.click();
  });

  if (error) return <ErrorPage />;

  return (
    <Paper className={classes.tableContainer}>
      <LayoutSubheader title={intl.formatMessage({ id: "FUNNEL_STATES.TITLE" })} />
      <AppBar position="static" color="default" className={classes.appBar}>
        <Tabs
          value={tab}
          onChange={handleTabsChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label={intl.formatMessage({ id: "FUNNEL_STATES.TABS.BUYERS" })} {...a11yProps(0)} />
          <Tab label={intl.formatMessage({ id: "FUNNEL_STATES.TABS.SELLERS" })} {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <Divider />
      <TabPanel value={tab} index={0} style={{ margin: 0 }}>
        <FunnelStatesTable
          intl={intl}
          setAlertOpen={setAlertOpen}
          setDeleteUserId={setDeleteUserId}
          funnelStates={funnelStates && funnelStates.filter(item => item.role === "ROLE_BUYER")}
        />
      </TabPanel>
      <TabPanel value={tab} index={1} style={{ margin: 0 }}>
        <FunnelStatesTable
          intl={intl}
          setAlertOpen={setAlertOpen}
          setDeleteUserId={setDeleteUserId}
          funnelStates={funnelStates && funnelStates.filter(item => item.role === "ROLE_VENDOR")}
        />
      </TabPanel>
      <AlertDialog
        isOpen={isAlertOpen}
        text={intl.formatMessage({
          id: "FUNNEL_STATES.DIALOGS.DELETE_TEXT",
        })}
        okText={intl.formatMessage({
          id: "FUNNEL_STATES.DIALOGS.AGREE_TEXT",
        })}
        cancelText={intl.formatMessage({
          id: "FUNNEL_STATES.DIALOGS.CANCEL_TEXT",
        })}
        handleClose={() => setAlertOpen(false)}
        handleAgree={() => del(deleteUserId)}
        loadingText={intl.formatMessage({
          id: "FUNNEL_STATES.DIALOGS.LOADING_TEXT",
        })}
        isLoading={delLoading}
      />
    </Paper>
  );
};

const connector = connect(
  (state: IAppState) => ({
    tab: state.funnelStates.tab,
    funnelStates: state.funnelStates.funnelStates,
    loading: state.funnelStates.loading,
    error: state.funnelStates.error,
    createLoading: state.funnelStates.createLoading,
    createSuccess: state.funnelStates.createSuccess,
    createError: state.funnelStates.createError,
    editLoading: state.funnelStates.editLoading,
    editSuccess: state.funnelStates.editSuccess,
    editError: state.funnelStates.editError,
    delLoading: state.funnelStates.delLoading,
    delSuccess: state.funnelStates.delSuccess,
    delError: state.funnelStates.delError,
  }),
  {
    setTab: funnelStatesActions.setTab,
    fetch: funnelStatesActions.fetchRequest,
    clearCreate: funnelStatesActions.clearCreate,
    create: funnelStatesActions.createRequest,
    clearEdit: funnelStatesActions.clearEdit,
    edit: funnelStatesActions.editRequest,
    clearDel: funnelStatesActions.clearDel,
    del: funnelStatesActions.delRequest,
  }
);

type TPropsFromRedux = ConnectedProps<typeof connector>;

export default connector(injectIntl(FunnelStatesPage));
