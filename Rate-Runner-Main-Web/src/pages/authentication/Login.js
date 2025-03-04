import { useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import useMounted from '../../hooks/useMounted';
import { Box, Card, CardContent, Container, Typography } from '@material-ui/core';
import { LoginJWT } from '../../components/authentication/login';
import gtm from '../../lib/gtm';
// import instance from '../../store/instance';

const Login = () => {
  const mounted = useMounted();

  const getData = useCallback(async () => {
    /* await instance.get('/auth/azure/login')
      .then((res) => {
        if (mounted.current) {
          window.location.assign(res.data);
        }
      }); */
  }, [mounted]);
  useEffect(() => {
    getData();
  }, [getData]);
  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  return (
    <>
      <Helmet>
        <title>Login | Rate Runner</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh'
        }}
      >
        <Container
          maxWidth="sm"
          sx={{ py: '80px' }}
        >
          <Card>
            <CardContent
              sx={{
                display: 'flex',
                flexDirection: 'column',
                p: 4
              }}
            >
              <Box
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  justifyContent: 'space-between',
                  mb: 3
                }}
              >
                <div>
                  <Typography
                    color="textPrimary"
                    gutterBottom
                    variant="h4"
                  >
                    RATE RUNNER
                  </Typography>
                </div>
                <Box
                  sx={{
                    height: 32,
                    '& > img': {
                      maxHeight: '100%',
                      width: 'auto'
                    }
                  }}
                >
                  <img
                    alt="Auth platform"
                    src="/static/rate_runner_logo.png"
                  />
                </Box>
              </Box>
              <Box
                sx={{
                  flexGrow: 1,
                  mt: 3
                }}
              >
                <LoginJWT />
              </Box>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </>
  );
};

export default Login;
