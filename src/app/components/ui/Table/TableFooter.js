import React from "react";
import { TableFooter, TableRow, TablePagination } from "@material-ui/core";
import TablePaginationActions from "./TablePaginationActions";

function Footer({ total, perPage, page, handleChangePage, fromLabel }) {
  return (
    <TableFooter>
      <TableRow>
        <TablePagination
          rowsPerPageOptions={[]}
          count={total}
          rowsPerPage={perPage}
          page={page}
          SelectProps={{
            inputProps: { "aria-label": "rows per page" },
            native: true,
          }}
          onChangePage={handleChangePage}
          ActionsComponent={TablePaginationActions}
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} ${fromLabel} ${count}`}
        />
      </TableRow>
    </TableFooter>
  );
}

export default Footer;
