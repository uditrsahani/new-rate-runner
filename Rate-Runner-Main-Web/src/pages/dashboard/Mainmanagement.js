import { useEffect, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Box, Container, Divider, Grid, Typography, Tab, Tabs, TextField } from '@material-ui/core';
import {
  FinanceOverview,
  Customer,
  KeyCustomer,
  Sales,
  POL,
  POD,
  Carrier
} from '../../components/dashboard/finance';
import useSettings from '../../hooks/useSettings';

const tabs = [
  { label: 'Customer', value: 'Customer' },
  { label: 'Key Customer', value: 'KeyCustomer' },
  { label: 'Sales', value: 'Sales' },
  { label: 'POL', value: 'POL' },
  { label: 'POD', value: 'POD' },
  { label: 'Carrier', value: 'Carrier' }
];

const Finance = () => {
  const { settings } = useSettings();
  const [currentTab, setCurrentTab] = useState('Customer');
  const [year, setYear] = useState(new Date().getFullYear());
  const [tmpyear, setTmpyear] = useState(new Date().getFullYear());

  const getReport = useCallback(async () => {
    setYear(tmpyear);
  }, [tmpyear]);
  useEffect(() => {
    getReport();
  }, [getReport]);

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
                Management Dashboard
              </Typography>
            </Grid>
            <Grid sx={{ mt: 3 }}>
              <TextField
                size="small"
                fullWidth
                name="year"
                onChange={(val) => {
                  setTmpyear(val.target.value);
                }}
                select
                SelectProps={{ native: true }}
                variant="outlined"
              >
                {[2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026].map((obj) => (
                  <option
                    key={obj}
                    value={obj}
                    selected={new Date().getFullYear() === obj}
                  >
                    {obj}
                  </option>
                ))}
              </TextField>

            </Grid>
          </Grid>

          <Box sx={{ mt: 3 }}>
            <Grid
              container
              spacing={3}
            >
              <Grid
                item
                xs={12}
              >
                <FinanceOverview year={year} />
              </Grid>
              <Grid
                item
                md={12}
                xs={12}
              >
                <Box>
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
                  {currentTab === 'Customer' && (
                  <Customer
                    year={year}
                  />
                  )}
                  {currentTab === 'KeyCustomer' && (
                  <KeyCustomer
                    year={year}
                  />
                  )}
                  {currentTab === 'Sales' && (
                  <Sales
                    year={year}
                  />
                  )}
                  {currentTab === 'POL' && (
                  <POL
                    year={year}
                  />
                  )}
                  {currentTab === 'POD' && (
                  <POD
                    year={year}
                  />
                  )}
                  {currentTab === 'Carrier' && (
                  <Carrier
                    year={year}
                  />
                  )}
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Finance;
