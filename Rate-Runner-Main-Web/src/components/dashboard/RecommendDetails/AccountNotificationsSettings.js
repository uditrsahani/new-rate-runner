import toast from 'react-hot-toast';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TableCell,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TextField,
  Typography

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
                    label="Send Email to Agent"
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
                    display: 'flex',
                    flexWrap: 'wrap',
                  }}
                >
                  <Card sx={{ width: 630 }}>
                    <CardContent>
                      <Typography
                        color="textPrimary"
                        variant="h6"
                      >
                        Mail Example
                      </Typography>

                      <br />
                      Dear
                      <br />
                      To
                      <br />
                      Content Email
                      <br />
                      <br />
                    </CardContent>
                  </Card>
                  <Card sx={{ width: 500, ml: 2 }}>
                    <CardContent>
                      <Typography
                        color="textPrimary"
                        variant="h6"
                      >
                        Mail History
                      </Typography>
                      <Box>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>
                                Timestamp
                              </TableCell>
                              <TableCell>
                                Receiver
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              <TableCell>
                                08/07/2021 18.30
                              </TableCell>
                              <TableCell>
                                TS LINE
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>
                                09/07/2021 11.30
                              </TableCell>
                              <TableCell>
                                ONE
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </Box>
                    </CardContent>
                  </Card>
                  <Button
                    sx={{ mt: 3, ml: 64 }}
                    variant="contained"
                    color="primary"
                    size="large"
                  >
                    SEND MAIL
                  </Button>
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
