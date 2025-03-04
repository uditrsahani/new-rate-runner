import { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Box, Container, Grid, Typography, Skeleton } from '@material-ui/core';
import { InvoiceListTable } from '../../components/dashboard/MonthlySalesForecast';
import useMounted from '../../hooks/useMounted';
import useSettings from '../../hooks/useSettings';
import gtm from '../../lib/gtm';
import instance from '../../store/instance';

const InvoiceList = () => {
  const mounted = useMounted();
  const { settings } = useSettings();
  const [MonthlyTables, setMonthlyTables] = useState([]);
  const [MonthlyList, setMonthlyList] = useState([]);
  const [Customer, setCustomer] = useState([]);
  const [PortList, setPortList] = useState();
  const [Sales, setSales] = useState([]);
  const user = JSON.parse(window.localStorage.getItem('user'));
  const userid = user.user_id;
  const userrole = user.user_role;
  const userteam = user.user_team;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const getOrders = useCallback(async () => {
    try {
      await instance.get('/forecast')
        .then((res) => {
          if (mounted.current) {
            // console.log(userrole, res.data);
            if (userrole === 'sales') {
              setMonthlyTables(res.data
                .filter((data) => data.fc_user_id === userid)
                .sort((a, b) => (a.fc_week_no < b.fc_week_no ? 1 : -1)));
              setMonthlyList(res.data
                .filter((data) => data.fc_user_id === userid)
                .sort((a, b) => (a.fc_week_no > b.fc_week_no ? 1 : -1))
                .map((val) => ({ id: val.fc_uuid, value: val.fc_no })));
            } else if (userrole === 'salesManager') {
              setMonthlyTables(res.data
                .filter((data) => data.user_team === userteam)
                .sort((a, b) => (a.fc_week_no < b.fc_week_no ? 1 : -1)));
              setMonthlyList(res.data
                .filter((data) => data.user_team === userteam)
                .sort((a, b) => (a.fc_week_no > b.fc_week_no ? 1 : -1))
                .map((val) => ({ id: val.fc_uuid, value: val.fc_no })));
            } else {
              setMonthlyTables(res.data
                .sort((a, b) => (a.fc_week_no < b.fc_week_no ? 1 : -1)));
              setMonthlyList(res.data
                .sort((a, b) => (a.fc_week_no > b.fc_week_no ? 1 : -1))
                .map((val) => ({ id: val.fc_uuid, value: val.fc_no })));
            }
          }
        });
      await instance.get('/profile/customer/owner')
        .then((res) => {
          setCustomer(res.data
            .sort((a, b) => (a.cus_name.toUpperCase() > b.cus_name.toUpperCase() ? 1 : -1))
            .map((val) => ({ id: val.cus_id, value: val.cus_name })));
        });
      let url;
      if (userrole === 'salesManager' || userrole === 'sales') {
        url = 'user/team';
        await instance.get(url)
          .then((res) => {
            setSales(res.data
              .filter((data) => data.user_disable !== 1)
              .sort((a, b) => (a.user_fullname.toUpperCase() > b.user_fullname.toUpperCase() ? 1 : -1))
              .map((val) => ({ id: val.user_id, value: val.user_fullname })));
          });
      } else if (userrole === 'marketingManager' || userrole === 'marketing' || userrole === 'management') {
        url = 'profile/sale';
        await instance.get(url)
          .then((res) => {
            setSales(res.data
              .filter((data) => data.user_disable !== 1 && (data.user_role === 'sales' || data.user_role === 'salesManager' || data.user_role === 'seniorManager'))
              .sort((a, b) => (a.user_fullname.toUpperCase() > b.user_fullname.toUpperCase() ? 1 : -1))
              .map((val) => ({ id: val.user_id, value: val.user_fullname })));
          });
      }
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
  }, [mounted]);

  useEffect(() => {
    getOrders();
  }, [getOrders]);

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
            spacing={3}
          >
            <Grid item>
              <Typography
                color="textPrimary"
                variant="h5"
              >
                Monthly Sales Forecast
              </Typography>
            </Grid>
          </Grid>
          <Box sx={{ mt: 3 }}>
            {isLoading
              ? (
                <Skeleton
                  sx={{
                    borderRadius: 1,
                    pt: '99.76%',
                    width: '100%'
                  }}
                  variant="rectangular"
                />
              )
              : (
                <InvoiceListTable
                  MonthlyTables={MonthlyTables}
                  MonthlyList={MonthlyList}
                  Customer={Customer}
                  Sales={Sales}
                  PortList={PortList}
                />
              )}
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default InvoiceList;
