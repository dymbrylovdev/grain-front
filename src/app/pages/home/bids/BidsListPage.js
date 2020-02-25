import React, { useEffect, useState } from "react";
import { injectIntl, FormattedMessage } from "react-intl";
import { connect, useSelector, shallowEqual } from "react-redux";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import VisibilityIcon from "@material-ui/icons/Visibility";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import AlertDialog from "../../../components/ui/Dialogs/AlertDialog";
import CustomIcon from "../../../components/ui/Images/CustomIcon";
import * as ads from "../../../store/ducks/ads.duck";
import * as crops from "../../../store/ducks/crops.duck";
import { getCropParams } from "../.././../crud/crops.crud";
import { getBestAds, deleteAd } from "../../../crud/ads.crud";
import useStyles from "../styles";
import FilterModal from "./components/filter/FilterModal";
import { filterForRequest, isFilterEmpty } from "../../../utils";
import BidTable from "./components/BidTable"

const useInnerStyles = makeStyles(theme => ({
  topContainer: {
    flexDirection: "row",
    display: "flex",
    paddingBottom: theme.spacing(2),
    paddingTop: theme.spacing(2),
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
  }
}));

const isHaveRules = (user, id) => {
  return user.is_admin || user.id === Number.parseInt(id);
};

function BidsListPage({ setBestAds, deleteAdSuccess, intl, match, setFilterForCrop }) {
  const innerClasses = useInnerStyles();
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [enumParams, setEnumParams] = useState([]);
  const [numberParams, setNumberParams] = useState([]);
  let { cropId } = match.params;
  cropId = Number.parseInt(cropId);
  const { ads, user, filter, filters } = useSelector(
    ({ ads, auth, crops }) => ({
      ads: ads.bestAds,
      user: auth.user,
      filters: crops.filters,
      filter: (crops.filters && crops.filters[cropId]) || { crop_id: Number.parseInt(cropId) },
    }),
    shallowEqual
  );
  const [deleteBidId, setDeleteBidId] = useState(-1);
  const [isAlertOpen, setAlertOpen] = useState(false);
  const handleDeleteDialiog = id => {
    setDeleteBidId(id);
    setAlertOpen(true);
  };
  const classes = useStyles();
  const getAdsAction = (filter, enumParams, numberParams) => {
    const requestFilter = filterForRequest(filter, enumParams, numberParams);
    console.log("filterForRequest", requestFilter);
    getBestAds({ filter: filter.crop_id ? requestFilter : {} })
      .then(({ data }) => {
        data && data.data && data.data.equal && setBestAds(data.data.equal);
      })
      .catch(error => console.log("adsError", error));
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
          getAdsAction(filter, enumData, numberData);
        }
      })
      .catch(error => console.log("getCropParamsError", error));
  }, [cropId, filter]);
  const deleteBidAction = () => {
    setAlertOpen(false);
    deleteAd(deleteBidId)
      .then(() => {
        deleteAdSuccess(deleteBidId);
      })
      .catch(error => {
        console.log("deleteUserError", error);
      });
  };
  const filterSubmit = values => {
    setFilterModalOpen(false);
    setFilterForCrop({ ...values, crop_id: cropId }, cropId);
  };
  const filterTitle = isFilterEmpty(filter, enumParams, numberParams)
    ? intl.formatMessage({ id: "BIDLIST.FILTER.STATUS.EMPTY" })
    : intl.formatMessage({ id: "BIDLIST.FILTER.STATUS.FULL" });
  const filterIconPath = isFilterEmpty(filter, enumParams, numberParams)
    ? "/media/filter/filter.svg"
    : "/media/filter/filter_full.svg";
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
      <div className={innerClasses.topContainer}>
        <div className={innerClasses.leftButtonBlock}>
          <Link to="/bid/create">
            <button className={"btn btn-primary btn-elevate kt-login__btn-primary"}>
              <FormattedMessage id="BIDSLIST.BUTTON.CREATE_BID" />
            </button>
          </Link>
        </div>
        <div className={innerClasses.filterText}>{filterTitle}</div>
        <IconButton onClick={() => setFilterModalOpen(true)}>
          <CustomIcon path={filterIconPath} />
        </IconButton>
      </div>
      <BidTable classes={classes} ads={ads} isHaveRules={isHaveRules} handleDeleteDialiog={handleDeleteDialiog} user={user}/>
    </Paper>
  );
}

export default injectIntl(connect(null, { ...ads.actions, ...crops.actions })(BidsListPage));
