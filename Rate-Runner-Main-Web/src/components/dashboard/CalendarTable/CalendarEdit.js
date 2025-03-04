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
import { Month } from '../../../store/data.json';
import {
  Box,
  Button,
  Grid,
  Table,
  TableCell,
  TableRow,
  Typography,
  TextField
} from '@material-ui/core';

const UserEdit = (props) => {
  const { FormID, ...other } = props;
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState();
  const [complete, setComplete] = useState(false);
  const [editable, setEditable] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const user = JSON.parse(window.localStorage.getItem('user'));

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

  const handleClose = () => {
    setOpen(false);
    if (complete) { window.location.assign('/reference-data/calendar/'); }
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
          cd_date: (FormID.cd_date) ? FormID.cd_date : '',
          cd_month: (FormID.cd_month) ? FormID.cd_month : '',
          cd_holiday: (FormID.cd_holiday) ? FormID.cd_holiday : '',
        }}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          const Data = {
            cd_date: Number(values.cd_date),
            cd_month: Number(values.cd_month),
            cd_holiday: values.cd_holiday
          };
          console.log(Data);
          let agreeform = false;
          if (values.cd_date === '') {
            setMessage('Please enter date');
            setOpen(true);
          } else if (values.cd_month === '') {
            setMessage('Please enter month');
            setOpen(true);
          } else if (values.cd_holiday === '') {
            setMessage('Please enter holiday');
            setOpen(true);
          } else {
            agreeform = true;
          }

          if (agreeform) {
            try {
              console.log('holiday added!');
              await instance.post('schedule/holiday', Data)
                .then((res) => {
                  // resetForm();
                  setStatus({ success: true });
                  setSubmitting(false);
                  setComplete(true);
                  setMessage('Complete form');
                  setOpen(true);
                  console.log(res, Data);
                });
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
                flexWrap: 'wrap' }}
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
                      Add Holiday
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
                          &nbsp;Date
                      </Typography>
                    </Grid>
                    <TextField
                      size="small"
                      fullWidth
                      name="cd_date"
                      variant="outlined"
                      onChange={handleChange}
                      value={values.cd_date}
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
                          &nbsp;Month
                      </Typography>
                    </Grid>
                    <TextField
                      size="small"
                      fullWidth
                      name="cd_month"
                      onChange={handleChange}
                      select
                      SelectProps={{ native: true }}
                      variant="outlined"
                    >
                      {Month.map((obj) => (
                        <option
                          key={obj.value}
                          value={obj.value}
                        >
                          {obj.label}
                        </option>
                      ))}
                    </TextField>
                  </TableCell>
                </TableRow>
                <TableRow height={40}>
                  <TableCell
                    colspan={2}
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
                          &nbsp;Holiday
                      </Typography>
                    </Grid>
                    <TextField
                      size="small"
                      fullWidth
                      name="cd_holiday"
                      variant="outlined"
                      onChange={handleChange}
                      value={values.cd_holiday}
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
                      />
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
                            window.location.assign('/reference-data/calendar/');
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

UserEdit.propTypes = {
  event: PropTypes.object,
  range: PropTypes.object,
  FormID: PropTypes.object,
};

export default UserEdit;
