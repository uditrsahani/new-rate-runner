import toast from 'react-hot-toast';
import {
  Box,
  Card,
  CardContent,
  Checkbox,
  Grid,
  Table,
  TableRow,
  TableCell,
  TableBody,
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
            <Grid width={500}>
              <Typography
                variant="h6"
              >
                Sailing
              </Typography>
              <Table
                size="small"
                sx={{ ml: -1 }}
              >
                <TableBody>
                  <TableRow style={{ verticalAlign: 'middle' }}>
                    <TableCell style={{ borderBottom: 'none' }}>
                      <Typography
                        variant="h6"
                      >
                        BKK
                      </Typography>
                    </TableCell>
                    <TableCell
                      style={{ borderBottom: 'none' }}
                      align="right"
                    >
                      <Checkbox
                        color="primary"
                        name="policy"
                      />
                    </TableCell>
                    <TableCell
                      align="left"
                      style={{ borderBottom: 'none' }}
                    >
                      <Typography
                        color="textSecondary"
                        variant="h6"
                      >
                        Sun
                      </Typography>
                    </TableCell>
                    <TableCell
                      style={{ borderBottom: 'none' }}
                      align="right"
                    >
                      <Checkbox
                        color="primary"
                        name="policy"
                      />
                    </TableCell>
                    <TableCell
                      align="left"
                      style={{ borderBottom: 'none' }}
                    >
                      <Typography
                        color="textSecondary"
                        variant="h6"
                      >
                        Mon
                      </Typography>
                    </TableCell>
                    <TableCell
                      style={{ borderBottom: 'none' }}
                      align="right"
                    >
                      <Checkbox
                        color="primary"
                        name="policy"
                      />
                    </TableCell>
                    <TableCell
                      align="left"
                      style={{ borderBottom: 'none' }}
                    >
                      <Typography
                        color="textSecondary"
                        variant="h6"
                      >
                        Tue
                      </Typography>
                    </TableCell>
                    <TableCell
                      style={{ borderBottom: 'none' }}
                      align="right"
                    >
                      <Checkbox
                        color="primary"
                        name="policy"
                      />
                    </TableCell>
                    <TableCell
                      align="left"
                      style={{ borderBottom: 'none' }}
                    >
                      <Typography
                        color="textSecondary"
                        variant="h6"
                      >
                        Wed
                      </Typography>
                    </TableCell>
                    <TableCell
                      style={{ borderBottom: 'none' }}
                      align="right"
                    >
                      <Checkbox
                        color="primary"
                        name="policy"
                      />
                    </TableCell>
                    <TableCell
                      align="left"
                      style={{ borderBottom: 'none' }}
                    >
                      <Typography
                        color="textSecondary"
                        variant="h6"
                      >
                        Thu
                      </Typography>
                    </TableCell>
                    <TableCell
                      style={{ borderBottom: 'none' }}
                      align="right"
                    >
                      <Checkbox
                        color="primary"
                        name="policy"
                      />
                    </TableCell>
                    <TableCell
                      align="left"
                      style={{ borderBottom: 'none' }}
                    >
                      <Typography
                        color="textSecondary"
                        variant="h6"
                      >
                        Fri
                      </Typography>
                    </TableCell>
                    <TableCell
                      style={{ borderBottom: 'none' }}
                      align="right"
                    >
                      <Checkbox
                        color="primary"
                        name="policy"
                      />
                    </TableCell>
                    <TableCell
                      align="left"
                      style={{ borderBottom: 'none' }}
                    >
                      <Typography
                        color="textSecondary"
                        variant="h6"
                      >
                        Sat
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow style={{ verticalAlign: 'middle' }}>
                    <TableCell style={{ borderBottom: 'none' }}>
                      <Typography
                        variant="h6"
                      >
                        LCB
                      </Typography>
                    </TableCell>
                    <TableCell
                      style={{ borderBottom: 'none' }}
                      align="right"
                    >
                      <Checkbox
                        color="primary"
                        name="policy"
                      />
                    </TableCell>
                    <TableCell
                      align="left"
                      style={{ borderBottom: 'none' }}
                    >
                      <Typography
                        color="textSecondary"
                        variant="h6"
                      >
                        Sun
                      </Typography>
                    </TableCell>
                    <TableCell
                      style={{ borderBottom: 'none' }}
                      align="right"
                    >
                      <Checkbox
                        color="primary"
                        name="policy"
                      />
                    </TableCell>
                    <TableCell
                      align="left"
                      style={{ borderBottom: 'none' }}
                    >
                      <Typography
                        color="textSecondary"
                        variant="h6"
                      >
                        Mon
                      </Typography>
                    </TableCell>
                    <TableCell
                      style={{ borderBottom: 'none' }}
                      align="right"
                    >
                      <Checkbox
                        color="primary"
                        name="policy"
                      />
                    </TableCell>
                    <TableCell
                      align="left"
                      style={{ borderBottom: 'none' }}
                    >
                      <Typography
                        color="textSecondary"
                        variant="h6"
                      >
                        Tue
                      </Typography>
                    </TableCell>
                    <TableCell
                      style={{ borderBottom: 'none' }}
                      align="right"
                    >
                      <Checkbox
                        color="primary"
                        name="policy"
                      />
                    </TableCell>
                    <TableCell
                      align="left"
                      style={{ borderBottom: 'none' }}
                    >
                      <Typography
                        color="textSecondary"
                        variant="h6"
                      >
                        Wed
                      </Typography>
                    </TableCell>
                    <TableCell
                      style={{ borderBottom: 'none' }}
                      align="right"
                    >
                      <Checkbox
                        color="primary"
                        name="policy"
                      />
                    </TableCell>
                    <TableCell
                      align="left"
                      style={{ borderBottom: 'none' }}
                    >
                      <Typography
                        color="textSecondary"
                        variant="h6"
                      >
                        Thu
                      </Typography>
                    </TableCell>
                    <TableCell
                      style={{ borderBottom: 'none' }}
                      align="right"
                    >
                      <Checkbox
                        color="primary"
                        name="policy"
                      />
                    </TableCell>
                    <TableCell
                      align="left"
                      style={{ borderBottom: 'none' }}
                    >
                      <Typography
                        color="textSecondary"
                        variant="h6"
                      >
                        Fri
                      </Typography>
                    </TableCell>
                    <TableCell
                      style={{ borderBottom: 'none' }}
                      align="right"
                    >
                      <Checkbox
                        color="primary"
                        name="policy"
                      />
                    </TableCell>
                    <TableCell
                      align="left"
                      style={{ borderBottom: 'none' }}
                    >
                      <Typography
                        color="textSecondary"
                        variant="h6"
                      >
                        Sat
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow style={{ verticalAlign: 'middle' }}>
                    <TableCell style={{ borderBottom: 'none' }}>
                      <Typography
                        variant="h6"
                      >
                        OTHERS
                      </Typography>
                    </TableCell>
                    <TableCell
                      style={{ borderBottom: 'none' }}
                      align="right"
                    >
                      <Checkbox
                        color="primary"
                        name="policy"
                      />
                    </TableCell>
                    <TableCell
                      align="left"
                      style={{ borderBottom: 'none' }}
                    >
                      <Typography
                        color="textSecondary"
                        variant="h6"
                      >
                        Sun
                      </Typography>
                    </TableCell>
                    <TableCell
                      style={{ borderBottom: 'none' }}
                      align="right"
                    >
                      <Checkbox
                        color="primary"
                        name="policy"
                      />
                    </TableCell>
                    <TableCell
                      align="left"
                      style={{ borderBottom: 'none' }}
                    >
                      <Typography
                        color="textSecondary"
                        variant="h6"
                      >
                        Mon
                      </Typography>
                    </TableCell>
                    <TableCell
                      style={{ borderBottom: 'none' }}
                      align="right"
                    >
                      <Checkbox
                        color="primary"
                        name="policy"
                      />
                    </TableCell>
                    <TableCell
                      align="left"
                      style={{ borderBottom: 'none' }}
                    >
                      <Typography
                        color="textSecondary"
                        variant="h6"
                      >
                        Tue
                      </Typography>
                    </TableCell>
                    <TableCell
                      style={{ borderBottom: 'none' }}
                      align="right"
                    >
                      <Checkbox
                        color="primary"
                        name="policy"
                      />
                    </TableCell>
                    <TableCell
                      align="left"
                      style={{ borderBottom: 'none' }}
                    >
                      <Typography
                        color="textSecondary"
                        variant="h6"
                      >
                        Wed
                      </Typography>
                    </TableCell>
                    <TableCell
                      style={{ borderBottom: 'none' }}
                      align="right"
                    >
                      <Checkbox
                        color="primary"
                        name="policy"
                      />
                    </TableCell>
                    <TableCell
                      align="left"
                      style={{ borderBottom: 'none' }}
                    >
                      <Typography
                        color="textSecondary"
                        variant="h6"
                      >
                        Thu
                      </Typography>
                    </TableCell>
                    <TableCell
                      style={{ borderBottom: 'none' }}
                      align="right"
                    >
                      <Checkbox
                        color="primary"
                        name="policy"
                      />
                    </TableCell>
                    <TableCell
                      align="left"
                      style={{ borderBottom: 'none' }}
                    >
                      <Typography
                        color="textSecondary"
                        variant="h6"
                      >
                        Fri
                      </Typography>
                    </TableCell>
                    <TableCell
                      style={{ borderBottom: 'none' }}
                      align="right"
                    >
                      <Checkbox
                        color="primary"
                        name="policy"
                      />
                    </TableCell>
                    <TableCell
                      align="left"
                      style={{ borderBottom: 'none' }}
                    >
                      <Typography
                        color="textSecondary"
                        variant="h6"
                      >
                        Sat
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Grid>
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
                  <Typography
                    variant="h6"
                  >
                    T/T
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
                    maxWidth: '100%',
                    width: 300
                  }}
                >
                  <Typography
                    variant="h6"
                  >
                    Route
                  </Typography>
                  <TextField
                    size="small"
                    fullWidth
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
                  <Typography
                    variant="h6"
                  >
                    T/S Port
                  </Typography>
                  <TextField
                    size="small"
                    fullWidth
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
                  <Typography
                    variant="h6"
                  >
                    Spacial Container
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
              </Box>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </form>
  );
};

export default AccountNotificationsSettings;
