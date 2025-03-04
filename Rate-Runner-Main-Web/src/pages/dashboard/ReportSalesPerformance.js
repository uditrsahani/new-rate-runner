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
import { SalesPerformanceListTable } from '../../components/dashboard/Report';
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

const ReportSalesPerformance = () => {
  const mounted = useMounted();
  const { settings } = useSettings();
  const [report, setReport] = useState([]);
  const [startdate, setStartDate] = useState(Moment(new Date()).format('YYYY-MM-DD'));
  const [enddate, setEndDate] = useState(Moment(new Date()).format('YYYY-MM-DD'));
  const [view, setView] = useState('All');
  const [total, setTotal] = useState(0);
  const [win, setWin] = useState(0);
  const [loss, setLoss] = useState(0);
  const [pending, setPending] = useState(0);
  const [disable, setDisable] = useState(0);
  const user = JSON.parse(window.localStorage.getItem('user'));

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const downLoadFile = async () => {
    const start = `${startdate} 00:00:00`;
    const end = `${enddate} 23:59:59`;
    let url = `/inquiry/export/sale?inq_disable=0&inq_date_from=${start}&inq_date_to=${end}`;
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
    // console.log(view, startdate, enddate);
    const start = `${startdate} 00:00:00`;
    const end = `${enddate} 23:59:59`;
    try {
      let url = `/inquiry/report/sale?inq_disable=0&inq_date_from=${start}&inq_date_to=${end}`;
      if (view !== 'All') {
        url += `&user_team=${view}`;
      }
      await instance.get(url)
        .then((res) => {
          if (mounted.current) {
            // console.log(res.data);
            setReport(res.data);
            let tempTotal = 0;
            let tempWin = 0;
            let tempLoss = 0;
            let tempPending = 0;
            let tempDisable = 0;
            res.data.map((value) => {
              tempTotal += Number(value.head.count);
              tempWin += Number(value.head.win);
              tempLoss += Number(value.head.loss);
              tempPending += Number(value.head.pending);
              tempDisable += Number(value.head.disable);
              return null;
            });
            setTotal(tempTotal);
            setWin(tempWin);
            setLoss(tempLoss);
            setPending(tempPending);
            setDisable(tempDisable);
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
                Sales Performance Report
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
                    {Team2.map((obj) => (
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
            <SalesPerformanceListTable
              invoices={report}
              total={total}
              win={win}
              loss={loss}
              pending={pending}
              disable={disable}
            />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default ReportSalesPerformance;
