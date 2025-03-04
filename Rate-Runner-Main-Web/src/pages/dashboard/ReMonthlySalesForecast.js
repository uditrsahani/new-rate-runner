import { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Box, Container, Grid, Typography } from '@material-ui/core';
import { ReforecastTable } from '../../components/dashboard/MonthlySalesForecast';
import useMounted from '../../hooks/useMounted';
import useSettings from '../../hooks/useSettings';
import gtm from '../../lib/gtm';
import instance from '../../store/instance';
import Moment from 'moment';

const InvoiceList = () => {
  const mounted = useMounted();
  const { settings } = useSettings();
  const [MonthlyTables, setMonthlyTables] = useState([]);
  const [MonthlyList, setMonthlyList] = useState([]);
  const [Customer, setCustomer] = useState([]);
  const [Week, setWeek] = useState([]);

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const getOrders = useCallback(async () => {
    try {
      await instance.get('/forecast')
        .then((res) => {
          if (mounted.current) {
            setMonthlyTables(res.data
              .sort((a, b) => (a.fc_week_no < b.fc_week_no ? 1 : -1)));
            setMonthlyList(res.data
              .sort((a, b) => (a.fc_week_no > b.fc_week_no ? 1 : -1))
              .map((val) => ({ id: val.fc_uuid, value: val.fc_no })));
            const tmp2 = [{ id: '', value: '' }];
            for (let i = Number(Moment(`2021-${new Date().getMonth() + 1}-01`).format('W')); i < 53; i++) {
              tmp2.push({ id: i,
                value: i });
            }
            setWeek(tmp2);
          }
        });
      await instance.get('/profile/customer/')
        .then((res) => {
          setCustomer(res.data
            .sort((a, b) => (a.cus_name.toUpperCase() > b.cus_name.toUpperCase() ? 1 : -1))
            .map((val) => ({ id: val.cus_id, value: val.cus_name })));
        });
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
                Re-Forecast
              </Typography>
            </Grid>
          </Grid>
          <Box sx={{ mt: 3 }}>
            <ReforecastTable
              MonthlyTables={MonthlyTables}
              MonthlyList={MonthlyList}
              Customer={Customer}
              Week={Week}
            />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default InvoiceList;
