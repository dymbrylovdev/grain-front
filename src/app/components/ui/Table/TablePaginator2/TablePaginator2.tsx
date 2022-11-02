import React from "react";
import { TablePagination } from "@material-ui/core";
import TablePaginationActions from "./TablePaginationActions";
import { WrappedComponentProps, injectIntl } from "react-intl";

interface IProps {
  label?: string;
  page: number;
  realPerPage: number;
  perPage: number;
  total: number;
  fetchRows: any;
}

const TablePaginator2: React.FC<IProps & WrappedComponentProps> = ({
  intl,
  label = intl.formatMessage({ id: "TABLE.PAGINATOR.LABEL" }),
  page,
  realPerPage,
  perPage,
  total,
  fetchRows,
}) => {
  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    fetchRows(newPage + 1, perPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    fetchRows(1, +event.target.value);
  };

  return (
    <TablePagination
      onPageChange={() => {}}
      rowsPerPageOptions={[10, 20, 50]}
      count={total}
      rowsPerPage={perPage}
      page={page - 1}
      labelRowsPerPage={label}
      SelectProps={{
        inputProps: { "aria-label": "rows per page" },
        native: true,
      }}
      onChangePage={handleChangePage}
      onChangeRowsPerPage={handleChangeRowsPerPage}
      ActionsComponent={TablePaginationActions}
      labelDisplayedRows={({ from, to, count }) =>
        `${from}${realPerPage === 1 ? "" : realPerPage === 2 ? ` ${intl.formatMessage({ id: "TABLE.AND.LABEL" })} ` : "-"}${
          realPerPage === 1 ? "" : to
        } ${intl.formatMessage({
          id: "TABLE.FROM.LABEL",
        })} ${count}`
      }
    />
  );
};

export default injectIntl(TablePaginator2);
