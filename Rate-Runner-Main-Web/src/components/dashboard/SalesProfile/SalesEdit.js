/* eslint-disable no-unused-vars */
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
import { Team, Level } from '../../../store/data.json';
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

const SalesEdit = (props) => {
  const { FormID, ...other } = props;
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState();
  const [complete, setComplete] = useState(false);
  const [files, setFiles] = useState([]);
  const user = JSON.parse(window.localStorage.getItem('user'));
  const role = user.user_role;

  const handleDrop = (newFiles) => {
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleRemove = (file) => {
    setFiles((prevFiles) => prevFiles.filter((_file) => _file.path !== file.path));
  };

  const handleRemoveAll = () => {
    setFiles([]);
  };

  const handleClose = () => {
    setOpen(false);
    if (complete) { window.location.assign('/reference-data/sales/'); }
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
          user_id: (FormID.user_id) ? FormID.user_id : '',
          user_username: (FormID.user_username) ? FormID.user_username : '',
          user_fullname: (FormID.user_fullname) ? FormID.user_fullname : '',
          user_mobile: (FormID.user_mobile) ? FormID.user_mobile : '',
          user_phone: (FormID.user_phone) ? FormID.user_phone : '',
          user_mail: (FormID.user_mail) ? FormID.user_mail : '',
          user_social_id: (FormID.user_social_id) ? FormID.user_social_id : '',
          user_level: (FormID.user_level) ? FormID.user_level : '',
          user_team: (FormID.user_team) ? FormID.user_team : '',
          user_image: (FormID.user_image) ? FormID.user_image : '',
          user_disable: (FormID.user_disable) ? (FormID.user_disable !== 1) : true,
          user_role: (FormID.user_role) ? FormID.user_role : '',
        }}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          const Data = {
            user_username: values.user_mail,
            user_password: (values.user_password) ? values.user_password : '1234',
            user_fullname: values.user_fullname,
            user_mobile: values.user_mobile,
            user_phone: values.user_phone,
            user_mail: values.user_mail,
            user_social_id: values.user_social_id,
            user_level: values.user_level,
            user_team: values.user_team,
            user_image: values.user_image,
            user_disable: (values.user_disable) ? 0 : 1,
            user_role: (values.user_role) ? values.user_role : 'sales'
          };
          // console.log(Data);
          let agreeform = false;
          if (values.user_fullname === '') {
            setMessage('Please enter Sales Name');
            setOpen(true);
          } else if (values.user_mail === '') {
            setMessage('Please enter Email');
            setOpen(true);
          } else if (values.user_level === '') {
            setMessage('Please enter Level');
            setOpen(true);
          } else {
            agreeform = true;
          }

          if (agreeform) {
            try {
              if (values.user_id === '') {
                console.log('Contact added!');
                await instance.post('profile/sale', Data)
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
          handleSubmit, isSubmitting, handleChange, values, resetForm, setFieldValue
        }) => (
          <form
            onSubmit={handleSubmit}
            {...other}
          >
            <Box
              sx={{ mt: -2,
                display: 'flex',
                flexWrap: 'wrap', }}
            >
              {/* <Card sx={{ width: 350, height: 450, mt: 2, mb: 2 }}>
                <CardHeader title="Select Image" />
                <CardContent>
                  <FileDropzone
                    name="filexxx"
                    accept=".xlsx"
                    files={files}
                    onDrop={handleDrop}
                    onRemove={handleRemove}
                    onRemoveAll={handleRemoveAll}
                  />
                </CardContent>
              </Card> */}
              <Table
                size="small"
                sx={{ width: 800 }}
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
                      Sales
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow height={40}>
                  <TableCell
                    sx={{ width: 300,
                      borderBottom: 'none',
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ mt: -2 }}
                    >
                      Sales Code
                    </Typography>
                    <TextField
                      size="small"
                      fullWidth
                      name="user_id"
                      variant="outlined"
                      onChange={handleChange}
                      value={values.user_id}
                      disabled
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
                          &nbsp;Sales Name
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
                          &nbsp;Email
                      </Typography>
                    </Grid>
                    <TextField
                      size="small"
                      fullWidth
                      type="email"
                      name="user_mail"
                      variant="outlined"
                      onChange={handleChange}
                      value={values.user_mail}
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
                      name="user_phone"
                      variant="outlined"
                      onChange={handleChange}
                      value={values.user_phone}
                    />
                  </TableCell>
                </TableRow>
                <TableRow height={40}>
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
                    <Typography
                      variant="h6"
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
                </TableRow>
                <TableRow height={40}>
                  <TableCell
                    sx={{ width: 300,
                      borderBottom: 'none' }}
                  >
                    <Typography
                      variant="h6"
                    >
                      Title position
                    </Typography>
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
                        .filter((data) => ((data.value !== 'IT' && data.value !== 'Marketing Offer' && data.value !== 'Marketing Manager' && data.value !== 'Management')))
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
                    >
                      {Team
                        .filter((data) => (data.value !== 'Management' && data.value !== 'Marketing'))
                        .map((obj) => (
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
                              checked={values.user_disable}
                              value={values.user_disable}
                              color="primary"
                              name="user_disable"
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
                            window.location.assign('/reference-data/sales/');
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

SalesEdit.propTypes = {
  event: PropTypes.object,
  range: PropTypes.object,
  FormID: PropTypes.object
};

export default SalesEdit;
