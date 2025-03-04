import { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Box, Container, Grid, Typography, Skeleton } from '@material-ui/core';
import { InvoiceListTable } from '../../components/dashboard/UpdateQuotationResult';
import useMounted from '../../hooks/useMounted';
import useSettings from '../../hooks/useSettings';
import gtm from '../../lib/gtm';
import instance from '../../store/instance';

const InvoiceList = () => {
  const mounted = useMounted();
  const { settings } = useSettings();
  const [InquiryTables, setInquiryTables] = useState([]);
  const [InquiryList, setInquiryList] = useState([]);
  const [Customer, setCustomer] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const getOrders = useCallback(async () => {
    try {
      await instance.get('/inquiry?dash_status=true&inq_status=waiting customer&inq_disable=0&inq_qtn=SEND')
        .then((res) => {
          if (mounted.current) {
            setInquiryTables(res.data);
            setInquiryList(res.data.map((val) => ({ id: val.inq_uuid, value: val.inq_no })));
          }
        });
      await instance.get('/profile/customer/owner')
        .then((res) => {
          setCustomer(res.data
            .sort((a, b) => (a.cus_name.toUpperCase() > b.cus_name.toUpperCase() ? 1 : -1))
            .map((val) => ({ id: val.cus_id, value: val.cus_name, type: val.cus_type })));
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
                Update Quotation Result
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
                />
              )}
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default InvoiceList;
