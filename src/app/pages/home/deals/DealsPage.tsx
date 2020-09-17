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
  TextField,
  Button,
  Tooltip,
} from "@material-ui/core";
import { IconButton } from "@material-ui/core";
import VisibilityIcon from "@material-ui/icons/Visibility";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
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
import { LayoutSubheader } from "../../../../_metronic";
import { FilterModal } from "./components";
import { isDealsFilterEmpty } from "./utils/utils";
import { accessByRoles } from "../../../utils/utils";
import NumberFormatCustom from "../../../components/NumberFormatCustom/NumberFormatCustom";
import MiniTrafficLight from "../users/components/miniTrafficLight/MiniTrafficLight";

const DealsPage: React.FC<TPropsFromRedux & WrappedComponentProps> = ({
  intl,

  me,

  page,
  perPage,
  total,
  weeks,
  setWeeks,
  term,
  setTerm,
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

  const { values, handleSubmit, touched, errors, setFieldValue, resetForm } = useFormik({
    initialValues: { weeks, term },
    onSubmit: values => {
      setWeeks(values.weeks > 0 ? values.weeks : 1);
      setTerm(values.term);
      fetch(page, perPage, values.weeks > 0 ? values.weeks : 1, !values.term ? 999 : +values.term);
    },
    validationSchema: Yup.object().shape({
      weeks: Yup.number().required(intl.formatMessage({ id: "PROFILE.VALIDATION.REQUIRED_FIELD" })),
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
      fetch(1, perPage, weeks, !term ? 999 : +term);
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
    term,
    weeks,
  ]);

  useEffect(() => {
    if (!!dealsFilters) fetch(page, perPage, weeks, !term ? 999 : +term);
  }, [dealsFilters, fetch, page, perPage, term, weeks]);

  useEffect(() => {
    fetchCrops();
  }, [fetchCrops]);

  useEffect(() => {
    fetchAllCropParams("enum");
  }, [fetchAllCropParams]);

  useEffect(() => {
    fetchDealsFilters();
  }, [fetchDealsFilters]);

  useEffect(() => {
    resetForm({
      values: { weeks, term },
    });
  }, [resetForm, term, weeks]);

  if (error || filtersError || cropsError || allCropParamsError) {
    setTimeout(() => {
      window.location.reload();
    }, 10000);
  }

  return (
    <Paper className={classes.paperWithTable}>
      {!!crops && <LayoutSubheader title={intl.formatMessage({ id: "DEALS.TITLE" })} />}
      {
        <div
          className={classes.flexRow}
          style={{ justifyContent: "space-between", marginBottom: "8px", marginTop: "16px" }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <div style={{ marginRight: "16px" }}>
              <div>{intl.formatMessage({ id: "DEALS.WEEKS.TEXT" })}</div>
              <div style={{ width: 200 }}>
                <TextField
                  margin="normal"
                  label={intl.formatMessage({
                    id: "DEALS.WEEKS.WEEKS",
                  })}
                  value={values.weeks}
                  onChange={e => {
                    let newValue = e.target.value;
                    if (+newValue < 0) {
                      newValue = "0";
                    }
                    if (+newValue > 100) {
                      newValue = "100";
                    }
                    setFieldValue("weeks", newValue);
                  }}
                  InputProps={{ inputComponent: NumberFormatCustom as any }}
                  onBlur={() => handleSubmit()}
                  name="weeks"
                  variant="outlined"
                  helperText={touched.weeks && errors.weeks}
                  error={Boolean(touched.weeks && errors.weeks)}
                  autoComplete="off"
                />
              </div>
            </div>
            <div style={{ marginRight: "16px" }}>
              <div>{intl.formatMessage({ id: "FILTER.FORM.MAX_PAYMENT_TERM1" })}</div>
              <div style={{ width: 200 }}>
                <TextField
                  type="text"
                  label={intl.formatMessage({
                    id: "FILTER.FORM.MAX_PAYMENT_TERM2",
                  })}
                  margin="normal"
                  name="term"
                  value={values.term || ""}
                  variant="outlined"
                  onBlur={() => handleSubmit()}
                  onChange={e => {
                    let newValue = e.target.value;
                    if (+newValue < 0) {
                      newValue = "0";
                    }
                    if (+newValue > 999) {
                      newValue = "999";
                    }
                    setFieldValue("term", newValue);
                  }}
                  InputProps={{ inputComponent: NumberFormatCustom as any }}
                  autoComplete="off"
                />
              </div>
            </div>

            <div style={{ marginTop: 8, marginBottom: 8 }}>
              <Button variant="contained" color="primary" onClick={() => handleSubmit()}>
                {intl.formatMessage({ id: "DEALS.WEEKS.BUTTON" })}
              </Button>
            </div>
          </div>
          {accessByRoles(me, ["ROLE_ADMIN", "ROLE_MANAGER"]) && (
            <div
              className={classes.flexRow}
              style={{ textAlign: "right", marginLeft: 16, alignSelf: "flex-start" }}
            >
              <div>{intl.formatMessage({ id: "DEALS.FILTER.NAME" })}</div>
              <div>
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
          )}
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
        <div className={classes.table}>
          <Table aria-label="simple table">
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
                <TopTableCell>
                  <FormattedMessage id="BIDSLIST.TABLE.TIME" />
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
                          {intl.formatMessage({ id: "PROFILE.INPUT.LOCATION.SALE" })}
                          {": "}
                          {item.sale_bid.location.text}
                        </div>
                        <div>{intl.formatMessage({ id: "DEALS.TABLE.SELLER" })}</div>
                        <div>
                          <div className={classes.flexRow}>
                            {item?.sale_bid?.vendor?.company_confirmed_by_payment && (
                              <Tooltip
                                title={intl.formatMessage({
                                  id: "USERLIST.TOOLTIP.COMPANY",
                                })}
                              >
                                <CheckCircleOutlineIcon
                                  color="secondary"
                                  style={{ marginRight: 4, width: 16, height: 16 }}
                                />
                              </Tooltip>
                            )}
                            <div>{`${item?.sale_bid.vendor.fio ||
                              item?.sale_bid.vendor.login ||
                              ""}`}</div>
                          </div>
                          {item?.sale_bid.vendor.company && (
                            <div className={classes.flexRow} style={{ marginTop: 10 }}>
                              {!!item?.sale_bid?.vendor?.company?.colors &&
                                item?.sale_bid.vendor.company.colors.length > 0 && (
                                  <MiniTrafficLight
                                    intl={intl}
                                    colors={item?.sale_bid.vendor.company.colors}
                                  />
                                )}
                              <div>{`${item?.sale_bid.vendor.company.short_name || ""}`}</div>
                            </div>
                          )}
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
                          {intl.formatMessage({ id: "PROFILE.INPUT.LOCATION.PURCHASE" })}
                          {": "}
                          {item.purchase_bid.location.text}
                        </div>
                        <div>{intl.formatMessage({ id: "DEALS.TABLE.BUYER" })}</div>
                        <div>
                          <div className={classes.flexRow}>
                            {item?.purchase_bid?.vendor?.company_confirmed_by_payment && (
                              <Tooltip
                                title={intl.formatMessage({
                                  id: "USERLIST.TOOLTIP.COMPANY",
                                })}
                              >
                                <CheckCircleOutlineIcon
                                  color="secondary"
                                  style={{ marginRight: 4, width: 16, height: 16 }}
                                />
                              </Tooltip>
                            )}
                            <div>{`${item?.purchase_bid.vendor.fio ||
                              item?.purchase_bid.vendor.login ||
                              ""}`}</div>
                          </div>
                          {item?.purchase_bid.vendor.company && (
                            <div className={classes.flexRow} style={{ marginTop: 10 }}>
                              {!!item?.purchase_bid?.vendor?.company?.colors &&
                                item?.purchase_bid.vendor.company.colors.length > 0 && (
                                  <MiniTrafficLight
                                    intl={intl}
                                    colors={item?.purchase_bid.vendor.company.colors}
                                  />
                                )}
                              <div>{`${item?.purchase_bid.vendor.company.short_name || ""}`}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{Math.round(item.profit_with_delivery_price)}</TableCell>
                    <TableCell>{item.distance}</TableCell>
                    <TableCell>{item.purchase_bid.payment_term || "-"}</TableCell>
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
            {/* <TableFooter>
              <TableRow>
                <TablePaginator
                  page={page}
                  realPerPage={deals.length}
                  perPage={perPage}
                  total={total}
                  fetchRows={(page, perPage) => fetch(page, perPage, weeks, !term ? 999 : +term)}
                />
              </TableRow>
            </TableFooter> */}
          </Table>
        </div>
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
    me: state.auth.user,
    page: state.deals.page,
    perPage: state.deals.per_page,
    total: state.deals.total,
    weeks: state.deals.weeks,
    term: state.deals.term,
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
    setTerm: dealsActions.setTerm,
  }
);

type TPropsFromRedux = ConnectedProps<typeof connector>;

export default connector(injectIntl(DealsPage));
