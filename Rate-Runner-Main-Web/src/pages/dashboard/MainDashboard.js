import { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Box, Container, Grid, Typography } from '@material-ui/core';
import {
  AnalyticsGeneralOverview,
  AnalyticsSocialMediaSources } from '../../components/dashboard/analytics';
import useMounted from '../../hooks/useMounted';
import { OrderListTable } from '../../components/dashboard/order';
import { orderApi } from '../../__fakeApi__/orderApi';
import useSettings from '../../hooks/useSettings';
import gtm from '../../lib/gtm';

const Analytics = () => {
  const { settings } = useSettings();
  const mounted = useMounted();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const getOrders = useCallback(async () => {
    try {
      const data = await orderApi.getOrders();

      if (mounted.current) {
        setOrders(data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [mounted]);

  useEffect(() => {
    getOrders();
  }, [getOrders]);

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  return (
    <>
      <Helmet>
        <title>WICE Rate Runner</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3
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
                Inquiry Status
              </Typography>
            </Grid>
          </Grid>
          <Grid
            container
            spacing={3}
            sx={{ py: 3 }}
          >
            <Grid
              item
              xl={3}
              md={4}
              xs={12}
            >
              <AnalyticsSocialMediaSources />
            </Grid>
            <Grid
              item
              xl={9}
              md={8}
              xs={12}
            >
              <Grid>
                <AnalyticsGeneralOverview />
              </Grid>
            </Grid>
          </Grid>
          <Grid>
            <OrderListTable orders={orders} />
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default Analytics;
