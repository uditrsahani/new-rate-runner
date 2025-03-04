import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Formik, FieldArray, useFormikContext } from 'formik';
import instance from '../../../store/instance';
import toast from 'react-hot-toast';
import Moment from 'moment';
import { Link as RouterLink } from 'react-router-dom';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { AttachEmail } from '../calendar';
import { useDispatch, useSelector } from '../../../store';
import useSettings from '../../../hooks/useSettings';
import FindInPageIcon from '@material-ui/icons/FindInPage';
import PropTypes from 'prop-types';
import { closeModal, openModal } from '../../../slices/calendar';
import Scrollbar from '../../Scrollbar';
import QuillEditor from '../../QuillEditor';
import { currency } from '../../../store/data.json';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  Input,
  Tab,
  Tabs,
  Typography,
  TableCell,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TextField
} from '@material-ui/core';

const selectedEventSelector = (state) => {
  const { events, selectedEventId } = state.calendar;

  if (selectedEventId) {
    return events.find((_event) => _event.id === selectedEventId);
  }

  return null;
};

const tabs = [
  { label: 'Rate Offer', value: 'RateOffer' },
  { label: 'Send Email', value: 'SpecialRequiment' },
  { label: 'Agent Quote', value: 'AgentQuote' }
];

const RecommendEdit = (props) => {
  const { Inquiry, InquiryRate, Customer, Sales, RateTables, AgentQuote, Agent, MailHistory, Contact, ...other } = props;
  const { settings } = useSettings();
  const dispatch = useDispatch();
  const [currentTab, setCurrentTab] = useState('RateOffer');

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState();
  const [complete, setComplete] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [complete2, setComplete2] = useState(false);
  const [inqStatus, setInqStatus] = useState('-');
  const { isModalOpen, selectedRange } = useSelector((state) => state.calendar);
  const selectedEvent = useSelector(selectedEventSelector);
  const user = JSON.parse(window.localStorage.getItem('user'));
  const userfullname = user.user_fullname;
  const userphone = user.user_phone;
  const usermobile = user.user_mobile;
  const usermail = user.user_mail;
  const [date1, setDate1] = useState('');
  const [date2, setDate2] = useState('');
  const [emails, setEmails] = useState([]);
  const [contactList, setContactList] = useState([]);
  const [FormID, setFormID] = useState([]);
  const [mailContent, setMailContent] = useState('');
  const [mailSubject, setMailSubject] = useState('');

  const handleMailContent = (value) => {
    setMailContent(value);
  };
  const handleSelect = (value) => {
    const tempContactList = contactList.map((data) => {
      if (data.ct_uuid === value) {
        data.use = true;
      }
      return data;
    });
    setContactList(tempContactList);
    // console.log(tempContactList);
  };

  const handleClose = () => {
    setOpen(false);
    if (complete) { window.location.assign('/main/recommend'); }
    if (complete2) { window.location.assign(`/main/Recommend/details/${Inquiry[0].inq_uuid}`); }
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

  useEffect(() => {
    if (mailContent === '' && Inquiry.length > 0) {
      const exampleMailSubject = `WICE Inquiry under ${(Inquiry[0].inq_incoterms) ? Inquiry[0].inq_incoterms : '-'} from ${(Inquiry[0].pol_port_name) ? Inquiry[0].pol_port_name : '-'} to ${(Inquiry[0].pod_port_name) ? Inquiry[0].pod_port_name : '-'}, (${(Inquiry[0].inq_no) ? Inquiry[0].inq_no : '-'})`;
      const exampleMail = `<p>Dear sirs,</p>
      <p><br></p>
      <p>Good day to you.</p>
      <p><br></p>
      <p>We would ask you to provide cost for our inquiry as below details:</p>
      <p><br></p>
      <p>Term:&nbsp;${(Inquiry[0].inq_incoterms) ? Inquiry[0].inq_incoterms : '-'}</p>
      <p>Place Of Loading (POL):&nbsp;${(Inquiry[0].pol_port_name) ? Inquiry[0].pol_port_name : '-'}</p>
      <p>Place Of Destination (POD):&nbsp;${(Inquiry[0].pod_port_name) ? Inquiry[0].pod_port_name : '-'}</p>
      <p>Pick-up Location:&nbsp;${(Inquiry[0].inq_pickup_location) ? Inquiry[0].inq_pickup_location : '-'}</p>
      <p>Volume:&nbsp;
      ${((Inquiry[0].inq_container_20) && Number(Inquiry[0].inq_container_20) !== 0) ? ` 20': ${Number(Inquiry[0].inq_container_20).toLocaleString(navigator.language, { minimumFractionDigits: 0 })} ` : ''}
      ${((Inquiry[0].inq_container_40) && Number(Inquiry[0].inq_container_40) !== 0) ? ` 40': ${Number(Inquiry[0].inq_container_40).toLocaleString(navigator.language, { minimumFractionDigits: 0 })} ` : ''}
      ${((Inquiry[0].inq_container_40hc) && Number(Inquiry[0].inq_container_40hc) !== 0) ? ` 40'hc: ${Number(Inquiry[0].inq_container_40hc).toLocaleString(navigator.language, { minimumFractionDigits: 0 })} ` : ''}
      ${((Inquiry[0].inq_container_cbm) && Number(Inquiry[0].inq_container_cbm) !== 0) ? ` CBM: ${Number(Inquiry[0].inq_container_cbm).toLocaleString(navigator.language, { minimumFractionDigits: 3 })} ` : ''}
      </p>
      <p>Commodity:&nbsp;${(Inquiry[0].inq_commodity) ? Inquiry[0].inq_commodity : '-'}</p>
      <p>GW Per CNTR (Kg):&nbsp;${(Inquiry[0].inq_qw_per_cntr) ? Inquiry[0].inq_qw_per_cntr : '-'}</p>
      <p>Remark:&nbsp;${(Inquiry[0].inq_other) ? Inquiry[0].inq_other : '-'}</p>
      <p><br></p>
      <p>Best Regards</p>
      <p><br></p>
      <p>${Inquiry[0].userfullname}&nbsp;|&nbsp;Marketing&nbsp;|&nbsp;Sales&nbsp;&amp;&nbsp;Marketing</p>
      <p>Tel :&nbsp;${((userphone)) ? `${userphone} / ` : '-'}&nbsp;| Mobile :&nbsp;${((usermobile)) ? `${usermobile}` : '-'}&nbsp;| E-mail :&nbsp;${((usermail)) ? `${usermail}` : '-'}</p>
      <p>WICE Logistics PCL</p>`;
      setMailContent(exampleMail);
      setMailSubject(exampleMailSubject);
    }
  }, [Inquiry]);

  const handleAddClick = () => {
    dispatch(openModal());
  };

  const handleTabsChange = (event, value) => {
    setCurrentTab(value);
  };
  const ControlForm = () => {
    // eslint-disable-next-line no-unused-vars
    const { values } = useFormikContext();

    useEffect(() => {
      if (Inquiry.length > 0) {
        setDate1(Moment(Inquiry[0].inq_date).format('DD/MM/YYYY'));
        setDate2(Moment(Inquiry[0].inq_cargo_readiness).format('DD/MM/YYYY'));
      }
    }, [Inquiry]);
    return null;
  };
  const handleModalClose = () => {
    dispatch(closeModal());
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
            Recommend
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
          inq_no: (Inquiry.length > 0) ? Inquiry[0].inq_no : '',
          inq_status: (Inquiry.length > 0) ? Inquiry[0].inq_status : '',
          inq_date: (Inquiry.length > 0) ? Moment(Inquiry.inq_date).format('DD/MM/YYYY') : '',
          inq_cargo_readiness: (Inquiry.length > 0) ? Moment(Inquiry.inq_cargo_readiness).format('DD/MM/YYYY') : '',
          user_id: (Sales.length > 0) ? Sales[0].user_fullname : '',
          inq_user_id: '',
          cus_id: (Customer.length > 0) ? Customer[0].cus_name : '',
          inq_disable: (Inquiry.length > 0) ? Inquiry[0].inq_disable !== 1 : '',
          inq_agent_quote_comment: (Inquiry.length > 0) ? Inquiry[0].inq_agent_quote_comment : '',
          pol_port_name: (Inquiry.length > 0) ? Inquiry[0].pol_port_name : '',
          pod_port_name: (Inquiry.length > 0) ? Inquiry[0].pod_port_name : '',
          inq_incoterms: (Inquiry.length > 0) ? Inquiry[0].inq_incoterms : '',
          inq_pickup_location: (Inquiry.length > 0) ? Inquiry[0].inq_pickup_location : '',
          inq_other: (Inquiry.length > 0) ? Inquiry[0].inq_other : '',
          inq_special_container: (Inquiry.length > 0) ? Inquiry[0].inq_special_container : '',
          inq_container_20: (Inquiry.length > 0) ? Inquiry[0].inq_container_20 : '',
          inq_container_40: (Inquiry.length > 0) ? Inquiry[0].inq_container_40 : '',
          inq_container_40hc: (Inquiry.length > 0) ? Inquiry[0].inq_container_40hc : '',
          inq_container_cbm: (Inquiry.length > 0) ? Inquiry[0].inq_container_cbm : '',
          inq_commodity: (Inquiry.length > 0) ? Inquiry[0].inq_commodity : '',
          inq_type: (Inquiry.length > 0) ? Inquiry[0].inq_type : '',
          inq_qw_per_cntr: (Inquiry.length > 0) ? Inquiry[0].inq_qw_per_cntr : '',
          RateTables,
          AgentQuote
        }}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          const Data = {
            inq_disable: (values.inq_disable) ? 0 : 1,
            inq_agent_quote_comment: values.inq_agent_quote_comment,
            inq_status: inqStatus
          };
          let agreeform = false;
          if (values.inq_uuid === '') {
            setMessage('Missing Inquiry data');
            setOpen(true);
          } else {
            agreeform = true;
          }

          if (agreeform) {
            try {
              values.RateTables.map(async (rate) => {
                /* const setup = {
                  rate_id: rate.rate_id,
                  rate_recommend: (rate.rate_recommend) ? 'R' : '',
                };
                await instance.patch(`/table/rate/${rate.rate_id}`, setup); */
                //

                if (rate.rate_recommend !== 'R') {
                  const setup = {
                    rate_id: rate.rate_id
                  };
                  if (rate.rate_recommend === '' || !rate.rate_recommend) {
                    await instance.patch(`/inquiry/${values.inq_uuid}/rate`, {
                      rate_id: rate.rate_id
                    });
                  } else {
                    await instance.patch(`/inquiry/${values.inq_uuid}/rate`, {
                      rate_id: rate.rate_id
                    });
                    await instance.post(`/inquiry/${values.inq_uuid}/rate`, setup);
                  }
                  console.log(rate.rate_recommend);
                }
              });

              values.AgentQuote.map(async (agent) => {
                const setup = {
                  aq_agent_id: agent.aq_agent_id,
                  aq_select: (agent.aq_select) ? 's' : '',
                  aq_currency_cp_shpmt: agent.aq_currency_cp_shpmt,
                  aq_cp_shpmt: agent.aq_cp_shpmt,
                  aq_currency_cp_cntr: agent.aq_currency_cp_cntr,
                  aq_cp_cntr: agent.aq_cp_cntr,
                  aq_currency_dp_shpt: agent.aq_currency_dp_shpt,
                  aq_dp_shpt: agent.aq_dp_shpt,
                  aq_currency_dp_cntr: agent.aq_currency_dp_cntr,
                  aq_dp_cntr: agent.aq_dp_cntr
                };
                console.log(setup);
                await instance.patch(`/agent/quote/${agent.aq_id}`, setup);
              });
              if (values.inq_status !== inqStatus) {
                await instance.patch(`/inquiry/${values.inq_uuid}/inq_status/${inqStatus}`);
              }
              await instance.patch(`/inquiry/${values.inq_uuid}`, Data)
                .then(() => {
                  // resetForm();
                  setStatus({ success: true });
                  setSubmitting(false);
                  setComplete(true);
                  setMessage('Complete update!');
                  setOpen(true);
                  // console.log(res);
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
        {({ handleChange, setFieldValue, handleSubmit, isSubmitting, values }) => (
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
                      Recommend
                    </Typography>
                  </Grid>
                  <Grid>
                    <Button
                      color="primary"
                      startIcon={<FindInPageIcon fontSize="small" />}
                      sx={{ m: 1, mt: 2, mr: 0 }}
                      variant="contained"
                      size="large"
                      component={RouterLink}
                      to={`/report/inquiry-information/${values.inq_uuid}`}
                    >
                      Detail
                    </Button>
                  </Grid>
                </Grid>
                <Card sx={{ mt: 1 }}>
                  <CardContent>
                    <Table
                      size="small"
                      sx={{ mt: -1, maxWidth: '100%' }}
                    >
                      <TableRow
                        height={40}
                        valign="top"
                      >
                        <TableCell
                          sx={{ width: 300, borderBottom: 'none' }}
                          align="left"
                        >
                          <Box
                            sx={{
                              maxWidth: '100%',
                              display: 'flex',
                              flexWrap: 'wrap'
                            }}
                            container
                            direction="row"
                            justifyContent="flex-start"
                            alignItems="flex-start"
                          >
                            <Typography
                              color="textPrimary"
                              variant="h6"
                            >
                              Inquiry No.:&nbsp;
                            </Typography>
                            <Typography
                              color="textPrimary"
                              variant="subtitle1"
                            >
                              {values.inq_no}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell
                          sx={{ width: 300, borderBottom: 'none' }}
                          align="left"
                        >
                          <Box
                            sx={{
                              maxWidth: '100%',
                              display: 'flex',
                              flexWrap: 'wrap'
                            }}
                            container
                            direction="row"
                            justifyContent="flex-start"
                            alignItems="flex-start"
                          >
                            <Typography
                              color="textPrimary"
                              variant="h6"
                            >
                              Inquiry Date:&nbsp;&nbsp;
                            </Typography>
                            <Typography
                              color="textPrimary"
                              variant="subtitle1"
                            >
                              {date1}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell
                          sx={{ width: 300, borderBottom: 'none' }}
                          align="left"
                        >
                          <Grid
                            sx={{
                              maxWidth: '100%',
                              display: 'flex',
                              flexWrap: 'wrap'
                            }}
                            container
                            direction="row"
                            justifyContent="flex-start"
                            alignItems="flex-start"
                          >
                            <Typography
                              color="textPrimary"
                              variant="h6"
                            >
                              Customer:&nbsp;&nbsp;
                            </Typography>
                            <Typography
                              color="textPrimary"
                              variant="subtitle1"
                            >
                              {values.cus_id}
                            </Typography>
                          </Grid>
                        </TableCell>
                        <TableCell
                          sx={{ width: 400, borderBottom: 'none' }}
                          align="left"
                        >
                          <Box
                            sx={{
                              maxWidth: '100%',
                              display: 'flex',
                              flexWrap: 'wrap'
                            }}
                            container
                            direction="row"
                            justifyContent="flex-start"
                            alignItems="flex-start"
                          >
                            <Typography
                              color="textPrimary"
                              variant="h6"
                            >
                              Sales:&nbsp;&nbsp;
                            </Typography>
                            <Typography
                              color="textPrimary"
                              variant="subtitle1"
                            >
                              {values.user_id}
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                      <TableRow
                        height={40}
                        valign="top"
                      >
                        <TableCell
                          sx={{ width: 300, borderBottom: 'none' }}
                          align="left"
                        >
                          <Grid
                            sx={{
                              maxWidth: '100%',
                              display: 'flex',
                              flexWrap: 'wrap',
                              mt: 1
                            }}
                            container
                            direction="row"
                            justifyContent="flex-start"
                            alignItems="flex-start"
                          >
                            <Typography
                              color="textPrimary"
                              variant="h6"
                            >
                              POL:&nbsp;
                            </Typography>
                            <Typography
                              color="textPrimary"
                              variant="subtitle1"
                            >
                              {values.pol_port_name}
                            </Typography>
                          </Grid>
                        </TableCell>
                        <TableCell
                          sx={{ width: 300, borderBottom: 'none' }}
                          align="left"
                        >
                          <Grid
                            sx={{
                              maxWidth: '100%',
                              display: 'flex',
                              flexWrap: 'wrap',
                              mt: 1
                            }}
                            container
                            direction="row"
                            justifyContent="flex-start"
                            alignItems="flex-start"
                          >
                            <Typography
                              color="textPrimary"
                              variant="h6"
                            >
                              POD:&nbsp;
                            </Typography>
                            <Typography
                              color="textPrimary"
                              variant="subtitle1"
                            >
                              {values.pod_port_name}
                            </Typography>
                          </Grid>
                        </TableCell>
                        <TableCell
                          sx={{ width: 300, borderBottom: 'none' }}
                          align="left"
                        >
                          <Grid
                            sx={{
                              maxWidth: '100%',
                              display: 'flex',
                              flexWrap: 'wrap',
                              mt: 1
                            }}
                            container
                            direction="row"
                            justifyContent="flex-start"
                            alignItems="flex-start"
                          >
                            <Typography
                              color="textPrimary"
                              variant="h6"
                            >
                              Special Container:&nbsp;
                            </Typography>
                            <Typography
                              color="textPrimary"
                              variant="subtitle1"
                            >
                              {values.inq_special_container}
                            </Typography>
                          </Grid>
                        </TableCell>
                        <TableCell
                          sx={{ width: 300, borderBottom: 'none' }}
                          align="left"
                        >
                          <Grid
                            sx={{
                              maxWidth: '100%',
                              display: 'flex',
                              flexWrap: 'wrap',
                              mt: 1
                            }}
                            container
                            direction="row"
                            justifyContent="flex-start"
                            alignItems="flex-start"
                          >
                            <Typography
                              color="textPrimary"
                              variant="h6"
                            >
                              Cargo Readiness:&nbsp;
                            </Typography>
                            <Typography
                              color="textPrimary"
                              variant="subtitle1"
                            >
                              {date2}
                            </Typography>
                          </Grid>
                        </TableCell>
                        <TableCell sx={{ borderBottom: 'none' }} />
                      </TableRow>
                      <TableRow
                        height={40}
                        valign="top"
                      >
                        <TableCell
                          sx={{ width: 300, borderBottom: 'none' }}
                          align="left"
                        >
                          <Grid
                            sx={{
                              maxWidth: '100%',
                              display: 'flex',
                              flexWrap: 'wrap',
                              mt: 1
                            }}
                            container
                            direction="row"
                            justifyContent="flex-start"
                            alignItems="flex-start"
                          >
                            <Typography
                              color="textPrimary"
                              variant="h6"
                            >
                              Commodity:&nbsp;
                            </Typography>
                            <Typography
                              color="textPrimary"
                              variant="subtitle1"
                            >
                              {values.inq_commodity}
                            </Typography>
                          </Grid>
                        </TableCell>
                        <TableCell
                          sx={{ width: 300, borderBottom: 'none' }}
                          align="left"
                        >
                          <Grid
                            sx={{
                              maxWidth: '100%',
                              display: 'flex',
                              flexWrap: 'wrap',
                              mt: 1
                            }}
                            container
                            direction="row"
                            justifyContent="flex-start"
                            alignItems="flex-start"
                          >
                            <Typography
                              color="textPrimary"
                              variant="h6"
                            >
                              Container Type:&nbsp;
                            </Typography>
                            <Typography
                              color="textPrimary"
                              variant="subtitle1"
                            >
                              {values.inq_type}
                            </Typography>
                          </Grid>
                        </TableCell>
                        <TableCell
                          sx={{ width: 300, borderBottom: 'none' }}
                          align="left"
                        >
                          <Grid
                            sx={{
                              maxWidth: '100%',
                              display: 'flex',
                              flexWrap: 'wrap',
                              mt: 1
                            }}
                            container
                            direction="row"
                            justifyContent="flex-start"
                            alignItems="flex-start"
                          >
                            <Typography
                              color="textPrimary"
                              variant="h6"
                            >
                              Volume:&nbsp;
                            </Typography>
                            <Typography
                              color="textPrimary"
                              variant="subtitle1"
                            >
                              {((values.inq_container_20) && Number(values.inq_container_20) !== 0) ? ` 20': ${Number(values.inq_container_20).toLocaleString(navigator.language, { minimumFractionDigits: 0 })} ` : ''}
                              {((values.inq_container_40) && Number(values.inq_container_40) !== 0) ? ` 40': ${Number(values.inq_container_40).toLocaleString(navigator.language, { minimumFractionDigits: 0 })} ` : ''}
                              {((values.inq_container_40hc) && Number(values.inq_container_40hc) !== 0) ? ` 40'hc: ${Number(values.inq_container_40hc).toLocaleString(navigator.language, { minimumFractionDigits: 0 })} ` : ''}
                              {((values.inq_container_cbm) && Number(values.inq_container_cbm) !== 0) ? ` CBM: ${Number(values.inq_container_cbm).toLocaleString(navigator.language, { minimumFractionDigits: 3 })} ` : ''}
                            </Typography>
                          </Grid>
                        </TableCell>
                        <TableCell
                          sx={{ width: 300, borderBottom: 'none' }}
                          align="left"
                        >
                          <Grid
                            sx={{
                              maxWidth: '100%',
                              display: 'flex',
                              flexWrap: 'wrap',
                              mt: 1
                            }}
                            container
                            direction="row"
                            justifyContent="flex-start"
                            alignItems="flex-start"
                          >
                            <Typography
                              color="textPrimary"
                              variant="h6"
                            >
                              Incoterms:&nbsp;
                            </Typography>
                            <Typography
                              color="textPrimary"
                              variant="subtitle1"
                            >
                              {values.inq_incoterms}
                            </Typography>
                          </Grid>
                        </TableCell>
                        <TableCell sx={{ borderBottom: 'none' }} />
                      </TableRow>
                      <TableRow
                        height={40}
                        valign="top"
                      >
                        <TableCell
                          sx={{ width: 600, borderBottom: 'none' }}
                          align="left"
                          colspan="2"
                        >
                          <Grid
                            sx={{
                              maxWidth: '100%',
                              display: 'flex',
                              flexWrap: 'wrap',
                              mt: 1
                            }}
                            container
                            direction="row"
                            justifyContent="flex-start"
                            alignItems="flex-start"
                          >
                            <Typography
                              color="textPrimary"
                              variant="h6"
                            >
                              Comment:&nbsp;
                            </Typography>
                            <Typography
                              color="textPrimary"
                              variant="subtitle1"
                            >
                              {values.inq_other}
                            </Typography>
                          </Grid>
                        </TableCell>
                        <TableCell sx={{ borderBottom: 'none' }} />
                        <TableCell sx={{ borderBottom: 'none' }} />
                        <TableCell sx={{ borderBottom: 'none' }} />
                      </TableRow>
                    </Table>
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
                  {
                    currentTab === 'SpecialRequiment'
                    && (
                    <Card>
                      <CardContent>
                        <Box
                          sx={{
                            minWidth: 800,
                            p: 3,
                            ml: -3,
                            mt: -3
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
                              }}
                            >
                              <Box
                                sx={{
                                  m: 1,
                                  maxWidth: '100%',
                                  width: 600
                                }}
                              >
                                <Typography
                                  variant="h6"
                                >
                                  Send Email to Agent
                                </Typography>
                                <FormControl>
                                  <Autocomplete
                                    autoHighlight
                                    multiple
                                    value={emails}
                                    defaultValue={emails}
                                    options={Agent.sort((a, b) => -b.value.localeCompare(a.value))}
                                    fullWidth
                                    filterSelectedOptions
                                    getOptionLabel={(option) => option.value}
                                    onChange={(event, val) => {
                                      const tempContact = [];
                                      val.map(async (value) => {
                                        Contact.filter((data) => data.ct_refer_id === value.id).map((cont) => (
                                          tempContact.push({ agen_id: `${value.id}`, agen_name: `${value.value}`, ct_name: `${cont.ct_name}`, ct_mail: `${cont.ct_mail}`, ct_uuid: `${cont.ct_uuid}`, use: false })
                                        ));
                                      });
                                      setEmails(val);
                                      setContactList(tempContact);
                                    }}
                                    name="cus_owner"
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        sx={{ width: 600 }}
                                        size="small"
                                        variant="outlined"
                                      />
                                    )}
                                  />
                                </FormControl>
                                <Grid display="none">
                                  <TextField
                                    size="small"
                                    fullWidth
                                    name="inq_agent_id"
                                    onChange={handleChange}
                                    select
                                    SelectProps={{ native: true }}
                                    variant="outlined"
                                    value={values.inq_agent_id}
                                  >
                                    <option
                                      key=""
                                      value=""
                                    >
                                      &nbsp;
                                    </option>
                                    {Agent.map((obj) => (
                                      <option
                                        key={obj.id}
                                        value={obj.id}
                                      >
                                        {obj.value}
                                      </option>
                                    ))}
                                  </TextField>
                                </Grid>
                              </Box>

                              <Box
                                sx={{
                                  m: 1,
                                  maxWidth: '100%',
                                  display: 'flex',
                                  flexWrap: 'wrap',
                                }}
                              >
                                <Card
                                  fullWidth
                                  sx={{
                                    minWidth: '100%',
                                    mb: 3,
                                    display: (emails.length > 0) ? 'block' : 'none'
                                  }}
                                >
                                  <CardContent>
                                    <Typography
                                      color="textPrimary"
                                      variant="h6"
                                    >
                                      Agent - Contact
                                    </Typography>
                                    <Table size="small">
                                      <TableHead>
                                        <TableRow>
                                          <TableCell>
                                            Agent
                                          </TableCell>
                                          <TableCell>
                                            Select Contact
                                          </TableCell>
                                          <TableCell>
                                            Contact
                                          </TableCell>
                                          <TableCell>
                                            Email Contact
                                          </TableCell>
                                        </TableRow>
                                      </TableHead>
                                      <TableBody>
                                        {contactList
                                          .map((cont) => (
                                            <TableRow>
                                              <TableCell>
                                                {cont.agen_name}
                                              </TableCell>
                                              <TableCell>
                                                <Checkbox
                                                  color="primary"
                                                  onChange={() => {
                                                    handleSelect(cont.ct_uuid);
                                                  }}
                                                />
                                              </TableCell>
                                              <TableCell>
                                                {cont.ct_name}
                                              </TableCell>
                                              <TableCell>
                                                {cont.ct_mail}
                                              </TableCell>
                                            </TableRow>
                                          ))}
                                      </TableBody>
                                    </Table>
                                  </CardContent>
                                </Card>
                                <Card
                                  fullWidth
                                  sx={{
                                    width: 650,
                                    mb: 3,
                                    display: (emails.length > 0) ? 'block' : 'none'
                                  }}
                                >
                                  <CardContent>
                                    <Typography
                                      color="textPrimary"
                                      variant="h6"
                                    >
                                      Mail Content
                                    </Typography>
                                    <Grid sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                      <Typography
                                        color="textPrimary"
                                        variant="subtitle2"
                                        sx={{ mt: 3 }}
                                      >
                                        Subject:
                                      </Typography>
                                      <Input
                                        disableUnderline
                                        fullWidth
                                        placeholder="Subject"
                                        onChange={(event) => {
                                          console.log(event.target.value);
                                          setMailSubject(event.target.value);
                                        }}
                                        value={mailSubject}
                                        sx={{
                                          p: 1,
                                          borderBottom: 1,
                                          borderColor: 'divider',
                                        }}
                                      />
                                    </Grid>
                                    <Grid>
                                      <Typography
                                        color="textPrimary"
                                        variant="subtitle2"
                                        sx={{ mt: 3 }}
                                      >
                                        Mail:
                                      </Typography>
                                      <QuillEditor
                                        onChange={handleMailContent}
                                        name="mailContent"
                                        placeholder="Leave a message"
                                        sx={{
                                          border: 'none',
                                          flexGrow: 1
                                        }}
                                        value={mailContent}
                                      />
                                    </Grid>
                                  </CardContent>
                                </Card>
                                <Card sx={{ width: 650, mb: 3, display: (emails.length > 0) ? 'none' : 'block' }}>
                                  <CardContent>
                                    <Typography
                                      color="textPrimary"
                                      variant="h6"
                                    >
                                      Mail Example
                                    </Typography>
                                    <br />
                                    Subject: WICE Inquiry under
                                    {' '}
                                    <font style={{ color: '#00A0D8' }}>{values.inq_incoterms}</font>
                                    {' '}
                                    from
                                    {' '}
                                    <font style={{ color: '#00A0D8' }}>{values.pol_port_name}</font>
                                    {' '}
                                    to
                                    {' '}
                                    <font style={{ color: '#00A0D8' }}>{values.pod_port_name}</font>
                                    {' '}
                                    /
                                    {' '}
                                    (
                                    <font style={{ color: '#00A0D8' }}>{values.inq_no}</font>
                                    )
                                    <br />
                                    <br />
                                    Dear sirs,
                                    <br />
                                    <br />
                                    Good day to you.
                                    <br />
                                    <br />
                                    We would ask you to provide cost for our inquiry as below details:
                                    <br />
                                    <br />
                                    <font style={{ color: '#00A0D8' }}>
                                      Term:&nbsp;
                                      {values.inq_incoterms}
                                      <br />
                                      Place Of Loading (POL):&nbsp;
                                      {values.pol_port_name}
                                      <br />
                                      Place Of Destination (POD):&nbsp;
                                      {values.pod_port_name}
                                      <br />
                                      Pick-up Location:&nbsp;
                                      {values.inq_pickup_location}
                                      <br />
                                      Volume:&nbsp;
                                      {((values.inq_container_20) && Number(values.inq_container_20) !== 0) ? ` 20': ${Number(values.inq_container_20).toLocaleString(navigator.language, { minimumFractionDigits: 0 })} ` : ''}
                                      {((values.inq_container_40) && Number(values.inq_container_40) !== 0) ? ` 40': ${Number(values.inq_container_40).toLocaleString(navigator.language, { minimumFractionDigits: 0 })} ` : ''}
                                      {((values.inq_container_40hc) && Number(values.inq_container_40hc) !== 0) ? ` 40'hc: ${Number(values.inq_container_40hc).toLocaleString(navigator.language, { minimumFractionDigits: 0 })} ` : ''}
                                      {((values.inq_container_cbm) && Number(values.inq_container_cbm) !== 0) ? ` CBM: ${Number(values.inq_container_cbm).toLocaleString(navigator.language, { minimumFractionDigits: 3 })} ` : ''}
                                      <br />
                                      Commodity:&nbsp;
                                      {values.inq_commodity}
                                      <br />
                                      GW Per CNTR (Kg):&nbsp;
                                      {values.inq_qw_per_cntr}
                                      <br />
                                      Remark:&nbsp;
                                      {values.inq_other}
                                    </font>
                                    <br />
                                    <br />
                                    Best Regards
                                    <br />
                                    <br />
                                    <font style={{ color: '#00A0D8' }}>{userfullname}</font>
                                    &nbsp;|&nbsp;Marketing&nbsp;|&nbsp;Sales&nbsp;&&nbsp;Marketing
                                    <br />
                                    Tel :
                                    {' '}
                                    <font style={{ color: '#00A0D8' }}>{((userphone)) ? `${userphone} / ` : '-'}</font>
                                    {' '}
                                    | Mobile :
                                    {' '}
                                    <font style={{ color: '#00A0D8' }}>{((usermobile)) ? `${usermobile}` : '-'}</font>
                                    {' '}
                                    | E-mail :
                                    {' '}
                                    <font style={{ color: '#00A0D8' }}>{((usermail)) ? `${usermail}` : '-'}</font>
                                    <br />
                                    WICE Logistics PCL
                                    <br />
                                  </CardContent>
                                </Card>
                                <Card sx={{ width: 500, ml: 2 }}>
                                  <CardContent>
                                    <Typography
                                      color="textPrimary"
                                      variant="h6"
                                    >
                                      Mail History
                                    </Typography>
                                    <Box>
                                      <Table>
                                        <TableHead>
                                          <TableRow>
                                            <TableCell>
                                              Timestamp
                                            </TableCell>
                                            <TableCell>
                                              Receiver
                                            </TableCell>
                                          </TableRow>
                                        </TableHead>
                                        <TableBody>
                                          {MailHistory.map((mail) => (
                                            <TableRow>
                                              <TableCell>
                                                {Moment(mail.timestamp).utcOffset(0).format('DD-MM-YYYY HH:mm')}
                                              </TableCell>
                                              <TableCell>
                                                {mail.agent_name}
                                              </TableCell>
                                            </TableRow>
                                          ))}
                                        </TableBody>
                                      </Table>
                                    </Box>
                                  </CardContent>
                                </Card>
                                <Button
                                  sx={{ ml: 66 }}
                                  variant="contained"
                                  color="primary"
                                  size="large"
                                  onClick={async () => {
                                    if (emails.length > 0) {
                                      try {
                                        emails.map(async (obj) => {
                                          const time = Moment(new Date()).format('YYYY-MM-DD');
                                          const mails = [];
                                          contactList
                                            .map(async (data) => {
                                              if (data.use && data.agen_id === obj.id) {
                                                mails.push(data.ct_mail);
                                              }
                                              return data;
                                            });
                                          const DataMail = {
                                            agent_id: obj.id,
                                            inq_uuid: values.inq_uuid,
                                            timestamp: time,
                                            to_mail: mails,
                                            to_cc: [],
                                            subject: mailSubject,
                                            html: mailContent
                                          };
                                          // console.log(DataMail);

                                          const agentQ = [
                                            {
                                              aq_agent_id: obj.id,
                                              aq_inq_no: values.inq_uuid,
                                              aq_select: null,
                                              aq_currency_cp_shpmt: 'USD',
                                              aq_cp_shpmt: 0,
                                              aq_currency_cp_cntr: 'USD',
                                              aq_cp_cntr: 0,
                                              aq_currency_dp_shpt: 'USD',
                                              aq_dp_shpt: 0,
                                              aq_currency_dp_cntr: 'USD',
                                              aq_dp_cntr: 0,
                                              aq_mail: ''
                                            }];
                                          // console.log(agentQ);
                                          await instance.post('/log/mail/raw', DataMail)
                                            .then(async (res) => {
                                              console.log(res);
                                              await instance.post('/agent/quote/', agentQ)
                                                .then(async (res2) => {
                                                  console.log(res2);
                                                });
                                            });
                                          return null;
                                        });
                                        setMessage('Mail Sent!');
                                        setOpen(true);
                                        setComplete2(true);
                                        // window.location.assign(`/main/Recommend/details/${values.inq_uuid}`);
                                      } catch (err) {
                                        setMessage('this Agent was sent an email');
                                        setOpen(true);
                                      }
                                    } else {
                                      setMessage('Please select Agent to send email');
                                      setOpen(true);
                                    }
                                  }}
                                >
                                  SEND MAIL
                                </Button>
                              </Box>
                            </Box>
                          </Grid>
                        </Box>
                      </CardContent>
                    </Card>
                    )
                  }
                  {
                    currentTab === 'RateOffer'
                    && (
                    <FieldArray
                      name="RateTables"
                      render={() => (
                        <Grid
                          container
                          spacing={2}
                          sx={{ mt: -3 }}
                        >
                          {values.RateTables.map((rate, index) => (
                            <Grid
                              // eslint-disable-next-line react/no-array-index-key
                              key={index}
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
                                                  checked={rate.rate_recommend}
                                                  value={rate.rate_recommend}
                                                  onChange={() => {
                                                    if (rate.rate_recommend) {
                                                      setFieldValue(`RateTables[${index}].rate_recommend`, false);
                                                    } else {
                                                      setFieldValue(`RateTables[${index}].rate_recommend`, true);
                                                    }
                                                  }}
                                                  disabled={(rate.rate_recommend === 'R' && !InquiryRate.some((item) => rate.rate_id === item.rate_id)) || rate.inqrate === 'Y'}
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
                                                  { rate.rate_freight_currency !== '' && <br />}
                                                  {(rate.rate_freight_20) ? Number(rate.rate_freight_20).toLocaleString() : ''}
                                                </TableCell>
                                                <TableCell>
                                                  {rate.rate_freight_currency}
                                                  { rate.rate_freight_currency !== '' && <br />}
                                                  {(rate.rate_freight_40) ? Number(rate.rate_freight_40).toLocaleString() : ''}
                                                </TableCell>
                                                <TableCell>
                                                  {rate.rate_freight_currency}
                                                  { rate.rate_freight_currency !== '' && <br />}
                                                  {(rate.rate_freight_40hc) ? Number(rate.rate_freight_40hc).toLocaleString() : ''}
                                                </TableCell>
                                                <TableCell>
                                                  {rate.rate_freight_currency}
                                                  { rate.rate_freight_currency !== '' && <br />}
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
                                                  { rate.rate_isps_currency !== '' && <br />}
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
                                                  { rate.rate_aea_currency !== '' && <br />}
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
                                                  { rate.rate_lss_currency !== '' && <br />}
                                                  {(rate.rate_lss_20) ? Number(rate.rate_lss_20).toLocaleString() : ''}
                                                </TableCell>
                                                <TableCell>
                                                  {rate.rate_lss_currency}
                                                  { rate.rate_lss_currency !== '' && <br />}
                                                  {(rate.rate_lss_40) ? Number(rate.rate_lss_40).toLocaleString() : ''}
                                                </TableCell>
                                                <TableCell>
                                                  {rate.rate_lss_currency}
                                                  { rate.rate_lss_currency !== '' && <br />}
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
                    )
                }
                  {
                    currentTab === 'AgentQuote'
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
                          <Box
                            sx={{
                              minWidth: 800,
                              p: 6
                            }}
                          >
                            <FieldArray
                              name="AgentQuote"
                              render={() => (
                                <Scrollbar>
                                  <Table
                                    size="small"
                                    sx={{ ml: -2 }}
                                  >
                                    <TableHead>
                                      <TableRow>
                                        <TableCell />
                                        <TableCell />
                                        <TableCell />
                                        <TableCell>
                                          Customs
                                        </TableCell>
                                        <TableCell />
                                        <TableCell>
                                          Customs
                                        </TableCell>
                                        <TableCell />
                                        <TableCell>
                                          Delivery
                                        </TableCell>
                                        <TableCell />
                                        <TableCell>
                                          Delivery
                                        </TableCell>
                                        <TableCell />
                                        <TableCell />
                                      </TableRow>
                                      <TableRow>
                                        <TableCell>
                                          Select
                                        </TableCell>
                                        <TableCell>
                                          Agent
                                        </TableCell>
                                        <TableCell>
                                          Currency
                                        </TableCell>
                                        <TableCell>
                                          Per Shipment
                                        </TableCell>
                                        <TableCell>
                                          Currency
                                        </TableCell>
                                        <TableCell>
                                          Per Container
                                        </TableCell>
                                        <TableCell>
                                          Currency
                                        </TableCell>
                                        <TableCell>
                                          Per Shipment
                                        </TableCell>
                                        <TableCell>
                                          Currency
                                        </TableCell>
                                        <TableCell>
                                          Per Container
                                        </TableCell>
                                        <TableCell align="center">
                                          View
                                        </TableCell>
                                        <TableCell align="center">
                                          Email
                                        </TableCell>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      {values.AgentQuote.map((agent, index) => (
                                        <TableRow>
                                          <TableCell>
                                            <Checkbox
                                              color="primary"
                                              name={`AgentQuote[${index}].aq_select`}
                                              value={agent.aq_select === 's' || agent.aq_select}
                                              checked={agent.aq_select === 's' || agent.aq_select}
                                              onChange={() => {
                                                values.AgentQuote.map((a, i) => {
                                                  setFieldValue(`AgentQuote[${i}].aq_select`, false);
                                                  return null;
                                                });
                                                if (agent.aq_select) {
                                                  setFieldValue(`AgentQuote[${index}].aq_select`, false);
                                                } else {
                                                  setFieldValue(`AgentQuote[${index}].aq_select`, true);
                                                }
                                              }}
                                            />
                                          </TableCell>
                                          <TableCell>
                                            {agent.agent_name}
                                          </TableCell>
                                          <TableCell>
                                            <Autocomplete
                                              autoHighlight
                                              value={({ id: agent.aq_currency_cp_shpmt, value: agent.aq_currency_cp_shpmt })}
                                              options={currency}
                                              getOptionLabel={(option) => option.value}
                                              onChange={(event, val) => {
                                                if (val) {
                                                  setFieldValue(`AgentQuote[${index}].aq_currency_cp_shpmt`, val.value);
                                                } else {
                                                  setFieldValue(`AgentQuote[${index}].aq_currency_cp_shpmt`, 'USD');
                                                }
                                              }}
                                              name={`AgentQuote[${index}].aq_currency_cp_shpmt`}
                                              renderInput={(params) => (
                                                <TextField
                                                  {...params}
                                                  sx={{ width: 120 }}
                                                  size="small"
                                                  variant="outlined"
                                                />
                                              )}
                                            />
                                          </TableCell>
                                          <TableCell>
                                            <TextField
                                              size="small"
                                              sx={{ width: 80 }}
                                              name={`AgentQuote[${index}].aq_cp_shpmt`}
                                              type="number"
                                              variant="outlined"
                                              value={agent.aq_cp_shpmt || ''}
                                              onChange={handleChange}
                                            />
                                          </TableCell>
                                          <TableCell>
                                            <Autocomplete
                                              autoHighlight
                                              value={({ id: agent.aq_currency_cp_cntr, value: agent.aq_currency_cp_cntr })}
                                              options={currency}
                                              getOptionLabel={(option) => option.value}
                                              onChange={(event, val) => {
                                                if (val) {
                                                  setFieldValue(`AgentQuote[${index}].aq_currency_cp_cntr`, val.value);
                                                } else {
                                                  setFieldValue(`AgentQuote[${index}].aq_currency_cp_cntr`, 'USD');
                                                }
                                              }}
                                              name={`AgentQuote[${index}].aq_currency_cp_cntr`}
                                              renderInput={(params) => (
                                                <TextField
                                                  {...params}
                                                  sx={{ width: 120 }}
                                                  size="small"
                                                  variant="outlined"
                                                />
                                              )}
                                            />
                                          </TableCell>
                                          <TableCell>
                                            <TextField
                                              size="small"
                                              sx={{ width: 80 }}
                                              name={`AgentQuote[${index}].aq_cp_cntr`}
                                              type="number"
                                              variant="outlined"
                                              value={agent.aq_cp_cntr || ''}
                                              onChange={handleChange}
                                            />
                                          </TableCell>
                                          <TableCell>
                                            <Autocomplete
                                              autoHighlight
                                              value={({ id: agent.aq_currency_dp_shpt, value: agent.aq_currency_dp_shpt })}
                                              options={currency}
                                              getOptionLabel={(option) => option.value}
                                              onChange={(event, val) => {
                                                if (val) {
                                                  setFieldValue(`AgentQuote[${index}].aq_currency_dp_shpt`, val.value);
                                                } else {
                                                  setFieldValue(`AgentQuote[${index}].aq_currency_dp_shpt`, 'USD');
                                                }
                                              }}
                                              name={`AgentQuote[${index}].aq_currency_dp_shpt`}
                                              renderInput={(params) => (
                                                <TextField
                                                  {...params}
                                                  sx={{ width: 120 }}
                                                  size="small"
                                                  variant="outlined"
                                                />
                                              )}
                                            />
                                          </TableCell>
                                          <TableCell>
                                            <TextField
                                              size="small"
                                              sx={{ width: 80 }}
                                              name={`AgentQuote[${index}].aq_dp_shpt`}
                                              type="number"
                                              variant="outlined"
                                              value={agent.aq_dp_shpt || ''}
                                              onChange={handleChange}
                                            />
                                          </TableCell>
                                          <TableCell>
                                            <Autocomplete
                                              autoHighlight
                                              value={({ id: agent.aq_currency_dp_cntr, value: agent.aq_currency_dp_cntr })}
                                              options={currency}
                                              getOptionLabel={(option) => option.value}
                                              onChange={(event, val) => {
                                                if (val) {
                                                  setFieldValue(`AgentQuote[${index}].aq_currency_dp_cntr`, val.value);
                                                } else {
                                                  setFieldValue(`AgentQuote[${index}].aq_currency_dp_cntr`, 'USD');
                                                }
                                              }}
                                              name={`AgentQuote[${index}].aq_currency_dp_cntr`}
                                              renderInput={(params) => (
                                                <TextField
                                                  {...params}
                                                  sx={{ width: 120 }}
                                                  size="small"
                                                  variant="outlined"
                                                />
                                              )}
                                            />
                                          </TableCell>
                                          <TableCell>
                                            <TextField
                                              size="small"
                                              sx={{ width: 80 }}
                                              name={`AgentQuote[${index}].aq_dp_cntr`}
                                              type="number"
                                              variant="outlined"
                                              value={agent.aq_dp_cntr || ''}
                                              onChange={handleChange}
                                            />
                                          </TableCell>
                                          <TableCell align="center">
                                            <Grid display={(agent.aq_filename && agent.aq_filename !== '') ? 'block' : 'none'}>
                                              <VisibilityIcon
                                                fontSize="small"
                                                onClick={() => {
                                                  downLoadFile(agent.aq_id, agent.aq_filename);
                                                  // console.log(agent.aq_filename);
                                                }}
                                              />
                                            </Grid>
                                          </TableCell>
                                          <TableCell align="center">
                                            <MailOutlineIcon
                                              fontSize="small"
                                              onClick={() => {
                                                setFormID(agent);
                                                handleAddClick();
                                              }}
                                            />
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </Scrollbar>
                              )}
                            />
                            <Box
                              sx={{
                                mt: 3,
                                maxWidth: '100%'
                              }}
                            >
                              <TextField
                                fullWidth
                                multiline
                                name="inq_agent_quote_comment"
                                value={values.inq_agent_quote_comment}
                                placeholder="Leave a message"
                                label="Comment"
                                rows={6}
                                variant="outlined"
                                onChange={handleChange}
                              />
                            </Box>
                          </Box>
                        </Card>
                      </Grid>
                    </Grid>
                    )
                }
                </Box>
              </Container>
              <Grid
                container
                justifyContent="space-between"
                spacing={3}
              >
                <Box sx={{ m: 5, ml: 7 }} />
                <Box sx={{ mt: 5, mr: 3 }}>
                  <Button
                    sx={{ mr: 1, width: 150 }}
                    variant="contained"
                    color="warning"
                    size="large"
                    type="submit"
                    disabled={isSubmitting}
                    onClick={() => setInqStatus('waiting marketing')}
                  >
                    SAVE DRAFT
                  </Button>
                  <Button
                    sx={{ mr: 1, width: 150 }}
                    variant="contained"
                    color="secondary"
                    size="large"
                    type="reset"
                    onClick={() => window.location.assign('/main/recommend')}
                  >
                    CANCEL
                  </Button>
                  <Button
                    sx={{ mr: 0, width: 150 }}
                    variant="contained"
                    color="info"
                    size="large"
                    onClick={() => setInqStatus('waiting quotation')}
                    type="submit"
                    disabled={isSubmitting}
                  >
                    SUBMIT
                  </Button>
                </Box>
              </Grid>
            </Box>
          </form>
        )}
      </Formik>
      <Dialog
        fullWidth
        maxWidth="sm"
        onClose={handleModalClose}
        open={isModalOpen}
      >
        {/* Dialog renders its body even if not open */}
        {isModalOpen && (
        <AttachEmail
          event={selectedEvent}
          onAddComplete={handleModalClose}
          onCancel={handleModalClose}
          onDeleteComplete={handleModalClose}
          onEditComplete={handleModalClose}
          range={selectedRange}
          FormID={FormID}
        />
        )}
      </Dialog>
    </>
  );
};

RecommendEdit.propTypes = {
  Inquiry: PropTypes.array.isRequired,
  Customer: PropTypes.array.isRequired,
  Sales: PropTypes.array.isRequired,
  RateTables: PropTypes.array.isRequired,
  AgentQuote: PropTypes.array.isRequired,
  Agent: PropTypes.array.isRequired,
  MailHistory: PropTypes.array.isRequired,
  Contact: PropTypes.array.isRequired,
  InquiryRate: PropTypes.array.isRequired
};

export default RecommendEdit;
