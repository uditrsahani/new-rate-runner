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
import toast from 'react-hot-toast';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  FormControlLabel,
  Grid,
  Switch,
  TextField,
  Table,
  TableCell,
  Typography,
  TableRow
} from '@material-ui/core';

const CompetitorEdit = (props) => {
  const { settings } = useSettings();
  const { Competitor, Country, Contact, City, ...other } = props;

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState();
  const [complete, setComplete] = useState(false);
  const [queryCity, setQueryCity] = useState('');

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const handleClose = () => {
    setOpen(false);
    if (complete) { window.location.assign('/reference-data/Competitor'); }
  };
  const ControlForm = () => {
    const { values } = useFormikContext();

    useEffect(() => {

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
            Competitor Profile
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
          ct_id: (Competitor.length > 0) ? Competitor[0].ct_id : '',
          ct_code: (Competitor.length > 0) ? Competitor[0].ct_code : '',
          ct_city_id: (Competitor.length > 0 && Competitor[0].ct_city_id) ? { id: Competitor[0].ct_city_id, value: Competitor[0].competitor_city_name } : { id: '', value: '' },
          ct_country_id: (Competitor.length > 0 && Competitor[0].ct_country_id) ? { id: Competitor[0].ct_country_id, value: Competitor[0].competitor_country_name } : { id: '', value: '' },
          ct_name: (Competitor.length > 0) ? Competitor[0].ct_name : '',
          ct_address: (Competitor.length > 0) ? Competitor[0].ct_address : '',
          ct_mobile: (Competitor.length > 0) ? Competitor[0].ct_mobile : '',
          ct_phone: (Competitor.length > 0) ? Competitor[0].ct_phone : '',
          ct_mail: (Competitor.length > 0) ? Competitor[0].ct_mail : '',
          ct_official_social_id: (Competitor.length > 0) ? Competitor[0].ct_official_social_id : '',
          ct_website: (Competitor.length > 0) ? Competitor[0].ct_website : '',
          ct_remark: (Competitor.length > 0) ? Competitor[0].ct_remark : '',
          ct_disable: (Competitor.length > 0) ? (Competitor[0].ct_disable !== 1) : true
        }}
        // eslint-disable-next-line no-unused-vars
        onSubmit={async (values, { resetForm, setErrors, setStatus, setSubmitting }) => {
          const Data = {
            ct_id: (values.ct_id === '') ? null : values.ct_id,
            ct_code: values.ct_code,
            ct_city_id: values.ct_city_id.id,
            ct_country_id: values.ct_country_id.id,
            ct_name: values.ct_name,
            ct_address: values.ct_address,
            ct_mobile: values.ct_mobile,
            ct_phone: values.ct_phone,
            ct_mail: values.ct_mail,
            ct_official_social_id: values.ct_official_social_id,
            ct_website: values.ct_website,
            ct_remark: values.ct_remark,
            ct_disable: (values.ct_disable) ? 0 : 1
          };

          let agreeform = false;
          if (values.ct_name === '') {
            setMessage('Please enter Competitor Name');
            setOpen(true);
          } else if (values.ct_city_id.id === '') {
            setMessage('Please enter City');
            setOpen(true);
          } else if (values.ct_country_id.id === '') {
            setMessage('Please enter Country');
            setOpen(true);
          } else if (values.ct_code === '') {
            setMessage('Please enter Code');
            setOpen(true);
          } else {
            agreeform = true;
          }

          // console.log(Data);
          if (agreeform) {
            try {
              if (values.ct_id === '') {
                console.log('Competitor added!');
                await instance.post('profile/Competitor', Data)
                  .then((res) => {
                  // resetForm();
                    setStatus({ success: true });
                    setSubmitting(false);
                    setComplete(true);
                    setMessage('Complete form');
                    setOpen(true);
                    console.log(res, Data);
                  });
              } else {
                console.log('Competitor updated!');
                await instance.patch(`profile/Competitor/${values.ct_id}`, Data)
                  .then((res) => {
                    // resetForm();
                    setStatus({ success: true });
                    setSubmitting(false);
                    setComplete(true);
                    setMessage('Complete form');
                    setOpen(true);
                    console.log(res, Data);
                  });
              }
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
                      Competitor Profile
                    </Typography>
                  </Grid>
                </Grid>
                <Card sx={{ mt: 3 }}>
                  <CardContent>
                    <Table>
                      <TableRow sx={{ height: 30 }}>
                        <TableCell
                          sx={{ width: 300,
                            borderBottom: 'none' }}
                        >
                          <Grid sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            mt: -2 }}
                          >
                            <Typography
                              variant="h6"
                              color="red"
                            >
                              *
                            </Typography>
                            <Typography
                              variant="h6"
                            >
                          &nbsp;Competitor Code
                            </Typography>
                          </Grid>
                          <TextField
                            size="small"
                            fullWidth
                            name="ct_code"
                            variant="outlined"
                            onChange={handleChange}
                            value={values.ct_code}
                          />
                        </TableCell>
                        <TableCell
                          colspan={2}
                          sx={{ width: 600,
                            borderBottom: 'none' }}
                        >
                          <Grid sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            mt: -2 }}
                          >
                            <Typography
                              variant="h6"
                              color="red"
                            >
                              *
                            </Typography>
                            <Typography
                              variant="h6"
                            >
                          &nbsp;Competitor Name
                            </Typography>
                          </Grid>
                          <TextField
                            size="small"
                            fullWidth
                            name="ct_name"
                            variant="outlined"
                            onChange={handleChange}
                            value={values.ct_name}
                          />
                        </TableCell>
                        <TableCell sx={{ width: 300, borderBottom: 'none' }}>
                          <Typography
                            variant="h6"
                            sx={{ mt: -2 }}
                          >
                            Phone
                          </Typography>
                          <TextField
                            size="small"
                            fullWidth
                            name="ct_phone"
                            variant="outlined"
                            onChange={handleChange}
                            value={values.ct_phone}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow sx={{ height: 30 }}>
                        <TableCell
                          colspan={3}
                          sx={{ width: 1000, borderBottom: 'none' }}
                        >
                          <Typography
                            variant="h6"
                            sx={{ mt: -3 }}
                          >
                            Address
                          </Typography>
                          <TextField
                            size="small"
                            fullWidth
                            name="ct_address"
                            variant="outlined"
                            onChange={handleChange}
                            value={values.ct_address}
                          />
                        </TableCell>
                        <TableCell sx={{ width: 300, borderBottom: 'none' }}>
                          <Typography
                            variant="h6"
                            sx={{ mt: -3 }}
                          >
                            Mobile
                          </Typography>
                          <TextField
                            size="small"
                            fullWidth
                            name="ct_mobile"
                            variant="outlined"
                            onChange={handleChange}
                            value={values.ct_mobile}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow sx={{ height: 30 }}>
                        <TableCell sx={{ width: 300, borderBottom: 'none' }}>
                          <Grid sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            mt: -3 }}
                          >
                            <Typography
                              variant="h6"
                              color="red"
                            >
                              *
                            </Typography>
                            <Typography
                              variant="h6"
                            >
                          &nbsp;Country
                            </Typography>
                          </Grid>
                          <Autocomplete
                            autoHighlight
                            value={values.ct_country_id}
                            options={Country}
                            fullWidth
                            getOptionLabel={(option) => option.value}
                            onChange={(event, val) => {
                              setFieldValue('ct_country_id', val);
                              if (val) {
                                setQueryCity(val.id);
                              }
                            }}
                            onInputChange={(val) => {
                              if (val) setQueryCity('');
                            }}
                            name="ct_country_id"
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                size="small"
                                variant="outlined"
                              />
                            )}
                          />
                        </TableCell>
                        <TableCell sx={{ width: 300, borderBottom: 'none' }}>
                          <Grid sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            mt: -3 }}
                          >
                            <Typography
                              variant="h6"
                              color="red"
                            >
                              *
                            </Typography>
                            <Typography
                              variant="h6"
                            >
                          &nbsp;City
                            </Typography>
                          </Grid>
                          <Autocomplete
                            autoHighlight
                            value={values.ct_city_id}
                            options={City.filter((data) => ((queryCity && queryCity !== '') ? data.country_id === queryCity : true))}
                            fullWidth
                            getOptionLabel={(option) => option.value}
                            onChange={(event, val) => {
                              if (val) {
                                setFieldValue('ct_city_id', val);
                                setFieldValue('ct_country_id', { id: val.country_id, value: val.country_name });
                              }
                            }}
                            name="ct_city_id"
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                size="small"
                                variant="outlined"
                              />
                            )}
                          />
                        </TableCell>
                        <TableCell
                          sx={{ width: 600, borderBottom: 'none' }}
                          colspan={2}
                        >
                          <Typography
                            variant="h6"
                            sx={{ mt: -3 }}
                          >
                            Remark
                          </Typography>
                          <TextField
                            size="small"
                            fullWidth
                            name="ct_remark"
                            variant="outlined"
                            onChange={handleChange}
                            value={values.ct_remark}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow sx={{ height: 30 }}>
                        <TableCell sx={{ width: 300, borderBottom: 'none' }}>
                          <Typography
                            variant="h6"
                            sx={{ mt: -3 }}
                          >
                            Email
                          </Typography>
                          <TextField
                            size="small"
                            fullWidth
                            name="ct_mail"
                            variant="outlined"
                            onChange={handleChange}
                            value={values.ct_mail}
                          />
                        </TableCell>
                        <TableCell sx={{ width: 300, borderBottom: 'none' }}>
                          <Typography
                            variant="h6"
                            sx={{ mt: -3 }}
                          >
                            Official Social ID
                          </Typography>
                          <TextField
                            size="small"
                            fullWidth
                            name="ct_official_social_id"
                            variant="outlined"
                            onChange={handleChange}
                            value={values.ct_official_social_id}
                          />
                        </TableCell>
                        <TableCell
                          sx={{ width: 300, borderBottom: 'none' }}
                          colspan={2}
                        >
                          <Typography
                            variant="h6"
                            sx={{ mt: -3 }}
                          >
                            Website
                          </Typography>
                          <TextField
                            size="small"
                            fullWidth
                            name="ct_website"
                            variant="outlined"
                            onChange={handleChange}
                            value={values.ct_website}
                          />
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
                <Box sx={{ m: 5, ml: 7 }}>
                  Disable&nbsp;&nbsp;
                  <FormControlLabel
                    control={(
                      <Switch
                        checked={values.ct_disable}
                        value={values.ct_disable}
                        color="primary"
                        name="ct_disable"
                        onChange={handleChange}
                      />
                        )}
                    label="Enable"
                  />
                </Box>
                <Box sx={{ mt: 5, mr: 3 }}>
                  <Button
                    sx={{ mr: 1, width: 150 }}
                    variant="contained"
                    color="secondary"
                    type="reset"
                    size="large"
                    onClick={() => {
                      window.location.assign('/reference-data/Competitor');
                    }}
                  >
                    CANCEL
                  </Button>
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

CompetitorEdit.propTypes = {
  Competitor: PropTypes.array.isRequired,
  Country: PropTypes.array.isRequired,
  Contact: PropTypes.array.isRequired,
  City: PropTypes.array.isRequired
};

export default CompetitorEdit;
