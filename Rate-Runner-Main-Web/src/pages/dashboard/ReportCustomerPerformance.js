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
  TextField
} from '@material-ui/core';
import { CustomerPerformanceListTable } from '../../components/dashboard/Report';
import useMounted from '../../hooks/useMounted';
import useSettings from '../../hooks/useSettings';
import GetAppIcon from '@material-ui/icons/GetApp';
import gtm from '../../lib/gtm';
import DatePicker from '@material-ui/lab/DatePicker';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import Moment from 'moment';
import instance from '../../store/instance';

const ReportCustomerPerformance = () => {
  const mounted = useMounted();
  const { settings } = useSettings();
  const [report, setReport] = useState([]);
  const [startdate, setStartDate] = useState(Moment(new Date()).format('YYYY-MM-DD'));
  const [enddate, setEndDate] = useState(Moment(new Date()).format('YYYY-MM-DD'));
  const [view, setView] = useState('All');
  const [status, setStatus] = useState('All');
  const [summary, setSummary] = useState({});
  const customerType = [
    { label: 'All', value: 'All' },
    { label: 'Key', value: 'key' },
    { label: 'New', value: 'new' },
    { label: 'Current', value: 'current' }
  ];
  const user = JSON.parse(window.localStorage.getItem('user'));

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const downLoadFile = async () => {
    const start = `${startdate} 00:00:00`;
    const end = `${enddate} 23:59:59`;
    let url = `/inquiry/export/customer?inq_disable=0&inq_date_from=${start}&inq_date_to=${end}`;
    if (view !== 'All') {
      url += `&cus_type=${view}`;
    }
    if (status !== 'All') {
      url += `&inq_res_quote_status=${status}`;
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
    // console.log(view, status, startdate, enddate);
    const start = `${startdate} 00:00:00`;
    const end = `${enddate} 23:59:59`;
    try {
      let url = `/inquiry/report/customer?inq_disable=0&inq_date_from=${start}&inq_date_to=${end}`;
      if (view !== 'All') {
        url += `&cus_type=${view}`;
      }
      if (status !== 'All') {
        url += `&inq_res_quote_status=${status}`;
      }
      await instance.get(url)
        .then((res) => {
          if (mounted.current) {
            setReport(res.data);
            let sumRevenue = 0;
            let sumGP = 0;

            res.data.map((val) => {
              sumRevenue += Number(val.inq_revenue);
              sumGP += Number(val.inq_gp);
              return null;
            });
            const tempsummary = {
              sumRevenue,
              sumGP
            };
            setSummary(tempsummary);
          }
        });
    } catch (err) {
      console.error(err.respones);
    }
  }, [view, startdate, enddate, status]);

  useEffect(() => {
    getReport();
  }, [getReport]);

  return (
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
                Customer Performance by Customer Type Report
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
                    Customer Type
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
                    {customerType.map((obj) => (
                      <option
                        key={obj.value}
                        value={obj.value}
                        selected={obj.value === view}
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
                    Quote Status
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
                    {[
                      'All',
                      'PENDING',
                      'WIN',
                      'LOSS'
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
            <CustomerPerformanceListTable
              invoices={report}
              summary={summary}
            />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default ReportCustomerPerformance;
