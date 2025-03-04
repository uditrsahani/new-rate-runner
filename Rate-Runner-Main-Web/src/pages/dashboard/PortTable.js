import { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Box, Container, Grid, Typography, Skeleton } from '@material-ui/core';
import { ListTable } from '../../components/dashboard/PortTable';
import useMounted from '../../hooks/useMounted';
import useSettings from '../../hooks/useSettings';
import gtm from '../../lib/gtm';
import instance from '../../store/instance';

const InvoiceList = () => {
  const mounted = useMounted();
  const { settings } = useSettings();
  const [Port, setPort] = useState([]);
  const [PortList, setPortList] = useState([]);
  const [Country, setCountry] = useState([]);
  const [City, setCity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const getOrders = useCallback(async () => {
    try {
      await instance.get('/table/city')
        .then((res) => {
          setCountry(res.data
            .sort((a, b) => (a.cc_country_name.toUpperCase() > b.cc_country_name.toUpperCase() ? 1 : -1))
            .map((val) => ({ id: val.cc_country_id, value: val.cc_country_name }))
            .filter((thing, index, self) => index === self.findIndex((t) => (
              t.id === thing.id && t.value === thing.value
            ))));
          setCity(res.data
            .sort((a, b) => (a.cc_city_name.toUpperCase() > b.cc_city_name.toUpperCase() ? 1 : -1))
            .map((val) => ({ id: val.cc_city_id, value: val.cc_city_name }))
            .filter((thing, index, self) => index === self.findIndex((t) => (
              t.id === thing.id && t.value === thing.value
            ))));
        });
      await instance.get('/table/port')
        .then((res) => {
          setPortList(res.data
            .sort((a, b) => (a.port_name.toUpperCase() > b.port_name.toUpperCase() ? 1 : -1)));
          setPort(res.data
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
                Port Table
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
                <ListTable
                  Port={Port}
                  PortList={PortList}
                  Country={Country}
                  City={City}
                />
              )}
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default InvoiceList;
