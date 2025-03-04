import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  // Button,
  Card,
  // Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@material-ui/core';
import Scrollbar from '../../Scrollbar';

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

const CustomerPerformanceListTable = (props) => {
  const { summary, invoices, ...other } = props;
  // const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
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

  // Usually query is done on backend with indexing solutions
  // const filteredInvoices = applyFilters(invoices, query, filters);
  // const enableBulkActions = selectedInvoices.length > 0;
  // const selectedSomeInvoices = selectedInvoices.length > 0
  // && selectedInvoices.length < invoices.length;
  // const selectedAllInvoices = selectedInvoices.length === invoices.length;
  const paginatedProducts = applyPagination(invoices, page, limit);

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
                  />
                </TableCell>
                <TableCell
                  colspan={10}
                  align="center"
                >
                  <Typography
                    variant="subtitle2"
                  >
                    &nbsp;
                  </Typography>
                </TableCell>
                <TableCell
                  colspan={6}
                  align="center"
                >
                  <Typography
                    variant="subtitle2"
                  >
                    Volume
                  </Typography>
                </TableCell>
                <TableCell
                  colspan={4}
                  align="center"
                >
                  <Typography
                    variant="subtitle2"
                  >
                    &nbsp;
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  Customer Type
                </TableCell>
                <TableCell>
                  Customer
                </TableCell>
                <TableCell>
                  Inquiry No.
                </TableCell>
                <TableCell>
                  Sales
                </TableCell>
                <TableCell>
                  Team
                </TableCell>
                <TableCell>
                  Mode
                </TableCell>
                <TableCell>
                  Term
                </TableCell>
                <TableCell>
                  POL
                </TableCell>
                <TableCell>
                  POD
                </TableCell>
                <TableCell>
                  Carrier
                </TableCell>
                <TableCell>
                  Commodity
                </TableCell>
                <TableCell>
                  TYPE
                </TableCell>
                <TableCell align="right">
                  20&apos;
                </TableCell>
                <TableCell align="right">
                  40&apos;
                </TableCell>
                <TableCell align="right">
                  40&apos; HC
                </TableCell>
                <TableCell align="right">
                  CBM
                </TableCell>
                <TableCell align="right">
                  TEU
                </TableCell>
                <TableCell align="right">
                  Revenue
                </TableCell>
                <TableCell align="right">
                  GP
                </TableCell>
                <TableCell align="right">
                  ROS(%)
                </TableCell>
                <TableCell>
                  Result
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow style={{ backgroundColor: '#ededed' }}>
                <TableCell>
                  <b>Summary</b>
                </TableCell>
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell align="right" />
                <TableCell align="right" />
                <TableCell align="right" />
                <TableCell align="right" />
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
                <TableCell />
              </TableRow>
              {paginatedProducts.map((value) => (
                <TableRow>
                  <TableCell>
                    {value.cus_type}
                  </TableCell>
                  <TableCell>
                    {value.cus_name}
                  </TableCell>
                  <TableCell>
                    {value.inq_no}
                  </TableCell>
                  <TableCell>
                    {value.user_fullname}
                  </TableCell>
                  <TableCell>
                    {value.user_team}
                  </TableCell>
                  <TableCell>
                    {value.inq_mode}
                  </TableCell>
                  <TableCell>
                    {value.inq_incoterms}
                  </TableCell>
                  <TableCell>
                    {value.pol_port_name}
                  </TableCell>
                  <TableCell>
                    {value.pod_port_name}
                  </TableCell>
                  <TableCell>
                    {value.cr_name}
                  </TableCell>
                  <TableCell>
                    {value.inq_commodity}
                  </TableCell>
                  <TableCell>
                    {value.inq_type}
                  </TableCell>
                  <TableCell align="right">
                    {(value.inq_container_20 && Number(value.inq_container_20) !== 0) ? Number(value.inq_container_20).toLocaleString(navigator.language, { minimumFractionDigits: 0 }) : ''}
                  </TableCell>
                  <TableCell align="right">
                    {(value.inq_container_40 && Number(value.inq_container_40) !== 0) ? Number(value.inq_container_40).toLocaleString(navigator.language, { minimumFractionDigits: 0 }) : ''}
                  </TableCell>
                  <TableCell align="right">
                    {(value.inq_container_40hc && Number(value.inq_container_40hc) !== 0) ? Number(value.inq_container_40hc).toLocaleString(navigator.language, { minimumFractionDigits: 0 }) : ''}
                  </TableCell>
                  <TableCell align="right">
                    {(value.inq_container_cbm && Number(value.inq_container_cbm) !== 0) ? Number(value.inq_container_cbm).toLocaleString(navigator.language, { minimumFractionDigits: 3 }) : ''}
                  </TableCell>
                  <TableCell align="right">
                    {value.inq_teu}
                  </TableCell>
                  <TableCell align="right">
                    {(value.inq_revenue && Number(value.inq_revenue) !== 0) ? Number(value.inq_revenue).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
                  </TableCell>
                  <TableCell align="right">
                    {(value.inq_gp && Number(value.inq_gp) !== 0) ? Number(value.inq_gp).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
                  </TableCell>
                  <TableCell align="right">
                    {(value.inq_ros && Number(value.inq_ros) !== 0) ? `${Number(value.inq_ros).toFixed(2).toLocaleString()}%` : ''}
                  </TableCell>
                  <TableCell>
                    {value.inq_res_quote_status}
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

CustomerPerformanceListTable.propTypes = {
  invoices: PropTypes.array.isRequired,
  summary: PropTypes.array.isRequired
};

export default CustomerPerformanceListTable;
