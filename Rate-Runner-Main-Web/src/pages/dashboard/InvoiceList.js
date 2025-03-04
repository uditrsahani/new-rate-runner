import { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Box, Button, Container, Grid, Typography } from '@material-ui/core';
import { invoiceApi } from '../../__fakeApi__/invoiceApi';
import { InvoiceListTable } from '../../components/dashboard/inquiry';
import useMounted from '../../hooks/useMounted';
import useSettings from '../../hooks/useSettings';
import PlusIcon from '../../icons/Plus';
import gtm from '../../lib/gtm';

const InvoiceList = () => {
  const mounted = useMounted();
  const { settings } = useSettings();
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const getInvoices = useCallback(async () => {
    try {
      const data = await invoiceApi.getInvoices();

      if (mounted.current) {
        setInvoices(data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [mounted]);

  useEffect(() => {
    getInvoices();
  }, [getInvoices]);

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
                Inquiry
              </Typography>
            </Grid>
            <Grid item>
              <Box sx={{ m: -1 }}>
                <Button
                  color="primary"
                  startIcon={<PlusIcon fontSize="small" />}
                  sx={{ m: 1 }}
                  variant="contained"
                >
                  New Inquiry
                </Button>
              </Box>
            </Grid>
          </Grid>
          <Box sx={{ mt: 3 }}>
            <InvoiceListTable invoices={invoices} />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default InvoiceList;
