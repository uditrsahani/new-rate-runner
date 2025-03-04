import { useState, useEffect, useCallback } from 'react';
import useMounted from '../../hooks/useMounted';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import instance from '../../store/instance';
import Moment from 'moment';
import { Skeleton,
  Box,
  Button,
  Card,
  Autocomplete,
  CardContent,
  Container,
  Grid,
  Table,
  TableCell,
  TableRow,
  TextField,
  Typography,
  InputAdornment
} from '@material-ui/core';

import useSettings from '../../hooks/useSettings';
import FindInPageIcon from '@material-ui/icons/FindInPage';
import gtm from '../../lib/gtm';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const UpdateQuotationResultDetails = () => {
  const mounted = useMounted();
  const navigate = useNavigate();
  const { settings } = useSettings();
  const [detail, setDetail] = useState({});
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState();
  const [complete, setComplete] = useState(false);
  const [inqResQuoteStatus, setResInqQuoteStatus] = useState();
  const [inqResQuoteActualWekkNo, setResInqResQuoteActualWekkNo] = useState();
  const [inqResComment, setResInqResComment] = useState();
  const [inqResReason, setResInqResReason] = useState();
  const [inqResDescribe, setResInqResDescribe] = useState();
  const [inqResLossComment, setResInqResLossComment] = useState();
  const [competitorList, setCompetitorList] = useState([{ ct_name: '', ct_id: '' }]);
  const [competitorWhoWin, setCompetitorWhoWin] = useState();
  const [inqResCtPrice, setInqResCtPrice] = useState();
  const [error, setError] = useState(false);
  const user = JSON.parse(window.localStorage.getItem('user'));
  const userid = user.user_id;
  const [editable, setEditable] = useState(false);
  const [MonthlyTables, setMonthlyTables] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const cancel = () => {
    navigate('/main/update-result');
  };

  const toDetail = () => {
    navigate(`/report/inquiry-information/${detail.inq_uuid}`);
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

  const filterOption1 = [
    { text: 'PENDING', value: 'PENDING' },
    { text: 'WIN', value: 'WIN' },
    { text: 'LOSS', value: 'LOSS' }
  ];

  const filterOption2 = [
    { text: 'price', value: 'price' },
    { text: 'carrier', value: 'carrier' },
    { text: 'time', value: 'time' }
  ];

  const handleClose = () => {
    setOpen(false);
    if (complete) { navigate('/main/update-result'); }
  };

  const handleErrorClose = () => {
    setError(false);
  };

  const getCompetitorList = useCallback(async () => {
    try {
      const url = '/profile/competitor';
      await instance.get(url)
        .then((res) => {
          if (mounted.current) {
            setCompetitorList(res.data);
          }
        });
    } catch (err) {
      console.error(err);
    }
  }, [mounted]);

  const getQuotationDetail = useCallback(async () => {
    try {
      const urlParam = window.location.href.split('/');
      const url = `/inquiry?inq_uuid=${urlParam[urlParam.length - 1]}&joinForecast=true`;
      await instance.get(url)
        .then(async (res) => {
          if (mounted.current) {
            res.data[0].inq_res_quote_status = res.data[0].inq_res_quote_status.toUpperCase();
            if (res.data[0].inq_res_reason === null) {
              res.data[0].inq_res_reason = '';
            }
            setResInqQuoteStatus(res.data[0].inq_res_quote_status);
            setResInqResReason(res.data[0].inq_res_reason);
            setDetail(res.data[0]);
            const checkEdit = (userid === res.data[0].inq_user_id);
            setEditable(checkEdit);
            setResInqResQuoteActualWekkNo(Number(Moment(new Date()).format('W')));

            await instance.get('/forecast').then((res2) => {
              const result = res2.data.filter((data) => data.fc_inq_uuid === res.data[0].inq_uuid);
              setMonthlyTables(result);
              // console.log(result);
            });
          }
        });
      setIsLoading(false);
    } catch (err) {
      console.error(err);
    }
  }, [mounted]);

  const submit = async () => {
    if (inqResQuoteStatus !== 'PENDING' && inqResQuoteStatus) {
      try {
        const urlParam = window.location.href.split('/');
        const url = `/inquiry/${urlParam[urlParam.length - 1]}`;
        const data = {
          inq_res_quote_status: (inqResQuoteStatus) || null,
          inq_res_actual_week_no: inqResQuoteActualWekkNo,
          inq_res_comment: inqResComment,
          inq_res_reason: (inqResReason) || null,
          inq_res_describe: inqResDescribe,
          inq_res_loss_comment: inqResLossComment,
          inq_res_ct_id_win: undefined,
          inq_res_ct_price: inqResCtPrice
        };
        if (competitorWhoWin) {
          data.inq_res_ct_id_win = competitorWhoWin.ct_name;
        }
        if (data === {}) {
          console.log('yes');
        }
        await instance.patch(url, data)
          .then((res) => {
            console.log('update', res);
          });
      } catch (err) {
        console.error(err);
      }
      try {
        const urlParam = window.location.href.split('/');
        const url = `/inquiry/${urlParam[urlParam.length - 1]}/inq_status/close`;
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
    } else {
      setError(true);
    }
  };

  useEffect(() => {
    getQuotationDetail();
  }, [getQuotationDetail]);

  useEffect(() => {
    getCompetitorList();
  }, [getCompetitorList]);

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  // Usually query is done on backend with indexing solutions

  return (
    <>
      {isLoading
        ? (
          <Skeleton
            sx={{
              borderRadius: 1,
              pt: '99.76%',
              width: '100%',
              mt: 2
            }}
            variant="rectangular"
          />
        )
        : (
          <>
            <Helmet>
              <title>WICE Rate Runner</title>
            </Helmet>
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">Update Quotation Result</DialogTitle>
              <DialogContent
                sx={{ width: '400px' }}
              >
                <DialogContentText id="alert-dialog-description">
                  <Typography
                    color="green"
                    variant="h5"
                  >
                    {message}
                  </Typography>
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
              <DialogTitle id="alert-dialog-title">Update Quotation Result</DialogTitle>
              <DialogContent
                sx={{ width: '400px' }}
              >
                <DialogContentText id="alert-dialog-description">
                  <Typography
                    color="red"
                    variant="h6"
                  >
                    - Please enter Quotation Status
                  </Typography>
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
                      Update Quotation Result
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
              <Card sx={{ mt: 3, ml: 3, width: '96.5%' }}>
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
                      Quote Status
                    </Typography>
                    <Autocomplete
                      autoHighlight
                      getOptionLabel={(option) => option.value}
                      options={filterOption1}
                      size="small"
                      renderInput={(params) => (
                        <TextField
                          fullWidth
                          name=""
                          variant="outlined"
                          {...params}
                        />
                      )}
                      value={{ value: inqResQuoteStatus }}
                      onChange={(e, value) => {
                        if (value) {
                          setResInqQuoteStatus(value.value);
                        /* setDetail({
                      inq_res_quote_status: value.value,
                      inq_res_reason: detail.inq_res_reason
                    }); */
                        } else {
                          setResInqQuoteStatus(null);
                        /* setDetail({
                      inq_res_quote_status: '',
                      inq_res_reason: ''
                    }); */
                        }
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
                      Forecast Week No.
                    </Typography>
                    <TextField
                      size="small"
                      fullWidth
                      name="Customer"
                      variant="outlined"
                      value={MonthlyTables[0] ? weekofyear(MonthlyTables[0].fc_cargo_readiness) : null}
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
                      width: 300
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                    >
                      Actual Week No.
                    </Typography>
                    <TextField
                      size="small"
                      fullWidth
                      name="Customer"
                      variant="outlined"
                      value={detail.inq_cargo_readiness ? weekofyear(detail.inq_cargo_readiness) : null}
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
                    {/* <TextField
                size="small"
                fullWidth
                name="fc_week_no"
                onChange={(e) => setResInqResQuoteActualWekkNo(e.target.value)}
                select
                SelectProps={{ native: true }}
                variant="outlined"
                disabled={!editable}
                InputProps={{
                  startAdornment: (
                    <InputAdornment />
                  ),
                  style: {
                    backgroundColor: '#F5F5F5'
                  },
                  readOnly: true
                }}
              >
                {Week.map((obj) => (
                  <option
                    key={obj.value}
                    value={obj.value}
                    selected={Number(Moment(Moment(detail.inq_cargo_readiness).format('YYYY-MM-DD')).format('W')) === obj.value}
                  >
                    {obj.value}
                  </option>
                ))}
                </TextField> */}
                  </Box>
                </Box>
                <Box
                  sx={{
                    minWidth: 1250,
                    p: 4,
                    mt: -6
                  }}
                >
                  <Box
                    sx={{
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
                      placeholder="Leave a message"
                      rows={3}
                      variant="outlined"
                      value={detail.inq_res_comment}
                      disabled={!editable}
                      onChange={(e) => {
                        setResInqResComment(e.target.value);
                        setDetail((old) => {
                          const temp = old;
                          temp.inq_res_comment = e.target.value;
                          return temp;
                        });
                      }}
                    />
                  </Box>
                </Box>
                <Box sx={{ ml: 4, mt: -3 }}>
                  <Typography
                    color="textPrimary"
                    variant="h6"
                  >
                    If loss, Cancel Please give information
                  </Typography>
                </Box>
                <Box
                  sx={{
                    alignItems: 'center',
                    display: 'flex',
                    flexWrap: 'wrap',
                    m: 1,
                    p: 2,
                    mt: -1
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
                      Reason
                    </Typography>
                    <Autocomplete
                      autoHighlight
                      getOptionLabel={(option) => option.value}
                      options={filterOption2}
                      size="small"
                      renderInput={(params) => (
                        <TextField
                          fullWidth
                          name=""
                          variant="outlined"
                          {...params}
                        />
                      )}
                      value={{ value: inqResReason }}
                      onChange={(e, value) => {
                        if (value) {
                          setResInqResReason(value.value);
                        /* setDetail({
                      inq_res_quote_status: detail.inq_res_quote_status,
                      inq_res_reason: value.value
                    }); */
                        } else {
                          setResInqResReason(null);
                        /* setDetail({
                      inq_res_quote_status: '',
                      inq_res_reason: ''
                    }); */
                        }
                      }}
                      disabled={!editable}
                    />
                  </Box>
                </Box>
                <Box
                  sx={{
                    minWidth: 1250,
                    p: 4,
                    mt: -8
                  }}
                >
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
                      Please Describe
                    </Typography>
                    <TextField
                      size="small"
                      sx={{ width: 1160 }}
                      fullWidth
                      multiline
                      placeholder="Leave a message"
                      rows={3}
                      variant="outlined"
                      value={detail.inq_res_describe}
                      onChange={(e) => {
                        setResInqResDescribe(e.target.value);
                        setDetail((old) => {
                          const temp = old;
                          temp.inq_res_describe = e.target.value;
                          return temp;
                        });
                      }}
                      disabled={!editable}
                    />
                  </Box>
                </Box>
                <Box
                  sx={{
                    alignItems: 'center',
                    display: 'flex',
                    flexWrap: 'wrap',
                    m: 1,
                    p: 2,
                    mt: -5
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
                      Competitor Name who Win
                    </Typography>
                    <Autocomplete
                      autoHighlight
                      getOptionLabel={(option) => option.ct_name}
                      options={competitorList}
                      size="small"
                      renderInput={(params) => (
                        <TextField
                          fullWidth
                          name=""
                          variant="outlined"
                          {...params}
                        />
                      )}
                      defaultValue={competitorWhoWin}
                      onChange={(e, value) => {
                        setCompetitorWhoWin(value);
                      /* setDetail({
                    inq_res_quote_status: detail.inq_res_quote_status,
                    inq_res_reason: detail.inq_res_reason
                  }); */
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
                      Competitor Price (Freight)
                    </Typography>
                    <TextField
                      size="small"
                      fullWidth
                      name="Customer"
                      SelectProps={{ native: true }}
                      variant="outlined"
                      value={inqResCtPrice}
                      onChange={(e) => {
                        const re = /^[0-9\b]+$/;
                        if (e.target.value === '' || re.test(e.target.value)) {
                          setInqResCtPrice(e.target.value);
                        }
                      }}
                      disabled={!editable}
                    />
                  </Box>
                </Box>
                <Box
                  sx={{
                    minWidth: 1250,
                    p: 4,
                    mt: -6
                  }}
                >
                  <Box
                    sx={{
                      mt: 0,
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
                      placeholder="Leave a message"
                      rows={3}
                      variant="outlined"
                      value={detail.inq_res_loss_comment}
                      onChange={(e) => {
                        setResInqResLossComment(e.target.value);
                        setDetail((old) => {
                          const temp = old;
                          temp.inq_res_loss_comment = e.target.value;
                          return temp;
                        });
                      }}
                      disabled={!editable}
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
                <Box sx={{ mt: 5, mr: 5 }}>
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
                    variant="contained"
                    color="info"
                    size="large"
                    onClick={submit}
                    disabled={!editable}
                  >
                    SUBMIT & CLOSE
                  </Button>
                </Box>
              </Grid>
            </Box>
          </>
        )}
    </>

  );
};

export default UpdateQuotationResultDetails;
