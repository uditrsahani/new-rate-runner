import { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Box, Container, Grid, Typography } from '@material-ui/core';
import { ListTable } from '../../components/dashboard/RefernceCalendar';
import useMounted from '../../hooks/useMounted';
import useSettings from '../../hooks/useSettings';
import gtm from '../../lib/gtm';
import instance from '../../store/instance';

const ReferenceCalendar = () => {
  const mounted = useMounted();
  const { settings } = useSettings();
  const [Customer, setCustomer] = useState([]);
  const [CustomerList, setCustomerList] = useState([]);
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const getOrders = useCallback(async () => {
    try {
      await instance.get('/profile/calenda/')
        .then((res) => {
          const temp = [];
          for (let i = 0; i < res.data.length; i++) {
            const date = new Date(res.data);
            temp.push({
              day: dayNames[date.getDay()],
              date: date.getDate(),
              mouth: monthNames[date.getMonth],
              cd_id: res.data[i].cd_id,
              cd_date: res.data[i].cd_date,
              cd_holiday: res.data[i].cd_holiday
            });
            if (i === res.data.length - 1) {
              setCustomer(temp);
              setCustomerList(temp);
            }
          }
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
              Customer={Customer}
              CustomerList={CustomerList}
            />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default ReferenceCalendar;
