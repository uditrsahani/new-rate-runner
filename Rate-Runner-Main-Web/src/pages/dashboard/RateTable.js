import { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Box, Container, Dialog, Grid, Typography, Skeleton } from '@material-ui/core';
import { RateTableListTable } from '../../components/dashboard/RateTable';
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
  const [POL, setPOL] = useState([]);
  const [POD, setPOD] = useState([]);
  const [Agent, setAgent] = useState([]);
  const [carrier, setCarrier] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const { events, isModalOpen, selectedRange } = useSelector((state) => state.calendar);
  const selectedEvent = useSelector(selectedEventSelector);
  const [isLoading, setIsLoading] = useState(true);

  const getRateTables = useCallback(async () => {
    try {
      await instance.get('/table/rate')
        .then((res) => {
          setRateTables(res.data
            .sort((a, b) => (a.rate_timestamp < b.rate_timestamp ? 1 : -1)));
        });
      await instance.get('/profile/carrier')
        .then((res) => {
          setCarrier(res.data
            .sort((a, b) => (a.cr_name.toUpperCase() > b.cr_name.toUpperCase() ? 1 : -1))
            .map((val) => ({ id: val.cr_id, value: val.cr_name })));
        });
      await instance.get('/table/port?port_disable=0')
        .then((res) => {
          setPOL(res.data
            .sort((a, b) => (a.port_name.toUpperCase() > b.port_name.toUpperCase() ? 1 : -1))
            .map((val) => ({ id: val.port_id, value: val.port_name }))
            .filter((thing, index, self) => index === self.findIndex((t) => (
              t.value === thing.value
            ))));
          setPOD(res.data
            .sort((a, b) => (a.port_name.toUpperCase() > b.port_name.toUpperCase() ? 1 : -1))
            .map((val) => ({ id: val.port_id, value: val.port_name }))
            .filter((thing, index, self) => index === self.findIndex((t) => (
              t.value === thing.value
            ))));
        });
      await instance.get('/profile/agent/')
        .then((res) => {
          setAgent(res.data
            .sort((a, b) => (a.agent_id.toUpperCase() > b.agent_name.toUpperCase() ? 1 : -1))
            .map((val) => ({ id: val.agent_id, value: val.agent_name })));
        });
      setIsLoading(false);
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
                Rate Table
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
                <RateTableListTable
                  RateTables={RateTables}
                  POL={POL}
                  carrier={carrier}
                  POD={POD}
                  Agent={Agent}
                />
              )}
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
