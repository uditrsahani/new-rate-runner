import * as Yup from 'yup';
import { Formik } from 'formik';
import { Box, Button,
  TextField, FormHelperText, Divider
} from '@material-ui/core';
import useAuth from '../../../hooks/useAuth';
import useMounted from '../../../hooks/useMounted';
import instance from '../../../store/instance';
import { useEffect } from 'react';

const LoginJWT = (props) => {
  const mounted = useMounted();

  const getData = async () => {
    await instance.get('/auth/azure/login')
      .then((res) => {
        if (mounted.current) {
          window.location.assign(res.data);
        }
      });
  };
  useEffect(() => {
    const tempToken = new URLSearchParams(window.location.search).get('token');
    let Data = '';
    let page = '';
    if (tempToken === 'null') {
      // eslint-disable-next-line no-alert
      alert('your user account does not register to RATERUNNER');
    } else if (tempToken) {
      Data = {
        token: new URLSearchParams(window.location.search).get('token'),
        user_id: new URLSearchParams(window.location.search).get('user_id'),
        user_username: new URLSearchParams(window.location.search).get('user_username'),
        user_mail: new URLSearchParams(window.location.search).get('user_mail'),
        user_role: new URLSearchParams(window.location.search).get('user_role'),
        user_fullname: new URLSearchParams(window.location.search).get('user_fullname'),
        user_phone: new URLSearchParams(window.location.search).get('user_phone'),
        user_mobile: new URLSearchParams(window.location.search).get('user_mobile'),
        user_team: new URLSearchParams(window.location.search).get('user_team'),
        ad: 1
      };
      page = {
        inquiryStatus: 0,
        recommend: 0,
        inquiry: 0,
        quotationDraft: 0,
        updateResult: 0,
        forecast: 0,
        inquiryStatusL: 10,
        recommendL: 10,
        inquiryL: 10,
        quotationDraftL: 10,
        updateResultL: 10,
        forecastL: 10
      };
      localStorage.setItem('menupage', JSON.stringify(page));
      localStorage.setItem('user', JSON.stringify(Data));
      localStorage.setItem('rateTable', 0);
      localStorage.setItem('rateTableL', 0);
      localStorage.setItem('city', 0);
      localStorage.setItem('cityL', 0);
      localStorage.setItem('port', 0);
      localStorage.setItem('portL', 0);
      localStorage.setItem('sales', 0);
      localStorage.setItem('salesL', 0);
      localStorage.setItem('agent', 0);
      localStorage.setItem('agentL', 0);
      localStorage.setItem('carrier', 0);
      localStorage.setItem('carrierL', 0);
      localStorage.setItem('customer', 0);
      localStorage.setItem('customerL', 0);
      localStorage.setItem('competitor', 0);
      localStorage.setItem('competitorL', 0);
      localStorage.setItem('calendar', 0);
      localStorage.setItem('calendarL', 0);
      window.location.assign('/main/');
    }
  }, []);
  const { login } = useAuth();

  return (
    <Formik
      initialValues={{
        email: '',
        password: '',
        submit: null
      }}
      validationSchema={Yup
        .object()
        .shape({
          password: Yup
            .string()
            .max(255)
            .required('Password is required')
        })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          await login(values.email, values.password);

          if (mounted.current) {
            setStatus({ success: true });
            setSubmitting(false);
            window.location.assign('/main/');
          }
        } catch (err) {
          console.error(err);
          if (mounted.current) {
            setStatus({ success: false });
            setErrors({ submit: 'Please check your email and password' });
            setSubmitting(false);
          }
        }
      }}
    >
      {({ handleSubmit, isSubmitting, touched, errors, handleBlur, handleChange, values }) => (
        <form
          noValidate
          onSubmit={handleSubmit}
          {...props}
        >
          <TextField
            autoFocus
            error={Boolean(touched.email && errors.email)}
            fullWidth
            helperText={touched.email && errors.email}
            label="Email Address"
            margin="normal"
            name="email"
            onBlur={handleBlur}
            onChange={handleChange}
            type="email"
            value={values.email}
            variant="outlined"
          />
          <TextField
            error={Boolean(touched.password && errors.password)}
            fullWidth
            helperText={touched.password && errors.password}
            label="Password"
            margin="normal"
            name="password"
            onBlur={handleBlur}
            onChange={handleChange}
            type="password"
            value={values.password}
            variant="outlined"
          />
          {errors.submit && (
            <Box sx={{ mt: 3 }}>
              <FormHelperText error>
                {errors.submit}
              </FormHelperText>
            </Box>
          )}
          <Box sx={{ mt: 2 }}>
            <Button
              color="primary"
              disabled={isSubmitting}
              fullWidth
              size="large"
              type="submit"
              variant="contained"

            >
              Log In
            </Button>
          </Box>
          <Divider sx={{ my: 3 }} />
          <Box sx={{ mt: 2 }}>
            <Button
              color="warning"
              disabled={isSubmitting}
              fullWidth
              size="large"
              onClick={() => { getData(); }}
              variant="contained"
            >
              Microsoft Azure
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default LoginJWT;
