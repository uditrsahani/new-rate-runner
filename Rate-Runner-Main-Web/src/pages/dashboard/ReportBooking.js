import { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  TextField,
  Skeleton
} from '@material-ui/core';
import { BookingListTable } from '../../components/dashboard/Report';
import useMounted from '../../hooks/useMounted';
import useSettings from '../../hooks/useSettings';
import GetAppIcon from '@material-ui/icons/GetApp';
import gtm from '../../lib/gtm';
import DatePicker from '@material-ui/lab/DatePicker';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import Moment from 'moment';
import instance from '../../store/instance';

const ReportInqPerformance = () => {
  const mounted = useMounted();
  const { settings } = useSettings();
  const [report, setReport] = useState([]);
  const [startdate, setStartDate] = useState(Moment(new Date()).format('YYYY-MM-DD'));
  const [enddate, setEndDate] = useState(Moment(new Date()).format('YYYY-MM-DD'));
  const [serPol, setSerPol] = useState('');
  const [serPod, setSerPod] = useState('');
  const [PortList, setPortList] = useState('');
  const [view, setView] = useState('All');
  const [status, setStatus] = useState('All');
  const user = JSON.parse(window.localStorage.getItem('user'));
  const [summary, setSummary] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(async () => {
    if (mounted.current) {
      await instance.get('/table/port?port_disable=0')
        .then((res) => {
          setPortList(res.data
            .sort((a, b) => (a.port_name.toUpperCase() > b.port_name.toUpperCase() ? 1 : -1))
            .map((val) => ({ id: val.port_id, value: val.port_name }))
            .filter((thing, index, self) => index === self.findIndex((t) => (
              t.value === thing.value
            ))));
        });
      setIsLoading(false);
    }
    gtm.push({ event: 'page_view' });
  }, [mounted]);

  const downLoadFile = async () => {
    const start = `${startdate} 00:00:00`;
    const end = `${enddate} 23:59:59`;
    let url = `/inquiry/export/booking?inq_disable=0&inq_cargo_readiness_from=${start}&inq_cargo_readiness_to=${end}`;
    if (view !== 'All') {
      url += `&inq_mode=${view}`;
    }
    if (status !== 'All') {
      url += `&inq_res_quote_status=${status.toUpperCase()}`;
    }
    if (serPol && serPol !== '') {
      url += `&inq_pol_id=${serPol}`;
    }
    if (serPod && serPod !== '') {
      url += `&inq_pod_id=${serPod}`;
    }
    // console.log(url);
    await instance.get(url, {
      method: 'GET',
      responseType: 'blob'
    })
      .then((res) => {
        const urlDownload = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = urlDownload;
        link.setAttribute('download', `${Date.now()}.xlsx`);
        document.body.appendChild(link);
        link.click();
        // console.log(res);
      });
  };

  const getReport = useCallback(async () => {
    // console.log(view, startdate, enddate, status, serPol, serPod, serCus, serSales);
    const start = `${startdate} 00:00:00`;
    const end = `${enddate} 23:59:59`;
    try {
      let url = `/inquiry/report/booking?inq_disable=0&inq_cargo_readiness_from=${start}&inq_cargo_readiness_to=${end}`;
      if (view !== 'All') {
        url += `&inq_mode=${view}`;
      }
      if (status !== 'All') {
        url += `&inq_res_quote_status=${status.toUpperCase()}`;
      }
      if (serPol && serPol !== '') {
        url += `&inq_pol_id=${serPol}`;
      }
      if (serPod && serPod !== '') {
        url += `&inq_pod_id=${serPod}`;
      }
      // console.log(url);
      await instance.get(url)
        .then((res) => {
          // console.log(res.data);
          if (mounted.current) {
            setReport(res.data);
            let sumRevenue = 0;
            let sumGP = 0;
            let c20 = 0;
            let c40 = 0;
            let c40hc = 0;

            res.data.map((val) => {
              sumRevenue += Number(val.inq_revenue);
              sumGP += Number(val.inq_gp);
              c20 += Number(val.inq_container_20);
              c40 += Number(val.inq_container_40);
              c40hc += Number(val.inq_container_40hc);
              return null;
            });
            const tempsummary = {
              sumRevenue,
              sumGP,
              c20,
              c40,
              c40hc
            };
            setSummary(tempsummary);
          }
        });
    } catch (err) {
      console.error(err.respones);
    }
  }, [view, startdate, enddate, status, serPol, serPod]);

  useEffect(() => {
    getReport();
  }, [getReport]);

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
                  spacing={2}
                >
                  <Grid item>
                    <Typography
                      color="textPrimary"
                      variant="h5"
                    >
                      Booking Report
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Box
                      sx={{ m: -1 }}
                      display={(user.user_role === 'management' || user.user_role === 'marketingManager' || user.user_role === 'dataAdmin') ? 'block' : 'none'}
                    >
                      <Button
                        color="primary"
                        startIcon={<GetAppIcon />}
                        sx={{ m: 1 }}
                        variant="contained"
                        onClick={downLoadFile}
                      >
                        EXPORT
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
                <Card
                  sx={{
                    mt: 2,
                    height: 200
                  }}
                >
                  <CardContent
                    sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between'
                    }}
                  >
                    <Box
                      sx={{
                        mt: -1,
                        display: 'flex',
                        flexWrap: 'wrap'
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
                        >
              &nbsp;Cargo Ready Date
                        </Typography>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            value={startdate}
                            inputFormat="dd/MM/yyyy"
                            name="inq_date"
                            onChange={(date) => setStartDate(Moment(date).format('YYYY-MM-DD'))}
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
                          width: 220,
                          display: 'flex',
                          flexWrap: 'wrap',
                        }}
                      >
                        <Typography
                          variant="h6"
                        >
              &nbsp;To
                        </Typography>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            value={enddate}
                            inputFormat="dd/MM/yyyy"
                            name="inq_date"
                            onChange={(date) => setEndDate(Moment(date).format('YYYY-MM-DD'))}
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
                          width: 300
                        }}
                      >
                        <Typography
                          variant="h6"
                        >
                          Mode
                        </Typography>
                        <TextField
                          size="small"
                          fullWidth
                          name="veiw"
                          onChange={(val) => {
                            setView(val.target.value);
                          }}
                          select
                          SelectProps={{ native: true }}
                          variant="outlined"
                        >
                          {['All',
                            'Sea Export',
                            'Sea Import',
                            'Triangle'
                          ].map((obj) => (
                            <option
                              key={obj}
                              value={obj}
                              selected={obj === view}
                            >
                              {obj}
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
                          Result
                        </Typography>
                        <TextField
                          size="small"
                          fullWidth
                          name="veiw"
                          onChange={(val) => {
                            setStatus(val.target.value);
                          }}
                          select
                          SelectProps={{ native: true }}
                          variant="outlined"
                        >
                          {['All',
                            'Pending',
                            'Win',
                            'Loss'
                          ].map((obj) => (
                            <option
                              key={obj}
                              value={obj}
                              selected={obj === view}
                            >
                              {obj}
                            </option>
                          ))}
                        </TextField>
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
                          POL
                        </Typography>
                        <Autocomplete
                          autoHighlight
                          options={PortList}
                          getOptionLabel={(option) => option.value}
                          onChange={(event, val) => {
                            if (val == null) {
                              setSerPol('');
                            } else {
                              setSerPol(val.id);
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
                          POD
                        </Typography>
                        <Autocomplete
                          autoHighlight
                          options={PortList}
                          getOptionLabel={(option) => option.value}
                          onChange={(event, val) => {
                            if (val == null) {
                              setSerPod('');
                            } else {
                              setSerPod(val.id);
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
                        />
                      </Box>
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{ mt: 6, ml: 3 }}
                        >
                          Currency: USD
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
                <Box sx={{ mt: 2 }}>
                  <BookingListTable
                    invoices={report}
                    status={status}
                    summary={summary}
                  />
                </Box>
              </Container>
            </Box>
          </>
        )}
    </>
  );
};

export default ReportInqPerformance;
