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

const CustomerGPRevenueListTable = (props) => {
  const { summary, invoices, ...other } = props;
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
      return objectSort.sort((a, b) => (Number(a.inq_gp_sum) > Number(b.inq_gp_sum) ? 1 : -1));
    } if (_sort1 === 'desc') {
      return objectSort.sort((a, b) => (Number(a.inq_gp_sum) < Number(b.inq_gp_sum) ? 1 : -1));
    }
    return objectSort.sort((a, b) => (Number(a.inq_gp_sum) < Number(b.inq_gp_sum) ? 1 : -1));
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
  // const paginatedProducts = applyPagination(invoices, page, limit);

  return (
    <Card {...other}>
      <Scrollbar>
        <Box sx={{ minWidth: 1200 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  colspan={1}
                  align="center"
                >
                  <Typography
                    variant="subtitle2"
                  >
                    Customer
                  </Typography>
                </TableCell>
                <TableCell
                  colspan={2}
                  align="center"
                >
                  <Typography
                    variant="subtitle2"
                  >
                    summary
                  </Typography>
                </TableCell>
                <TableCell
                  colspan={2}
                  align="center"
                >
                  <Typography
                    variant="subtitle2"
                  >
                    Jan-21
                  </Typography>
                </TableCell>
                <TableCell
                  colspan={2}
                  align="center"
                >
                  <Typography
                    variant="subtitle2"
                  >
                    Feb-21
                  </Typography>
                </TableCell>
                <TableCell
                  colspan={2}
                  align="center"
                >
                  <Typography
                    variant="subtitle2"
                  >
                    Mar-21
                  </Typography>
                </TableCell>
                <TableCell
                  colspan={2}
                  align="center"
                >
                  <Typography
                    variant="subtitle2"
                  >
                    Apr-21
                  </Typography>
                </TableCell>
                <TableCell
                  colspan={2}
                  align="center"
                >
                  <Typography
                    variant="subtitle2"
                  >
                    May-21
                  </Typography>
                </TableCell>
                <TableCell
                  colspan={2}
                  align="center"
                >
                  <Typography
                    variant="subtitle2"
                  >
                    Jun-21
                  </Typography>
                </TableCell>
                <TableCell
                  colspan={2}
                  align="center"
                >
                  <Typography
                    variant="subtitle2"
                  >
                    Jul-21
                  </Typography>
                </TableCell>
                <TableCell
                  colspan={2}
                  align="center"
                >
                  <Typography
                    variant="subtitle2"
                  >
                    Aug-21
                  </Typography>
                </TableCell>
                <TableCell
                  colspan={2}
                  align="center"
                >
                  <Typography
                    variant="subtitle2"
                  >
                    Sep-21
                  </Typography>
                </TableCell>
                <TableCell
                  colspan={2}
                  align="center"
                >
                  <Typography
                    variant="subtitle2"
                  >
                    Oct-21
                  </Typography>
                </TableCell>
                <TableCell
                  colspan={2}
                  align="center"
                >
                  <Typography
                    variant="subtitle2"
                  >
                    Nov-21
                  </Typography>
                </TableCell>
                <TableCell
                  colspan={2}
                  align="center"
                >
                  <Typography
                    variant="subtitle2"
                  >
                    Dec-21
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  Key A/C
                </TableCell>
                <TableCell align="right">
                  Revenue
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
                  Revenue
                </TableCell>
                <TableCell align="right">
                  GP
                </TableCell>
                <TableCell align="right">
                  Revenue
                </TableCell>
                <TableCell align="right">
                  GP
                </TableCell>
                <TableCell align="right">
                  Revenue
                </TableCell>
                <TableCell align="right">
                  GP
                </TableCell>
                <TableCell align="right">
                  Revenue
                </TableCell>
                <TableCell align="right">
                  GP
                </TableCell>
                <TableCell align="right">
                  Revenue
                </TableCell>
                <TableCell align="right">
                  GP
                </TableCell>
                <TableCell align="right">
                  Revenue
                </TableCell>
                <TableCell align="right">
                  GP
                </TableCell>
                <TableCell align="right">
                  Revenue
                </TableCell>
                <TableCell align="right">
                  GP
                </TableCell>
                <TableCell align="right">
                  Revenue
                </TableCell>
                <TableCell align="right">
                  GP
                </TableCell>
                <TableCell align="right">
                  Revenue
                </TableCell>
                <TableCell align="right">
                  GP
                </TableCell>
                <TableCell align="right">
                  Revenue
                </TableCell>
                <TableCell align="right">
                  GP
                </TableCell>
                <TableCell align="right">
                  Revenue
                </TableCell>
                <TableCell align="right">
                  GP
                </TableCell>
                <TableCell align="right">
                  Revenue
                </TableCell>
                <TableCell align="right">
                  GP
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow style={{ backgroundColor: '#ededed' }}>
                <TableCell>
                  <b>Summary</b>
                </TableCell>
                <TableCell align="right">
                  {(summary.sumRevenueAll && Number(summary.sumRevenueAll) !== 0) ? Number(summary.sumRevenueAll).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
                </TableCell>
                <TableCell align="right">
                  {(summary.sumGPAll && Number(summary.sumGPAll) !== 0) ? Number(summary.sumGPAll).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
                </TableCell>
                <TableCell align="right">
                  {(summary.sumRevenue1 && Number(summary.sumRevenue1) !== 0) ? Number(summary.sumRevenue1).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
                </TableCell>
                <TableCell align="right">
                  {(summary.sumGP1 && Number(summary.sumGP1) !== 0) ? Number(summary.sumGP1).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
                </TableCell>
                <TableCell align="right">
                  {(summary.sumRevenue2 && Number(summary.sumRevenue2) !== 0) ? Number(summary.sumRevenue2).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
                </TableCell>
                <TableCell align="right">
                  {(summary.sumGP2 && Number(summary.sumGP2) !== 0) ? Number(summary.sumGP2).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
                </TableCell>
                <TableCell align="right">
                  {(summary.sumRevenue3 && Number(summary.sumRevenue3) !== 0) ? Number(summary.sumRevenue3).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
                </TableCell>
                <TableCell align="right">
                  {(summary.sumGP3 && Number(summary.sumGP3) !== 0) ? Number(summary.sumGP3).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
                </TableCell>
                <TableCell align="right">
                  {(summary.sumRevenue4 && Number(summary.sumRevenue4) !== 0) ? Number(summary.sumRevenue4).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
                </TableCell>
                <TableCell align="right">
                  {(summary.sumGP4 && Number(summary.sumGP4) !== 0) ? Number(summary.sumGP4).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
                </TableCell>
                <TableCell align="right">
                  {(summary.sumRevenue5 && Number(summary.sumRevenue5) !== 0) ? Number(summary.sumRevenue5).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
                </TableCell>
                <TableCell align="right">
                  {(summary.sumGP5 && Number(summary.sumGP5) !== 0) ? Number(summary.sumGP5).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
                </TableCell>
                <TableCell align="right">
                  {(summary.sumRevenue6 && Number(summary.sumRevenue6) !== 0) ? Number(summary.sumRevenue6).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
                </TableCell>
                <TableCell align="right">
                  {(summary.sumGP6 && Number(summary.sumGP6) !== 0) ? Number(summary.sumGP6).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
                </TableCell>
                <TableCell align="right">
                  {(summary.sumRevenue7 && Number(summary.sumRevenue7) !== 0) ? Number(summary.sumRevenue7).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
                </TableCell>
                <TableCell align="right">
                  {(summary.sumGP7 && Number(summary.sumGP7) !== 0) ? Number(summary.sumGP7).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
                </TableCell>
                <TableCell align="right">
                  {(summary.sumRevenue8 && Number(summary.sumRevenue8) !== 0) ? Number(summary.sumRevenue8).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
                </TableCell>
                <TableCell align="right">
                  {(summary.sumGP8 && Number(summary.sumGP8) !== 0) ? Number(summary.sumGP8).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
                </TableCell>
                <TableCell align="right">
                  {(summary.sumRevenue9 && Number(summary.sumRevenue9) !== 0) ? Number(summary.sumRevenue9).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
                </TableCell>
                <TableCell align="right">
                  {(summary.sumGP9 && Number(summary.sumGP9) !== 0) ? Number(summary.sumGP9).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
                </TableCell>
                <TableCell align="right">
                  {(summary.sumRevenue10 && Number(summary.sumRevenue10) !== 0) ? Number(summary.sumRevenue10).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
                </TableCell>
                <TableCell align="right">
                  {(summary.sumGP10 && Number(summary.sumGP10) !== 0) ? Number(summary.sumGP10).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
                </TableCell>
                <TableCell align="right">
                  {(summary.sumRevenue11 && Number(summary.sumRevenue11) !== 0) ? Number(summary.sumRevenue11).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
                </TableCell>
                <TableCell align="right">
                  {(summary.sumGP11 && Number(summary.sumGP11) !== 0) ? Number(summary.sumGP11).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
                </TableCell>
                <TableCell align="right">
                  {(summary.sumRevenue12 && Number(summary.sumRevenue12) !== 0) ? Number(summary.sumRevenue12).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
                </TableCell>
                <TableCell align="right">
                  {(summary.sumGP12 && Number(summary.sumGP12) !== 0) ? Number(summary.sumGP12).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
                </TableCell>
              </TableRow>
              {paginatedProducts.map((value) => (
                <TableRow>
                  <TableCell>
                    {value.cus_name}
                  </TableCell>
                  <TableCell align="right">
                    {(value.inq_revenue_sum && Number(value.inq_revenue_sum) !== 0) ? Number(value.inq_revenue_sum).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
                  </TableCell>
                  <TableCell align="right">
                    {(value.inq_gp_sum && Number(value.inq_gp_sum) !== 0) ? Number(value.inq_gp_sum).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
                  </TableCell>
                  <TableCell align="right">
                    {(value.month_1_revenue && Number(value.month_1_revenue) !== 0) ? Number(value.month_1_revenue).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
                  </TableCell>
                  <TableCell align="right">
                    {(value.month_1_gp && Number(value.month_1_gp) !== 0) ? Number(value.month_1_gp).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
                  </TableCell>
                  <TableCell align="right">
                    {(value.month_2_revenue && Number(value.month_2_revenue) !== 0) ? Number(value.month_2_revenue).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
                  </TableCell>
                  <TableCell align="right">
                    {(value.month_2_gp && Number(value.month_2_gp) !== 0) ? Number(value.month_2_gp).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
                  </TableCell>
                  <TableCell align="right">
                    {(value.month_3_revenue && Number(value.month_3_revenue) !== 0) ? Number(value.month_3_revenue).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
                  </TableCell>
                  <TableCell align="right">
                    {(value.month_3_gp && Number(value.month_3_gp) !== 0) ? Number(value.month_3_gp).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
                  </TableCell>
                  <TableCell align="right">
                    {(value.month_4_revenue && Number(value.month_4_revenue) !== 0) ? Number(value.month_4_revenue).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
                  </TableCell>
                  <TableCell align="right">
                    {(value.month_4_gp && Number(value.month_4_gp) !== 0) ? Number(value.month_4_gp).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
                  </TableCell>
                  <TableCell align="right">
                    {(value.month_5_revenue && Number(value.month_5_revenue) !== 0) ? Number(value.month_5_revenue).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
                  </TableCell>
                  <TableCell align="right">
                    {(value.month_5_gp && Number(value.month_5_gp) !== 0) ? Number(value.month_5_gp).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
                  </TableCell>
                  <TableCell align="right">
                    {(value.month_6_revenue && Number(value.month_6_revenue) !== 0) ? Number(value.month_6_revenue).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
                  </TableCell>
                  <TableCell align="right">
                    {(value.month_6_gp && Number(value.month_6_gp) !== 0) ? Number(value.month_6_gp).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
                  </TableCell>
                  <TableCell align="right">
                    {(value.month_7_revenue && Number(value.month_7_revenue) !== 0) ? Number(value.month_7_revenue).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
                  </TableCell>
                  <TableCell align="right">
                    {(value.month_7_gp && Number(value.month_7_gp) !== 0) ? Number(value.month_7_gp).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
                  </TableCell>
                  <TableCell align="right">
                    {(value.month_8_revenue && Number(value.month_8_revenue) !== 0) ? Number(value.month_8_revenue).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
                  </TableCell>
                  <TableCell align="right">
                    {(value.month_8_gp && Number(value.month_8_gp) !== 0) ? Number(value.month_8_gp).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
                  </TableCell>
                  <TableCell align="right">
                    {(value.month_9_revenue && Number(value.month_9_revenue) !== 0) ? Number(value.month_9_revenue).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
                  </TableCell>
                  <TableCell align="right">
                    {(value.month_9_gp && Number(value.month_9_gp) !== 0) ? Number(value.month_9_gp).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
                  </TableCell>
                  <TableCell align="right">
                    {(value.month_10_revenue && Number(value.month_10_revenue) !== 0) ? Number(value.month_10_revenue).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
                  </TableCell>
                  <TableCell align="right">
                    {(value.month_10_gp && Number(value.month_10_gp) !== 0) ? Number(value.month_10_gp).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
                  </TableCell>
                  <TableCell align="right">
                    {(value.month_11_revenue && Number(value.month_11_revenue) !== 0) ? Number(value.month_11_revenue).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
                  </TableCell>
                  <TableCell align="right">
                    {(value.month_11_gp && Number(value.month_11_gp) !== 0) ? Number(value.month_11_gp).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
                  </TableCell>
                  <TableCell align="right">
                    {(value.month_12_revenue && Number(value.month_12_revenue) !== 0) ? Number(value.month_12_revenue).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
                  </TableCell>
                  <TableCell align="right">
                    {(value.month_12_gp && Number(value.month_12_gp) !== 0) ? Number(value.month_12_gp).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
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

CustomerGPRevenueListTable.propTypes = {
  invoices: PropTypes.array.isRequired,
  summary: PropTypes.array.isRequired
};

export default CustomerGPRevenueListTable;
