import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Scrollbar from '../../Scrollbar';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { useDispatch, useSelector } from '../../../store';
import { closeModal, openModal } from '../../../slices/calendar';
import { CalendarEdit } from '.';
import instance from '../../../store/instance';
import { Month } from '../../../store/data.json';
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
  const { HolidayList, ...other } = props;
  const pagemark = Number(window.localStorage.getItem('calendar'));
  const limitmark = Number(window.localStorage.getItem('calendarL'));
  const [page, setPage] = useState((pagemark) || 0);
  const [limit, setLimit] = useState((limitmark) || 10);
  const { isModalOpen } = useSelector((state) => state.calendar);
  const [FormID, setFormID] = useState([]);
  const selectedEvent = useSelector(selectedEventSelector);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    localStorage.setItem('calendar', newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value, 10));
    localStorage.setItem('calendarL', event.target.value);
  };

  const handleModalClose = () => {
    dispatch(closeModal());
  };
  const handleAddClick = () => {
    dispatch(openModal());
  };

  // Usually query is done on backend with indexing solutions
  const filteredData = HolidayList;
  const paginated = applyPagination(filteredData, page, limit);
  useEffect(() => {
    /* console.log('-------------------');
    console.log('queryPort:', queryPort);
    console.log('queryCountry:', queryCountry);
    console.log('-------------------'); */
  }, []);

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
              display="none"
            >
              <Typography
                variant="h6"
              >
                New Year
              </Typography>
              <Typography
                variant="h4"
              >
                2021
              </Typography>
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
            <Box display="none">
              <Button
                color="info"
                sx={{ ml: 1, maxWidth: '180px', maxHeight: '40px', minWidth: '180px', minHeight: '40px' }}
                variant="contained"
                size="large"
                onClick={() => {
                  /* setFormID([]);
                  handleAddClick(); */
                }}
              >
                New Year
              </Button>
            </Box>
            <Box>
              <Button
                color="success"
                sx={{ ml: 1, maxWidth: '180px', maxHeight: '40px', minWidth: '180px', minHeight: '40px' }}
                variant="contained"
                size="large"
                onClick={() => {
                  setFormID([]);
                  handleAddClick();
                }}
              >
                New Holiday
              </Button>
            </Box>
          </Grid>
        </Grid>
        <Scrollbar>
          <Box sx={{ minWidth: 1200 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
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
                      Month
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="subtitle2"
                    >
                      Holiday
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="subtitle2"
                    >
                      Delete
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginated.map((calendar) => (
                  <TableRow>
                    <TableCell>
                      {calendar.cd_date}
                    </TableCell>
                    <TableCell>
                      {Month[calendar.cd_month - 1].label}
                    </TableCell>
                    <TableCell>
                      {calendar.cd_holiday}
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={async () => {
                        try {
                          await instance.patch(`schedule/holiday/${calendar.cd_id}`)
                            .then((res) => {
                              // eslint-disable-next-line no-alert
                              alert('Update Completed');
                              console.log(res.data);
                              window.location.assign('/reference-data/calendar/');
                            });
                        } catch (err) {
                          // eslint-disable-next-line no-alert
                          alert('Something went wrong!');
                        }
                      }}
                      >
                        <DeleteForeverIcon fontSize="small" />
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
            <CalendarEdit
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
  HolidayList: PropTypes.array.isRequired
};

export default ListTable;
