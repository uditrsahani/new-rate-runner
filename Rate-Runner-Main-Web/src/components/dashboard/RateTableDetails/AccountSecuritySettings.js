import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Card,
  CardContent,
  Checkbox,
  Grid,
  TableCell,
  Table,
  TableBody,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core';
import wait from '../../../utils/wait';
import FormControlLabel from '@material-ui/core/FormControlLabel';

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
    {({ handleSubmit }) => (
      <form
        onSubmit={handleSubmit}
        {...props}
      >
        <Card alignItems="center">
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
                        Carrier:
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
                        SML
                      </Typography>
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        control={(
                          <Checkbox
                            name="gilad"
                          />
                        )}
                        label="Select"
                        labelPlacement="start"
                      />
                    </Grid>
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
                        Agent:
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      sx={{ ml: -18 }}
                    >
                      <Typography
                        color="textSecondary"
                        variant="body2"
                      >
                        WICETH
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
                        ETB LCB:
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      sx={{ ml: -18 }}
                    >
                      <Typography
                        color="textSecondary"
                        variant="body2"
                      >
                        WED, SUN
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
                        T/T:
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
                        10-12 days
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      sx={{
                        display: 'flex',
                        flexWrap: 'wrap'
                      }}
                    >
                      <Typography
                        color="textPrimary"
                        variant="subtitle2"
                      >
                        Route:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      </Typography>
                      <Typography
                        color="textSecondary"
                        variant="body2"
                      >
                        Direct
                      </Typography>
                    </Grid>
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
                        Type:
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      sx={{ ml: -21 }}
                    >
                      <Typography
                        color="textSecondary"
                        variant="body2"
                      >
                        DC
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
                    <Table
                      size="small"
                      sx={{ ml: 3, maxWidth: 280 }}
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell />
                          <TableCell>
                            20`
                          </TableCell>
                          <TableCell>
                            40`
                          </TableCell>
                          <TableCell>
                            40` HC
                          </TableCell>
                          <TableCell>
                            SET
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>
                            <Typography
                              color="textPrimary"
                              variant="subtitle2"
                            >
                              Freight:
                            </Typography>
                          </TableCell>
                          <TableCell>
                            USD 250
                          </TableCell>
                          <TableCell>
                            USD 500
                          </TableCell>
                          <TableCell>
                            USD 500
                          </TableCell>
                          <TableCell>
                            -
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <Typography
                              color="textPrimary"
                              variant="subtitle2"
                            >
                              ISPS:
                            </Typography>
                          </TableCell>
                          <TableCell>
                            -
                          </TableCell>
                          <TableCell>
                            -
                          </TableCell>
                          <TableCell>
                            -
                          </TableCell>
                          <TableCell>
                            -
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <Typography
                              color="textPrimary"
                              variant="subtitle2"
                            >
                              AMS/ENS/AFR:
                            </Typography>
                          </TableCell>
                          <TableCell>
                            -
                          </TableCell>
                          <TableCell>
                            -
                          </TableCell>
                          <TableCell>
                            -
                          </TableCell>
                          <TableCell>
                            USD 30
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <Typography
                              color="textPrimary"
                              variant="subtitle2"
                            >
                              Others:
                            </Typography>
                          </TableCell>
                          <TableCell>
                            USD 20
                          </TableCell>
                          <TableCell>
                            USD 40
                          </TableCell>
                          <TableCell>
                            USD 40
                          </TableCell>
                          <TableCell>
                            -
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
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
                        Remark:
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      sx={{ ml: -14 }}
                    >
                      <Typography
                        color="textSecondary"
                        variant="body2"
                      >
                        Subai to LSS at POD
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
                        Carrier S/C:
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      sx={{ ml: -30 }}
                    >
                      <Typography
                        color="textSecondary"
                        variant="body2"
                      >
                        -
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
                        Validity:
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
                        01/07/2021 - 31/07/2021
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
                        Carrier:
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
                        SML
                      </Typography>
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        control={(
                          <Checkbox
                            name="gilad"
                          />
                        )}
                        label="Select"
                        labelPlacement="start"
                      />
                    </Grid>
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
                        Agent:
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      sx={{ ml: -18 }}
                    >
                      <Typography
                        color="textSecondary"
                        variant="body2"
                      >
                        WICETH
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
                        ETB LCB:
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      sx={{ ml: -18 }}
                    >
                      <Typography
                        color="textSecondary"
                        variant="body2"
                      >
                        WED, SUN
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
                        T/T:
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
                        10-12 days
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      sx={{
                        display: 'flex',
                        flexWrap: 'wrap'
                      }}
                    >
                      <Typography
                        color="textPrimary"
                        variant="subtitle2"
                      >
                        Route:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      </Typography>
                      <Typography
                        color="textSecondary"
                        variant="body2"
                      >
                        Direct
                      </Typography>
                    </Grid>
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
                        Type:
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      sx={{ ml: -21 }}
                    >
                      <Typography
                        color="textSecondary"
                        variant="body2"
                      >
                        DC
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
                    <Table
                      size="small"
                      sx={{ ml: 3, maxWidth: 280 }}
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell />
                          <TableCell>
                            20`
                          </TableCell>
                          <TableCell>
                            40`
                          </TableCell>
                          <TableCell>
                            40` HC
                          </TableCell>
                          <TableCell>
                            SET
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>
                            <Typography
                              color="textPrimary"
                              variant="subtitle2"
                            >
                              Freight:
                            </Typography>
                          </TableCell>
                          <TableCell>
                            USD 250
                          </TableCell>
                          <TableCell>
                            USD 500
                          </TableCell>
                          <TableCell>
                            USD 500
                          </TableCell>
                          <TableCell>
                            -
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <Typography
                              color="textPrimary"
                              variant="subtitle2"
                            >
                              ISPS:
                            </Typography>
                          </TableCell>
                          <TableCell>
                            -
                          </TableCell>
                          <TableCell>
                            -
                          </TableCell>
                          <TableCell>
                            -
                          </TableCell>
                          <TableCell>
                            -
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <Typography
                              color="textPrimary"
                              variant="subtitle2"
                            >
                              AMS/ENS/AFR:
                            </Typography>
                          </TableCell>
                          <TableCell>
                            -
                          </TableCell>
                          <TableCell>
                            -
                          </TableCell>
                          <TableCell>
                            -
                          </TableCell>
                          <TableCell>
                            USD 30
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <Typography
                              color="textPrimary"
                              variant="subtitle2"
                            >
                              Others:
                            </Typography>
                          </TableCell>
                          <TableCell>
                            USD 20
                          </TableCell>
                          <TableCell>
                            USD 40
                          </TableCell>
                          <TableCell>
                            USD 40
                          </TableCell>
                          <TableCell>
                            -
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
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
                        Remark:
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      sx={{ ml: -14 }}
                    >
                      <Typography
                        color="textSecondary"
                        variant="body2"
                      >
                        Subai to LSS at POD
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
                        Carrier S/C:
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      sx={{ ml: -30 }}
                    >
                      <Typography
                        color="textSecondary"
                        variant="body2"
                      >
                        -
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
                        Validity:
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
                        01/07/2021 - 31/07/2021
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
                        Carrier:
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
                        SML
                      </Typography>
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        control={(
                          <Checkbox
                            name="gilad"
                          />
                        )}
                        label="Select"
                        labelPlacement="start"
                      />
                    </Grid>
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
                        Agent:
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      sx={{ ml: -18 }}
                    >
                      <Typography
                        color="textSecondary"
                        variant="body2"
                      >
                        WICETH
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
                        ETB LCB:
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      sx={{ ml: -18 }}
                    >
                      <Typography
                        color="textSecondary"
                        variant="body2"
                      >
                        WED, SUN
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
                        T/T:
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
                        10-12 days
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      sx={{
                        display: 'flex',
                        flexWrap: 'wrap'
                      }}
                    >
                      <Typography
                        color="textPrimary"
                        variant="subtitle2"
                      >
                        Route:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      </Typography>
                      <Typography
                        color="textSecondary"
                        variant="body2"
                      >
                        Direct
                      </Typography>
                    </Grid>
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
                        Type:
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      sx={{ ml: -21 }}
                    >
                      <Typography
                        color="textSecondary"
                        variant="body2"
                      >
                        DC
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
                    <Table
                      size="small"
                      sx={{ ml: 3, maxWidth: 280 }}
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell />
                          <TableCell>
                            20`
                          </TableCell>
                          <TableCell>
                            40`
                          </TableCell>
                          <TableCell>
                            40` HC
                          </TableCell>
                          <TableCell>
                            SET
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>
                            <Typography
                              color="textPrimary"
                              variant="subtitle2"
                            >
                              Freight:
                            </Typography>
                          </TableCell>
                          <TableCell>
                            USD 250
                          </TableCell>
                          <TableCell>
                            USD 500
                          </TableCell>
                          <TableCell>
                            USD 500
                          </TableCell>
                          <TableCell>
                            -
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <Typography
                              color="textPrimary"
                              variant="subtitle2"
                            >
                              ISPS:
                            </Typography>
                          </TableCell>
                          <TableCell>
                            -
                          </TableCell>
                          <TableCell>
                            -
                          </TableCell>
                          <TableCell>
                            -
                          </TableCell>
                          <TableCell>
                            -
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <Typography
                              color="textPrimary"
                              variant="subtitle2"
                            >
                              AMS/ENS/AFR:
                            </Typography>
                          </TableCell>
                          <TableCell>
                            -
                          </TableCell>
                          <TableCell>
                            -
                          </TableCell>
                          <TableCell>
                            -
                          </TableCell>
                          <TableCell>
                            USD 30
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <Typography
                              color="textPrimary"
                              variant="subtitle2"
                            >
                              Others:
                            </Typography>
                          </TableCell>
                          <TableCell>
                            USD 20
                          </TableCell>
                          <TableCell>
                            USD 40
                          </TableCell>
                          <TableCell>
                            USD 40
                          </TableCell>
                          <TableCell>
                            -
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
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
                        Remark:
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      sx={{ ml: -14 }}
                    >
                      <Typography
                        color="textSecondary"
                        variant="body2"
                      >
                        Subai to LSS at POD
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
                        Carrier S/C:
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      sx={{ ml: -30 }}
                    >
                      <Typography
                        color="textSecondary"
                        variant="body2"
                      >
                        -
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
                        Validity:
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
                        01/07/2021 - 31/07/2021
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
);

export default AccountSecuritySettings;
