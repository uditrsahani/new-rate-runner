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
  Autocomplete,
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

const PortEdit = (props) => {
  const { FormID, Country, City, ...other } = props;
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState();
  const [complete, setComplete] = useState(false);
  const [editable, setEditable] = useState(false);
  const user = JSON.parse(window.localStorage.getItem('user'));

  const ControlForm = () => {
    const { values } = useFormikContext();

    useEffect(() => {
      console.log(user.user_role);
      const checkEdit = true;
      /* if (FormID) {
        checkEdit = (user.user_role === 'dataAdmin');
      } */
      setEditable(checkEdit);
    }, [values]);
    return null;
  };

  const handleClose = () => {
    setOpen(false);
    if (complete) { window.location.assign('/reference-data/port/'); }
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
            Port
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
          port_id: (FormID.port_id) ? FormID.port_id : '',
          port_city_id: (FormID.port_city_id) ? { id: FormID.port_city_id, value: FormID.port_city_name } : { id: '', value: '' },
          port_country_id: (FormID.port_country_id) ? { id: FormID.port_country_id, value: FormID.port_country_name } : { id: '', value: '' },
          port_code: (FormID.port_code) ? FormID.port_code : '',
          port_name: (FormID.port_name) ? FormID.port_name : '',
          port_region: (FormID.port_region) ? FormID.port_region : '',
          port_disable: (FormID.port_disable) ? (FormID.port_disable !== 1) : true,
        }}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          const Data = {
            port_code: values.port_code,
            port_city_id: values.port_city_id.id,
            port_country_id: values.port_country_id.id,
            port_name: values.port_name,
            port_region: values.port_region,
            port_disable: (values.port_disable) ? 0 : 1
          };
          // console.log(Data);
          let agreeform = false;
          if (values.user_fullname === '') {
            setMessage('Please enter Port Name');
            setOpen(true);
          } else if (values.user_mail === '') {
            setMessage('Please enter Email');
            setOpen(true);
          } else if (values.user_role === '') {
            setMessage('Please enter Role');
            setOpen(true);
          } else {
            agreeform = true;
          }

          if (agreeform) {
            try {
              if (values.port_id === '') {
                console.log('Contact added!');
                await instance.post('table/port', Data)
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
                console.log('Contact updated!');
                await instance.patch(`table/port/${values.port_id}`, Data)
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
                      Port
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
                      mt: -2,
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
                          &nbsp;Port Code
                      </Typography>
                    </Grid>
                    <TextField
                      size="small"
                      fullWidth
                      name="port_code"
                      variant="outlined"
                      onChange={handleChange}
                      value={values.port_code}
                      disabled={!editable}
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
                          &nbsp;Port Name
                      </Typography>
                    </Grid>
                    <TextField
                      size="small"
                      fullWidth
                      name="port_name"
                      variant="outlined"
                      onChange={handleChange}
                      value={values.port_name}
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
                      >
                          &nbsp;Country
                      </Typography>
                    </Grid>
                    <Autocomplete
                      autoHighlight
                      value={values.port_country_id}
                      options={Country}
                      fullWidth
                      getOptionLabel={(option) => option.value}
                      onChange={(event, val) => {
                        setFieldValue('port_country_id', val);
                      }}
                      disabled={!editable}
                      name="port_country_id"
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
                    sx={{ width: 300,
                      borderBottom: 'none' }}
                  >
                    <Grid sx={{
                      display: 'flex',
                      flexWrap: 'wrap' }}
                    >
                      <Typography
                        variant="h6"
                      >
                          &nbsp;City
                      </Typography>
                    </Grid>
                    <Autocomplete
                      autoHighlight
                      value={values.port_city_id}
                      options={City}
                      fullWidth
                      getOptionLabel={(option) => option.value}
                      onChange={(event, val) => {
                        setFieldValue('port_city_id', val);
                      }}
                      disabled={!editable}
                      name="port_city_id"
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
                <TableRow height={40}>
                  <TableCell
                    colspan={2}
                    sx={{ width: 300,
                      borderBottom: 'none' }}
                  >
                    <Typography
                      variant="h6"
                    >
                      Region Code
                    </Typography>
                    <TextField
                      size="small"
                      fullWidth
                      name="port_region"
                      variant="outlined"
                      onChange={handleChange}
                      value={values.port_region}
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
                              checked={values.port_disable}
                              value={values.port_disable}
                              color="primary"
                              name="port_disable"
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
                            window.location.assign('/reference-data/port/');
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

PortEdit.propTypes = {
  event: PropTypes.object,
  range: PropTypes.object,
  FormID: PropTypes.object,
  Country: PropTypes.object,
  City: PropTypes.object
};

export default PortEdit;
