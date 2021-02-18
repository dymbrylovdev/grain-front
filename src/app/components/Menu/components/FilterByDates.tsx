import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { injectIntl, WrappedComponentProps } from "react-intl";

import { IAppState } from "../../../store/rootDuck";
import { actions as bidsActions } from "../../../store/ducks/bids.duck";
import { Col, Row } from "react-bootstrap";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import ruRU from "date-fns/locale/ru";
import { makeStyles, MenuItem } from "@material-ui/core";

const useInnerStyles = makeStyles(theme => ({
  calendarBlock: {
    marginTop: theme.spacing(1),
  },
}));

const FilterByDates: React.FC<PropsFromRedux & WrappedComponentProps> = ({
  intl,
  filter,
  setFilter,
}) => {
  const innerClasses = useInnerStyles();

  return (
    <MenuItem>
      <Col>
        <Row>{intl.formatMessage({ id: "BIDLIST.FILTTER.UPDATE_DATE_RANGE" })}</Row>

        <Row>
          <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ruRU}>
            <div className={innerClasses.calendarBlock}>
              <KeyboardDatePicker
                okLabel="ОК"
                clearLabel="Очистить"
                cancelLabel="Отмена"
                variant="dialog"
                format="dd/MM/yyyy"
                margin="normal"
                id="min-date"
                label={intl.formatMessage({ id: "BIDLIST.MIN_DATE.PICKER" })}
                value={filter.minDate}
                onChange={e => setFilter({ minDate: e as Date })}
              />
            </div>
          </MuiPickersUtilsProvider>
        </Row>

        <Row>
          <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ruRU}>
            <div className={innerClasses.calendarBlock}>
              <KeyboardDatePicker
                okLabel="ОК"
                clearLabel="Очистить"
                cancelLabel="Отмена"
                variant="dialog"
                format="dd/MM/yyyy"
                margin="normal"
                id="max-date"
                label={intl.formatMessage({ id: "BIDLIST.MAX_DATE.PICKER" })}
                value={filter.maxDate}
                onChange={e => setFilter({ maxDate: e as Date })}
              />
            </div>
          </MuiPickersUtilsProvider>
        </Row>
      </Col>
    </MenuItem>
  );
};

const connector = connect(
  (state: IAppState) => ({
    filter: state.bids.filter,
  }),
  {
    fetch: bidsActions.fetchRequest,
    setFilter: bidsActions.setFilter,
  }
);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(injectIntl(FilterByDates));
