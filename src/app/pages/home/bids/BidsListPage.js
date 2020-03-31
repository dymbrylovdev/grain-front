import React, { useEffect, useState, useCallback } from "react";
import { injectIntl, FormattedMessage } from "react-intl";
import { connect, useSelector, shallowEqual } from "react-redux";
import { Link } from "react-router-dom";
import { Paper, IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import * as auth from "../../../store/ducks/auth.duck";
import * as bidsDuck from "../../../store/ducks/bids.duck";
import * as crops from "../../../store/ducks/crops.duck";
import * as prompter from "../../../store/ducks/prompter.duck";
import useStyles from "../styles";
import { filterForRequest, isFilterEmpty } from "../../../utils";

import AlertDialog from "../../../components/ui/Dialogs/AlertDialog";
import CustomIcon from "../../../components/ui/Images/CustomIcon";
import FilterModal from "./components/filter/FilterModal";
import Preloader from "../../../components/ui/Loaders/Preloader";
import BidTable from "./components/BidTable";
import LocationBlock from "./components/location/LocationBlock";
import LocationDialog from "./components/location/LocationDialog";
import ButtonWithLoader from "../../../components/ui/Buttons/ButtonWithLoader";
import { ErrorDialog, LoadError } from "../../../components/ui/Erros";
import Prompter from "../prompter/Prompter";

const useInnerStyles = makeStyles(theme => ({
  topContainer: {
    flexDirection: "row",
    display: "flex",

    alignItems: "center",
    width: "100%",
  },
  leftButtonBlock: {
    flex: 1,
  },
  filterText: {
    width: 300,
    textAlign: "right",
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(1),
  },
  topSpaceContainer: {
    marginBottom: theme.spacing(2),
  },
  iconButton: {
    animation: "2000ms ease-in-out infinite both TextFieldBorderPulse",
  },
}));

const isHaveRules = (user, id) => {
  return user.is_admin || user.id === Number.parseInt(id);
};

function BidsListPage({
  getBestBids,
  intl,
  match,
  setFilterForCrop,
  editUser,
  deleteBid,
  clearErrors,
  getCropParams,
  setActiveStep,
}) {
  const innerClasses = useInnerStyles();
  const [cropLoading, setCropLoading] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [enumParams, setEnumParams] = useState([]);
  const [numberParams, setNumberParams] = useState([]);
  let { cropId } = match.params;
  cropId = Number.parseInt(cropId);

  const { bids, user, filter, loading, errors, activeStep } = useSelector(
    ({ bids, auth, crops, prompter }) => ({
      bids: bids.bestBids,
      user: auth.user,
      filter: (crops.filters && crops.filters[cropId]) || { crop_id: cropId },
      loading: bids.bestBids && bids.bestBids.loading,
      errors: bids.errors || {},
      activeStep: prompter.activeStep,
    }),
    shallowEqual
  );
  const equalBids = bids && bids.equal;
  const inequalBids = bids && bids.inexact;
  const [deleteBidId, setDeleteBidId] = useState(-1);
  const [isAlertOpen, setAlertOpen] = useState(false);

  const handleDeleteDialiog = id => {
    setDeleteBidId(id);
    setAlertOpen(true);
  };

  const classes = useStyles();

  const getBidsAction = useCallback(
    (filter, enumParams, numberParams) => {
      const requestFilter = filterForRequest(filter, enumParams, numberParams);
      //console.log("filterForRequest", requestFilter);
      getBestBids({ filter: filter.crop_id ? requestFilter : {} });
    },
    [getBestBids]
  );

  useEffect(() => {
    setFilterForCrop(filter, cropId);
    setCropLoading(true);
    const successCallback = data => {
      setCropLoading(false);
      const enumData = data.filter(item => item.type === "enum");
      const numberData = data.filter(item => item.type === "number");
      setEnumParams(enumData);
      setNumberParams(numberData);
      getBidsAction(filter, enumData, numberData);
    };
    const failCallback = () => setCropLoading(false);
    getCropParams(cropId, successCallback, failCallback);
  }, [cropId, filter, getBidsAction, getCropParams, setFilterForCrop, user]);

  useEffect(() => {
    if (activeStep === 1) setActiveStep(2);
  }, [activeStep, setActiveStep]);

  const deleteBidAction = () => {
    setAlertOpen(false);
    const requestFilter = filterForRequest(filter, enumParams, numberParams);
    deleteBid(deleteBidId, bidsDuck.bidTypes.BestBids, {
      filter: filter.crop_id ? requestFilter : {},
    });
  };

  const filterSubmit = values => {
    setFilterModalOpen(false);
    setFilterForCrop({ ...values, crop_id: cropId }, cropId);
  };

  const locationSubmit = (values, setStatus, setSubmitting) => {
    setTimeout(() => {
      setStatus({ loading: true });
      const params = values;
      const successCallback = () => {
        setStatus({ loading: false });
        setLocationModalOpen(false);
      };
      const failCallback = () => {
        setStatus({
          error: true,
          message: intl.formatMessage({
            id: "LOCATION.STATUS.ERROR",
          }),
        });
        setSubmitting(false);
      };
      editUser(params, successCallback, failCallback);
    }, 1000);
  };

  const filterTitle = isFilterEmpty(filter, enumParams, numberParams)
    ? intl.formatMessage({ id: "BIDLIST.FILTER.STATUS.EMPTY" })
    : !filter.id
    ? intl.formatMessage({ id: "BIDLIST.FILTER.STATUS.FULL" })
    : `${intl.formatMessage({ id: "BIDLIST.FILTER.STATUS.WITH_NAME" })}`;

  const filterName = filter.id && filter.name ? filter.name : "";

  const filterIconPath = isFilterEmpty(filter, enumParams, numberParams)
    ? "/media/filter/filter.svg"
    : "/media/filter/filter_full.svg";

  if (loading || cropLoading) return <Preloader />;
  if (errors.bests)
    return <LoadError handleClick={() => getBidsAction(filter, enumParams, numberParams)} />;
  return (
    <>
      <Prompter />
      <Paper className={classes.tableContainer}>
        <AlertDialog
          isOpen={isAlertOpen}
          text={intl.formatMessage({
            id: "BIDSLIST.DIALOGS.DELETE_TEXT",
          })}
          okText={intl.formatMessage({
            id: "USERLIST.DIALOGS.AGREE_TEXT",
          })}
          cancelText={intl.formatMessage({
            id: "USERLIST.DIALOGS.CANCEL_TEXT",
          })}
          handleClose={() => setAlertOpen(false)}
          handleAgree={() => deleteBidAction()}
        />
        <ErrorDialog
          isOpen={errors.delete || false}
          text={intl.formatMessage({ id: "ERROR.BID.DELETE" })}
          handleClose={() => clearErrors()}
        />
        <FilterModal
          isOpen={filterModalOpen}
          handleClose={() => setFilterModalOpen(false)}
          classes={classes}
          handleSubmit={filterSubmit}
          cropId={cropId}
          enumParams={enumParams}
          numberParams={numberParams}
        />
        <LocationDialog
          isOpen={locationModalOpen}
          handleClose={() => setLocationModalOpen(false)}
          submitAction={locationSubmit}
          user={user}
          classes={classes}
        />
        <div className={innerClasses.topContainer}>
          <div className={innerClasses.leftButtonBlock}>
            {!user.is_buyer && (
              <Link to="/bid/create">
                <ButtonWithLoader>
                  <FormattedMessage id="BIDSLIST.BUTTON.CREATE_BID" />
                </ButtonWithLoader>
              </Link>
            )}
          </div>

          <div className={innerClasses.filterText}>
            {filterTitle}
            <br />
            <strong>{filterName}</strong>
          </div>
          <IconButton
            className={activeStep === 3 ? innerClasses.iconButton : ""}
            onClick={() => {
              setFilterModalOpen(true);
              setActiveStep(4);
            }}
          >
            <CustomIcon path={filterIconPath} />
          </IconButton>
        </div>
        <BidTable
          classes={classes}
          bids={equalBids}
          isHaveRules={isHaveRules}
          handleDeleteDialiog={handleDeleteDialiog}
          user={user}
          title={intl.formatMessage({ id: "BIDLIST.TITLE.BEST" })}
        />
        <div className={innerClasses.topSpaceContainer}>
          <BidTable
            classes={classes}
            bids={inequalBids}
            isHaveRules={isHaveRules}
            handleDeleteDialiog={handleDeleteDialiog}
            user={user}
            title={intl.formatMessage({ id: "BIDLIST.TITLE.NO_FULL" })}
          />
        </div>
        <LocationBlock
          handleClick={() => {
            setLocationModalOpen(true);
          }}
          location={user.location && user.location.text}
        />
      </Paper>
    </>
  );
}

export default injectIntl(
  connect(null, { ...bidsDuck.actions, ...crops.actions, ...auth.actions, ...prompter.actions })(
    BidsListPage
  )
);
