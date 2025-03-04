import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import PencilAltIcon from '../../../icons/PencilAlt';
import Scrollbar from '../../Scrollbar';
import PlusIcon from '../../../icons/Plus';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Moment from 'moment';
import { useDispatch, useSelector } from '../../../store';
import { CalendarEventForm } from '../calendar';
import {
  closeModal,
  openModal } from '../../../slices/calendar';
// import SearchIcon from '../../../icons/Search';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  Dialog,
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

const sortOptions = [
  {
    label: ' ',
    value: 'bb'
  },
  {
    label: 'Samantha',
    value: 'Samantha'
  },
  {
    label: 'John jiwa',
    value: 'Johnjiwa'
  }
];

const descendingComparator = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }

  if (b[orderBy] > a[orderBy]) {
    return 1;
  }

  return 0;
};

const getComparator = (order, orderBy) => (order === 'desc'
  ? (a, b) => descendingComparator(a, b, orderBy)
  : (a, b) => -descendingComparator(a, b, orderBy));

const applySort = (customers, sort) => {
  const [orderBy, order] = sort.split('|');
  const comparator = getComparator(order, orderBy);
  const stabilizedThis = customers.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const newOrder = comparator(a[0], b[0]);

    if (newOrder !== 0) {
      return newOrder;
    }

    return a[1] - b[1];
  });

  return stabilizedThis.map((el) => el[0]);
};

const applyPagination = (customers, page, limit) => customers
  .slice(page * limit, page * limit + limit);

