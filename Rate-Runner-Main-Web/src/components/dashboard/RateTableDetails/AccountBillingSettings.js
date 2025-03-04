import {
  Box,
  Card,
  Grid,
  TextField,
  Typography
} from '@material-ui/core';

const AccountBillingSettings = (props) => (
  <Card {...props}>
    <Box
      sx={{
        minWidth: 800,
        p: 3
      }}
    >
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
      >
        <Card sx={{
          minWidth: 500,
          p: 3
        }}
        >
          <Typography
            variant="h6"
          >
            Freight
          </Typography>

          <Box sx={{
            display: 'flex',
            flexWrap: 'wrap',
          }}
          >
            <Box
              sx={{
                mr: 1,
                mt: 2,
                maxWidth: '100%',
                width: 150
              }}
            >
              <Typography
                variant="subtitle2"
              >
                Currency
              </Typography>
              <TextField
                size="small"
                fullWidth
                select
                name="Customer"
                variant="outlined"
              />
            </Box>
            <Box
              sx={{
                mr: 1,
                mt: 2,
                maxWidth: '100%',
                width: 100
              }}
            >
              <Typography
                variant="subtitle2"
              >
                20`
              </Typography>
              <TextField
                size="small"
                fullWidth
                name="Customer"
                variant="outlined"
              />
            </Box>
            <Box
              sx={{
                mr: 1,
                mt: 2,
                maxWidth: '100%',
                width: 100
              }}
            >
              <Typography
                variant="subtitle2"
              >
                40`
              </Typography>
              <TextField
                size="small"
                fullWidth
                name="POL"
                variant="outlined"
              />
            </Box>
            <Box
              sx={{
                mr: 1,
                mt: 2,
                maxWidth: '100%',
                width: 100
              }}
            >
              <Typography
                variant="subtitle2"
              >
                40` HC
              </Typography>
              <TextField
                size="small"
                fullWidth
                name="Customer"
                variant="outlined"
              />
            </Box>
            <Box
              sx={{
                mr: 1,
                mt: 2,
                maxWidth: '100%',
                width: 100
              }}
            >
              <Typography
                variant="subtitle2"
              >
                CBM
              </Typography>
              <TextField
                size="small"
                fullWidth
                name="POL"
                variant="outlined"
              />
            </Box>
          </Box>
        </Card>
        <Card sx={{
          minWidth: 250,
          p: 3,
          ml: 3
        }}
        >
          <Typography
            variant="h6"
          >
            ISPS
          </Typography>

          <Box sx={{
            display: 'flex',
            flexWrap: 'wrap',
          }}
          >
            <Box
              sx={{
                mr: 1,
                mt: 2,
                maxWidth: '100%',
                width: 150
              }}
            >
              <Typography
                variant="subtitle2"
              >
                Currency
              </Typography>
              <TextField
                size="small"
                fullWidth
                select
                name="Customer"
                variant="outlined"
              />
            </Box>
            <Box
              sx={{
                mr: 1,
                mt: 2,
                maxWidth: '100%',
                width: 100
              }}
            >
              <Typography
                variant="subtitle2"
              >
                40`
              </Typography>
              <TextField
                size="small"
                fullWidth
                name="POL"
                variant="outlined"
              />
            </Box>
          </Box>
        </Card>
        <Card sx={{
          minWidth: 500,
          p: 3,
          mt: 3
        }}
        >
          <Typography
            variant="h6"
          >
            AMS/ENS/AFR
          </Typography>

          <Box sx={{
            display: 'flex',
            flexWrap: 'wrap',
          }}
          >
            <Box
              sx={{
                mr: 1,
                mt: 2,
                maxWidth: '100%',
                width: 150
              }}
            >
              <Typography
                variant="subtitle2"
              >
                Currency
              </Typography>
              <TextField
                size="small"
                fullWidth
                select
                name="Customer"
                variant="outlined"
              />
            </Box>
            <Box
              sx={{
                mr: 1,
                mt: 2,
                maxWidth: '100%',
                width: 120
              }}
            >
              <Typography
                variant="subtitle2"
              >
                Charge per SHPT
              </Typography>
              <TextField
                size="small"
                fullWidth
                name="POL"
                variant="outlined"
              />
            </Box>
          </Box>
        </Card>
        <Card sx={{
          minWidth: 500,
          p: 3,
          mt: 3,
          ml: 3
        }}
        >
          <Typography
            variant="h6"
          >
            LSS
          </Typography>

          <Box sx={{
            display: 'flex',
            flexWrap: 'wrap',
          }}
          >
            <Box
              sx={{
                mr: 1,
                mt: 2,
                maxWidth: '100%',
                width: 150
              }}
            >
              <Typography
                variant="subtitle2"
              >
                Currency
              </Typography>
              <TextField
                size="small"
                fullWidth
                select
                name="Customer"
                variant="outlined"
              />
            </Box>
            <Box
              sx={{
                mr: 1,
                mt: 2,
                maxWidth: '100%',
                width: 100
              }}
            >
              <Typography
                variant="subtitle2"
              >
                20`
              </Typography>
              <TextField
                size="small"
                fullWidth
                name="Customer"
                variant="outlined"
              />
            </Box>
            <Box
              sx={{
                mr: 1,
                mt: 2,
                maxWidth: '100%',
                width: 100
              }}
            >
              <Typography
                variant="subtitle2"
              >
                40`
              </Typography>
              <TextField
                size="small"
                fullWidth
                name="POL"
                variant="outlined"
              />
            </Box>
            <Box
              sx={{
                mr: 1,
                mt: 2,
                maxWidth: '100%',
                width: 100
              }}
            >
              <Typography
                variant="subtitle2"
              >
                40` HC
              </Typography>
              <TextField
                size="small"
                fullWidth
                name="Customer"
                variant="outlined"
              />
            </Box>
          </Box>
        </Card>
        <Box>
          <Typography
            sx={{ mt: 2 }}
            variant="h6"
          >
            Remark
          </Typography>
          <TextField
            size="small"
            sx={{ width: 1055 }}
            fullWidth
            multiline
            placeholder="Leave a message"
            rows={3}
            variant="outlined"
          />
        </Box>
      </Grid>
    </Box>
  </Card>
);

export default AccountBillingSettings;
