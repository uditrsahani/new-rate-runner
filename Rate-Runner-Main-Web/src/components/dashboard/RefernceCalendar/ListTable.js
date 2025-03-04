import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import PencilAltIcon from '../../../icons/PencilAlt';
import Scrollbar from '../../Scrollbar';
import PlusIcon from '../../../icons/Plus';
import {
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
  Typography
} from '@material-ui/core';

const applyPagination = (invoices, page, limit) => invoices
  .slice(page * limit, page * limit + limit);

const ListTable = (props) => {
  const { Customer, CustomerList, ...other } = props;

  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value, 10));
  };

  // Usually query is done on backend with indexing solutions
  const paginated = applyPagination(CustomerList, page, limit);

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
        &nbsp;
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
                    Day
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
                    Mouth
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="subtitle2"
                  >
                    Holidays
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
                <TableRow>
                  <TableCell>
                    {Cust.day}
                  </TableCell>
                  <TableCell>
                    {Cust.date}
                  </TableCell>
                  <TableCell>
                    {Cust.mouth}
                  </TableCell>
                  <TableCell>
                    {Cust.cd_holiday}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      component={RouterLink}
                      to={`/reference-data/calendar/details/${Cust.cd_id}`}
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
        count={CustomerList.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

ListTable.propTypes = {
  Customer: PropTypes.array.isRequired,
  CustomerList: PropTypes.array.isRequired
};

export default ListTable;
