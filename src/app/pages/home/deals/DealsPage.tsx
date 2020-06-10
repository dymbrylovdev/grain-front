import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { connect, ConnectedProps } from "react-redux";
import { injectIntl, FormattedMessage, WrappedComponentProps } from "react-intl";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  TableFooter,
  TextField,
  Button,
} from "@material-ui/core";
import { IconButton } from "@material-ui/core";
import VisibilityIcon from "@material-ui/icons/Visibility";
import CustomIcon from "../../../components/ui/Images/CustomIcon";
import { useSnackbar } from "notistack";
import { useFormik } from "formik";
import * as Yup from "yup";

import { actions as dealsActions } from "../../../store/ducks/deals.duck";
import { actions as crops2Actions } from "../../../store/ducks/crops2.duck";

import TopTableCell from "../../../components/ui/Table/TopTableCell";
import useStyles from "../styles";
import { IAppState } from "../../../store/rootDuck";
import { Skeleton } from "@material-ui/lab";
import { ErrorPage } from "../../../components/ErrorPage";
import { LayoutSubheader } from "../../../../_metronic";
import { FilterModal } from "./components";
import { TablePaginator } from "./components/TablePaginator";
import { isDealsFilterEmpty } from "./utils/utils";

const DealsPage: React.FC<TPropsFromRedux & WrappedComponentProps> = ({
  intl,
  page,
  perPage,
  total,
  weeks,
  setWeeks,
  fetch,
  deals,
  loading,
  error,

  fetchDealsFilters,
  dealsFilters,
  filtersLoading,
  filtersError,

  fetchCrops,
  crops,
  cropsError,

  fetchAllCropParams,
  allCropParams,
  allCropParamsError,

  clearEditFilter,
  editFilter,
  editFilterLoading,
  editFilterSuccess,
  editFilterError,
}) => {
  const classes = useStyles();
  const history = useHistory();
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  const { values, handleSubmit, handleChange, touched, errors } = useFormik({
    initialValues: { weeks },
    onSubmit: values => {
      setWeeks(values.weeks);
      fetch(page, perPage, values.weeks);
    },
    validationSchema: Yup.object().shape({
      weeks: Yup.number()
        .required(intl.formatMessage({ id: "PROFILE.VALIDATION.REQUIRED_FIELD" }))
        .min(1, intl.formatMessage({ id: "YUP.NUMBERS.MIN" }, { min: 1 }))
        .max(100, intl.formatMessage({ id: "YUP.NUMBERS.MAX" }, { max: 100 }))
        .typeError(intl.formatMessage({ id: "YUP.NUMBERS" })),
    }),
  });

  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    if (editFilterSuccess || editFilterError) {
      enqueueSnackbar(
        editFilterSuccess
          ? intl.formatMessage({ id: "NOTISTACK.EDIT_FILTER" })
          : `${intl.formatMessage({ id: "NOTISTACK.ERRORS.ERROR" })} ${editFilterError}`,
        {
          variant: editFilterSuccess ? "success" : "error",
        }
      );
      clearEditFilter();
    }
    if (editFilterSuccess) {
      fetch(1, perPage, weeks);
      fetchDealsFilters();
    }
  }, [
    clearEditFilter,
    editFilterError,
    editFilterSuccess,
    enqueueSnackbar,
    fetch,
    fetchDealsFilters,
    intl,
    page,
    perPage,
    weeks,
  ]);

  useEffect(() => {
    if (!!dealsFilters) fetch(page, perPage, weeks);
  }, [dealsFilters, fetch, page, perPage, weeks]);

  useEffect(() => {
    fetchCrops();
  }, [fetchCrops]);

  useEffect(() => {
    fetchAllCropParams("enum");
  }, [fetchAllCropParams]);

  useEffect(() => {
    fetchDealsFilters();
  }, [fetchDealsFilters]);

  if (error || filtersError || cropsError || allCropParamsError) return <ErrorPage />;

  return (
    <Paper className={classes.tableContainer}>
      {!!crops && <LayoutSubheader title={intl.formatMessage({ id: "DEALS.TITLE" })} />}
      {
        <div
          className={classes.flexRow}
          style={{ justifyContent: "space-between", marginBottom: "8px", marginTop: "16px" }}
        >
          <div>
            <div>{intl.formatMessage({ id: "DEALS.WEEKS.TEXT" })}</div>
            <div className={classes.flexRow}>
              <div>
                <TextField
                  margin="normal"
                  label={intl.formatMessage({
                    id: "DEALS.WEEKS.WEEKS",
                  })}
                  value={values.weeks}
                  onChange={handleChange}
                  onBlur={() => handleSubmit()}
                  name="weeks"
                  variant="outlined"
                  helperText={touched.weeks && errors.weeks}
                  error={Boolean(touched.weeks && errors.weeks)}
                />
              </div>
              <div style={{ marginLeft: "16px" }}>
                <Button variant="contained" color="primary" onClick={() => handleSubmit()}>
                  {intl.formatMessage({ id: "DEALS.WEEKS.BUTTON" })}
                </Button>
              </div>
            </div>
          </div>
          <div>
            {intl.formatMessage({ id: "DEALS.FILTER.NAME" })}
            <IconButton
              onClick={() => {
                setFilterModalOpen(true);
              }}
            >
              <CustomIcon
                path={
                  isDealsFilterEmpty(dealsFilters)
                    ? "/media/filter/filter.svg"
                    : "/media/filter/filter_full.svg"
                }
              />
            </IconButton>
          </div>
        </div>
      }
      {!deals || !crops || !dealsFilters || !allCropParams ? (
        <>
          <Skeleton width="100%" height={52} animation="wave" />
          <Skeleton width="100%" height={77} animation="wave" />
          <Skeleton width="100%" height={77} animation="wave" />
          <Skeleton width="100%" height={77} animation="wave" />
          <Skeleton width="100%" height={77} animation="wave" />
          <Skeleton width="100%" height={77} animation="wave" />
          <Skeleton width="100%" height={53} animation="wave" />
        </>
      ) : !deals?.length ? (
        <div>{intl.formatMessage({ id: "DEALS.EMPTY" })}</div>
      ) : (
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TopTableCell>
                <FormattedMessage id="DEALS.TABLE.CROP" />
              </TopTableCell>
              <TopTableCell>
                <FormattedMessage id="DEALS.TABLE.SALE" />
              </TopTableCell>
              <TopTableCell>
                <FormattedMessage id="DEALS.TABLE.PURCHASE" />
              </TopTableCell>
              <TopTableCell>
                <FormattedMessage id="DEALS.TABLE.PROFIT" />
              </TopTableCell>
              <TopTableCell>
                <FormattedMessage id="DEALS.TABLE.DISTANCE" />
              </TopTableCell>
              <TopTableCell></TopTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!!deals &&
              deals.map((item, i) => (
                <TableRow key={i}>
                  <TableCell>
                    {crops.find(crop => crop.id === item.sale_bid.crop_id)?.name}
                  </TableCell>
                  <TableCell>
                    <div className={classes.flexColumn}>
                      <div>
                        <strong>{intl.formatMessage({ id: "DEALS.TABLE.PRICE" })}</strong>
                        <strong>{item.sale_bid.price}</strong>
                      </div>
                      <div>
                        <strong>{intl.formatMessage({ id: "DEALS.TABLE.VOLUME" })}</strong>
                        <strong>{item.sale_bid.volume}</strong>
                      </div>
                      <div>
                        {intl.formatMessage({ id: "DEALS.TABLE.LOCATION" })}
                        {item.sale_bid.location.text}
                      </div>
                      <div>
                        {intl.formatMessage({ id: "DEALS.TABLE.SELLER" })}
                        {item.sale_bid &&
                          item.sale_bid.vendor &&
                          ((item.sale_bid.vendor.company &&
                            item.sale_bid.vendor.company.short_name) ||
                            item.sale_bid.vendor.fio ||
                            item.sale_bid.vendor.login)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className={classes.flexColumn}>
                      <div>
                        <strong>{intl.formatMessage({ id: "DEALS.TABLE.PRICE" })}</strong>
                        <strong>{item.purchase_bid.price}</strong>
                      </div>
                      <div>
                        <strong>{intl.formatMessage({ id: "DEALS.TABLE.VOLUME" })}</strong>
                        <strong>{item.purchase_bid.volume}</strong>
                      </div>
                      <div>
                        {intl.formatMessage({ id: "DEALS.TABLE.LOCATION" })}
                        {item.purchase_bid.location.text}
                      </div>
                      <div>
                        {intl.formatMessage({ id: "DEALS.TABLE.BUYER" })}
                        {item.purchase_bid &&
                          item.purchase_bid.vendor &&
                          ((item.purchase_bid.vendor.company &&
                            item.purchase_bid.vendor.company.short_name) ||
                            item.purchase_bid.vendor.fio ||
                            item.purchase_bid.vendor.login)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{Math.round(item.profit_with_delivery_price)}</TableCell>
                  <TableCell>{item.distance}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="medium"
                      color="primary"
                      onClick={() =>
                        history.push(
                          `/deals/view/${item.purchase_bid.crop_id}/${item.sale_bid.id}/${item.purchase_bid.id}`
                        )
                      }
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePaginator
                page={page}
                realPerPage={deals.length}
                perPage={perPage}
                total={total}
                fetchRows={(page, perPage) => fetch(page, perPage, weeks)}
              />
            </TableRow>
          </TableFooter>
        </Table>
      )}
      <FilterModal
        intl={intl}
        isOpen={filterModalOpen}
        handleClose={() => setFilterModalOpen(false)}
        dealsFilters={dealsFilters}
        crops={crops}
        allCropParams={allCropParams}
        editFilter={editFilter}
        editFilterLoading={editFilterLoading}
      />
    </Paper>
  );
};

const connector = connect(
  (state: IAppState) => ({
    page: state.deals.page,
    perPage: state.deals.per_page,
    total: state.deals.total,
    weeks: state.deals.weeks,
    deals: state.deals.deals,
    loading: state.deals.loading,
    error: state.deals.error,

    dealsFilters: state.deals.filters,
    filtersLoading: state.deals.filtersLoading,
    filtersError: state.deals.filtersError,

    crops: state.crops2.crops,
    cropsError: state.crops2.error,

    allCropParams: state.crops2.allCropParams,
    allCropParamsError: state.crops2.allCropParamsError,

    editFilterLoading: state.deals.editFilterLoading,
    editFilterSuccess: state.deals.editFilterSuccess,
    editFilterError: state.deals.editFilterError,
  }),
  {
    fetch: dealsActions.fetchRequest,
    fetchDealsFilters: dealsActions.fetchFiltersRequest,
    fetchCrops: crops2Actions.fetchRequest,
    fetchAllCropParams: crops2Actions.allCropParamsRequest,
    clearEditFilter: dealsActions.clearEditFilter,
    editFilter: dealsActions.editFilterRequest,
    setWeeks: dealsActions.setWeeks,
  }
);

type TPropsFromRedux = ConnectedProps<typeof connector>;

export default connector(injectIntl(DealsPage));
