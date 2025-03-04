import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import useSettings from '../../../hooks/useSettings';
import gtm from '../../../lib/gtm';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Formik, useFormikContext } from 'formik';
import instance from '../../../store/instance';
import Moment from 'moment';
import toast from 'react-hot-toast';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  TableRow
} from '@material-ui/core';

const LeadtimeEdit = (props) => {
  const { settings } = useSettings();
  const { leadtime, ...other } = props;
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState();
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const handleClose = () => {
    setOpen(false);
    if (complete) { window.location.assign('/reference-data/lead-time'); }
  };
  const ControlForm = () => {
    const { values } = useFormikContext();

    useEffect(() => {
      if (leadtime.length > 0) {
        console.log(leadtime);
      }
    }, [values]);
    return null;
  };

  // Usually query is done on backend with indexing solutions

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <Typography
            variant="h5"
          >
            Lead time
          </Typography>
        </DialogTitle>
        <DialogContent
          sx={{ width: '500px' }}
        >
          <DialogContentText id="alert-dialog-description">
            {(complete) ? (
              <Typography
                color="green"
                variant="h5"
              >
                {message}
              </Typography>
            )
              : (
                <Typography
                  color="red"
                  variant="h6"
                >
                  -&nbsp;
                  {message}
                </Typography>
              )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            sx={{ m: 1 }}
            onClick={handleClose}
            variant="contained"
            color="info"
            size="large"
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
      <Formik
        enableReinitialize
        initialValues={{
          lt_timestamp: (leadtime) ? leadtime.lt_timestamp : '',
          lt_waiting_sales: (leadtime) ? leadtime.lt_waiting_sales : '',
          lt_waiting_mktg: (leadtime) ? leadtime.lt_waiting_mktg : '',
          lt_waiting_cus: (leadtime) ? leadtime.lt_waiting_cus : '',
          lt_waiting_quotation: (leadtime) ? leadtime.lt_waiting_quotation : ''
        }}
        // eslint-disable-next-line no-unused-vars
        onSubmit={async (values, { resetForm, setErrors, setStatus, setSubmitting }) => {
          const Data = {
            lt_timestamp: Moment(new Date()).format('YYYY-MM-DD'),
            lt_waiting_sales: values.lt_waiting_sales,
            lt_waiting_mktg: values.lt_waiting_mktg,
            lt_waiting_cus: values.lt_waiting_cus,
            lt_waiting_quotation: values.lt_waiting_quotation
          };

          const agreeform = true;

          // console.log(Data);
          if (agreeform) {
            try {
              console.log('Competitor edit!');
              await instance.patch('table/tat', Data)
                .then((res) => {
                  // resetForm();
                  setStatus({ success: true });
                  setSubmitting(false);
                  setComplete(true);
                  setMessage('Complete form');
                  setOpen(true);
                  console.log(res, Data);
                });
            } catch (err) {
              console.error(err);
              toast.error('Something went wrong!');
              setStatus({ success: false });
              setErrors({ submit: err.message });
              setSubmitting(false);
            }
          }
        }}
      >

        {({
          // eslint-disable-next-line no-unused-vars
          handleSubmit, isSubmitting, handleChange, values, setFieldValue
        }) => (
          <form
            onSubmit={handleSubmit}
            {...other}
          >
            <ControlForm />
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
                      Lead time
                    </Typography>
                  </Grid>
                </Grid>
                <Card sx={{ mt: 3 }}>
                  <CardContent>
                    <Typography
                      variant="subtitle2"
                      sx={{ ml: 3, mb: 3 }}
                    >
                      Last Update :
                      {' '}
                      {Moment(values.lt_timestamp).format('DD/MM/YYYY')}
                    </Typography>

                    <Table sx={{ width: 600 }}>
                      <TableRow sx={{ height: 30 }}>
                        <TableCell
                          sx={{ borderBottom: 'none' }}
                          colspan={4}
                        >
                          <Table
                            sx={{ mt: -3 }}
                            size="small"
                          >
                            <TableHead>
                              <TableRow>
                                <TableCell sx={{ width: 300 }}>
                                  <Typography
                                    variant="subtitle2"
                                  >
                                    Status
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    variant="subtitle2"
                                  >
                                    Days
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <TableRow>
                                <TableCell>
                                  Waiting Sales
                                </TableCell>
                                <TableCell sx={{ width: 300 }}>
                                  <TextField
                                    size="small"
                                    name="lt_waiting_sales"
                                    variant="outlined"
                                    onChange={handleChange}
                                    value={values.lt_waiting_sales}
                                  />
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>
                                  Waiting Marketing
                                </TableCell>
                                <TableCell sx={{ width: 300 }}>
                                  <TextField
                                    size="small"
                                    name="lt_waiting_mktg"
                                    variant="outlined"
                                    onChange={handleChange}
                                    value={values.lt_waiting_mktg}
                                  />
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>
                                  Waiting Quotation
                                </TableCell>
                                <TableCell sx={{ width: 300 }}>
                                  <TextField
                                    size="small"
                                    name="lt_waiting_quotation"
                                    variant="outlined"
                                    onChange={handleChange}
                                    value={values.lt_waiting_quotation}
                                  />
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>
                                  Waiting Customer
                                </TableCell>
                                <TableCell sx={{ width: 300 }}>
                                  <TextField
                                    size="small"
                                    name="lt_waiting_cus"
                                    variant="outlined"
                                    onChange={handleChange}
                                    value={values.lt_waiting_cus}
                                  />
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </TableCell>
                      </TableRow>
                    </Table>
                  </CardContent>
                </Card>
              </Container>
              <Grid
                container
                justifyContent="space-between"
                spacing={3}
              >
                <Box sx={{ m: 5, ml: 7 }} />
                <Box sx={{ mt: 5, mr: 3 }}>
                  <Button
                    sx={{ mr: 1, width: 150 }}
                    variant="contained"
                    disabled={isSubmitting}
                    color="info"
                    size="large"
                    type="submit"
                  >
                    SAVE
                  </Button>
                </Box>
              </Grid>
            </Box>
          </form>
        )}
      </Formik>
    </>
  );
};

LeadtimeEdit.propTypes = {
  leadtime: PropTypes.array.isRequired,
};

export default LeadtimeEdit;
