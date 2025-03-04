import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { Formik, useFormikContext } from 'formik';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import instance from '../../../store/instance';

import {
  Box,
  Button,
  FormControlLabel,
  Grid,
  Table,
  TableCell,
  TableRow,
  Typography,
  TextField,
  Switch
} from '@material-ui/core';

const CityCountryEdit = (props) => {
  const { FormID, ...other } = props;
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState();
  const [complete, setComplete] = useState(false);
  const [editable, setEditable] = useState(false);

  const handleClose = () => {
    setOpen(false);
    if (complete) { window.location.assign('/reference-data/city/'); }
  };
  const ControlForm = () => {
    const { values } = useFormikContext();

    useEffect(() => {
      // console.log(user.user_role);
      const checkEdit = true;
      /* if (FormID) {
        checkEdit = (user.user_role === 'dataAdmin');
      } */
      setEditable(checkEdit);
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
            Sales
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
          cc_city_id: (FormID.cc_city_id) ? FormID.cc_city_id : '',
          cc_country_id: (FormID.cc_country_id) ? FormID.cc_country_id : '',
          cc_city_name: (FormID.cc_city_name) ? FormID.cc_city_name : '',
          cc_country_name: (FormID.cc_country_name) ? FormID.cc_country_name : '',
          cc_trade: (FormID.cc_trade) ? FormID.cc_trade : '',
          cc_disable: (FormID.cc_disable) ? (FormID.cc_disable !== 1) : true,
        }}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          const Data = {
            cc_city_id: (FormID.cc_city_id) ? null : values.cc_city_id,
            cc_country_id: (FormID.cc_country_id) ? null : values.cc_country_id,
            cc_city_name: values.cc_city_name,
            cc_country_name: values.cc_country_name,
            cc_trade: values.cc_trade,
            cc_disable: (values.cc_disable) ? 0 : 1,
          };
          // console.log(FormID, Data);
          let agreeform = false;
          if (values.cc_country_id === '') {
            setMessage('Please enter Country ID');
            setOpen(true);
          } else if (values.cc_country_name === '') {
            setMessage('Please enter Country Name');
            setOpen(true);
          } else if (values.cc_city_id === '') {
            setMessage('Please enter City ID');
            setOpen(true);
          } else if (values.cc_city_name === '') {
            setMessage('Please enter City Name');
            setOpen(true);
          } else {
            agreeform = true;
          }

          if (agreeform) {
            try {
              if (FormID.cc_city_id && FormID.cc_country_id) {
                console.log('Contact updated!');
                await instance.patch(`table/city/${FormID.cc_city_id}/country/${FormID.cc_country_id}`, Data)
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
                console.log('Contact added!');
                await instance.post('table/city', Data)
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
          handleSubmit, isSubmitting, handleChange, values
        }) => (
          <form
            onSubmit={handleSubmit}
            {...other}
          >
            <ControlForm />
            <Box
              sx={{ mt: -2,
                display: 'flex',
                flexWrap: 'wrap', }}
            >
              <Table
                size="small"
                sx={{ width: 600 }}
              >
                <TableRow
                  height={80}
                  valign="top"
                >
                  <TableCell
                    sx={{ borderBottom: 'none' }}
                  >
                    <Typography
                      variant="h5"
                    >
                      City & Country
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow height={40}>
                  <TableCell
                    sx={{ width: 300,
                      borderBottom: 'none',
                    }}
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
                          &nbsp;Country Code
                      </Typography>
                    </Grid>
                    <TextField
                      size="small"
                      fullWidth
                      name="cc_country_id"
                      variant="outlined"
                      onChange={handleChange}
                      value={values.cc_country_id}
                      disabled={(!!(FormID.cc_country_id) || !editable)}
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
                          &nbsp;Country Name
                      </Typography>
                    </Grid>
                    <TextField
                      size="small"
                      fullWidth
                      name="cc_country_name"
                      variant="outlined"
                      onChange={handleChange}
                      value={values.cc_country_name}
                      disabled={!editable}
                    />
                  </TableCell>
                </TableRow>
                <TableRow height={40}>
                  <TableCell
                    sx={{ width: 300,
                      borderBottom: 'none' }}
                  >
                    <Grid sx={{
                      display: 'flex',
                      flexWrap: 'wrap' }}
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
                          &nbsp;City Code
                      </Typography>
                    </Grid>
                    <TextField
                      size="small"
                      fullWidth
                      name="cc_city_id"
                      variant="outlined"
                      onChange={handleChange}
                      value={values.cc_city_id}
                      disabled={(!!(FormID.cc_city_id) || !editable)}
                    />
                  </TableCell>
                  <TableCell
                    sx={{ width: 300,
                      borderBottom: 'none' }}
                  >
                    <Grid sx={{
                      display: 'flex',
                      flexWrap: 'wrap' }}
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
                          &nbsp;City Name
                      </Typography>
                    </Grid>
                    <TextField
                      size="small"
                      fullWidth
                      name="cc_city_name"
                      variant="outlined"
                      onChange={handleChange}
                      value={values.cc_city_name}
                      disabled={!editable}
                    />
                  </TableCell>
                </TableRow>
                <TableRow height={40}>
                  <TableCell
                    colspan={2}
                    sx={{ width: 300,
                      borderBottom: 'none' }}
                  >
                    <Typography
                      variant="h6"
                    >
                      Trade Code
                    </Typography>
                    <TextField
                      size="small"
                      fullWidth
                      name="cc_trade"
                      variant="outlined"
                      onChange={handleChange}
                      value={values.cc_trade}
                      disabled={!editable}
                    />
                  </TableCell>
                </TableRow>
                <TableRow valign="middle">
                  <TableCell
                    align="right"
                    colspan={2}
                    sx={{ borderBottom: 'none' }}
                  >
                    <Grid
                      container
                      justifyContent="space-between"
                      sx={{ mt: 3, mb: 2 }}
                    >
                      <Box
                        display={(editable) ? 'block' : 'none'}
                      >
                        Disable&nbsp;&nbsp;
                        <FormControlLabel
                          control={(
                            <Switch
                              checked={values.cc_disable}
                              value={values.cc_disable}
                              color="primary"
                              name="cc_disable"
                              onChange={handleChange}
                              disabled={!editable}
                            />
                        )}
                          label="Enable"
                        />
                      </Box>
                      <Box
                        display={(editable) ? 'block' : 'none'}
                      >
                        <Button
                          sx={{ mr: 1, width: 150 }}
                          variant="contained"
                          color="secondary"
                          type="reset"
                          size="large"
                          onClick={() => {
                            window.location.assign('/reference-data/city/');
                          }}
                        >
                          CANCEL
                        </Button>
                        <Button
                          sx={{ width: 150 }}
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
                  </TableCell>
                </TableRow>
              </Table>
            </Box>
          </form>
        )}
      </Formik>
    </>
  );
};

CityCountryEdit.propTypes = {
  event: PropTypes.object,
  range: PropTypes.object,
  FormID: PropTypes.object
};

export default CityCountryEdit;
