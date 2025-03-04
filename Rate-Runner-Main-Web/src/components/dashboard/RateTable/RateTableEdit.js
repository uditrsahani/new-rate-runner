import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import useSettings from '../../../hooks/useSettings';
import { Formik, useFormikContext } from 'formik';
import DatePicker from '@material-ui/lab/DatePicker';
import instance from '../../../store/instance';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import useMounted from '../../../hooks/useMounted';
import Moment from 'moment';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { currency, Ratetype } from '../../../store/data.json';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Container,
  Divider,
  FormControlLabel,
  Grid,
  Switch,
  TextField,
  Tab,
  Tabs,
  Table,
  TableRow,
  TableCell,
  TableBody,
  Typography
} from '@material-ui/core';

const tabs = [
  { label: 'Rate Information', value: 'RateInformation' },
  { label: 'Container Information', value: 'ContainerInformation' },
  { label: 'Container Information (con.)', value: 'ContainerInformation2' },
];

const RateTableEdit = (props) => {
  const { RateTables, Agent, Customer, Inquiry, POL, POD, carrier, RateRoute, RateTsPort, ...other } = props;
  const { settings } = useSettings();
  const [currentTab, setCurrentTab] = useState('RateInformation');
  const mounted = useMounted();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState();
  // eslint-disable-next-line no-unused-vars
  const [showBKK, setBKK] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [showLCB, setLCB] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [showOther, setOther] = useState('');
  const [complete, setComplete] = useState(false);

  const handleTabsChange = (event, value) => {
    setCurrentTab(value);
  };
  const handleClose = () => {
    setOpen(false);
    if (complete) { window.location.assign('/reference-data/rate-table'); }
  };

  const ControlForm = () => {
    const { setFieldValue } = useFormikContext();

    useEffect(() => {
      if (RateTables.length > 0 && mounted.current) {
        setFieldValue('rate_timestamp', RateTables[0].rate_timestamp);
        setFieldValue('rate_valid_from', RateTables[0].rate_valid_from);
        setFieldValue('rate_expired_to', RateTables[0].rate_expired_to);
        setFieldValue('rate_id', RateTables[0].rate_id);
      }
    }, [mounted]);
    return null;
  };

  return (
    <Grid>
      <Helmet>
        <title>WICE Rate Runner</title>
      </Helmet>
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
            Rate Table
          </Typography>
        </DialogTitle>
        <DialogContent
          sx={{ width: '500px' }}
        >
          <DialogContentText id="alert-dialog-description">
            {(complete) ? (
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
            sx={{ m: 1 }}
            onClick={handleClose}
            variant="contained"
            color="info"
            size="large"
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
      <Formik
        enableReinitialize
        initialValues={{
          rate_id: (RateTables.length > 0) ? RateTables[0].rate_id : '',
          rate_disable: (RateTables.length > 0) ? (RateTables[0].rate_disable !== 1) : true,
          rate_timestamp: Moment(new Date()).format('YYYY-MM-DD'),
          rate_valid_from: '',
          rate_expired_to: '',
          rate_pod_id: (RateTables.length > 0 && RateTables[0].pod_port_id) ? { id: RateTables[0].pod_port_id, value: RateTables[0].pod_port_name } : { id: '', value: '' },
          rate_pol_id: (RateTables.length > 0 && RateTables[0].pol_port_id) ? { id: RateTables[0].pol_port_id, value: RateTables[0].pol_port_name } : { id: '', value: '' },
          rate_cus_id: (RateTables.length > 0 && RateTables[0].cus_id) ? { id: RateTables[0].cus_id, value: RateTables[0].cus_name } : { id: '', value: '' },
          rate_inq_no: (RateTables.length > 0 && RateTables[0].rate_inq_no) ? { id: RateTables[0].rate_inq_no, value: RateTables[0].rate_inq_no } : { id: '', value: '' },
          rate_agent_id: (RateTables.length > 0 && RateTables[0].agent_id) ? { id: RateTables[0].agent_id, value: RateTables[0].agent_name } : { id: '', value: '' },
          rate_cr_id: (RateTables.length > 0 && RateTables[0].cr_id) ? { id: RateTables[0].cr_id, value: RateTables[0].cr_name } : { id: '', value: '' },
          cr_name: (RateTables.length > 0) ? RateTables[0].cr_name : '',
          rate_recommend: (RateTables.length > 0) ? (RateTables[0].rate_recommend === 'R') : false,
          rate_carrier_sc: (RateTables.length > 0) ? RateTables[0].rate_carrier_sc : '',
          rate_type: (RateTables.length > 0) ? RateTables[0].rate_type : 'DC',
          rate_freight_currency: (RateTables.length > 0 && RateTables[0].rate_freight_currency) ? { id: RateTables[0].rate_freight_currency, value: RateTables[0].rate_freight_currency } : { id: 'USD', value: 'USD' },
          rate_freight_20: (RateTables.length > 0) ? RateTables[0].rate_freight_20 : 0,
          rate_freight_40: (RateTables.length > 0) ? RateTables[0].rate_freight_40 : 0,
          rate_freight_40hc: (RateTables.length > 0) ? RateTables[0].rate_freight_40hc : 0,
          rate_freight_cbm: (RateTables.length > 0) ? RateTables[0].rate_freight_cbm : 0,
          rate_isps_currency: (RateTables.length > 0 && RateTables[0].rate_isps_currency) ? { id: RateTables[0].rate_isps_currency, value: RateTables[0].rate_isps_currency } : { id: 'USD', value: 'USD' },
          rate_isps_cp_cntr: (RateTables.length > 0) ? RateTables[0].rate_isps_cp_cntr : 0,
          rate_aea_currency: (RateTables.length > 0 && RateTables[0].rate_aea_currency) ? { id: RateTables[0].rate_aea_currency, value: RateTables[0].rate_aea_currency } : { id: 'USD', value: 'USD' },
          rate_aea_cp_shpmt: (RateTables.length > 0) ? RateTables[0].rate_aea_cp_shpmt : 0,
          rate_lss_currency: (RateTables.length > 0 && RateTables[0].rate_lss_currency) ? { id: RateTables[0].rate_lss_currency, value: RateTables[0].rate_lss_currency } : { id: 'USD', value: 'USD' },
          rate_lss_20: (RateTables.length > 0) ? RateTables[0].rate_lss_20 : 0,
          rate_lss_40: (RateTables.length > 0) ? RateTables[0].rate_lss_40 : 0,
          rate_lss_40hc: (RateTables.length > 0) ? RateTables[0].rate_lss_40hc : 0,
          rate_remark: (RateTables.length > 0) ? RateTables[0].rate_remark : '',
          rate_sailing_bkk: (RateTables.length > 0) ? RateTables[0].rate_sailing_bkk : '',
          rate_sailing_lcb: (RateTables.length > 0) ? RateTables[0].rate_sailing_lcb : '',
          rate_sailing_other: (RateTables.length > 0) ? RateTables[0].rate_sailing_other : '',
          rate_tt: (RateTables.length > 0) ? RateTables[0].rate_tt : '',
          rate_route: (RateTables.length > 0) ? RateTables[0].rate_route : '',
          rate_ts_port: (RateTables.length > 0) ? RateTables[0].rate_ts_port : '',
          rate_special_container: (RateTables.length > 0) ? RateTables[0].rate_special_container : '',
          rate_input_no: (RateTables.length > 0) ? RateTables[0].rate_input_no : '',
        }}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          let agreeform = false;
          let Data;
          if (values.rate_timestamp === '' || !Moment(values.rate_timestamp, 'YYYY-MM-DD').isValid()) {
            setMessage('Please enter Rate Table Date');
            setOpen(true);
          } else if (values.rate_expired_to <= values.rate_valid_from) {
            setMessage('Expired date must later then Effective date');
            setOpen(true);
          } else if (values.rate_pol_id.id === '') {
            setMessage('Please enter POL');
            setOpen(true);
          } else if (values.rate_cr_id.id === '') {
            setMessage('Please enter Carrier');
            setOpen(true);
          } else if (values.rate_pod_id.id === '') {
            setMessage('Please enter POD');
            setOpen(true);
          } else if (values.rate_type === '') {
            setMessage('Please enter Container Type');
            setOpen(true);
          } else {
            agreeform = true;
            Data = {
              rate_id: values.rate_id,
              rate_pol_id: values.rate_pol_id.id,
              rate_pod_id: values.rate_pod_id.id,
              rate_cus_id: (values.rate_cus_id) ? values.rate_cus_id.id : null,
              rate_inq_no: (values.rate_inq_no) ? values.rate_inq_no.id : null,
              rate_agent_id: (values.rate_agent_id) ? values.rate_agent_id.id : null,
              rate_cr_id: (values.rate_cr_id) ? values.rate_cr_id.id : null,
              rate_recommend: (values.rate_recommend) ? 'R' : '',
              rate_timestamp: Moment(values.rate_timestamp).format('YYYY-MM-DD'),
              rate_valid_from: Moment(values.rate_valid_from).format('YYYY-MM-DD'),
              rate_expired_to: Moment(values.rate_expired_to).format('YYYY-MM-DD'),
              rate_carrier_sc: values.rate_carrier_sc,
              rate_type: values.rate_type,
              rate_freight_currency: values.rate_freight_currency.value,
              rate_freight_20: values.rate_freight_20,
              rate_freight_40: values.rate_freight_40,
              rate_freight_40hc: values.rate_freight_40hc,
              rate_freight_cbm: values.rate_freight_cbm,
              rate_isps_currency: values.rate_isps_currency.value,
              rate_isps_cp_cntr: values.rate_isps_cp_cntr,
              rate_aea_currency: values.rate_aea_currency.value,
              rate_aea_cp_shpmt: values.rate_aea_cp_shpmt,
              rate_lss_currency: values.rate_lss_currency.value,
              rate_lss_20: values.rate_lss_20,
              rate_lss_40: values.rate_lss_40,
              rate_lss_40hc: values.rate_lss_40hc,
              rate_remark: values.rate_remark,
              rate_sailing_bkk: values.rate_sailing_bkk,
              rate_sailing_lcb: values.rate_sailing_lcb,
              rate_sailing_other: values.rate_sailing_other,
              rate_tt: values.rate_tt,
              rate_route: values.rate_route,
              rate_ts_port: values.rate_ts_port,
              rate_special_container: values.rate_special_container,
              rate_disable: (values.rate_disable) ? 0 : 1,
              rate_input_no: (Math.floor(Date.now() / 1000))
            };
            console.log(values.rate_id, Data);
          }

          if (agreeform) {
            try {
              if (Data.rate_id === '') {
                console.log('Rate Table added!');
                await instance.post('/table/rate', Data)
                  .then((res) => {
                    setStatus({ success: true });
                    setSubmitting(false);
                    setComplete(true);
                    setMessage('Complete form');
                    setOpen(true);
                    console.log(res, Data);
                  });
              } else {
                console.log('Rate Table updated!');
                await instance.patch(`/table/rate/${values.rate_id}`, Data)
                  .then(async (res) => {
                    /* if (values.rate_recommend === 'R') {
                      await instance.patch(`/inquiry/${values.rate_id}/rate`, {
                        rate_id: values.rate_id
                      });
                    } */
                    setStatus({ success: true });
                    setSubmitting(false);
                    setComplete(true);
                    setMessage('Save Completed');
                    setOpen(true);
                    console.log(res, Data);
                  });
              }
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
        {({ setFieldValue, handleChange, handleSubmit, isSubmitting, values }) => (
          <form
            onSubmit={handleSubmit}
            {...other}
          >
            <ControlForm />
            <Box
              sx={{
                backgroundColor: 'background.default',
                minHeight: '100%',
                py: 3,
                ml: -2.5
              }}
            >
              <Container maxWidth={settings.compact ? 'xl' : false}>
                <Grid
                  container
                  justifyContent="space-between"
                  spacing={3}
                >
                  <Grid item>
                    <Typography
                      color="textPrimary"
                      variant="h5"
                    >
                      Rate Table
                    </Typography>
                  </Grid>
                </Grid>

                <Card sx={{ mt: 3, height: 120 }}>
                  <CardContent>
                    <Grid
                      container
                      direction="row"
                      justifyContent="flex-start"
                      alignItems="flex-start"
                      sx={{
                        m: -1,
                        mt: -2,
                        p: 2
                      }}
                    >
                      <Box
                        container
                        direction="row"
                        justifyContent="flex-start"
                        alignItems="flex-start"
                        sx={{
                          m: 1,
                          maxWidth: '100%',
                          width: 220,
                          display: 'flex',
                          flexWrap: 'wrap',
                        }}
                      >
                        <Typography
                          variant="h6"
                          color="red"
                        >
                          *
                        </Typography>
                        <Typography
                          variant="h6"
                        >
                          &nbsp;Date
                        </Typography>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            value={values.rate_timestamp}
                            inputFormat="dd/MM/yyyy"
                            name="rate_timestamp"
                            onChange={(date) => setFieldValue('rate_timestamp', date)}
                            renderInput={(params) => (
                              <TextField
                                size="small"
                                {...params}
                                helperText=""
                              />
                            )}
                          />
                        </LocalizationProvider>
                      </Box>
                      <Box
                        sx={{
                          m: 1,
                          maxWidth: '100%',
                          width: 220
                        }}
                      >
                        <Typography
                          variant="h6"
                        >
                          Carrier s/c
                        </Typography>
                        <TextField
                          size="small"
                          fullWidth
                          name="rate_carrier_sc"
                          variant="outlined"
                          onChange={handleChange}
                          value={values.rate_carrier_sc}
                        />
                      </Box>
                      <Box
                        sx={{
                          m: 1,
                          maxWidth: '100%',
                          width: 220
                        }}
                      >
                        <Typography
                          variant="h6"
                        >
                          Customer
                        </Typography>
                        <Autocomplete
                          autoHighlight
                          value={values.rate_cus_id}
                          options={Customer}
                          getOptionLabel={(option) => option.value}
                          onChange={(event, val) => {
                            setFieldValue('rate_cus_id', val);
                          }}
                          name="rate_cus_id"
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              size="small"
                              variant="outlined"
                            />
                          )}
                        />
                      </Box>
                      <Box
                        container
                        direction="row"
                        justifyContent="flex-start"
                        alignItems="flex-start"
                        sx={{
                          m: 1,
                          maxWidth: '100%',
                          width: 220,
                          display: 'flex',
                          flexWrap: 'wrap',
                        }}
                      >
                        <Typography
                          variant="h6"
                        >
                          &nbsp;Inquiry No.
                        </Typography>
                        <Autocomplete
                          autoHighlight
                          value={values.rate_inq_no}
                          options={Inquiry}
                          getOptionLabel={(option) => option.value}
                          onChange={(event, val) => {
                            setFieldValue('rate_inq_no', val);
                            console.log(val);
                          }}
                          name="rate_inq_no"
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              sx={{ width: 220 }}
                              size="small"
                              variant="outlined"
                            />
                          )}
                        />
                      </Box>
                      <Box
                        sx={{
                          alignItems: 'center',
                          display: 'flex',
                          ml: 5,
                          mt: 2
                        }}
                      >
                        <Typography
                          color="textSecondary"
                          variant="h6"
                        >
                          Recommend
                        </Typography>
                        <Checkbox
                          color="primary"
                          name="rate_recommend"
                          value={values.rate_recommend}
                          checked={values.rate_recommend}
                          onChange={handleChange}
                        />
                      </Box>
                      <Box
                        sx={{
                          m: 1,
                          maxWidth: '100%',
                          width: 220
                        }}
                      />
                      <Box
                        sx={{
                          m: 1,
                          maxWidth: '100%',
                          width: 220
                        }}
                      />
                    </Grid>
                  </CardContent>
                </Card>

                <Box sx={{ mt: 3 }}>
                  <Tabs
                    indicatorColor="primary"
                    onChange={handleTabsChange}
                    scrollButtons="auto"
                    textColor="primary"
                    value={currentTab}
                    variant="scrollable"
                  >
                    {tabs.map((tab) => (
                      <Tab
                        key={tab.value}
                        label={tab.label}
                        value={tab.value}
                      />
                    ))}
                  </Tabs>
                </Box>
                <Divider />
                <Box sx={{ mt: 3 }}>
                  {currentTab === 'RateInformation'
                  && (
                  <>
                    <Card>
                      <CardContent>
                        <Box
                          sx={{
                            minWidth: 800,
                            p: 3
                          }}
                        >
                          <Grid
                            container
                            direction="row"
                            justifyContent="flex-start"
                            alignItems="flex-start"
                          >
                            <Box
                              sx={{
                                alignItems: 'center',
                                display: 'flex',
                                flexWrap: 'wrap',
                              }}
                            >
                              <Box
                                sx={{
                                  m: 1,
                                  mt: -2,
                                  maxWidth: '100%',
                                  width: 300
                                }}
                              >
                                <Typography
                                  variant="h6"
                                >
                                  Agent
                                </Typography>
                                <Autocomplete
                                  autoHighlight
                                  value={values.rate_agent_id}
                                  options={Agent}
                                  getOptionLabel={(option) => option.value}
                                  onChange={(event, val) => {
                                    setFieldValue('rate_agent_id', val);
                                  }}
                                  name="rate_agent_id"
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      sx={{ width: 300 }}
                                      size="small"
                                      variant="outlined"
                                    />
                                  )}
                                />
                              </Box>
                              <Box
                                sx={{
                                  m: 1,
                                  mt: -2,
                                  maxWidth: '100%',
                                  width: 300,
                                  display: 'flex',
                                  flexWrap: 'wrap'
                                }}
                              >
                                <Typography
                                  variant="h6"
                                  color="red"
                                >
                                  *
                                </Typography>
                                <Typography
                                  variant="h6"
                                >
                                  &nbsp;Carrier
                                </Typography>
                                <Autocomplete
                                  autoHighlight
                                  value={values.rate_cr_id}
                                  options={carrier}
                                  getOptionLabel={(option) => option.value}
                                  onChange={(event, val) => {
                                    setFieldValue('rate_cr_id', val);
                                  }}
                                  name="rate_cr_id"
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      sx={{ width: 300 }}
                                      size="small"
                                      variant="outlined"
                                    />
                                  )}
                                />
                              </Box>
                              <Box
                                sx={{
                                  m: 1,
                                  mt: -2,
                                  maxWidth: '100%',
                                  width: 220,
                                  display: 'flex',
                                  flexWrap: 'wrap',
                                }}
                              >
                                <Typography
                                  variant="h6"
                                  color="red"
                                >
                                  *
                                </Typography>
                                <Typography
                                  variant="h6"
                                >
                                  &nbsp;Effective
                                </Typography>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                  <DatePicker
                                    value={values.rate_valid_from}
                                    inputFormat="dd/MM/yyyy"
                                    name="rate_valid_from"
                                    onChange={(date) => setFieldValue('rate_valid_from', date)}
                                    renderInput={(params) => (
                                      <TextField
                                        size="small"
                                        {...params}
                                        helperText=""
                                      />
                                    )}
                                  />
                                </LocalizationProvider>
                              </Box>
                              <Box
                                sx={{
                                  m: 1,
                                  mt: -2,
                                  maxWidth: '100%',
                                  width: 220,
                                  display: 'flex',
                                  flexWrap: 'wrap',
                                }}
                              >
                                <Typography
                                  variant="h6"
                                  color="red"
                                >
                                  *
                                </Typography>
                                <Typography
                                  variant="h6"
                                >
                                  &nbsp;Expired
                                </Typography>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                  <DatePicker
                                    value={values.rate_expired_to}
                                    inputFormat="dd/MM/yyyy"
                                    name="rate_expired_to"
                                    onChange={(date) => setFieldValue('rate_expired_to', date)}
                                    renderInput={(params) => (
                                      <TextField
                                        size="small"
                                        {...params}
                                        helperText=""
                                      />
                                    )}
                                  />
                                </LocalizationProvider>
                              </Box>
                              <Box
                                sx={{
                                  m: 1,
                                  maxWidth: '100%',
                                  width: 300,
                                  display: 'flex',
                                  flexWrap: 'wrap',
                                }}
                              >
                                <Typography
                                  variant="h6"
                                  color="red"
                                >
                                  *
                                </Typography>
                                <Typography
                                  variant="h6"
                                >
                                  &nbsp;POL
                                </Typography>
                                <Autocomplete
                                  autoHighlight
                                  value={values.rate_pol_id}
                                  options={POL}
                                  getOptionLabel={(option) => option.value}
                                  onChange={(event, val) => {
                                    setFieldValue('rate_pol_id', val);
                                  }}
                                  name="rate_pol_id"
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      sx={{ width: 300 }}
                                      size="small"
                                      variant="outlined"
                                    />
                                  )}
                                />
                              </Box>
                              <Box
                                sx={{
                                  m: 1,
                                  maxWidth: '100%',
                                  width: 300,
                                  display: 'flex',
                                  flexWrap: 'wrap',
                                }}
                              >
                                <Typography
                                  variant="h6"
                                  color="red"
                                >
                                  *
                                </Typography>
                                <Typography
                                  variant="h6"
                                >
                                  &nbsp;POD
                                </Typography>
                                <Autocomplete
                                  autoHighlight
                                  value={values.rate_pod_id}
                                  options={POD}
                                  getOptionLabel={(option) => option.value}
                                  onChange={(event, val) => {
                                    setFieldValue('rate_pod_id', val);
                                  }}
                                  name="rate_pod_id"
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      sx={{ width: 300 }}
                                      size="small"
                                      variant="outlined"
                                    />
                                  )}
                                />
                              </Box>
                            </Box>
                          </Grid>
                        </Box>
                      </CardContent>
                    </Card>
                  </>
                  )}
                  {currentTab === 'ContainerInformation'
                  && (
                  <Card>
                    <Box
                      sx={{
                        minWidth: 800,
                        p: 3
                      }}
                    >
                      <Box
                        sx={{
                          m: 1,
                          ml: 1,
                          maxWidth: '100%',
                          width: 300,
                          display: 'flex',
                          flexWrap: 'wrap',
                        }}
                      >
                        <Typography
                          variant="h6"
                          color="red"
                        >
                          *
                        </Typography>
                        <Typography
                          variant="h6"
                        >
                          &nbsp;Container Type
                        </Typography>
                        <TextField
                          size="small"
                          fullWidth
                          name="rate_type"
                          onChange={handleChange}
                          select
                          SelectProps={{ native: true }}
                          variant="outlined"
                        >
                          {Ratetype.map((obj) => (
                            <option
                              key={obj.value}
                              value={obj.value}
                              selected={values.rate_type === obj.value}
                            >
                              {obj.label}
                            </option>
                          ))}
                        </TextField>
                      </Box>
                      <Grid
                        container
                        direction="row"
                        justifyContent="flex-start"
                        alignItems="flex-start"
                      >
                        <Card sx={{
                          minWidth: 500,
                          p: 3
                        }}
                        >
                          <Typography
                            variant="h6"
                          >
                            Freight
                          </Typography>

                          <Box sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                          }}
                          >
                            <Box
                              sx={{
                                mr: 1,
                                mt: 2,
                                maxWidth: '100%',
                                width: 150
                              }}
                            >
                              <Typography
                                variant="subtitle2"
                              >
                                Currency
                              </Typography>
                              <Autocomplete
                                autoHighlight
                                value={values.rate_freight_currency}
                                options={currency}
                                getOptionLabel={(option) => option.value}
                                onChange={(event, val) => {
                                  setFieldValue('rate_freight_currency', val);
                                }}
                                name="rate_freight_currency"
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    sx={{ width: 150 }}
                                    size="small"
                                    variant="outlined"
                                  />
                                )}
                              />
                            </Box>
                            <Box
                              sx={{
                                mr: 1,
                                mt: 2,
                                maxWidth: '100%',
                                width: 100
                              }}
                            >
                              <Typography
                                variant="subtitle2"
                              >
                                20`
                              </Typography>
                              <TextField
                                size="small"
                                fullWidth
                                name="rate_freight_20"
                                type="number"
                                variant="outlined"
                                defaultValue={values.rate_freight_20}
                                onChange={handleChange}
                              />
                            </Box>
                            <Box
                              sx={{
                                mr: 1,
                                mt: 2,
                                maxWidth: '100%',
                                width: 100
                              }}
                            >
                              <Typography
                                variant="subtitle2"
                              >
                                40`
                              </Typography>
                              <TextField
                                size="small"
                                fullWidth
                                name="rate_freight_40"
                                type="number"
                                variant="outlined"
                                defaultValue={values.rate_freight_40}
                                onChange={handleChange}
                              />
                            </Box>
                            <Box
                              sx={{
                                mr: 1,
                                mt: 2,
                                maxWidth: '100%',
                                width: 100
                              }}
                            >
                              <Typography
                                variant="subtitle2"
                              >
                                40` HC
                              </Typography>
                              <TextField
                                size="small"
                                fullWidth
                                name="rate_freight_40hc"
                                type="number"
                                variant="outlined"
                                value={values.rate_freight_40hc}
                                onChange={handleChange}
                              />
                            </Box>
                            <Box
                              sx={{
                                mr: 1,
                                mt: 2,
                                maxWidth: '100%',
                                width: 100
                              }}
                            >
                              <Typography
                                variant="subtitle2"
                              >
                                CBM
                              </Typography>
                              <TextField
                                size="small"
                                fullWidth
                                name="rate_freight_cbm"
                                type="number"
                                variant="outlined"
                                value={values.rate_freight_cbm}
                                onChange={handleChange}
                              />
                            </Box>
                          </Box>
                        </Card>
                        <Card sx={{
                          minWidth: 250,
                          p: 3,
                          ml: 3
                        }}
                        >
                          <Typography
                            variant="h6"
                          >
                            ISPS
                          </Typography>

                          <Box sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                          }}
                          >
                            <Box
                              sx={{
                                mr: 1,
                                mt: 2,
                                maxWidth: '100%',
                                width: 150
                              }}
                            >
                              <Typography
                                variant="subtitle2"
                              >
                                Currency
                              </Typography>
                              <Autocomplete
                                autoHighlight
                                value={values.rate_isps_currency}
                                options={currency}
                                getOptionLabel={(option) => option.value}
                                onChange={(event, val) => {
                                  setFieldValue('rate_isps_currency', val);
                                }}
                                name="rate_isps_currency"
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    sx={{ width: 150 }}
                                    size="small"
                                    variant="outlined"
                                  />
                                )}
                              />
                            </Box>
                            <Box
                              sx={{
                                mr: 1,
                                mt: 2,
                                maxWidth: '100%',
                                width: 120
                              }}
                            >
                              <Typography
                                variant="subtitle2"
                              >
                                Charge per CNTR
                              </Typography>
                              <TextField
                                size="small"
                                fullWidth
                                name="rate_isps_cp_cntr"
                                type="number"
                                variant="outlined"
                                value={values.rate_isps_cp_cntr}
                                onChange={handleChange}
                              />
                            </Box>
                          </Box>
                        </Card>
                        <Card sx={{
                          minWidth: 500,
                          p: 3,
                          mt: 3
                        }}
                        >
                          <Typography
                            variant="h6"
                          >
                            AMS/ENS/AFR
                          </Typography>

                          <Box sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                          }}
                          >
                            <Box
                              sx={{
                                mr: 1,
                                mt: 2,
                                maxWidth: '100%',
                                width: 150
                              }}
                            >
                              <Typography
                                variant="subtitle2"
                              >
                                Currency
                              </Typography>
                              <Autocomplete
                                autoHighlight
                                value={values.rate_aea_currency}
                                options={currency}
                                getOptionLabel={(option) => option.value}
                                onChange={(event, val) => {
                                  setFieldValue('rate_aea_currency', val);
                                }}
                                name="rate_aea_currency"
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    sx={{ width: 150 }}
                                    size="small"
                                    variant="outlined"
                                  />
                                )}
                              />
                            </Box>
                            <Box
                              sx={{
                                mr: 1,
                                mt: 2,
                                maxWidth: '100%',
                                width: 120
                              }}
                            >
                              <Typography
                                variant="subtitle2"
                              >
                                Charge per SHPT
                              </Typography>
                              <TextField
                                size="small"
                                fullWidth
                                name="rate_aea_cp_shpmt"
                                type="number"
                                variant="outlined"
                                value={values.rate_aea_cp_shpmt}
                                onChange={handleChange}
                              />
                            </Box>
                          </Box>
                        </Card>
                        <Card sx={{
                          minWidth: 500,
                          p: 3,
                          mt: 3,
                          ml: 3
                        }}
                        >
                          <Typography
                            variant="h6"
                          >
                            LSS
                          </Typography>

                          <Box sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                          }}
                          >
                            <Box
                              sx={{
                                mr: 1,
                                mt: 2,
                                maxWidth: '100%',
                                width: 150
                              }}
                            >
                              <Typography
                                variant="subtitle2"
                              >
                                Currency
                              </Typography>
                              <Autocomplete
                                autoHighlight
                                value={values.rate_lss_currency}
                                options={currency}
                                getOptionLabel={(option) => option.value}
                                onChange={(event, val) => {
                                  setFieldValue('rate_lss_currency', val);
                                }}
                                name="rate_lss_currency"
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    sx={{ width: 150 }}
                                    size="small"
                                    variant="outlined"
                                  />
                                )}
                              />
                            </Box>
                            <Box
                              sx={{
                                mr: 1,
                                mt: 2,
                                maxWidth: '100%',
                                width: 100
                              }}
                            >
                              <Typography
                                variant="subtitle2"
                              >
                                20`
                              </Typography>
                              <TextField
                                size="small"
                                fullWidth
                                name="rate_lss_20"
                                type="number"
                                variant="outlined"
                                value={values.rate_lss_20}
                                onChange={handleChange}
                              />
                            </Box>
                            <Box
                              sx={{
                                mr: 1,
                                mt: 2,
                                maxWidth: '100%',
                                width: 100
                              }}
                            >
                              <Typography
                                variant="subtitle2"
                              >
                                40`
                              </Typography>
                              <TextField
                                size="small"
                                fullWidth
                                name="rate_lss_40"
                                type="number"
                                variant="outlined"
                                value={values.rate_lss_40}
                                onChange={handleChange}
                              />
                            </Box>
                            <Box
                              sx={{
                                mr: 1,
                                mt: 2,
                                maxWidth: '100%',
                                width: 100
                              }}
                            >
                              <Typography
                                variant="subtitle2"
                              >
                                40` HC
                              </Typography>
                              <TextField
                                size="small"
                                fullWidth
                                name="rate_lss_40hc"
                                type="number"
                                variant="outlined"
                                value={values.rate_lss_40hc}
                                onChange={handleChange}
                              />
                            </Box>
                          </Box>
                        </Card>
                        <Box>
                          <Typography
                            sx={{ mt: 2 }}
                            variant="h6"
                          >
                            Remark
                          </Typography>
                          <TextField
                            size="small"
                            sx={{ width: 1055 }}
                            fullWidth
                            multiline
                            placeholder="Leave a message"
                            rows={3}
                            variant="outlined"
                            name="rate_remark"
                            value={values.rate_remark}
                            onChange={handleChange}
                          />
                        </Box>
                      </Grid>
                    </Box>
                  </Card>
                  )}
                  {currentTab === 'ContainerInformation2'
                  && (
                  <Card>
                    <CardContent>
                      <Box
                        sx={{
                          minWidth: 800,
                          p: 3
                        }}
                      >
                        <Grid width={500}>
                          <Typography
                            variant="h6"
                          >
                            Sailing
                          </Typography>
                          <Table
                            size="small"
                            sx={{ ml: -1 }}
                          >
                            <TableBody>
                              <TableRow style={{ verticalAlign: 'middle' }}>
                                <TableCell style={{ borderBottom: 'none' }}>
                                  <Typography
                                    variant="h6"
                                  >
                                    BKK:
                                  </Typography>
                                </TableCell>
                                <TableCell
                                  style={{ borderBottom: 'none' }}
                                  align="left"
                                >
                                  <TextField
                                    size="small"
                                    fullWidth
                                    name="rate_sailing_bkk"
                                    defaultValue={values.rate_sailing_bkk}
                                    onChange={handleChange}
                                    variant="outlined"
                                    sx={{ width: 900 }}
                                  />
                                </TableCell>
                              </TableRow>
                              <TableRow style={{ verticalAlign: 'middle' }}>
                                <TableCell style={{ borderBottom: 'none' }}>
                                  <Typography
                                    variant="h6"
                                  >
                                    LCB:
                                  </Typography>
                                </TableCell>
                                <TableCell
                                  style={{ borderBottom: 'none' }}
                                  align="left"
                                >
                                  <TextField
                                    size="small"
                                    fullWidth
                                    name="rate_sailing_lcb"
                                    defaultValue={values.rate_sailing_lcb}
                                    onChange={handleChange}
                                    variant="outlined"
                                    sx={{ width: 900 }}
                                  />
                                </TableCell>
                              </TableRow>
                              <TableRow style={{ verticalAlign: 'middle' }}>
                                <TableCell style={{ borderBottom: 'none' }}>
                                  <Typography
                                    variant="h6"
                                  >
                                    OTHERS:
                                  </Typography>
                                </TableCell>
                                <TableCell
                                  style={{ borderBottom: 'none' }}
                                  align="left"
                                >
                                  <TextField
                                    size="small"
                                    fullWidth
                                    name="rate_sailing_other"
                                    defaultValue={values.rate_sailing_other}
                                    onChange={handleChange}
                                    variant="outlined"
                                    sx={{ width: 900 }}
                                  />
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </Grid>
                        <Grid
                          container
                          justifyContent="space-between"
                        >
                          <Box
                            sx={{
                              alignItems: 'center',
                              display: 'flex',
                              flexWrap: 'wrap',
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
                                T/T
                              </Typography>
                              <TextField
                                size="small"
                                fullWidth
                                name="rate_tt"
                                defaultValue={values.rate_tt}
                                onChange={handleChange}
                                variant="outlined"
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
                                Route
                              </Typography>
                              <TextField
                                size="small"
                                fullWidth
                                name="rate_route"
                                variant="outlined"
                                value={values.rate_route}
                                onChange={handleChange}
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
                                T/S Port
                              </Typography>
                              <TextField
                                size="small"
                                fullWidth
                                name="rate_ts_port"
                                variant="outlined"
                                value={values.rate_ts_port}
                                onChange={handleChange}
                              />
                            </Box>
                            <Box
                              sx={{
                                m: 1,
                                maxWidth: '100%',
                                width: 850
                              }}
                            >
                              <Typography
                                variant="h6"
                              >
                                Special Container
                              </Typography>
                              <TextField
                                size="small"
                                sx={{ width: 1000 }}
                                fullWidth
                                multiline
                                placeholder="Leave a message"
                                rows={3}
                                variant="outlined"
                                name="rate_special_container"
                                defaultValue={values.rate_special_container}
                                onChange={handleChange}
                              />
                            </Box>
                          </Box>
                        </Grid>
                      </Box>
                    </CardContent>
                  </Card>
                  )}
                </Box>
              </Container>
              <Grid
                container
                justifyContent="space-between"
                spacing={3}
              >
                <Box sx={{ m: 5, ml: 7 }}>
                  Disable&nbsp;&nbsp;
                  <FormControlLabel
                    control={(
                      <Switch
                        checked={values.rate_disable}
                        value={values.rate_disable}
                        color="primary"
                        name="rate_disable"
                        onChange={handleChange}
                      />
                )}
                    label="Enable"
                  />
                </Box>
                <Box sx={{ mt: 5, mr: 3 }}>
                  <Button
                    sx={{ mr: 1, width: 150 }}
                    variant="contained"
                    color="secondary"
                    type="reset"
                    size="large"
                    onClick={() => window.location.assign('/reference-data/rate-table')}
                  >
                    CANCEL
                  </Button>
                  <Button
                    sx={{ mr: 1, width: 150 }}
                    variant="contained"
                    disabled={isSubmitting}
                    color="info"
                    size="large"
                    type="submit"
                  >
                    SAVE
                  </Button>
                </Box>
              </Grid>
            </Box>
          </form>
        )}
      </Formik>
    </Grid>
  );
};

RateTableEdit.propTypes = {
  RateTables: PropTypes.array.isRequired,
  Customer: PropTypes.array.isRequired,
  Inquiry: PropTypes.array.isRequired,
  POL: PropTypes.array.isRequired,
  POD: PropTypes.array.isRequired,
  carrier: PropTypes.array.isRequired,
  RateRoute: PropTypes.array.isRequired,
  RateTsPort: PropTypes.array.isRequired,
  Agent: PropTypes.array.isRequired
};

export default RateTableEdit;
