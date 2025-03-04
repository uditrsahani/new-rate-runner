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
import useAuth from '../../../hooks/useAuth';

const CustomerEdit = (props) => {
  const { settings } = useSettings();
  const { FormID, ...other } = props;
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState();
  const [complete, setComplete] = useState(false);
  const { logout } = useAuth();

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const handleClose = async () => {
    setOpen(false);
    if (complete) {
      /* if (user.user_id === FormID.user_id) {
        window.location.assign('/setup-data/reset');
      } else {
        window.location.assign('/reference-data/user');
      } */
      try {
        await logout();
        window.location.assign('/');
      } catch (err) {
        console.error(err);
        toast.error('Unable to logout.');
      }
    }
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
          user_username: (FormID.user_username) ? FormID.user_username : '',
          user_mail: (FormID.user_mail) ? FormID.user_mail : '',
          new_user_password: '',
          new2_user_password: ''
        }}
        // eslint-disable-next-line no-unused-vars
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          const Data = {
            user_password: values.new_user_password
          };
          let agreeform = false;
          if (values.user_username === '') {
            setMessage('Please enter Username');
            setOpen(true);
          } else if (values.new_user_password === '') {
            setMessage('Please enter new password');
            setOpen(true);
          } else if (values.new_user_password.length < 4 || values.new2_user_password.length < 4) {
            setMessage('Please enter longer password');
            setOpen(true);
          } else if (values.new2_user_password === '') {
            setMessage('Please confirm new password');
            setOpen(true);
          } else if (values.new2_user_password !== values.new_user_password) {
            setMessage('Please check your new password');
            setOpen(true);
          } else {
            agreeform = true;
          }

          if (agreeform) {
            try {
              if (values.user_id && values.user_id !== '') {
                console.log('User Profile updated!');
                await instance.patch(`/user/${values.user_id}/reset/password`, Data)
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
                      Reset Password
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
                          &nbsp;Username
                            </Typography>
                          </Grid>
                          <TextField
                            size="small"
                            fullWidth
                            name="user_fullname"
                            variant="outlined"
                            onChange={handleChange}
                            value={values.user_username}
                            disabled
                          />
                        </TableCell>
                        <TableCell sx={{ width: 300, borderBottom: 'none' }}>
                          <Typography
                            variant="h6"
                            sx={{ mt: -2 }}
                          >
                            New Password
                          </Typography>
                          <TextField
                            size="small"
                            fullWidth
                            name="new_user_password"
                            variant="outlined"
                            onChange={handleChange}
                            type="password"
                            value={values.new_user_password}
                          />
                        </TableCell>
                        <TableCell sx={{ width: 300, borderBottom: 'none' }}>
                          <Typography
                            variant="h6"
                          >
                            Confirm New Password
                          </Typography>

                          <TextField
                            size="small"
                            fullWidth
                            name="new2_user_password"
                            variant="outlined"
                            onChange={handleChange}
                            type="password"
                            value={values.new2_user_password}
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
                <Box sx={{ m: 5, ml: 7 }} />
                <Box sx={{ mt: 5, mr: 3 }}>
                  <Button
                    sx={{ mr: 1, width: 150 }}
                    variant="contained"
                    color="secondary"
                    type="reset"
                    size="large"
                    onClick={() => {
                      window.location.assign('/setup-data/reset');
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
