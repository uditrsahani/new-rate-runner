import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// import { format } from 'date-fns';
import PropTypes from 'prop-types';
import {
  Autocomplete,
  Box,
  Card,
  Grid,
  IconButton,
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

const applyPagination = (invoices, page, limit) => invoices
  .slice(page * limit, page * limit + limit);

const InvoiceListTable = (props) => {
  const { InquiryTables, Customer, InquiryList, ...other } = props;
  const [queryCustomer, setCustomer] = useState('');
  const [queryInquiryList, setInquiryList] = useState('');

  const menupage = JSON.parse(window.localStorage.getItem('menupage'));
  const [page, setPage] = useState((menupage.updateResult) ? menupage.updateResult : 0);
  const [limit, setLimit] = useState((menupage.updateResultL) ? menupage.updateResultL : 10);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    const thispage = {
      inquiryStatus: menupage.inquiryStatus,
      recommend: menupage.recommend,
      inquiry: menupage.inquiry,
      quotationDraft: menupage.quotationDraft,
      updateResult: newPage,
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
      inquiryL: menupage.inquiryL,
      quotationDraftL: menupage.quotationDraftL,
      updateResultL: event.target.value,
      forecastL: menupage.forecastL
    };

    localStorage.setItem('menupage', JSON.stringify(thispage));
  };

  // Usually query is done on backend with indexing solutions
  const filteredInvoices = InquiryTables.filter((inquiry) => ((inquiry.cus_name) ? inquiry.cus_name.toUpperCase().includes(queryCustomer.toUpperCase()) : true)
   && ((inquiry.inq_no) ? inquiry.inq_no.toUpperCase().includes(queryInquiryList.toUpperCase()) : true));
  const paginatedInvoices = applyPagination(filteredInvoices, page, limit);

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
              width: 300
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
              width: 300
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
        />
      </Grid>
      <Scrollbar>
        <Box sx={{ minWidth: 1200 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography
                    variant="subtitle2"
                  >
                    Inquiry No.
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="subtitle2"
                  >
                    Date
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
                    {invoice.inq_date ? Moment(invoice.inq_date).utcOffset(0).format('DD/MM/YYYY') : ''}
                  </TableCell>
                  <TableCell>
                    {invoice.user_fullname}
                  </TableCell>
                  <TableCell>
                    {invoice.cus_name}
                  </TableCell>
                  <TableCell>
                    {invoice.inq_status}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      component={RouterLink}
                      to={`/main/update-result/details/${invoice.inq_uuid}`}
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
  InquiryTables: PropTypes.array.isRequired,
  InquiryList: PropTypes.array.isRequired,
  Customer: PropTypes.array.isRequired
};

export default InvoiceListTable;
