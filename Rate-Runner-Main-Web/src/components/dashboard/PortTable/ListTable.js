import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import PencilAltIcon from '../../../icons/PencilAlt';
import Scrollbar from '../../Scrollbar';
import PlusIcon from '../../../icons/Plus';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { useDispatch, useSelector } from '../../../store';
import { closeModal, openModal } from '../../../slices/calendar';
import { PortEdit } from '.';
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
  const { Port, PortList, Country, City, ...other } = props;
  const [queryPort, setQueryPort] = useState('');
  const pagemark = Number(window.localStorage.getItem('port'));
  const limitmark = Number(window.localStorage.getItem('portL'));
  const [page, setPage] = useState((pagemark) || 0);
  const [limit, setLimit] = useState((limitmark) || 10);
  const { isModalOpen } = useSelector((state) => state.calendar);
  const [FormID, setFormID] = useState([]);
  const selectedEvent = useSelector(selectedEventSelector);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    localStorage.setItem('port', newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value, 10));
    localStorage.setItem('portL', event.target.value);
  };

  const handleModalClose = () => {
    dispatch(closeModal());
  };
  const handleAddClick = () => {
    dispatch(openModal());
  };

  // Usually query is done on backend with indexing solutions
  const filteredData = PortList.filter((PP) => ((PP.port_name) ? PP.port_name.toUpperCase().includes(queryPort.toUpperCase()) : false));
  const paginated = applyPagination(filteredData, page, limit);
  useEffect(() => {
    /* console.log('-------------------');
    console.log('queryPort:', queryPort);
    console.log('queryCountry:', queryCountry);
    console.log('-------------------'); */
  }, [queryPort]);

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
                Port Name
              </Typography>
              <Autocomplete
                autoHighlight
                freeSolo
                clearOnEscape
                key="Port"
                getOptionLabel={(option) => option.value}
                options={Port}
                onSelect={(val) => {
                  setQueryPort(val.target.value);
                  setPage(0);
                }}
                onInputChange={(val) => {
                  if (val.target.value === undefined) setQueryPort('');
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
                      Port Code
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="subtitle2"
                    >
                      Port Name
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="subtitle2"
                    >
                      Country Code
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="subtitle2"
                    >
                      City Code
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="subtitle2"
                    >
                      Region Code
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
                {paginated.map((port) => (
                  <TableRow style={port.port_disable === 1
                    ? { backgroundColor: '#ededed' } : null}
                  >
                    <TableCell>
                      {port.port_code}
                    </TableCell>
                    <TableCell>
                      {port.port_name}
                    </TableCell>
                    <TableCell>
                      {port.port_country_id}
                    </TableCell>
                    <TableCell>
                      {port.port_city_id}
                    </TableCell>
                    <TableCell>
                      {port.port_region}
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => {
                        const tempSales = PortList.filter((data) => data.port_id === port.port_id);
                        const tempCity = City.filter((data) => data.id === port.port_city_id);
                        const tempCountry = Country.filter((data) => data.id === port.port_country_id);
                        tempSales[0].port_city_name = tempCity[0].value;
                        tempSales[0].port_country_name = tempCountry[0].value;
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
        maxWidth="sm"
      >
        <DialogContent
          sx={{ width: 600 }}
        >
          {isModalOpen && (
            <PortEdit
              event={selectedEvent}
              onAddComplete={handleModalClose}
              onCancel={handleModalClose}
              onDeleteComplete={handleModalClose}
              onEditComplete={handleModalClose}
              FormID={FormID}
              Country={Country}
              City={City}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

ListTable.propTypes = {
  Port: PropTypes.array.isRequired,
  PortList: PropTypes.array.isRequired,
  Country: PropTypes.array.isRequired,
  City: PropTypes.array.isRequired
};

export default ListTable;