const RateTableListTable = (props) => {
  const dispatch = useDispatch();
  const { Agent, RateTables, POL, POD, carrier, ...other } = props;
  const pagemark = Number(window.localStorage.getItem('rateTable'));
  const limitmark = Number(window.localStorage.getItem('rateTableL'));
  const [page, setPage] = useState((pagemark) || 0);
  const [limit, setLimit] = useState((limitmark) || 10);
  const [queryPOL, setQueryPOL] = useState('');
  const [queryPOD, setQueryPOD] = useState('');
  const [querycarrier, setQueryCarrier] = useState('');
  const { isModalOpen, selectedRange } = useSelector((state) => state.calendar);
  const [sort, setSort] = useState(sortOptions[0].value);
  const selectedEvent = useSelector(selectedEventSelector);
  const [queryAgent, setAgent] = useState('');

  // eslint-disable-next-line no-unused-vars
  const handleSortChange = (event) => {
    setSort(event.target.value);
  };

  const handleAddClick = () => {
    dispatch(openModal());
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    localStorage.setItem('rateTable', newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value, 10));
    localStorage.setItem('rateTableL', event.target.value);
  };

  // Usually query is done on backend with indexing solutions
  const filteredRateTables = RateTables.filter((RateTable) => ((RateTable.pol_port_name) ? RateTable.pol_port_name.toUpperCase().includes(queryPOL.toUpperCase()) : true)
  && ((RateTable.agent_name) ? RateTable.agent_name.toUpperCase().includes(queryAgent.toUpperCase()) : false)
  && ((RateTable.pod_port_name) ? RateTable.pod_port_name.toUpperCase().includes(queryPOD.toUpperCase()) : true)
  && ((RateTable.cr_name) ? RateTable.cr_name.toUpperCase().includes(querycarrier.toUpperCase()) : true));
  const sortedRateTables = applySort(filteredRateTables, sort);
  const paginatedRateTables = applyPagination(sortedRateTables, page, limit);

  const handleModalClose = () => {
    dispatch(closeModal());
  };

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
              width: 200
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
              id="carrier"
              getOptionLabel={(option) => option.value}
              options={carrier}
              onSelect={(val) => {
                setQueryCarrier(val.target.value);
                setPage(0);
              }}
              onInputChange={(val) => {
                if (val.target.value === undefined) setQueryCarrier('');
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
              width: 200
            }}
          >
            <Typography
              variant="h6"
            >
              Agent
            </Typography>
            <Autocomplete
              autoHighlight
              freeSolo
              clearOnEscape
              key="Agent"
              getOptionLabel={(option) => option.value}
              options={Agent}
              onSelect={(val) => {
                setAgent(val.target.value);
                setPage(0);
              }}
              onInputChange={(val) => {
                if (val.target.value === undefined) setAgent('');
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
              width: 200
            }}
          >
            <Typography
              variant="h6"
            >
              POL
            </Typography>
            <Autocomplete
              autoHighlight
              freeSolo
              id="POL"
              getOptionLabel={(option) => option.value}
              options={POL}
              onSelect={(val) => {
                setQueryPOL(val.target.value);
                setPage(0);
              }}
              onInputChange={(val) => {
                if (val.target.value === undefined) setQueryPOL('');
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
              width: 200
            }}
          >
            <Typography
              variant="h6"
            >
              POD
            </Typography>
            <Autocomplete
              autoHighlight
              freeSolo
              id="POD"
              getOptionLabel={(option) => option.value}
              options={POD}
              onSelect={(val) => {
                setQueryPOD(val.target.value);
                setPage(0);
              }}
              onInputChange={(val) => {
                if (val.target.value === undefined) setQueryPOD('');
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
              color="primary"
              sx={{ ml: 1, maxWidth: '150px', maxHeight: '40px', minWidth: '150px', minHeight: '40px' }}
              startIcon={<CloudUploadIcon fontSize="small" />}
              variant="contained"
              size="large"
              onClick={handleAddClick}
            >
              UPLOAD
            </Button>
          </Box>
          <Box>
            <Button
              color="success"
              sx={{ ml: 1, maxWidth: '150px', maxHeight: '40px', minWidth: '150px', minHeight: '40px' }}
              startIcon={<PlusIcon fontSize="small" />}
              variant="contained"
              size="large"
              component={RouterLink}
              to="/reference-data/rate-table/details"
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
                <TableCell
                  colspan={10}
                  align="center"
                />
                <TableCell
                  colspan={5}
                  align="center"
                >
                  <Typography
                    variant="subtitle2"
                  >
                    Freight
                  </Typography>
                </TableCell>
                <TableCell
                  colspan={2}
                  align="center"
                >
                  <Typography
                    variant="subtitle2"
                  >
                    ISPS
                  </Typography>
                </TableCell>
                <TableCell
                  colspan={2}
                  align="center"
                >
                  <Typography
                    variant="subtitle2"
                  >
                    AMS/ENS/AFR
                  </Typography>
                </TableCell>
                <TableCell />
                <TableCell
                  colspan={3}
                  align="center"
                >
                  <Typography
                    variant="subtitle2"
                  >
                    Sailing
                  </Typography>
                </TableCell>
                <TableCell />
                <TableCell />
                <TableCell />
              </TableRow>
              <TableRow>
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
                    Recommend
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="subtitle2"
                  >
                    Agent
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="subtitle2"
                  >
                    Carrier
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="subtitle2"
                  >
                    From
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="subtitle2"
                  >
                    To
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="subtitle2"
                  >
                    POL
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="subtitle2"
                  >
                    POD
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
                    Type
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="subtitle2"
                  >
                    Currency
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography
                    variant="subtitle2"
                  >
                    20`
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography
                    variant="subtitle2"
                  >
                    40`
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography
                    variant="subtitle2"
                  >
                    40`HC
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography
                    variant="subtitle2"
                  >
                    CBM
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="subtitle2"
                  >
                    Currency
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography
                    variant="subtitle2"
                  >
                    Charge per CNTR
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="subtitle2"
                  >
                    Currency
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography
                    variant="subtitle2"
                  >
                    Charge per SHPT
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="subtitle2"
                  >
                    T/T
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="subtitle2"
                  >
                    BKK
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="subtitle2"
                  >
                    LCB
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="subtitle2"
                  >
                    OTHERS
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="subtitle2"
                  >
                    ROUTE
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="subtitle2"
                  >
                    T/S PORT
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
              {paginatedRateTables
                .map((RateTable) => (
                  <TableRow
                    key={RateTable.id}
                    style={RateTable.rate_disable === 1
                      ? { backgroundColor: '#ededed' } : null}
                  >
                    <TableCell align="left">
                      <IconButton
                        component={RouterLink}
                        to={`/reference-data/rate-table/details/${RateTable.rate_id}`}
                      >
                        <PencilAltIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                    <TableCell align="center">
                      {RateTable.rate_recommend ? RateTable.rate_recommend : ''}
                    </TableCell>
                    <TableCell>
                      {RateTable.agent_name ? RateTable.agent_name : ''}
                    </TableCell>
                    <TableCell>
                      {RateTable.cr_name ? RateTable.cr_name : ''}
                    </TableCell>
                    <TableCell>
                      {RateTable.rate_valid_from ? Moment(RateTable.rate_valid_from).format('DD/MM/YYYY') : ''}
                    </TableCell>
                    <TableCell>
                      {RateTable.rate_expired_to ? Moment(RateTable.rate_expired_to).format('DD/MM/YYYY') : ''}
                    </TableCell>
                    <TableCell>
                      {RateTable.pol_port_name ? RateTable.pol_port_name : ''}
                    </TableCell>
                    <TableCell>
                      {RateTable.pod_port_name ? RateTable.pod_port_name : ''}
                    </TableCell>
                    <TableCell>
                      {RateTable.cus_name ? RateTable.cus_name : ''}
                    </TableCell>
                    <TableCell>
                      {RateTable.rate_type ? RateTable.rate_type : ''}
                    </TableCell>
                    <TableCell>
                      {RateTable.rate_freight_currency ? RateTable.rate_freight_currency : ''}
                    </TableCell>
                    <TableCell align="right">
                      {(RateTable.rate_freight_20 && Number(RateTable.rate_freight_20) !== 0) ? Number(RateTable.rate_freight_20).toLocaleString() : ''}
                    </TableCell>
                    <TableCell align="right">
                      {(RateTable.rate_freight_40 && Number(RateTable.rate_freight_40) !== 0) ? Number(RateTable.rate_freight_40).toLocaleString() : ''}
                    </TableCell>
                    <TableCell align="right">
                      {(RateTable.rate_freight_40hc && Number(RateTable.rate_freight_40hc) !== 0) ? Number(RateTable.rate_freight_40hc).toLocaleString() : ''}
                    </TableCell>
                    <TableCell align="right">
                      {(RateTable.rate_freight_cbm && Number(RateTable.rate_freight_cbm) !== 0) ? Number(RateTable.rate_freight_cbm).toLocaleString() : ''}
                    </TableCell>
                    <TableCell>
                      {RateTable.rate_isps_currency ? RateTable.rate_isps_currency : ''}
                    </TableCell>
                    <TableCell align="right">
                      {(RateTable.rate_isps_cp_cntr && Number(RateTable.rate_isps_cp_cntr) !== 0) ? Number(RateTable.rate_isps_cp_cntr).toLocaleString() : ''}
                    </TableCell>
                    <TableCell>
                      {RateTable.rate_aea_currency ? RateTable.rate_aea_currency : ''}
                    </TableCell>
                    <TableCell align="right">
                      {(RateTable.rate_aea_cp_shpmt && Number(RateTable.rate_aea_cp_shpmt) !== 0) ? Number(RateTable.rate_aea_cp_shpmt).toLocaleString() : ''}
                    </TableCell>
                    <TableCell>
                      {RateTable.rate_tt ? RateTable.rate_tt : ''}
                    </TableCell>
                    <TableCell>
                      {RateTable.rate_sailing_bkk ? RateTable.rate_sailing_bkk : ''}
                    </TableCell>
                    <TableCell>
                      {RateTable.rate_sailing_lcb ? RateTable.rate_sailing_lcb : ''}
                    </TableCell>
                    <TableCell>
                      {RateTable.rate_sailing_other ? RateTable.rate_sailing_other : ''}
                    </TableCell>
                    <TableCell>
                      {RateTable.rate_route ? RateTable.rate_route : ''}
                    </TableCell>
                    <TableCell>
                      {RateTable.rate_ts_port ? RateTable.rate_ts_port : ''}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        component={RouterLink}
                        to={`/reference-data/rate-table/details/${RateTable.rate_id}`}
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
        count={filteredRateTables.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[10, 25, 50, 100]}
      />
      <Dialog
        fullWidth
        maxWidth="sm"
        onClose={handleModalClose}
        open={isModalOpen}
      >
        {/* Dialog renders its body even if not open */}
        {isModalOpen && (
        <CalendarEventForm
          event={selectedEvent}
          onAddComplete={handleModalClose}
          onCancel={handleModalClose}
          onDeleteComplete={handleModalClose}
          onEditComplete={handleModalClose}
          range={selectedRange}
        />
        )}
      </Dialog>
    </Card>
  );
};

RateTableListTable.propTypes = {
  RateTables: PropTypes.array.isRequired,
  POL: PropTypes.array.isRequired,
  carrier: PropTypes.array.isRequired,
  POD: PropTypes.array.isRequired,
  Agent: PropTypes.array.isRequired
};

export default RateTableListTable;
