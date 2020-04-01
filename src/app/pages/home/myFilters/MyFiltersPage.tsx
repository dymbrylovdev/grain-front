import React, { useEffect, useState } from "react";
import { compose } from "redux";
import { useHistory } from "react-router-dom";
import { connect, ConnectedProps } from "react-redux";
import {
  IconButton,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
} from "@material-ui/core";
import { injectIntl, WrappedComponentProps, FormattedMessage } from "react-intl";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import VisibilityIcon from "@material-ui/icons/Visibility";

import Preloader from "../../../components/ui/Loaders/Preloader";
import { IAppState } from "../../../store/rootDuck";
import { actions as myFiltersActions } from "../../../store/ducks/myFilters.duck";
import useStyles from "../styles";
import AlertDialog from "../../../components/ui/Dialogs/AlertDialog";
import TopTableCell from "../../../components/ui/Table/TopTableCell";
import StatusIndicator from "../../../components/ui/Table/StatusIndicator";

const MyFiltersPage: React.FC<TPropsFromRedux & WrappedComponentProps> = ({
  intl,
  fetchFilters,
  myFilters,
  loadingFilters,
  clearCreateFilter,
  createFilter,
  createLoading,
  createSuccess,
  clearDelFilter,
  delFilter,
  delLoading,
  delSuccess,
  clearEditFilter,
  editFilter,
  editLoading,
  editSuccess,
}) => {
  const classes = useStyles();
  const history = useHistory();

  const [deleteFilterId, setDeleteFilterId] = useState(-1);
  const [isAlertOpen, setAlertOpen] = useState(false);

  useEffect(() => {
    if (!myFilters && !loadingFilters) {
      fetchFilters();
      //delFilter(52);
    }
  }, [delFilter, fetchFilters, loadingFilters, myFilters]);

  if (!myFilters) return <Preloader />;

  return (
    <Paper className={classes.tableContainer}>
      <AlertDialog
        isOpen={isAlertOpen}
        text={intl.formatMessage({
          id: "FILTER.DIALOGS.DELETE_TEXT",
        })}
        okText={intl.formatMessage({
          id: "FILTER.DIALOGS.AGREE_TEXT",
        })}
        cancelText={intl.formatMessage({
          id: "FILTER.DIALOGS.CANCEL_TEXT",
        })}
        handleClose={() => setAlertOpen(false)}
        handleAgree={() => {
          setAlertOpen(false);
          delFilter(deleteFilterId);
        }}
      />
      <Button
        className={classes.marginTopAndBottom}
        variant="contained"
        color="primary"
        onClick={() => history.push("/user/filters/edit/new")}
      >
        {intl.formatMessage({ id: "FILTER.BUTTON.CREATE" })}
      </Button>

      {!myFilters.length ? (
        <div>
          <FormattedMessage id="FILTERS.TABLE.EMPTY" />
        </div>
      ) : (
        <Table aria-label="simple table" className={classes.table}>
          <TableHead>
            <TableRow>
              <TopTableCell>
                <FormattedMessage id="FILTERS.TABLE.HEADER.CROP" />
              </TopTableCell>
              <TopTableCell>
                <FormattedMessage id="FILTERS.TABLE.HEADER.NAME" />
              </TopTableCell>
              <TopTableCell>
                <FormattedMessage id="FILTERS.TABLE.HEADER.SUBSCRIPTION" />
              </TopTableCell>
              <TopTableCell align="right"></TopTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {myFilters
              .sort((a, b) => a.crop.id - b.crop.id)
              .map(item => (
                <TableRow key={item.id}>
                  <TableCell>{item.crop.name}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>
                    <StatusIndicator isActive={false} />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="medium"
                      color="primary"
                      onClick={() => history.push(`/user/filters/view/${item.id}`)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      size="medium"
                      color="primary"
                      onClick={() => history.push(`/user/filters/edit/${item.id}`)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="medium"
                      onClick={() => {
                        setDeleteFilterId(item.id);
                        setAlertOpen(true);
                      }}
                      color="secondary"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      )}
    </Paper>
  );
};

const connector = connect(
  (state: IAppState) => ({
    myFilters: state.myFilters.myFilters,
    loadingFilters: state.myFilters.loading,
    createLoading: state.myFilters.createLoading,
    createSuccess: state.myFilters.createSuccess,
    delLoading: state.myFilters.delLoading,
    delSuccess: state.myFilters.delSuccess,
    editLoading: state.myFilters.editLoading,
    editSuccess: state.myFilters.editSuccess,
  }),
  {
    fetchFilters: myFiltersActions.fetchRequest,
    clearCreateFilter: myFiltersActions.clearCreate,
    createFilter: myFiltersActions.createRequest,
    clearDelFilter: myFiltersActions.clearDel,
    delFilter: myFiltersActions.delRequest,
    clearEditFilter: myFiltersActions.clearEdit,
    editFilter: myFiltersActions.editRequest,
  }
);

type TPropsFromRedux = ConnectedProps<typeof connector>;

export default compose(connector, injectIntl)(MyFiltersPage);
