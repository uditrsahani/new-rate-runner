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

const applyPagination = (invoices, page, limit) => invoices
  .slice(page * limit, page * limit + limit);

const TopCustomerInqListTable = (props) => {
  const { summary, invoices, ...other } = props;
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
                <TableCell>
                  <Typography
                    variant="subtitle2"
                  >
                    Customer
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="subtitle2"
                  >
                    Sales
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
                    No. of Container
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
                <TableCell />
                <TableCell align="right">
                  {(summary.sumInq && Number(summary.sumInq) !== 0) ? Number(summary.sumInq).toLocaleString(navigator.language, { minimumFractionDigits: 0 }) : ''}
                </TableCell>
                <TableCell align="right">
                  {(summary.sumCont && Number(summary.sumCont) !== 0) ? Number(summary.sumCont).toLocaleString(navigator.language, { minimumFractionDigits: 0 }) : ''}
                </TableCell>
                <TableCell align="right">
                  {(summary.sumRevenue && Number(summary.sumRevenue) !== 0) ? Number(summary.sumRevenue).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
                </TableCell>
                <TableCell align="right">
                  {(summary.sumGP && Number(summary.sumGP) !== 0) ? Number(summary.sumGP).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
                </TableCell>
                <TableCell align="right">
                  {(summary.sumRevenue && Number(summary.sumRevenue) !== 0) ? `${(Number(summary.sumGP / summary.sumRevenue) * 100).toFixed(2)}%` : ''}
                </TableCell>
              </TableRow>
              {paginatedProducts.map((value) => (
                <TableRow>
                  <TableCell>
                    {value.cus_name}
                  </TableCell>
                  <TableCell>
                    {value.user_fullname}
                  </TableCell>
                  <TableCell align="right">
                    {(value.inq_count && Number(value.inq_count) !== 0) ? Number(value.inq_count).toLocaleString(navigator.language, { minimumFractionDigits: 0 }) : ''}
                  </TableCell>
                  <TableCell align="right">
                    {(value.container_count && Number(value.container_count) !== 0) ? Number(value.container_count).toLocaleString(navigator.language, { minimumFractionDigits: 0 }) : ''}
                  </TableCell>
                  <TableCell align="right">
                    {(value.inq_revenue_sum && Number(value.inq_revenue_sum) !== 0) ? Number(value.inq_revenue_sum).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
                  </TableCell>
                  <TableCell align="right">
                    {(value.inq_gp_sum && Number(value.inq_gp_sum) !== 0) ? Number(value.inq_gp_sum).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
                  </TableCell>
                  <TableCell align="right">
                    {(value.inq_ros && Number(value.inq_ros) !== 0) ? `${Number(value.inq_ros).toFixed(2).toLocaleString()}%` : ''}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <TablePagination
        component="div"
        count={10}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={10}
        rowsPerPageOptions={[10]}
      />
    </Card>
  );
};

TopCustomerInqListTable.propTypes = {
  invoices: PropTypes.array.isRequired,
  summary: PropTypes.array.isRequired
};

export default TopCustomerInqListTable;
