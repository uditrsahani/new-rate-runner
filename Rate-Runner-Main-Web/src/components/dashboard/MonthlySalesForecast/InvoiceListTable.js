import { useState, useEffect, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// import { format } from 'date-fns';
import PropTypes from 'prop-types';
import PencilAltIcon from '../../../icons/PencilAlt';
import Scrollbar from '../../Scrollbar';
import VisibilityIcon from '@material-ui/icons/Visibility';
import SyncIcon from '@material-ui/icons/Sync';
import PlusIcon from '../../../icons/Plus';
import Moment from 'moment';
import { Month } from '../../../store/data.json';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ImportExportIcon from '@material-ui/icons/ImportExport';
import useMounted from '../../../hooks/useMounted';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  Checkbox,
  Grid,
  IconButton,
  Table,
  Link,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography
} from '@material-ui/core';

const applyPagination = (invoices, page, limit) => invoices
  .slice(page * limit, page * limit + limit);

const InvoiceListTable = (props) => {
  const mounted = useMounted();
  const { PortList, Sales, MonthlyTables, Customer, MonthlyList, ...other } = props;
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [queryCustomer, setCustomer] = useState('');
  const [queryMonthlyList, setMonthlyList] = useState('');
  const [querySales, setSales] = useState('');
  const [serPol, setSerPol] = useState('');
  const [serPod, setSerPod] = useState('');
  const [sort1, setSort1] = useState('desc');
  const [sort2, setSort2] = useState('');
  const [sort3, setSort3] = useState('');
  const [MonthList, setMonthList] = useState([]);

  const menupage = JSON.parse(window.localStorage.getItem('menupage'));
  const [page, setPage] = useState((menupage.forecast) ? menupage.forecast : 0);
  const [limit, setLimit] = useState((menupage.forecastL) ? menupage.forecastL : 10);

  const applySort = (objectSort, _sort1, _sort2, _sort3) => {
    if (_sort1 === 'asc') {
      return objectSort.sort((a, b) => (a.fc_cargo_readiness > b.fc_cargo_readiness ? 1 : -1));
    } if (_sort1 === 'desc') {
      return objectSort.sort((a, b) => (a.fc_cargo_readiness < b.fc_cargo_readiness ? 1 : -1));
    } if (_sort2 === 'asc') {
      return objectSort.sort((a, b) => (a.pol_port_name.toUpperCase() > b.pol_port_name.toUpperCase() ? 1 : -1));
    } if (_sort2 === 'desc') {
      return objectSort.sort((a, b) => (a.pol_port_name.toUpperCase() < b.pol_port_name.toUpperCase() ? 1 : -1));
    } if (_sort3 === 'asc') {
      return objectSort.sort((a, b) => (a.pod_port_name.toUpperCase() > b.pod_port_name.toUpperCase() ? 1 : -1));
    } if (_sort3 === 'desc') {
      return objectSort.sort((a, b) => (a.pod_port_name.toUpperCase() < b.pod_port_name.toUpperCase() ? 1 : -1));
    }
    return objectSort.sort((a, b) => (Number(a.fc_week_no) < Number(b.fc_week_no) ? 1 : -1));
  };

  const handleSort1 = () => {
    if (sort1 === '') {
      setSort1('asc');
      setSort2('');
      setSort3('');
    } else if (sort1 === 'asc') {
      setSort1('desc');
      setSort2('');
      setSort3('');
    } else {
      setSort1('');
      setSort2('');
      setSort3('');
    }
  };
  const handleSort2 = () => {
    if (sort2 === '') {
      setSort1('');
      setSort2('asc');
      setSort3('');
    } else if (sort2 === 'asc') {
      setSort1('');
      setSort2('desc');
      setSort3('');
    } else {
      setSort1('');
      setSort2('');
      setSort3('');
    }
  };
  const handleSort3 = () => {
    if (sort3 === '') {
      setSort1('');
      setSort2('');
      setSort3('asc');
    } else if (sort3 === 'asc') {
      setSort1('');
      setSort2('');
      setSort3('desc');
    } else {
      setSort1('');
      setSort2('');
      setSort3('');
    }
  };

  const handleMonthlyListChange = (event) => {
    setMonthlyList(event.target.value);
  };

  const handleSelectAllInvoices = (event) => {
    setSelectedInvoices(event.target.checked
      ? MonthlyTables.map((invoice) => invoice.id)
      : []);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    const thispage = {
      inquiryStatus: menupage.inquiryStatus,
      recommend: menupage.recommend,
      inquiry: menupage.inquiry,
      quotationDraft: menupage.quotationDraft,
      updateResult: menupage.updateResult,
      forecast: newPage,
      inquiryStatusL: menupage.inquiryStatusL,
      recommendL: menupage.recommendL,
      inquiryL: menupage.inquiryL,
      quotationDraftL: menupage.quotationDraftL,
      updateResultL: menupage.updateResultL,
      forecastL: menupage.forecastL
    };

    localStorage.setItem('menupage', JSON.stringify(thispage));
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value, 10));
    const thispage = {
      inquiryStatus: menupage.inquiryStatus,
      recommend: menupage.recommend,
      inquiry: menupage.inquiry,
      quotationDraft: menupage.quotationDraft,
      updateResult: menupage.updateResult,
      forecast: menupage.forecast,
      inquiryStatusL: menupage.inquiryStatusL,
      recommendL: menupage.recommendL,
      inquiryL: menupage.inquiryL,
      quotationDraftL: menupage.quotationDraftL,
      updateResultL: menupage.updateResultL,
      forecastL: event.target.value
    };

    localStorage.setItem('menupage', JSON.stringify(thispage));
  };

  const getOrders = useCallback(async () => {
    try {
      if ((new Date().getMonth() + 1) === 12) {
        setMonthList([{
          label: 'January',
          value: '01'
        }, ...Month.filter((mon) => (mon.value >= (new Date().getMonth() + 1) && mon.value <= (new Date().getMonth() + 2)))
        ].sort((a, b) => (a.value < b.value ? 1 : -1)));
      } else {
        setMonthList(Month.filter((mon) => (mon.value >= (new Date().getMonth() + 1) && mon.value <= (new Date().getMonth() + 2))));
      }
    } catch (err) {
      console.error(err);
    }
  }, [mounted]);

  useEffect(() => {
    getOrders();
  }, [getOrders]);

  // Usually query is done on backend with indexing solutions
  const filteredInvoices = MonthlyTables.filter((monthly) => ((queryCustomer && monthly.cus_name) ? monthly.cus_name.toUpperCase().includes(queryCustomer.toUpperCase()) : true)

  && ((queryMonthlyList !== '' && (new Date().getMonth() + 1) !== 12) ? (Number(Moment(monthly.fc_cargo_readiness).utcOffset(0).format('MM')) === Number(queryMonthlyList)
  && Number(Moment(monthly.fc_cargo_readiness).utcOffset(0).format('YYYY')) === Number(new Date().getFullYear())) : true)
  && ((queryMonthlyList !== '' && (new Date().getMonth() + 1) === 12 && Number(queryMonthlyList) !== 1) ? (Number(Moment(monthly.fc_cargo_readiness).utcOffset(0).format('MM')) >= Number(queryMonthlyList)
  && Number(Moment(monthly.fc_cargo_readiness).utcOffset(0).format('YYYY')) === Number(new Date().getFullYear())) : true)
  && ((queryMonthlyList !== '' && (new Date().getMonth() + 1) === 12 && Number(queryMonthlyList) === 1) ? (Number(Moment(monthly.fc_cargo_readiness).utcOffset(0).format('MM')) === Number(queryMonthlyList)
  && Number(Moment(monthly.fc_cargo_readiness).utcOffset(0).format('YYYY')) === Number(new Date().getFullYear()) + 1) : true)

  && ((queryMonthlyList === '' && (new Date().getMonth() + 1) !== 12) ? Number(Moment(monthly.fc_cargo_readiness).utcOffset(0).format('MM')) >= (new Date().getMonth() + 1)
  && Number(Moment(monthly.fc_cargo_readiness).utcOffset(0).format('MM')) <= (new Date().getMonth() + 2) : true)
  && ((queryMonthlyList === '' && (new Date().getMonth() + 1) === 12)
    ? (Number(Moment(monthly.fc_cargo_readiness).utcOffset(0).format('MM')) === 12
  && Number(Moment(monthly.fc_cargo_readiness).utcOffset(0).format('YYYY')) === Number(new Date().getFullYear()))
  || (Number(Moment(monthly.fc_cargo_readiness).utcOffset(0).format('MM')) === 1
  && Number(Moment(monthly.fc_cargo_readiness).utcOffset(0).format('YYYY')) === Number(new Date().getFullYear()) + 1) : true)

  && ((querySales) ? monthly.user_fullname.toUpperCase().includes(querySales.toUpperCase()) : true)
  && ((serPol) ? monthly.pol_port_name.toUpperCase().includes(serPol.toUpperCase()) : true)
  && ((serPod) ? monthly.pod_port_name.toUpperCase().includes(serPod.toUpperCase()) : true));
  /* useEffect(() => {
    let count2 = 0;
    MonthlyTables.map((monthly) => {
      // console.log(Number(Moment(monthly.fc_cargo_readiness).utcOffset(0).format('MM')), Number(Moment(monthly.fc_cargo_readiness).utcOffset(0).format('YYYY')));
      if (Number(Moment(monthly.fc_cargo_readiness).utcOffset(0).format('MM')) <= 1
      && Number(Moment(monthly.fc_cargo_readiness).utcOffset(0).format('YYYY')) === Number(new Date().getFullYear()) + 1) {
        count2++;
      }
      return true;
    });
    console.log(count2);
  }, [queryMonthlyList]); */

  const sortObject = applySort(filteredInvoices, sort1, sort2, sort3);
  const paginatedInvoices = applyPagination(sortObject, page, limit);
  const enableBulkActions = selectedInvoices.length > 0;
  const selectedSomeInvoices = selectedInvoices.length > 0
    && selectedInvoices.length < MonthlyTables.length;
  const selectedAllInvoices = selectedInvoices.length === MonthlyTables.length;

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
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <Grid
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexWrap: 'wrap',
            m: -1,
            p: 2
          }}
        >
          <Box
            sx={{
              m: 1,
              maxWidth: '100%',
              width: 150
            }}
          >
            <Typography
              variant="h6"
            >
              Month
            </Typography>
            <TextField
              size="small"
              fullWidth
              onChange={(event) => {
                handleMonthlyListChange(event);
                setPage(0);
              }}
              onInputChange={(val) => {
                if (val.target.value === undefined) setMonthlyList('');
              }}
              select
              SelectProps={{ native: true }}
              variant="outlined"
            >
              <option
                key=""
                value=""
              >
                          &nbsp;
              </option>
              {MonthList.map((obj) => (
                <option
                  key={obj.value}
                  value={obj.value}
                >
                  {obj.label}
                </option>
              ))}
            </TextField>
          </Box>
          <Box
            sx={{
              m: 1,
              maxWidth: '100%',
              width: 150
            }}
          >
            <Typography
              variant="h6"
            >
              POL
            </Typography>
            <Autocomplete
              autoHighlight
              freeSolo
              id="POL"
              getOptionLabel={(option) => option.value}
              options={PortList}
              onSelect={(val) => {
                setSerPol(val.target.value);
                setPage(0);
              }}
              onInputChange={(val) => {
                if (val.target.value === undefined) setSerPol('');
              }}
              size="small"
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  InputProps={{ ...params.InputProps }}
                />
              )}
            />
          </Box>
          <Box
            sx={{
              m: 1,
              maxWidth: '100%',
              width: 150
            }}
          >
            <Typography
              variant="h6"
            >
              POD
            </Typography>
            <Autocomplete
              autoHighlight
              freeSolo
              id="POD"
              getOptionLabel={(option) => option.value}
              options={PortList}
              onSelect={(val) => {
                setSerPod(val.target.value);
                setPage(0);
              }}
              onInputChange={(val) => {
                if (val.target.value === undefined) setSerPod('');
              }}
              size="small"
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  InputProps={{ ...params.InputProps }}
                />
              )}
            />
          </Box>
          <Box
            sx={{
              m: 1,
              maxWidth: '100%',
              width: 150
            }}
          >
            <Typography
              variant="h6"
            >
              Sales
            </Typography>
            <Autocomplete
              autoHighlight
              freeSolo
              clearOnEscape
              key="Sales"
              getOptionLabel={(option) => option.value}
              options={Sales}
              onSelect={(val) => {
                setSales(val.target.value);
                setPage(0);
              }}
              onInputChange={(val) => {
                if (val.target.value === undefined) setSales('');
              }}
              size="small"
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  InputProps={{ ...params.InputProps }}
                />
              )}
            />
          </Box>
          <Box
            sx={{
              m: 1,
              maxWidth: '100%',
              width: 150
            }}
          >
            <Typography
              variant="h6"
            >
              Customer
            </Typography>
            <Autocomplete
              autoHighlight
              freeSolo
              clearOnEscape
              key="Customer"
              getOptionLabel={(option) => option.value}
              options={Customer}
              onSelect={(val) => {
                setCustomer(val.target.value);
                setPage(0);
              }}
              onInputChange={(val) => {
                if (val.target.value === undefined) setCustomer('');
              }}
              size="small"
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  InputProps={{ ...params.InputProps }}
                />
              )}
            />
          </Box>
        </Grid>
        <Grid
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            m: 3,
            mt: 5
          }}
        >
          <Box>
            <Button
              color="info"
              sx={{ ml: 1, maxWidth: '180px', maxHeight: '40px', minWidth: '180px', minHeight: '40px' }}
              startIcon={<SyncIcon fontSize="small" />}
              variant="contained"
              size="large"
              component={RouterLink}
              to="/main/forecast/reforecast/"
            >
              RE-FORECAST
            </Button>
          </Box>
          <Box>
            <Button
              color="success"
              sx={{ ml: 1, maxWidth: '180px', maxHeight: '40px', minWidth: '180px', minHeight: '40px' }}
              startIcon={<PlusIcon fontSize="small" />}
              variant="contained"
              size="large"
              component={RouterLink}
              to="/main/forecast/details/"
            >
              New
            </Button>
          </Box>
        </Grid>
      </Grid>
      {enableBulkActions && (
        <Box sx={{ position: 'relative' }}>
          <Box
            sx={{
              backgroundColor: 'background.paper',
              mt: '6px',
              position: 'absolute',
              px: '4px',
              width: '100%',
              zIndex: 2
            }}
          >
            <Checkbox
              checked={selectedAllInvoices}
              color="primary"
              indeterminate={selectedSomeInvoices}
              onChange={handleSelectAllInvoices}
            />
            <Button
              color="primary"
              sx={{ ml: 2 }}
              variant="outlined"
            >
              Delete
            </Button>
            <Button
              color="primary"
              sx={{ ml: 2 }}
              variant="outlined"
            >
              Edit
            </Button>
          </Box>
        </Box>
      )}
      <Scrollbar>
        <Box sx={{ minWidth: 1200 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography
                    variant="subtitle2"
                    onClick={handleSort1}
                  >
                    {sort1 === 'asc' && (
                    <Link>
                      Week No.
                        {' '}
                      <ArrowDownwardIcon fontSize="small" />
                    </Link>
                    )}
                    {sort1 === 'desc' && (
                    <Link>
                      Week No.
                        {' '}
                      <ArrowUpwardIcon fontSize="small" />
                    </Link>
                    )}
                    {sort1 === '' && (
                    <>
                      Week No.
                        {' '}
                      <ImportExportIcon fontSize="small" />
                    </>
                    )}
                  </Typography>
                </TableCell>
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
                <TableCell>
                  <Typography
                    variant="subtitle2"
                    onClick={handleSort2}
                  >
                    {sort2 === 'asc' && (
                    <Link>
                      POL
                        {' '}
                      <ArrowDownwardIcon fontSize="small" />
                    </Link>
                    )}
                    {sort2 === 'desc' && (
                    <Link>
                      POL
                        {' '}
                      <ArrowUpwardIcon fontSize="small" />
                    </Link>
                    )}
                    {sort2 === '' && (
                    <>
                      POL
                        {' '}
                      <ImportExportIcon fontSize="small" />
                    </>
                    )}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="subtitle2"
                    onClick={handleSort3}
                  >
                    {sort3 === 'asc' && (
                    <Link>
                      POD
                        {' '}
                      <ArrowDownwardIcon fontSize="small" />
                    </Link>
                    )}
                    {sort3 === 'desc' && (
                    <Link>
                      POD
                        {' '}
                      <ArrowUpwardIcon fontSize="small" />
                    </Link>
                    )}
                    {sort3 === '' && (
                    <>
                      POD
                        {' '}
                      <ImportExportIcon fontSize="small" />
                    </>
                    )}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="subtitle2"
                  >
                    Type Container
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography
                    variant="subtitle2"
                  >
                    20`
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography
                    variant="subtitle2"
                  >
                    40`
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography
                    variant="subtitle2"
                  >
                    40`HC
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography
                    variant="subtitle2"
                  >
                    CBM
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="subtitle2"
                  >
                    View
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="subtitle2"
                  >
                    Edit
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedInvoices.map((monthly) => (
                <TableRow style={monthly.fc_disable === 1
                  ? { backgroundColor: '#ededed' } : null}
                >
                  <TableCell>
                    {weekofyear(monthly.fc_cargo_readiness)}
                  </TableCell>
                  <TableCell>
                    {monthly.cus_name}
                  </TableCell>
                  <TableCell>
                    {monthly.user_fullname}
                  </TableCell>
                  <TableCell>
                    {monthly.pol_port_name}
                  </TableCell>
                  <TableCell>
                    {monthly.pod_port_name}
                  </TableCell>
                  <TableCell>
                    {monthly.fc_type}
                  </TableCell>
                  <TableCell align="right">
                    {(monthly.fc_container_20 && Number(monthly.fc_container_20) !== 0) ? Number(monthly.fc_container_20).toLocaleString() : ''}
                  </TableCell>
                  <TableCell align="right">
                    {(monthly.fc_container_40 && Number(monthly.fc_container_40) !== 0) ? Number(monthly.fc_container_40).toLocaleString() : ''}
                  </TableCell>
                  <TableCell align="right">
                    {(monthly.fc_container_40hc && Number(monthly.fc_container_40hc) !== 0) ? Number(monthly.fc_container_40hc).toLocaleString() : ''}
                  </TableCell>
                  <TableCell align="right">
                    {(monthly.fc_container_cbm && Number(monthly.fc_container_cbm) !== 0) ? Number(monthly.fc_container_cbm).toLocaleString() : ''}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      component={RouterLink}
                      to={`/main/forecast/details/${monthly.fc_uuid}/view`}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <Grid display={(monthly.fc_inq_uuid && monthly.fc_inq_uuid !== '') ? 'none' : 'block'}>
                      <IconButton
                        component={RouterLink}
                        to={`/main/forecast/details/${monthly.fc_uuid}`}
                      >
                        <PencilAltIcon fontSize="small" />
                      </IconButton>
                    </Grid>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <TablePagination
        component="div"
        count={filteredInvoices.length}
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
  Sales: PropTypes.array.isRequired,
  MonthlyTables: PropTypes.array.isRequired,
  MonthlyList: PropTypes.array.isRequired,
  Customer: PropTypes.array.isRequired,
  PortList: PropTypes.array.isRequired
};

export default InvoiceListTable;
