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
import { Team, Level } from '../../../store/data.json';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  TextField,
  Table,
  TableCell,
  Typography,
  TableRow
} from '@material-ui/core';

const CustomerEdit = (props) => {
  const { settings } = useSettings();
  const { FormID, ...other } = props;

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState();
  const [complete, setComplete] = useState(false);
  const user = JSON.parse(window.localStorage.getItem('user'));
  const role = user.user_role;

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const handleClose = () => {
    setOpen(false);
    if (complete) { window.location.assign('/setup-data/profile'); }
  };
  const ControlForm = () => {
    const { values } = useFormikContext();

    useEffect(() => {

    }, [values]);
    return null;
  };

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
            User Profile
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
          user_id: (FormID.user_id) ? FormID.user_id : '',
          user_fullname: (FormID.user_fullname) ? FormID.user_fullname : '',
          user_mobile: (FormID.user_mobile) ? FormID.user_mobile : '',
          user_phone: (FormID.user_phone) ? FormID.user_phone : '',
          user_mail: (FormID.user_mail) ? FormID.user_mail : '',
          user_social_id: (FormID.user_social_id) ? FormID.user_social_id : '',
          user_level: (FormID.user_level) ? FormID.user_level : '',
          user_team: (FormID.user_team) ? FormID.user_team : '',
          user_image: (FormID.user_image) ? FormID.user_image : '',
          user_role: (FormID.user_role) ? FormID.user_role : '',
        }}
        // eslint-disable-next-line no-unused-vars
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          const Data = {
            user_fullname: values.user_fullname,
            user_mobile: values.user_mobile,
            user_phone: values.user_phone,
            user_mail: values.user_mail,
            user_social_id: values.user_social_id,
            user_level: values.user_level,
            user_team: values.user_team,
            user_image: values.user_image,
            user_role: values.user_role
          };
          // console.log(Data);
          let agreeform = false;
          if (values.user_fullname === '') {
            setMessage('Please enter User Name');
            setOpen(true);
          } else if (values.user_mail === '') {
            setMessage('Please enter Email');
            setOpen(true);
          } else if (values.user_role === '') {
            setMessage('Please enter Role');
            setOpen(true);
          } else if (values.user_level === '') {
            setMessage('Please enter Level');
            setOpen(true);
          } else {
            agreeform = true;
          }

          if (agreeform) {
            try {
              if (values.user_id && values.user_id !== '') {
                console.log('User Profile updated!');
                await instance.patch(`profile/sale/${values.user_id}`, Data)
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
          // eslint-disable-next-line no-unused-vars
          handleSubmit, isSubmitting, handleChange, values, resetForm, setFieldValue
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
                      User Profile
                    </Typography>
                  </Grid>
                </Grid>
                <Card sx={{ mt: 3 }}>
                  <CardContent>
                    <Table>
                      <TableRow sx={{ height: 30 }}>
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
                          &nbsp;Name
                            </Typography>
                          </Grid>
                          <TextField
                            size="small"
                            fullWidth
                            name="user_fullname"
                            variant="outlined"
                            onChange={handleChange}
                            value={values.user_fullname}
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
                            name="user_phone"
                            variant="outlined"
                            onChange={handleChange}
                            value={values.user_phone}
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
                          &nbsp;Email
                            </Typography>
                          </Grid>
                          <TextField
                            size="small"
                            fullWidth
                            name="user_mail"
                            variant="outlined"
                            onChange={handleChange}
                            value={values.user_mail}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow sx={{ height: 30 }}>
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
                            name="user_mobile"
                            variant="outlined"
                            onChange={handleChange}
                            value={values.user_mobile}
                          />
                        </TableCell>
                        <TableCell sx={{ width: 300, borderBottom: 'none' }}>
                          <Typography
                            variant="h6"
                            sx={{ mt: -3 }}
                          >
                            Social ID
                          </Typography>
                          <TextField
                            size="small"
                            fullWidth
                            name="user_social_id"
                            variant="outlined"
                            onChange={handleChange}
                            value={values.user_social_id}
                          />
                        </TableCell>
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
                          &nbsp;Title position
                            </Typography>
                          </Grid>
                          <TextField
                            size="small"
                            fullWidth
                            name="user_level"
                            onChange={(val) => {
                              setFieldValue('user_level', val.target.value);
                              // setFieldValue('user_level', Role.filter((data) => data.value === val.target.value)[0].label);
                            }}
                            select
                            defaultValue={values.user_level}
                            SelectProps={{ native: true }}
                            variant="outlined"
                          >
                            {Level
                              .filter((data) => ((role === 'salesManager' || role === 'seniorManager' || role === 'sales') ? (data.value !== 'IT' && data.value !== 'Marketing Offer' && data.value !== 'Marketing Manager' && data.value !== 'Management') : false)
                            || ((role === 'marketing' || role === 'marketingManager') ? (data.value !== 'Management') : false)
                            || (!!((role === 'management' || role === 'systemAdmin'))))
                              .map((obj) => (
                                <option
                                  key={obj.value}
                                  value={obj.value}
                                  selected={values.user_level === obj.value}
                                >
                                  {obj.label}
                                </option>
                              ))}
                          </TextField>
                        </TableCell>
                        <TableCell
                          sx={{ width: 300,
                            borderBottom: 'none' }}
                        >
                          <Typography
                            variant="h6"
                            sx={{ mt: -3 }}
                          >
                            Team
                          </Typography>
                          <TextField
                            size="small"
                            fullWidth
                            name="user_team"
                            onChange={(val) => {
                              setFieldValue('user_team', val.target.value);
                            }}
                            select
                            defaultValue={values.user_team}
                            SelectProps={{ native: true }}
                            variant="outlined"
                            disabled
                          >
                            {Team.map((obj) => (
                              <option
                                key={obj.value}
                                value={obj.value}
                                selected={values.user_team === obj.value}
                              >
                                {obj.label}
                              </option>
                            ))}
                          </TextField>
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
                    color="secondary"
                    type="reset"
                    size="large"
                    onClick={() => {
                      window.location.assign('/setup-data/profile');
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

CustomerEdit.propTypes = {
  FormID: PropTypes.array.isRequired,
};

export default CustomerEdit;
