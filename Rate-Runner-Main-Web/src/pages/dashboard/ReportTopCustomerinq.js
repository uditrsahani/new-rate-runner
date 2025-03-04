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
import { TopCustomerInqListTable } from '../../components/dashboard/Report';
import useMounted from '../../hooks/useMounted';
import useSettings from '../../hooks/useSettings';
import GetAppIcon from '@material-ui/icons/GetApp';
import gtm from '../../lib/gtm';
import DatePicker from '@material-ui/lab/DatePicker';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import Moment from 'moment';
import instance from '../../store/instance';

const ReportTopCustomerinq = () => {
  const mounted = useMounted();
  const { settings } = useSettings();
  const [report, setReport] = useState([]);
  const [startdate, setStartDate] = useState(Moment(new Date()).format('YYYY-MM-DD'));
  const [enddate, setEndDate] = useState(Moment(new Date()).format('YYYY-MM-DD'));
  const [view] = useState('customer');
  const user = JSON.parse(window.localStorage.getItem('user'));
  const [summary, setSummary] = useState({});

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const downLoadFile = async () => {
    const start = `${startdate} 00:00:00`;
    const end = `${enddate} 23:59:59`;
    await instance.get(`/inquiry/export/top_customer?inq_disable=0&inq_date_from=${start}&inq_date_to=${end}`,
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
    // console.log(view, startdate, enddate);
    const start = `${startdate} 00:00:00`;
    const end = `${enddate} 23:59:59`;
    try {
      await instance.get(`/inquiry/report/top_customer?inq_disable=0&inq_date_from=${start}&inq_date_to=${end}`)
        .then((res) => {
          if (mounted.current) {
            setReport(res.data);
            let sumRevenue = 0;
            let sumGP = 0;
            let sumInq = 0;
            let sumCont = 0;

            res.data.map((val) => {
              sumRevenue += Number(val.inq_revenue_sum);
              sumGP += Number(val.inq_gp_sum);
              sumInq += Number(val.inq_count);
              sumCont += Number(val.container_count);
              return null;
            });
            const tempsummary = {
              sumRevenue,
              sumGP,
              sumInq,
              sumCont
            };
            setSummary(tempsummary);
          }
        });
    } catch (err) {
      console.error(err.respones);
    }
  }, [view, startdate, enddate]);

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
                Top 10 Customer Inquiry Report
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
            <TopCustomerInqListTable
              invoices={report}
              summary={summary}
            />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default ReportTopCustomerinq;
