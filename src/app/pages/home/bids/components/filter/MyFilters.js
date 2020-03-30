import React from "react";
import {
  makeStyles,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Row, Col } from "react-bootstrap";
import { injectIntl } from "react-intl";

import Preloader from "../../../../../components/ui/Loaders/Preloader";
import MyFiltersForm from "./MyFiltersForm";

const innerStyle = makeStyles(theme => ({
  buttonContainer: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  closeContainer: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  empty: {
    textAlign: "center",
  },
}));

const MyFilters = ({
  intl,
  filters,
  cropName,
  handleSubmit,
  classes,
  enumParams,
  numberParams,
  cropId,
  delFilter,
  delLoading,
  editFilter,
  editLoading,
}) => {
  const innerClasses = innerStyle();

  const [expanded, setExpanded] = React.useState(false);

  const handleChangeExpansionPanel = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  if (!filters) return <Preloader />;

  return (
    <Row>
      <Col>
        {!filters.length ? (
          <p className={innerClasses.empty}>{`${intl.formatMessage({
            id: "FILTER.MY_FILTERS.EMPTY",
          })} "${cropName}"`}</p>
        ) : (
          <>
            {filters.map(item => (
              <ExpansionPanel
                key={item.id}
                expanded={expanded === `panel${item.id}`}
                onChange={handleChangeExpansionPanel(`panel${item.id}`)}
              >
                <ExpansionPanelSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel${item.id}-content`}
                  id={`panel${item.id}-header`}
                >
                  {item.name}
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <MyFiltersForm
                    classes={classes}
                    handleSubmit={handleSubmit}
                    cropId={cropId}
                    enumParams={enumParams}
                    numberParams={numberParams}
                    filter={item}
                    delFilter={delFilter}
                    delLoading={delLoading}
                    editFilter={editFilter}
                    editLoading={editLoading}
                  />
                </ExpansionPanelDetails>
              </ExpansionPanel>
            ))}
          </>
        )}
      </Col>
    </Row>
  );
};

export default injectIntl(MyFilters);
