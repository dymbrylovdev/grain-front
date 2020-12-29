import React, { useState } from "react";
import { Dialog, Tabs, Tab, Divider, IconButton, Grid as div } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { injectIntl, IntlShape, WrappedComponentProps } from "react-intl";
import CloseIcon from "@material-ui/icons/Close";
import { TabPanel, a11yProps } from "../../../../../../components/ui/Table/TabPanel";

import { makeStyles } from "@material-ui/styles";
import CashlessPayment from "./CashlessPayment";
import PaymentByCard from "./PaymentByCard";

import { ITariff } from "../../../../../../interfaces/tariffs";
import { IUser } from "../../../../../../interfaces/users";

const useStyles = makeStyles({
  dialog: {
    fontSize: 16,
  },
  titleContain: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 15,
    paddingRight: 15,
    paddingBottom: 0,
    paddingLeft: 0,
  },
});

interface IProps {
  intl: IntlShape;
  realUser: IUser;
  openModal: boolean;
  setOpenModal: any;
  selectedTariff: ITariff | undefined;
  selectedDate: Date;
}

const TariffPaymentDialog: React.FC<IProps & WrappedComponentProps> = ({
  intl,
  realUser,
  openModal,
  setOpenModal,
  selectedTariff,
  selectedDate,
}) => {
  const innerClasses = useStyles();

  const [valueTabs, setValueTabs] = useState(0);

  const handleTabsChange = (e: any, newValue: number) => {
    setValueTabs(newValue);
  };

  return (
    <>
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(!openModal)}
        className={innerClasses.dialog}
      >
        <div className={innerClasses.titleContain}>
          <Tabs
            value={valueTabs}
            onChange={handleTabsChange}
            variant="scrollable"
            indicatorColor="primary"
            textColor="primary"
            aria-label="tabs"
          >
            <Tab label={intl.formatMessage({ id: "TARIFFS.PAYMENT.TAB1" })} {...a11yProps(0)} />
            <Tab label={intl.formatMessage({ id: "TARIFFS.PAYMENT.TAB2" })} {...a11yProps(1)} />
          </Tabs>

          <IconButton
            aria-label="close"
            color="inherit"
            size="medium"
            onClick={() => {
              setOpenModal(false);
            }}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        </div>

        <Divider />

        <TabPanel value={valueTabs} index={0}>
          <CashlessPayment
            realUser={realUser}
            selectedTariff={selectedTariff}
            selectedDate={selectedDate}
          />
        </TabPanel>

        <TabPanel value={valueTabs} index={1}>
          <PaymentByCard />
        </TabPanel>
      </Dialog>
    </>
  );
};

export default injectIntl(TariffPaymentDialog);
