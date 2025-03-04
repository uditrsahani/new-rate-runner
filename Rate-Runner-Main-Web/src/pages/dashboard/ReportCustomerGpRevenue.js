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
import { CustomerGPRevenueListTable } from '../../components/dashboard/Report';
import useMounted from '../../hooks/useMounted';
import useSettings from '../../hooks/useSettings';
import GetAppIcon from '@material-ui/icons/GetApp';
import gtm from '../../lib/gtm';
import instance from '../../store/instance';

const ReportCustomerGpRevenue = () => {
  const mounted = useMounted();
  const { settings } = useSettings();
  const [report, setReport] = useState([]);
  const [key] = useState('key');
  const [status, setStatus] = useState([]);
  const [statusSelected, setStatusSelected] = useState({ cus_id: '' });
  const [view, setView] = useState('');
  const [customerType, setCustomerType] = useState([]);
  const user = JSON.parse(window.localStorage.getItem('user'));
  const [summary, setSummary] = useState({});

  useEffect(() => {
    const currentDate = new Date().getFullYear();
    let temp1 = new Date().getFullYear();
    setView(currentDate);
    const year = [];
    year.push(currentDate);
    for (let i = 0; i < 10; i++) {
      year.push(
        temp1 - 1
      );
      temp1--;
      if (i === 9) {
        setCustomerType(year);
      }
    }
    gtm.push({ event: 'page_view' });
  }, []);

  const downLoadFile = async () => {
    let url = `/inquiry/export/key?year=${view}`;
    if (statusSelected.cus_id !== '' && statusSelected.cus_id !== 'All' && statusSelected.cus_id !== undefined) {
      url += `&inq_cus_id=${statusSelected.cus_id}`;
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
      setStatusSelected({ cus_name: 'All', cus_id: 'All' });
    }
    if (!view) {
      setView(new Date().getFullYear());
    }
    try {
      if (view != null && view !== undefined && view !== '') {
        let url = `/inquiry/report/key?year=${view}`;
        if (statusSelected.cus_id !== '' && statusSelected.cus_id !== 'All' && statusSelected.cus_id !== undefined) {
          url += `&inq_cus_id=${statusSelected.cus_id}`;
        }
        await instance.get(url)
          .then((res) => {
            if (mounted.current) {
              setReport(res.data);
              let sumRevenueAll = 0;
              let sumGPAll = 0;
              let sumRevenue1 = 0;
              let sumGP1 = 0;
              let sumRevenue2 = 0;
              let sumGP2 = 0;
              let sumRevenue3 = 0;
              let sumGP3 = 0;
              let sumRevenue4 = 0;
              let sumGP4 = 0;
              let sumRevenue5 = 0;
              let sumGP5 = 0;
              let sumRevenue6 = 0;
              let sumGP6 = 0;
              let sumRevenue7 = 0;
              let sumGP7 = 0;
              let sumRevenue8 = 0;
              let sumGP8 = 0;
              let sumRevenue9 = 0;
              let sumGP9 = 0;
              let sumRevenue10 = 0;
              let sumGP10 = 0;
              let sumRevenue11 = 0;
              let sumGP11 = 0;
              let sumRevenue12 = 0;
              let sumGP12 = 0;

              res.data.map((val) => {
                sumRevenueAll += Number(val.inq_revenue_sum);
                sumGPAll += Number(val.inq_gp_sum);
                sumRevenue1 += Number(val.month_1_revenue);
                sumGP1 += Number(val.month_1_gp);
                sumRevenue2 += Number(val.month_2_revenue);
                sumGP2 += Number(val.month_2_gp);
                sumRevenue3 += Number(val.month_3_revenue);
                sumGP3 += Number(val.month_3_gp);
                sumRevenue4 += Number(val.month_4_revenue);
                sumGP4 += Number(val.month_4_gp);
                sumRevenue5 += Number(val.month_5_revenue);
                sumGP5 += Number(val.month_5_gp);
                sumRevenue6 += Number(val.month_6_revenue);
                sumGP6 += Number(val.month_6_gp);
                sumRevenue7 += Number(val.month_7_revenue);
                sumGP7 += Number(val.month_7_gp);
                sumRevenue8 += Number(val.month_8_revenue);
                sumGP8 += Number(val.month_8_gp);
                sumRevenue9 += Number(val.month_9_revenue);
                sumGP9 += Number(val.month_9_gp);
                sumRevenue10 += Number(val.month_10_revenue);
                sumGP10 += Number(val.month_10_gp);
                sumRevenue11 += Number(val.month_11_revenue);
                sumGP11 += Number(val.month_11_gp);
                sumRevenue12 += Number(val.month_12_revenue);
                sumGP12 += Number(val.month_12_gp);
                return null;
              });
              const tempsummary = {
                sumRevenueAll,
                sumGPAll,
                sumRevenue1,
                sumGP1,
                sumRevenue2,
                sumGP2,
                sumRevenue3,
                sumGP3,
                sumRevenue4,
                sumGP4,
                sumRevenue5,
                sumGP5,
                sumRevenue6,
                sumGP6,
                sumRevenue7,
                sumGP7,
                sumRevenue8,
                sumGP8,
                sumRevenue9,
                sumGP9,
                sumRevenue10,
                sumGP10,
                sumRevenue11,
                sumGP11,
                sumRevenue12,
                sumGP12
              };
              setSummary(tempsummary);
            }
          });
      }
    } catch (err) {
      console.error(err.respones);
    }
  }, [view, statusSelected]);

  const getSales = useCallback(async () => {
    try {
      await instance.get(`/profile/customer?cus_type=${key}`)
        .then((res) => {
          if (mounted.current) {
            setStatus([{ cus_name: 'All', cus_id: 'All' },
              ...res.data.sort((a, b) => (a.cus_name.toUpperCase() > b.cus_name.toUpperCase() ? 1 : -1))]);
            setStatusSelected({ cus_name: 'All', cus_id: 'All' });
          }
        });
    } catch (err) {
      console.error(err.respones);
    }
  }, [mounted]);

  useEffect(() => {
    getReport();
  }, [getReport]);

  useEffect(() => {
    getSales();
  }, [getSales]);
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
                Key Account Customer Revenue & G/P By Month Report
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
                    Year
                  </Typography>
                  <Autocomplete
                    autoHighlight
                    value={view}
                    options={customerType}
                    size="small"
                    onChange={(event, value) => setView(value)}
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
                    Key Account Customer
                  </Typography>
                  <Autocomplete
                    autoHighlight
                    value={statusSelected}
                    getOptionLabel={(option) => option.cus_name}
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
            <CustomerGPRevenueListTable
              invoices={report}
              summary={summary}
            />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default ReportCustomerGpRevenue;
