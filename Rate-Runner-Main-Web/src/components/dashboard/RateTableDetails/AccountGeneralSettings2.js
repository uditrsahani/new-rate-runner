import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography
} from '@material-ui/core';
import useAuth from '../../../hooks/useAuth';
import wait from '../../../utils/wait';
import MailOutlineIcon from '@material-ui/icons/MailOutline';

const AccountGeneralSettings2 = (props) => {
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
                <CardContent sx={{
                  alignItems: 'center',
                  display: 'flex',
                  flexWrap: 'wrap',
                  minWidth: 2000,
                  ml: -1
                }}
                >
                  <Card
                    sx={{ m: 1, minWidth: 370 }}
                  >
                    <CardContent>
                      <Box>
                        <Grid
                          alignItems="center"
                          container
                          justifyContent="space-between"
                          spacing={3}
                        >
                          <Grid item>
                            <Typography
                              color="textPrimary"
                              variant="subtitle2"
                            >
                              Agent:
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            sx={{ ml: 3 }}
                          >
                            <Typography
                              color="textSecondary"
                              variant="body2"
                            >
                              agent-A
                            </Typography>
                          </Grid>
                          <Grid item />
                        </Grid>
                      </Box>
                      <Box>
                        <Grid
                          alignItems="left"
                          container
                          justifyContent="space-between"
                          spacing={3}
                        >
                          <Grid item>
                            <Typography
                              color="textPrimary"
                              variant="subtitle2"
                            >
                              Customs Per Shipment:
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            sx={{ ml: -10 }}
                          >
                            <Typography
                              color="textSecondary"
                              variant="body2"
                            >
                              USD 100
                            </Typography>
                          </Grid>
                          <Grid item />
                        </Grid>
                      </Box>
                      <Box sx={{ mt: 0.5 }}>
                        <Grid
                          alignItems="left"
                          container
                          justifyContent="space-between"
                          spacing={3}
                        >
                          <Grid item>
                            <Typography
                              color="textPrimary"
                              variant="subtitle2"
                            >
                              Customs Per Container:
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            sx={{ ml: -10 }}
                          >
                            <Typography
                              color="textSecondary"
                              variant="body2"
                            >
                              USD 200
                            </Typography>
                          </Grid>
                          <Grid item />
                        </Grid>
                      </Box>
                      <Box sx={{ mt: 0.5 }}>
                        <Grid
                          alignItems="center"
                          container
                          justifyContent="space-between"
                          spacing={3}
                        >
                          <Grid item>
                            <Typography
                              color="textPrimary"
                              variant="subtitle2"
                            >
                              Delivery Per Shipment:
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            sx={{ ml: -9 }}
                          >
                            <Typography
                              color="textSecondary"
                              variant="body2"
                            >
                              USD 140
                            </Typography>
                          </Grid>
                          <Grid item />
                        </Grid>
                      </Box>
                      <Box sx={{ mt: 0.5 }}>
                        <Grid
                          alignItems="center"
                          container
                          justifyContent="space-between"
                          spacing={3}
                        >
                          <Grid item>
                            <Typography
                              color="textPrimary"
                              variant="subtitle2"
                            >
                              Delivery Per Container:
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            sx={{ ml: -9 }}
                          >
                            <Typography
                              color="textSecondary"
                              variant="body2"
                            >
                              USD 150
                            </Typography>
                          </Grid>
                          <Grid item />
                        </Grid>
                      </Box>
                      <Box sx={{ mt: 0.5 }}>
                        <Grid
                          alignItems="center"
                          container
                          justifyContent="space-between"
                          spacing={3}
                        >
                          <Grid item>
                            <Typography
                              color="textPrimary"
                              variant="subtitle2"
                            >
                              Email:
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            sx={{ ml: 0 }}
                          >
                            <Typography
                              color="textSecondary"
                              variant="body2"
                            >
                              <MailOutlineIcon fontSize="small" />
                            </Typography>
                          </Grid>
                          <Grid item />
                        </Grid>
                      </Box>
                    </CardContent>
                  </Card>
                  <Card
                    sx={{ m: 1, minWidth: 370 }}
                  >
                    <CardContent>
                      <Box>
                        <Grid
                          alignItems="center"
                          container
                          justifyContent="space-between"
                          spacing={3}
                        >
                          <Grid item>
                            <Typography
                              color="textPrimary"
                              variant="subtitle2"
                            >
                              Agent:
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            sx={{ ml: 3 }}
                          >
                            <Typography
                              color="textSecondary"
                              variant="body2"
                            >
                              agent-B
                            </Typography>
                          </Grid>
                          <Grid item />
                        </Grid>
                      </Box>
                      <Box>
                        <Grid
                          alignItems="left"
                          container
                          justifyContent="space-between"
                          spacing={3}
                        >
                          <Grid item>
                            <Typography
                              color="textPrimary"
                              variant="subtitle2"
                            >
                              Customs Per Shipment:
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            sx={{ ml: -10 }}
                          >
                            <Typography
                              color="textSecondary"
                              variant="body2"
                            >
                              USD 100
                            </Typography>
                          </Grid>
                          <Grid item />
                        </Grid>
                      </Box>
                      <Box sx={{ mt: 0.5 }}>
                        <Grid
                          alignItems="left"
                          container
                          justifyContent="space-between"
                          spacing={3}
                        >
                          <Grid item>
                            <Typography
                              color="textPrimary"
                              variant="subtitle2"
                            >
                              Customs Per Container:
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            sx={{ ml: -10 }}
                          >
                            <Typography
                              color="textSecondary"
                              variant="body2"
                            >
                              USD 200
                            </Typography>
                          </Grid>
                          <Grid item />
                        </Grid>
                      </Box>
                      <Box sx={{ mt: 0.5 }}>
                        <Grid
                          alignItems="center"
                          container
                          justifyContent="space-between"
                          spacing={3}
                        >
                          <Grid item>
                            <Typography
                              color="textPrimary"
                              variant="subtitle2"
                            >
                              Delivery Per Shipment:
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            sx={{ ml: -9 }}
                          >
                            <Typography
                              color="textSecondary"
                              variant="body2"
                            >
                              USD 140
                            </Typography>
                          </Grid>
                          <Grid item />
                        </Grid>
                      </Box>
                      <Box sx={{ mt: 0.5 }}>
                        <Grid
                          alignItems="center"
                          container
                          justifyContent="space-between"
                          spacing={3}
                        >
                          <Grid item>
                            <Typography
                              color="textPrimary"
                              variant="subtitle2"
                            >
                              Delivery Per Container:
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            sx={{ ml: -9 }}
                          >
                            <Typography
                              color="textSecondary"
                              variant="body2"
                            >
                              USD 150
                            </Typography>
                          </Grid>
                          <Grid item />
                        </Grid>
                      </Box>
                      <Box sx={{ mt: 0.5 }}>
                        <Grid
                          alignItems="center"
                          container
                          justifyContent="space-between"
                          spacing={3}
                        >
                          <Grid item>
                            <Typography
                              color="textPrimary"
                              variant="subtitle2"
                            >
                              Email:
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            sx={{ ml: 0 }}
                          >
                            <Typography
                              color="textSecondary"
                              variant="body2"
                            >
                              <MailOutlineIcon fontSize="small" />
                            </Typography>
                          </Grid>
                          <Grid item />
                        </Grid>
                      </Box>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </form>
          )}
        </Formik>
      </Grid>
    </Grid>
  );
};

export default AccountGeneralSettings2;
