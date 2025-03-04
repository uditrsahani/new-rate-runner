import { useState } from 'react';
import PropTypes from 'prop-types';
import PencilAltIcon from '../../../icons/PencilAlt';
import Scrollbar from '../../Scrollbar';
import PlusIcon from '../../../icons/Plus';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { useDispatch, useSelector } from '../../../store';
import { closeModal, openModal } from '../../../slices/calendar';
import { CityCountryEdit } from '.';
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
  const { City, CityList, Country, ...other } = props;
  const [queryCity, setCity] = useState('');
  const [queryCountry, setCountry] = useState('');
  const pagemark = Number(window.localStorage.getItem('city'));
  const limitmark = Number(window.localStorage.getItem('cityL'));
  const [page, setPage] = useState((pagemark) || 0);
  const [limit, setLimit] = useState((limitmark) || 10);
  const { isModalOpen } = useSelector((state) => state.calendar);
  const [FormID, setFormID] = useState([]);
  const selectedEvent = useSelector(selectedEventSelector);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    localStorage.setItem('city', newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value, 10));
    localStorage.setItem('cityL', event.target.value);
  };

  const handleModalClose = () => {
    dispatch(closeModal());
  };
  const handleAddClick = () => {
    dispatch(openModal());
  };

  // Usually query is done on backend with indexing solutions
  const filteredData = CityList.filter((city) => ((city.cc_city_name) ? city.cc_city_name.toUpperCase().includes(queryCity.toUpperCase()) : false)
  && ((city.cc_country_name) ? city.cc_country_name.toUpperCase().includes(queryCountry.toUpperCase()) : false));
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
                City
              </Typography>
              <Autocomplete
                autoHighlight
                freeSolo
                clearOnEscape
                key="City"
                getOptionLabel={(option) => option.value}
                options={City}
                onSelect={(val) => {
                  setCity(val.target.value);
                  setPage(0);
                }}
                onInputChange={(val) => {
                  if (val.target.value === undefined) setCity('');
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
                      Country Code
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="subtitle2"
                    >
                      Country Name
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
                      City Name
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
                {paginated.map((city) => (
                  <TableRow style={city.cc_disable === 1
                    ? { backgroundColor: '#ededed' } : null}
                  >
                    <TableCell>
                      {city.cc_country_id}
                    </TableCell>
                    <TableCell>
                      {city.cc_country_name}
                    </TableCell>
                    <TableCell>
                      {city.cc_city_id}
                    </TableCell>
                    <TableCell>
                      {city.cc_city_name}
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => {
                        const tempSales = CityList.filter((data) => data.cc_city_id === city.cc_city_id && data.cc_country_id === city.cc_country_id);
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
            <CityCountryEdit
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
  Country: PropTypes.array.isRequired,
  City: PropTypes.array.isRequired,
  CityList: PropTypes.array.isRequired
};

export default ListTable;
