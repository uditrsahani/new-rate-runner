import { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Box, Container, Grid, Typography } from '@material-ui/core';
import { ListTable } from '../../components/dashboard/UserTable';
import useMounted from '../../hooks/useMounted';
import useSettings from '../../hooks/useSettings';
import gtm from '../../lib/gtm';
import instance from '../../store/instance';

const InvoiceList = () => {
  const mounted = useMounted();
  const { settings } = useSettings();
  const [User, setUser] = useState([]);
  const [UserList, setUserList] = useState([]);

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const getOrders = useCallback(async () => {
    try {
      await instance.get('/user')
        .then((res) => {
          setUserList(res.data
            .sort((a, b) => (a.user_mail.toUpperCase() > b.user_mail.toUpperCase() ? 1 : -1)));
          setUser(res.data
            .sort((a, b) => (a.user_mail.toUpperCase() > b.user_mail.toUpperCase() ? 1 : -1))
            .map((val) => ({ id: val.user_id, value: val.user_mail }))
            .filter((thing, index, self) => index === self.findIndex((t) => (
              t.value === thing.value
            ))));
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
                Authorized
              </Typography>
            </Grid>
          </Grid>
          <Box sx={{ mt: 3 }}>
            <ListTable
              User={User}
              UserList={UserList}
            />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default InvoiceList;
