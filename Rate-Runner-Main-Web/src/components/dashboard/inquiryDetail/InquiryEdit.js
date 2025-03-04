import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import useSettings from '../../../hooks/useSettings';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Formik, FieldArray, useFormikContext } from 'formik';
import Moment from 'moment';
import instance from '../../../store/instance';
import toast from 'react-hot-toast';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import DatePicker from '@material-ui/lab/DatePicker';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import { Mode, Ratetype, province, Incoterms } from '../../../store/data.json';
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
  InputAdornment,
  Switch,
  TextField,
  Tab,
  Tabs,
  TableCell,
  Table,
  TableBody,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core';

const tabs = [
  { label: 'Inquiry Information', value: 'InquiryInformation' },
  { label: 'Container Information', value: 'ContainerInformation' },
  { label: 'Special Requirement', value: 'SpecialRequiment' },
  { label: 'Rate Offer', value: 'RateOffer' },
  { label: 'Agent Quote', value: 'AgentQuote' }
];

const InquiryEdit = (props) => {
  const { settings } = useSettings();
  const [currentTab, setCurrentTab] = useState('InquiryInformation');
  const { MonthlyTables, InquiryRate, Agent, Customer, Inquiry, Reinquiry, POL, POD,
    carrier, Week, location, locationTH, RateTables, AgentQuote, Competitor, ...other } = props;

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState();
  const [complete, setComplete] = useState(false);
  const [inqStatus, setInqStatus] = useState('');
  const [inqQTN, setInqQTN] = useState('');
  const [queryCustomer, setQueryCustomer] = useState('');
  const [queryPOL, setQueryPOL] = useState('');
  const [queryPOD, setQueryPOD] = useState('');
  const [queryMode, setQueryMode] = useState('');
  const [queryInqNO, setQueryInqNO] = useState('');
  const [queryCNTR, setQueryCNTR] = useState('DC');
  const [queryDate, setQueryDate] = useState(Moment(new Date()).format('YYYY-MM-DD'));
  const user = JSON.parse(window.localStorage.getItem('user'));
  const userid = user.user_id;
  const username = user.user_fullname;
  const [loadFrist, setLoadFrist] = useState(false);
  const [editable, setEditable] = useState(false);

  useEffect(() => {
    if (Inquiry.length > 0 && !loadFrist) {
      setQueryInqNO(Inquiry[0].inq_no);
      setQueryCustomer(Inquiry[0].inq_cus_id);
      setQueryPOL(Inquiry[0].inq_pol_id);
      setQueryPOD(Inquiry[0].inq_pod_id);
      setQueryMode(Inquiry[0].inq_mode);
      setQueryDate(Moment(Inquiry[0].inq_cargo_readiness).format('YYYY-MM-DD'));
      setQueryCNTR(Inquiry[0].inq_type);
      setLoadFrist(true);
    }
  }, [RateTables, queryPOL, queryCustomer, queryPOD, queryMode, queryInqNO, queryDate, queryCNTR, editable]);

  const handleClose = () => {
    setOpen(false);
    if (complete) { window.location.assign('/main/inquiry'); }
  };

  const downLoadFile = async (id, filename) => {
    const url = `agent/quote/${id}/file`;
    await instance.get(url, {
      method: 'GET',
      responseType: 'blob'
    })
      .then((res) => {
        const name = filename.split('.');
        const urlDownload = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = urlDownload;
        link.setAttribute('download', `${Date.now()}.${name[1]}`);
        document.body.appendChild(link);
        link.click();
        // const newWindow = window.open(link.click(), '_blank', 'noopener,noreferrer');
        // if (newWindow) newWindow.opener = null;
        // console.log(res);
      });
  };

  const handleTabsChange = (event, value) => {
    setCurrentTab(value);
  };
  const ControlForm = () => {
    // eslint-disable-next-line no-unused-vars
    const { values } = useFormikContext();

    useEffect(() => {
      // console.log(values);
      let checkEdit = true;
      if (Inquiry.length > 0) {
        checkEdit = (userid === Inquiry[0].inq_user_id);
      }
      // checkEdit = true;
      setEditable(checkEdit);
    });
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
            Inquiry
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
          inq_uuid: (Inquiry.length > 0) ? Inquiry[0].inq_uuid : '',
          inq_disable: (Inquiry.length > 0) ? (Inquiry[0].inq_disable !== 1) : true,
          inq_no: (Inquiry.length > 0) ? Inquiry[0].inq_no : '',
          inq_date: (Inquiry.length > 0 && Inquiry[0].inq_date) ? Moment(Inquiry[0].inq_date).utcOffset(0).format('YYYY-MM-DD HH:mm:ss') : '',
          inq_cargo_readiness: (Inquiry.length > 0 && Inquiry[0].inq_cargo_readiness) ? Moment(Inquiry[0].inq_cargo_readiness).format('YYYY-MM-DD') : Moment(new Date()).format('YYYY-MM-DD'),
          inq_status: (Inquiry.length > 0) ? Inquiry[0].inq_status : '',
          inq_rate_id: (Inquiry.length > 0) ? Inquiry[0].inq_rate_id : '',
          inq_user_id: (Inquiry.length > 0) ? Inquiry[0].inq_user_id : '',
          inq_res_actual_week_no: (Inquiry.length > 0) ? Inquiry[0].inq_res_actual_week_no : '0',
          inq_cus_id: (Inquiry.length > 0) ? { id: Inquiry[0].cus_id, value: Inquiry[0].cus_name } : { id: '', value: '', type: '' },
          inq_pol_id: (Inquiry.length > 0) ? { id: Inquiry[0].pol_port_id, value: Inquiry[0].pol_port_name } : { id: '', value: '' },
          inq_pod_id: (Inquiry.length > 0) ? { id: Inquiry[0].pod_port_id, value: Inquiry[0].pod_port_name } : { id: '', value: '' },
          user_fullname: (Inquiry.length > 0) ? Inquiry[0].user_fullname : '',
          cus_type: (Inquiry.length > 0) ? Inquiry[0].cus_type : '',
          inq_mode: (Inquiry.length > 0) ? Inquiry[0].inq_mode : '',
          inq_factory_location: (Inquiry.length > 0) ? Inquiry[0].inq_factory_location : '',
          inq_incoterms: (Inquiry.length > 0) ? Inquiry[0].inq_incoterms : '',
          inq_place_of_receipt: (Inquiry.length > 0) ? Inquiry[0].inq_place_of_receipt : '',
          inq_final_destination: (Inquiry.length > 0) ? Inquiry[0].inq_final_destination : '',
          inq_type: (Inquiry.length > 0) ? Inquiry[0].inq_type : 'DC',
          inq_qw_per_cntr: (Inquiry.length > 0 && Number(Inquiry[0].inq_qw_per_cntr) !== 0) ? Number(Inquiry[0].inq_qw_per_cntr).toFixed(2) : '',
          inq_idea_rate_per_unit: (Inquiry.length > 0 && Number(Inquiry[0].inq_idea_rate_per_unit) !== 0) ? Number(Inquiry[0].inq_idea_rate_per_unit).toFixed(2) : '',
          inq_container_20: (Inquiry.length > 0 && Number(Inquiry[0].inq_container_20) !== 0) ? Math.floor(Number(Inquiry[0].inq_container_20)) : '',
          inq_container_40: (Inquiry.length > 0 && Number(Inquiry[0].inq_container_40) !== 0) ? Math.floor(Number(Inquiry[0].inq_container_40)) : '',
          inq_container_40hc: (Inquiry.length > 0 && Number(Inquiry[0].inq_container_40hc) !== 0) ? Math.floor(Number(Inquiry[0].inq_container_40hc)) : '',
          inq_container_cbm: (Inquiry.length > 0 && Number(Inquiry[0].inq_container_cbm) !== 0) ? Number(Inquiry[0].inq_container_cbm).toFixed(3) : '',
          inq_commodity: (Inquiry.length > 0) ? Inquiry[0].inq_commodity : '',
          inq_special_container: (Inquiry.length > 0) ? Inquiry[0].inq_special_container : '',
          inq_cr_id: (Inquiry.length > 0 && Inquiry[0].cr_id) ? { id: Inquiry[0].cr_id, value: Inquiry[0].cr_name } : { id: '', value: '' },
          inq_ct_id: (Inquiry.length > 0) ? Inquiry[0].inq_ct_id : '',
          inq_freetime: (Inquiry.length > 0) ? Inquiry[0].inq_freetime : '',
          inq_other: (Inquiry.length > 0) ? Inquiry[0].inq_other : '',
          inq_pickup_location: (Inquiry.length > 0) ? Inquiry[0].inq_pickup_location : '',
          inq_agent_quote_comment: (Inquiry.length > 0) ? Inquiry[0].inq_agent_quote_comment : '',
          fc_uuid: '',
          monthly: '',
          reinq: '',
          RateTables,
          AgentQuote
        }}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          let Data;
          if (values.inq_uuid === '') {
            values.inq_date = Moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
          }
          try {
            Data = {
              inq_pol_id: values.inq_pol_id.id,
              inq_pod_id: values.inq_pod_id.id,
              inq_cus_id: values.inq_cus_id.id,
              inq_user_id: (values.inq_user_id) ? values.inq_user_id : userid,
              inq_cr_id: (values.inq_cr_id) ? values.inq_cr_id.id : '',
              inq_date: Moment(values.inq_date).format('YYYY-MM-DD HH:mm:ss'),
              inq_cus_type: values.cus_type,
              inq_mode: values.inq_mode,
              inq_factory_location: values.inq_factory_location,
              inq_incoterms: values.inq_incoterms,
              inq_place_of_receipt: values.inq_place_of_receipt,
              inq_final_destination: values.inq_final_destination,
              inq_type: values.inq_type,
              inq_cargo_readiness: Moment(values.inq_cargo_readiness).format('YYYY-MM-DD'),
              inq_qw_per_cntr: Number(values.inq_qw_per_cntr).toFixed(2),
              inq_idea_rate_per_unit: Number(values.inq_idea_rate_per_unit).toFixed(2),
              inq_container_20: Math.floor(Number(values.inq_container_20)),
              inq_container_40: Math.floor(Number(values.inq_container_40)),
              inq_container_40hc: Math.floor(Number(values.inq_container_40hc)),
              inq_container_cbm: Number(values.inq_container_cbm).toFixed(3),
              inq_commodity: values.inq_commodity,
              inq_special_container: values.inq_special_container,
              inq_freetime: values.inq_freetime,
              inq_other: values.inq_other,
              inq_res_actual_week_no: weekofyear(values.inq_cargo_readiness),
              inq_status: inqStatus,
              inq_rate_id: values.inq_rate_id,
              inq_agent_quote_comment: values.inq_agent_quote_comment,
              inq_res_quote_status: values.inq_res_quote_status,
              inq_res_comment: values.inq_res_comment,
              inq_res_reason: values.inq_res_reason,
              inq_res_describe: values.inq_res_describe,
              inq_res_ct_id_win: values.inq_res_ct_id_win,
              inq_res_ct_price: values.inq_res_ct_price,
              inq_res_loss_comment: values.inq_res_loss_comment,
              inq_quate_no: values.inq_quate_no,
              inq_quate_date: Moment(new Date()).format('YYYY-MM-DD'),
              inq_revenue: (values.inq_revenue) ? Number(values.inq_revenue).toFixed(2) : 0,
              inq_gp: (values.inq_gp) ? Number(values.inq_gp).toFixed(2) : 0,
              inq_quate_other: values.inq_quate_other,
              inq_quate_sq_other: values.inq_quate_sq_other,
              inq_quate_comment: values.inq_quate_comment,
              inq_qtn: inqQTN,
              inq_disable: (values.inq_disable) ? 0 : 1,
              inq_ct_id: values.inq_ct_id,
              inq_pickup_location: values.inq_pickup_location
            };
          } catch (err) {
            console.log(err);
          }
          let agreeform = false;

          if (values.inq_date === '' || !Moment(values.inq_date, 'YYYY-MM-DD HH:mm:ss').isValid()) {
            setMessage('Please enter Inquiry Date');
            setOpen(true);
          } else if (values.inq_pol_id.id === '') {
            setMessage('Please enter POL');
            setOpen(true);
          } else if (values.inq_pod_id.id === '') {
            setMessage('Please enter POD');
            setOpen(true);
          } else if (values.inq_cus_id.id === '') {
            setMessage('Please enter Customer');
            setOpen(true);
          } else if (values.inq_mode === '') {
            setMessage('Please enter Mode');
            setOpen(true);
          } else if (values.inq_incoterms === '') {
            setMessage('Please enter Incoterms');
            setOpen(true);
          } else if (values.inq_cargo_readiness === '') {
            setMessage('Please enter Cago readiness date');
            setOpen(true);
          } else if (values.inq_type === '') {
            setMessage('Please enter Type');
            setOpen(true);
          } else if (values.inq_commodity === '') {
            setMessage('Please enter Commodity');
            setOpen(true);
          } else if ((Number(values.inq_container_20) < 0)
            || (Number(values.inq_container_40) < 0)
            || (Number(values.inq_container_cbm) < 0)
            || (Number(values.inq_container_40hc) < 0)) {
            setMessage('Please check Container Information');
            setOpen(true);
          } else {
            agreeform = true;
            // console.log(Data, values.inq_cargo_readiness);
          }

          if (agreeform) {
            try {
              if (values.inq_uuid === '') {
                console.log('Add!!');
                await instance.post('/inquiry/', Data)
                  .then(async (res) => {
                    let lastINQ;
                    await instance.get('/inquiry?minimize=true')
                      .then((lInq) => {
                        lastINQ = lInq.data.sort((a, b) => (a.inq_no.toUpperCase() < b.inq_no.toUpperCase() ? 1 : -1));
                        lastINQ = lastINQ[0].inq_uuid;
                      });
                    // resetForm();
                    const Data2 = {
                      fc_uuid: values.fc_uuid,
                      fc_inq_uuid: lastINQ
                    };
                    if (values.fc_uuid) {
                      await instance.patch(`/forecast/${values.fc_uuid}`, Data2);
                    }
                    setStatus({ success: true });
                    setSubmitting(false);
                    setComplete(true);
                    setMessage('Complete update!');
                    setOpen(true);
                    console.log(res.data);
                  });
              } else {
                console.log('Update!!');
                if (values.inq_status !== inqStatus) {
                  await instance.patch(`/inquiry/${values.inq_uuid}/inq_status/${inqStatus}`);
                }
                /* if(values.inq_qtn!==inqQTN){
                    await instance.patch(`/inquiry/${values.inq_uuid}/inq_qtn/${inqQTN}`);
                } */
                await instance.patch(`/inquiry/${values.inq_uuid}`, Data)
                  .then((res) => {
                    // resetForm();
                    setStatus({ success: true });
                    setSubmitting(false);
                    setComplete(true);
                    setMessage('Complete update!');
                    setOpen(true);
                    console.log(res);
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
        {({ setFieldValue, handleChange, resetForm, handleSubmit, isSubmitting, values }) => (
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
                      Inquiry
                    </Typography>
                  </Grid>
                </Grid>
                <Card
                  sx={{
                    mt: 3,
                    display: 'flex',
                    flexWrap: 'wrap'
                  }}
                >
                  <CardContent>
                    <Box
                      container
                      direction="row"
                      justifyContent="flex-start"
                      alignItems="flex-start"
                      sx={{
                        display: 'flex',
                        flexWrap: 'wrap'
                      }}
                    >
                      <Grid sx={{ width: 960, mr: 2 }}>
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
                              width: 220
                            }}
                          >
                            <Typography
                              variant="h6"
                            >
                              Inquiry No.
                            </Typography>
                            <TextField
                              size="small"
                              fullWidth
                              name="inq_no"
                              value={(values.inq_no) ? values.inq_no : 'Auto Generate'}
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
                              &nbsp;Inquiry Date
                            </Typography>
                            <TextField
                              size="small"
                              fullWidth
                              name="inq_no"
                              value={(values.inq_date) ? Moment(values.inq_date).format('DD/MM/YYYY HH:mm:ss') : Moment(new Date()).format('YYYY-MM-DD HH:mm:ss')}
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
                              width: 220
                            }}
                          />
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
                              Sales
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
                        </Box>
                        <Box
                          sx={{
                            alignItems: 'center',
                            display: 'flex',
                            flexWrap: 'wrap',
                            mt: -4,
                            p: 1
                          }}
                        >
                          <Box
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
                              &nbsp;Customer
                            </Typography>
                            <Autocomplete
                              autoHighlight
                              value={values.inq_cus_id}
                              options={Customer}
                              getOptionLabel={(option) => option.value}
                              onChange={(event, val) => {
                                setFieldValue('inq_cus_id', val);

                                if (val == null) {
                                  setQueryCustomer('');
                                  setFieldValue('cus_type', '');
                                } else {
                                  setQueryCustomer(val.id);
                                  setFieldValue('cus_type', val.type);
                                }
                              }}
                              name="inq_cus_id"
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  sx={{ width: 220 }}
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
                          >
                            <Typography
                              variant="h6"
                            >
                              Customer Type
                            </Typography>
                            <TextField
                              size="small"
                              fullWidth
                              name="cus_type"
                              variant="outlined"
                              onChange={handleChange}
                              value={values.cus_type}
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
                              &nbsp;POL
                            </Typography>
                            <Autocomplete
                              autoHighlight
                              value={values.inq_pol_id}
                              options={POL}
                              getOptionLabel={(option) => option.value}
                              onChange={(event, val) => {
                                setFieldValue('inq_pol_id', val);
                                if (val == null) {
                                  setQueryPOL('');
                                } else {
                                  setQueryPOL(val.id);
                                }
                              }}
                              name="inq_pol_id"
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  sx={{ width: 220 }}
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
                              &nbsp;POD
                            </Typography>
                            <Autocomplete
                              autoHighlight
                              value={values.inq_pod_id}
                              options={POD}
                              getOptionLabel={(option) => option.value}
                              onChange={(event, val) => {
                                setFieldValue('inq_pod_id', val);
                                if (val == null) {
                                  setQueryPOD('');
                                } else {
                                  setQueryPOD(val.id);
                                }
                              }}
                              name="inq_pod_id"
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  sx={{ width: 220 }}
                                  size="small"
                                  variant="outlined"
                                />
                              )}
                              disabled={!editable}
                            />
                          </Box>
                        </Box>
                      </Grid>
                      <Card sx={{ width: 250, height: 185 }}>
                        <CardContent>
                          <Box
                            sx={{
                              ml: 1,
                              maxWidth: '100%',
                              width: 200
                            }}
                          >
                            <Typography
                              variant="h6"
                            >
                              Monthly Sales Forecast
                            </Typography>
                            <TextField
                              size="small"
                              fullWidth
                              name="monthly"
                              disabled={values.inq_uuid !== '' || !editable}
                              onChange={(val) => {
                                setFieldValue('reinq', '');
                                setFieldValue('monthly', val.target.value);
                                const dup = MonthlyTables.filter((data) => data.fc_uuid === val.target.value);
                                if (dup.length > 0) {
                                  setFieldValue('inq_mode', dup[0].fc_mode);
                                  setFieldValue('inq_factory_location', dup[0].fc_factory_location);
                                  setFieldValue('inq_incoterms', dup[0].fc_incoterms);
                                  setFieldValue('inq_place_of_receipt', dup[0].fc_place_of_receipt);
                                  setFieldValue('inq_final_destination', dup[0].fc_final_destination);
                                  setFieldValue('inq_type', dup[0].fc_type);
                                  setFieldValue('inq_cargo_readiness', dup[0].fc_cargo_readiness);
                                  setFieldValue('inq_qw_per_cntr', dup[0].fc_qw_per_cntr);
                                  setFieldValue('inq_idea_rate_per_unit', dup[0].fc_idea_rate_per_unit);
                                  setFieldValue('inq_commodity', dup[0].fc_commodity);
                                  setFieldValue('inq_container_20', dup[0].fc_container_20);
                                  setFieldValue('inq_container_40', dup[0].fc_container_40);
                                  setFieldValue('inq_container_40hc', dup[0].fc_container_40hc);
                                  setFieldValue('inq_container_cbm', dup[0].fc_container_cbm);
                                  setFieldValue('inq_special_container', dup[0].fc_special_container);
                                  setFieldValue('inq_res_actual_week_no', dup[0].fc_week_no);
                                  setFieldValue('inq_freetime', '');
                                  setFieldValue('inq_other', '');
                                  setFieldValue('inq_ct_id', null);
                                  setFieldValue('inq_cr_id', { id: '', value: '' });
                                  setFieldValue('inq_rate_id', '');
                                  setFieldValue('fc_uuid', dup[0].fc_uuid);

                                  setQueryMode(dup[0].fc_mode);
                                  setQueryDate(Moment(dup[0].fc_cago_readiness).format('YYYY-MM-DD'));
                                } else {
                                  const tempCustomer = { id: values.inq_cus_id.id, value: values.inq_cus_id.value };
                                  const tempPOL = { id: values.inq_pol_id.id, value: values.inq_pol_id.value };
                                  const tempPOD = { id: values.inq_pod_id.id, value: values.inq_pod_id.value };
                                  const tempCustomerType = values.cus_type;
                                  resetForm();
                                  setFieldValue('inq_cus_id', tempCustomer);
                                  setFieldValue('inq_pol_id', tempPOL);
                                  setFieldValue('inq_pod_id', tempPOD);
                                  setFieldValue('cus_type', tempCustomerType);
                                }
                              }}
                              select
                              SelectProps={{ native: true }}
                              variant="outlined"
                            >
                              <option
                                key=""
                                value=""
                              >
                                {' '}
                              </option>
                              {MonthlyTables
                                .sort((a, b) => (a.fc_week_no < b.fc_week_no ? 1 : -1))
                                .filter((data) => (
                                  (
                                    queryCustomer !== ''
                                    && queryPOD !== ''
                                    && queryPOL !== ''
                                  )
                                  && (data.fc_pol_id === queryPOL
                                    && data.fc_pod_id === queryPOD
                                    && data.fc_cus_id === queryCustomer
                                  )))
                                .map((obj) => ((
                                  <option
                                    key={obj.fc_uuid}
                                    value={obj.fc_uuid}
                                    selected={values.inq_uuid === obj.fc_inq_uuid}
                                  >
                                    Week No.&nbsp;
                                    {obj.fc_week_no}
                                  </option>
                                )
                                ))}
                            </TextField>
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
                              Re-Inquiry
                            </Typography>

                            <TextField
                              size="small"
                              fullWidth
                              name="reinq"
                              disabled={values.inq_uuid !== '' || !editable}
                              onChange={async (val) => {
                                setFieldValue('monthly', '');
                                setFieldValue('reinq', val.target.value);
                                let dup = null;
                                await instance.get('/inquiry/'.concat(val.target.value))
                                  .then((res) => {
                                    dup = [res.data];
                                  });
                                if (dup.length > 0) {
                                  setFieldValue('inq_mode', dup[0].inq_mode);
                                  setFieldValue('inq_factory_location', dup[0].inq_factory_location);
                                  setFieldValue('inq_incoterms', dup[0].inq_incoterms);
                                  setFieldValue('inq_place_of_receipt', dup[0].inq_place_of_receipt);
                                  setFieldValue('inq_final_destination', dup[0].inq_final_destination);
                                  setFieldValue('inq_type', dup[0].inq_type);
                                  setFieldValue('inq_cargo_readiness', dup[0].inq_cargo_readiness);
                                  setFieldValue('inq_qw_per_cntr', dup[0].inq_qw_per_cntr);
                                  setFieldValue('inq_idea_rate_per_unit', dup[0].inq_idea_rate_per_unit);
                                  setFieldValue('inq_commodity', dup[0].inq_commodity);
                                  setFieldValue('inq_container_20', dup[0].inq_container_20);
                                  setFieldValue('inq_container_40', dup[0].inq_container_40);
                                  setFieldValue('inq_container_40hc', dup[0].inq_container_40hc);
                                  setFieldValue('inq_container_cbm', dup[0].inq_container_cbm);
                                  setFieldValue('inq_special_container', dup[0].inq_special_container);
                                  // setFieldValue('inq_res_actual_week_no', dup[0].inq_res_actual_week_no);
                                  setFieldValue('inq_freetime', dup[0].inq_freetime);
                                  setFieldValue('inq_other', dup[0].inq_other);
                                  setFieldValue('inq_ct_id', dup[0].inq_ct_id);
                                  setFieldValue('inq_pickup_location', dup[0].inq_pickup_location);
                                  setFieldValue('inq_rate_id', '');
                                  setFieldValue('fc_uuid', '');

                                  setQueryMode(dup[0].inq_mode);
                                  setQueryDate(Moment(dup[0].inq_cargo_readiness).format('YYYY-MM-DD'));

                                  if (dup[0].inq_cr_id) {
                                    const inqCrName = carrier.filter((data) => data.id === dup[0].inq_cr_id);
                                    setFieldValue('inq_cr_id', { id: dup[0].inq_cr_id, value: inqCrName[0].value });
                                  }
                                } else {
                                  const tempCustomer = { id: values.inq_cus_id.id, value: values.inq_cus_id.value };
                                  const tempPOL = { id: values.inq_pol_id.id, value: values.inq_pol_id.value };
                                  const tempPOD = { id: values.inq_pod_id.id, value: values.inq_pod_id.value };
                                  const tempCustomerType = values.cus_type;
                                  resetForm();
                                  setFieldValue('inq_cus_id', tempCustomer);
                                  setFieldValue('inq_pol_id', tempPOL);
                                  setFieldValue('inq_pod_id', tempPOD);
                                  setFieldValue('cus_type', tempCustomerType);
                                }
                              }}
                              select
                              SelectProps={{ native: true }}
                              variant="outlined"
                            >
                              <option
                                key=""
                                value=""
                              >
                                {' '}
                              </option>
                              {Reinquiry
                                .sort((a, b) => (a.inq_no.toUpperCase() < b.inq_no.toUpperCase() ? 1 : -1))
                                .filter((data) => (
                                  (
                                    queryCustomer !== ''
                                    && queryPOD !== ''
                                    && queryPOL !== ''
                                  )
                                  && (data.inq_pol_id === queryPOL
                                    && data.inq_pod_id === queryPOD
                                    && data.inq_cus_id === queryCustomer)))
                                .map((obj, index) => ((index === 0)
                                  && (
                                    <option
                                      key={obj.inq_uuid}
                                      value={obj.inq_uuid}
                                      selected={values.reinq === obj.inq_uuid}
                                    >
                                      {obj.inq_no}
                                    </option>
                                  )
                                ))}
                            </TextField>
                          </Box>
                        </CardContent>
                      </Card>
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
                  {currentTab === 'InquiryInformation'
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
                                  minWidth: 960,
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
                                        width: 250
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
                                        name="inq_mode"
                                        onChange={(val) => {
                                          setFieldValue('inq_mode', val.target.value);
                                          setQueryMode(val.target.value);
                                        }}
                                        select
                                        SelectProps={{ native: true }}
                                        variant="outlined"
                                        disabled={!editable}
                                      >
                                        {Mode.map((obj) => (
                                          <option
                                            key={obj.value}
                                            value={obj.value}
                                            selected={values.inq_mode === obj.value}
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
                                        width: 250
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
                                        name="inq_factory_location"
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
                                            selected={values.inq_factory_location === obj.value}
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
                                        width: 250
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
                                        name="inq_incoterms"
                                        onChange={handleChange}
                                        select
                                        SelectProps={{ native: true }}
                                        variant="outlined"
                                        disabled={!editable}
                                      >
                                        {Incoterms.map((obj) => (
                                          <option
                                            key={obj.value}
                                            value={obj.value}
                                            selected={values.inq_incoterms === obj.value}
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
                                        width: 250
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
                                        name="inq_place_of_receipt"
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
                                            selected={values.inq_place_of_receipt === obj.id}
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
                                        width: 515
                                      }}
                                    >
                                      <Typography
                                        variant="h6"
                                      >
                                        Pickup Location
                                      </Typography>
                                      <TextField
                                        size="small"
                                        fullWidth
                                        multiline
                                        rows={8}
                                        name="inq_pickup_location"
                                        variant="outlined"
                                        onChange={handleChange}
                                        inputProps={{ maxLength: 250 }}
                                        value={values.inq_pickup_location}
                                        disabled={!editable}
                                      />
                                    </Box>
                                    <Box
                                      sx={{
                                        m: 1,
                                        maxWidth: '100%',
                                        width: 515
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
                                        multiline
                                        rows={8}
                                        name="inq_final_destination"
                                        variant="outlined"
                                        onChange={handleChange}
                                        inputProps={{ maxLength: 250 }}
                                        value={values.inq_final_destination}
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
                                  &nbsp;Container Type
                                </Typography>
                                <TextField
                                  size="small"
                                  fullWidth
                                  name="inq_type"
                                  onChange={(val) => {
                                    setFieldValue('inq_type', val.target.value);
                                    setQueryCNTR(val.target.value);
                                  }}
                                  select
                                  SelectProps={{ native: true }}
                                  variant="outlined"
                                  disabled={!editable}
                                >
                                  {Ratetype.map((obj) => (
                                    <option
                                      key={obj.value}
                                      value={obj.value}
                                      selected={values.inq_type === obj.value}
                                    >
                                      {obj.label}
                                    </option>
                                  ))}
                                </TextField>
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
                                  &nbsp;Cargo Readiness
                                </Typography>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                  <DatePicker
                                    value={values.inq_cargo_readiness}
                                    inputFormat="dd/MM/yyyy"
                                    name="inq_cargo_readiness"
                                    onChange={(date) => {
                                      setFieldValue('inq_cargo_readiness', date);
                                      setQueryDate(Moment(date).format('YYYY-MM-DD'));
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
                                  name="inq_qw_per_cntr"
                                  type="number"
                                  variant="outlined"
                                  onChange={handleChange}
                                  value={values.inq_qw_per_cntr}
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
                                  name="inq_idea_rate_per_unit"
                                  type="number"
                                  variant="outlined"
                                  onChange={handleChange}
                                  value={values.inq_idea_rate_per_unit}
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
                                      name="inq_container_20"
                                      type="number"
                                      variant="outlined"
                                      onChange={handleChange}
                                      value={values.inq_container_20}
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
                                      name="inq_container_40"
                                      type="number"
                                      variant="outlined"
                                      onChange={handleChange}
                                      value={values.inq_container_40}
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
                                      name="inq_container_40hc"
                                      type="number"
                                      variant="outlined"
                                      onChange={handleChange}
                                      value={values.inq_container_40hc}
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
                                      name="inq_container_cbm"
                                      type="number"
                                      variant="outlined"
                                      onChange={handleChange}
                                      value={values.inq_container_cbm}
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
                                <Grid sx={{
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
                                    &nbsp;Commodity
                                  </Typography>
                                </Grid>
                                <TextField
                                  sx={{ width: 520, mr: 3 }}
                                  fullWidth
                                  multiline
                                  rows={3}
                                  name="inq_commodity"
                                  variant="outlined"
                                  onChange={handleChange}
                                  value={values.inq_commodity}
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
                                  name="inq_special_container"
                                  variant="outlined"
                                  onChange={handleChange}
                                  value={values.inq_special_container}
                                  disabled={!editable}
                                />
                              </Grid>
                            </Box>
                          </Grid>
                        </Box>
                      </Card>
                    )}
                  {currentTab === 'SpecialRequiment'
                    && (
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
                                    width: 300
                                  }}
                                >
                                  <Typography
                                    variant="h6"
                                  >
                                    Freetime
                                  </Typography>
                                  <TextField
                                    size="small"
                                    fullWidth
                                    name="inq_freetime"
                                    variant="outlined"
                                    onChange={handleChange}
                                    value={values.inq_freetime}
                                    disabled={!editable}
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
                                    competitor
                                  </Typography>
                                  <TextField
                                    size="small"
                                    fullWidth
                                    name="inq_ct_id"
                                    onChange={handleChange}
                                    select
                                    SelectProps={{ native: true }}
                                    variant="outlined"
                                    disabled={!editable}
                                  >
                                    {Competitor.map((obj) => (
                                      <option
                                        key={obj.id}
                                        value={obj.id}
                                        selected={values.inq_ct_id === obj.id}
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
                                    width: 300
                                  }}
                                >
                                  <Typography
                                    variant="h6"
                                  >
                                    Current Carrier
                                  </Typography>
                                  <Autocomplete
                                    autoHighlight
                                    value={values.inq_cr_id}
                                    options={carrier}
                                    getOptionLabel={(option) => option.value}
                                    onChange={(event, val) => {
                                      setFieldValue('inq_cr_id', val);
                                    }}
                                    name="inq_cr_id"
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
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
                                    width: 850
                                  }}
                                >
                                  <Typography
                                    variant="h6"
                                  >
                                    Other/Comment
                                  </Typography>
                                  <TextField
                                    size="small"
                                    fullWidth
                                    name="inq_other"
                                    variant="outlined"
                                    onChange={handleChange}
                                    value={values.inq_other}
                                    disabled={!editable}
                                  />
                                </Box>
                              </Box>
                            </Grid>
                          </Box>
                        </CardContent>
                      </Card>
                    )}
                  {currentTab === 'RateOffer'
                    && (
                      <FieldArray
                        name="RateTables"
                        render={() => (
                          <Grid
                            container
                            spacing={2}
                            sx={{ mt: -3 }}
                          >
                            {values.RateTables.filter((data) => (
                              (
                                (data.rate_recommend === 'R'
                                  && queryMode !== ''
                                  && queryPOD !== ''
                                  && queryPOL !== ''
                                  && queryDate !== ''
                                  && queryCNTR !== ''
                                )
                                && (((data.rate_inq_no === '' || !data.rate_inq_no) && (data.rate_cus_id === '' || !data.rate_cus_id))
                                  && ((queryMode === 'Sea Import'
                                    && data.pol_port_id === queryPOL
                                    && ((Moment(queryDate).format('YYYY-MM-DD')) <= (Moment(data.rate_valid_from).format('YYYY-MM-DD'))
                                      || (Moment(queryDate).format('YYYY-MM-DD')) <= (Moment(data.rate_expired_to).format('YYYY-MM-DD')))
                                    && data.rate_type === queryCNTR
                                  )
                                    || (queryMode === 'Sea Export'
                                      && data.pod_port_id === queryPOD
                                      && ((Moment(queryDate).format('YYYY-MM-DD')) <= (Moment(data.rate_valid_from).format('YYYY-MM-DD'))
                                        || (Moment(queryDate).format('YYYY-MM-DD')) <= (Moment(data.rate_expired_to).format('YYYY-MM-DD')))
                                      && data.rate_type === queryCNTR
                                    )
                                    || (queryMode === 'Triangle'
                                      && data.pod_port_id === queryPOD
                                      && data.pol_port_id === queryPOL
                                      && ((Moment(queryDate).format('YYYY-MM-DD')) <= (Moment(data.rate_valid_from).format('YYYY-MM-DD'))
                                        || (Moment(queryDate).format('YYYY-MM-DD')) <= (Moment(data.rate_expired_to).format('YYYY-MM-DD')))
                                      && data.rate_type === queryCNTR
                                    ))
                                )
                              ) || (
                                (data.rate_inq_no !== '' && data.rate_inq_no) && data.rate_inq_no === queryInqNO
                              ) || (
                                (data.rate_cus_id !== '' && data.rate_cus_id) && data.rate_cus_id === queryCustomer && (
                                  (queryMode === 'Sea Import'
                                    && data.pol_port_id === queryPOL
                                    && ((Moment(queryDate).format('YYYY-MM-DD')) <= (Moment(data.rate_valid_from).format('YYYY-MM-DD'))
                                      || (Moment(queryDate).format('YYYY-MM-DD')) <= (Moment(data.rate_expired_to).format('YYYY-MM-DD')))
                                    && data.rate_type === queryCNTR
                                  )
                                  || (queryMode === 'Sea Export'
                                    && data.pod_port_id === queryPOD
                                    && ((Moment(queryDate).format('YYYY-MM-DD')) <= (Moment(data.rate_valid_from).format('YYYY-MM-DD'))
                                      || (Moment(queryDate).format('YYYY-MM-DD')) <= (Moment(data.rate_expired_to).format('YYYY-MM-DD')))
                                    && data.rate_type === queryCNTR
                                  )
                                  || (queryMode === 'Triangle'
                                    && data.pod_port_id === queryPOD
                                    && data.pol_port_id === queryPOL
                                    && ((Moment(queryDate).format('YYYY-MM-DD')) <= (Moment(data.rate_valid_from).format('YYYY-MM-DD'))
                                      || (Moment(queryDate).format('YYYY-MM-DD')) <= (Moment(data.rate_expired_to).format('YYYY-MM-DD')))
                                    && data.rate_type === queryCNTR
                                  )
                                )
                              ) || (
                                InquiryRate.some((item) => data.rate_id === item.rate_id)
                              )
                            ))
                              .map((rate, index) => (
                                <Grid
                                  item
                                  md="auto"
                                  sm="auto"
                                  xs="auto"
                                >
                                  <Card>
                                    <CardContent>
                                      <Box>
                                        <Table
                                          fullWidth
                                          size="small"
                                          sx={{ ml: -2, mr: -2 }}
                                        >
                                          <TableRow style={{ verticalAlign: 'middle', height: 30 }}>
                                            <TableCell style={{ borderBottom: 'none', width: 40 }}>
                                              <Typography
                                                variant="subtitle2"
                                              >
                                                POL:
                                              </Typography>
                                            </TableCell>
                                            <TableCell
                                              style={{ borderBottom: 'none' }}
                                              align="left"
                                              colspan="2"
                                            >
                                              <Typography
                                                style={{ width: 200 }}
                                                variant="body2"
                                              >
                                                {rate.pol_port_name}
                                              </Typography>
                                            </TableCell>
                                            <TableCell
                                              style={{ borderBottom: 'none' }}
                                              align="left"
                                            />
                                          </TableRow>
                                          <TableRow style={{ verticalAlign: 'middle', height: 30 }}>
                                            <TableCell style={{ borderBottom: 'none', width: 40 }}>
                                              <Typography
                                                variant="subtitle2"
                                              >
                                                POD:
                                              </Typography>
                                            </TableCell>
                                            <TableCell
                                              style={{ borderBottom: 'none' }}
                                              align="left"
                                              colspan="2"
                                            >
                                              <Typography
                                                style={{ width: 200 }}
                                                variant="body2"
                                              >
                                                {rate.pod_port_name}
                                              </Typography>
                                            </TableCell>
                                            <TableCell
                                              style={{ borderBottom: 'none' }}
                                              align="left"
                                            />
                                          </TableRow>
                                          <TableRow style={{ verticalAlign: 'middle', height: 30 }}>
                                            <TableCell style={{ borderBottom: 'none', width: 40 }}>
                                              <Typography
                                                variant="subtitle2"
                                              >
                                                Carrier:
                                              </Typography>
                                            </TableCell>
                                            <TableCell
                                              style={{ borderBottom: 'none' }}
                                              align="left"
                                              colspan="2"
                                            >
                                              <Typography
                                                style={{ width: 200 }}
                                                variant="body2"
                                              >
                                                {rate.cr_name}
                                              </Typography>
                                            </TableCell>
                                            <TableCell
                                              style={{ borderBottom: 'none' }}
                                              align="left"
                                            >
                                              <Grid sx={{ ml: -7 }}>
                                                <FormControlLabel
                                                  control={(
                                                    <Checkbox
                                                      name={`RateTables[${index}].rate_recommend`}
                                                      checked={values.inq_rate_id === rate.rate_id}
                                                      value={values.inq_rate_id === rate.rate_id}
                                                      disabled={!editable}
                                                      onChange={() => {
                                                        // console.log(values.inq_rate_id);
                                                        if (rate.rate_id === values.inq_rate_id) {
                                                          setFieldValue('inq_rate_id', '');
                                                        } else {
                                                          setFieldValue('inq_rate_id', rate.rate_id);
                                                        }
                                                      }}
                                                    />
                                                  )}
                                                  label="Select"
                                                  labelPlacement="start"
                                                />
                                              </Grid>
                                            </TableCell>
                                          </TableRow>
                                          <TableRow style={{ verticalAlign: 'middle', height: 30 }}>
                                            <TableCell style={{ borderBottom: 'none' }}>
                                              <Typography
                                                variant="subtitle2"
                                              >
                                                Agent:
                                              </Typography>
                                            </TableCell>
                                            <TableCell style={{ borderBottom: 'none' }}>
                                              <Typography
                                                variant="body2"
                                                colspan="3"
                                              >
                                                {rate.agent_name}
                                              </Typography>
                                            </TableCell>
                                          </TableRow>
                                          <TableRow style={{ verticalAlign: 'middle', height: 30 }}>
                                            <TableCell style={{ borderBottom: 'none' }}>
                                              <Typography
                                                variant="subtitle2"
                                              >
                                                ETD:
                                              </Typography>
                                            </TableCell>
                                            <TableCell
                                              colspan="3"
                                              style={{ borderBottom: 'none' }}
                                            >
                                              <Typography
                                                variant="body2"
                                                sx={{ display: 'flex', flexWrap: 'wrap' }}
                                              >
                                                {
                                                  (rate.rate_sailing_bkk && rate.rate_sailing_bkk !== '') && (
                                                    <Grid sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                                      <Grid sx={{ fontWeight: 'bold' }}>BKK:&nbsp;</Grid>
                                                      {rate.rate_sailing_bkk}
                                                      &nbsp;
                                                    </Grid>
                                                  )
                                                }
                                                {
                                                  (rate.rate_sailing_lcb && rate.rate_sailing_lcb !== '') && (
                                                    <Grid sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                                      <Grid sx={{ fontWeight: 'bold' }}>LCB:&nbsp;</Grid>
                                                      {rate.rate_sailing_lcb}
                                                      &nbsp;
                                                    </Grid>
                                                  )
                                                }
                                                {
                                                  (rate.rate_sailing_other && rate.rate_sailing_other !== '') && (
                                                    <Grid sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                                      <Grid sx={{ fontWeight: 'bold' }}>Other:&nbsp;</Grid>
                                                      {rate.rate_sailing_other}
                                                      &nbsp;
                                                    </Grid>
                                                  )
                                                }
                                              </Typography>
                                            </TableCell>
                                          </TableRow>
                                          <TableRow style={{ verticalAlign: 'middle', height: 30 }}>
                                            <TableCell style={{ borderBottom: 'none' }}>
                                              <Typography
                                                variant="subtitle2"
                                              >
                                                T/T:
                                              </Typography>
                                            </TableCell>
                                            <TableCell
                                              style={{ borderBottom: 'none', display: 'flex', flexWrap: 'wrap' }}
                                              colspan="3"
                                            >
                                              <Typography
                                                variant="body2"
                                              >
                                                {rate.rate_tt}
                                              </Typography>
                                              <Typography
                                                variant="subtitle2"
                                                sx={{ ml: 3 }}
                                              >
                                                Route:
                                              </Typography>
                                              <Typography
                                                variant="body2"
                                                sx={{ ml: 3 }}
                                              >
                                                {rate.rate_route}
                                              </Typography>
                                              <Typography
                                                variant="subtitle2"
                                                sx={{ ml: 3 }}
                                              >
                                                T/S Port:
                                              </Typography>
                                              <Typography
                                                variant="body2"
                                                sx={{ ml: 3 }}
                                              >
                                                {rate.rate_ts_port}
                                              </Typography>
                                            </TableCell>
                                          </TableRow>
                                          <TableRow style={{ verticalAlign: 'middle', height: 30 }}>
                                            <TableCell style={{ borderBottom: 'none' }}>
                                              <Typography
                                                variant="subtitle2"
                                              >
                                                Type:
                                              </Typography>
                                            </TableCell>
                                            <TableCell
                                              style={{ borderBottom: 'none' }}
                                              colspan="3"
                                            >
                                              <Typography
                                                variant="body2"
                                              >
                                                {rate.rate_type}
                                              </Typography>
                                            </TableCell>
                                          </TableRow>
                                          <TableRow style={{ verticalAlign: 'middle' }}>
                                            <TableCell
                                              style={{ borderBottom: 'none' }}
                                              colspan="4"
                                              align="left"
                                            >
                                              <Table
                                                fullWidth
                                                size="small"
                                                sx={{ mt: -2 }}
                                              >
                                                <TableHead>
                                                  <TableRow>
                                                    <TableCell />
                                                    <TableCell>
                                                      20`
                                                    </TableCell>
                                                    <TableCell>
                                                      40`
                                                    </TableCell>
                                                    <TableCell>
                                                      40` HC
                                                    </TableCell>
                                                    <TableCell>
                                                      CBM
                                                    </TableCell>
                                                    <TableCell>
                                                      SET
                                                    </TableCell>
                                                  </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                  <TableRow>
                                                    <TableCell sx={{ maxWidth: 65 }}>
                                                      <Typography
                                                        color="textPrimary"
                                                        variant="subtitle2"
                                                        sx={{ ml: -0.5 }}
                                                      >
                                                        Freight:
                                                      </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                      {rate.rate_freight_currency}
                                                      {rate.rate_freight_currency !== '' && <br />}
                                                      {(rate.rate_freight_20) ? Number(rate.rate_freight_20).toLocaleString() : ''}
                                                    </TableCell>
                                                    <TableCell>
                                                      {rate.rate_freight_currency}
                                                      {rate.rate_freight_currency !== '' && <br />}
                                                      {(rate.rate_freight_40) ? Number(rate.rate_freight_40).toLocaleString() : ''}
                                                    </TableCell>
                                                    <TableCell>
                                                      {rate.rate_freight_currency}
                                                      {rate.rate_freight_currency !== '' && <br />}
                                                      {(rate.rate_freight_40hc) ? Number(rate.rate_freight_40hc).toLocaleString() : ''}
                                                    </TableCell>
                                                    <TableCell>
                                                      {rate.rate_freight_currency}
                                                      {rate.rate_freight_currency !== '' && <br />}
                                                      {(rate.rate_freight_cbm) ? Number(rate.rate_freight_cbm).toLocaleString() : ''}
                                                    </TableCell>
                                                    <TableCell>
                                                      -
                                                    </TableCell>
                                                  </TableRow>
                                                  <TableRow>
                                                    <TableCell sx={{ maxWidth: 65 }}>
                                                      <Typography
                                                        color="textPrimary"
                                                        variant="subtitle2"
                                                        sx={{ ml: -0.5 }}
                                                      >
                                                        ISPS:
                                                      </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                      -
                                                    </TableCell>
                                                    <TableCell>
                                                      {rate.rate_isps_currency}
                                                      {rate.rate_isps_currency !== '' && <br />}
                                                      {(rate.rate_isps_cp_cntr) ? Number(rate.rate_isps_cp_cntr).toLocaleString() : ''}
                                                    </TableCell>
                                                    <TableCell>
                                                      -
                                                    </TableCell>
                                                    <TableCell>
                                                      -
                                                    </TableCell>
                                                    <TableCell>
                                                      -
                                                    </TableCell>
                                                  </TableRow>
                                                  <TableRow>
                                                    <TableCell sx={{ maxWidth: 65 }}>
                                                      <Typography
                                                        color="textPrimary"
                                                        variant="subtitle2"
                                                        sx={{ ml: -0.5 }}
                                                      >
                                                        AMS/ENS
                                                        /AFR:
                                                      </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                      -
                                                    </TableCell>
                                                    <TableCell>
                                                      -
                                                    </TableCell>
                                                    <TableCell>
                                                      -
                                                    </TableCell>
                                                    <TableCell>
                                                      -
                                                    </TableCell>
                                                    <TableCell>
                                                      {rate.rate_aea_currency}
                                                      {rate.rate_aea_currency !== '' && <br />}
                                                      {(rate.rate_aea_cp_shpmt) ? Number(rate.rate_aea_cp_shpmt).toLocaleString() : ''}
                                                    </TableCell>
                                                  </TableRow>
                                                  <TableRow>
                                                    <TableCell sx={{ maxWidth: 65 }}>
                                                      <Typography
                                                        color="textPrimary"
                                                        variant="subtitle2"
                                                        sx={{ ml: -0.5 }}
                                                      >
                                                        LSS:
                                                      </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                      {rate.rate_lss_currency}
                                                      {rate.rate_lss_currency !== '' && <br />}
                                                      {(rate.rate_lss_20) ? Number(rate.rate_lss_20).toLocaleString() : ''}
                                                    </TableCell>
                                                    <TableCell>
                                                      {rate.rate_lss_currency}
                                                      {rate.rate_lss_currency !== '' && <br />}
                                                      {(rate.rate_lss_40) ? Number(rate.rate_lss_40).toLocaleString() : ''}
                                                    </TableCell>
                                                    <TableCell>
                                                      {rate.rate_lss_currency}
                                                      {rate.rate_lss_currency !== '' && <br />}
                                                      {(rate.rate_lss_40hc) ? Number(rate.rate_lss_40hc).toLocaleString() : ''}
                                                    </TableCell>
                                                    <TableCell>
                                                      -
                                                    </TableCell>
                                                    <TableCell>
                                                      -
                                                    </TableCell>
                                                  </TableRow>
                                                </TableBody>
                                              </Table>
                                            </TableCell>
                                          </TableRow>
                                          <TableRow style={{ verticalAlign: 'middle', height: 30 }}>
                                            <TableCell style={{ borderBottom: 'none' }}>
                                              <Typography
                                                variant="subtitle2"
                                              >
                                                Remark:
                                              </Typography>
                                            </TableCell>
                                            <TableCell
                                              style={{ borderBottom: 'none' }}
                                              colspan="3"
                                            >
                                              <Typography
                                                sx={{ width: 300 }}
                                                variant="body2"
                                              >
                                                {rate.rate_remark}
                                              </Typography>
                                            </TableCell>
                                          </TableRow>
                                          <TableRow style={{ verticalAlign: 'middle', height: 30 }}>
                                            <TableCell style={{ borderBottom: 'none' }}>
                                              <Typography
                                                variant="subtitle2"
                                              >
                                                Carrier S/C:
                                              </Typography>
                                            </TableCell>
                                            <TableCell
                                              style={{ borderBottom: 'none' }}
                                              colspan="3"
                                            >
                                              <Typography
                                                sx={{ width: 300 }}
                                                variant="body2"
                                              >
                                                {rate.rate_carrier_sc}
                                              </Typography>
                                            </TableCell>
                                          </TableRow>
                                          <TableRow style={{ verticalAlign: 'middle', height: 30 }}>
                                            <TableCell style={{ borderBottom: 'none' }}>
                                              <Typography
                                                variant="subtitle2"
                                              >
                                                Validity:
                                              </Typography>
                                            </TableCell>
                                            <TableCell
                                              colspan="3"
                                              style={{ borderBottom: 'none' }}
                                            >
                                              <Typography
                                                sx={{ width: 300 }}
                                                variant="body2"
                                              >
                                                {Moment(rate.rate_valid_from).format('DD/MM/YYYY')}
                                                -
                                                {Moment(rate.rate_expired_to).format('DD/MM/YYYY')}
                                              </Typography>
                                            </TableCell>
                                          </TableRow>
                                        </Table>
                                      </Box>
                                    </CardContent>
                                  </Card>
                                </Grid>
                              ))}
                          </Grid>
                        )}
                      />
                    )}
                  {currentTab === 'AgentQuote'
                    && (
                      <FieldArray
                        name="AgentQuote"
                        render={() => (
                          <Grid
                            container
                            spacing={2}
                            sx={{ mt: -3 }}
                          >
                            {values.AgentQuote.map((agen) => (
                              <Grid
                                item
                                md={4}
                                sm={4}
                                xs={6}
                              >
                                <Card>
                                  <CardContent style={(agen.aq_select === 's') ? { backgroundColor: '#F1FFEB' } : null}>
                                    <Box>
                                      <Table
                                        size="small"
                                        sx={{ ml: -1 }}
                                      >
                                        <TableBody>
                                          <TableRow style={{ verticalAlign: 'middle', height: 30 }}>
                                            <TableCell style={{ borderBottom: 'none', width: 220 }}>
                                              <Typography
                                                variant="subtitle2"
                                              >
                                                Agent:
                                              </Typography>
                                            </TableCell>
                                            <TableCell
                                              style={{ borderBottom: 'none' }}
                                              align="left"
                                            >
                                              <Typography
                                                variant="body2"
                                              >
                                                {agen.agent_name}
                                              </Typography>
                                            </TableCell>
                                          </TableRow>
                                          <TableRow style={{ verticalAlign: 'middle', height: 30 }}>
                                            <TableCell style={{ borderBottom: 'none' }}>
                                              <Typography
                                                variant="subtitle2"
                                              >
                                                Customs Per Shipment:
                                              </Typography>
                                            </TableCell>
                                            <TableCell style={{ borderBottom: 'none' }}>
                                              <Typography
                                                variant="body2"
                                              >
                                                {agen.aq_currency_cp_shpmt}
                                                {' '}
                                                {(agen.aq_cp_shpmt) ? agen.aq_cp_shpmt.toLocaleString() : ''}
                                              </Typography>
                                            </TableCell>
                                          </TableRow>
                                          <TableRow style={{ verticalAlign: 'middle', height: 30 }}>
                                            <TableCell style={{ borderBottom: 'none' }}>
                                              <Typography
                                                variant="subtitle2"
                                              >
                                                Customs Per Container:
                                              </Typography>
                                            </TableCell>
                                            <TableCell style={{ borderBottom: 'none' }}>
                                              <Typography
                                                variant="body2"
                                              >
                                                {agen.aq_currency_cp_cntr}
                                                {' '}
                                                {(agen.aq_cp_cntr) ? agen.aq_cp_cntr.toLocaleString() : ''}
                                              </Typography>
                                            </TableCell>
                                          </TableRow>
                                          <TableRow style={{ verticalAlign: 'middle', height: 30 }}>
                                            <TableCell style={{ borderBottom: 'none' }}>
                                              <Typography
                                                variant="subtitle2"
                                              >
                                                Delivery Per Shipment:
                                              </Typography>
                                            </TableCell>
                                            <TableCell style={{ borderBottom: 'none' }}>
                                              <Typography
                                                variant="body2"
                                              >
                                                {agen.aq_currency_dp_shpt}
                                                {' '}
                                                {(agen.aq_dp_shpt) ? agen.aq_dp_shpt.toLocaleString() : ''}
                                              </Typography>
                                            </TableCell>
                                          </TableRow>
                                          <TableRow style={{ verticalAlign: 'middle', height: 30 }}>
                                            <TableCell style={{ borderBottom: 'none' }}>
                                              <Typography
                                                variant="subtitle2"
                                              >
                                                Delivery Per Container:
                                              </Typography>
                                            </TableCell>
                                            <TableCell style={{ borderBottom: 'none' }}>
                                              <Typography
                                                variant="body2"
                                              >
                                                {agen.aq_currency_dp_cntr}
                                                {' '}
                                                {(agen.aq_dp_cntr) ? agen.aq_dp_cntr.toLocaleString() : ''}
                                              </Typography>
                                            </TableCell>
                                          </TableRow>
                                          <TableRow style={{ verticalAlign: 'middle', height: 30 }}>
                                            <TableCell style={{ borderBottom: 'none' }}>
                                              <Typography
                                                variant="subtitle2"
                                              >
                                                Email:
                                              </Typography>
                                            </TableCell>
                                            <TableCell style={{ borderBottom: 'none' }}>
                                              <Typography
                                                variant="body2"
                                              >
                                                <MailOutlineIcon
                                                  fontSize="small"
                                                  onClick={() => {
                                                    downLoadFile(agen.aq_id, agen.aq_filename);
                                                  }}
                                                />
                                              </Typography>
                                            </TableCell>
                                          </TableRow>
                                        </TableBody>
                                      </Table>
                                    </Box>
                                  </CardContent>
                                </Card>
                              </Grid>
                            ))}
                            <Card sx={{ ml: 2, mt: 3, minWidth: 500, maxWidth: '100%', width: 1400 }}>
                              <CardContent>
                                <Box
                                  sx={{
                                    alignItems: 'center',
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    maxWidth: '100%',
                                    p: 1
                                  }}
                                >
                                  <Typography
                                    variant="h6"
                                  >
                                    &nbsp;Comment
                                  </Typography>
                                  <TextField
                                    fullWidth
                                    multiline
                                    name="inq_agent_quote_comment"
                                    value={values.inq_agent_quote_comment}
                                    placeholder="Leave a message"
                                    rows={3}
                                    variant="outlined"
                                    disabled
                                  />
                                </Box>
                              </CardContent>
                            </Card>
                          </Grid>
                        )}
                      />
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
                        checked={values.inq_disable}
                        value={values.inq_disable}
                        color="primary"
                        name="inq_disable"
                        onChange={handleChange}
                        disabled={!editable}
                      />
                    )}
                    label="Enable"
                  />
                </Box>
                <Box sx={{ mt: 5, mr: 3 }}>
                  <Button
                    sx={{ mr: 1, width: 150 }}
                    variant="contained"
                    color="warning"
                    size="large"
                    type="submit"
                    onClick={() => {
                      if (values.inq_status === 'waiting quotation') {
                        setInqStatus('waiting quotation');
                      } else {
                        setInqStatus('waiting sales');
                      }
                      // console.log(inqStatus);
                    }}
                    disabled={isSubmitting
                      || ((Number(values.inq_container_20) <= 0 || values.inq_container_20 === '')
                        && (Number(values.inq_container_40) <= 0 || values.inq_container_40 === '')
                        && (Number(values.inq_container_cbm) <= 0 || values.inq_container_cbm === '')
                        && (Number(values.inq_container_40hc) <= 0 || values.inq_container_40hc === ''))
                      || !editable}
                  >
                    SAVE DRAFT
                  </Button>
                  <Button
                    sx={{ mr: 1, width: 150 }}
                    variant="contained"
                    color="secondary"
                    size="large"
                    onClick={() => window.location.assign('/main/inquiry')}
                  >
                    CANCEL
                  </Button>
                  <Button
                    sx={{ mr: 6, width: 150 }}
                    variant="contained"
                    color="info"
                    size="large"
                    onClick={() => setInqStatus('waiting marketing')}
                    type="submit"
                    disabled={isSubmitting
                      || ((Number(values.inq_container_20) <= 0 || values.inq_container_20 === '')
                        && (Number(values.inq_container_40) <= 0 || values.inq_container_40 === '')
                        && (Number(values.inq_container_cbm) <= 0 || values.inq_container_cbm === '')
                        && (Number(values.inq_container_40hc) <= 0 || values.inq_container_40hc === ''))
                      || !editable}
                  >
                    SEND MKTG
                  </Button>
                  <Button
                    sx={{ width: 150 }}
                    type="submit"
                    variant="contained"
                    color="info"
                    size="large"
                    onClick={() => {
                      setInqStatus('waiting quotation');
                      setInqQTN('SEND');
                    }}
                    disabled={isSubmitting
                      || ((Number(values.inq_container_20) <= 0 || values.inq_container_20 === '')
                        && (Number(values.inq_container_40) <= 0 || values.inq_container_40 === '')
                        && (Number(values.inq_container_cbm) <= 0 || values.inq_container_cbm === '')
                        && (Number(values.inq_container_40hc) <= 0 || values.inq_container_40hc === ''))
                      || (values.inq_rate_id === '' || !values.inq_rate_id)
                      || !editable}
                  >
                    SEND QTN
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

InquiryEdit.propTypes = {
  MonthlyTables: PropTypes.array.isRequired,
  Customer: PropTypes.array.isRequired,
  Inquiry: PropTypes.array.isRequired,
  Reinquiry: PropTypes.array.isRequired,
  POL: PropTypes.array.isRequired,
  POD: PropTypes.array.isRequired,
  carrier: PropTypes.array.isRequired,
  Agent: PropTypes.array.isRequired,
  Week: PropTypes.array.isRequired,
  location: PropTypes.array.isRequired,
  locationTH: PropTypes.array.isRequired,
  RateTables: PropTypes.array.isRequired,
  AgentQuote: PropTypes.array.isRequired,
  Competitor: PropTypes.array.isRequired,
  InquiryRate: PropTypes.array.isRequired
};

export default InquiryEdit;
