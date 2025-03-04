import {
  Box,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core';
import PencilAltIcon from '../../../icons/PencilAlt';

const AccountBillingSettings = (props) => (
  <Card {...props}>
    <CardHeader title="Rate Selected" />
    <CardContent>
      <Box sx={{ minWidth: 1200 }}>
        <Typography>
          Carrier&emsp;:SITC
        </Typography>
        <Typography>
          Agent&emsp;:WICETH
        </Typography>
        <Typography>
          ETD LCB&emsp;:THE,SAT&ensp;&ensp;&ensp;&ensp;&ensp;Route&ensp;:Direct
        </Typography>
        <Typography>
          T/T&emsp;:10-12 Days
        </Typography>
        <Typography>
          Type&emsp;:DC
        </Typography>
      </Box>
      <Box sx={{ minWidth: 1200 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <br />
              </TableCell>
              <TableCell>
                20&rsquo;
              </TableCell>
              <TableCell>
                40&rsquo;
              </TableCell>
              <TableCell>
                40&rsquo; HC
              </TableCell>
              <TableCell>
                SET
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>
                <Typography>
                  Freight
                </Typography>
              </TableCell>
              <TableCell>
                USD 300
              </TableCell>
              <TableCell>
                <Typography>
                  USD 600
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>
                  USD 600
                </Typography>
              </TableCell>
              <TableCell>
                -
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography>
                  ISPC
                </Typography>
              </TableCell>
              <TableCell>
                -
              </TableCell>
              <TableCell>
                <Typography>
                  -
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>
                  -
                </Typography>
              </TableCell>
              <TableCell>
                -
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography>
                  AMS/ENS/AFR
                </Typography>
              </TableCell>
              <TableCell>
                -
              </TableCell>
              <TableCell>
                <Typography>
                  -
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>
                  -
                </Typography>
              </TableCell>
              <TableCell>
                THB 1000
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography>
                  LSS
                </Typography>
              </TableCell>
              <TableCell>
                USD 300
              </TableCell>
              <TableCell>
                <Typography>
                  USD 60
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>
                  USD 600
                </Typography>
              </TableCell>
              <TableCell>
                -
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography>
                  Other
                </Typography>
              </TableCell>
              <TableCell>
                -
              </TableCell>
              <TableCell>
                <Typography>
                  -
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>
                  -
                </Typography>
              </TableCell>
              <TableCell>
                -
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>
      <Box sx={{ minWidth: 1200 }}>
        <Typography>
          <br />
        </Typography>
        <Typography>
          Remark&emsp;:Subi to Lss at POD
        </Typography>
        <Typography>
          Carrier S/C&emsp;:TH21JUL2345
        </Typography>
        <Typography>
          <br />
        </Typography>
        <Typography>
          Validity&emsp;:01/07/2021 - 31/07/2021
        </Typography>
      </Box>
    </CardContent>
    <CardHeader title="Agent Quota" />
    <CardContent>
      <Box sx={{ minWidth: 1200 }}>
        <Table>
          <TableHead>
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
                Customes Per Shipment
              </TableCell>
              <TableCell>
                Currency
              </TableCell>
              <TableCell>
                Customes Per Container
              </TableCell>
              <TableCell>
                Currency
              </TableCell>
              <TableCell>
                Delivery Per Shipment
              </TableCell>
              <TableCell>
                Currency
              </TableCell>
              <TableCell>
                Delivery Per Container
              </TableCell>
              <TableCell>
                Email
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>
                <Typography
                  align="center"
                >
                  R
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  align="center"
                >
                  agent-A
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  align="center"
                >
                  usd
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  align="center"
                >
                  100
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  align="center"
                >
                  usd
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  align="center"
                >
                  200
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  align="center"
                >
                  usd
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  align="center"
                >
                  200
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  align="center"
                >
                  usd
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  align="center"
                >
                  200
                </Typography>
              </TableCell>
              <TableCell align="right">
                <IconButton>
                  <PencilAltIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>
    </CardContent>
  </Card>
);
export default AccountBillingSettings;
