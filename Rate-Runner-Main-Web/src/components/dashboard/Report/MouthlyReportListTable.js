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
import Moment from 'moment';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ImportExportIcon from '@material-ui/icons/ImportExport';

const applyPagination = (invoices, page, limit) => invoices
  .slice(page * limit, page * limit + limit);

const MouthlyReportListTable = (props) => {
  const { summary, invoices, ...other } = props;
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [sortCargoReadiness, setSortCargoReadiness] = useState('');

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value, 10));
  };

  const applySort = (objectSort, _sortCargoReadiness) => {
    if (_sortCargoReadiness === 'asc') {
      return objectSort.sort((a, b) => (a.fc_cargo_readiness.toUpperCase() > b.fc_cargo_readiness.toUpperCase() ? 1 : -1));
    } if (_sortCargoReadiness === 'desc') {
      return objectSort.sort((a, b) => (a.fc_cargo_readiness.toUpperCase() < b.fc_cargo_readiness.toUpperCase() ? 1 : -1));
    }
    return objectSort.sort((a, b) => (a.fc_cargo_readiness.toUpperCase() > b.fc_cargo_readiness.toUpperCase() ? 1 : -1));
  };
  const handleSortCargoReadiness = () => {
    if (sortCargoReadiness === '') {
      setSortCargoReadiness('asc');
    } else if (sortCargoReadiness === 'asc') {
      setSortCargoReadiness('desc');
    } else {
      setSortCargoReadiness('');
    }
  };

  // const paginatedProducts = applyPagination(invoices, page, limit);
  const sortObject = applySort(invoices, sortCargoReadiness);
  const paginatedProducts = applyPagination(sortObject, page, limit);

  const weekofyear = (day) => {
    if (day) {
      let tempWeek = 0;
      if (Moment(Moment(day).format('YYYY-MM-DD')).weekday() === 0) {
        tempWeek = ((Number(Moment(Moment(day).format('YYYY-MM-DD')).format('W')) + 1) % 52);
      } else {
        tempWeek = Number(Moment(Moment(day).format('YYYY-MM-DD')).format('W'));
      }
      return (tempWeek === 0) ? 52 : tempWeek;
    }
    return 0;
  };

  return (
    <Card {...other}>
      <Scrollbar>
        <Box sx={{ minWidth: 1200 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  colspan={13}
                  align="center"
                >
                  <Typography
                    variant="subtitle2"
                  >
                    &nbsp;
                  </Typography>
                </TableCell>
                <TableCell
                  colspan={4}
                  align="center"
                >
                  <Typography
                    variant="subtitle2"
                  >
                    Volume
                  </Typography>
                </TableCell>
                <TableCell
                  colspan={5}
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
                  <Typography
                    variant="subtitle2"
                    onClick={handleSortCargoReadiness}
                  >
                    {sortCargoReadiness === 'asc' && (
                    <Link>
                      Cargo Readiness
                      {' '}
                      <ArrowDownwardIcon fontSize="small" />
                    </Link>
                    )}
                    {sortCargoReadiness === 'desc' && (
                    <Link>
                      Cargo Readiness
                        {' '}
                      <ArrowUpwardIcon fontSize="small" />
                    </Link>
                    )}
                    {sortCargoReadiness === '' && (
                    <>
                      Cargo Readiness
                        {' '}
                      <ImportExportIcon fontSize="small" />
                    </>
                    )}

                  </Typography>
                </TableCell>
                <TableCell>
                  Week No.
                </TableCell>
                <TableCell>
                  Sales
                </TableCell>
                <TableCell>
                  Sales Team
                </TableCell>
                <TableCell>
                  Customer
                </TableCell>
                <TableCell>
                  Factory Location
                </TableCell>
                <TableCell>
                  Incoterm
                </TableCell>
                <TableCell>
                  Mode
                </TableCell>
                <TableCell>
                  Place of Receipt
                </TableCell>
                <TableCell>
                  POL
                </TableCell>
                <TableCell>
                  POD
                </TableCell>
                <TableCell>
                  Final Destination
                </TableCell>
                <TableCell>
                  Type
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
                  Commodity
                </TableCell>
                <TableCell align="right">
                  GW Per CNTR (Kg)
                </TableCell>
                <TableCell align="right">
                  Revenue (USD)
                </TableCell>
                <TableCell align="right">
                  G/P (USD)
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
                <TableCell />
                <TableCell align="right" />
                <TableCell align="left" />
                <TableCell align="right">
                  {(summary.sumRevenue && Number(summary.sumRevenue) !== 0) ? Number(summary.sumRevenue).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
                </TableCell>
                <TableCell align="right">
                  {(summary.sumGP && Number(summary.sumGP) !== 0) ? Number(summary.sumGP).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
                </TableCell>
              </TableRow>
              {paginatedProducts.map((value) => (
                <TableRow>
                  <TableCell align="left">
                    <Typography sx={{ width: 110 }}>
                      {Moment(value.fc_cargo_readiness).format('DD/MM/YYYY')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {weekofyear(value.fc_cargo_readiness)}
                  </TableCell>
                  <TableCell>
                    {value.user_fullname}
                  </TableCell>
                  <TableCell>
                    {value.user_team}
                  </TableCell>
                  <TableCell>
                    {value.cus_name}
                  </TableCell>
                  <TableCell>
                    {value.fc_factory_location}
                  </TableCell>
                  <TableCell>
                    {value.fc_incoterms}
                  </TableCell>
                  <TableCell>
                    {value.fc_mode}
                  </TableCell>
                  <TableCell>
                    {value.fc_place_of_receipt}
                  </TableCell>
                  <TableCell>
                    {value.pol_port_name}
                  </TableCell>
                  <TableCell>
                    {value.pod_port_name}
                  </TableCell>
                  <TableCell>
                    {value.fc_final_destination}
                  </TableCell>
                  <TableCell>
                    {value.fc_type}
                  </TableCell>
                  <TableCell align="right">
                    {(value.fc_container_20 && Number(value.fc_container_20) !== 0) ? Number(value.fc_container_20).toLocaleString(navigator.language, { minimumFractionDigits: 0 }) : ''}
                  </TableCell>
                  <TableCell align="right">
                    {(value.fc_container_40 && Number(value.fc_container_40) !== 0) ? Number(value.fc_container_40).toLocaleString(navigator.language, { minimumFractionDigits: 0 }) : ''}
                  </TableCell>
                  <TableCell align="right">
                    {(value.fc_container_40hc && Number(value.fc_container_40hc) !== 0) ? Number(value.fc_container_40hc).toLocaleString(navigator.language, { minimumFractionDigits: 0 }) : ''}
                  </TableCell>
                  <TableCell align="right">
                    {(value.fc_container_cbm && Number(value.fc_container_cbm) !== 0) ? Number(value.fc_container_cbm).toLocaleString(navigator.language, { minimumFractionDigits: 3 }) : ''}
                  </TableCell>
                  <TableCell>
                    {value.fc_commodity}
                  </TableCell>
                  <TableCell align="right">
                    {(value.fc_qw_per_cntr && Number(value.fc_qw_per_cntr) !== 0) ? Number(value.fc_qw_per_cntr).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
                  </TableCell>
                  <TableCell align="right">
                    {(value.fc_revernue && Number(value.fc_revernue) !== 0) ? Number(value.fc_revernue).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
                  </TableCell>
                  <TableCell align="right">
                    {(value.fc_gp && Number(value.fc_gp) !== 0) ? Number(value.fc_gp).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
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

MouthlyReportListTable.propTypes = {
  invoices: PropTypes.array.isRequired,
  summary: PropTypes.array.isRequired
};

export default MouthlyReportListTable;
