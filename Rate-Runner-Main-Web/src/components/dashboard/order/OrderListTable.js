import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  Divider,
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
import SearchIcon from '../../../icons/Search';
import OrderListBulkActions from './OrderListBulkActions';
import Moment from 'moment';

const customerOptions = [
  {
    value: 'a15df0ca-1c9c-4b03-89b9-b7a5e35270b0',
    text: 'EVERSKY SHIPPING LIMITED'
  },
  {
    text: 'E-PLAN (THAILAND) CO.,LTD.',
    value: 'a937f4d1-cc44-4e4f-83cb-054774ff7ce5'
  },
  {
    text: 'QS RETAIL (THAILAND) LIMITED',
    value: 'aabc6b8a-2368-4f3b-a317-53ba35ff4bf7'
  }
];
const agentOptions = [
  {
    value: '3b37b719-2cc1-4a8e-acc3-05a28366a881',
    text: 'WICETH'
  },
  {
    text: 'MCLTAO',
    value: '7da2f640-0080-4382-b259-29b0122eb64d'
  },
  {
    text: 'WICESHA',
    value: 'c464d4d7-aac4-46b5-aad3-60659278c3ff'
  }
];

const polOptions = [
  {
    value: 'SHANGHAI',
    text: 'SHANGHAI'
  },
  {
    text: 'QINGDAO',
    value: 'QINGDAO'
  },
  {
    text: 'LAT KRABANG',
    value: 'LAT KRABANG'
  }
];

const podOptions = [
  {
    value: 'LAEM CHABANG',
    text: 'LAEM CHABANG'
  },
  {
    text: 'BANGKOK',
    value: 'BANGKOK'
  },
  {
    text: 'LOS ANGELES, CA',
    value: 'LOS ANGELES, CA'
  }
];

const inquiryOptions = [
  {
    text: 'inq001',
    value: 'a15df0ca-1c9c-4b03-89b9-b7a5e35270b0'
  },
  {
    text: 'inq002',
    value: '5fab988c-fe57-4f78-86b0-1d43115b51ae'
  },
  {
    text: 'inq003',
    value: 'aabc6b8a-2368-4f3b-a317-53ba35ff4bf7'
  }
];

const applyPagination = (orders, page, limit) => orders
  .slice(page * limit, page * limit + limit);

const applyFilters = (Inquiry, query, filters) => Inquiry
  .filter((RateTable) => {
    let matches = true;

    if (query) {
      const properties = ['name', 'email'];
      let containsQuery = false;

      properties.forEach((property) => {
        if (RateTable.customer[property].toLowerCase().includes(query.toLowerCase())) {
          containsQuery = true;
        }
      });

      if (!containsQuery) {
        matches = false;
      }
    }

    if (filters.status && RateTable.status !== filters.status) {
      matches = false;
    }

    return matches;
  });

