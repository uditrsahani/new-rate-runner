import { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Box, Container, Grid, Typography } from '@material-ui/core';
import { ListTable } from '../../components/dashboard/SalesProfile';
import useMounted from '../../hooks/useMounted';
import useSettings from '../../hooks/useSettings';
import gtm from '../../lib/gtm';
import instance from '../../store/instance';

const InvoiceList = () => {
  const mounted = useMounted();
  const { settings } = useSettings();
  const [Sales, setSales] = useState([]);
  const [SalesList, setSalesList] = useState([]);
  const user = JSON.parse(window.localStorage.getItem('user'));
  const role = user.user_role;

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const getOrders = useCallback(async () => {
    try {
      let url;
      if (role === 'salesManager' || role === 'seniorManager' || role === 'sales') {
        url = 'user/team';
        await instance.get(url)
          .then((res) => {
            setSales(res.data
              .sort((a, b) => (a.user_fullname.toUpperCase() > b.user_fullname.toUpperCase() ? 1 : -1))
              .map((val) => ({ id: val.user_id, value: val.user_fullname })));
            setSalesList(res.data
              .sort((a, b) => (a.user_fullname.toUpperCase() > b.user_fullname.toUpperCase() ? 1 : -1)));
          });
      } else if (role === 'marketingManager' || role === 'marketing' || role === 'management') {
        url = 'profile/sale';
        await instance.get(url)
          .then((res) => {
            setSales(res.data
              .filter((data) => (data.user_role === 'sales' || data.user_role === 'salesManager' || data.user_role === 'seniorManager'))
              .sort((a, b) => (a.user_fullname.toUpperCase() > b.user_fullname.toUpperCase() ? 1 : -1))
              .map((val) => ({ id: val.user_id, value: val.user_fullname })));
            setSalesList(res.data
              .filter((data) => (data.user_role === 'sales' || data.user_role === 'salesManager' || data.user_role === 'seniorManager'))
              .sort((a, b) => (a.user_fullname.toUpperCase() > b.user_fullname.toUpperCase() ? 1 : -1)));
          });
      }
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
                Sales Profile
              </Typography>
            </Grid>
          </Grid>
          <Box sx={{ mt: 3 }}>
            <ListTable
              Sales={Sales}
              SalesList={SalesList}
            />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default InvoiceList;
