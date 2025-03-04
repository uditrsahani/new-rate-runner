import toast from 'react-hot-toast';
import {
  Box,
  Card,
  CardContent,
  Grid,
  TextField
} from '@material-ui/core';
import wait from '../../../utils/wait';

const AccountNotificationsSettings = (props) => {
  const handleSubmit = async (event) => {
    event.preventDefault();
    // NOTE: Make API request
    await wait(500);
    toast.success('Changes saved!');
  };

  return (
    <form
      onSubmit={handleSubmit}
      {...props}
    >
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
                  <TextField
                    fullWidth
                    label="Freetime"
                    name="Customer"
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
                  <TextField
                    fullWidth
                    label="Compititor"
                    name="POD"
                    select
                    SelectProps={{ native: true }}
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
                  <TextField
                    fullWidth
                    label="Current Carrier"
                    name="Re-Inquiry"
                    select
                    variant="outlined"
                  />
                </Box>
                <Box
                  sx={{
                    m: 1,
                    maxWidth: '100%',
                    width: 850
                  }}
                >
                  <TextField
                    fullWidth
                    label="Other/Comment"
                    name="CustomerType"
                    variant="outlined"
                  />
                </Box>
              </Box>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </form>
  );
};

export default AccountNotificationsSettings;
