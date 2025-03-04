import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  // Button,
  Card,
  // Checkbox,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@material-ui/core';
import Scrollbar from '../../Scrollbar';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ImportExportIcon from '@material-ui/icons/ImportExport';

// const applyFilters = (invoices, query, filters) => invoices
//   .filter((invoice) => {
//     let matches = true;

//     if (query) {
//       const properties = ['name', 'email'];
//       let containsQuery = false;

//       properties.forEach((property) => {
//         if (invoice.customer[property].toLowerCase().includes(query.toLowerCase())) {
//           containsQuery = true;
//         }
//       });

//       if (!containsQuery) {
//         matches = false;
//       }
//     }

//     if (filters.status && invoice.status !== filters.status) {
//       matches = false;
//     }

//     return matches;
//   });

const applyPagination = (invoices, page, limit) => invoices
  .slice(page * limit, page * limit + limit);

const InvoiceListTable = (props) => {
  const { summary, invoices, view, ...other } = props;
  // const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [sortGP, setSortGP] = useState('');
  // eslint-disable-next-line no-unused-vars
  // const [query, setQuery] = useState('');
  // const [filters] = useState({
  //   status: null
  // });

  // const handleSelectAllInvoices = (event) => {
  //   setSelectedInvoices(event.target.checked
  //     ? invoices.map((invoice) => invoice.id)
  //     : []);
  // };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value, 10));
  };

  const applySort = (objectSort, _sort1) => {
    if (_sort1 === 'asc') {
      return objectSort.sort((a, b) => (Number(a.win_gp_sum) > Number(b.win_gp_sum) ? 1 : -1));
    } if (_sort1 === 'desc') {
      return objectSort.sort((a, b) => (Number(a.win_gp_sum) < Number(b.win_gp_sum) ? 1 : -1));
    }
    return objectSort.sort((a, b) => (Number(a.win_gp_sum) < Number(b.win_gp_sum) ? 1 : -1));
  };
  const handleSortGP = () => {
    if (sortGP === '') {
      setSortGP('asc');
    } else if (sortGP === 'asc') {
      setSortGP('desc');
    } else {
      setSortGP('');
    }
  };

  const sortObject = applySort(invoices, sortGP);
  const paginatedProducts = applyPagination(sortObject, page, limit);

  return (
    <Card {...other}>
      <Scrollbar>
        <Box sx={{ minWidth: 1200 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell
                  colSpan={4}
                  align="center"
                >
                  <Typography
                    variant="subtitle2"
                  >
                    All Inquiry
                  </Typography>
                </TableCell>
                <TableCell
                  colSpan={4}
                  align="center"
                >
                  <Typography
                    variant="subtitle2"
                  >
                    Win Inquiry
                  </Typography>
                </TableCell>
                <TableCell
                  colSpan={4}
                  align="center"
                >
                  <Typography
                    variant="subtitle2"
                  >
                    Loss Inquiry
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography
                    variant="subtitle2"
                  >
                    {(view) || 'Customer'}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography
                    variant="subtitle2"
                  >
                    No. of Inquiry
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography
                    variant="subtitle2"
                  >
                    Revenue
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography
                    variant="subtitle2"
                  >
                    GP
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography
                    variant="subtitle2"
                  >
                    ROS(%)
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography
                    variant="subtitle2"
                  >
                    No. of Inquiry
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography
                    variant="subtitle2"
                  >
                    Revenue
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="subtitle2"
                    onClick={handleSortGP}
                  >
                    {sortGP === 'asc' && (
                    <Link>
                      GP
                      {' '}
                      <ArrowDownwardIcon fontSize="small" />
                    </Link>
                    )}
                    {sortGP === 'desc' && (
                    <Link>
                      GP
                        {' '}
                      <ArrowUpwardIcon fontSize="small" />
                    </Link>
                    )}
                    {sortGP === '' && (
                    <>
                      GP
                        {' '}
                      <ImportExportIcon fontSize="small" />
                    </>
                    )}

                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography
                    variant="subtitle2"
                  >
                    ROS(%)
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography
                    variant="subtitle2"
                  >
                    No. of Inquiry
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography
                    variant="subtitle2"
                  >
                    Revenue
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography
                    variant="subtitle2"
                  >
                    GP
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography
                    variant="subtitle2"
                  >
                    ROS(%)
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow style={{ backgroundColor: '#ededed' }}>
                <TableCell>
                  <b>Summary</b>
                </TableCell>
                <TableCell align="right" />
                <TableCell align="right">
                  {(summary.sumRevenue && Number(summary.sumRevenue) !== 0) ? Number(summary.sumRevenue).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
                </TableCell>
                <TableCell align="right">
                  {(summary.sumGP && Number(summary.sumGP) !== 0) ? Number(summary.sumGP).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
                </TableCell>
                <TableCell align="right">
                  {(summary.sumRevenue && Number(summary.sumRevenue) !== 0) ? `${(Number(summary.sumGP / summary.sumRevenue) * 100).toFixed(2)}%` : ''}
                </TableCell>
                <TableCell align="right" />
                <TableCell align="right">
                  {(summary.sumRevenueWin && Number(summary.sumRevenueWin) !== 0) ? Number(summary.sumRevenueWin).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
                </TableCell>
                <TableCell align="right">
                  {(summary.sumGPWin && Number(summary.sumGPWin) !== 0) ? Number(summary.sumGPWin).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
                </TableCell>
                <TableCell align="right">
                  {(summary.sumRevenueWin && Number(summary.sumRevenueWin) !== 0) ? `${(Number(summary.sumGPWin / summary.sumRevenueWin) * 100).toFixed(2)}%` : ''}
                </TableCell>
                <TableCell align="right" />
                <TableCell align="right">
                  {(summary.sumRevenueLose && Number(summary.sumRevenueLose) !== 0) ? Number(summary.sumRevenueLose).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
                </TableCell>
                <TableCell align="right">
                  {(summary.sumGPLose && Number(summary.sumGPLose) !== 0) ? Number(summary.sumGPLose).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
                </TableCell>
                <TableCell align="right">
                  {(summary.sumRevenueLose && Number(summary.sumRevenueLose) !== 0) ? `${(Number(summary.sumGPLose / summary.sumRevenueLose) * 100).toFixed(2)}%` : ''}
                </TableCell>
              </TableRow>
              {paginatedProducts.map((value) => (
                <TableRow>
                  <TableCell>
                    {(view === 'Customer') ? value.cus_name : ''}
                    {(view === 'Key Customer') ? value.cus_name : ''}
                    {(view === 'Sales') ? value.user_fullname : ''}
                    {(view === 'POL') ? value.port_name : ''}
                    {(view === 'POD') ? value.port_name : ''}
                    {(view === 'Carrier') ? value.cr_name : ''}
                  </TableCell>
                  <TableCell align="right">
                    {(value.inq_count && Number(value.inq_count) !== 0) ? Number(value.inq_count).toLocaleString(navigator.language, { minimumFractionDigits: 0 }) : ''}
                  </TableCell>
                  <TableCell align="right">
                    {(value.inq_revenue_sum && Number(value.inq_revenue_sum) !== 0) ? Number(value.inq_revenue_sum).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
                  </TableCell>
                  <TableCell align="right">
                    {(value.inq_gp_sum && Number(value.inq_gp_sum) !== 0) ? Number(value.inq_gp_sum).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
                  </TableCell>
                  <TableCell align="right">
                    {(value.inq_revenue_sum && Number(value.inq_revenue_sum) !== 0) ? `${(Number(value.inq_gp_sum / value.inq_revenue_sum) * 100).toFixed(2)}%` : ''}
                  </TableCell>
                  <TableCell align="right">
                    {(value.win_count && Number(value.win_count) !== 0) ? Number(value.win_count).toLocaleString(navigator.language, { minimumFractionDigits: 0 }) : ''}
                  </TableCell>
                  <TableCell align="right">
                    {(value.win_revenue_sum && Number(value.win_revenue_sum) !== 0) ? Number(value.win_revenue_sum).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
                  </TableCell>
                  <TableCell align="right">
                    {(value.win_gp_sum && Number(value.win_revenue_sum) !== 0) ? Number(value.win_gp_sum).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
                  </TableCell>
                  <TableCell align="right">
                    {(value.win_revenue_sum && Number(value.win_revenue_sum) !== 0) ? `${(Number(value.win_gp_sum / value.win_revenue_sum) * 100).toFixed(2)}%` : ''}
                  </TableCell>
                  <TableCell align="right">
                    {(value.loss_count && Number(value.loss_count) !== 0) ? Number(value.loss_count).toLocaleString(navigator.language, { minimumFractionDigits: 0 }) : ''}
                  </TableCell>
                  <TableCell align="right">
                    {(value.loss_revenue_sum && Number(value.loss_revenue_sum) !== 0) ? Number(value.loss_revenue_sum).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
                  </TableCell>
                  <TableCell align="right">
                    {(value.loss_gp_sum && Number(value.loss_gp_sum) !== 0) ? Number(value.loss_gp_sum).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
                  </TableCell>
                  <TableCell align="right">
                    {(value.loss_revenue_sum && Number(value.loss_revenue_sum) !== 0) ? `${(Number(value.loss_gp_sum / value.loss_revenue_sum) * 100).toFixed(2)}%` : ''}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <TablePagination
        component="div"
        count={invoices.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[10, 25, 50, 100]}
      />
    </Card>
  );
};

InvoiceListTable.propTypes = {
  invoices: PropTypes.array.isRequired,
  summary: PropTypes.array.isRequired,
  view: PropTypes.array.isRequired,
};

export default InvoiceListTable;
