import React, { Fragment, useState } from "react";
import { connect, ConnectedProps, shallowEqual, useSelector } from "react-redux";
import { Collapse, Divider, makeStyles, MenuItem } from "@material-ui/core";
import { injectIntl, WrappedComponentProps } from "react-intl";

import { actions as dealsActions } from "../../../store/ducks/deals.duck";

import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import { IAppState } from "../../../store/rootDuck";
import FilterForm from "./FilterForm";

const useStyles = makeStyles(theme => ({
  nester: {
    justifyContent: "space-between",
  },
  nested: {
    paddingLeft: theme.spacing(2),
    justifyContent: "space-between",
  },
  nested_nested: {
    paddingLeft: theme.spacing(4),
    fontSize: 14,
  },
  nested_nested_empty: {
    paddingLeft: theme.spacing(4),
    fontSize: 12,
  },
}));

const DealsFilterForAdm: React.FC<PropsFromRedux & WrappedComponentProps> = ({ intl, editFilterRequest }) => {
  const { filters, allCropParams, editFilterLoading } = useSelector(
    ({ deals: { filters, editFilterLoading }, crops2: { allCropParams } }: IAppState) => ({
      filters,
      allCropParams,
      editFilterLoading,
    }),
    shallowEqual
  );

  const [expanded, setExpanded] = useState(0);

  const classes = useStyles();
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <>
      {!!filters && (
        <MenuItem
          onClick={() => {
            setFilterOpen(!filterOpen);
          }}
          className={classes.nester}
        >
          {intl.formatMessage({ id: "FILTER.FORM.CULTURE.SETTINGS" })}
          {filterOpen ? (
            <ExpandLess style={{ width: 16, height: 16, marginLeft: 16 }} />
          ) : (
            <ExpandMore style={{ width: 16, height: 16, marginLeft: 16 }} />
          )}
        </MenuItem>
      )}

      {!!filters && !!allCropParams && (
        <Collapse in={filterOpen} timeout="auto" unmountOnExit>
          <div className={classes.nested}>
            {filters.map(filter => (
              <Fragment key={filter.id}>
                <MenuItem
                  onClick={() => {
                    if (expanded === filter.id) {
                      setExpanded(0);
                    } else {
                      setExpanded(filter.id);
                    }
                  }}
                  className={classes.nester}
                  style={!!filter.parameters.length ? { fontWeight: "bold" } : {}}
                >
                  {filter.crop.name}
                  {filter.id === expanded ? (
                    <ExpandLess style={{ width: 16, height: 16, marginLeft: 16 }} />
                  ) : (
                    <ExpandMore style={{ width: 16, height: 16, marginLeft: 16 }} />
                  )}
                </MenuItem>
                <Collapse in={filter.id === expanded} timeout="auto" unmountOnExit>
                  <div className={classes.nested_nested}>
                    <FilterForm
                      intl={intl}
                      dealsFilters={filters}
                      allCropParams={allCropParams}
                      crop={filter.crop}
                      editFilter={editFilterRequest}
                      editFilterLoading={editFilterLoading}
                    />
                  </div>
                </Collapse>
              </Fragment>
            ))}
          </div>
        </Collapse>
      )}

      {!!filters && <Divider style={{ margin: "6px 0" }} />}
    </>
  );
};

const connector = connect(null, { ...dealsActions });
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(injectIntl(DealsFilterForAdm));
