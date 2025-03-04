import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Card,
  Grid,
  Typography
} from '@material-ui/core';
import wait from '../../../utils/wait';

const AccountSecuritySettings = (props) => (
  <Formik
    initialValues={{
      password: '',
      passwordConfirm: '',
      submit: null
    }}
    validationSchema={Yup
      .object()
      .shape({
        password: Yup
          .string()
          .min(7, 'Must be at least 7 characters')
          .max(255)
          .required('Required'),
        passwordConfirm: Yup
          .string()
          .oneOf([Yup.ref('password'), null], 'Passwords must match')
          .required('Required')
      })}
    onSubmit={async (values, { resetForm, setErrors, setStatus, setSubmitting }) => {
      try {
        // NOTE: Make API request
        await wait(500);
        resetForm();
        setStatus({ success: true });
        setSubmitting(false);
        toast.success('Password updated!');
      } catch (err) {
        console.error(err);
        toast.error('Something went wrong!');
        setStatus({ success: false });
        setErrors({ submit: err.message });
        setSubmitting(false);
      }
    }}
  >
    {() => (
      <form
        spacing={3}
        {...props}
      >
        <Card>
          <Box
            sx={{
              minWidth: 800,
              p: 6
            }}
          >
            <Box sx={{ my: 1 }}>
              <Grid
                container
                justifyContent="space-between"
              >
                <Grid item>
                  <Typography
                    color="textPrimary"
                    variant="body2"
                  >
                    Quote Staytus
                  </Typography>
                </Grid>
              </Grid>
            </Box>
            <Box sx={{ my: 1 }}>
              <Grid
                container
                justifyContent="space-between"
              >
                <Grid item>
                  <Typography
                    color="textPrimary"
                    variant="body2"
                  >
                    Forecast Week No.
                  </Typography>
                </Grid>
              </Grid>
            </Box>
            <Box sx={{ my: 1 }}>
              <Grid
                container
                justifyContent="space-between"
              >
                <Grid item>
                  <Typography
                    color="textPrimary"
                    variant="body2"
                  >
                    Actaul No.
                  </Typography>
                </Grid>
              </Grid>
            </Box>
            <Box sx={{ my: 1 }}>
              <Grid
                container
                justifyContent="space-between"
              >
                <Grid item>
                  <Typography
                    color="textPrimary"
                    variant="body2"
                  >
                    Comment
                  </Typography>
                </Grid>
              </Grid>
            </Box>
            <Box sx={{ my: 1 }}>
              <Grid
                container
                justifyContent="space-between"
              >
                <Grid item>
                  <Typography
                    color="textPrimary"
                    variant="body2"
                  >
                    <br />
                  </Typography>
                </Grid>
              </Grid>
            </Box>
            <Box sx={{ my: 1 }}>
              <Grid
                container
                justifyContent="space-between"
              >
                <Grid item>
                  <Typography
                    color="textPrimary"
                    variant="body2"
                    fontWeight="fontWeightBold"
                  >
                    IF Loss, Cancel Please give information
                  </Typography>
                </Grid>
              </Grid>
            </Box>
            <Box sx={{ my: 1 }}>
              <Grid
                container
                justifyContent="space-between"
              >
                <Grid item>
                  <Typography
                    color="textPrimary"
                    variant="body2"
                  >
                    Reason
                  </Typography>
                </Grid>
              </Grid>
            </Box>
            <Box sx={{ my: 1 }}>
              <Grid
                container
                justifyContent="space-between"
              >
                <Grid item>
                  <Typography
                    color="textPrimary"
                    variant="body2"
                  >
                    Please describe
                  </Typography>
                </Grid>
              </Grid>
            </Box>
            <Box sx={{ my: 1 }}>
              <Grid
                container
                justifyContent="space-between"
              >
                <Grid item>
                  <Typography
                    color="textPrimary"
                    variant="body2"
                  >
                    Competitor Name Who Win
                  </Typography>
                </Grid>
              </Grid>
            </Box>
            <Box sx={{ my: 1 }}>
              <Grid
                container
                justifyContent="space-between"
              >
                <Grid item>
                  <Typography
                    color="textPrimary"
                    variant="body2"
                  >
                    Competitor Price (Fright)
                  </Typography>
                </Grid>
              </Grid>
            </Box>
            <Box sx={{ my: 1 }}>
              <Grid
                container
                justifyContent="space-between"
              >
                <Grid item>
                  <Typography
                    color="textPrimary"
                    variant="body2"
                  >
                    Comoment
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Card>
      </form>
    )}
  </Formik>
);

export default AccountSecuritySettings;
