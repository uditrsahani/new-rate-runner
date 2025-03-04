import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Card,
  CardContent,
  Grid,
  InputAdornment,
  TextField,
  Typography
} from '@material-ui/core';
import useAuth from '../../../hooks/useAuth';
import wait from '../../../utils/wait';
import EventNoteIcon from '@material-ui/icons/EventNote';

const AccountGeneralSettings = (props) => {
  const { user } = useAuth();

  return (
    <Grid
      container
      spacing={3}
      {...props}
    >
      <Grid
        item
        lg={12}
        md={6}
        xl={9}
        xs={12}
      >
        <Formik
          enableReinitialize
          initialValues={{
            canHire: user.canHire || false,
            city: user.city || '',
            country: user.country || '',
            email: user.email || '',
            isPublic: user.isPublic || false,
            name: user.name || '',
            phone: user.phone || '',
            state: user.state || '',
            submit: null
          }}
          validationSchema={Yup
            .object()
            .shape({
              canHire: Yup.bool(),
              city: Yup.string().max(255),
              country: Yup.string().max(255),
              email: Yup
                .string()
                .email('Must be a valid email')
                .max(255)
                .required('Email is required'),
              isPublic: Yup.bool(),
              name: Yup
                .string()
                .max(255)
                .required('Name is required'),
              phone: Yup.string(),
              state: Yup.string()
            })}
          onSubmit={async (values, { resetForm, setErrors, setStatus, setSubmitting }) => {
            try {
              // NOTE: Make API request
              await wait(200);
              resetForm();
              setStatus({ success: true });
              setSubmitting(false);
              toast.success('Profile updated!');
            } catch (err) {
              console.error(err);
              toast.error('Something went wrong!');
              setStatus({ success: false });
              setErrors({ submit: err.message });
              setSubmitting(false);
            }
          }}
        >
          {({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <Card>
                <CardContent>
                  <Box
                    sx={{
                      minWidth: 800,
                      p: 3
                    }}
                  >
                    <Grid
                      container
                      justifyContent="space-between"
                    >
                      <Box
                        sx={{
                          alignItems: 'center',
                          display: 'flex',
                          flexWrap: 'wrap',
                        }}
                      >
                        <Box
                          sx={{
                            m: 1,
                            maxWidth: '100%',
                            width: 300
                          }}
                        >
                          <Typography
                            variant="h6"
                          >
                            Agent
                          </Typography>
                          <TextField
                            size="small"
                            fullWidth
                            name="Customer"
                            select
                            variant="outlined"
                          />
                        </Box>
                        <Box
                          sx={{
                            m: 1,
                            maxWidth: '100%',
                            width: 300
                          }}
                        >
                          <Typography
                            variant="h6"
                          >
                            Carrier
                          </Typography>
                          <TextField
                            size="small"
                            fullWidth
                            name="POL"
                            select
                            SelectProps={{ native: true }}
                            variant="outlined"
                          />
                        </Box>
                        <Box
                          sx={{
                            m: 1,
                            maxWidth: '100%',
                            width: 220
                          }}
                        >
                          <Typography
                            variant="h6"
                          >
                            Valid From
                          </Typography>
                          <TextField
                            size="small"
                            fullWidth
                            name="Customer"
                            select
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <EventNoteIcon fontSize="small" />
                                </InputAdornment>
                              )
                            }}
                            variant="outlined"
                          />
                        </Box>
                        <Box
                          sx={{
                            m: 1,
                            maxWidth: '100%',
                            width: 220
                          }}
                        >
                          <Typography
                            variant="h6"
                          >
                            Expired to
                          </Typography>
                          <TextField
                            size="small"
                            fullWidth
                            name="Customer"
                            select
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <EventNoteIcon fontSize="small" />
                                </InputAdornment>
                              )
                            }}
                            variant="outlined"
                          />
                        </Box>
                        <Box
                          sx={{
                            m: 1,
                            maxWidth: '100%',
                            width: 300
                          }}
                        >
                          <Typography
                            variant="h6"
                          >
                            POL
                          </Typography>
                          <TextField
                            size="small"
                            fullWidth
                            name="Customer"
                            select
                            variant="outlined"
                          />
                        </Box>
                        <Box
                          sx={{
                            m: 1,
                            maxWidth: '100%',
                            width: 300
                          }}
                        >
                          <Typography
                            variant="h6"
                          >
                            POD
                          </Typography>
                          <TextField
                            size="small"
                            fullWidth
                            name="POL"
                            select
                            SelectProps={{ native: true }}
                            variant="outlined"
                          />
                        </Box>
                      </Box>
                    </Grid>
                  </Box>
                </CardContent>
              </Card>
            </form>
          )}
        </Formik>
      </Grid>
    </Grid>
  );
};

export default AccountGeneralSettings;
