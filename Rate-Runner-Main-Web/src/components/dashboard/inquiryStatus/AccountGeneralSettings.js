import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Card,
  Grid,
  Typography
} from '@material-ui/core';
import useAuth from '../../../hooks/useAuth';
import wait from '../../../utils/wait';

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
                          Inquiry No.
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography
                          color="textPrimary"
                          variant="body2"
                        >
                          Inquiry Date
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography
                          align="right"
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
                        >
                          Sales
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography
                          color="textPrimary"
                          variant="body2"
                        >
                          Team
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography
                          align="right"
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
                        >
                          Customer
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography
                          color="textPrimary"
                          variant="body2"
                        >
                          Customer Type
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography
                          align="right"
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
                        >
                          Mode
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography
                          color="textPrimary"
                          variant="body2"
                        >
                          Incoterms
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography
                          align="right"
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
                        >
                          Factory Location
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography
                          color="textPrimary"
                          variant="body2"
                        >
                          <br />
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography
                          align="right"
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
                        >
                          Place Of Receipt
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography
                          color="textPrimary"
                          variant="body2"
                        >
                          <br />
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography
                          align="right"
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
                        >
                          POL
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography
                          color="textPrimary"
                          variant="body2"
                        >
                          POD
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography
                          align="right"
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
                        >
                          Final Destination
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography
                          color="textPrimary"
                          variant="body2"
                        >
                          <br />
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography
                          align="right"
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
                        >
                          Type
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography
                          color="textPrimary"
                          variant="body2"
                        >
                          Commodity
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography
                          align="right"
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
                        >
                          Container
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography
                          color="textPrimary"
                          variant="body2"
                        >
                          <br />
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography
                          align="right"
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
                        >
                          20&rsquo;
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography
                          color="textPrimary"
                          variant="body2"
                        >
                          <br />
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography
                          align="right"
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
                        >
                          40&rsquo;
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography
                          color="textPrimary"
                          variant="body2"
                        >
                          <br />
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography
                          align="right"
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
                        >
                          40&rsquo; HC
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography
                          color="textPrimary"
                          variant="body2"
                        >
                          <br />
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography
                          align="right"
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
                        >
                          CBM
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography
                          color="textPrimary"
                          variant="body2"
                        >
                          <br />
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography
                          align="right"
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
                        >
                          Spacial Container
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography
                          color="textPrimary"
                          variant="body2"
                        >
                          <br />
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography
                          align="right"
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
                        >
                          GW Per CNTR (Kg)
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography
                          color="textPrimary"
                          variant="body2"
                        >
                          Cargo Readiness
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography
                          align="right"
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
                        >
                          Idea Rate Per Unit
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography
                          color="textPrimary"
                          variant="body2"
                        >
                          <br />
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography
                          align="right"
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
                        >
                          <br />
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography
                          color="textPrimary"
                          variant="body2"
                        >
                          <br />
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography
                          align="right"
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
                          Spacial Requirement
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography
                          color="textPrimary"
                          variant="body2"
                        >
                          <br />
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography
                          align="right"
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
                        >
                          Freetime
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography
                          color="textPrimary"
                          variant="body2"
                        >
                          <br />
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography
                          align="right"
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
                        >
                          Competitor
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography
                          color="textPrimary"
                          variant="body2"
                        >
                          <br />
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography
                          align="right"
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
                        >
                          Current Carrier
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography
                          color="textPrimary"
                          variant="body2"
                        >
                          <br />
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography
                          align="right"
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
                        >
                          Other/Comment
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography
                          color="textPrimary"
                          variant="body2"
                        >
                          <br />
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography
                          align="right"
                          color="textPrimary"
                          variant="body2"
                        >
                          <br />
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              </Card>
            </form>
          )}
        </Formik>
      </Grid>
    </Grid>
  );
};

export default AccountGeneralSettings;
