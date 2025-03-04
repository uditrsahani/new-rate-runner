import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Card,
  Grid,
  TableCell,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TextField
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
                <Box
                  sx={{
                    minWidth: 800,
                    p: 6
                  }}
                >
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell />
                        <TableCell />
                        <TableCell />
                        <TableCell>
                          Customs
                        </TableCell>
                        <TableCell />
                        <TableCell>
                          Customs
                        </TableCell>
                        <TableCell />
                        <TableCell>
                          Delivery
                        </TableCell>
                        <TableCell />
                        <TableCell>
                          Delivery
                        </TableCell>
                        <TableCell />
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          Select Rate
                        </TableCell>
                        <TableCell>
                          Agent
                        </TableCell>
                        <TableCell>
                          Currency
                        </TableCell>
                        <TableCell>
                          Per Shipment
                        </TableCell>
                        <TableCell>
                          Currency
                        </TableCell>
                        <TableCell>
                          Per Shipment
                        </TableCell>
                        <TableCell>
                          Currency
                        </TableCell>
                        <TableCell>
                          Per Shipment
                        </TableCell>
                        <TableCell>
                          Currency
                        </TableCell>
                        <TableCell>
                          Per Container
                        </TableCell>
                        <TableCell align="center">
                          Email
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          R
                        </TableCell>
                        <TableCell>
                          agent-A
                        </TableCell>
                        <TableCell>
                          usd
                        </TableCell>
                        <TableCell>
                          100
                        </TableCell>
                        <TableCell>
                          usd
                        </TableCell>
                        <TableCell>
                          200
                        </TableCell>
                        <TableCell>
                          usd
                        </TableCell>
                        <TableCell>
                          140
                        </TableCell>
                        <TableCell>
                          usd
                        </TableCell>
                        <TableCell>
                          150
                        </TableCell>
                        <TableCell align="center">
                          <MailOutlineIcon fontSize="small" />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell />
                        <TableCell>
                          agent-B
                        </TableCell>
                        <TableCell>
                          usd
                        </TableCell>
                        <TableCell>
                          90
                        </TableCell>
                        <TableCell>
                          usd
                        </TableCell>
                        <TableCell>
                          300
                        </TableCell>
                        <TableCell>
                          usd
                        </TableCell>
                        <TableCell>
                          120
                        </TableCell>
                        <TableCell>
                          usd
                        </TableCell>
                        <TableCell>
                          400
                        </TableCell>
                        <TableCell align="center">
                          <MailOutlineIcon fontSize="small" />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  <Box
                    sx={{
                      mt: 2,
                      maxWidth: '100%',
                      width: 850
                    }}
                  >
                    <TextField
                      sx={{ width: 1170 }}
                      fullWidth
                      multiline
                      placeholder="Leave a message"
                      label="Comment"
                      rows={6}
                      variant="outlined"
                    />
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

export default AccountGeneralSettings2;
