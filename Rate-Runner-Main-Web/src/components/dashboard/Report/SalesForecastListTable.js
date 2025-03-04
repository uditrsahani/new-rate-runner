import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
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

const applyPagination = (invoices, page, limit) => invoices
  .slice(page * limit, page * limit + limit);

const SalesForecastListTable = (props) => {
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
                <TableCell
                  colspan={16}
                  align="center"
                  style={{ backgroundColor: '#E5FDFF' }}
                >
                  <Typography
                    variant="subtitle2"
                  >
                    Forecast
                  </Typography>
                </TableCell>
                <TableCell
                  colspan={10}
                  align="center"
                  style={{ backgroundColor: '#FDFFE5' }}
                >
                  <Typography
                    variant="subtitle2"
                  >
                    Actual
                  </Typography>
                </TableCell>
                <TableCell
                  colspan={3}
                  align="center"
                  style={{ backgroundColor: '#FFF0E5' }}
                >
                  <Typography
                    variant="subtitle2"
                  >
                    Diff
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ backgroundColor: '#E5FDFF' }}>
                  Sales
                </TableCell>
                <TableCell style={{ backgroundColor: '#E5FDFF' }}>
                  Sale Team
                </TableCell>
                <TableCell style={{ backgroundColor: '#E5FDFF' }}>
                  Customer
                </TableCell>
                <TableCell style={{ backgroundColor: '#E5FDFF' }}>
                  Mode
                </TableCell>
                <TableCell style={{ backgroundColor: '#E5FDFF' }}>
                  POL
                </TableCell>
                <TableCell style={{ backgroundColor: '#E5FDFF' }}>
                  POD
                </TableCell>
                <TableCell style={{ backgroundColor: '#E5FDFF' }}>
                  Type
                </TableCell>
                <TableCell
                  align="right"
                  style={{ backgroundColor: '#E5FDFF' }}
                >
                  20&apos;
                </TableCell>
                <TableCell
                  align="right"
                  style={{ backgroundColor: '#E5FDFF' }}
                >
                  40&apos;
                </TableCell>
                <TableCell
                  align="right"
                  style={{ backgroundColor: '#E5FDFF' }}
                >
                  40&apos;&nbsp;HC
                </TableCell>
                <TableCell
                  align="right"
                  style={{ backgroundColor: '#E5FDFF' }}
                >
                  CBM
                </TableCell>
                <TableCell
                  align="right"
                  style={{ backgroundColor: '#E5FDFF' }}
                >
                  TEU
                </TableCell>
                <TableCell
                  align="right"
                  style={{ backgroundColor: '#E5FDFF' }}
                >
                  Revenue
                </TableCell>
                <TableCell
                  align="right"
                  style={{ backgroundColor: '#E5FDFF' }}
                >
                  GP
                </TableCell>
                <TableCell
                  align="right"
                  style={{ backgroundColor: '#E5FDFF' }}
                >
                  ROS(%)
                </TableCell>
                <TableCell style={{ backgroundColor: '#E5FDFF' }}>
                  Week No.
                </TableCell>
                <TableCell style={{ backgroundColor: '#FDFFE5' }}>
                  Inquiry No.
                </TableCell>
                <TableCell
                  align="right"
                  style={{ backgroundColor: '#FDFFE5' }}
                >
                  20&apos;
                </TableCell>
                <TableCell
                  align="right"
                  style={{ backgroundColor: '#FDFFE5' }}
                >
                  40&apos;
                </TableCell>
                <TableCell
                  align="right"
                  style={{ backgroundColor: '#FDFFE5' }}
                >
                  40&apos;&nbsp;HC
                </TableCell>
                <TableCell
                  align="right"
                  style={{ backgroundColor: '#FDFFE5' }}
                >
                  CBM
                </TableCell>
                <TableCell
                  align="right"
                  style={{ backgroundColor: '#FDFFE5' }}
                >
                  TEU
                </TableCell>
                <TableCell
                  align="right"
                  style={{ backgroundColor: '#FDFFE5' }}
                >
                  Revenue
                </TableCell>
                <TableCell
                  align="right"
                  style={{ backgroundColor: '#FDFFE5' }}
                >
                  GP
                </TableCell>
                <TableCell
                  align="right"
                  style={{ backgroundColor: '#FDFFE5' }}
                >
                  ROS(%)
                </TableCell>
                <TableCell style={{ backgroundColor: '#FDFFE5' }}>
                  Week No.
                </TableCell>
                <TableCell
                  align="right"
                  style={{ backgroundColor: '#FFF0E5' }}
                >
                  Revenue
                </TableCell>
                <TableCell
                  align="right"
                  style={{ backgroundColor: '#FFF0E5' }}
                >
                  GP
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell style={{ backgroundColor: '#F9FFFF' }}>
                  <b>Summary</b>
                </TableCell>
                <TableCell style={{ backgroundColor: '#F9FFFF' }} />
                <TableCell style={{ backgroundColor: '#F9FFFF' }} />
                <TableCell style={{ backgroundColor: '#F9FFFF' }} />
                <TableCell style={{ backgroundColor: '#F9FFFF' }} />
                <TableCell style={{ backgroundColor: '#F9FFFF' }} />
                <TableCell style={{ backgroundColor: '#F9FFFF' }} />
                <TableCell
                  align="right"
                  style={{ backgroundColor: '#F9FFFF' }}
                />
                <TableCell
                  align="right"
                  style={{ backgroundColor: '#F9FFFF' }}
                />
                <TableCell
                  align="right"
                  style={{ backgroundColor: '#F9FFFF' }}
                />
                <TableCell
                  align="right"
                  style={{ backgroundColor: '#F9FFFF' }}
                />
                <TableCell
                  align="right"
                  style={{ backgroundColor: '#F9FFFF' }}
                />
                <TableCell
                  align="right"
                  style={{ backgroundColor: '#F9FFFF' }}
                >
                  {(summary.sumFCRevenue && Number(summary.sumFCRevenue) !== 0) ? Number(summary.sumFCRevenue).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
                </TableCell>
                <TableCell
                  align="right"
                  style={{ backgroundColor: '#F9FFFF' }}
                >
                  {(summary.sumFCGP && Number(summary.sumFCGP) !== 0) ? Number(summary.sumFCGP).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
                </TableCell>
                <TableCell
                  align="right"
                  style={{ backgroundColor: '#F9FFFF' }}
                >
                  {(summary.sumFCRevenue && Number(summary.sumFCRevenue) !== 0) ? `${(Number(summary.sumFCGP / summary.sumFCRevenue) * 100).toFixed(2)}%` : ''}
                </TableCell>
                <TableCell style={{ backgroundColor: '#F9FFFF' }} />
                <TableCell style={{ backgroundColor: '#FDFFF6' }} />
                <TableCell
                  align="right"
                  style={{ backgroundColor: '#FDFFF6' }}
                />
                <TableCell
                  align="right"
                  style={{ backgroundColor: '#FDFFF6' }}
                />
                <TableCell
                  align="right"
                  style={{ backgroundColor: '#FDFFF6' }}
                />
                <TableCell
                  align="right"
                  style={{ backgroundColor: '#FDFFF6' }}
                />
                <TableCell
                  align="right"
                  style={{ backgroundColor: '#FDFFF6' }}
                />
                <TableCell
                  align="right"
                  style={{ backgroundColor: '#FDFFF6' }}
                >
                  {(summary.sumRevenue && Number(summary.sumRevenue) !== 0) ? Number(summary.sumRevenue).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
                </TableCell>
                <TableCell
                  align="right"
                  style={{ backgroundColor: '#FDFFF6' }}
                >
                  {(summary.sumGP && Number(summary.sumGP) !== 0) ? Number(summary.sumGP).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
                </TableCell>
                <TableCell
                  align="right"
                  style={{ backgroundColor: '#FDFFF6' }}
                >
                  {(summary.sumRevenue && Number(summary.sumRevenue) !== 0) ? `${(Number(summary.sumGP / summary.sumRevenue) * 100).toFixed(2)}%` : ''}
                </TableCell>
                <TableCell style={{ backgroundColor: '#FDFFF6' }} />
                <TableCell
                  align="right"
                  style={{ backgroundColor: '#FFFCF9' }}
                >
                  {(summary.sumRevenue - summary.sumFCRevenue && Number(summary.sumRevenue - summary.sumFCRevenue) !== 0)
                    ? Number(summary.sumRevenue - summary.sumFCRevenue).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
                </TableCell>
                <TableCell
                  align="right"
                  style={{ backgroundColor: '#FFFCF9' }}
                >
                  {((summary.sumGP - summary.sumFCGP) && Number(summary.sumGP - summary.sumFCGP) !== 0)
                    ? Number(summary.sumGP - summary.sumFCGP).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
                </TableCell>
              </TableRow>
              {paginatedProducts.map((value) => (
                <TableRow>
                  <TableCell style={{ backgroundColor: '#F9FFFF' }}>
                    {value.user_fullname}
                  </TableCell>
                  <TableCell style={{ backgroundColor: '#F9FFFF' }}>
                    {value.user_team}
                  </TableCell>
                  <TableCell style={{ backgroundColor: '#F9FFFF' }}>
                    {value.cus_name}
                  </TableCell>
                  <TableCell style={{ backgroundColor: '#F9FFFF' }}>
                    {value.fc_mode}
                  </TableCell>
                  <TableCell style={{ backgroundColor: '#F9FFFF' }}>
                    {value.pol_port_name}
                  </TableCell>
                  <TableCell style={{ backgroundColor: '#F9FFFF' }}>
                    {value.pod_port_name}
                  </TableCell>
                  <TableCell style={{ backgroundColor: '#F9FFFF' }}>
                    {value.fc_type}
                  </TableCell>
                  <TableCell
                    align="right"
                    style={{ backgroundColor: '#F9FFFF' }}
                  >
                    {(value.fc_container_20 && Number(value.fc_container_20) !== 0) ? Number(value.fc_container_20).toLocaleString(navigator.language, { minimumFractionDigits: 0 }) : ''}
                  </TableCell>
                  <TableCell
                    align="right"
                    style={{ backgroundColor: '#F9FFFF' }}
                  >
                    {(value.fc_container_40 && Number(value.fc_container_40) !== 0) ? Number(value.fc_container_40).toLocaleString(navigator.language, { minimumFractionDigits: 0 }) : ''}
                  </TableCell>
                  <TableCell
                    align="right"
                    style={{ backgroundColor: '#F9FFFF' }}
                  >
                    {(value.fc_container_40hc && Number(value.fc_container_40hc) !== 0) ? Number(value.fc_container_40hc).toLocaleString(navigator.language, { minimumFractionDigits: 0 }) : ''}
                  </TableCell>
                  <TableCell
                    align="right"
                    style={{ backgroundColor: '#F9FFFF' }}
                  >
                    {(value.fc_container_cbm && Number(value.fc_container_cbm) !== 0) ? Number(value.fc_container_cbm).toLocaleString(navigator.language, { minimumFractionDigits: 3 }) : ''}
                  </TableCell>
                  <TableCell
                    align="right"
                    style={{ backgroundColor: '#F9FFFF' }}
                  >
                    {(value.fc_teu && Number(value.fc_teu) !== 0) ? Number(value.fc_teu).toLocaleString(navigator.language, { minimumFractionDigits: 0 }) : ''}
                  </TableCell>
                  <TableCell
                    align="right"
                    style={{ backgroundColor: '#F9FFFF' }}
                  >
                    {(value.fc_revernue && Number(value.fc_revernue) !== 0) ? Number(value.fc_revernue).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
                  </TableCell>
                  <TableCell
                    align="right"
                    style={{ backgroundColor: '#F9FFFF' }}
                  >
                    {(value.fc_gp && Number(value.fc_gp) !== 0) ? Number(value.fc_gp).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
                  </TableCell>
                  <TableCell
                    align="right"
                    style={{ backgroundColor: '#F9FFFF' }}
                  >
                    {(value.fc_ros && Number(value.fc_ros) !== 0) ? `${Number(value.fc_ros).toFixed(2).toLocaleString()}%` : ''}
                  </TableCell>
                  <TableCell style={{ backgroundColor: '#F9FFFF' }}>
                    {/* value.fc_week_no */}
                    {value.fc_cargo_readiness == null || value.fc_cargo_readiness === '' ? '-' : weekofyear(value.fc_cargo_readiness)}
                  </TableCell>
                  <TableCell style={{ backgroundColor: '#FDFFF6' }}>
                    {value.inq_no}
                  </TableCell>
                  <TableCell
                    align="right"
                    style={{ backgroundColor: '#FDFFF6' }}
                  >
                    {(value.inq_container_20 && Number(value.inq_container_20) !== 0) ? Number(value.inq_container_20).toLocaleString(navigator.language, { minimumFractionDigits: 0 }) : ''}
                  </TableCell>
                  <TableCell
                    align="right"
                    style={{ backgroundColor: '#FDFFF6' }}
                  >
                    {(value.inq_container_40 && Number(value.inq_container_40) !== 0) ? Number(value.inq_container_40).toLocaleString(navigator.language, { minimumFractionDigits: 0 }) : ''}
                  </TableCell>
                  <TableCell
                    align="right"
                    style={{ backgroundColor: '#FDFFF6' }}
                  >
                    {(value.inq_container_40hc && Number(value.inq_container_40hc) !== 0) ? Number(value.inq_container_40hc).toLocaleString(navigator.language, { minimumFractionDigits: 0 }) : ''}
                  </TableCell>
                  <TableCell
                    align="right"
                    style={{ backgroundColor: '#FDFFF6' }}
                  >
                    {(value.inq_container_cbm && Number(value.inq_container_cbm) !== 0) ? Number(value.inq_container_cbm).toLocaleString(navigator.language, { minimumFractionDigits: 3 }) : ''}
                  </TableCell>
                  <TableCell
                    align="right"
                    style={{ backgroundColor: '#FDFFF6' }}
                  >
                    {(value.inq_teu && Number(value.inq_teu) !== 0) ? Number(value.inq_teu).toLocaleString(navigator.language, { minimumFractionDigits: 0 }) : ''}
                  </TableCell>
                  <TableCell
                    align="right"
                    style={{ backgroundColor: '#FDFFF6' }}
                  >
                    {(value.inq_revenue && Number(value.inq_revenue) !== 0) ? Number(value.inq_revenue).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
                  </TableCell>
                  <TableCell
                    align="right"
                    style={{ backgroundColor: '#FDFFF6' }}
                  >
                    {(value.inq_gp && Number(value.inq_gp) !== 0) ? Number(value.inq_gp).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
                  </TableCell>
                  <TableCell
                    align="right"
                    style={{ backgroundColor: '#FDFFF6' }}
                  >
                    {(value.inq_ros && Number(value.inq_ros) !== 0) ? `${Number(value.inq_ros).toFixed(2).toLocaleString()}%` : ''}
                  </TableCell>
                  <TableCell style={{ backgroundColor: '#FDFFF6' }}>
                    {value.inq_res_actual_week_no}
                  </TableCell>
                  <TableCell
                    align="right"
                    style={{ backgroundColor: '#FFFCF9' }}
                  >
                    {(value.inq_revenue - value.fc_revernue && Number(value.inq_revenue - value.fc_revernue) !== 0)
                      ? Number(value.inq_revenue - value.fc_revernue).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
                  </TableCell>
                  <TableCell
                    align="right"
                    style={{ backgroundColor: '#FFFCF9' }}
                  >
                    {((value.inq_gp - value.fc_gp) && Number(value.inq_gp - value.fc_gp) !== 0)
                      ? Number(value.inq_gp - value.fc_gp).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
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

SalesForecastListTable.propTypes = {
  invoices: PropTypes.array.isRequired,
  summary: PropTypes.array.isRequired
};

export default SalesForecastListTable;
