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
import { InqPerformanceListTable } from '../../components/dashboard/Report';
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
  const [serCus, setSerCus] = useState('');
  const [serSales, setSerSales] = useState('');
  const [PortList, setPortList] = useState('');
  const [salesList, setSalesList] = useState('');
  const [cusList, setCusList] = useState('');
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
      await instance.get('/profile/customer')
        .then((res) => {
          setCusList(res.data
            .sort((a, b) => (a.cus_name.toUpperCase() > b.cus_name.toUpperCase() ? 1 : -1))
            .map((val) => ({ id: val.cus_id, value: val.cus_name }))
            .filter((thing, index, self) => index === self.findIndex((t) => (
              t.value === thing.value
            ))));
        });
      await instance.get('/profile/sale')
        .then((res) => {
          if ((user.user_role === 'marketingManager' || user.user_role === 'management' || user.user_role === 'marketing')) {
            setSalesList(res.data.filter((data) => data.user_disable !== 1
            && (data.user_role === 'sales' || data.user_role === 'salesManager' || data.user_role === 'seniorManager'))
              .filter((thing, index, self) => index === self.findIndex((t) => (
                t.user_id === thing.user_id
              )))
              .sort((a, b) => (a.user_fullname.toUpperCase() > b.user_fullname.toUpperCase() ? 1 : -1))
              .map((val) => ({ id: val.user_id, value: val.user_fullname })));
          } else {
            setSalesList(res.data.filter((data) => data.user_team === user.user_team && data.user_disable !== 1
            && (data.user_role === 'sales' || data.user_role === 'salesManager' || data.user_role === 'seniorManager'))
              .filter((thing, index, self) => index === self.findIndex((t) => (
                t.user_id === thing.user_id
              )))
              .sort((a, b) => (a.user_fullname.toUpperCase() > b.user_fullname.toUpperCase() ? 1 : -1))
              .map((val) => ({ id: val.user_id, value: val.user_fullname })));
          }
        });
      setIsLoading(false);
    }
    gtm.push({ event: 'page_view' });
  }, [mounted]);

  const downLoadFile = async () => {
    const start = `${startdate} 00:00:00`;
    const end = `${enddate} 23:59:59`;
    let url = `/inquiry/export/performance?inq_date_from=${start}&inq_date_to=${end}`;
    if (view !== 'All') {
      url += `&inq_mode=${view}`;
    }
    if (status !== 'All') {
      if (status === 'Disabled') {
        url += '&inq_disable=1';
      } else if (status === 'Pending') {
        url += `&inq_disable=0&inq_res_quote_status=${status.toUpperCase()}`;
      } else {
        url += `&inq_res_quote_status=${status.toUpperCase()}`;
      }
    }
    if (serPol && serPol !== '') {
      url += `&inq_pol_id=${serPol}`;
    }
    if (serPod && serPod !== '') {
      url += `&inq_pod_id=${serPod}`;
    }
    if (serCus && serCus !== '') {
      url += `&inq_cus_id=${serCus}`;
    }
    if (serSales && serSales !== '') {
      url += `&inq_user_id=${serSales}`;
    }
    await instance.get(url, { method: 'GET', responseType: 'blob' })
      .then((res) => {
        const urlDownload = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = urlDownload;
        link.setAttribute('download', `${Date.now()}.xlsx`);
        document.body.appendChild(link);
        link.click();
      });
  };

  const getReport = useCallback(async () => {
    const start = `${startdate} 00:00:00`;
    const end = `${enddate} 23:59:59`;
    try {
      let url = `/inquiry?inq_date_from=${start}&inq_date_to=${end}`;
      if (view !== 'All') {
        url += `&inq_mode=${view}`;
      }
      if (status !== 'All') {
        if (status === 'Disabled') {
          url += '&inq_disable=1';
        } else if (status === 'Pending') {
          url += `&inq_disable=0&inq_res_quote_status=${status.toUpperCase()}`;
        } else {
          url += `&inq_res_quote_status=${status.toUpperCase()}`;
        }
      }
      if (serPol && serPol !== '') {
        url += `&inq_pol_id=${serPol}`;
      }
      if (serPod && serPod !== '') {
        url += `&inq_pod_id=${serPod}`;
      }
      if (serCus && serCus !== '') {
        url += `&inq_cus_id=${serCus}`;
      }
      if (serSales && serSales !== '') {
        url += `&inq_user_id=${serSales}`;
      }
      await instance.get(url)
        .then((res) => {
          if (mounted.current) {
            // Assuming response data contains the required fields
            const updatedData = res.data.map((val) => ({
              ...val,
              inq_cargo_readiness: val.inq_cargo_readiness,
              inq_date: new Date(val.inq_date).toLocaleDateString(),
              inq_idea_rate_per_unit: val.inq_idea_rate_per_unit,
              inq_res_comment: val.inq_res_comment || 'No Comment',
            }));
            setReport(updatedData);
            // Calculate summary (if needed)
            let sumRevenue = 0;
            let sumGP = 0;
            updatedData.map((val) => {
              sumRevenue += Number(val.inq_revenue);
              sumGP += Number(val.inq_gp);
              return null;
            });
            const tempsummary = {
              sumRevenue,
              sumGP,
            };
            setSummary(tempsummary);
          }
        });
    } catch (err) {
      console.error(err.response);
    }
  }, [view, startdate, enddate, status, serPol, serPod, serCus, serSales]);
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
                      Inquiry Performance Report
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Box
                      sx={{ m: -1 }}
                      display={(user.user_role === 'management' || user.user_role === 'marketingManager') ? 'block' : 'none'}
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
              &nbsp;Inquiry Date
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
                            'Loss',
                            'Disabled'
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
                          Customer
                        </Typography>
                        <Autocomplete
                          autoHighlight
                          freeSolo
                          clearOnEscape
                          key="Customer"
                          getOptionLabel={(option) => option.value}
                          options={cusList}
                          onChange={(event, val) => {
                            if (val == null) {
                              setSerCus('');
                            } else {
                              setSerCus(val.id);
                            }
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
                        <Autocomplete
                          autoHighlight
                          freeSolo
                          id="Sales"
                          name="Sales"
                          getOptionLabel={(option) => option.value}
                          options={salesList}
                          onChange={(event, val) => {
                            if (val == null) {
                              setSerSales('');
                            } else {
                              setSerSales(val.id);
                            }
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
                  <InqPerformanceListTable
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
