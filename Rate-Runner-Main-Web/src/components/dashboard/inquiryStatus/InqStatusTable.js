import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Sticky from 'react-sticky-el';
import PropTypes from 'prop-types';
import {
  Autocomplete,
  Box,
  Card,
  Divider,
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
import PencilAltIcon from '../../../icons/PencilAlt';
import Scrollbar from '../../Scrollbar';
import Moment from 'moment';
import ImportExportIcon from '@material-ui/icons/ImportExport';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';

const applyPagination = (display, page, limit) => display
  .slice(page * limit, page * limit + limit);

const applySort = (objectSort, sortInqNo, sortInqStatus, sortRevenue) => {
  if (sortInqNo === 'asc') {
    return objectSort.sort((a, b) => (a.inq_no.toUpperCase() > b.inq_no.toUpperCase() ? 1 : -1));
  } if (sortInqNo === 'desc') {
    return objectSort.sort((a, b) => (a.inq_no.toUpperCase() < b.inq_no.toUpperCase() ? 1 : -1));
  } if (sortInqStatus === 'asc') {
    return objectSort.sort((a, b) => (a.inq_status.toUpperCase() > b.inq_status.toUpperCase() ? 1 : -1));
  } if (sortInqStatus === 'desc') {
    return objectSort.sort((a, b) => (a.inq_status.toUpperCase() < b.inq_status.toUpperCase() ? 1 : -1));
  } if (sortRevenue === 'asc') {
    return objectSort.sort((a, b) => (Number(a.inq_revenue) > Number(b.inq_revenue) ? 1 : -1));
  } if (sortRevenue === 'desc') {
    return objectSort.sort((a, b) => (Number(a.inq_revenue) < Number(b.inq_revenue) ? 1 : -1));
  }
  return objectSort.sort((a, b) => (a.inq_no.toUpperCase() < b.inq_no.toUpperCase() ? 1 : -1));
};

const InqStatusTable = (props) => {
  const { Inquiry, inqList, cusList, PortList, salesList, ...other } = props;
  console.log(Inquiry.length);
  const menupage = JSON.parse(window.localStorage.getItem('menupage'));
  const [page, setPage] = useState((menupage.inquiryStatus) ? menupage.inquiryStatus : 0);
  const [limit, setLimit] = useState((menupage.inquiryStatusL) ? menupage.inquiryStatusL : 10);
  const [serCus, setSerCus] = useState('');
  const [serInq, setSerInq] = useState('');
  const [serPol, setSerPol] = useState('');
  const [serPod, setSerPod] = useState('');
  const [serStatus, setSerStatus] = useState('');
  const [serSales, setSerSales] = useState('');
  const [sortInqNo, setSortInqNo] = useState('desc');
  const [sortInqStatus, setSortInqStatus] = useState('');
  const [sortRevenue, setSortRevenue] = useState('');

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    const thispage = {
      inquiryStatus: newPage,
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
      forecastL: menupage.forecastL
    };

    localStorage.setItem('menupage', JSON.stringify(thispage));
    // console.log(JSON.parse(window.localStorage.getItem('menupage')));
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
      inquiryStatusL: event.target.value,
      recommendL: menupage.recommendL,
      inquiryL: menupage.inquiryL,
      quotationDraftL: menupage.quotationDraftL,
      updateResultL: menupage.updateResultL,
      forecastL: menupage.forecastL
    };

    localStorage.setItem('menupage', JSON.stringify(thispage));
    // console.log(JSON.parse(window.localStorage.getItem('menupage')));
  };

  const handleSortInqNo = () => {
    if (sortInqNo === '') {
      setSortInqNo('asc');
      setSortInqStatus('');
      setSortRevenue('');
    } else if (sortInqNo === 'asc') {
      setSortInqNo('desc');
      setSortInqStatus('');
      setSortRevenue('');
    } else {
      setSortInqNo('');
      setSortInqStatus('');
      setSortRevenue('');
    }
  };
  const handleSortInqStatus = () => {
    if (sortInqStatus === '') {
      setSortInqNo('');
      setSortInqStatus('asc');
      setSortRevenue('');
    } else if (sortInqStatus === 'asc') {
      setSortInqNo('');
      setSortInqStatus('desc');
      setSortRevenue('');
    } else {
      setSortInqNo('');
      setSortInqStatus('');
      setSortRevenue('');
    }
  };
  const handleSortInqRevenue = () => {
    if (sortRevenue === '') {
      setSortInqNo('');
      setSortInqStatus('');
      setSortRevenue('asc');
    } else if (sortRevenue === 'asc') {
      setSortInqNo('');
      setSortInqStatus('');
      setSortRevenue('desc');
    } else {
      setSortInqNo('');
      setSortInqStatus('');
      setSortRevenue('');
    }
  };

  const filteredInquiry = Inquiry.filter((inquiry) => ((inquiry.cus_name) ? inquiry.cus_name.toUpperCase().includes(serCus.toUpperCase()) : true)
  && (inquiry.inq_status !== 'close')
  && (inquiry.inq_disable !== 1)
  && ((inquiry.inq_status) ? inquiry.inq_status.toUpperCase().includes(serStatus.toUpperCase()) : true)
  && ((inquiry.inq_no) ? inquiry.inq_no.toUpperCase().includes(serInq.toUpperCase()) : true)
  && ((inquiry.pol_port_name) ? inquiry.pol_port_name.toUpperCase().includes(serPol.toUpperCase()) : true)
  && ((inquiry.pod_port_name) ? inquiry.pod_port_name.toUpperCase().includes(serPod.toUpperCase()) : true)
  && ((inquiry.user_fullname) ? inquiry.user_fullname.toUpperCase().includes(serSales.toUpperCase()) : true));
  const sortObject = applySort(filteredInquiry, sortInqNo, sortInqStatus, sortRevenue);
  const paginatedInquiry = applyPagination(sortObject, page, limit);

  useEffect(() => {
    console.log(Inquiry.filter((inquiry) => (inquiry.inq_status !== 'close')
    && (inquiry.inq_disable !== 1)).length);
  }, [serCus, serInq, serPol, serPod, serSales]);

  return (
    <>
      <Card {...other}>
        <Grid
          container
          direction="row"
          justifyContent="flex-start"
          alignItems="flex-end"
          sx={{ ml: 2 }}
        >
          <Box
            sx={{
              m: 1,
              maxWidth: '100%',
              width: 180
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
                'waiting marketing',
                'waiting quotation',
                'waiting customer'
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
              width: 180
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
              options={cusList}
              onSelect={(val) => {
                setSerCus(val.target.value);
                setPage(0);
              }}
              onInputChange={(val) => {
                if (val.target.value === undefined) setSerCus('');
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
              width: 180
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
              options={inqList}
              onSelect={(val) => {
                setSerInq(val.target.value);
                setPage(0);
              }}
              onInputChange={(val) => {
                if (val.target.value === undefined) setSerInq('');
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
              width: 180
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
              width: 180
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
              width: 180
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
              id="Sales"
              getOptionLabel={(option) => option.value}
              options={salesList}
              onSelect={(val) => {
                setSerSales(val.target.value);
                setPage(0);
              }}
              onInputChange={(val) => {
                if (val.target.value === undefined) setSerSales('');
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
        <Divider />
        <Sticky scrollElement=".scrollarea">
          <Scrollbar vertical>
            <Box sx={{ minWidth: 1150 }}>
              <Table>
                <TableHead>
                  <TableRow style={{ verticalAlign: 'bottom', position: 'sticky' }}>
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
                      <Typography variant="subtitle2">
                        Inquiry Date
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="subtitle2"
                        onClick={handleSortInqStatus}
                      >
                        {sortInqStatus === 'asc' && (
                        <Link>
                          Inquiry Status
                          {' '}
                          <ArrowDownwardIcon fontSize="small" />
                        </Link>
                        )}
                        {sortInqStatus === 'desc' && (
                        <Link>
                          Inquiry Status
                          {' '}
                          <ArrowUpwardIcon fontSize="small" />
                        </Link>
                        )}
                        {sortInqStatus === '' && (
                        <>
                          Inquiry Status
                          {' '}
                          <ImportExportIcon fontSize="small" />
                        </>
                        )}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2">
                        Last Update
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2">
                        Days
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2">
                        Sales
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2">
                        Customer
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2">
                        Customer Type
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2">
                        Mode
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2">
                        POL
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2">
                        POD
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="subtitle2"
                        onClick={handleSortInqRevenue}
                      >
                        {sortRevenue === 'asc' && (
                        <Link>
                          Revenue
                          {' '}
                          <ArrowDownwardIcon fontSize="small" />
                        </Link>
                        )}
                        {sortRevenue === 'desc' && (
                        <Link>
                          Revenue
                          {' '}
                          <ArrowUpwardIcon fontSize="small" />
                        </Link>
                        )}
                        {sortRevenue === '' && (
                        <>
                          Revenue
                          {' '}
                          <ImportExportIcon fontSize="small" />
                        </>
                        )}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="subtitle2">
                        Detail
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedInquiry.map((value) => (
                    <TableRow
                      hover
                      style={value.inq_disable === 1
                        ? { backgroundColor: '#ededed' } : null}
                    >
                      <TableCell>
                        {value.inq_no}
                      </TableCell>
                      <TableCell>
                        <Typography
                          color="overline"
                          variant="body2"
                        >
                          {value.inq_date ? Moment(value.inq_date).utcOffset(0).format('DD/MM/YYYY HH:mm:ss') : ''}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {value.inq_status ? value.inq_status : ''}
                      </TableCell>
                      <TableCell>
                        {value.inq_tx_time ? Moment(value.inq_tx_time).utcOffset(0).format('DD/MM/YYYY HH:mm:ss') : ''}
                      </TableCell>
                      <TableCell>
                        <Typography
                          color={(value.over_leadtime) ? '#FF4C03' : 'black'}
                        >
                          {Number(value.inq_day)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {value.user_fullname ? value.user_fullname : ''}
                      </TableCell>
                      <TableCell>
                        {value.cus_name ? value.cus_name : ''}
                      </TableCell>
                      <TableCell>
                        {value.cus_type ? value.cus_type : ''}
                      </TableCell>
                      <TableCell>
                        {value.inq_mode ? value.inq_mode : ''}
                      </TableCell>
                      <TableCell>
                        {value.pol_port_name ? value.pol_port_name : ''}
                      </TableCell>
                      <TableCell>
                        {value.pod_port_name ? value.pod_port_name : ''}
                      </TableCell>
                      <TableCell align="right">
                        {(value.inq_revenue) ? Number(value.inq_revenue).toLocaleString() : ''}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          component={RouterLink}
                          to={`/report/inquiry-information/${value.inq_uuid}`}
                        >
                          <PencilAltIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Scrollbar>
        </Sticky>
        <TablePagination
          component="div"
          count={filteredInquiry.length}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[10, 25, 50, 100]}
        />
      </Card>
    </>
  );
};

InqStatusTable.propTypes = {
  Inquiry: PropTypes.array.isRequired,
  inqList: PropTypes.array.isRequired,
  cusList: PropTypes.array.isRequired,
  PortList: PropTypes.array.isRequired,
  salesList: PropTypes.array.isRequired
};

export default InqStatusTable;
