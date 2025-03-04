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
  Autocomplete
} from '@material-ui/core';
import { MouthlyReportListTable } from '../../components/dashboard/Report';
import useMounted from '../../hooks/useMounted';
import useSettings from '../../hooks/useSettings';
import GetAppIcon from '@material-ui/icons/GetApp';
import gtm from '../../lib/gtm';
import instance from '../../store/instance';
import { Month } from '../../store/data.json';

const ReportMouthlySalesForecast = () => {
  const mounted = useMounted();
  const { settings } = useSettings();
  const [report, setReport] = useState([]);
  const [customerType, setCustomerType] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [monthly, setMonthly] = useState('All');
  const user = JSON.parse(window.localStorage.getItem('user'));
  const [summary, setSummary] = useState({});

  useEffect(() => {
    const currentDate = new Date().getFullYear();
    let temp1 = new Date().getFullYear();
    setYear(currentDate);
    const years = [];
    years.push(currentDate);
    for (let i = 0; i < 10; i++) {
      years.push(
        temp1 - 1
      );
      temp1--;
      if (i === 9) {
        setCustomerType(years);
      }
    }
    gtm.push({ event: 'page_view' });
  }, []);

  const downLoadFile = async () => {
    let url = `/forecast/export/monthly_sales?cargo_readiness_year=${year}`;
    if (monthly !== 'All') {
      url += `&cargo_readiness_month=${monthly}`;
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
    if (!monthly) {
      setMonthly('All');
    }
    if (!year) {
      setYear(new Date().getFullYear());
    }
    // console.log(monthly, year);
    try {
      let url = `/forecast/report/monthly_sales?cargo_readiness_year=${year}`;
      if (monthly !== 'All') {
        url += `&cargo_readiness_month=${monthly}`;
      }
      await instance.get(url)
        .then((res) => {
          if (mounted.current) {
            setReport(res.data);
            let sumRevenue = 0;
            let sumGP = 0;

            res.data.map((val) => {
              sumRevenue += Number(val.fc_revernue);
              sumGP += Number(val.fc_gp);
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
  }, [year, monthly]);

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
                Monthly Sales Forecast
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
                    Year
                  </Typography>
                  <Autocomplete
                    autoHighlight
                    value={year}
                    options={customerType}
                    size="small"
                    onChange={(event, value) => setYear(value)}
                    renderInput={(params) => (
                      <TextField
                        fullWidth
                        sx={{ width: 220 }}
                        name="InquiryList"
                        variant="outlined"
                        {...params}
                      />
                    )}
                  />
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
                    Month
                  </Typography>
                  <TextField
                    size="small"
                    fullWidth
                    onChange={(event) => {
                      setMonthly(event.target.value);
                    }}
                    onInputChange={(val) => {
                      if (val.target.value === undefined) setMonthly('All');
                    }}
                    select
                    SelectProps={{ native: true }}
                    variant="outlined"
                  >
                    <option
                      key="All"
                      value="All"
                    >
                      All
                    </option>
                    {Month.map((obj) => (
                      <option
                        key={obj.value}
                        value={obj.value}
                      >
                        {obj.label}
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
            <MouthlyReportListTable
              invoices={report}
              summary={summary}
            />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default ReportMouthlySalesForecast;
