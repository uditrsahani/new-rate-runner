import {
  Box,
  Card,
  Grid,
  InputAdornment,
  TextField,
  Typography
} from '@material-ui/core';
import EventNoteIcon from '@material-ui/icons/EventNote';

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
        <Box
          container
          direction="column"
          justifyContent="flex-start"
          alignItems="flex-start"
        >
          <Grid
            sx={{
              alignItems: 'center',
              display: 'flex',
              flexWrap: 'wrap',
              width: 600
            }}
          >
            <Box
              sx={{
                m: 1,
                width: 250
              }}
            >
              <Typography
                variant="h6"
              >
                Type
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
                width: 250
              }}
            >
              <Typography
                variant="h6"
              >
                Cargo Readiness
              </Typography>
              <TextField
                size="small"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EventNoteIcon fontSize="small" />
                    </InputAdornment>
                  )
                }}
                name="POL"
                variant="outlined"
              />
            </Box>
            <Box
              sx={{
                m: 1,
                width: 250
              }}
            >
              <Typography
                variant="h6"
              >
                GW Per CNTR (Kg)
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
                m: 1,
                width: 250
              }}
            >
              <Typography
                variant="h6"
              >
                Idea Rate per Unit
              </Typography>
              <TextField
                size="small"
                fullWidth
                name="POL"
                variant="outlined"
              />
            </Box>
          </Grid>
          <Typography
            sx={{ ml: 1 }}
            variant="h6"
          >
            Commodity
          </Typography>
          <TextField
            size="small"
            sx={{ width: 520, ml: 1 }}
            fullWidth
            multiline
            placeholder="Leave a message"
            rows={6}
            variant="outlined"
          />
          <Grid
            sx={{
              alignItems: 'center',
              display: 'flex',
              flexWrap: 'wrap',
              width: 600
            }}
          >
            <Box
              sx={{
                m: 1,
                width: 250
              }}
            >
              <Typography
                variant="h6"
              >
                Revenue
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
                m: 1,
                width: 250
              }}
            >
              <Typography
                variant="h6"
              >
                GP
              </Typography>
              <TextField
                size="small"
                fullWidth
                name="POL"
                variant="outlined"
              />
            </Box>
          </Grid>
        </Box>
        <Box
          container
          direction="column"
          justifyContent="flex-start"
          alignItems="center"
        >
          <Card sx={{
            minWidth: 500,
            p: 3
          }}
          >
            <Typography
              variant="h6"
            >
              Containner&nbsp;&nbsp;
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
          <Typography
            sx={{ mt: 2 }}
            variant="h6"
          >
            Special Container
          </Typography>
          <TextField
            size="small"
            sx={{ width: 500 }}
            fullWidth
            multiline
            placeholder="Leave a message"
            rows={6}
            variant="outlined"
          />
        </Box>
      </Grid>
    </Box>
  </Card>
);

export default AccountBillingSettings;
