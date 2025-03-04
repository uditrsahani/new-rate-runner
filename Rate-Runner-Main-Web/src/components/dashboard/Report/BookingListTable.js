import { useState } from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Card,
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
import Moment from 'moment';

const applyPagination = (invoices, page, limit) => invoices
  .slice(page * limit, page * limit + limit);

const InqPerformanceListTable = (props) => {
  const { summary, invoices, status, ...other } = props;
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value, 10));
  };

  const paginatedProducts = applyPagination(invoices, page, limit);

  return (
    <Card {...other}>
      <Scrollbar>
        <Box sx={{ minWidth: 1200 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell
                  colspan={14}
                  align="center"
                >
                  <Typography
                    variant="subtitle2"
                  >
                    &nbsp;
                  </Typography>
                </TableCell>
                <TableCell
                  colspan={7}
                  align="center"
                >
                  <Typography
                    variant="subtitle2"
                  >
                    Volume Per Week
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  Status
                </TableCell>
                <TableCell>
                  Result
                </TableCell>
                <TableCell>
                  Inquiry No.
                </TableCell>
                <TableCell>
                  Cargo Ready Date
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
                  Customer
                </TableCell>
                <TableCell>
                  Sales
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
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow style={{ backgroundColor: '#ededed' }}>
                <TableCell>
                  <b>Summary</b>
                </TableCell>
                <TableCell />
                <TableCell align="right">
                  {invoices.length}
                </TableCell>
                <TableCell />
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
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell align="right">
                  {(summary.c20 && Number(summary.c20) !== 0) ? Number(summary.c20).toLocaleString(navigator.language, { minimumFractionDigits: 0 }) : ''}
                </TableCell>
                <TableCell align="right">
                  {(summary.c40 && Number(summary.c40) !== 0) ? Number(summary.c40).toLocaleString(navigator.language, { minimumFractionDigits: 0 }) : ''}
                </TableCell>
                <TableCell align="right">
                  {(summary.c40hc && Number(summary.c40hc) !== 0) ? Number(summary.c40hc).toLocaleString(navigator.language, { minimumFractionDigits: 0 }) : ''}
                </TableCell>
                <TableCell align="right" />
              </TableRow>
              {paginatedProducts.map((value) => (
                <TableRow>
                  <TableCell>
                    {value.inq_status}
                  </TableCell>
                  <TableCell>
                    {value.inq_res_quote_status}
                  </TableCell>
                  <TableCell>
                    <Link
                      component={RouterLink}
                      to={`/report/inquiry-information/${value.inq_uuid}`}
                    >
                      {value.inq_no}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {value.inq_cargo_readiness ? Moment(value.inq_cargo_readiness).format('DD/MM/YYYY') : ''}
                  </TableCell>
                  <TableCell align="right">
                    {(value.inq_revenue && Number(value.inq_revenue) !== 0) ? Number(value.inq_revenue).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
                  </TableCell>
                  <TableCell align="right">
                    {(value.inq_gp && Number(value.inq_gp) !== 0) ? Number(value.inq_gp).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
                  </TableCell>
                  <TableCell align="right">
                    {(value.inq_revenue && Number(value.inq_revenue) !== 0) ? `${(Number(value.inq_gp / value.inq_revenue) * 100).toFixed(2)}%` : ''}
                  </TableCell>
                  <TableCell>
                    {value.cus_name}
                  </TableCell>
                  <TableCell>
                    {value.user_fullname}
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

InqPerformanceListTable.propTypes = {
  invoices: PropTypes.array.isRequired,
  status: PropTypes.array.isRequired,
  summary: PropTypes.array.isRequired
};

export default InqPerformanceListTable;
