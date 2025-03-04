import { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  TextField,
  Autocomplete,
  Skeleton
} from '@material-ui/core';
import { SalesForecastListTable } from '../../components/dashboard/Report';
import useMounted from '../../hooks/useMounted';
import useSettings from '../../hooks/useSettings';
import GetAppIcon from '@material-ui/icons/GetApp';
import gtm from '../../lib/gtm';
import DatePicker from '@material-ui/lab/DatePicker';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import Moment from 'moment';
import instance from '../../store/instance';
import { Team2 } from '../../store/data.json';

const ReportSalesForecast = () => {
  const mounted = useMounted();
  const { settings } = useSettings();
  const [report, setReport] = useState([]);
  const [startdate, setStartDate] = useState(Moment(new Date()).format('YYYY-MM-DD'));
  const [enddate, setEndDate] = useState(Moment(new Date()).format('YYYY-MM-DD'));
  const user = JSON.parse(window.localStorage.getItem('user'));
  const [view, setView] = useState((user.user_role === 'marketingManager' || user.user_role === 'management') ? 'All' : user.user_team);
  const [status, setStatus] = useState([]);
  const [statusSelected, setStatusSelected] = useState({ user_fullname: 'All', user_id: 'All' });
  const [summary, setSummary] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const downLoadFile = async () => {
    const start = `${startdate} 00:00:00`;
    const end = `${enddate} 23:59:59`;
    let url = `/inquiry/export/actual?cargo_readiness_from=${start}&cargo_readiness_to=${end}`;
    if (statusSelected.user_id !== '' && statusSelected.user_id !== 'All' && statusSelected.user_id !== undefined) {
      url += `&user_fliter_id=${statusSelected.user_id}`;
    }
    if (view !== 'All') {
      url += `&user_team=${view}`;
    }
    await instance.get(url,
      {
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
      });
  };

  const getReport = useCallback(async () => {
    if (!statusSelected) {
      setStatusSelected({ user_fullname: 'All', user_id: 'All' });
    }
    try {
      const start = `${startdate} 00:00:00`;
      const end = `${enddate} 23:59:59`;
      let url = `/inquiry/report/actual?cargo_readiness_from=${start}&cargo_readiness_to=${end}`;
      if (statusSelected.user_id !== '' && statusSelected.user_id !== 'All' && statusSelected.user_id !== undefined) {
        url += `&user_fliter_id=${statusSelected.user_id}`;
      }
      if (view !== 'All') {
        url += `&user_team=${view}`;
      }
      // console.log(url);
      await instance.get(url)
        .then((res) => {
          if (mounted.current) {
            setReport(res.data);
            let sumRevenue = 0;
            let sumGP = 0;
            let sumROS = 0;
            let sumFCRevenue = 0;
            let sumFCGP = 0;
            let sumFCROS = 0;

            res.data.map((val) => {
              sumRevenue += Number(val.inq_revenue);
              sumGP += Number(val.inq_gp);
              sumFCRevenue += Number(val.fc_revernue);
              sumFCGP += Number(val.fc_gp);
              sumROS += Number(val.inq_ros);
              sumFCROS += Number(val.fc_ros);
              return null;
            });
            const tempsummary = {
              sumRevenue,
              sumGP,
              sumROS,
              sumFCRevenue,
              sumFCGP,
              sumFCROS
            };
            setSummary(tempsummary);
          }
        });
    } catch (err) {
      console.error(err.respones);
    }
    try {
      await instance.get('/profile/sale')
        .then((res) => {
          if (mounted.current) {
            if ((user.user_role === 'marketingManager' || user.user_role === 'management' || user.user_role === 'marketing')) {
              setStatus([{ user_fullname: 'All', user_id: 'All' },
                ...res.data.sort((a, b) => (a.user_fullname.toUpperCase() > b.user_fullname.toUpperCase() ? 1 : -1))
                  .filter((data) => data.user_disable !== 1 && ((data.user_role === 'sales' || data.user_role === 'salesManager' || data.user_role === 'seniorManager')))
                  .filter((thing, index, self) => index === self.findIndex((t) => (t.user_id === thing.user_id)))]);
            } else {
              setStatus([{ user_fullname: 'All', user_id: 'All' },
                ...res.data.sort((a, b) => (a.user_fullname.toUpperCase() > b.user_fullname.toUpperCase() ? 1 : -1))
                  .filter((data) => data.user_team === user.user_team && data.user_disable !== 1
                  && ((data.user_role === 'sales' || data.user_role === 'salesManager' || data.user_role === 'seniorManager')))
                  .filter((thing, index, self) => index === self.findIndex((t) => (t.user_id === thing.user_id)))]);
            }

            // setStatusSelected({ user_fullname: 'All', user_id: 'All' });
          }
        });
      setIsLoading(false);
    } catch (err) {
      console.error(err.respones);
    }
  }, [view, startdate, enddate, statusSelected]);

  useEffect(() => {
    getReport();
    // console.log(view, startdate, enddate, statusSelected);
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
                      Sales Forecast vs.Actual Report
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
                    height: 100
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
              &nbsp;Cargo Readiness
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
                          Team
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
                          {Team2.filter((data) => ((user.user_role === 'marketingManager' || user.user_role === 'management') ? true : (data === user.user_team)))
                            .map((obj) => (
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
                          Sales
                        </Typography>
                        <Autocomplete
                          autoHighlight
                          value={statusSelected}
                          getOptionLabel={(option) => option.user_fullname}
                          options={status}
                          size="small"
                          onChange={(event, value) => setStatusSelected(value)}
                          renderInput={(params) => (
                            <TextField
                              fullWidth
                              name="InquiryList"
                              variant="outlined"
                              {...params}
                            />
                          )}
                        />
                      </Box>
                    </Box>
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{ mt: 4, mr: 2 }}
                      >
                        Currency: USD
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
                <Box sx={{ mt: 2 }}>
                  <SalesForecastListTable
                    invoices={report}
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

export default ReportSalesForecast;
