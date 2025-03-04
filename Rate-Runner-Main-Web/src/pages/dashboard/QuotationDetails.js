import { Helmet } from 'react-helmet-async';
import { useState, useEffect, useCallback } from 'react';
import useMounted from '../../hooks/useMounted';
import DatePicker from '@material-ui/lab/DatePicker';
import { useNavigate } from 'react-router-dom';
import instance from '../../store/instance';
import Moment from 'moment';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@material-ui/core';
import useSettings from '../../hooks/useSettings';
import FindInPageIcon from '@material-ui/icons/FindInPage';
import gtm from '../../lib/gtm';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const QuotationDetails = () => {
  const mounted = useMounted();
  const navigate = useNavigate();
  const { settings } = useSettings();
  const [detail, setDetail] = useState({});
  const [fixState, setFixState] = useState({});
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState();
  const [complete, setComplete] = useState();
  const [inqQuoteNo, setInqQuoteNo] = useState();
  const [inqQuoteDate, setInqQuoteDate] = useState();
  const [inqQuoteFreight, setInqQuoteFreight] = useState();
  const [inqQuoteComment, setInqQuoteComment] = useState();
  const [aqPerShipment, setAqPerShipment] = useState();
  const [aqPerContainer, setAqPerContainer] = useState();
  const [aqDeliverPerShipment, setAqDeliverPerShipment] = useState();
  const [aqDeliverPerContainer, setAqDeliverPerContainer] = useState();
  const [aqPerShipmentDisplay, setAqPerShipmentDisplay] = useState();
  const [aqPerContainerDisplay, setAqPerContainerDisplay] = useState();
  const [aqDeliverPerShipmentDisplay, setAqDeliverPerShipmentDisplay] = useState();
  const [aqDeliverPerContainerDisplay, setAqDeliverPerContainerDisplay] = useState();
  const [otherDisplay, setOtherDisplay] = useState();
  // eslint-disable-next-line no-unused-vars
  const [carrier, setCarrier] = useState();
  const [other, setOther] = useState();
  const [agent, setAgent] = useState({ agent_name: '' });
  const [revenue, setRevenue] = useState(0);
  const [offer, setOffer] = useState(0);
  const [summary, setSummary] = useState(0);
  const [ros, setSRos] = useState(0);
  const [error, setError] = useState(false);
  const user = JSON.parse(window.localStorage.getItem('user'));
  const userid = user.user_id;
  const [editable, setEditable] = useState(false);

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const toDetail = () => {
    navigate(`/report/inquiry-information/${detail.inq_uuid}`);
  };

  const handleClose = () => {
    setOpen(false);
    if (complete) { navigate('/main/quotation-draft'); }
  };

  const handleErrorClose = () => {
    setError(false);
  };

  const initialSetState = (data) => {
    let allQuoteBlank = true;
    let offerValue = 0;
    let revenue2 = 0;
    let agentCost = 0;
    // console.log(any);
    if (data.inq_container_20) {
      offerValue += Number(data.inq_container_20) * Number(data.rate_freight_20);
    }
    if (data.inq_container_40) {
      offerValue += Number(data.inq_container_40) * Number(data.rate_freight_40);
    }
    if (data.inq_container_40hc) {
      offerValue += Number(data.inq_container_40hc) * Number(data.rate_freight_40hc);
    }
    if (data.inq_container_cbm) {
      offerValue += Number(data.inq_container_cbm) * Number(data.rate_freight_cbm);
    }
    if (data.aq_sq_cp_shpmt) {
      setAqPerShipment(data.aq_sq_cp_shpmt);
      revenue2 += Number(data.aq_sq_cp_shpmt);
      allQuoteBlank = false;
    } else {
      setAqPerShipment('');
    }
    if (data.aq_sq_cp_cntr) {
      setAqPerContainer(data.aq_sq_cp_cntr);
      revenue2 += Number(data.aq_sq_cp_cntr);
      allQuoteBlank = false;
    } else {
      setAqPerContainer('');
    }
    if (data.aq_sq_dp_shpt) {
      setAqDeliverPerShipment(data.aq_sq_dp_shpt);
      revenue2 += Number(data.aq_sq_dp_shpt);
      allQuoteBlank = false;
    } else {
      setAqDeliverPerShipment('');
    }
    if (data.aq_sq_dp_cntr) {
      setAqDeliverPerContainer(data.aq_sq_dp_cntr);
      revenue2 += Number(data.aq_sq_dp_cntr);
      allQuoteBlank = false;
    } else {
      setAqDeliverPerContainer('');
    }
    if (data.inq_quate_sq_other) {
      setOther(data.inq_quate_sq_other);
      revenue2 += Number(data.inq_quate_sq_other);
      // revenue2 += 500;
      allQuoteBlank = false;
    } else {
      setOther('');
    }
    if (data.aq_cp_shpmt) {
      setAqPerShipmentDisplay(data.aq_cp_shpmt);
      agentCost += Number(data.aq_cp_shpmt);
    }
    if (data.aq_cp_cntr) {
      setAqPerContainerDisplay(data.aq_cp_cntr);
      agentCost += Number(data.aq_cp_cntr);
    }
    if (data.aq_dp_shpt) {
      setAqDeliverPerShipmentDisplay(data.aq_dp_shpt);
      agentCost += Number(data.aq_dp_shpt);
    }
    if (data.aq_dp_cntr) {
      setAqDeliverPerContainerDisplay(data.aq_dp_cntr);
      agentCost += Number(data.aq_dp_cntr);
    }
    if (data.inq_quate_other) {
      setOtherDisplay(data.inq_quate_other);
      agentCost += Number(data.inq_quate_other);
    }
    if (data.inq_quate_freight_sq) {
      setInqQuoteFreight(data.inq_quate_freight_sq);
    } else {
      setInqQuoteFreight('');
    }
    setRevenue(parseFloat(agentCost) + parseFloat(offerValue));
    // console.log(agentCost, offerValue);
    setOffer(offerValue);
    if (!allQuoteBlank || data.inq_quate_freight_sq) {
      const displaySum = parseFloat(revenue2) + parseFloat(data.inq_quate_freight_sq);
      setSummary(displaySum);
      const cost = parseFloat(agentCost) + parseFloat(offerValue);
      const diff = displaySum - cost;
      const ros2 = (diff * 100) / displaySum;
      setSRos(ros2.toFixed(2));
    }
  };

  const getAgentDetail = useCallback(async (any) => {
    try {
      const url = `/profile/agent/${any.rate_agent_id}`;
      await instance.get(url)
        .then((res) => {
          if (mounted.current) {
            console.log(res);
            setAgent(res.data);
          }
        });
    } catch (err) {
      console.error(err);
    }
  }, [mounted]);

  const getQuotationDetail = useCallback(async () => {
    try {
      const urlParam = window.location.href.split('/');
      const url = `/inquiry/${urlParam[urlParam.length - 1]}`;
      await instance.get(url)
        .then(async (res) => {
          if (mounted.current) {
            // console.log(res.data);
            if (res.data.rate_cr_id && res.data.rate_cr_id !== '') {
              await instance.get('/profile/carrier')
                .then((res2) => {
                  setCarrier(res2.data.filter((data) => data.cr_id === res.data.rate_cr_id)[0]);
                  // console.log(res2.data.filter((data) => data.cr_id === res.data.rate_cr_id)[0]);
                });
            }
            if (!res.data.inq_quate_no || res.data.inq_quate_no === '') {
              res.data.inq_quate_no = res.data.inq_no.replace('IQ', 'QT');
            }
            setFixState(res.data);
            setDetail(res.data);
            initialSetState(res.data);
            getAgentDetail(res.data);
            const checkEdit = (userid === res.data.inq_user_id);
            // checkEdit = true;
            setEditable(checkEdit);
          }
        });
    } catch (err) {
      console.error(err);
    }
  }, [mounted]);

  useEffect(() => {
    getQuotationDetail();
  }, [getQuotationDetail]);

  const cancel = () => {
    navigate('/main/quotation-draft');
  };

  const submit = async () => {
    if (inqQuoteFreight !== '' || other !== '' || aqPerShipment !== '' || aqPerContainer !== '' || aqDeliverPerShipment !== '' || aqDeliverPerContainer !== '') {
      try {
        const urlParam = window.location.href.split('/');
        const url = `/inquiry/${urlParam[urlParam.length - 1]}`;
        const data = {
          inq_quate_comment: inqQuoteComment,
          inq_quate_sq_other: other,
          inq_quate_freight_sq: inqQuoteFreight,
          inq_quate_no: inqQuoteNo,
          inq_quate_date: Moment(inqQuoteDate).format('YYYY-MM-DD'),
          inq_revenue: summary,
          inq_gp: summary - revenue,
          inq_status: 'waiting customer'
        };
        await instance.patch(url, data)
          .then((res) => {
            console.log('update', res);
          });
      } catch (err) {
        console.error(err);
      }
      try {
        const urlParam = window.location.href.split('/');
        const url = `/inquiry/${urlParam[urlParam.length - 1]}/inq_status/waiting customer`;
        await instance.patch(url)
          .then((res) => {
            console.log('update', res);
            setOpen(true);
            setComplete(true);
            setMessage('Update Success Fully');
          });
      } catch (err) {
        console.error(err);
      }
      try {
        const url = `/agent/quote/${fixState.aq_id}`;
        const data = {
          aq_sq_cp_shpmt: aqPerShipment === '' ? 0 : aqPerShipment,
          aq_sq_cp_cntr: aqPerContainer === '' ? 0 : aqPerContainer,
          aq_sq_dp_shpt: aqDeliverPerShipment === '' ? 0 : aqDeliverPerShipment,
          aq_sq_dp_cntr: aqDeliverPerContainer === '' ? 0 : aqDeliverPerContainer
        };
        await instance.patch(url, data)
          .then((res) => {
            console.log('update', res);
          });
      } catch (err) {
        console.error(err);
      }
    } else {
      setError(true);
    }
  };

  const sasvedraft = async () => {
    try {
      const urlParam = window.location.href.split('/');
      const url = `/inquiry/${urlParam[urlParam.length - 1]}`;
      const data = {
        inq_quate_comment: detail.inq_quate_comment,
        inq_quate_freight_sq: detail.inq_quate_freight_sq,
        inq_quate_no: detail.inq_quate_no,
        inq_disable: detail.inq_disable,
        inq_quate_date: Moment(detail.inq_quate_date).format('YYYY-MM-DD'),
        inq_revenue: summary,
        inq_gp: summary - revenue
      };
      await instance.patch(url, data)
        .then((res) => {
          console.log('update', res);
          setOpen(true);
          setComplete(true);
          setMessage('Update Success Fully');
        });
    } catch (err) {
      console.error(err);
    }

    /* try {
      const urlParam = window.location.href.split('/');
      const url = `/inquiry/${urlParam[urlParam.length - 1]}/inq_status/waiting quotation`;
      await instance.patch(url)
        .then((res) => {
          console.log('update', res);
          setOpen(true);
          setComplete(true);
          setMessage('Update Success Fully');
        });
    } catch (err) {
      console.error(err);
    } */
    try {
      const url = `/agent/quote/${fixState.aq_id}`;
      const data = {
        aq_sq_cp_shpmt: aqPerShipment !== '' ? aqPerShipment : 0,
        aq_sq_cp_cntr: aqPerContainer !== '' ? aqPerContainer : 0,
        aq_sq_dp_shpt: aqDeliverPerShipment !== '' ? aqDeliverPerShipment : 0,
        aq_sq_dp_cntr: aqDeliverPerContainer !== '' ? aqDeliverPerContainer : 0
      };
      await instance.patch(url, data)
        .then((res) => {
          console.log('update', res);
        });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Grid>
      <Helmet>
        <title>WICE Rate Runner</title>
      </Helmet>
      {open}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Quotation (Draft)</DialogTitle>
        <DialogContent
          sx={{ width: '400px' }}
        >
          <DialogContentText id="alert-dialog-description">
            {message}
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
      <Dialog
        open={error}
        onClose={handleErrorClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Quotation (Draft)</DialogTitle>
        <DialogContent
          sx={{ width: '400px' }}
        >
          <DialogContentText id="alert-dialog-description">
            Please fill in the information completely.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleErrorClose}
            color="primary"
            autoFocus
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
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
                Quotation (Draft)
              </Typography>
            </Grid>
            <Grid>
              <Button
                color="primary"
                startIcon={<FindInPageIcon fontSize="small" />}
                sx={{ m: 1, mt: 2, mr: 0 }}
                variant="contained"
                size="large"
                onClick={toDetail}
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
                        {detail.inq_no}
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
                        {Moment(detail.inq_date).utcOffset(0).format('DD/MM/YYYY')}
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
                        {detail.cus_name}
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
                        {detail.user_fullname}
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
                        {detail.pol_port_name}
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
                        {detail.pod_port_name}
                      </Typography>
                    </Grid>
                  </TableCell>
                  <TableCell
                    sx={{ width: 300, borderBottom: 'none' }}
                    align="left"
                  />
                  <TableCell
                    sx={{ width: 300, borderBottom: 'none' }}
                    align="left"
                  />
                  <TableCell sx={{ borderBottom: 'none' }} />
                </TableRow>
              </Table>
            </CardContent>
          </Card>
        </Container>
        <Card sx={{ mt: 2, ml: 3, width: '96.5%' }}>
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              flexWrap: 'wrap',
              m: 1,
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
                variant="subtitle2"
              >
                Quotation No.
              </Typography>
              <TextField
                size="small"
                fullWidth
                name="InquiryNumber"
                value={detail.inq_quate_no}
                onChange={(e) => {
                  setInqQuoteNo(e.target.value);
                  setDetail((old) => {
                    const temp = old;
                    temp.inq_quate_no = e.target.value;
                    return temp;
                  });
                }}
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
                variant="subtitle2"
              >
                Quotation Date
              </Typography>
              <DatePicker
                value={detail.inq_quate_date}
                inputFormat="dd/MM/yyyy"
                name="rate_timestamp"
                onChange={(e) => {
                  setInqQuoteDate(new Date(e));
                  setDetail({
                    inq_quate_date: new Date(e)
                  });
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
            </Box>
          </Box>
          <Box
            sx={{
              minWidth: 1250,
              p: 6,
              mt: -8
            }}
          >
            <Table
              size="small"
              sx={{ width: '100%' }}
            >
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell
                    colSpan={2}
                    align="center"
                  >
                    System Offer
                  </TableCell>
                  <TableCell />
                </TableRow>
                <TableRow>
                  <TableCell>
                    Item
                  </TableCell>
                  <TableCell>
                    Carrier/Agent
                  </TableCell>
                  <TableCell align="right">
                    Cost
                  </TableCell>
                  <TableCell>
                    Revenue
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
                    Freight
                  </TableCell>
                  <TableCell>
                    {(carrier) ? carrier.cr_name : ''}
                  </TableCell>
                  <TableCell align="right">
                    {offer ? Number(offer).toLocaleString() : 0}
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        maxWidth: '100%',
                        width: 300,
                        display: 'flex',
                        flexWrap: 'wrap'
                      }}
                    >
                      <TextField
                        size="small"
                        fullWidth
                        name="Customer"
                        SelectProps={{ native: true }}
                        variant="outlined"
                        value={detail.inq_quate_freight_sq}
                        disabled={!editable}
                        onChange={(e) => {
                          const re = /^[0-9\b]+$/;
                          if (e.target.value === '' || re.test(e.target.value)) {
                            setDetail((old) => {
                              const temp = old;
                              temp.inq_quate_freight_sq = e.target.value;
                              setInqQuoteFreight(e.target.value);
                              return temp;
                            });
                            let summaryValue = 0;
                            if (e.target.value !== '') {
                              summaryValue = parseFloat(summaryValue) + parseFloat(e.target.value);
                            }
                            if (aqPerShipment !== '') {
                              summaryValue = parseFloat(summaryValue) + parseFloat(aqPerShipment);
                            }
                            if (aqPerContainer !== '') {
                              summaryValue = parseFloat(summaryValue) + parseFloat(aqPerContainer);
                            }
                            if (aqDeliverPerShipment !== '') {
                              summaryValue = parseFloat(summaryValue) + parseFloat(aqDeliverPerShipment);
                            }
                            if (aqDeliverPerContainer !== '') {
                              summaryValue = parseFloat(summaryValue) + parseFloat(aqDeliverPerContainer);
                            }
                            if (other !== '') {
                              summaryValue = parseFloat(summaryValue) + parseFloat(other);
                            }
                            setSummary(summaryValue);
                            let ros2 = 0;
                            if (revenue !== 0) {
                              const diff = summaryValue - revenue;
                              ros2 = parseFloat(diff * 100) / parseFloat(summaryValue);
                            }
                            setSRos(ros2.toFixed(2));
                          }
                        }}
                      />
                    </Box>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    Agent
                  </TableCell>
                  <TableCell>
                    {agent.agent_name}
                  </TableCell>
                  <TableCell />
                  <TableCell />
                </TableRow>
                <TableRow>
                  <TableCell>
                    - Custom Per Shipment
                  </TableCell>
                  <TableCell />
                  <TableCell align="right">
                    {aqPerShipmentDisplay ? Number(aqPerShipmentDisplay).toLocaleString() : null}
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        maxWidth: '100%',
                        width: 300,
                        display: 'flex',
                        flexWrap: 'wrap'
                      }}
                    >
                      <TextField
                        size="small"
                        fullWidth
                        name="Customer"
                        SelectProps={{ native: true }}
                        variant="outlined"
                        value={detail.aq_sq_cp_shpmt}
                        disabled={!editable}
                        onChange={(e) => {
                          const re = /^[0-9\b]+$/;
                          if (e.target.value === '' || re.test(e.target.value)) {
                            setAqPerShipment(e.target.value);
                            setDetail((old) => {
                              const temp = old;
                              temp.aq_sq_cp_shpmt = e.target.value;
                              return temp;
                            });
                            let summaryValue = 0;
                            if (inqQuoteFreight !== '') {
                              summaryValue = parseFloat(summaryValue) + parseFloat(inqQuoteFreight);
                            }
                            if (e.target.value !== '') {
                              summaryValue = parseFloat(summaryValue) + parseFloat(e.target.value);
                            }
                            if (aqPerContainer !== '') {
                              summaryValue = parseFloat(summaryValue) + parseFloat(aqPerContainer);
                            }
                            if (aqDeliverPerShipment !== '') {
                              summaryValue = parseFloat(summaryValue) + parseFloat(aqDeliverPerShipment);
                            }
                            if (aqDeliverPerContainer !== '') {
                              summaryValue = parseFloat(summaryValue) + parseFloat(aqDeliverPerContainer);
                            }
                            if (other !== '') {
                              summaryValue = parseFloat(summaryValue) + parseFloat(other);
                            }
                            setSummary(summaryValue);
                            let ros2 = 0;
                            if (revenue !== 0) {
                              const diff = summaryValue - revenue;
                              ros2 = parseFloat(diff * 100) / parseFloat(summaryValue);
                            }
                            setSRos(ros2.toFixed(2));
                          }
                        }}
                      />
                    </Box>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    - Custom Per Container
                  </TableCell>
                  <TableCell />
                  <TableCell align="right">
                    {aqPerContainerDisplay ? Number(aqPerContainerDisplay).toLocaleString() : null}
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        maxWidth: '100%',
                        width: 300,
                        display: 'flex',
                        flexWrap: 'wrap'
                      }}
                    >
                      <TextField
                        size="small"
                        fullWidth
                        name="Customer"
                        SelectProps={{ native: true }}
                        variant="outlined"
                        value={detail.aq_sq_cp_cntr}
                        disabled={!editable}
                        onChange={(e) => {
                          const re = /^[0-9\b]+$/;
                          if (e.target.value === '' || re.test(e.target.value)) {
                            setAqPerContainer(e.target.value);
                            setDetail((old) => {
                              const temp = old;
                              temp.aq_sq_cp_cntr = e.target.value;
                              return temp;
                            });
                            let summaryValue = 0;
                            if (inqQuoteFreight !== '') {
                              summaryValue = parseFloat(summaryValue) + parseFloat(inqQuoteFreight);
                            }
                            if (aqPerShipment !== '') {
                              summaryValue = parseFloat(summaryValue) + parseFloat(aqPerShipment);
                            }
                            if (e.target.value !== '') {
                              summaryValue = parseFloat(summaryValue) + parseFloat(e.target.value);
                            }
                            if (aqDeliverPerShipment !== '') {
                              summaryValue = parseFloat(summaryValue) + parseFloat(aqDeliverPerShipment);
                            }
                            if (aqDeliverPerContainer !== '') {
                              summaryValue = parseFloat(summaryValue) + parseFloat(aqDeliverPerContainer);
                            }
                            if (other !== '') {
                              summaryValue = parseFloat(summaryValue) + parseFloat(other);
                            }
                            console.log('yes', summaryValue, inqQuoteFreight, aqPerShipment, aqDeliverPerShipment, aqDeliverPerContainer);
                            setSummary(summaryValue);
                            let ros2 = 0;
                            if (revenue !== 0) {
                              const diff = summaryValue - revenue;
                              ros2 = parseFloat(diff * 100) / parseFloat(summaryValue);
                            }
                            setSRos(ros2.toFixed(2));
                          }
                        }}
                      />
                    </Box>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    - Delivery Per Shipment
                  </TableCell>
                  <TableCell />
                  <TableCell align="right">
                    {aqDeliverPerShipmentDisplay ? Number(aqDeliverPerShipmentDisplay).toLocaleString() : null}
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        maxWidth: '100%',
                        width: 300,
                        display: 'flex',
                        flexWrap: 'wrap'
                      }}
                    >
                      <TextField
                        size="small"
                        fullWidth
                        name="Customer"
                        SelectProps={{ native: true }}
                        variant="outlined"
                        value={detail.aq_sq_dp_shpt}
                        disabled={!editable}
                        onChange={(e) => {
                          const re = /^[0-9\b]+$/;
                          if (e.target.value === '' || re.test(e.target.value)) {
                            setAqDeliverPerShipment(e.target.value);
                            setDetail((old) => {
                              const temp = old;
                              temp.aq_sq_dp_shpt = e.target.value;
                              return temp;
                            });
                            let summaryValue = 0;
                            if (inqQuoteFreight !== '') {
                              summaryValue = parseFloat(summaryValue) + parseFloat(inqQuoteFreight);
                            }
                            if (aqPerShipment !== '') {
                              summaryValue = parseFloat(summaryValue) + parseFloat(aqPerShipment);
                            }
                            if (aqPerContainer !== '') {
                              summaryValue = parseFloat(summaryValue) + parseFloat(aqPerContainer);
                            }
                            if (e.target.value !== '') {
                              summaryValue = parseFloat(summaryValue) + parseFloat(e.target.value);
                            }
                            if (aqDeliverPerContainer !== '') {
                              summaryValue = parseFloat(summaryValue) + parseFloat(aqDeliverPerContainer);
                            }
                            if (other !== '') {
                              summaryValue = parseFloat(summaryValue) + parseFloat(other);
                            }
                            setSummary(summaryValue);
                            let ros2 = 0;
                            if (revenue !== 0) {
                              const diff = summaryValue - revenue;
                              ros2 = parseFloat(diff * 100) / parseFloat(summaryValue);
                            }
                            setSRos(ros2.toFixed(2));
                          }
                        }}
                      />
                    </Box>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    - Delivery Per Container
                  </TableCell>
                  <TableCell />
                  <TableCell align="right">
                    {aqDeliverPerContainerDisplay ? Number(aqDeliverPerContainerDisplay).toLocaleString() : null}
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        maxWidth: '100%',
                        width: 300,
                        display: 'flex',
                        flexWrap: 'wrap'
                      }}
                    >
                      <TextField
                        size="small"
                        fullWidth
                        name="Customer"
                        SelectProps={{ native: true }}
                        variant="outlined"
                        value={detail.aq_sq_dp_cntr}
                        disabled={!editable}
                        onChange={(e) => {
                          const re = /^[0-9\b]+$/;
                          if (e.target.value === '' || re.test(e.target.value)) {
                            setAqDeliverPerContainer(e.target.value);
                            setDetail((old) => {
                              const temp = old;
                              temp.aq_sq_dp_cntr = e.target.value;
                              return temp;
                            });
                            let summaryValue = 0;
                            if (inqQuoteFreight !== '') {
                              summaryValue = parseFloat(summaryValue) + parseFloat(inqQuoteFreight);
                            }
                            if (aqPerShipment !== '') {
                              summaryValue = parseFloat(summaryValue) + parseFloat(aqPerShipment);
                            }
                            if (aqPerContainer !== '') {
                              summaryValue = parseFloat(summaryValue) + parseFloat(aqPerContainer);
                            }
                            if (aqDeliverPerShipment !== '') {
                              summaryValue = parseFloat(summaryValue) + parseFloat(aqDeliverPerShipment);
                            }
                            if (e.target.value !== '') {
                              summaryValue = parseFloat(summaryValue) + parseFloat(e.target.value);
                            }
                            if (other !== '') {
                              summaryValue = parseFloat(summaryValue) + parseFloat(other);
                            }
                            setSummary(summaryValue);
                            let ros2 = 0;
                            if (revenue !== 0) {
                              const diff = summaryValue - revenue;
                              ros2 = parseFloat(diff * 100) / parseFloat(summaryValue);
                            }
                            setSRos(ros2.toFixed(2));
                          }
                        }}
                      />
                    </Box>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    Other
                  </TableCell>
                  <TableCell />
                  <TableCell align="right">
                    {otherDisplay ? Number(otherDisplay).toLocaleString() : null}
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        maxWidth: '100%',
                        width: 300,
                        display: 'flex',
                        flexWrap: 'wrap'
                      }}
                    >
                      <TextField
                        size="small"
                        fullWidth
                        name="Customer"
                        SelectProps={{ native: true }}
                        variant="outlined"
                        value={detail.inq_quate_sq_other}
                        disabled={!editable}
                        onChange={(e) => {
                          const re = /^[0-9\b]+$/;
                          if (e.target.value === '' || re.test(e.target.value)) {
                            setOther(e.target.value);
                            setDetail((old) => {
                              const temp = old;
                              temp.inq_quate_sq_other = e.target.value;
                              return temp;
                            });
                            let summaryValue = 0;
                            if (inqQuoteFreight !== '') {
                              summaryValue = parseFloat(summaryValue) + parseFloat(inqQuoteFreight);
                            }
                            if (aqPerShipment !== '') {
                              summaryValue = parseFloat(summaryValue) + parseFloat(aqPerShipment);
                            }
                            if (aqPerContainer !== '') {
                              summaryValue = parseFloat(summaryValue) + parseFloat(aqPerContainer);
                            }
                            if (aqDeliverPerShipment !== '') {
                              summaryValue = parseFloat(summaryValue) + parseFloat(aqDeliverPerShipment);
                            }
                            if (aqDeliverPerContainer !== '') {
                              summaryValue = parseFloat(summaryValue) + parseFloat(aqDeliverPerContainer);
                            }
                            if (e.target.value !== '') {
                              summaryValue = parseFloat(summaryValue) + parseFloat(e.target.value);
                            }
                            setSummary(summaryValue);
                            let ros2 = 0;
                            if (revenue !== 0) {
                              const diff = summaryValue - revenue;
                              ros2 = parseFloat(diff * 100) / parseFloat(summaryValue);
                            }
                            setSRos(ros2.toFixed(2));
                          }
                        }}
                      />
                    </Box>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography
                      color="textPrimary"
                      variant="subtitle2"
                    >
                      Summary Revenue
                    </Typography>
                  </TableCell>
                  <TableCell />
                  <TableCell align="right">
                    {Number(revenue).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {summary ? Number(summary).toLocaleString() : null}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography
                      color="textPrimary"
                      variant="subtitle2"
                    >
                      GP
                    </Typography>
                  </TableCell>
                  <TableCell />
                  <TableCell />
                  <TableCell>
                    {summary ? Number(parseFloat(summary) - parseFloat(revenue)).toLocaleString() : null}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography
                      color="textPrimary"
                      variant="subtitle2"
                    >
                      ROS(%)
                    </Typography>
                  </TableCell>
                  <TableCell />
                  <TableCell />
                  <TableCell>
                    {ros !== 0 ? `${ros} %` : null}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Box
              sx={{
                mt: 2,
                maxWidth: '100%',
                width: 850
              }}
            >
              <Typography
                variant="subtitle2"
              >
                Comment
              </Typography>
              <TextField
                size="small"
                sx={{ width: 1160 }}
                fullWidth
                multiline
                wontfix
                placeholder="Leave a message"
                rows={3}
                variant="outlined"
                value={detail.inq_quate_comment}
                disabled={!editable}
                onChange={(e) => {
                  setInqQuoteComment(e.target.value);
                  setDetail((old) => {
                    const temp = old;
                    temp.inq_quate_comment = e.target.value;
                    return temp;
                  });
                }}
              />
            </Box>
          </Box>
        </Card>
        <Grid
          container
          justifyContent="space-between"
          spacing={3}
        >
          <Grid item>
            <Typography
              color="textPrimary"
              variant="h5"
            />
          </Grid>
          <Box sx={{ mt: 5, mr: 3 }}>
            <Button
              sx={{ mr: 1 }}
              variant="contained"
              color="warning"
              size="large"
              onClick={sasvedraft}
              disabled={!editable}
            >
              SAVE DRAFT
            </Button>
            <Button
              sx={{ mr: 1 }}
              variant="contained"
              color="secondary"
              size="large"
              onClick={cancel}
            >
              CANCEL
            </Button>
            <Button
              sx={{ mr: 3 }}
              variant="contained"
              color="info"
              size="large"
              onClick={submit}
              disabled={!editable}
            >
              Submit
            </Button>
          </Box>
        </Grid>
      </Box>
    </Grid>
  );
};

export default QuotationDetails;
