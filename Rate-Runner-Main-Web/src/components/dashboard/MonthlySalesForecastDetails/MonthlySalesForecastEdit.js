import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import useSettings from '../../../hooks/useSettings';
import gtm from '../../../lib/gtm';
import PropTypes from 'prop-types';
import Moment from 'moment';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Formik, useFormikContext } from 'formik';
import useMounted from '../../../hooks/useMounted';
import instance from '../../../store/instance';
import toast from 'react-hot-toast';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import DatePicker from '@material-ui/lab/DatePicker';
import { Mode, Ratetype, province, Incoterms } from '../../../store/data.json';
import { useParams } from 'react-router-dom';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  InputAdornment,
  TextField,
  Tab,
  Tabs,
  Typography
} from '@material-ui/core';

const tabs = [
  { label: 'Inquiry Information', value: 'ForecastInformation' },
  { label: 'Container Information', value: 'ContainerInformation' }
];

const MonthlySalesForecastEdit = (props) => {
  const { settings } = useSettings();
  const [currentTab, setCurrentTab] = useState('ForecastInformation');
  const { MonthlyTables, Agent, Customer, Inquiry, POL, POD,
    carrier, MonthlyTablesAll, Week, location, locationTH, ...other } = props;
  const mounted = useMounted();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState();
  const [complete, setComplete] = useState(false);
  const user = JSON.parse(window.localStorage.getItem('user'));
  const userid = user.user_id;
  const username = user.user_fullname;
  const [queryCustomer, setQueryCustomer] = useState('');
  const [queryPOL, setQueryPOL] = useState('');
  const [queryPOD, setQueryPOD] = useState('');
  const [loadFrist, setLoadFrist] = useState(false);
  const { mode } = useParams();
  const [editable, setEditable] = useState(false);

  useEffect(() => {
    /* console.log('-------------------');
    console.log('POL:', queryPOL);
    console.log('POD:', queryPOD);
    console.log('Customer:', queryCustomer);
    console.log('-------------------'); */

    if (MonthlyTables.length > 0 && !loadFrist) {
      setQueryCustomer(MonthlyTables[0].fc_cus_id);
      setQueryPOL(MonthlyTables[0].fc_pol_id);
      setQueryPOD(MonthlyTables[0].fc_pod_id);
      setLoadFrist(true);
    }
  }, [MonthlyTablesAll, queryPOL, queryCustomer, queryPOD]);

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const handleClose = () => {
    setOpen(false);
    if (complete) { window.location.assign('/main/forecast'); }
  };
  const handleTabsChange = (event, value) => {
    setCurrentTab(value);
  };
  const ControlForm = () => {
    // eslint-disable-next-line no-unused-vars
    const { setFieldValue, values } = useFormikContext();

    useEffect(() => {
      let checkEdit = true;
      if (MonthlyTables.length > 0 && mounted.current) {
        if (((MonthlyTables[0].fc_inq_uuid && MonthlyTables[0].fc_inq_uuid !== ''))
        || (userid !== MonthlyTables[0].fc_user_id)) {
          checkEdit = false;
        }
      }
      setEditable(checkEdit);
    }, [values]);
    return null;
  };

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
            Monthly Sales Forecast
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
          fc_uuid: (MonthlyTables.length > 0) ? MonthlyTables[0].fc_uuid : '',
          fc_disable: (MonthlyTables.length > 0) ? (MonthlyTables[0].fc_disable !== 1) : true,
          fc_timestamp: (MonthlyTables.length > 0 && MonthlyTables[0].fc_timestamp) ? Moment(MonthlyTables[0].fc_timestamp).format('YYYY-MM-DD') : Moment(new Date()).format('YYYY-MM-DD'),
          fc_cargo_readiness: (MonthlyTables.length > 0 && MonthlyTables[0].fc_cargo_readiness) ? Moment(MonthlyTables[0].fc_cargo_readiness).format('YYYY-MM-DD') : Moment(new Date()).format('YYYY-MM-DD'),
          fc_week_no: (MonthlyTables.length > 0) ? MonthlyTables[0].fc_week_no : Number(Moment(new Date()).format('W')),
          fc_cus_id: (MonthlyTables.length > 0) ? { id: MonthlyTables[0].cus_id, value: MonthlyTables[0].cus_name } : { id: '', value: '' },
          fc_pol_id: (MonthlyTables.length > 0) ? { id: MonthlyTables[0].pol_port_id, value: MonthlyTables[0].pol_port_name } : { id: '', value: '' },
          fc_pod_id: (MonthlyTables.length > 0) ? { id: MonthlyTables[0].pod_port_id, value: MonthlyTables[0].pod_port_name } : { id: '', value: '' },
          fc_mode: (MonthlyTables.length > 0) ? MonthlyTables[0].fc_mode : '',
          fc_factory_location: (MonthlyTables.length > 0) ? MonthlyTables[0].fc_factory_location : '',
          fc_incoterms: (MonthlyTables.length > 0) ? MonthlyTables[0].fc_incoterms : '',
          fc_place_of_receipt: (MonthlyTables.length > 0) ? MonthlyTables[0].fc_place_of_receipt : '',
          fc_final_destination: (MonthlyTables.length > 0) ? MonthlyTables[0].fc_final_destination : '',
          fc_type: (MonthlyTables.length > 0) ? MonthlyTables[0].fc_type : 'DC',
          fc_qw_per_cntr: (MonthlyTables.length > 0 && Number(MonthlyTables[0].fc_qw_per_cntr) !== 0) ? Number(MonthlyTables[0].fc_qw_per_cntr).toFixed(2) : '',
          fc_idea_rate_per_unit: (MonthlyTables.length > 0 && Number(MonthlyTables[0].fc_idea_rate_per_unit) !== 0) ? Number(MonthlyTables[0].fc_idea_rate_per_unit).toFixed(2) : '',
          fc_container_20: (MonthlyTables.length > 0 && Number(MonthlyTables[0].fc_container_20) !== 0) ? Math.floor(Number(MonthlyTables[0].fc_container_20)) : '',
          fc_container_40: (MonthlyTables.length > 0 && Number(MonthlyTables[0].fc_container_40) !== 0) ? Math.floor(Number(MonthlyTables[0].fc_container_40)) : '',
          fc_container_40hc: (MonthlyTables.length > 0 && Number(MonthlyTables[0].fc_container_40hc) !== 0) ? Math.floor(Number(MonthlyTables[0].fc_container_40hc)) : '',
          fc_container_cbm: (MonthlyTables.length > 0 && Number(MonthlyTables[0].fc_container_cbm) !== 0) ? Number(MonthlyTables[0].fc_container_cbm).toFixed(3) : '',
          fc_commodity: (MonthlyTables.length > 0) ? MonthlyTables[0].fc_commodity : '',
          fc_revernue: (MonthlyTables.length > 0 && Number(MonthlyTables[0].fc_revernue) !== 0) ? Number(MonthlyTables[0].fc_revernue).toFixed(2) : '',
          fc_gp: (MonthlyTables.length > 0 && Number(MonthlyTables[0].fc_gp) !== 0) ? Number(MonthlyTables[0].fc_gp).toFixed(2) : '',
          fc_special_container: (MonthlyTables.length > 0) ? MonthlyTables[0].fc_special_container : '',
          user_fullname: (MonthlyTables.length > 0) ? MonthlyTables[0].user_fullname : '',
          MonthlyTables
        }}
        // eslint-disable-next-line no-unused-vars
        onSubmit={async (values, { resetForm, setErrors, setStatus, setSubmitting }) => {
          let Data;
          if (values.fc_uuid === '') {
            Data = [{
              fc_uuid: (values.fc_uuid === '') ? null : values.fc_uuid,
              fc_disable: (values.fc_disable) ? 0 : 1,
              fc_timestamp: Moment(values.fc_timestamp).format('YYYY-MM-DD'),
              fc_cargo_readiness: Moment(values.fc_cargo_readiness).format('YYYY-MM-DD'),
              fc_week_no: weekofyear(values.fc_cargo_readiness),
              fc_cus_id: values.fc_cus_id.id,
              fc_pol_id: values.fc_pol_id.id,
              fc_pod_id: values.fc_pod_id.id,
              fc_mode: values.fc_mode,
              fc_factory_location: values.fc_factory_location,
              fc_incoterms: values.fc_incoterms,
              fc_place_of_receipt: values.fc_place_of_receipt,
              fc_final_destination: values.fc_final_destination,
              fc_type: values.fc_type,
              fc_qw_per_cntr: Number(values.fc_qw_per_cntr).toFixed(2),
              fc_idea_rate_per_unit: Number(values.fc_idea_rate_per_unit).toFixed(2),
              fc_container_20: (values.fc_container_20 === '') ? 0 : Math.floor(Number(values.fc_container_20)),
              fc_container_40: (values.fc_container_40 === '') ? 0 : Math.floor(Number(values.fc_container_40)),
              fc_container_40hc: (values.fc_container_40hc === '') ? 0 : Math.floor(Number(values.fc_container_40hc)),
              fc_container_cbm: (values.fc_container_cbm === '') ? 0 : Number(values.fc_container_cbm).toFixed(2),
              fc_commodity: values.fc_commodity,
              fc_special_container: values.fc_special_container,
              fc_revernue: Number(values.fc_revernue).toFixed(2),
              fc_gp: Number(values.fc_gp).toFixed(2),
              fc_user_id: userid
            }];
          } else {
            Data = {
              fc_uuid: values.fc_uuid,
              fc_disable: (values.fc_disable) ? 0 : 1,
              fc_timestamp: Moment(values.fc_timestamp).format('YYYY-MM-DD'),
              fc_cargo_readiness: Moment(values.fc_cargo_readiness).format('YYYY-MM-DD'),
              fc_week_no: weekofyear(values.fc_cargo_readiness),
              fc_cus_id: values.fc_cus_id.id,
              fc_pol_id: values.fc_pol_id.id,
              fc_pod_id: values.fc_pod_id.id,
              fc_mode: values.fc_mode,
              fc_factory_location: values.fc_factory_location,
              fc_incoterms: values.fc_incoterms,
              fc_place_of_receipt: values.fc_place_of_receipt,
              fc_final_destination: values.fc_final_destination,
              fc_type: values.fc_type,
              fc_qw_per_cntr: (values.fc_qw_per_cntr === '') ? 0 : values.fc_qw_per_cntr,
              fc_idea_rate_per_unit: (values.fc_idea_rate_per_unit === '') ? 0 : values.fc_idea_rate_per_unit,
              fc_container_20: (values.fc_container_20 === '') ? 0 : values.fc_container_20,
              fc_container_40: (values.fc_container_40 === '') ? 0 : values.fc_container_40,
              fc_container_40hc: (values.fc_container_40hc === '') ? 0 : values.fc_container_40hc,
              fc_container_cbm: (values.fc_container_cbm === '') ? 0 : values.fc_container_cbm,
              fc_commodity: values.fc_commodity,
              fc_special_container: values.fc_special_container,
              fc_revernue: values.fc_revernue,
              fc_gp: values.fc_gp,
            };
          }

          let agreeform = false;
          if (values.fc_timestamp === '' || !Moment(values.fc_timestamp, 'YYYY-MM-DD').isValid()) {
            setMessage('Please enter Monthly Sales Forecast Date');
            setOpen(true);
          } else if (values.fc_pol_id.id === '') {
            setMessage('Please enter POL');
            setOpen(true);
          } else if (values.fc_pod_id.id === '') {
            setMessage('Please enter POD');
            setOpen(true);
          } else if (values.fc_cus_id.id === '') {
            setMessage('Please enter Customer');
            setOpen(true);
          } else if (values.fc_mode === '') {
            setMessage('Please enter Mode');
            setOpen(true);
          } else if (values.fc_incoterms === '') {
            setMessage('Please enter Incoterms');
            setOpen(true);
          } else if (values.fc_type === '') {
            setMessage('Please enter Type');
            setOpen(true);
          } else if (values.fc_cargo_readiness === '') {
            setMessage('Please enter Cargo readiness date');
            setOpen(true);
          } else if (Number(values.fc_revernue) === 0) {
            setMessage('Please enter Revenue');
            setOpen(true);
          } else if (Number(values.fc_gp) === 0) {
            setMessage('Please enter GP');
            setOpen(true);
          } else if (Number(values.fc_commodity) === 0) {
            setMessage('Please enter Commodity');
            setOpen(true);
          } else if ((Number(values.fc_container_20) < 0)
          || (Number(values.fc_container_40) < 0)
          || (Number(values.fc_container_cbm) < 0)
          || (Number(values.fc_container_40hc) < 0)) {
            setMessage('Please check Container Information');
            setOpen(true);
          } else {
            agreeform = true;
          }

          // console.log(Data);
          if (agreeform) {
            try {
              if (values.fc_uuid === '') {
                console.log('Monthly Sales Forecast added!');
                await instance.post('/forecast', Data)
                  .then((res) => {
                  // resetForm();
                    setStatus({ success: true });
                    setSubmitting(false);
                    setComplete(true);
                    setMessage('Complete form');
                    setOpen(true);
                    console.log(res, Data);
                  });
              } else {
                console.log('Monthly Sales Forecast updated!');
                await instance.patch(`/forecast/${values.fc_uuid}`, Data)
                  .then((res) => {
                    // resetForm();
                    setStatus({ success: true });
                    setSubmitting(false);
                    setComplete(true);
                    setMessage('Complete form');
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

        {({ // eslint-disable-next-line no-unused-vars
          setFieldValue, handleChange, resetForm, handleSubmit, isSubmitting, values }) => (
            <form
              onSubmit={handleSubmit}
              {...other}
            >
              <ControlForm />
              <Helmet>
                <title>WICE Rate Runner</title>
              </Helmet>
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
                        Monthly Sales Forecast
                      </Typography>
                    </Grid>
                  </Grid>
                  <Card sx={{ mt: 3 }}>
                    <CardContent>
                      <Box
                        sx={{
                          alignItems: 'center',
                          display: 'flex',
                          flexWrap: 'wrap',
                          m: -1,
                          mt: -3,
                          p: 2,
                          height: 80
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
                          &nbsp;Date
                          </Typography>
                          {/* <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                              value={values.fc_timestamp}
                              inputFormat="dd/MM/yyyy"
                              name="fc_timestamp"
                              onChange={(date) => setFieldValue('fc_timestamp', date)}
                              renderInput={(params) => (
                                <TextField
                                  size="small"
                                  {...params}
                                  helperText=""
                                  sx={{ width: 300 }}
                                />
                              )}
                              disabled={!editable}
                            />
                              </LocalizationProvider> */}
                          <TextField
                            size="small"
                            fullWidth
                            name="fc_timestamp"
                            value={(values.fc_timestamp) ? Moment(values.fc_timestamp).format('DD/MM/YYYY') : Moment(new Date()).format('YYYY-MM-DD')}
                            variant="outlined"
                            onChange={handleChange}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment />
                              ),
                              style: {
                                backgroundColor: '#F5F5F5'
                              },
                              readOnly: true
                            }}
                            disabled={!editable}
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
                                  &nbsp;Sales
                          </Typography>
                          <TextField
                            size="small"
                            fullWidth
                            name="InquiryNumber"
                            read-only
                            InputProps={{
                              startAdornment: (
                                <InputAdornment />
                              ),
                              style: {
                                backgroundColor: '#F5F5F5'
                              },
                              readOnly: true
                            }}
                            value={(values.user_fullname) ? values.user_fullname : username}
                            variant="outlined"
                            disabled={!editable}
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
                                  &nbsp;Customer
                          </Typography>
                          <Autocomplete
                            autoHighlight
                            value={values.fc_cus_id}
                            options={Customer}
                            getOptionLabel={(option) => option.value}
                            onChange={(event, val) => {
                              setFieldValue('fc_cus_id', val);
                              if (val == null) {
                                setQueryCustomer('');
                              } else {
                                setQueryCustomer(val.id);
                              }
                            }}
                            name="fc_cus_id"
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                size="small"
                                sx={{ width: 300 }}
                                variant="outlined"
                              />
                            )}
                            disabled={!editable}
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
                      </Box>
                      <Box
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
                            value={values.fc_pol_id}
                            options={POL}
                            getOptionLabel={(option) => option.value}
                            onChange={(event, val) => {
                              setFieldValue('fc_pol_id', val);
                              if (val == null) {
                                setQueryPOL('');
                              } else {
                                setQueryPOL(val.id);
                              }
                            }}
                            name="fc_pol_id"
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                sx={{ width: 300 }}
                                size="small"
                                variant="outlined"
                              />
                            )}
                            disabled={!editable}
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
                            value={values.fc_pod_id}
                            options={POD}
                            getOptionLabel={(option) => option.value}
                            onChange={(event, val) => {
                              setFieldValue('fc_pod_id', val);
                              if (val == null) {
                                setQueryPOD('');
                              } else {
                                setQueryPOD(val.id);
                              }
                            }}
                            name="fc_pod_id"
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                sx={{ width: 300 }}
                                size="small"
                                variant="outlined"
                              />
                            )}
                            disabled={!editable}
                          />
                        </Box>
                        <Box
                          sx={{
                            m: 1,
                            maxWidth: '100%',
                            width: 220
                          }}
                          display="none"
                        >
                          <Typography
                            variant="h6"
                          >
                            Last Forecast
                          </Typography>
                          <TextField
                            size="small"
                            fullWidth
                            name="Re_fc"
                            onChange={(val) => {
                              const dup = MonthlyTablesAll.filter((data) => data.fc_uuid === val.target.value);
                              setFieldValue('fc_mode', dup[0].fc_mode);
                              setFieldValue('fc_location', dup[0].fc_factory_location);
                              setFieldValue('fc_incoterms', dup[0].fc_incoterms);
                              setFieldValue('fc_place_of_receipt', dup[0].fc_place_of_receipt);
                              setFieldValue('fc_final_destination', dup[0].fc_final_destination);
                              setFieldValue('fc_factory_location', dup[0].fc_factory_location);
                              setFieldValue('fc_type', dup[0].fc_type);
                              setFieldValue('fc_cargo_readiness', dup[0].fc_cargo_readiness);
                              setFieldValue('fc_qw_per_cntr', dup[0].fc_qw_per_cntr);
                              setFieldValue('fc_idea_rate_per_unit', dup[0].fc_idea_rate_per_unit);
                              setFieldValue('fc_commodity', dup[0].fc_commodity);
                              setFieldValue('fc_container_20', dup[0].fc_container_20);
                              setFieldValue('fc_container_40', dup[0].fc_container_40);
                              setFieldValue('fc_container_40hc', dup[0].fc_container_40hc);
                              setFieldValue('fc_container_cbm', dup[0].fc_container_cbm);
                              setFieldValue('fc_special_container', dup[0].fc_special_container);
                              setFieldValue('fc_revernue', dup[0].fc_revernue);
                              setFieldValue('fc_gp', dup[0].fc_gp);
                            }}
                            select
                            SelectProps={{ native: true }}
                            variant="outlined"
                            disabled={!editable}
                          >
                            <option
                              key=""
                              value=""
                            >
                              {' '}
                            </option>
                            {MonthlyTablesAll
                              .sort((a, b) => (a.fc_week_no < b.fc_week_no ? 1 : -1))
                              .filter((data) => (
                                (
                                  queryCustomer !== ''
                                    && queryPOD !== ''
                                    && queryPOL !== ''
                                )
                                && (data.fc_pol_id === queryPOL
                                    && data.fc_pod_id === queryPOD
                                    && data.fc_cus_id === queryCustomer)))
                              .map((obj, index) => ((index === 0)
                                    && (
                                    <option
                                      key={obj.fc_uuid}
                                      value={obj.fc_uuid}
                                    >
                                      Week No.&nbsp;
                                      {obj.fc_week_no}
                                    </option>
                                    )
                              ))}
                          </TextField>
                        </Box>
                      </Box>
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
                    {currentTab === 'ForecastInformation'
                    && (
                    <Grid
                      container
                      spacing={3}
                      {...props}
                    >
                      <Grid
                        item
                        lg={12}
                        md={6}
                        xl={9}
                        xs={12}
                      >
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
                                justifyContent="space-between"
                              >
                                <Box
                                  sx={{
                                    alignItems: 'center',
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    ml: -2,
                                    mt: -3
                                  }}
                                >
                                  <Box
                                    sx={{
                                      m: 1,
                                      maxWidth: '100%',
                                      display: 'flex',
                                      flexWrap: 'wrap',
                                      width: 300
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
                                  &nbsp;Mode
                                    </Typography>
                                    <TextField
                                      size="small"
                                      fullWidth
                                      name="fc_mode"
                                      onChange={handleChange}
                                      select
                                      defaultValue={values.fc_mode}
                                      SelectProps={{ native: true }}
                                      variant="outlined"
                                      disabled={!editable}
                                    >
                                      {Mode.map((obj) => (
                                        <option
                                          key={obj.value}
                                          value={obj.value}
                                          selected={values.fc_mode === obj.value}
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
                                      width: 550
                                    }}
                                  >
                                    <Typography
                                      variant="h6"
                                    >
                                      Factory Location
                                    </Typography>
                                    <TextField
                                      size="small"
                                      fullWidth
                                      name="fc_factory_location"
                                      onChange={handleChange}
                                      select
                                      SelectProps={{ native: true }}
                                      variant="outlined"
                                      disabled={!editable}
                                    >
                                      {province.map((obj) => (
                                        <option
                                          key={obj.value}
                                          value={obj.value}
                                          selected={values.fc_factory_location === obj.value}
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
                                      display: 'flex',
                                      flexWrap: 'wrap',
                                      width: 300
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
                                  &nbsp;Incoterms
                                    </Typography>
                                    <TextField
                                      size="small"
                                      fullWidth
                                      name="fc_incoterms"
                                      onChange={handleChange}
                                      select
                                      defaultValue={values.fc_incoterms}
                                      SelectProps={{ native: true }}
                                      variant="outlined"
                                      disabled={!editable}
                                    >
                                      {Incoterms.map((obj) => (
                                        <option
                                          key={obj.value}
                                          value={obj.value}
                                          selected={values.fc_incoterms === obj.value}
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
                                      Place of Receipt
                                    </Typography>
                                    <TextField
                                      size="small"
                                      fullWidth
                                      name="fc_place_of_receipt"
                                      onChange={handleChange}
                                      select
                                      SelectProps={{ native: true }}
                                      variant="outlined"
                                      disabled={!editable}
                                    >
                                      {locationTH.map((obj) => (
                                        <option
                                          key={obj.id}
                                          value={obj.id}
                                          selected={values.fc_place_of_receipt === obj.id}
                                        >
                                          {obj.value}
                                        </option>
                                      ))}
                                    </TextField>
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
                                      Final Destination
                                    </Typography>
                                    <TextField
                                      size="small"
                                      fullWidth
                                      name="fc_final_destination"
                                      variant="outlined"
                                      onChange={handleChange}
                                      value={values.fc_final_destination}
                                      disabled={!editable}
                                    />
                                  </Box>
                                </Box>
                              </Grid>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
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
                              width: 600
                            }}
                          >
                            <Box
                              sx={{
                                m: 1,
                                width: 150,
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
                                  &nbsp;Type
                              </Typography>
                              <TextField
                                size="small"
                                fullWidth
                                name="fc_type"
                                onChange={handleChange}
                                select
                                SelectProps={{ native: true }}
                                variant="outlined"
                                disabled={!editable}
                              >
                                {Ratetype.map((obj) => (
                                  <option
                                    key={obj.value}
                                    value={obj.value}
                                    selected={values.fc_type === obj.value}
                                  >
                                    {obj.label}
                                  </option>
                                ))}
                              </TextField>
                            </Box>
                            <Box
                              sx={{
                                m: 1,
                                width: 180,
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
                                  &nbsp;Cargo Readiness
                              </Typography>
                              <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                  value={values.fc_cargo_readiness}
                                  inputFormat="dd/MM/yyyy"
                                  name="fc_cargo_readiness"
                                  onChange={(date) => {
                                    setFieldValue('fc_cargo_readiness', date);
                                    setFieldValue('fc_week_no', weekofyear(date));
                                  }}
                                  renderInput={(params) => (
                                    <TextField
                                      size="small"
                                      {...params}
                                      helperText=""
                                    />
                                  )}
                                  disabled={!editable}
                                />
                              </LocalizationProvider>
                            </Box>
                            <Box
                              sx={{
                                m: 1,
                                maxWidth: '100%',
                                width: 150,
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
                          &nbsp;Week No.
                              </Typography>
                              <TextField
                                size="small"
                                fullWidth
                                name="fc_week_no"
                                type="number"
                                variant="outlined"
                                onChange={handleChange}
                                value={weekofyear(values.fc_cargo_readiness)}
                                disabled={!editable}
                                read-only
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment />
                                  ),
                                  style: {
                                    backgroundColor: '#F5F5F5'
                                  },
                                  readOnly: true
                                }}
                              />
                            </Box>
                            <Box
                              sx={{
                                m: 1,
                                width: 250
                              }}
                            >
                              <Typography
                                variant="h6"
                              >
                                GW Per CNTR (Kg)
                              </Typography>
                              <TextField
                                size="small"
                                fullWidth
                                name="fc_qw_per_cntr"
                                type="number"
                                variant="outlined"
                                onChange={handleChange}
                                value={values.fc_qw_per_cntr}
                                disabled={!editable}
                              />
                            </Box>
                            <Box
                              sx={{
                                m: 1,
                                width: 250
                              }}
                            >
                              <Typography
                                variant="h6"
                              >
                                Idea Rate per Unit
                              </Typography>
                              <TextField
                                size="small"
                                fullWidth
                                name="fc_idea_rate_per_unit"
                                type="number"
                                variant="outlined"
                                onChange={handleChange}
                                value={values.fc_idea_rate_per_unit}
                                disabled={!editable}
                              />
                            </Box>
                          </Box>
                          <Box>
                            <Card sx={{
                              minWidth: 500,
                              p: 3,
                              ml: -7
                            }}
                            >
                              <Grid sx={{
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
                                  &nbsp;Containner
                                </Typography>
                              </Grid>
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
                                    name="fc_container_20"
                                    type="number"
                                    variant="outlined"
                                    onChange={handleChange}
                                    value={values.fc_container_20}
                                    disabled={!editable}
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
                                    name="fc_container_40"
                                    type="number"
                                    variant="outlined"
                                    onChange={handleChange}
                                    value={values.fc_container_40}
                                    disabled={!editable}
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
                                    name="fc_container_40hc"
                                    type="number"
                                    variant="outlined"
                                    onChange={handleChange}
                                    value={values.fc_container_40hc}
                                    disabled={!editable}
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
                                    name="fc_container_cbm"
                                    type="number"
                                    variant="outlined"
                                    onChange={handleChange}
                                    value={values.fc_container_cbm}
                                    disabled={!editable}
                                  />
                                </Box>
                              </Box>
                            </Card>
                          </Box>
                          <Box
                            container
                            direction="row"
                            justifyContent="space-between"
                            alignItems="flex-start"
                            sx={{
                              display: 'flex',
                              flexWrap: 'wrap',
                              ml: 1
                            }}
                          >
                            <Grid>
                              <Grid sx={{ display: 'flex',
                                flexWrap: 'wrap' }}
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
                              &nbsp;Commodity
                                </Typography>
                              </Grid>
                              <TextField
                                sx={{ width: 520, mr: 3 }}
                                fullWidth
                                multiline
                                rows={3}
                                name="fc_commodity"
                                variant="outlined"
                                onChange={handleChange}
                                value={values.fc_commodity}
                                disabled={!editable}
                              />
                            </Grid>
                            <Grid>
                              <Typography
                                variant="h6"
                              >
                                Special Container
                              </Typography>
                              <TextField
                                sx={{ width: 500, ml: -1 }}
                                fullWidth
                                multiline
                                rows={3}
                                name="fc_special_container"
                                variant="outlined"
                                onChange={handleChange}
                                value={values.fc_special_container}
                                disabled={!editable}
                              />
                            </Grid>
                          </Box>
                        </Grid>
                        <Box
                          container
                          direction="row"
                          justifyContent="flex-start"
                          alignItems="flex-start"
                          sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                          }}
                        >
                          <Box
                            sx={{
                              m: 1,
                              width: 250,
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
                                  &nbsp;Revenue
                            </Typography>
                            <TextField
                              size="small"
                              fullWidth
                              name="fc_revernue"
                              type="number"
                              variant="outlined"
                              onChange={handleChange}
                              value={values.fc_revernue}
                              disabled={!editable}
                            />
                          </Box>
                          <Box
                            sx={{
                              m: 1,
                              width: 250,
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
                                  &nbsp;GP
                            </Typography>
                            <TextField
                              size="small"
                              fullWidth
                              name="fc_gp"
                              type="number"
                              variant="outlined"
                              onChange={handleChange}
                              value={values.fc_gp}
                              disabled={!editable}
                            />
                          </Box>
                        </Box>
                      </Box>
                    </Card>
                    )}
                  </Box>
                </Container>
                <Grid
                  container
                  justifyContent="space-between"
                  spacing={3}
                >
                  <Box sx={{ m: 5, ml: 7 }} />
                  <Box
                    sx={{ mt: 5, mr: 3 }}
                    display={(mode === 'view') ? 'none' : 'block'}
                  >
                    <Button
                      sx={{ mr: 1, width: 150 }}
                      variant="contained"
                      color="secondary"
                      type="reset"
                      size="large"
                      onClick={() => window.location.assign('/main/forecast')}
                    >
                      CANCEL
                    </Button>
                    <Button
                      sx={{ mr: 1, width: 150 }}
                      variant="contained"
                      disabled={isSubmitting
                        || ((Number(values.fc_container_20) <= 0 || values.fc_container_20 === '')
                        && (Number(values.fc_container_40) <= 0 || values.fc_container_40 === '')
                        && (Number(values.fc_container_cbm) <= 0 || values.fc_container_cbm === '')
                        && (Number(values.fc_container_40hc) <= 0 || values.fc_container_40hc === ''))
                        || !editable}
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
    </>
  );
};

MonthlySalesForecastEdit.propTypes = {
  MonthlyTables: PropTypes.array.isRequired,
  Customer: PropTypes.array.isRequired,
  Inquiry: PropTypes.array.isRequired,
  POL: PropTypes.array.isRequired,
  POD: PropTypes.array.isRequired,
  carrier: PropTypes.array.isRequired,
  Agent: PropTypes.array.isRequired,
  MonthlyTablesAll: PropTypes.array.isRequired,
  Week: PropTypes.array.isRequired,
  location: PropTypes.array.isRequired,
  locationTH: PropTypes.array.isRequired
};

export default MonthlySalesForecastEdit;
