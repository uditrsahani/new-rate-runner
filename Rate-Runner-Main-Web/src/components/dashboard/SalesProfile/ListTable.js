import { useState } from 'react';
import PropTypes from 'prop-types';
import PencilAltIcon from '../../../icons/PencilAlt';
import Scrollbar from '../../Scrollbar';
import PlusIcon from '../../../icons/Plus';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { useDispatch, useSelector } from '../../../store';
import { closeModal, openModal } from '../../../slices/calendar';
import { SalesEdit } from '.';
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

const selectedEventSelector = (state) => {
  const { events, selectedEventId } = state.calendar;

  if (selectedEventId) {
    return events.find((_event) => _event.id === selectedEventId);
  }

  return null;
};

const applyPagination = (invoices, page, limit) => invoices
  .slice(page * limit, page * limit + limit);

const ListTable = (props) => {
  const dispatch = useDispatch();
  const { Sales, SalesList, ...other } = props;
  const [querySales, setSales] = useState('');
  const pagemark = Number(window.localStorage.getItem('sales'));
  const limitmark = Number(window.localStorage.getItem('salesL'));
  const [page, setPage] = useState((pagemark) || 0);
  const [limit, setLimit] = useState((limitmark) || 10);
  const { isModalOpen } = useSelector((state) => state.calendar);
  const [FormID, setFormID] = useState([]);
  const selectedEvent = useSelector(selectedEventSelector);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    localStorage.setItem('sales', newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value, 10));
    localStorage.setItem('salesL', event.target.value);
  };

  const handleModalClose = () => {
    dispatch(closeModal());
  };
  const handleAddClick = () => {
    dispatch(openModal());
  };

  // Usually query is done on backend with indexing solutions
  const filteredData = SalesList.filter((sale) => ((querySales) ? sale.user_fullname.toUpperCase().includes(querySales.toUpperCase()) : true));
  const paginated = applyPagination(filteredData, page, limit);

  return (
    <>
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
                onClick={() => {
                  setFormID([]);
                  handleAddClick();
                }}
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
                      Salesman Name
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="subtitle2"
                    >
                      Email
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="subtitle2"
                    >
                      Phone
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="subtitle2"
                    >
                      Level
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="subtitle2"
                    >
                      Team
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
                {paginated.map((sale) => (
                  <TableRow style={sale.user_disable === 1
                    ? { backgroundColor: '#ededed' } : null}
                  >
                    <TableCell>
                      {sale.user_fullname}
                    </TableCell>
                    <TableCell>
                      {sale.user_mail}
                    </TableCell>
                    <TableCell>
                      {sale.user_phone}
                    </TableCell>
                    <TableCell>
                      {sale.user_level}
                    </TableCell>
                    <TableCell>
                      {sale.user_team}
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => {
                        const tempSales = SalesList.filter((data) => data.user_id === sale.user_id);
                        setFormID(tempSales[0]);
                        handleAddClick();
                      }}
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
      <Dialog
        onClose={handleModalClose}
        open={isModalOpen}
        maxWidth="xl"
      >
        <DialogContent
          sx={{ width: 600 }}
        >
          {isModalOpen && (
            <SalesEdit
              event={selectedEvent}
              onAddComplete={handleModalClose}
              onCancel={handleModalClose}
              onDeleteComplete={handleModalClose}
              onEditComplete={handleModalClose}
              FormID={FormID}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

ListTable.propTypes = {
  Sales: PropTypes.array.isRequired,
  SalesList: PropTypes.array.isRequired
};

export default ListTable;
