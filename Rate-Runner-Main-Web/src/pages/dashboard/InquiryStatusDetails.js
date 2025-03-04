import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Box,
  Container,
  Divider,
  Grid,
  Tab,
  Tabs,
  Typography
} from '@material-ui/core';
import {
  AccountBillingSettings,
  AccountGeneralSettings,
  AccountNotificationsSettings,
  AccountSecuritySettings
} from '../../components/dashboard/inquiryStatus';
import useSettings from '../../hooks/useSettings';
import gtm from '../../lib/gtm';

const tabs = [
  { label: 'Inquiry', value: 'Inquiry' },
  { label: 'Rate offer', value: 'CheckRate' },
  { label: 'Quotation', value: 'Quotation' },
  { label: 'Result', value: 'Result' }
];

const Account = () => {
  const { settings } = useSettings();
  const [currentTab, setCurrentTab] = useState('Inquiry');

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const handleTabsChange = (event, value) => {
    setCurrentTab(value);
  };

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
                Inquiry No.: 2100999
              </Typography>
            </Grid>
          </Grid>
          <Box sx={{ mt: 3 }}>
            <Tabs
              indicatorColor="primary"
              onChange={handleTabsChange}
              scrollButtons="auto"
              textColor="primary"
              value={currentTab}
              variant="scrollable"
            >
              {tabs.map((tab) => (
                <Tab
                  key={tab.value}
                  label={tab.label}
                  value={tab.value}
                />
              ))}
            </Tabs>
          </Box>
          <Divider />
          <Box sx={{ mt: 3 }}>
            {currentTab === 'Inquiry' && <AccountGeneralSettings />}
            {currentTab === 'CheckRate' && <AccountBillingSettings />}
            {currentTab === 'Quotation' && <AccountNotificationsSettings />}
            {currentTab === 'Result' && <AccountSecuritySettings />}
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Account;