const OrderListTable = (props) => {
  const { InquiryTables, ...other } = props;
  console.log(InquiryTables);
  const [selectedOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({
    Sales: null,
    Customer: null,
    POD: null,
    POL: null
  });
  // eslint-disable-next-line no-unused-vars
  const handleCustomerChange = (event) => {
    let value = null;

    if (event.target.value !== 'all') {
      value = event.target.value;
    }

    setFilters((prevFilters) => ({
      ...prevFilters,
      Customer: value
    }));
  };
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };
  const handleQueryChange = (event) => {
    setQuery(event.target.value);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value, 10));
  };
  const filteredInquiry = applyFilters(InquiryTables, query, filters);
  const paginatedInquiry = applyPagination(filteredInquiry, page, limit);

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
              Customer
            </Typography>
            <Autocomplete
              autoHighlight
              getOptionLabel={(option) => option.text}
              options={customerOptions}
              size="small"
              renderInput={(params) => (
                <TextField
                  fullWidth
                  name="Customer"
                  variant="outlined"
                  onChange={handleQueryChange}
                  {...params}
                />
              )}
            />
          </Box>
          <Box
            sx={{
              m: 1,
              maxWidth: '100%',
              width: 220
            }}
          >
            <Typography
              variant="h6"
            >
              Inquiry No.
            </Typography>
            <Autocomplete
              autoHighlight
              getOptionLabel={(option) => option.text}
              options={inquiryOptions}
              size="small"
              renderInput={(params) => (
                <TextField
                  fullWidth
                  name="InquiryNo"
                  variant="outlined"
                  onChange={handleQueryChange}
                  {...params}
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
              getOptionLabel={(option) => option.text}
              options={polOptions}
              size="small"
              renderInput={(params) => (
                <TextField
                  fullWidth
                  name="POL"
                  variant="outlined"
                  onChange={handleQueryChange}
                  {...params}
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
              getOptionLabel={(option) => option.text}
              options={podOptions}
              size="small"
              renderInput={(params) => (
                <TextField
                  fullWidth
                  name="POD"
                  variant="outlined"
                  onChange={handleQueryChange}
                  {...params}
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
              getOptionLabel={(option) => option.text}
              options={agentOptions}
              size="small"
              renderInput={(params) => (
                <TextField
                  fullWidth
                  name="Sales"
                  variant="outlined"
                  onChange={handleQueryChange}
                  {...params}
                />
              )}
            />
          </Box>
          <Box
            sx={{
              m: 1,
              maxWidth: '100%',
              width: 200
            }}
          >
            <Button
              sx={{ ml: 1 }}
              variant="contained"
              size="large"
            >
              <SearchIcon fontSize="small" />
              &nbsp;&nbsp;Search
            </Button>
          </Box>
        </Grid>
        <Divider />
        <Scrollbar>
          <Box sx={{ minWidth: 1150 }}>
            <Table>
              <TableHead>
                <TableRow style={{ verticalAlign: 'bottom' }}>
                  <TableCell>
                    <Typography variant="subtitle2">
                      Inquiry No.
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2">
                      Inquiry Date
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2">
                      Inquiry Status
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
                    <Typography variant="subtitle2">
                      Revenue
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
                {paginatedInquiry.map((order) => (
                  <TableRow
                    hover
                  >
                    <TableCell>
                      {order.inq_no}
                    </TableCell>
                    <TableCell>
                      <Typography
                        color="overline"
                        variant="body2"
                      >
                        {order.inq_date ? Moment(order.inq_date).format('DD/MM/YYYY') : ''}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {order.inq_status}
                      {/* {order.inq_status ? order.inq_status : ''} */}
                    </TableCell>
                    <TableCell>
                      {order.inq_res_actual_week_no ? order.inq_res_actual_week_no : ''}
                    </TableCell>
                    <TableCell>
                      {order.inq_user_id ? order.inq_user_id : ''}
                    </TableCell>
                    <TableCell>
                      {order.inq_cus_id ? order.inq_cus_id : ''}
                    </TableCell>
                    <TableCell>
                      {order.inq_cus_type ? order.inq_cus_type : ''}
                    </TableCell>
                    <TableCell>
                      {order.inq_mode ? order.inq_mode : ''}
                    </TableCell>
                    <TableCell>
                      {order.inq_pol_id ? order.inq_pol_id : ''}
                    </TableCell>
                    <TableCell>
                      {order.inq_pod_id ? order.inq_pod_id : ''}
                    </TableCell>
                    <TableCell>
                      {order.inq_revenue ? order.inq_revenue : ''}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        component={RouterLink}
                        to={`/main/inquiry-status/details/${order.inq_uuid}`}
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
        <TablePagination
          component="div"
          count={InquiryTables.length}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[10, 25, 50, 100]}
        />
      </Card>
      <OrderListBulkActions
        selected={selectedOrders}
      />
    </>
  );
};

OrderListTable.propTypes = {
  InquiryTables: PropTypes.array.isRequired
};

export default OrderListTable;
