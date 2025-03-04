import { useCallback, useEffect, useState } from 'react';
import { Box, Container, Grid, Typography, Skeleton } from '@material-ui/core';
import {
  AnalyticsGeneralOverview,
  AnalyticsSocialMediaSources
} from '../../components/dashboard/analytics';
import useMounted from '../../hooks/useMounted';
import { InqStatusTable } from '../../components/dashboard/inquiryStatus';
import useSettings from '../../hooks/useSettings';
import gtm from '../../lib/gtm';
import instance from '../../store/instance';

const Analytics = () => {
  const { settings } = useSettings();
  const mounted = useMounted();
  const [Inquiry, setInquiry] = useState();
  const [inqList, setInqList] = useState();
  const [cusList, setCusList] = useState();
  const [PortList, setPortList] = useState();
  const [salesList, setSalesList] = useState();
  const [MonthlyTables, setMonthlyTables] = useState([]);
  const user = JSON.parse(window.localStorage.getItem('user'));
  const [isLoading, setIsLoading] = useState(true);

  const getRateTables = useCallback(async () => {
    if (mounted.current) {
      try {
        await instance.get('/forecast')
          .then((res) => {
            setMonthlyTables(res.data);
          });
        await instance.get('/inquiry?dash_status=true')
          .then((res) => {
            setInqList(res.data
              .sort((a, b) => (a.inq_no.toUpperCase() < b.inq_no.toUpperCase() ? 1 : -1))
              .map((val) => ({ id: val.inq_uuid, value: val.inq_no })));
            setInquiry(res.data
              .sort((a, b) => (a.inq_no.toUpperCase() < b.inq_no.toUpperCase() ? 1 : -1)));
          });
        await instance.get('/profile/customer')
          .then((res) => {
            setCusList(res.data
              .sort((a, b) => (a.cus_name.toUpperCase() > b.cus_name.toUpperCase() ? 1 : -1))
              .map((val) => ({ id: val.cus_id, value: val.cus_name })));
          });
        /* await instance.get('/user')
          .then((res) => {
            setSalesList(res.data
              .sort((a, b) => (a.user_fullname.toUpperCase() > b.user_fullname.toUpperCase() ? 1 : -1))
              .map((val) => ({ id: val.user_id, value: val.user_fullname })));
          }); */
        await instance.get('/profile/sale')
          .then((res) => {
            if ((user.user_role === 'marketingManager' || user.user_role === 'management' || user.user_role === 'marketing')) {
              setSalesList(res.data.filter((data) => data.user_disable !== 1 && data.user_role !== 'dataAdmin'
            && data.user_role !== 'systemAdmin' && data.user_role !== 'management')
                .filter((thing, index, self) => index === self.findIndex((t) => (
                  t.user_id === thing.user_id
                )))
                .sort((a, b) => (a.user_fullname.toUpperCase() > b.user_fullname.toUpperCase() ? 1 : -1))
                .map((val) => ({ id: val.user_id, value: val.user_fullname })));
            } else {
              setSalesList(res.data.filter((data) => data.user_team === user.user_team && data.user_disable !== 1
            && data.user_role !== 'dataAdmin' && data.user_role !== 'systemAdmin' && data.user_role !== 'management')
                .filter((thing, index, self) => index === self.findIndex((t) => (
                  t.user_id === thing.user_id
                )))
                .sort((a, b) => (a.user_fullname.toUpperCase() > b.user_fullname.toUpperCase() ? 1 : -1))
                .map((val) => ({ id: val.user_id, value: val.user_fullname })));
            }
          });
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
      } catch (err) {
        console.error(err);
      }
    }
  }, [mounted]);

  useEffect(() => {
    getRateTables();
  }, [getRateTables]);
  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

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
                sx={{ mt: -4 }}
              >
                <Grid item>
                  <Typography
                    color="textPrimary"
                    variant="h5"
                  >
                    Inquiry Status
                  </Typography>
                </Grid>
              </Grid>
              <Grid
                container
                spacing={2}
                sx={{ py: 2 }}
              >
                <Grid
                  item
                  xl={3}
                  md={4}
                  xs={12}
                >
                  {inqList !== undefined
                    && <AnalyticsSocialMediaSources data={Inquiry} />}
                </Grid>
                <Grid
                  item
                  xl={9}
                  md={8}
                  xs={12}
                >
                  {inqList !== undefined
                    && (
                    <AnalyticsGeneralOverview
                      data={Inquiry}
                      MonthlyTables={MonthlyTables}
                    />
                    )}
                </Grid>
              </Grid>
              <Grid sx={{ mt: 0 }}>
                {inqList && cusList && PortList && salesList
                  && (
                  <InqStatusTable
                    inqList={inqList}
                    cusList={cusList}
                    PortList={PortList}
                    salesList={salesList}
                    Inquiry={Inquiry}
                  />
                  )}
              </Grid>
            </Container>
          </Box>
        )}
    </>
  );
};

export default Analytics;
