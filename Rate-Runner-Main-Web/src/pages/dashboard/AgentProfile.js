import { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Box, Container, Grid, Typography } from '@material-ui/core';
import { ListTable } from '../../components/dashboard/AgentProfile';
import useMounted from '../../hooks/useMounted';
import useSettings from '../../hooks/useSettings';
import gtm from '../../lib/gtm';
import instance from '../../store/instance';

const InvoiceList = () => {
  const mounted = useMounted();
  const { settings } = useSettings();
  const [Agent, setAgent] = useState([]);
  const [AgentList, setAgentList] = useState([]);

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const getOrders = useCallback(async () => {
    try {
      await instance.get('/profile/agent/')
        .then((res) => {
          setAgent(res.data
            .sort((a, b) => (a.agent_id.toUpperCase() > b.agent_name.toUpperCase() ? 1 : -1))
            .map((val) => ({ id: val.agent_id, value: val.agent_name })));
          setAgentList(res.data
            .sort((a, b) => (a.agent_id.toUpperCase() > b.agent_name.toUpperCase() ? 1 : -1)));
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
                Agent Profile
              </Typography>
            </Grid>
          </Grid>
          <Box sx={{ mt: 3 }}>
            <ListTable
              Agent={Agent}
              AgentList={AgentList}
            />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default InvoiceList;
