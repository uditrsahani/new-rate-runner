/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback } from 'react';
import { Formik, FieldArray } from 'formik';
import PropTypes from 'prop-types';
import Scrollbar from '../../Scrollbar';
import Moment from 'moment';
import { Month } from '../../../store/data.json';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import DatePicker from '@material-ui/lab/DatePicker';
import instance from '../../../store/instance';
import toast from 'react-hot-toast';
import useMounted from '../../../hooks/useMounted';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  Checkbox,
  Grid,
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

const InvoiceListTable = (props) => {
  const { MonthlyTables, Customer, MonthlyList, Week, ...other } = props;
  const [queryCustomer, setCustomer] = useState('');
  const [queryMonthlyList, setMonthlyList] = useState('');
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState();
  const [complete, setComplete] = useState(false);
  const mounted = useMounted();
  const user = JSON.parse(window.localStorage.getItem('user'));
  const userid = user.user_id;
  const [MonthList, setMonthList] = useState([]);

  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);

  const handleMonthlyListChange = (event) => {
    setMonthlyList(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value, 10));
  };

  const handleClose = () => {
    setOpen(false);
    if (complete) { window.location.assign('/main/forecast'); }
  };

  const ControlForm = () => {
    useEffect(() => {
      // console.log(AgentQuote);
    }, [mounted]);
    return null;
  };

  const getOrders = useCallback(async () => {
    try {
      if ((new Date().getMonth() + 1) === 1) {
        setMonthList([{
          label: 'December',
          value: '12'
        }, ...Month.filter((mon) => (mon.value <= (new Date().getMonth() + 1)))
        ].sort((a, b) => (a.value < b.value ? 1 : -1)));
      } else {
        setMonthList(Month.filter((mon) => (mon.value >= (new Date().getMonth()) && mon.value <= (new Date().getMonth() + 1))));
      }
    } catch (err) {
      console.error(err);
    }
  }, [mounted]);

  useEffect(() => {
    getOrders();
  }, [getOrders]);

  // Usually query is done on backend with indexing solutions
  const filteredInvoices = MonthlyTables.filter((monthly) => (((queryCustomer) || (queryMonthlyList))
&& ((queryCustomer && monthly.cus_name) ? monthly.cus_name.toUpperCase().includes(queryCustomer.toUpperCase()) : true)

&& ((queryMonthlyList && (new Date().getMonth() + 1) !== 1) ? (Number(Moment(monthly.fc_cargo_readiness).utcOffset(0).format('MM')) === Number(queryMonthlyList)
  && Number(Moment(monthly.fc_cargo_readiness).utcOffset(0).format('YYYY')) === Number(new Date().getFullYear())) : true)
  && ((queryMonthlyList && (new Date().getMonth() + 1) === 1 && Number(queryMonthlyList) !== 12) ? (Number(Moment(monthly.fc_cargo_readiness).utcOffset(0).format('MM')) >= Number(queryMonthlyList)
  && Number(Moment(monthly.fc_cargo_readiness).utcOffset(0).format('YYYY')) === Number(new Date().getFullYear())) : true)
  && ((queryMonthlyList && (new Date().getMonth() + 1) === 1 && Number(queryMonthlyList) === 12) ? (Number(Moment(monthly.fc_cargo_readiness).utcOffset(0).format('MM')) === Number(queryMonthlyList)
  && Number(Moment(monthly.fc_cargo_readiness).utcOffset(0).format('YYYY')) === Number(new Date().getFullYear()) - 1) : true)

  && ((queryMonthlyList) ? monthly.fc_week_no >= Number(Moment(`2021-${Number(queryMonthlyList)}-01`).format('W')) : true)
  && ((queryMonthlyList) ? monthly.fc_week_no <= Number(Moment(`2021-${Number(queryMonthlyList)}-01`).format('W')) + 5 : true)));
  // const paginated = applyPagination(filteredInvoices, page, limit);
  const paginated = filteredInvoices;

  const weekofyear = (day) => {
    if (day) {
      let tempWeek = 0;
      if (Moment(Moment(day).format('YYYY-MM-DD')).weekday() === 0) {
        tempWeek = ((Number(Moment(Moment(day).format('YYYY-MM-DD')).format('W')) + 1) % 52);
      } else {
        tempWeek = Number(Moment(Moment(day).format('YYYY-MM-DD')).format('W'));
      }
      return (tempWeek === 0) ? 52 : tempWeek;
    }
    return 0;
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <Typography
            variant="h5"
          >
            Re-Forecast
          </Typography>
        </DialogTitle>
        <DialogContent
          sx={{ width: '400px' }}
        >
          <DialogContentText id="alert-dialog-description">
            {(complete || message === 'Mail Sent!') ? (
              <Typography
                color="green"
                variant="h5"
              >
                {message}
              </Typography>
            )
              : (
                <Typography
                  color="red"
                  variant="h6"
                >
                  -&nbsp;
                  {message}
                </Typography>
              )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            color="primary"
            autoFocus
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
      <Formik
        enableReinitialize
        initialValues={{
          paginated
        }}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          const allData = [];
          values.paginated.map(async (monthly) => {
            if (monthly.new_fc_cargo_readiness && monthly.new_fc_cargo_readiness !== '') {
              const setup = {
                fc_uuid: monthly.fc_uuid,
                fc_disable: 0,
                fc_timestamp: Moment(new Date()).format('YYYY-MM-DD'),
                fc_cargo_readiness: Moment(monthly.new_fc_cargo_readiness).format('YYYY-MM-DD'),
                fc_week_no: weekofyear(monthly.new_fc_cargo_readiness),
                fc_cus_id: monthly.fc_cus_id,
                fc_pol_id: monthly.fc_pol_id,
                fc_pod_id: monthly.fc_pod_id,
                fc_mode: monthly.fc_mode,
                fc_factory_location: monthly.fc_factory_location,
                fc_incoterms: monthly.fc_incoterms,
                fc_place_of_receipt: monthly.fc_place_of_receipt,
                fc_final_destination: monthly.fc_final_destination,
                fc_type: monthly.fc_type,
                fc_qw_per_cntr: monthly.fc_qw_per_cntr,
                fc_idea_rate_per_unit: monthly.fc_idea_rate_per_unit,
                fc_container_20: monthly.fc_container_20,
                fc_container_40: monthly.fc_container_40,
                fc_container_40hc: monthly.fc_container_40hc,
                fc_container_cbm: monthly.fc_container_cbm,
                fc_commodity: monthly.fc_commodity,
                fc_special_container: monthly.fc_special_container,
                fc_revernue: monthly.fc_revernue,
                fc_gp: monthly.fc_gp,
                fc_user_id: userid
              };
              allData.push(setup);
              // console.log(monthly.new_fc_cargo_readiness, monthly.select, setup);
            }
          });
          // console.log(allData);
          if (allData.length > 0) {
          // if (false) {
            try {
              await instance.post('/forecast', allData)
                .then((res) => {
                  // resetForm();
                  setStatus({ success: true });
                  setSubmitting(false);
                  setComplete(true);
                  setMessage('Complete update!');
                  setOpen(true);
                  console.log(res);
                });
            } catch (err) {
              console.error(err);
              toast.error('Something went wrong!');
              setStatus({ success: false });
              setErrors({ submit: err.message });
              setSubmitting(false);
            }
          }
        }}
      >

        {({ // eslint-disable-next-line no-unused-vars
          handleChange, setFieldValue, handleSubmit, isSubmitting, values }) => (
            <form
              onSubmit={handleSubmit}
              {...other}
            >
              <ControlForm />
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
                        Month
                      </Typography>
                      <TextField
                        size="small"
                        fullWidth
                        onChange={handleMonthlyListChange}
                        onInputChange={(val) => {
                          if (val.target.value === undefined) setMonthlyList('');
                        }}
                        select
                        SelectProps={{ native: true }}
                        variant="outlined"
                      >
                        <option
                          key=""
                          value=""
                        >
                          &nbsp;
                        </option>
                        {MonthList.map((obj) => (
                          <option
                            key={obj.value}
                            value={obj.value}
                          >
                            {obj.label}
                          </option>
                        ))}
                      </TextField>
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
                  </Grid>
                </Grid>
                <Scrollbar>
                  <Box sx={{ minWidth: 1450 }}>
                    <FieldArray
                      name="Monthly"
                      render={() => (
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>
                                <Typography
                                  variant="subtitle2"
                                />
                              </TableCell>
                              <TableCell>
                                <Typography
                                  variant="subtitle2"
                                />
                              </TableCell>
                              <TableCell>
                                <Typography
                                  variant="subtitle2"
                                />
                              </TableCell>
                              <TableCell>
                                <Typography
                                  variant="subtitle2"
                                />
                              </TableCell>
                              <TableCell>
                                <Typography
                                  variant="subtitle2"
                                />
                              </TableCell>
                              <TableCell>
                                <Typography
                                  variant="subtitle2"
                                />
                              </TableCell>
                              <TableCell>
                                <Typography
                                  variant="subtitle2"
                                />
                              </TableCell>
                              <TableCell
                                colspan={5}
                                align="center"
                              >
                                <Typography
                                  variant="subtitle2"
                                >
                                  Volume
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography
                                  variant="subtitle2"
                                />
                              </TableCell>
                              <TableCell>
                                <Typography
                                  variant="subtitle2"
                                />
                              </TableCell>
                              <TableCell>
                                <Typography
                                  variant="subtitle2"
                                />
                              </TableCell>
                              <TableCell>
                                <Typography
                                  variant="subtitle2"
                                />
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>
                                <Typography
                                  variant="subtitle2"
                                >
                                  Cargo Readiness
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography
                                  variant="subtitle2"
                                >
                                  New Week
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
                                  Mode
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
                                  Country
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography
                                  variant="subtitle2"
                                >
                                  type
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography
                                  variant="subtitle2"
                                >
                                  20`
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography
                                  variant="subtitle2"
                                >
                                  40`
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography
                                  variant="subtitle2"
                                >
                                  40`HC
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography
                                  variant="subtitle2"
                                >
                                  CBM
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography
                                  variant="subtitle2"
                                  align="right"
                                >
                                  Revenue
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography
                                  variant="subtitle2"
                                  align="right"
                                >
                                  GP
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography
                                  variant="subtitle2"
                                  align="right"
                                >
                                  ROS(%)
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography
                                  variant="subtitle2"
                                >
                                  Week No.
                                </Typography>
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {values.paginated.map((monthly, index) => (
                              <TableRow style={monthly.fc_disable === 1
                                ? { backgroundColor: '#ededed' } : null}
                              >
                                <TableCell sx={{ width: 200 }}>
                                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                      inputFormat="dd/MM/yyyy"
                                      name={`paginated[${index}].new_fc_cargo_readiness`}
                                      onChange={(date) => {
                                        setFieldValue(`paginated[${index}].new_fc_cargo_readiness`, date);
                                      }}
                                      renderInput={(params) => (
                                        <TextField
                                          size="small"
                                          {...params}
                                          helperText=""
                                        />
                                      )}
                                      value={(values.paginated[index].new_fc_cargo_readiness) ? values.paginated[index].new_fc_cargo_readiness : ''}
                                    />
                                  </LocalizationProvider>
                                </TableCell>
                                <TableCell>
                                  {(values.paginated[index].new_fc_cargo_readiness) ? weekofyear(values.paginated[index].new_fc_cargo_readiness) : ''}
                                </TableCell>
                                <TableCell>
                                  {monthly.cus_name}
                                </TableCell>
                                <TableCell>
                                  {monthly.fc_mode}
                                </TableCell>
                                <TableCell>
                                  {monthly.pol_port_name}
                                </TableCell>
                                <TableCell>
                                  {monthly.pod_port_name}
                                </TableCell>
                                <TableCell>
                                  {monthly.fc_factory_location}
                                </TableCell>
                                <TableCell>
                                  {monthly.fc_type}
                                </TableCell>
                                <TableCell>
                                  {(monthly.fc_container_20 && Number(monthly.fc_container_20) !== 0) ? Number(monthly.fc_container_20).toLocaleString(navigator.language, { minimumFractionDigits: 0 }) : ''}
                                </TableCell>
                                <TableCell>
                                  {(monthly.fc_container_20 && Number(monthly.fc_container_20) !== 0) ? Number(monthly.fc_container_20).toLocaleString(navigator.language, { minimumFractionDigits: 0 }) : ''}
                                </TableCell>
                                <TableCell>
                                  {(monthly.fc_container_40hc && Number(monthly.fc_container_40hc) !== 0) ? Number(monthly.fc_container_40hc).toLocaleString(navigator.language, { minimumFractionDigits: 0 }) : ''}
                                </TableCell>
                                <TableCell>
                                  {(monthly.fc_container_cbm && Number(monthly.fc_container_cbm) !== 0) ? Number(monthly.fc_container_cbm).toLocaleString(navigator.language, { minimumFractionDigits: 3 }) : ''}
                                </TableCell>
                                <TableCell align="right">
                                  {(monthly.fc_revernue && Number(monthly.fc_revernue) !== 0) ? Number(monthly.fc_revernue).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
                                </TableCell>
                                <TableCell align="right">
                                  {(monthly.fc_gp && Number(monthly.fc_gp) !== 0) ? Number(monthly.fc_gp).toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : ''}
                                </TableCell>
                                <TableCell align="right">
                                  {(monthly.fc_revernue && Number(monthly.fc_revernue) !== 0) ? `${Number((monthly.fc_gp / monthly.fc_revernue) * 100).toLocaleString(navigator.language, { minimumFractionDigits: 2 })}%` : ''}
                                </TableCell>
                                <TableCell>
                                  {weekofyear(monthly.fc_cargo_readiness)}
                                </TableCell>
                              </TableRow>
                            ))}
                            {values.paginated.length === 0 && (
                            <TableRow height="300">
                              <TableCell
                                colspan={15}
                                valign="middle"
                                align="center"
                              >
                                No data was selected
                              </TableCell>
                            </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      )}
                    />
                  </Box>
                </Scrollbar>
                {/* <TablePagination
                  component="div"
                  count={filteredInvoices.length}
                  onPageChange={handlePageChange}
                  onRowsPerPageChange={handleLimitChange}
                  page={page}
                  rowsPerPage={limit}
                  rowsPerPageOptions={[10, 25, 50, 100]}
                /> */}
              </Card>
              <Grid
                container
                justifyContent="space-between"
                spacing={3}
              >
                <Box sx={{ m: 5, ml: 7 }} />
                <Box sx={{ mt: 5 }}>
                  <Button
                    sx={{ mr: 1, width: 150 }}
                    variant="contained"
                    color="secondary"
                    size="large"
                    type="reset"
                    onClick={() => window.location.assign('/main/forecast')}
                  >
                    CANCEL
                  </Button>
                  <Button
                    sx={{ mr: 0, width: 150 }}
                    variant="contained"
                    color="info"
                    size="large"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    SUBMIT
                  </Button>
                </Box>
              </Grid>
            </form>
        )}
      </Formik>
    </>
  );
};

InvoiceListTable.propTypes = {
  MonthlyTables: PropTypes.array.isRequired,
  MonthlyList: PropTypes.array.isRequired,
  Customer: PropTypes.array.isRequired,
  Week: PropTypes.array.isRequired
};

export default InvoiceListTable;
