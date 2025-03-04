import { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Box, Container, Dialog, Grid, Typography } from '@material-ui/core';
import { RateTableListTable } from '../../components/dashboard/ExportRateTable';
import useMounted from '../../hooks/useMounted';
import useSettings from '../../hooks/useSettings';
import gtm from '../../lib/gtm';
import instance from '../../store/instance';
import { useDispatch, useSelector } from '../../store';
import { CalendarEventForm } from '../../components/dashboard/calendar';
import { closeModal } from '../../slices/calendar';

const selectedEventSelector = (state) => {
  const { events, selectedEventId } = state.calendar;

  if (selectedEventId) {
    return events.find((_event) => _event.id === selectedEventId);
  }

  return null;
};

const RateTableList = () => {
  const dispatch = useDispatch();
  const mounted = useMounted();
  const { settings } = useSettings();
  // eslint-disable-next-line no-unused-vars
  const [RateTables, setRateTables] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const { events, isModalOpen, selectedRange } = useSelector((state) => state.calendar);
  const selectedEvent = useSelector(selectedEventSelector);

  const getRateTables = useCallback(async () => {
    try {
      await instance.get('/table/rate')
        .then((res) => {
          setRateTables(res.data
            .sort((a, b) => (a.rate_timestamp < b.rate_timestamp ? 1 : -1)));
        });
    } catch (err) {
      console.error(err);
    }
  }, [mounted]);

  useEffect(() => {
    getRateTables();
  }, [getRateTables]);
  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const handleModalClose = () => {
    dispatch(closeModal());
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
                Export Data to Excel
              </Typography>
            </Grid>
          </Grid>
          <Box sx={{ mt: 3 }}>
            <RateTableListTable
              RateTables={RateTables}
            />
          </Box>
          <Dialog
            fullWidth
            maxWidth="sm"
            onClose={handleModalClose}
            open={isModalOpen}
          >
            {/* Dialog renders its body even if not open */}
            {isModalOpen && (
              <CalendarEventForm
                event={selectedEvent}
                onAddComplete={handleModalClose}
                onCancel={handleModalClose}
                onDeleteComplete={handleModalClose}
                onEditComplete={handleModalClose}
                range={selectedRange}
              />
            )}
          </Dialog>
        </Container>
      </Box>
    </>
  );
};

export default RateTableList;
