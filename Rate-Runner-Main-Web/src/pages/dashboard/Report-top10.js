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
import { InvoiceListTable } from '../../components/dashboard/Report-top10';
import useSettings from '../../hooks/useSettings';
import GetAppIcon from '@material-ui/icons/GetApp';
import gtm from '../../lib/gtm';
import DatePicker from '@material-ui/lab/DatePicker';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import Moment from 'moment';
import instance from '../../store/instance';

const InvoiceList = () => {
  const { settings } = useSettings();
  const [report, setReport] = useState([]);
  const [startdate, setStartDate] = useState(Moment(new Date()).format('YYYY-MM-DD'));
  const [enddate, setEndDate] = useState(Moment(new Date()).format('YYYY-MM-DD'));
  const [summary, setSummary] = useState({});
  const [view, setView] = useState('Customer');
  const user = JSON.parse(window.localStorage.getItem('user'));

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const downLoadFile = async () => {
    const start = `${startdate} 00:00:00`;
    const end = `${enddate} 23:59:59`;
    let vv = '';
    if (view !== 'Key Customer') {
      vv = view.toLowerCase();
    } else {
      vv = 'key';
    }
    await instance.get(`/inquiry/export/top?group=${vv}&inq_status=close&inq_disable=0&inq_date_from=${start}&inq_date_to=${end}`,
      {
        method: 'GET',
        responseType: 'blob'
      })
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${Date.now()}.xlsx`);
        document.body.appendChild(link);
        link.click();
      });
  };

  const getReport = useCallback(async () => {
    // console.log(view.toLowerCase(), startdate, enddate);
    const start = `${startdate} 00:00:00`;
    const end = `${enddate} 23:59:59`;
    let vv = '';
    if (view !== 'Key Customer') {
      vv = view.toLowerCase();
    } else {
      vv = 'key';
    }

    try {
      await instance.get(`/inquiry/report/top?group=${vv}&inq_status=close&inq_disable=0&inq_date_from=${start}&inq_date_to=${end}`)
        .then((res) => {
          const limit = 10;
          const tmpReport = [];
          let sumRevenue = 0;
          let sumRevenueWin = 0;
          let sumRevenueLose = 0;
          let sumGP = 0;
          let sumGPWin = 0;
          let sumGPLose = 0;

          res.data.map((val, index) => {
            sumRevenue += Number(val.inq_revenue_sum);
            sumRevenueWin += Number(val.win_revenue_sum);
            sumRevenueLose += Number(val.loss_revenue_sum);
            sumGP += Number(val.inq_gp_sum);
            sumGPWin += Number(val.win_gp_sum);
            sumGPLose += Number(val.loss_gp_sum);
            if (index < limit) {
              tmpReport.push(val);
            }
            return null;
          });
          const tempsummary = {
            sumRevenue,
            sumGP,
            sumRevenueWin,
            sumGPWin,
            sumRevenueLose,
            sumGPLose
          };
          setSummary(tempsummary);
          setReport(tmpReport);
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
                Top 10 Report
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
                    width: 300
                  }}
                >
                  <Typography
                    variant="h6"
                  >
                    View
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
                    {['Customer',
                      'Key Customer',
                      'Sales',
                      'POL',
                      'POD',
                      'Carrier'
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
            <InvoiceListTable
              invoices={report}
              view={view}
              summary={summary}
            />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default InvoiceList;
