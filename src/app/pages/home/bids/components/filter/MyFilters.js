import React from "react";
import { makeStyles, Accordion, AccordionSummary, AccordionDetails, Grid } from "@material-ui/core";
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
  apliedText: {
    color: theme.palette.secondary.main,
  },
}));

const MyFilters = ({
  intl,
  savedFilter,
  filters,
  cropName,
  handleSubmit,
  handleClear,
  setDelFilterId,
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

  const handleChangeAccordion = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  if (!filters || delLoading) return <Preloader />;

  return (
    <Row>
      <Col>
        {!filters.length ? (
          <p className={innerClasses.empty}>
            {intl.formatMessage({ id: "FILTER.MY_FILTERS.EMPTY" }, { name: cropName })}
          </p>
        ) : (
          <>
            {filters.map(item => (
              <Accordion
                key={item.id}
                expanded={expanded === `panel${item.id}`}
                onChange={handleChangeAccordion(`panel${item.id}`)}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel${item.id}-content`}
                  id={`panel${item.id}-header`}
                >
                  <Grid container direction="row" justify="space-between" alignItems="center">
                    <Grid item>{item.name}</Grid>
                    <Grid item className={innerClasses.apliedText}>
                      {savedFilter && savedFilter.id && savedFilter.id === item.id
                        ? intl.formatMessage({ id: "FILTER.MY_FILTERS.APLIED" })
                        : ""}
                    </Grid>
                  </Grid>
                </AccordionSummary>
                <AccordionDetails>
                  <MyFiltersForm
                    classes={classes}
                    handleSubmitFilter={handleSubmit}
                    cropId={cropId}
                    enumParams={enumParams}
                    numberParams={numberParams}
                    filter={item}
                    savedFilter={savedFilter}
                    handleClear={handleClear}
                    setDelFilterId={setDelFilterId}
                    delFilter={delFilter}
                    delLoading={delLoading}
                    editFilter={editFilter}
                    editLoading={editLoading}
                  />
                </AccordionDetails>
              </Accordion>
            ))}
          </>
        )}
      </Col>
    </Row>
  );
};

export default injectIntl(MyFilters);
