import React, { useEffect } from "react";
import { connect, ConnectedProps, shallowEqual, useSelector } from "react-redux";
import { Divider, makeStyles, TextField, FormControlLabel, Checkbox, MenuItem } from "@material-ui/core";
import { injectIntl, WrappedComponentProps } from "react-intl";

import { actions as dealsActions } from "../../../store/ducks/deals.duck";

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

const DealsFilterForAll: React.FC<PropsFromRedux & WrappedComponentProps> = ({ intl, setWeeks, setTerm, setPrepayment }) => {
  const { weeks, term, min_prepayment_amount } = useSelector(
    ({ deals: { weeks, term, min_prepayment_amount } }: IAppState) => ({
      weeks,
      term,
      min_prepayment_amount,
    }),
    shallowEqual
  );

  useEffect(() => {
    if (min_prepayment_amount === 100) setTerm(undefined);
  }, [min_prepayment_amount, setTerm]);

  const classes = useStyles();

  return (
    <>
      {/* this logic will be needed in the upcoming tasks  */}
      {/* <div className={classes.nested}>
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
          disabled={min_prepayment_amount === 100}
        />
      </div>
      <div className={classes.nested}>
        <FormControlLabel
          control={
            <Checkbox
              checked={min_prepayment_amount === 100}
              onChange={() => {
                setPrepayment(min_prepayment_amount === 100 ? 0 : 100);
              }}
            />
          }
          label={"Только с предоплатой"}
          name="fullPrepayment"
        />
      </div> */}

      <div className={classes.nested}>
        {intl.formatMessage({ id: "FILTER.FORM.WORK_WITH_USER" })}
        <TextField
          select
          margin="normal"
          name="roles"
          variant="outlined"
          defaultValue={"Не важно"}
        >
          <MenuItem value={"Не важно"} key={1}>Не важно</MenuItem>
          <MenuItem value={"Да"} key={2}>Да</MenuItem>
          <MenuItem value={"Нет"} key={3}>Нет</MenuItem>
        </TextField>
      </div>
      <div className={classes.nested}>
        {intl.formatMessage({ id: "FILTER.FORM.MANAGER" })}
        <TextField
          select
          margin="normal"
          name="roles"
          variant="outlined"
          defaultValue={"Все"}
        >
          <MenuItem value={"Все"} key={1}>Все</MenuItem>
          <MenuItem value={"Иван Иванов"} key={2}>Иван Иванов</MenuItem>
          <MenuItem value={"Пётр Петров"} key={3}>Пётр Петров</MenuItem>
          <MenuItem value={"Михаил Михайлов"} key={4}>Михаил Михайлов</MenuItem>
        </TextField>
      </div>
      <div className={classes.nested}>
        {intl.formatMessage({ id: "FILTER.FORM.ROLE" })}
        <TextField
          select
          margin="normal"
          name="roles"
          variant="outlined"
          defaultValue={"Покупатель"}
        >
          <MenuItem value={"Все"} key={1}>Все</MenuItem>
          <MenuItem value={"Продавец"} key={2}>Продавец</MenuItem>
          <MenuItem value={"Покупатель"} key={3}>Покупатель</MenuItem>
        </TextField>
      </div>
      <div className={classes.nested}>
        {intl.formatMessage({ id: "FILTER.FORM.USER" })}
        <TextField
          select
          margin="normal"
          name="roles"
          variant="outlined"
          defaultValue={"Джефф Безос"}
        >
          <MenuItem value={"Все"} key={1}>Все</MenuItem>
          <MenuItem value={"Джефф Безос"} key={2}>Джефф Безос</MenuItem>
          <MenuItem value={"Джек Ма"} key={3}>Джек Ма</MenuItem>
          <MenuItem value={"Сергей Брин"} key={4}>Сергей Брин</MenuItem>
        </TextField>
      </div>

      <Divider style={{ margin: "6px 0" }} />

      <div className={classes.nested}>
        {intl.formatMessage({ id: "FILTER.FORM.CULTURE" })}
        <TextField
          select
          margin="normal"
          name="roles"
          variant="outlined"
          defaultValue={"Пшеница"}
        >
          <MenuItem value={"Все"} key={1}>Все</MenuItem>
          <MenuItem value={"Пшеница"} key={2}>Пшеница</MenuItem>
          <MenuItem value={"Рожь"} key={3}>Рожь</MenuItem>
          <MenuItem value={"..."} key={4}>...</MenuItem>
        </TextField>
      </div>
      <div className={classes.nested}>
        {intl.formatMessage({ id: "FILTER.FORM.AD" })}
        <TextField
          select
          margin="normal"
          name="roles"
          variant="outlined"
          defaultValue={"Цена: 12 000; Объём, т.: 300"}
        >
          <MenuItem value={"Цена: 12 000; Объём, т.: 300"} key={1}>Цена: 12 000; Объём, т.: 300</MenuItem>
          <MenuItem value={"Цена: 11 500; Объём, т.: 100"} key={2}>Цена: 11 500; Объём, т.: 100</MenuItem>
          <MenuItem value={"Option 3"} key={3}>Option 3</MenuItem>
          <MenuItem value={"Option 4"} key={4}>Option 4</MenuItem>
        </TextField>
      </div>

      <Divider style={{ margin: "6px 0" }} />

      <div className={classes.nested}>
        {intl.formatMessage({ id: "FILTER.FORM.BEST_WEEK_DEALS" })}
        <TextField
          type="text"
          margin="normal"
          variant="outlined"
        />
      </div>
      <div className={classes.nested}>
        {intl.formatMessage({ id: "FILTER.FORM.MAX_CALC_DATES" })}
        <TextField
          type="text"
          margin="normal"
          variant="outlined"
        />
      </div>
      <div className={classes.nested}>
        <FormControlLabel
          control={
            <Checkbox
              checked={min_prepayment_amount === 100}
              onChange={() => {
                setPrepayment(min_prepayment_amount === 100 ? 0 : 100);
              }}
            />
          }
          label={"Только с предоплатой"}
          name="fullPrepayment"
        />
      </div>

      <Divider style={{ margin: "6px 0" }} />
      
      <div className={classes.nested}>
        <span style={{
          color: '#000000',
          fontWeight: '500',
          fontSize: 16
        }}>
          {intl.formatMessage({ id: "FILTER.FORM.CULTURE.SETTINGS" })}
        </span>
      </div>
      
      <Divider style={{ margin: "6px 0" }} />
    </>
  );
};

const connector = connect(null, { ...dealsActions });
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(injectIntl(DealsFilterForAll));
