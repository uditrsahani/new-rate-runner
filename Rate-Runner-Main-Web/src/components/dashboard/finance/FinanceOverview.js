import { Box, Grid, Typography, Card } from '@material-ui/core';
import { useEffect, useCallback, useState } from 'react';
import instance from '../../../store/instance';
import PropTypes from 'prop-types';

const FinanceOverview = (props) => {
  const { year } = props;
  const [summary, setSummary] = useState({});

  const getReport = useCallback(async () => {
    // console.log(view.toLowerCase(), startdate, enddate);
    try {
      await instance.get(`/inquiry?inq_status=close&inq_disable=0&year=${year}`)
        .then((res) => {
          let sumRevenue = 0;
          let sumRevenueWin = 0;
          let sumRevenueLose = 0;
          let sumGP = 0;
          let sumGPWin = 0;
          let sumGPLose = 0;
          let countWin = 0;
          let countLose = 0;
          let countAll = 0;

          res.data.map((val) => {
            sumRevenue += Number(val.inq_revenue);
            sumGP += Number(val.inq_gp);
            if (val.inq_res_quote_status === 'WIN') {
              sumRevenueWin += Number(val.inq_revenue);
              sumGPWin += Number(val.inq_gp);
              countWin++;
            } else if (val.inq_res_quote_status === 'LOSS') {
              sumRevenueLose += Number(val.inq_revenue);
              sumGPLose += Number(val.inq_gp);
              countLose++;
            }
            countAll++;
            return null;
          });
          const tempsummary = {
            sumRevenue,
            sumGP,
            sumRevenueWin,
            sumGPWin,
            sumRevenueLose,
            sumGPLose,
            countWin,
            countLose,
            countAll
          };
          setSummary(tempsummary);
        });
    } catch (err) {
      console.error(err.respones);
    }
  }, [year]);

  useEffect(() => {
    getReport();
  }, [getReport]);

  return (
    <Grid {...props}>
      <Grid
        container
        spacing={1}
      >
        <Grid
          item
          md={4}
          sm={6}
          xs={12}
        >
          <Card
            sx={{ height: 180 }}
            style={{ color: 'white', backgroundColor: '#05B8F5' }}
          >
            <Grid
              sx={{
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'space-between',
                p: 2
              }}
            >
              <Grid>
                <Typography
                  variant="h4"
                >
                  All Inquiry
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ mt: 3 }}
                >
                  Revenue :&nbsp;
                  {Number(summary.sumRevenue).toLocaleString(navigator.language, { minimumFractionDigits: 2 })}
                </Typography>
                <Typography
                  variant="h6"
                >
                  G/P :&nbsp;
                  {Number(summary.sumGP).toLocaleString(navigator.language, { minimumFractionDigits: 2 })}
                </Typography>
                <Typography
                  variant="h6"
                >
                  ROS :&nbsp;
                  {(summary.sumRevenue) ? `${(Number(summary.sumGP / summary.sumRevenue) * 100).toFixed(2)}%` : ''}
                </Typography>
              </Grid>
              <Box>
                <Typography
                  variant="h1"
                />
              </Box>
            </Grid>
          </Card>
        </Grid>
        <Grid
          item
          md={4}
          sm={6}
          xs={12}
        >
          <Card
            sx={{ height: 180 }}
            style={{ color: 'white', backgroundColor: '#08CFA5' }}
          >
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'space-between',
                p: 2
              }}
            >
              <Grid>
                <Typography
                  variant="h4"
                >
                  WIN Inquiry
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ mt: 3 }}
                >
                  Revenue :&nbsp;
                  {Number(summary.sumRevenueWin).toLocaleString(navigator.language, { minimumFractionDigits: 2 })}
                </Typography>
                <Typography
                  variant="h6"
                >
                  G/P :&nbsp;
                  {Number(summary.sumGPWin).toLocaleString(navigator.language, { minimumFractionDigits: 2 })}
                </Typography>
                <Typography
                  variant="h6"
                >
                  ROS :&nbsp;
                  {(summary.sumRevenueWin) ? `${(Number(summary.sumGPWin / summary.sumRevenueWin) * 100).toFixed(2)}%` : ''}
                </Typography>
              </Grid>
              <Box>
                <Typography
                  variant="h1"
                >
                  {(summary.countAll) ? `${(Number(summary.countWin / summary.countAll) * 100).toFixed(2)}%` : ''}
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>
        <Grid
          item
          md={4}
          sm={6}
          xs={12}
        >
          <Card
            sx={{ height: 180,
              color: 'white',
              backgroundColor: '#F96D00', }}
          >
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'space-between',
                p: 2
              }}
            >
              <Grid>
                <Typography
                  variant="h4"
                >
                  LOSS Inquiry
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ mt: 3 }}
                >
                  Revenue :&nbsp;
                  {Number(summary.sumRevenueLose).toLocaleString(navigator.language, { minimumFractionDigits: 2 })}
                </Typography>
                <Typography
                  variant="h6"
                >
                  G/P :&nbsp;
                  {Number(summary.sumGPLose).toLocaleString(navigator.language, { minimumFractionDigits: 2 })}
                </Typography>
                <Typography
                  variant="h6"
                >
                  ROS :&nbsp;
                  {(summary.sumRevenueLose) ? `${(Number(summary.sumGPLose / summary.sumRevenueLose) * 100).toFixed(2)}%` : ''}
                </Typography>
              </Grid>
              <Box>
                <Typography
                  variant="h1"
                >
                  {(summary.countAll) ? `${(Number(summary.countLose / summary.countAll) * 100).toFixed(2)}%` : ''}
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Grid>
  );
};

FinanceOverview.propTypes = {
  year: PropTypes.array.isRequired
};
export default FinanceOverview;
