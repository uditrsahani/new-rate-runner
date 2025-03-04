import {
  Box,
  Card,
  Grid,
  InputAdornment,
  TextField
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
        justifyContent="space-between"
      >
        <Box
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
            <TextField
              fullWidth
              label="Type"
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
            <TextField
              fullWidth
              label="Cargo Readiness"
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
            <TextField
              fullWidth
              label="GW Per CNTR (Kg)"
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
            <TextField
              fullWidth
              label="Idea Rate per Unit"
              name="POL"
              variant="outlined"
            />
          </Box>
        </Box>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexWrap: 'wrap',
          }}
        >
          <Card sx={{
            minWidth: 500,
            p: 3,
            mr: 12
          }}
          >
            Containner&nbsp;&nbsp;
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
                <TextField
                  fullWidth
                  label="20'"
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
                <TextField
                  fullWidth
                  label="40'"
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
                <TextField
                  fullWidth
                  label="40' HC"
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
                <TextField
                  fullWidth
                  label="CBM"
                  name="POL"
                  variant="outlined"
                />
              </Box>
            </Box>
          </Card>
        </Box>
        <Box
          sx={{
            alignItems: 'center',
            m: 1
          }}
        >
          <TextField
            sx={{ width: 520, mr: 3 }}
            fullWidth
            multiline
            placeholder="Leave a message"
            label="Commodity"
            rows={6}
            variant="outlined"
          />
          <TextField
            sx={{ width: 500, ml: 7 }}
            fullWidth
            multiline
            placeholder="Leave a message"
            label="Special Container"
            rows={6}
            variant="outlined"
          />
        </Box>
      </Grid>
    </Box>
  </Card>
);

export default AccountBillingSettings;
