import { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Box, Container, Grid, Typography } from '@material-ui/core';
import { ListTable } from '../../components/dashboard/CalendarTable';
import useMounted from '../../hooks/useMounted';
import useSettings from '../../hooks/useSettings';
import gtm from '../../lib/gtm';
import instance from '../../store/instance';

const InvoiceList = () => {
  const mounted = useMounted();
  const { settings } = useSettings();
  const [HolidayList, setHolidayList] = useState([]);

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const getOrders = useCallback(async () => {
    try {
      await instance.get('/schedule/holiday')
        .then((res) => {
          setHolidayList(res.data
            .sort((a, b) => (Number(a.cd_date) < Number(b.cd_date) ? 1 : -1))
            .sort((a, b) => (Number(a.cd_month) > Number(b.cd_month) ? 1 : -1)));
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
                Calendar
              </Typography>
            </Grid>
          </Grid>
          <Box sx={{ mt: 3 }}>
            <ListTable
              HolidayList={HolidayList}
            />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default InvoiceList;
