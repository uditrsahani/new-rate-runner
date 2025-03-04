import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import useSettings from '../../../hooks/useSettings';
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
import { CustomerType, Industry } from '../../../store/data.json';
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

const CustomerEdit = (props) => {
  const dispatch = useDispatch();
  const { settings } = useSettings();
  const { Customer, Country, Contact, City, Team, Owner, ...other } = props;

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState();
  const [complete, setComplete] = useState(false);
  const [checkContact, setCheckContact] = useState(false);
  const [ContactID, setContactID] = useState([]);
  const [CustomerID, setCustomerID] = useState([]);
  const [queryCity, setQueryCity] = useState('');
  const { isModalOpen } = useSelector((state) => state.calendar);
  const selectedEvent = useSelector(selectedEventSelector);
  const [editable, setEditable] = useState(false);
  const user = JSON.parse(window.localStorage.getItem('user'));

  useEffect(() => {
  }, []);

  const handleClose = () => {
    setOpen(false);
    if (complete) { window.location.assign('/reference-data/customer'); }
  };
  const ControlForm = () => {
    const { values } = useFormikContext();

    useEffect(() => {
      // console.log(user.user_role);
      let checkEdit = true;
      if (Customer.length > 0) {
        checkEdit = (user.user_role === 'dataAdmin' || user.user_role === 'management');
      }
      setEditable(checkEdit);
    }, [values]);
    return null;
  };
  const handleModalClose = () => {
    dispatch(closeModal());
  };
  const handleAddClick = () => {
    dispatch(openModal());
  };
  const manageOwner = async (values) => {
    let Data2 = [];
    const remove = Owner.filter(({ user_id: id1 }) => !values.cus_owner.some(({ user_id: id2 }) => id2 === id1));
    if (remove && remove.length > 0) {
      // console.log('Remove', remove);
      remove.map((val) => {
        let tempOwner = [];
        if (val.user_id === 'BD Team') {
          tempOwner = { user_team: 'BD', cus_id: values.cus_id };
        } else if (val.user_id === 'Marketing Team') {
          tempOwner = { user_team: 'Marketing', cus_id: values.cus_id };
        } else {
          tempOwner = {
            user_id: val.user_id,
            cus_id: values.cus_id
          };
        }
        Data2.push(tempOwner);
        return null;
      });
      // console.log('Remove to API', Data2);
      await instance.patch('user/owner', Data2);
    }
    Data2 = [];
    const add = values.cus_owner.filter(({ user_id: id1 }) => !Owner.some(({ user_id: id2 }) => id2 === id1));
    if (add && add.length > 0) {
      // console.log('Add', add);
      add.map((val) => {
        let tempOwner = [];
        if (val.user_id === 'BD Team') {
          tempOwner = { user_team: 'BD', cus_id: values.cus_id };
        } else if (val.user_id === 'Marketing Team') {
          tempOwner = { user_team: 'Marketing', cus_id: values.cus_id };
        } else {
          tempOwner = {
            user_id: val.user_id,
            cus_id: values.cus_id
          };
        }
        Data2.push(tempOwner);
        return null;
      });
      // console.log('Add to API', Data2);
      await instance.post('user/owner', Data2);
    }
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
            Customer Profile
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
          cus_id: (Customer.length > 0) ? Customer[0].cus_id : '',
          cus_city_id: (Customer.length > 0 && Customer[0].cus_city_id) ? { id: Customer[0].cus_city_id, value: Customer[0].customer_city_name } : { id: '', value: '' },
          cus_country_id: (Customer.length > 0 && Customer[0].cus_country_id) ? { id: Customer[0].cus_country_id, value: Customer[0].customer_country_name } : { id: '', value: '' },
          cus_name: (Customer.length > 0) ? Customer[0].cus_name : '',
          cus_address: (Customer.length > 0) ? Customer[0].cus_address : '',
          cus_type: (Customer.length > 0) ? Customer[0].cus_type : 'new',
          cus_industry: (Customer.length > 0) ? Customer[0].cus_industry : '',
          cus_mobile: (Customer.length > 0) ? Customer[0].cus_mobile : '',
          cus_phone: (Customer.length > 0) ? Customer[0].cus_phone : '',
          cus_mail: (Customer.length > 0) ? Customer[0].cus_mail : '',
          cus_official_social_id: (Customer.length > 0) ? Customer[0].cus_official_social_id : '',
          cus_website: (Customer.length > 0) ? Customer[0].cus_website : '',
          cus_disable: (Customer.length > 0) ? (Customer[0].cus_disable !== 1) : true,
          customer_city_name: (Customer.length > 0) ? Customer[0].customer_city_name : '',
          customer_country_name: (Customer.length > 0) ? Customer[0].customer_country_name : '',
          cus_owner: (Owner.length > 0) ? Owner : [],
        }}
        // eslint-disable-next-line no-unused-vars
        onSubmit={async (values, { resetForm, setErrors, setStatus, setSubmitting }) => {
          const Data = {
            cus_id: (values.cus_id === '') ? null : values.cus_id,
            cus_city_id: values.cus_city_id.id,
            cus_country_id: values.cus_country_id.id,
            cus_name: values.cus_name,
            cus_address: values.cus_address,
            cus_type: (values.cus_type === '') ? 'new' : values.cus_type,
            cus_industry: values.cus_industry,
            cus_mobile: values.cus_mobile,
            cus_phone: values.cus_phone,
            cus_mail: values.cus_mail,
            cus_official_social_id: values.cus_official_social_id,
            cus_website: values.cus_website,
            cus_disable: (values.cus_disable) ? 0 : 1
          };

          let agreeform = false;
          if (values.cus_name === '') {
            setMessage('Please enter Customer Name');
            setOpen(true);
          } else if (values.cus_city_id.id === '') {
            setMessage('Please enter City');
            setOpen(true);
          } else if (values.cus_country_id.id === '') {
            setMessage('Please enter Country');
            setOpen(true);
          } else {
            agreeform = true;
          }

          // console.log(Data);
          if (agreeform) {
            try {
              if (values.cus_id === '') {
                console.log('Customer added!');
                await instance.post('profile/customer', Data)
                  .then(async (res) => {
                    values.cus_id = res.data.cus_id;
                    setCustomerID(res.data.cus_id);
                    manageOwner(values);

                    if (!checkContact) {
                      setStatus({ success: true });
                      setSubmitting(false);
                      setComplete(true);
                      setMessage('Complete form');
                      setOpen(true);
                      console.log(res, Data);
                    }
                  });
              } else {
                console.log('Customer updated!');
                await instance.patch(`profile/customer/${values.cus_id}`, Data)
                  .then(async (res) => {
                    manageOwner(values);
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
                      Customer Profile
                    </Typography>
                  </Grid>
                </Grid>
                <Card sx={{ mt: 3 }}>
                  <CardContent>
                    <Table>
                      <TableRow sx={{ height: 30 }}>
                        <TableCell
                          colspan={3}
                          sx={{ width: 1000,
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
                          &nbsp;Company Name
                            </Typography>
                          </Grid>
                          <TextField
                            size="small"
                            fullWidth
                            name="cus_name"
                            variant="outlined"
                            onChange={handleChange}
                            value={values.cus_name}
                            disabled={!editable}
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
                            name="cus_phone"
                            variant="outlined"
                            onChange={handleChange}
                            value={values.cus_phone}
                            disabled={!editable}
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
                            name="cus_address"
                            variant="outlined"
                            onChange={handleChange}
                            value={values.cus_address}
                            disabled={!editable}
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
                            name="cus_mobile"
                            variant="outlined"
                            onChange={handleChange}
                            value={values.cus_mobile}
                            disabled={!editable}
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
                            value={values.cus_country_id}
                            options={Country}
                            fullWidth
                            getOptionLabel={(option) => option.value}
                            disabled={!editable}
                            onChange={(event, val) => {
                              setFieldValue('cus_country_id', val);
                              if (val) {
                                setQueryCity(val.id);
                              }
                            }}
                            onInputChange={(val) => {
                              if (val) setQueryCity('');
                            }}
                            name="cus_country_id"
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
                            value={values.cus_city_id}
                            options={City.filter((data) => ((queryCity && queryCity !== '') ? data.country_id === queryCity : true))}
                            fullWidth
                            getOptionLabel={(option) => option.value}
                            disabled={!editable}
                            onChange={(event, val) => {
                              if (val) {
                                setFieldValue('cus_city_id', val);
                                setFieldValue('cus_country_id', { id: val.country_id, value: val.country_name });
                              }
                            }}
                            name="cus_city_id"
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
                          sx={{ width: 300, borderBottom: 'none' }}
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
                          &nbsp;Customer Type
                            </Typography>
                          </Grid>
                          <TextField
                            size="small"
                            fullWidth
                            name="cus_type"
                            disabled={!editable}
                            onChange={(val) => {
                              setFieldValue('cus_type', val.target.value);
                            }}
                            select
                            defaultValue={values.cus_type}
                            SelectProps={{ native: true }}
                            variant="outlined"
                          >
                            {CustomerType.map((obj) => (
                              <option
                                key={obj.value}
                                value={obj.value}
                                selected={values.cus_type === obj.value}
                              >
                                {obj.label}
                              </option>
                            ))}
                          </TextField>
                        </TableCell>
                        <TableCell
                          sx={{ width: 300, borderBottom: 'none' }}
                        >
                          <Typography
                            variant="h6"
                            sx={{ mt: -3 }}
                          >
                            Industry
                          </Typography>
                          <TextField
                            size="small"
                            fullWidth
                            name="cus_industry"
                            disabled={!editable}
                            onChange={(val) => {
                              setFieldValue('cus_industry', val.target.value);
                            }}
                            select
                            defaultValue={values.cus_industry}
                            SelectProps={{ native: true }}
                            variant="outlined"
                          >
                            {Industry.map((obj) => (
                              <option
                                key={obj.value}
                                value={obj.value}
                                selected={values.cus_industry === obj.value}
                              >
                                {obj.label}
                              </option>
                            ))}
                          </TextField>
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
                            name="cus_mail"
                            variant="outlined"
                            onChange={handleChange}
                            value={values.cus_mail}
                            disabled={!editable}
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
                            name="cus_official_social_id"
                            variant="outlined"
                            onChange={handleChange}
                            value={values.cus_official_social_id}
                            disabled={!editable}
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
                            Website
                          </Typography>
                          <TextField
                            size="small"
                            fullWidth
                            name="cus_website"
                            variant="outlined"
                            onChange={handleChange}
                            value={values.cus_website}
                            disabled={!editable}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow sx={{ height: 30 }}>
                        <TableCell
                          sx={{ width: 300, borderBottom: 'none' }}
                          colspan={4}
                        >
                          <Typography
                            variant="h6"
                            sx={{ mt: -3 }}
                          >
                            Sales Owner
                          </Typography>
                          <Autocomplete
                            autoHighlight
                            multiple
                            value={values.cus_owner}
                            defaultValue={values.cus_owner}
                            options={Team.filter((data) => data.user_disable === '0').sort((a, b) => -b.user_team.localeCompare(a.user_team))}
                            groupBy={(option) => option.user_team}
                            fullWidth
                            disabled={!editable}
                            filterSelectedOptions
                            getOptionLabel={(option) => option.user_fullname}
                            onChange={(event, val) => {
                              setFieldValue('cus_owner', val);
                            }}
                            name="cus_owner"
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                size="small"
                                variant="outlined"
                              />
                            )}
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
                sx={{ display: 'flex', flexWrap: 'wrap' }}
              >
                <Box
                  display={(editable) ? 'block' : 'none'}
                  sx={{ mt: 5, ml: 7 }}
                >
                  Disable&nbsp;&nbsp;
                  <FormControlLabel
                    control={(
                      <Switch
                        checked={values.cus_disable}
                        value={values.cus_disable}
                        color="primary"
                        name="cus_disable"
                        onChange={handleChange}
                        disabled={!editable}
                      />
                        )}
                    label="Enable"
                  />
                </Box>
                <Box
                  display={(editable) ? 'block' : 'none'}
                  sx={{ mt: 5, mr: 3 }}
                >
                  <Button
                    sx={{ mr: 1, width: 150 }}
                    variant="contained"
                    color="secondary"
                    type="reset"
                    size="large"
                    onClick={() => {
                      window.location.assign('/reference-data/customer');
                    }}
                  >
                    CANCEL
                  </Button>
                  <Button
                    sx={{ mr: 1, width: 150 }}
                    variant="contained"
                    disabled={isSubmitting || !editable}
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
                  sx={{ mt: 3 }}
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
                              type={(values.cus_id && values.cus_id !== '') ? 'button' : 'submit'}
                              onClick={async () => {
                                if (values.cus_id && values.cus_id !== '') {
                                  await setCheckContact(false);
                                } else {
                                  await setCheckContact(true);
                                }
                                if (values.cus_city_id.id !== '' && values.cus_country_id.id !== '' && values.cus_name !== '') {
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
            CustomerID={(Customer.length > 0) ? Customer[0].cus_id : CustomerID}
          />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

CustomerEdit.propTypes = {
  Customer: PropTypes.array.isRequired,
  Country: PropTypes.array.isRequired,
  Contact: PropTypes.array.isRequired,
  City: PropTypes.array.isRequired,
  Team: PropTypes.array.isRequired,
  Owner: PropTypes.array.isRequired,
};

export default CustomerEdit;
