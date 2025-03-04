import Chart from 'react-apexcharts';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Table,
  TableRow,
  TableCell,
  TableBody,
  Typography
} from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import Moment from 'moment';
import useMounted from '../../../hooks/useMounted';

const AnalyticsSocialMediaSources = (props) => {
  // eslint-disable-next-line no-unused-vars
  const { data } = props;
  const theme = useTheme();
  const [win, setWin] = useState(0);
  const [loss, setLoss] = useState(0);
  const [pending, setPending] = useState(0);
  const [disable, setDisable] = useState(0);
  const mounted = useMounted();

  const chartOptions = {
    chart: {
      background: 'transparent',
      stacked: false,
      toolbar: {
        show: false
      }
    },
    colors: [
      '#7BC67E',
      '#FF4848',
      '#F5C324',
      '#C6D1D6'
    ],
    dataLabels: {
      enabled: false
    },
    labels: ['', '', '', ''],
    legend: {
      fontSize: '18px',
      fontFamily: theme.typography.fontFamily,
      fontWeight: theme.typography.subtitle2.fontWeight,
      itemMargin: {
        vertical: 4
      },
      labels: {
        colors: theme.palette.text.primary
      },
      markers: {
        width: 10,
        height: 10
      },
      show: false
    },
    stroke: {
      width: 0
    },
    theme: {
      mode: theme.palette.mode
    }
  };
  const getOrders = useCallback(async () => {
    if (mounted.current) {
      setWin((data) ? data.filter((value) => value.inq_res_quote_status === 'WIN' && value.inq_disable !== 1 && ((value.inq_date) ? (Moment(value.inq_date).month() + 1 === (new Date().getMonth() + 1) && Moment(value.inq_date).year() === (new Date().getFullYear())) : true)).length : 0);
      setLoss((data) ? data.filter((value) => value.inq_res_quote_status === 'LOSS' && value.inq_disable !== 1 && ((value.inq_date) ? (Moment(value.inq_date).month() + 1 === (new Date().getMonth() + 1) && Moment(value.inq_date).year() === (new Date().getFullYear())) : true)).length : 0);
      setPending((data) ? data.filter((value) => value.inq_res_quote_status === 'PENDING' && value.inq_disable !== 1 && ((value.inq_date) ? (Moment(value.inq_date).month() + 1 === (new Date().getMonth() + 1) && Moment(value.inq_date).year() === (new Date().getFullYear())) : true)).length : 0);
      setDisable((data) ? data.filter((value) => value.inq_disable === 1 && ((value.inq_date) ? (Moment(value.inq_date).month() + 1 === (new Date().getMonth() + 1) && Moment(value.inq_date).year() === (new Date().getFullYear())) : true)).length : 0);
    }
  }, [mounted, data]);

  useEffect(() => {
    getOrders();
  }, [getOrders]);

  return (
    <Card>
      <CardHeader
        disableTypography
        title={(
          <Grid
            container
            direction="colum"
            justifyContent="flex-start"
            alignItems="flex-start"
          >
            <Typography
              color="textPrimary"
              variant="h5"
            >
              Monthly Inquiry
            </Typography>
          </Grid>
        )}
      />
      <CardContent sx={{
        alignItems: 'left',
        display: 'flex',
        flexWrap: 'wrap',
        m: -1,
        p: 2
      }}
      >
        <Box sx={{ ml: -6, mt: -2 }}>
          <Chart
            height={200}
            options={chartOptions}
            series={[win, loss, pending, disable]}
            type="donut"
          />
        </Box>
        <Grid sx={{ ml: 28, mt: -27 }}>
          <Table
            size="small"
            width={280}
          >
            <TableBody>
              <TableRow style={{ verticalAlign: 'bottom', height: 20 }}>
                <TableCell style={{ borderBottom: 'none', textAlign: 'left' }}>
                  <Typography
                    color="textPrimary"
                    variant="h6"
                  >
                    Win
                  </Typography>
                </TableCell>
                <TableCell style={{ borderBottom: 'none', textAlign: 'right' }}>
                  <Typography
                    color="#7BC67E"
                    variant="h4"
                  >
                    {win}
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow style={{ verticalAlign: 'bottom', height: 20 }}>
                <TableCell style={{ borderBottom: 'none', textAlign: 'left' }}>
                  <Typography
                    color="textPrimary"
                    variant="h6"
                  >
                    Loss
                  </Typography>
                </TableCell>
                <TableCell style={{ borderBottom: 'none', textAlign: 'right' }}>
                  <Typography
                    color="#FF4848"
                    variant="h4"
                  >
                    {loss}
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow style={{ verticalAlign: 'bottom', height: 20 }}>
                <TableCell style={{ borderBottom: 'none', textAlign: 'left' }}>
                  <Typography
                    color="textPrimary"
                    variant="h6"
                  >
                    Pending
                  </Typography>
                </TableCell>
                <TableCell style={{ borderBottom: 'none', textAlign: 'right' }}>
                  <Typography
                    color="#F5C324"
                    variant="h4"
                  >
                    {pending}
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow style={{ verticalAlign: 'bottom', height: 20 }}>
                <TableCell style={{ borderBottom: 'none', textAlign: 'left' }}>
                  <Typography
                    color="textPrimary"
                    variant="h6"
                  >
                    Disable
                  </Typography>
                </TableCell>
                <TableCell style={{ borderBottom: 'none', textAlign: 'right' }}>
                  <Typography
                    color="#B2B2B2"
                    variant="h4"
                  >
                    {disable}
                  </Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Grid>
        <Grid sx={{ mt: -17.5, ml: (Number(win + loss + pending + disable) >= 100) ? 7.5 : 9.1, alignItems: 'center' }}>
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            <Typography
              variant="h1"
            >
              {win + loss + pending + disable}
            </Typography>
            <Typography
              variant="h6"
            >
              totals
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

AnalyticsSocialMediaSources.propTypes = {
  data: PropTypes.array.isRequired,
};

export default AnalyticsSocialMediaSources;
