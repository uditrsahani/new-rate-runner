import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import PencilAltIcon from '../../../icons/PencilAlt';
import ExternalLinkIcon from '../../../icons/ExternalLink';
import Scrollbar from '../../Scrollbar';
import PlusIcon from '../../../icons/Plus';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { useDispatch, useSelector } from '../../../store';
import { closeModal, openModal } from '../../../slices/calendar';
import { UserEdit } from '.';
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
  const { User, UserList, ...other } = props;
  const [queryUser, setQueryUser] = useState('');
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const { isModalOpen } = useSelector((state) => state.calendar);
  const [FormID, setFormID] = useState([]);
  const [Reset, setReset] = useState(false);
  const selectedEvent = useSelector(selectedEventSelector);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value, 10));
  };

  const handleModalClose = () => {
    dispatch(closeModal());
  };
  const handleAddClick = () => {
    dispatch(openModal());
  };

  // Usually query is done on backend with indexing solutions
  const filteredData = UserList.filter((PP) => ((PP.user_mail) ? PP.user_mail.toUpperCase().includes(queryUser.toUpperCase()) : false));
  const paginated = applyPagination(filteredData, page, limit);
  useEffect(() => {
    /* console.log('-------------------');
    console.log('queryPort:', queryPort);
    console.log('queryCountry:', queryCountry);
    console.log('-------------------'); */
  }, [queryUser]);

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
                User Email
              </Typography>
              <Autocomplete
                autoHighlight
                freeSolo
                clearOnEscape
                key="Port"
                getOptionLabel={(option) => option.value}
                options={User}
                onSelect={(val) => {
                  setQueryUser(val.target.value);
                  setPage(0);
                }}
                onInputChange={(val) => {
                  if (val.target.value === undefined) setQueryUser('');
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
                      User fullname
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
                      User Role
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="subtitle2"
                    >
                      User Team
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="subtitle2"
                    >
                      Edit
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="subtitle2"
                    >
                      Reset Password
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginated.map((port) => (
                  <TableRow style={port.user_disable === 1
                    ? { backgroundColor: '#ededed' } : null}
                  >
                    <TableCell>
                      {port.user_fullname}
                    </TableCell>
                    <TableCell>
                      {port.user_mail}
                    </TableCell>
                    <TableCell>
                      {port.user_role}
                    </TableCell>
                    <TableCell>
                      {port.user_team}
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => {
                        const tempSales = UserList.filter((data) => data.user_id === port.user_id);
                        setFormID(tempSales[0]);
                        setReset(false);
                        handleAddClick();
                      }}
                      >
                        <PencilAltIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => {
                          const tempSales = UserList.filter((data) => data.user_id === port.user_id);
                          setFormID(tempSales[0]);
                          setReset(true);
                          handleAddClick();
                        }}
                      >
                        <ExternalLinkIcon fontSize="small" />
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
            <UserEdit
              event={selectedEvent}
              onAddComplete={handleModalClose}
              onCancel={handleModalClose}
              onDeleteComplete={handleModalClose}
              onEditComplete={handleModalClose}
              FormID={FormID}
              Reset={Reset}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

ListTable.propTypes = {
  User: PropTypes.array.isRequired,
  UserList: PropTypes.array.isRequired
};

export default ListTable;
