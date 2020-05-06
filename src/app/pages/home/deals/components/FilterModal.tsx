import React, { useState } from "react";
import { IntlShape } from "react-intl";
import {
  makeStyles,
  Dialog,
  DialogTitle,
  Grid,
  DialogContent,
  IconButton,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import { ActionWithPayload } from "../../../../utils/action-helper";
import { IDealsFilter, IDealsFilterForEdit } from "../../../../interfaces/deals";
import { ICrop, ICropParam } from "../../../../interfaces/crops";
import { FilterForm } from ".";
import useStyles from "../../styles";

const useInnerStyles = makeStyles(theme => ({
  container: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    transition: "10",
  },
  dialogTitle: {
    padding: 0,
  },
  closeButton: {
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(0.5),
  },
  buttonContainer: {
    margin: theme.spacing(1),
  },
  textField: {
    width: 300,
  },
  badge: {
    paddingRight: theme.spacing(2),
  },
  tabPanel: {
    height: "100%",
  },
}));

interface IProps {
  intl: IntlShape;
  isOpen: boolean;
  handleClose: () => void;
  dealsFilters: IDealsFilter[] | undefined;
  crops: ICrop[] | undefined;
  allCropParams: { [key: string]: ICropParam[] } | undefined;
  editFilter: (
    id: number,
    data: IDealsFilterForEdit
  ) => ActionWithPayload<
    "deals/EDIT_FILTER_REQUEST",
    {
      id: number;
      data: IDealsFilterForEdit;
    }
  >;
  editFilterLoading: boolean;
}

const FilterModal: React.FC<IProps> = ({
  intl,
  isOpen,
  handleClose,
  dealsFilters,
  crops,
  allCropParams,
  editFilter,
  editFilterLoading,
}) => {
  const innerClasses = useInnerStyles();
  const classes = useStyles();

  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChangeExpansionPanel = (panel: string) => (
    event: React.ChangeEvent<{}>,
    isExpanded: boolean
  ) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle className={innerClasses.dialogTitle}>
        <Grid container direction="row" justify="space-between" alignItems="center">
          <Grid item style={{ marginLeft: 16 }}>
            {intl.formatMessage({
              id: "DEALS.FILTER.NAME",
            })}
          </Grid>
          <Grid item>
            <IconButton onClick={handleClose}>
              <CloseIcon color="primary" />
            </IconButton>
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogContent>
        <div className={classes.topAndBottomMargin}>
          {!!crops &&
            !!allCropParams &&
            crops.map(item => (
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
                  <FilterForm
                    intl={intl}
                    dealsFilters={dealsFilters}
                    crop={item}
                    allCropParams={allCropParams}
                    editFilter={editFilter}
                    editFilterLoading={editFilterLoading}
                  />
                </ExpansionPanelDetails>
              </ExpansionPanel>
            ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FilterModal;
