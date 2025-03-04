import { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Box, Container, Grid, Typography, Skeleton } from '@material-ui/core';
import { InvoiceListTable } from '../../components/dashboard/Recommend';
import useMounted from '../../hooks/useMounted';
import useSettings from '../../hooks/useSettings';
import gtm from '../../lib/gtm';
import instance from '../../store/instance';

const InvoiceList = () => {
  const mounted = useMounted();
  const { settings } = useSettings();
  const [InquiryTables, setInquiryTables] = useState([]);
  const [InquiryList, setInquiryList] = useState([]);
  const [PortList, setPortList] = useState();
  const [Sales, setSales] = useState([]);
  const [Customer, setCustomer] = useState([]);
  const user = JSON.parse(window.localStorage.getItem('user'));
  const role = user.user_role;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const getOrders = useCallback(async () => {
    try {
      await instance.get('/inquiry?minimize=true&inq_status=waiting marketing')
        .then((res) => {
          if (mounted.current) {
            setInquiryTables(res.data.sort((a, b) => (a.inq_no > b.inq_no ? 1 : -1)));
            setInquiryList(res.data
              .sort((a, b) => (a.inq_no > b.inq_no ? 1 : -1))
              .map((val) => ({ id: val.inq_uuid, value: val.inq_no })));
          }
        });
      await instance.get('/profile/customer/')
        .then((res) => {
          setCustomer(res.data
            .sort((a, b) => (a.cus_name.toUpperCase() > b.cus_name.toUpperCase() ? 1 : -1))
            .map((val) => ({ id: val.cus_id, value: val.cus_name })));
        });
      let url;
      if (role === 'salesManager' || role === 'sales') {
        url = 'user/team';
        await instance.get(url)
          .then((res) => {
            setSales(res.data
              .filter((data) => data.user_disable !== 1)
              .sort((a, b) => (a.user_fullname.toUpperCase() > b.user_fullname.toUpperCase() ? 1 : -1))
              .map((val) => ({ id: val.user_id, value: val.user_fullname })));
          });
      } else if (role === 'marketingManager' || role === 'marketing' || role === 'management') {
        url = 'profile/sale';
        await instance.get(url)
          .then((res) => {
            setSales(res.data
              .filter((data) => data.user_disable !== 1 && (data.user_role === 'sales' || data.user_role === 'salesManager' || data.user_role === 'seniorManager'))
              .sort((a, b) => (a.user_fullname.toUpperCase() > b.user_fullname.toUpperCase() ? 1 : -1))
              .map((val) => ({ id: val.user_id, value: val.user_fullname })));
          });
      }
      await instance.get('/table/port?port_disable=0')
        .then((res) => {
          setPortList(res.data
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
                Recommend
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
                <InvoiceListTable
                  InquiryTables={InquiryTables}
                  InquiryList={InquiryList}
                  Customer={Customer}
                  Sales={Sales}
                  PortList={PortList}
                />
              )}
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default InvoiceList;
