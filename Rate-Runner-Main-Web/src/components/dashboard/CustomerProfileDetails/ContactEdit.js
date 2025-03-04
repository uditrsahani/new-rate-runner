import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { Formik } from 'formik';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import instance from '../../../store/instance';
import { ContactType } from '../../../store/data.json';
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

const ContactEdit = (props) => {
  const { ContactID, CustomerID, ...other } = props;
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState();
  const [complete, setComplete] = useState(false);

  const handleClose = () => {
    setOpen(false);
    if (complete) { window.location.assign(`/reference-data/customer/details/${CustomerID}`); }
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
            Contact
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
          ct_uuid: (ContactID.ct_uuid) ? ContactID.ct_uuid : '',
          ct_refer_table: (ContactID.ct_refer_table) ? ContactID.ct_refer_table : '',
          ct_refer_id: (ContactID.ct_refer_id) ? ContactID.ct_refer_id : '',
          ct_name: (ContactID.ct_name) ? ContactID.ct_name : '',
          ct_position: (ContactID.ct_position) ? ContactID.ct_position : '',
          ct_department: (ContactID.ct_department) ? ContactID.ct_department : '',
          ct_mail: (ContactID.ct_mail) ? ContactID.ct_mail : '',
          ct_mobile: (ContactID.ct_mobile) ? ContactID.ct_mobile : '',
          ct_phone: (ContactID.ct_phone) ? ContactID.ct_phone : '',
          ct_social_id: (ContactID.ct_social_id) ? ContactID.ct_social_id : '',
          ct_type: (ContactID.ct_type) ? ContactID.ct_type : '',
          ct_disable: (ContactID.ct_disable) ? (ContactID.ct_disable !== '1') : true,
        }}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          let Data;
          if (values.ct_uuid === '') {
            Data = [{
              ct_refer_table: 'customer',
              ct_refer_id: CustomerID,
              ct_name: values.ct_name,
              ct_position: values.ct_position,
              ct_department: values.ct_department,
              ct_mail: values.ct_mail,
              ct_mobile: values.ct_mobile,
              ct_phone: values.ct_phone,
              ct_social_id: values.ct_social_id,
              ct_type: values.ct_type,
              ct_disable: (values.ct_disable) ? 0 : 1
            }];
          } else {
            Data = {
              ct_refer_table: 'customer',
              ct_refer_id: CustomerID,
              ct_name: values.ct_name,
              ct_position: values.ct_position,
              ct_department: values.ct_department,
              ct_mail: values.ct_mail,
              ct_mobile: values.ct_mobile,
              ct_phone: values.ct_phone,
              ct_social_id: values.ct_social_id,
              ct_type: values.ct_type,
              ct_disable: (values.ct_disable) ? 0 : 1
            };
          }

          // console.log(Data);

          let agreeform = false;
          if (values.ct_name === '') {
            setMessage('Please enter Contact Name');
            setOpen(true);
          } else if (values.ct_mail === '') {
            setMessage('Please enter Email');
            setOpen(true);
          } else {
            agreeform = true;
          }

          if (agreeform) {
            try {
              if (values.ct_uuid === '') {
                console.log('Contact added!');
                await instance.post('contact', Data)
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
                await instance.patch(`contact/${values.ct_uuid}`, Data)
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
            <Box sx={{ mt: -2 }}>
              <Table size="small">
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
                      Contact
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
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
                          &nbsp;Contact Name
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
                          &nbsp;Email
                      </Typography>
                    </Grid>
                    <TextField
                      size="small"
                      fullWidth
                      name="ct_mail"
                      variant="outlined"
                      onChange={handleChange}
                      value={values.ct_mail}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    sx={{ width: 300,
                      borderBottom: 'none' }}
                  >
                    <Typography
                      variant="h6"
                    >
                      Position
                    </Typography>
                    <TextField
                      size="small"
                      fullWidth
                      name="ct_position"
                      variant="outlined"
                      onChange={handleChange}
                      value={values.ct_position}
                    />
                  </TableCell>
                  <TableCell
                    sx={{ width: 300,
                      borderBottom: 'none' }}
                  >
                    <Typography
                      variant="h6"
                    >
                      Department
                    </Typography>
                    <TextField
                      size="small"
                      fullWidth
                      name="ct_department"
                      variant="outlined"
                      onChange={handleChange}
                      value={values.ct_department}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    sx={{ width: 300,
                      borderBottom: 'none' }}
                  >
                    <Typography
                      variant="h6"
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
                  <TableCell
                    sx={{ width: 300,
                      borderBottom: 'none' }}
                  >
                    <Typography
                      variant="h6"
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
                <TableRow>
                  <TableCell
                    sx={{ width: 300,
                      borderBottom: 'none' }}
                  >
                    <Typography
                      variant="h6"
                    >
                      Social ID
                    </Typography>
                    <TextField
                      size="small"
                      fullWidth
                      name="ct_social_id"
                      variant="outlined"
                      onChange={handleChange}
                      value={values.ct_social_id}
                    />
                  </TableCell>
                  <TableCell
                    sx={{ width: 300,
                      borderBottom: 'none' }}
                  >
                    <Typography
                      variant="h6"
                    >
                      Contact Type
                    </Typography>
                    <TextField
                      size="small"
                      fullWidth
                      name="ct_type"
                      onChange={(val) => {
                        setFieldValue('ct_type', val.target.value);
                      }}
                      select
                      defaultValue={values.ct_type}
                      SelectProps={{ native: true }}
                      variant="outlined"
                    >
                      {ContactType.map((obj) => (
                        <option
                          key={obj.value}
                          value={obj.value}
                          selected={values.ct_type === obj.value}
                        >
                          {obj.label}
                        </option>
                      ))}
                    </TextField>
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
                      <Box>
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
                      <Box>
                        <Button
                          sx={{ mr: 1, width: 150 }}
                          variant="contained"
                          color="secondary"
                          type="reset"
                          size="large"
                          onClick={() => {
                            window.location.assign(`/reference-data/customer/details/${CustomerID}`);
                          }}
                        >
                          CANCEL
                        </Button>
                        <Button
                          sx={{ width: 150 }}
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

ContactEdit.propTypes = {
  event: PropTypes.object,
  range: PropTypes.object,
  ContactID: PropTypes.object,
  CustomerID: PropTypes.object
};

export default ContactEdit;
