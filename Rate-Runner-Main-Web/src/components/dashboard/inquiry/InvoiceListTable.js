import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import PencilAltIcon from '../../../icons/PencilAlt';
import Scrollbar from '../../Scrollbar';
import PlusIcon from '../../../icons/Plus';
import Moment from 'moment';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ImportExportIcon from '@material-ui/icons/ImportExport';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  Grid,
  IconButton,
  Link,
  Table,
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
  const { PortList, Sales, InquiryTables, Customer, InquiryList, ...other } = props;
  const [queryCustomer, setCustomer] = useState('');
  const [queryInquiryList, setInquiryList] = useState('');
  const [querySales, setSales] = useState('');
  const [serStatus, setSerStatus] = useState('');
  const [serPol, setSerPol] = useState('');
  const [serPod, setSerPod] = useState('');
  const [sortInqNo, setSortInqNo] = useState('desc');
  const [sortInqDate, setSortInqDate] = useState('');
  const [sortCargoReadiness, setSortCargoReadiness] = useState('');

  const menupage = JSON.parse(window.localStorage.getItem('menupage'));
  const [page, setPage] = useState((menupage.inquiry) ? menupage.inquiry : 0);
  const [limit, setLimit] = useState((menupage.inquiryL) ? menupage.inquiryL : 10);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    const thispage = {
      inquiryStatus: menupage.inquiryStatus,
      recommend: menupage.recommend,
      inquiry: newPage,
      quotationDraft: menupage.quotationDraft,
      updateResult: menupage.updateResult,
      forecast: menupage.forecast,
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
      inquiryL: event.target.value,
      quotationDraftL: menupage.quotationDraftL,
      updateResultL: menupage.updateResultL,
      forecastL: menupage.forecastL
    };

    localStorage.setItem('menupage', JSON.stringify(thispage));
  };
  const applySort = (objectSort, _sortInqNo, _sortInqDate, _sortCargoReadiness) => {
    if (_sortInqNo === 'asc') {
      return objectSort.sort((a, b) => (a.inq_no.toUpperCase() > b.inq_no.toUpperCase() ? 1 : -1));
    } if (_sortInqNo === 'desc') {
      return objectSort.sort((a, b) => (a.inq_no.toUpperCase() < b.inq_no.toUpperCase() ? 1 : -1));
    } if (_sortInqDate === 'asc') {
      return objectSort.sort((a, b) => (a.inq_date.toUpperCase() > b.inq_date.toUpperCase() ? 1 : -1));
    } if (_sortInqDate === 'desc') {
      return objectSort.sort((a, b) => (a.inq_date.toUpperCase() < b.inq_date.toUpperCase() ? 1 : -1));
    } if (_sortCargoReadiness === 'asc') {
      return objectSort.sort((a, b) => (a.inq_cargo_readiness.toUpperCase() > b.inq_cargo_readiness.toUpperCase() ? 1 : -1));
    } if (_sortCargoReadiness === 'desc') {
      return objectSort.sort((a, b) => (a.inq_cargo_readiness.toUpperCase() < b.inq_cargo_readiness.toUpperCase() ? 1 : -1));
    }
    return objectSort.sort((a, b) => (a.inq_no.toUpperCase() < b.inq_no.toUpperCase() ? 1 : -1));
  };
  const handleSortInqNo = () => {
    if (sortInqNo === '') {
      setSortInqNo('asc');
      setSortInqDate('');
      setSortCargoReadiness('');
    } else if (sortInqNo === 'asc') {
      setSortInqNo('desc');
      setSortInqDate('');
      setSortCargoReadiness('');
    } else {
      setSortInqNo('');
      setSortInqDate('');
      setSortCargoReadiness('');
    }
  };
  const handleSortInqDate = () => {
    if (sortInqDate === '') {
      setSortInqNo('');
      setSortInqDate('asc');
      setSortCargoReadiness('');
    } else if (sortInqDate === 'asc') {
      setSortInqNo('');
      setSortInqDate('desc');
      setSortCargoReadiness('');
    } else {
      setSortInqNo('');
      setSortInqDate('');
      setSortCargoReadiness('');
    }
  };
  const handleSortCargoReadiness = () => {
    if (sortCargoReadiness === '') {
      setSortInqNo('');
      setSortInqDate('');
      setSortCargoReadiness('asc');
    } else if (sortCargoReadiness === 'asc') {
      setSortInqNo('');
      setSortInqDate('');
      setSortCargoReadiness('desc');
    } else {
      setSortInqNo('');
      setSortInqDate('');
      setSortCargoReadiness('');
    }
  };

  // Usually query is done on backend with indexing solutions
  const filteredInvoices = InquiryTables.filter((inquiry) => ((inquiry.cus_name) ? inquiry.cus_name.toUpperCase().includes(queryCustomer.toUpperCase()) : true)
  && ((inquiry.inq_status) ? inquiry.inq_status.toUpperCase().includes(serStatus.toUpperCase()) : true)
  && ((serPol) ? inquiry.pol_port_name.toUpperCase().includes(serPol.toUpperCase()) : true)
  && ((serPod) ? inquiry.pod_port_name.toUpperCase().includes(serPod.toUpperCase()) : true)
  && ((querySales) ? inquiry.user_fullname.toUpperCase().includes(querySales.toUpperCase()) : true)
  && ((inquiry.inq_no) ? inquiry.inq_no.toUpperCase().includes(queryInquiryList.toUpperCase()) : true));
  const sortObject = applySort(filteredInvoices, sortInqNo, sortInqDate, sortCargoReadiness);
  const paginatedInvoices = applyPagination(sortObject, page, limit);

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
              Inquiry No.
            </Typography>
            <Autocomplete
              autoHighlight
              freeSolo
              id="InquiryNo"
              getOptionLabel={(option) => option.value}
              options={InquiryList}
              onSelect={(val) => {
                setInquiryList(val.target.value);
                setPage(0);
              }}
              onInputChange={(val) => {
                if (val.target.value === undefined) setInquiryList('');
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
              Inquiry Status
            </Typography>
            <TextField
              size="small"
              fullWidth
              name="veiw"
              onChange={(val) => {
                setSerStatus(val.target.value);
              }}
              select
              SelectProps={{ native: true }}
              variant="outlined"
            >
              {['',
                'waiting sales',
                'waiting quotation'
              ].map((obj) => (
                <option
                  key={obj}
                  value={obj}
                >
                  {obj}
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
              color="success"
              sx={{ ml: 1, maxWidth: '180px', maxHeight: '40px', minWidth: '180px', minHeight: '40px' }}
              startIcon={<PlusIcon fontSize="small" />}
              variant="contained"
              size="large"
              component={RouterLink}
              to="/main/inquiry/details"
            >
              New Inquiry
            </Button>
          </Box>
        </Grid>
      </Grid>
      <Scrollbar>
        <Box sx={{ minWidth: 1200 }}>
          <Table>
            <TableHead>
              <TableRow>
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
                <TableCell>
                  <Typography
                    variant="subtitle2"
                    onClick={handleSortInqDate}
                  >
                    {sortInqDate === 'asc' && (
                    <Link>
                      Date
                      {' '}
                      <ArrowDownwardIcon fontSize="small" />
                    </Link>
                    )}
                    {sortInqDate === 'desc' && (
                    <Link>
                      Date
                        {' '}
                      <ArrowUpwardIcon fontSize="small" />
                    </Link>
                    )}
                    {sortInqDate === '' && (
                    <>
                      Date
                        {' '}
                      <ImportExportIcon fontSize="small" />
                    </>
                    )}
                  </Typography>
                </TableCell>
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
                  <Typography
                    variant="subtitle2"
                  >
                    Sales
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
                    POL
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="subtitle2"
                  >
                    POD
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="subtitle2"
                  >
                    Status
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
              {paginatedInvoices.map((invoice) => (
                <TableRow style={invoice.inq_disable === 1
                  ? { backgroundColor: '#ededed' } : null}
                >
                  <TableCell>
                    {invoice.inq_no}
                  </TableCell>
                  <TableCell>
                    {invoice.inq_date ? Moment(invoice.inq_date).format('DD/MM/YYYY') : ''}
                  </TableCell>
                  <TableCell>
                    {invoice.inq_cargo_readiness ? Moment(invoice.inq_cargo_readiness).format('DD/MM/YYYY') : ''}
                  </TableCell>
                  <TableCell>
                    {invoice.user_fullname}
                  </TableCell>
                  <TableCell>
                    {invoice.cus_name}
                  </TableCell>
                  <TableCell>
                    {invoice.pol_port_name}
                  </TableCell>
                  <TableCell>
                    {invoice.pod_port_name}
                  </TableCell>
                  <TableCell>
                    {invoice.inq_status}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      component={RouterLink}
                      to={`/main/inquiry/details/${invoice.inq_uuid}`}
                    >
                      <PencilAltIcon fontSize="small" />
                    </IconButton>
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
  InquiryTables: PropTypes.array.isRequired,
  InquiryList: PropTypes.array.isRequired,
  PortList: PropTypes.array.isRequired,
  Customer: PropTypes.array.isRequired
};

export default InvoiceListTable;
