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
import generator from 'generate-password';
import { Team, Role, Level } from '../../../store/data.json';
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

const UserEdit = (props) => {
  const { FormID, Reset, ...other } = props;
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState();
  const [complete, setComplete] = useState(false);
  const [editable, setEditable] = useState(false);

  const ControlForm = () => {
    const { values } = useFormikContext();

    useEffect(() => {
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
    if (complete) { window.location.assign('/reference-data/user/'); }
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
            Reset Password
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
          user_username: (FormID.user_username) ? FormID.user_username : '',
          user_phone: (FormID.user_phone) ? FormID.user_phone : '',
          user_mail: (FormID.user_mail) ? FormID.user_mail : '',
          user_social_id: (FormID.user_social_id) ? FormID.user_social_id : '',
          user_level: (FormID.user_level) ? FormID.user_level : '',
          user_team: (FormID.user_team) ? FormID.user_team : '',
          user_image: (FormID.user_image) ? FormID.user_image : '',
          user_role: (FormID.user_role) ? FormID.user_role : '',
          user_password: (Reset) ? generator.generate({ length: 8, numbers: true }) : FormID.user_password,
          user_disable: (FormID.user_disable) ? (FormID.user_disable !== 1) : true,
        }}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          if (Reset) {
            const Data = {
              user_password: values.user_password
            };
            const agreeform = true;
            // console.log(Data);

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
                      setMessage('Completed');
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
          } else {
            let Data = [];
            if (values.user_id === '') {
              Data = {
                user_fullname: values.user_fullname,
                user_username: values.user_username,
                user_mobile: values.user_mobile,
                user_phone: values.user_phone,
                user_mail: values.user_mail,
                user_social_id: values.user_social_id,
                user_level: values.user_level,
                user_team: values.user_team,
                user_image: (values.user_image) ? values.user_image : null,
                user_role: values.user_role,
                user_password: values.user_password,
                user_disable: (values.user_disable) ? 0 : 1
              };
            } else {
              Data = {
                user_fullname: values.user_fullname,
                user_username: values.user_username,
                user_mobile: values.user_mobile,
                user_phone: values.user_phone,
                user_mail: values.user_mail,
                user_social_id: values.user_social_id,
                user_level: values.user_level,
                user_team: values.user_team,
                user_image: (values.user_image) ? values.user_image : null,
                user_role: values.user_role,
                user_disable: (values.user_disable) ? 0 : 1
              };
            }

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
            } else {
              agreeform = true;
            }

            if (agreeform) {
              try {
                if (values.user_id === '') {
                  console.log('Contact added!');
                  await instance.post('profile/sale/', Data)
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
            <Box
              sx={{ mt: -2,
                display: 'flex',
                flexWrap: 'wrap', }}
            >
              <Grid
                display={(Reset) ? 'none' : 'block'}
              >
                <Table
                  size="small"
                  sx={{ width: 550 }}
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
                        User
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
                    <TableCell
                      sx={{ width: 300,
                        borderBottom: 'none' }}
                    >
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
                  </TableRow>
                  <TableRow height={40}>
                    <TableCell
                      colspan={2}
                      sx={{ width: 300,
                        borderBottom: 'none',
                      }}
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
                          &nbsp;Username
                        </Typography>
                      </Grid>
                      <TextField
                        size="small"
                        fullWidth
                        name="user_username"
                        variant="outlined"
                        onChange={handleChange}
                        value={values.user_username}
                      />
                    </TableCell>
                  </TableRow>
                  <Grid
                    display={(values.user_id) ? 'none' : 'block'}
                  >
                    <TableRow
                      height={40}
                    >
                      <TableCell
                        colspan={2}
                        sx={{ width: 300,
                          borderBottom: 'none' }}
                      >
                        <Typography
                          variant="h6"
                        >
                          &nbsp;Password
                        </Typography>
                        <TextField
                          size="small"
                          fullWidth
                          name="user_password"
                          type="password"
                          variant="outlined"
                          onChange={handleChange}
                          value={values.user_password}
                        />
                      </TableCell>
                    </TableRow>
                  </Grid>
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
                        name="user_mail"
                        variant="outlined"
                        onChange={handleChange}
                        value={values.user_mail}
                      />
                    </TableCell>
                    <TableCell
                      sx={{ width: 300,
                        borderBottom: 'none',
                      }}
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
                        borderBottom: 'none',
                      }}
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
                          &nbsp;Level
                        </Typography>
                      </Grid>
                      <TextField
                        size="small"
                        fullWidth
                        name="user_role"
                        onChange={(val) => {
                          setFieldValue('user_role', val.target.value);
                          // setFieldValue('user_level', Role.filter((data) => data.value === val.target.value)[0].label);
                        }}
                        select
                        defaultValue={values.user_role}
                        SelectProps={{ native: true }}
                        variant="outlined"
                      >
                        {Role.map((obj) => (
                          <option
                            key={obj.value}
                            value={obj.value}
                            selected={values.user_role === obj.value}
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
                  </TableRow>
                  <TableRow height={40}>
                    <TableCell
                      sx={{ width: 300,
                        borderBottom: 'none',
                      }}
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
                        {Level.map((obj) => (
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
                                checked={values.user_disable}
                                value={values.user_disable}
                                color="primary"
                                name="user_disable"
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
                              window.location.assign('/reference-data/user/');
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
              </Grid>
              <Grid display={(Reset) ? 'block' : 'none'}>
                <Table
                  size="small"
                  sx={{ width: 550 }}
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
                        Reset Password
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow height={40}>
                    <TableCell
                      colspan={2}
                      sx={{ width: 300,
                        borderBottom: 'none',
                      }}
                    >
                      <Grid sx={{
                        display: 'flex',
                        flexWrap: 'wrap' }}
                      >
                        <Typography
                          variant="h6"
                        >
                          &nbsp;Username
                        </Typography>
                      </Grid>
                      <TextField
                        size="small"
                        fullWidth
                        name="user_username"
                        variant="outlined"
                        onChange={handleChange}
                        value={values.user_username}
                        disabled
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow height={40}>
                    <TableCell
                      colspan={2}
                      sx={{ width: 300,
                        borderBottom: 'none',
                      }}
                    >
                      <Grid sx={{
                        display: 'flex',
                        flexWrap: 'wrap' }}
                      >
                        <Typography
                          variant="h6"
                        >
                          &nbsp;New Password
                        </Typography>
                      </Grid>
                      <TextField
                        size="small"
                        fullWidth
                        name="user_password"
                        variant="outlined"
                        onChange={handleChange}
                        disabled
                        value={values.user_password}
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
                        <Box />
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
                              window.location.assign('/reference-data/user/');
                            }}
                          >
                            CANCEL
                          </Button>
                          <Button
                            sx={{ mr: 1, width: 150 }}
                            variant="contained"
                            onClick={() => {
                              const password = generator.generate({
                                length: 8,
                                numbers: true
                              });
                              setFieldValue('user_password', password);
                            }}
                            color="warning"
                            size="large"
                          >
                            RE-GENERATE
                          </Button>
                          <Button
                            sx={{ width: 150 }}
                            variant="contained"
                            disabled={isSubmitting || !editable}
                            color="info"
                            size="large"
                            type="submit"
                          >
                            CONFIRM
                          </Button>
                        </Box>
                      </Grid>
                    </TableCell>
                  </TableRow>
                </Table>
              </Grid>
            </Box>
          </form>
        )}
      </Formik>
    </>
  );
};

UserEdit.propTypes = {
  event: PropTypes.object,
  range: PropTypes.object,
  FormID: PropTypes.object,
  Reset: PropTypes.object,
};

export default UserEdit;
