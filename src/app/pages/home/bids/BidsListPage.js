import React, { useEffect, useState } from "react";
import { injectIntl, FormattedMessage } from "react-intl";
import { connect, useSelector, shallowEqual } from "react-redux";
import { Link } from "react-router-dom";
import { Paper, IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import * as auth from "../../../store/ducks/auth.duck";
import * as ads from "../../../store/ducks/bids.duck";
import * as crops from "../../../store/ducks/crops.duck";
import { setUser } from "../../../crud/auth.crud";
import { getCropParams } from "../.././../crud/crops.crud";
import { deleteBid} from "../../../crud/bids.crud";
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
}));

const isHaveRules = (user, id) => {
  return user.is_admin || user.id === Number.parseInt(id);
};

function BidsListPage({ getBestBids, deleteBidSuccess, intl, match, setFilterForCrop, fulfillUser }) {
  const innerClasses = useInnerStyles();

  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [enumParams, setEnumParams] = useState([]);
  const [numberParams, setNumberParams] = useState([]);
  let { cropId } = match.params;
  cropId = Number.parseInt(cropId);

  const { bids, user, filter, loading } = useSelector(
    ({ ads, auth, crops }) => ({
      bids: ads.bestAds,
      user: auth.user,
      filter: (crops.filters && crops.filters[cropId]) || { crop_id: cropId },
      loading: ads.bestAds && ads.bestAds.loading,
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
  const getBidsAction = (filter, enumParams, numberParams) => {
    const requestFilter = filterForRequest(filter, enumParams, numberParams);
    console.log("filterForRequest", requestFilter);
    getBestBids({ filter: filter.crop_id ? requestFilter : {} });
  };

  useEffect(() => {
    setFilterForCrop(filter, cropId);
    getCropParams(cropId)
      .then(({ data }) => {
        if (data && data.data) {
          const enumData = data.data.filter(item => item.type === "enum");
          const numberData = data.data.filter(item => item.type === "number");
          setEnumParams(enumData);
          setNumberParams(numberData);
          getBidsAction(filter, enumData, numberData);
        }
      })
      .catch(error => console.log("getCropParamsError", error));
  }, [cropId, filter, user]);

  const deleteBidAction = () => {
    setAlertOpen(false);
    deleteBid(deleteBidId)
      .then(() => {
        deleteBidSuccess(deleteBidId);
        getBidsAction(filter, enumParams, numberParams);
      })
      .catch(error => {
        console.log("deleteUserError", error);
      });
  };

  const filterSubmit = values => {
    setFilterModalOpen(false);
    setFilterForCrop({ ...values, crop_id: cropId }, cropId);
  };

  const locationSubmit = (values, setStatus, setSubmitting) => {
    setTimeout(() => {
      setStatus({ loading: true });
      setUser(values)
        .then(({ data }) => {
          setStatus({ loading: false });
          if (data.data) {
            setLocationModalOpen(false);
            fulfillUser(data.data);
          }
        })
        .catch(error => {
          setStatus({
            error: true,
            message: intl.formatMessage({
              id: "LOCATION.STATUS.ERROR",
            }),
          });
          setSubmitting(false);
        });
    }, 1000);
  };

  const filterTitle = isFilterEmpty(filter, enumParams, numberParams)
    ? intl.formatMessage({ id: "BIDLIST.FILTER.STATUS.EMPTY" })
    : intl.formatMessage({ id: "BIDLIST.FILTER.STATUS.FULL" });
  const filterIconPath = isFilterEmpty(filter, enumParams, numberParams)
    ? "/media/filter/filter.svg"
    : "/media/filter/filter_full.svg";

  if (loading) return <Preloader />;
  return (
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
          {!user.is_buyer && 
            <Link to="/bid/create">
              <ButtonWithLoader>
                <FormattedMessage id="BIDSLIST.BUTTON.CREATE_BID" />
              </ButtonWithLoader>
            </Link>
          }
        </div>

        <div className={innerClasses.filterText}>{filterTitle}</div>
        <IconButton onClick={() => setFilterModalOpen(true)}>
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
  );
}

export default injectIntl(
  connect(null, { ...ads.actions, ...crops.actions, ...auth.actions })(BidsListPage)
);
