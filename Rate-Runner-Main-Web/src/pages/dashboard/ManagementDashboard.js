import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Box, Container, Grid, Typography } from '@material-ui/core';
import useSettings from '../../hooks/useSettings';
import gtm from '../../lib/gtm';
import { ManagementDashboardAllinq, ManagementDashboardWINinq, ManagementDashboardLOSSInq, ManagementTopRank } from '../../components/dashboard/management';

const ManagementDashboard = () => {
  const { settings } = useSettings();

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
                Management Dashboard*
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
              <ManagementDashboardAllinq />
            </Grid>
            <Grid
              item
              xl={3}
              md={4}
              xs={12}
            >
              <ManagementDashboardWINinq />
            </Grid>
            <Grid
              item
              xl={3}
              md={4}
              xs={12}
            >
              <ManagementDashboardLOSSInq />
            </Grid>
          </Grid>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              xl={6}
              md={8}
              xs={12}
            >
              <ManagementTopRank />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default ManagementDashboard;
