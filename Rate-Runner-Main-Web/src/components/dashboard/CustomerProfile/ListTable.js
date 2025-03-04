import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import PencilAltIcon from '../../../icons/PencilAlt';
import Scrollbar from '../../Scrollbar';
import PlusIcon from '../../../icons/Plus';
import {
  Autocomplete,
  Box,
  Button,
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

const applyPagination = (invoices, page, limit) => invoices
  .slice(page * limit, page * limit + limit);

const ListTable = (props) => {
  const { Country, Customer, CustomerList, ...other } = props;
  const [queryCustomer, setCustomer] = useState('');
  const [queryCountry, setCountry] = useState('');
  const pagemark = Number(window.localStorage.getItem('customer'));
  const limitmark = Number(window.localStorage.getItem('customerL'));
  const [page, setPage] = useState((pagemark) || 0);
  const [limit, setLimit] = useState((limitmark) || 10);
  const user = JSON.parse(window.localStorage.getItem('user'));

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    localStorage.setItem('customer', newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value, 10));
    localStorage.setItem('customerL', event.target.value);
  };

  // Usually query is done on backend with indexing solutions
  const filteredData = CustomerList.filter((Cust) => (
    (Cust.cus_name) ? Cust.cus_name.toUpperCase().includes(queryCustomer.toUpperCase()) : false)
  && ((Cust.customer_country_name) ? Cust.customer_country_name.toUpperCase().includes(queryCountry.toUpperCase()) : true));
  const paginated = applyPagination(filteredData, page, limit);

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
              Country
            </Typography>
            <Autocomplete
              autoHighlight
              freeSolo
              clearOnEscape
              key="Country"
              getOptionLabel={(option) => option.value}
              options={Country}
              onSelect={(val) => {
                setCountry(val.target.value);
                setPage(0);
              }}
              onInputChange={(val) => {
                if (val.target.value === undefined) setCountry('');
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
          <Box
            display={(user.user_role === 'dataAdmin' || user.user_role === 'management') ? 'block' : 'none'}
          >
            <Button
              color="success"
              sx={{ ml: 1, maxWidth: '180px', maxHeight: '40px', minWidth: '180px', minHeight: '40px' }}
              startIcon={<PlusIcon fontSize="small" />}
              variant="contained"
              size="large"
              component={RouterLink}
              to="/reference-data/customer/details/"
            >
              New
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
                  >
                    Customer Name
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="subtitle2"
                  >
                    City
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="subtitle2"
                  >
                    Country
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="subtitle2"
                  >
                    Customer Type
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
              {paginated.map((Cust) => (
                <TableRow style={Cust.cus_disable === 1
                  ? { backgroundColor: '#ededed' } : null}
                >
                  <TableCell>
                    {Cust.cus_name}
                  </TableCell>
                  <TableCell>
                    {Cust.customer_city_name}
                  </TableCell>
                  <TableCell>
                    {Cust.customer_country_name}
                  </TableCell>
                  <TableCell>
                    {Cust.cus_type}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      component={RouterLink}
                      to={`/reference-data/customer/details/${Cust.cus_id}`}
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
        count={filteredData.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[10, 25, 50, 100]}
      />
    </Card>
  );
};

ListTable.propTypes = {
  Country: PropTypes.array.isRequired,
  Customer: PropTypes.array.isRequired,
  CustomerList: PropTypes.array.isRequired
};

export default ListTable;
