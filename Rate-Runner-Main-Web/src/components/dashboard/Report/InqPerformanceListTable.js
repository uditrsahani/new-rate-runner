import { useState } from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ImportExportIcon from '@material-ui/icons/ImportExport';
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

const applyPagination = (invoices, page, limit) => invoices
  .slice(page * limit, page * limit + limit);

const InqPerformanceListTable = (props) => {
  const { summary, invoices, status, ...other } = props;
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [sortInqNo, setSortInqNo] = useState('desc');
  const [sortCustomer, setSortCustomer] = useState('');
  const [sortPOL, setSortPOL] = useState('');
  const [sortPOD, setSortPOD] = useState('');
  const applySort = (objectSort, _sortInqNo, _sortCustomer, _sortPOL, _sortPOD) => {
    if (_sortInqNo === 'asc') {
      return objectSort.sort((a, b) => (a.inq_no.toUpperCase() > b.inq_no.toUpperCase() ? 1 : -1));
    } if (_sortInqNo === 'desc') {
      return objectSort.sort((a, b) => (a.inq_no.toUpperCase() < b.inq_no.toUpperCase() ? 1 : -1));
    } if (_sortCustomer === 'asc') {
      return objectSort.sort((a, b) => (a.cus_name.toUpperCase() > b.cus_name.toUpperCase() ? 1 : -1));
    } if (_sortCustomer === 'desc') {
      return objectSort.sort((a, b) => (a.cus_name.toUpperCase() < b.cus_name.toUpperCase() ? 1 : -1));
    } if (_sortPOL === 'asc') {
      return objectSort.sort((a, b) => (a.pol_port_name.toUpperCase() > b.pol_port_name.toUpperCase() ? 1 : -1));
    } if (_sortPOL === 'desc') {
      return objectSort.sort((a, b) => (a.pol_port_name.toUpperCase() < b.pol_port_name.toUpperCase() ? 1 : -1));
    } if (_sortPOD === 'asc') {
      return objectSort.sort((a, b) => (a.pod_port_name.toUpperCase() > b.pod_port_name.toUpperCase() ? 1 : -1));
    } if (_sortPOD === 'desc') {
      return objectSort.sort((a, b) => (a.pod_port_name.toUpperCase() < b.pod_port_name.toUpperCase() ? 1 : -1));
    }
    return objectSort.sort((a, b) => (a.inq_no.toUpperCase() < b.inq_no.toUpperCase() ? 1 : -1));
  };
  const handleSortInqNo = () => {
    if (sortInqNo === '') {
      setSortInqNo('asc');
      setSortCustomer('');
      setSortPOL('');
      setSortPOD('');
    } else if (sortInqNo === 'asc') {
      setSortInqNo('desc');
      setSortCustomer('');
      setSortPOL('');
      setSortPOD('');
    } else {
      setSortInqNo('');
      setSortCustomer('');
      setSortPOL('');
      setSortPOD('');
    }
  };
  const handleSortCustomer = () => {
    if (sortCustomer === '') {
      setSortInqNo('');
      setSortCustomer('asc');
      setSortPOL('');
      setSortPOD('');
    } else if (sortCustomer === 'asc') {
      setSortInqNo('');
      setSortCustomer('desc');
      setSortPOL('');
      setSortPOD('');
    } else {
      setSortInqNo('');
      setSortCustomer('');
      setSortPOL('');
      setSortPOD('');
    }
  };
  const handleSortPOL = () => {
    if (sortPOL === '') {
      setSortInqNo('');
      setSortCustomer('');
      setSortPOL('asc');
      setSortPOD('');
    } else if (sortPOL === 'asc') {
      setSortInqNo('');
      setSortCustomer('');
      setSortPOL('desc');
      setSortPOD('');
    } else {
      setSortInqNo('');
      setSortCustomer('');
      setSortPOL('');
      setSortPOD('');
    }
  };
  const handleSortPOD = () => {
    if (sortPOD === '') {
      setSortInqNo('');
      setSortCustomer('');
      setSortPOL('');
      setSortPOD('asc');
    } else if (sortPOD === 'asc') {
      setSortInqNo('');
      setSortCustomer('');
      setSortPOL('');
      setSortPOD('desc');
    } else {
      setSortInqNo('');
      setSortCustomer('');
      setSortPOL('');
      setSortPOD('');
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value, 10));
  };
  const sortObject = applySort(invoices, sortInqNo, sortCustomer, sortPOL, sortPOD);
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
                  colspan={17}
                  align="center"
                >
                  <Typography
                    variant="subtitle2"
                  >
                    &nbsp;
                  </Typography>
                </TableCell>
                <TableCell
                  colspan={11}
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
                  Result
                </TableCell>
                <TableCell>
                  Inquiry Status
                </TableCell>
                <TableCell>
                  <Typography
                    variant="subtitle2"
                    onClick={handleSortInqNo}
                  >
                    {sortInqNo === 'asc' && (
                    <Link>
                      Inquiry No.
                        {' '}
                      <ArrowDownwardIcon fontSize="small" />
                    </Link>
                    )}
                    {sortInqNo === 'desc' && (
                    <Link>
                      Inquiry No.
                        {' '}
                      <ArrowUpwardIcon fontSize="small" />
                    </Link>
                    )}
                    {sortInqNo === '' && (
                    <>
                      Inquiry No.
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
                  ROS(%)
                </TableCell>
                <TableCell>
                  <Typography
                    variant="subtitle2"
                    onClick={handleSortCustomer}
                  >
                    {sortCustomer === 'asc' && (
                    <Link>
                      Customer
                        {' '}
                      <ArrowDownwardIcon fontSize="small" />
                    </Link>
                    )}
                    {sortCustomer === 'desc' && (
                    <Link>
                      Customer
                        {' '}
                      <ArrowUpwardIcon fontSize="small" />
                    </Link>
                    )}
                    {sortCustomer === '' && (
                    <>
                      Customer
                        {' '}
                      <ImportExportIcon fontSize="small" />
                    </>
                    )}
                  </Typography>
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
                  Cargo Readiness
                </TableCell>
                <TableCell>
                  Inquiry Date
                </TableCell>
                <TableCell>
                  Inquiry Week No.
                </TableCell>
                <TableCell>
                  Last Update
                </TableCell>
                <TableCell>
                  Idea Rate Per Unit
                </TableCell>
                <TableCell>
                  Res Comment
                </TableCell>
                <TableCell>
                  Term
                </TableCell>
                <TableCell>
                  <Typography
                    variant="subtitle2"
                    onClick={handleSortPOL}
                  >
                    {sortPOL === 'asc' && (
                    <Link>
                      POL
                        {' '}
                      <ArrowDownwardIcon fontSize="small" />
                    </Link>
                    )}
                    {sortPOL === 'desc' && (
                    <Link>
                      POL
                        {' '}
                      <ArrowUpwardIcon fontSize="small" />
                    </Link>
                    )}
                    {sortPOL === '' && (
                    <>
                      POL
                        {' '}
                      <ImportExportIcon fontSize="small" />
                    </>
                    )}
                  </Typography>
                </TableCell>
                <TableCell>
                  POL Country
                </TableCell>
                <TableCell>
                  POL Region
                </TableCell>
                <TableCell>
                  <Typography
                    variant="subtitle2"
                    onClick={handleSortPOD}
                  >
                    {sortPOD === 'asc' && (
                    <Link>
                      POD
                        {' '}
                      <ArrowDownwardIcon fontSize="small" />
                    </Link>
                    )}
                    {sortPOD === 'desc' && (
                    <Link>
                      POD
                        {' '}
                      <ArrowUpwardIcon fontSize="small" />
                    </Link>
                    )}
                    {sortPOD === '' && (
                    <>
                      POD
                        {' '}
                      <ImportExportIcon fontSize="small" />
                    </>
                    )}
                  </Typography>
                </TableCell>
                <TableCell>
                  POD Country
                </TableCell>
                <TableCell>
                  POD Region
                </TableCell>
                <TableCell>
                  DEST
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
                <TableCell>
                  Special Container
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
                <TableCell />
              </TableRow>
              {paginatedProducts.map((value) => (
                <TableRow>
                  <TableCell>
                    {(value.inq_disable === 1) ? 'Disabled' : value.inq_res_quote_status}
                  </TableCell>
                  <TableCell>
                    {value.inq_status}
                  </TableCell>
                  <TableCell>
                    <Link
                      component={RouterLink}
                      to={`/report/inquiry-information/${value.inq_uuid}`}
                    >
                      {value.inq_no}
                    </Link>
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
                    {value.user_team}
                  </TableCell>
                  <TableCell>
                    {value.inq_mode}
                  </TableCell>
                  <TableCell>
                    {value.inq_cargo_readiness}
                  </TableCell>
                  <TableCell>
                    {value.inq_date}
                  </TableCell>
                  <TableCell>
                    {value.inq_res_actual_week_no}
                  </TableCell>
                  <TableCell>
                    {value.inq_tx_time}
                  </TableCell>
                  <TableCell>
                    {value.inq_idea_rate_per_unit}
                  </TableCell>
                  <TableCell>
                    {value.inq_res_comment}
                  </TableCell>
                  <TableCell>
                    {value.inq_incoterms}
                  </TableCell>
                  <TableCell>
                    {value.pol_port_name}
                  </TableCell>
                  <TableCell>
                    {value.pol_cc_country_name}
                  </TableCell>
                  <TableCell>
                    {value.pol_port_region}
                  </TableCell>
                  <TableCell>
                    {value.pod_port_name}
                  </TableCell>
                  <TableCell>
                    {value.pod_cc_country_name}
                  </TableCell>
                  <TableCell>
                    {value.pod_port_region}
                  </TableCell>
                  <TableCell>
                    {value.inq_final_destination}
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
                  <TableCell>
                    {value.inq_special_container}
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
