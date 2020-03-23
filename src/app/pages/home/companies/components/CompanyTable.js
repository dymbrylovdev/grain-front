import React from "react";
import { injectIntl, FormattedMessage } from "react-intl";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Divider,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import EditIcon from "@material-ui/icons/Edit";
import Footer from "../../../../components/ui/Table/TableFooter";
import TopTableCell from "../../../../components/ui/Table/TopTableCell";
import { PortletHeaderTitle } from "../../../../../app/partials/content/Portlet";
import ButtonWithLoader from "../../../../components/ui/Buttons/ButtonWithLoader";

function CompanyTable({
  intl,
  classes,
  companies,
  title,
  paginationData,
  forSearch,
  chooseAction,
}) {
  const handleChoose = company => {
    chooseAction && chooseAction(company);
  };
  return (
    <>
      {title && <PortletHeaderTitle className={classes.tableTitle}>{title}</PortletHeaderTitle>}
      {companies && companies.map && companies.length > 0 && (
        <Table aria-label="simple table" className={classes.table}>
          <TableHead>
            <TableRow>
              {!forSearch && (
                <TopTableCell>
                  <FormattedMessage id="COMPANY.TABLE.ID" />
                </TopTableCell>
              )}
              <TopTableCell>
                <FormattedMessage id="COMPANY.TABLE.SHORT_NAME" />
              </TopTableCell>
              <TopTableCell>
                <FormattedMessage id="COMPANY.TABLE.FULL_NAME" />
              </TopTableCell>
              <TopTableCell>
                <FormattedMessage id="COMPANY.TABLE.INN" />
              </TopTableCell>
              <TopTableCell>
                <FormattedMessage id="COMPANY.TABLE.CONTACTS" />
              </TopTableCell>
              <TopTableCell>
                <FormattedMessage id="COMPANY.TABLE.ACTIONS" />
              </TopTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {companies.map(company => (
              <TableRow key={company.id}>
                {!forSearch && <TableCell>{company.id}</TableCell>}
                <TableCell>{company.short_name}</TableCell>
                <TableCell>{company.full_name}</TableCell>
                <TableCell>{company.inn}</TableCell>
                <TableCell>
                  <div>
                    {company.telephone && <div>{company.telephone}</div>}
                    {company.mobile_phone && <div>{company.mobile_phone}</div>}
                    {company.email && <div>{company.email}</div>}
                  </div>
                </TableCell>
                <TableCell>
                  {forSearch ? (
                    <ButtonWithLoader onPress={() => handleChoose(company)}>
                      {intl.formatMessage({ id: "COMPANY.TABLE.BUTTON.CHOOSE" })}
                    </ButtonWithLoader>
                  ) : (
                    <Link to={`/company/edit/${company.id}`}>
                      <IconButton size="medium" color="primary">
                        <EditIcon />
                      </IconButton>
                    </Link>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          {paginationData && (
            <Footer
              page={paginationData.page - 1}
              perPage={paginationData.per_page || 0}
              total={paginationData.total || 0}
              handleChangePage={paginationData.handleChangePage}
              fromLabel={intl.formatMessage({ id: "TABLE.FROM.LABEL" })}
            />
          )}
        </Table>
      )}
      {(!companies || companies.length === 0) && (
        <>
          <div className={classes.emptyTitle}>
            {intl.formatMessage({ id: "COMPANY.LIST.EMPTY" })}
          </div>
          <Divider />
        </>
      )}
    </>
  );
}

export default injectIntl(CompanyTable);
