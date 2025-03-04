import { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Box, Container, Grid, Typography } from '@material-ui/core';
import { ListTable } from '../../components/dashboard/CompetitorTable';
import useMounted from '../../hooks/useMounted';
import useSettings from '../../hooks/useSettings';
import gtm from '../../lib/gtm';
import instance from '../../store/instance';

const InvoiceList = () => {
  const mounted = useMounted();
  const { settings } = useSettings();
  const [Competitor, setCompetitor] = useState([]);
  const [CompetitorList, setCompetitorList] = useState([]);

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const getOrders = useCallback(async () => {
    try {
      await instance.get('/profile/competitor')
        .then((res) => {
          setCompetitor(res.data
            .sort((a, b) => (a.ct_name.toUpperCase() > b.ct_name.toUpperCase() ? 1 : -1))
            .map((val) => ({ id: val.ct_id, value: val.ct_name })));
          setCompetitorList(res.data
            .sort((a, b) => (a.ct_name.toUpperCase() > b.ct_name.toUpperCase() ? 1 : -1)));
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
                Competitor Profile
              </Typography>
            </Grid>
          </Grid>
          <Box sx={{ mt: 3 }}>
            <ListTable
              Competitor={Competitor}
              CompetitorList={CompetitorList}
            />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default InvoiceList;
