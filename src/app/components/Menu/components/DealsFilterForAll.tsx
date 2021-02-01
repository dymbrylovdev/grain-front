import React, { useState } from "react";
import { connect, ConnectedProps, shallowEqual, useSelector } from "react-redux";
import { Collapse, Divider, makeStyles, MenuItem, TextField } from "@material-ui/core";
import { injectIntl, WrappedComponentProps } from "react-intl";

import { actions as dealsActions } from "../../../store/ducks/deals.duck";

import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import { IAppState } from "../../../store/rootDuck";
import NumberFormatCustom from "../../NumberFormatCustom/NumberFormatCustom";

const useStyles = makeStyles(theme => ({
  nester: {
    justifyContent: "space-between",
  },
  nested: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    fontSize: 12,
  },
}));

const DealsFilterForAll: React.FC<PropsFromRedux & WrappedComponentProps> = ({
  intl,
  setWeeks,
  setTerm,
  setPrepayment,
}) => {
  const { weeks, term, min_prepayment_amount } = useSelector(
    ({ deals: { weeks, term, min_prepayment_amount } }: IAppState) => ({
      weeks,
      term,
      min_prepayment_amount,
    }),
    shallowEqual
  );

  const classes = useStyles();
  const [filterOpen, setFilterOpen] = useState(true);

  return (
    <>
      <MenuItem
        onClick={() => {
          setFilterOpen(!filterOpen);
        }}
        className={classes.nester}
      >
        {intl.formatMessage({ id: "DEALS.FILTER2.NAME" })}
        {filterOpen ? (
          <ExpandLess style={{ width: 16, height: 16, marginLeft: 16 }} />
        ) : (
          <ExpandMore style={{ width: 16, height: 16, marginLeft: 16 }} />
        )}
      </MenuItem>

      <Collapse in={filterOpen} timeout="auto" unmountOnExit>
        <div className={classes.nested}>
          {intl.formatMessage({ id: "DEALS.WEEKS.TEXT" })}
          <TextField
            margin="normal"
            label={intl.formatMessage({
              id: "DEALS.WEEKS.WEEKS",
            })}
            value={weeks}
            onChange={e => {
              let newValue = e.target.value;
              if (+newValue < 1) {
                newValue = "1";
              }
              if (+newValue > 100) {
                newValue = "100";
              }
              setWeeks(+newValue);
            }}
            InputProps={{ inputComponent: NumberFormatCustom as any }}
            variant="outlined"
            autoComplete="off"
          />
        </div>
        <div className={classes.nested}>
          {intl.formatMessage({ id: "FILTER.FORM.MAX_PAYMENT_TERM1" })}
          <TextField
            type="text"
            label={intl.formatMessage({
              id: "FILTER.FORM.MAX_PAYMENT_TERM2",
            })}
            margin="normal"
            name="term"
            value={term || ""}
            variant="outlined"
            onChange={e => {
              let newValue = e.target.value;
              if (+newValue < 0) {
                newValue = "0";
              }
              if (+newValue > 999) {
                newValue = "999";
              }
              setTerm(+newValue);
            }}
            InputProps={{ inputComponent: NumberFormatCustom as any }}
            autoComplete="off"
          />
        </div>
        <div className={classes.nested}>
          {intl.formatMessage({ id: "FILTER.FORM.MAX_PAYMENT_TERM3" })}
          <TextField
            type="text"
            label={intl.formatMessage({
              id: "FILTER.FORM.MAX_PAYMENT_TERM3",
            })}
            margin="normal"
            name="min_prepayment_amount"
            value={min_prepayment_amount || ""}
            variant="outlined"
            onChange={e => {
              let newValue = e.target.value;
              // if (+newValue < 0) {
              //   newValue = "0";
              // }
              // if (+newValue > 999) {
              //   newValue = "999";
              // }
              setPrepayment(+newValue);
            }}
            InputProps={{ inputComponent: NumberFormatCustom as any }}
            autoComplete="off"
          />
        </div>
      </Collapse>

      <Divider style={{ margin: "6px 0" }} />
    </>
  );
};

const connector = connect(null, { ...dealsActions });
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(injectIntl(DealsFilterForAll));
