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
  const { Country, Carrier, CarrierList, ...other } = props;
  const [queryCarrier, setCarrier] = useState('');
  const pagemark = Number(window.localStorage.getItem('carrier'));
  const limitmark = Number(window.localStorage.getItem('carrierL'));
  const [page, setPage] = useState((pagemark) || 0);
  const [limit, setLimit] = useState((limitmark) || 10);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    localStorage.setItem('carrier', newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value, 10));
    localStorage.setItem('carrierL', event.target.value);
  };

  // Usually query is done on backend with indexing solutions
  const filteredData = CarrierList.filter((carr) => ((queryCarrier) ? carr.cr_name.toUpperCase().includes(queryCarrier.toUpperCase()) : true));
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
              Carrier
            </Typography>
            <Autocomplete
              autoHighlight
              freeSolo
              clearOnEscape
              key="Carrier"
              getOptionLabel={(option) => option.value}
              options={Carrier}
              onSelect={(val) => {
                setCarrier(val.target.value);
                setPage(0);
              }}
              onInputChange={(val) => {
                if (val.target.value === undefined) setCarrier('');
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
              to="/reference-data/Carrier/details/"
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
                    Carrier Name
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="subtitle2"
                  >
                    Remark
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
              {paginated.map((carr) => (
                <TableRow style={carr.cr_disable === 1
                  ? { backgroundColor: '#ededed' } : null}
                >
                  <TableCell>
                    {carr.cr_name}
                  </TableCell>
                  <TableCell>
                    {carr.cr_remark}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      component={RouterLink}
                      to={`/reference-data/Carrier/details/${carr.cr_id}`}
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
  Carrier: PropTypes.array.isRequired,
  CarrierList: PropTypes.array.isRequired
};

export default ListTable;
