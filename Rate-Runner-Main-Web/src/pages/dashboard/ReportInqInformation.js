import { useCallback, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Autocomplete,
  Box,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  Tab,
  Tabs,
  TextField,
  Typography,
  Skeleton
} from '@material-ui/core';
import { customerApi } from '../../__fakeApi__/customerApi';
import {
  ReportInformationCheckrate,
  ReportInformationDetails,
  ReportInformationQuotation,
  ReportInformationResult
} from '../../components/dashboard/Report';
import useMounted from '../../hooks/useMounted';
import gtm from '../../lib/gtm';
import useSettings from '../../hooks/useSettings';
import instance from '../../store/instance';
import { useParams } from 'react-router-dom';

const tabs = [
  { label: 'Inquiry', value: 'inquiry' },
  { label: 'Rate offer', value: 'checkrate' },
  { label: 'Quotation', value: 'quotation' },
  { label: 'Result', value: 'result' }
];

const ReportInqInformation = () => {
  const mounted = useMounted();
  const { settings } = useSettings();
  const [customer, setCustomer] = useState(null);
  const [currentTab, setCurrentTab] = useState('inquiry');
  const [detail, setDetail] = useState({});
  const [Agent, setAgent] = useState({});
  const [MonthlyTables, setMonthlyTables] = useState([]);
  const [RateAgent, setRateAgent] = useState({});
  const [Inquiry, setInquiry] = useState(null);
  const [selectInquiry, setSelectInquiry] = useState(null);
  const [carrier, setCarrier] = useState();
  const { quoID } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  /* console.log('detail:', detail);
  console.log('Agent:', Agent);
  console.log('RateTable:', RateTable); */

  const getDetail = useCallback(async () => {
    if (!selectInquiry) {
      setSelectInquiry(null);
      setDetail({});
      setAgent({});
    }
    try {
      if (selectInquiry || quoID) {
        const url = (selectInquiry) ? `/inquiry/${selectInquiry}` : `/inquiry/${quoID}`;
        await instance.get(url)
          .then(async (res) => {
            if (mounted.current) {
              setDetail(res.data);
              await instance.get('/forecast').then((res2) => {
                const result = res2.data.filter((data) => data.fc_inq_uuid === res.data.inq_uuid);
                setMonthlyTables(result);
              });

              if (res.data.aq_agent_id && res.data.aq_agent_id !== '') {
                await instance.get(`/profile/agent/${res.data.aq_agent_id}`)
                  .then((res3) => {
                    setAgent(res3.data);
                    setRateAgent(res3.data);
                  });
              }

              if (res.data.rate_agent_id && res.data.rate_agent_id !== '') {
                await instance.get(`/profile/agent/${res.data.rate_agent_id}`)
                  .then((res3) => {
                    setRateAgent(res3.data);
                  });
              }
              if (res.data.rate_cr_id && res.data.rate_cr_id !== '') {
                await instance.get('/profile/carrier')
                  .then((res4) => {
                    setCarrier(res4.data.filter((data) => data.cr_id === res.data.rate_cr_id)[0]);
                  });
              }
            }
          });
      }
    } catch (err) {
      console.error(err);
    }
  }, [selectInquiry]);

  useEffect(() => {
    getDetail();
  }, [getDetail]);

  useEffect(async () => {
    gtm.push({ event: 'page_view' });
    try {
      await instance.get('/inquiry?minimize=true')
        .then((res) => {
          setInquiry(res.data.map((val) => ({ id: val.inq_uuid, value: val.inq_no })));
        });
      setIsLoading(false);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const getCustomer = useCallback(async () => {
    try {
      const data = await customerApi.getCustomer();

      if (mounted.current) {
        setCustomer(data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [mounted]);

  useEffect(() => {
    getCustomer();
  }, [getCustomer]);

  const handleTabsChange = (event, value) => {
    setCurrentTab(value);
  };

  if (!customer) {
    return null;
  }

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
                py: 2,
                ml: -2
              }}
            >
              <Container maxWidth={settings.compact ? 'xl' : false}>
                <Grid
                  container
                  justifyContent="space-between"
                  spacing={3}
                >
                  <Grid
                    item
                    display={(quoID) ? 'block' : 'none'}
                  >
                    <Typography
                      color="textPrimary"
                      variant="h5"
                    >
                      Inquiry No.:&nbsp;
                      {detail.inq_no}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid display={(quoID) ? 'none' : 'block'}>
                  <Card
                    sx={{
                      mt: 3,
                      height: 80
                    }}
                  >
                    <CardContent>
                      <Box
                        sx={{
                          m: 1,
                          maxWidth: '100%',
                          display: 'flex',
                          flexWrap: 'wrap'
                        }}
                        container
                        direction="row"
                        justifyContent="flex-start"
                        alignItems="center"
                      >
                        <Typography
                          variant="h6"
                          sx={{ mr: 3 }}
                        >
                          Inquiry No.
                        </Typography>
                        <Autocomplete
                          autoHighlight
                          options={Inquiry}
                          getOptionLabel={(option) => option.value}
                          onChange={(event, val) => {
                            if (val == null) {
                              setSelectInquiry(null);
                            } else {
                              setSelectInquiry(val.id);
                            }
                          }}
                          name="inqNo"
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              sx={{ width: 220, mt: -0.7 }}
                              size="small"
                              variant="outlined"
                            />
                          )}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Box sx={{ mt: 3 }}>
                  <Tabs
                    indicatorColor="primary"
                    onChange={handleTabsChange}
                    scrollButtons="auto"
                    textColor="primary"
                    value={currentTab}
                    variant="scrollable"
                  >
                    {tabs.map((tab) => (
                      <Tab
                        key={tab.value}
                        label={tab.label}
                        value={tab.value}
                      />
                    ))}
                  </Tabs>
                </Box>
                <Divider />
                <Box sx={{ mt: 3 }}>
                  {currentTab === 'inquiry' && (
                  <Grid
                    container
                    spacing={3}
                  >
                    <Grid
                      item
                      lg={12}
                      md={12}
                      xl={12}
                      xs={12}
                    >
                      <ReportInformationDetails
                        detail={detail}
                      />
                    </Grid>
                  </Grid>
                  )}
                  {currentTab === 'checkrate' && (
                  <ReportInformationCheckrate
                    detail={detail}
                    Agent={Agent}
                    carrier={carrier}
                    RateAgent={RateAgent}
                  />
                  )}
                  {currentTab === 'quotation' && (
                  <ReportInformationQuotation
                    detail={detail}
                    carrier={carrier}
                    Agent={Agent}
                  />
                  )}
                  {currentTab === 'result' && (
                  <ReportInformationResult
                    detail={detail}
                    MonthlyTables={MonthlyTables}
                  />
                  )}
                </Box>
              </Container>
            </Box>
          </>
        )}
    </>
  );
};

export default ReportInqInformation;
