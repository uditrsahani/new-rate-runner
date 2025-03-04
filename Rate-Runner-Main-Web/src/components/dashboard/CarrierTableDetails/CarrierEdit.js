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
import { ContactEdit } from '.';
import PlusIcon from '../../../icons/Plus';
import PencilAltIcon from '../../../icons/PencilAlt';
import { useDispatch, useSelector } from '../../../store';
import { closeModal, openModal } from '../../../slices/calendar';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  FormControlLabel,
  Grid,
  IconButton,
  Switch,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  TableRow
} from '@material-ui/core';

const selectedEventSelector = (state) => {
  const { events, selectedEventId } = state.calendar;

  if (selectedEventId) {
    return events.find((_event) => _event.id === selectedEventId);
  }

  return null;
};

const CarrierEdit = (props) => {
  const dispatch = useDispatch();
  const { settings } = useSettings();
  const { Carrier, Country, Contact, City, ...other } = props;

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState();
  const [complete, setComplete] = useState(false);
  const [ContactID, setContactID] = useState([]);
  const [CarrierID, setCarrierID] = useState([]);
  const [checkContact, setCheckContact] = useState(false);
  const [queryCity, setQueryCity] = useState('');
  const { isModalOpen } = useSelector((state) => state.calendar);
  const selectedEvent = useSelector(selectedEventSelector);

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const handleClose = () => {
    setOpen(false);
    if (complete) { window.location.assign('/reference-data/Carrier'); }
  };
  const ControlForm = () => {
    const { values } = useFormikContext();

    useEffect(() => {

    }, [values]);
    return null;
  };

  const handleModalClose = () => {
    dispatch(closeModal());
  };
  const handleAddClick = () => {
    dispatch(openModal());
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
            Carrier Profile
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
          cr_id: (Carrier.length > 0) ? Carrier[0].cr_id : '',
          cr_code: (Carrier.length > 0) ? Carrier[0].cr_code : '',
          cr_city_id: (Carrier.length > 0 && Carrier[0].cr_city_id) ? { id: Carrier[0].cr_city_id, value: Carrier[0].carrier_city_name } : { id: '', value: '' },
          cr_country_id: (Carrier.length > 0 && Carrier[0].cr_country_id) ? { id: Carrier[0].cr_country_id, value: Carrier[0].carrier_country_name } : { id: '', value: '' },
          cr_name: (Carrier.length > 0) ? Carrier[0].cr_name : '',
          cr_address: (Carrier.length > 0) ? Carrier[0].cr_address : '',
          cr_mobile: (Carrier.length > 0) ? Carrier[0].cr_mobile : '',
          cr_phone: (Carrier.length > 0) ? Carrier[0].cr_phone : '',
          cr_mail: (Carrier.length > 0) ? Carrier[0].cr_mail : '',
          cr_official_social_id: (Carrier.length > 0) ? Carrier[0].cr_official_social_id : '',
          cr_website: (Carrier.length > 0) ? Carrier[0].cr_website : '',
          cr_remark: (Carrier.length > 0) ? Carrier[0].cr_remark : '',
          cr_disable: (Carrier.length > 0) ? (Carrier[0].cr_disable !== 1) : true
        }}
        // eslint-disable-next-line no-unused-vars
        onSubmit={async (values, { resetForm, setErrors, setStatus, setSubmitting }) => {
          const Data = {
            cr_id: (values.cr_id === '') ? null : values.cr_id,
            cr_code: values.cr_code,
            cr_city_id: values.cr_city_id.id,
            cr_country_id: values.cr_country_id.id,
            cr_name: values.cr_name,
            cr_address: values.cr_address,
            cr_mobile: values.cr_mobile,
            cr_phone: values.cr_phone,
            cr_mail: values.cr_mail,
            cr_official_social_id: values.cr_official_social_id,
            cr_website: values.cr_website,
            cr_remark: values.cr_remark,
            cr_disable: (values.cr_disable) ? 0 : 1
          };

          let agreeform = false;
          if (values.cr_name === '') {
            setMessage('Please enter Carrier Name');
            setOpen(true);
          } else if (values.cr_city_id.id === '') {
            setMessage('Please enter City');
            setOpen(true);
          } else if (values.cr_code === '') {
            setMessage('Please enter Code');
            setOpen(true);
          } else if (values.cr_country_id.id === '') {
            setMessage('Please enter Country');
            setOpen(true);
          } else {
            agreeform = true;
          }

          // console.log(Data);
          if (agreeform) {
            try {
              if (values.cr_id === '') {
                console.log('Carrier added!');
                await instance.post('profile/Carrier', Data)
                  .then((res) => {
                  // resetForm();
                    if (checkContact) {
                      values.cr_id = res.data.cr_id;
                      setCarrierID(res.data.cr_id);
                    } else {
                      setStatus({ success: true });
                      setSubmitting(false);
                      setComplete(true);
                      setMessage('Complete form');
                      setOpen(true);
                      console.log(res, Data);
                    }
                  });
              } else {
                console.log('Carrier updated!');
                await instance.patch(`profile/Carrier/${values.cr_id}`, Data)
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
                      Carrier Profile
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
                          &nbsp;Carrier Code
                            </Typography>
                          </Grid>
                          <TextField
                            size="small"
                            fullWidth
                            name="cr_code"
                            variant="outlined"
                            onChange={handleChange}
                            value={values.cr_code}
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
                          &nbsp;Carrier Name
                            </Typography>
                          </Grid>
                          <TextField
                            size="small"
                            fullWidth
                            name="cr_name"
                            variant="outlined"
                            onChange={handleChange}
                            value={values.cr_name}
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
                            name="cr_phone"
                            variant="outlined"
                            onChange={handleChange}
                            value={values.cr_phone}
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
                            name="cr_address"
                            variant="outlined"
                            onChange={handleChange}
                            value={values.cr_address}
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
                            name="cr_mobile"
                            variant="outlined"
                            onChange={handleChange}
                            value={values.cr_mobile}
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
                            value={values.cr_country_id}
                            options={Country}
                            fullWidth
                            getOptionLabel={(option) => option.value}
                            onChange={(event, val) => {
                              setFieldValue('cr_country_id', val);
                              if (val) {
                                setQueryCity(val.id);
                              }
                            }}
                            onInputChange={(val) => {
                              if (val) setQueryCity('');
                            }}
                            name="cr_country_id"
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
                            value={values.cr_city_id}
                            options={City.filter((data) => ((queryCity && queryCity !== '') ? data.country_id === queryCity : true))}
                            fullWidth
                            getOptionLabel={(option) => option.value}
                            onChange={(event, val) => {
                              if (val) {
                                setFieldValue('cr_city_id', val);
                                setFieldValue('cr_country_id', { id: val.country_id, value: val.country_name });
                              }
                            }}
                            name="cr_city_id"
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
                            name="cr_remark"
                            variant="outlined"
                            onChange={handleChange}
                            value={values.cr_remark}
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
                            name="cr_mail"
                            variant="outlined"
                            onChange={handleChange}
                            value={values.cr_mail}
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
                            name="cr_official_social_id"
                            variant="outlined"
                            onChange={handleChange}
                            value={values.cr_official_social_id}
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
                            name="cr_website"
                            variant="outlined"
                            onChange={handleChange}
                            value={values.cr_website}
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
                        checked={values.cr_disable}
                        value={values.cr_disable}
                        color="primary"
                        name="cr_disable"
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
                      window.location.assign('/reference-data/Carrier');
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
              <Container maxWidth={settings.compact ? 'xl' : false}>
                <Grid
                  container
                  justifyContent="space-between"
                  spacing={3}
                />
                <Card sx={{ mt: 3 }}>
                  <CardContent>
                    <Table>
                      <TableRow sx={{ height: 30 }}>
                        <TableCell
                          sx={{ width: 600, borderBottom: 'none' }}
                          colspan={3}
                        >
                          <Typography
                            variant="h6"
                          >
                            Contact
                          </Typography>
                        </TableCell>
                        <TableCell
                          sx={{ borderBottom: 'none' }}
                          align="right"
                        >
                          <Box>
                            <Button
                              color="success"
                              sx={{ ml: 1, maxWidth: '180px', maxHeight: '40px', minWidth: '180px', minHeight: '40px' }}
                              startIcon={<PlusIcon fontSize="small" />}
                              variant="contained"
                              size="large"
                              type={(values.cr_id && values.cr_id !== '') ? 'button' : 'submit'}
                              onClick={async () => {
                                if (values.cr_id && values.cus_id !== '') {
                                  await setCheckContact(false);
                                } else {
                                  await setCheckContact(true);
                                }
                                if (values.cr_city_id.id !== '' && values.cr_country_id.id !== '' && values.cr_name !== '') {
                                  setContactID([]);
                                  handleAddClick();
                                }
                              }}
                            >
                              New
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
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
                                <TableCell>
                                  <Typography
                                    variant="subtitle2"
                                  >
                                    Contact Name
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    variant="subtitle2"
                                  >
                                    Position
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    variant="subtitle2"
                                  >
                                    Department
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    variant="subtitle2"
                                  >
                                    Email
                                  </Typography>
                                </TableCell>

                                <TableCell>
                                  <Typography
                                    variant="subtitle2"
                                  >
                                    Mobile
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    variant="subtitle2"
                                  >
                                    Phone
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    variant="subtitle2"
                                  >
                                    Socail ID
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    variant="subtitle2"
                                  >
                                    Edit
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {Contact.map((cont) => (
                                <TableRow style={cont.ct_disable === '1'
                                  ? { backgroundColor: '#ededed' } : null}
                                >
                                  <TableCell>
                                    {cont.ct_name}
                                  </TableCell>
                                  <TableCell>
                                    {cont.ct_position}
                                  </TableCell>
                                  <TableCell>
                                    {cont.ct_department}
                                  </TableCell>
                                  <TableCell>
                                    {cont.ct_mail}
                                  </TableCell>
                                  <TableCell>
                                    {cont.ct_mobile}
                                  </TableCell>
                                  <TableCell>
                                    {cont.ct_phone}
                                  </TableCell>
                                  <TableCell>
                                    {cont.ct_social_id}
                                  </TableCell>
                                  <TableCell>
                                    <IconButton onClick={() => {
                                      const tempContact = Contact.filter((data) => data.ct_uuid === cont.ct_uuid);
                                      setContactID(tempContact[0]);
                                      handleAddClick();
                                    }}
                                    >
                                      <PencilAltIcon fontSize="small" />
                                    </IconButton>
                                  </TableCell>
                                </TableRow>
                              ))}
                              {(Contact.length === 0) && (
                              <TableRow sx={{ height: 50 }}>
                                <TableCell
                                  colspan={8}
                                  align="center"
                                >
                                  No Data
                                </TableCell>
                              </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </TableCell>
                      </TableRow>
                    </Table>
                  </CardContent>
                </Card>
              </Container>
            </Box>
          </form>
        )}
      </Formik>
      <Dialog
        onClose={handleModalClose}
        open={isModalOpen}
      >
        <DialogContent
          sx={{ width: '600px' }}
        >
          {isModalOpen && (
          <ContactEdit
            event={selectedEvent}
            onAddComplete={handleModalClose}
            onCancel={handleModalClose}
            onDeleteComplete={handleModalClose}
            onEditComplete={handleModalClose}
            ContactID={ContactID}
            CarrierID={(Carrier.length > 0) ? Carrier[0].cr_id : CarrierID}
          />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

CarrierEdit.propTypes = {
  Carrier: PropTypes.array.isRequired,
  Country: PropTypes.array.isRequired,
  Contact: PropTypes.array.isRequired,
  City: PropTypes.array.isRequired
};

export default CarrierEdit;
