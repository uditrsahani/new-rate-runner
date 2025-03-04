import { Box, Card, Grid, Typography } from '@material-ui/core';
import { useEffect, useCallback, useState } from 'react';
// import Label from '../../Label';
import PropTypes from 'prop-types';
import Moment from 'moment';
import useMounted from '../../../hooks/useMounted';

const AnalyticsGeneralOverview = (props) => {
  // eslint-disable-next-line no-unused-vars
  const { data, MonthlyTables } = props;
  const user = JSON.parse(window.localStorage.getItem('user'));
  const userid = user.user_id;
  const userrole = user.user_role;
  const userteam = user.user_team;
  // eslint-disable-next-line no-unused-vars
  const [pending, setPending] = useState(0);
  const [MonthlyList, setMonthlyList] = useState([]);
  const mounted = useMounted();
  // console.log(data);

  const getOrders = useCallback(async () => {
    if (mounted.current) {
      if (userrole === 'sales') {
        setMonthlyList(MonthlyTables
          .filter((value) => value.fc_user_id === userid && !value.fc_inq_uuid && value.fc_disable !== 1
          && (((new Date().getMonth() + 1) !== 12) ? Number(Moment(value.fc_cargo_readiness).utcOffset(0).format('MM')) >= (new Date().getMonth() + 1)
          && Number(Moment(value.fc_cargo_readiness).utcOffset(0).format('MM')) <= (new Date().getMonth() + 2) : true)
          && (((new Date().getMonth() + 1) === 12)
            ? (Number(Moment(value.fc_cargo_readiness).utcOffset(0).format('MM')) === 12
          && Number(Moment(value.fc_cargo_readiness).utcOffset(0).format('YYYY')) === Number(new Date().getFullYear()))
          || (Number(Moment(value.fc_cargo_readiness).utcOffset(0).format('MM')) === 1
          && Number(Moment(value.fc_cargo_readiness).utcOffset(0).format('YYYY')) === Number(new Date().getFullYear()) + 1) : true))
          .sort((a, b) => (a.fc_week_no < b.fc_week_no ? 1 : -1)));
      } else if (userrole === 'salesManager') {
        setMonthlyList(MonthlyTables
          .filter((value) => value.user_team === userteam && !value.fc_inq_uuid && value.fc_disable !== 1
          && (((new Date().getMonth() + 1) !== 12) ? Number(Moment(value.fc_cargo_readiness).utcOffset(0).format('MM')) >= (new Date().getMonth() + 1)
          && Number(Moment(value.fc_cargo_readiness).utcOffset(0).format('MM')) <= (new Date().getMonth() + 2) : true)
          && (((new Date().getMonth() + 1) === 12)
            ? (Number(Moment(value.fc_cargo_readiness).utcOffset(0).format('MM')) === 12
          && Number(Moment(value.fc_cargo_readiness).utcOffset(0).format('YYYY')) === Number(new Date().getFullYear()))
          || (Number(Moment(value.fc_cargo_readiness).utcOffset(0).format('MM')) === 1
          && Number(Moment(value.fc_cargo_readiness).utcOffset(0).format('YYYY')) === Number(new Date().getFullYear()) + 1) : true))
          .sort((a, b) => (a.fc_week_no < b.fc_week_no ? 1 : -1)));
      } else {
        setMonthlyList(MonthlyTables
          .filter((value) => !value.fc_inq_uuid && value.fc_disable !== 1
          && (((new Date().getMonth() + 1) !== 12) ? Number(Moment(value.fc_cargo_readiness).utcOffset(0).format('MM')) >= (new Date().getMonth() + 1)
          && Number(Moment(value.fc_cargo_readiness).utcOffset(0).format('MM')) <= (new Date().getMonth() + 2) : true)
          && (((new Date().getMonth() + 1) === 12)
            ? (Number(Moment(value.fc_cargo_readiness).utcOffset(0).format('MM')) === 12
          && Number(Moment(value.fc_cargo_readiness).utcOffset(0).format('YYYY')) === Number(new Date().getFullYear()))
          || (Number(Moment(value.fc_cargo_readiness).utcOffset(0).format('MM')) === 1
          && Number(Moment(value.fc_cargo_readiness).utcOffset(0).format('YYYY')) === Number(new Date().getFullYear()) + 1) : true))
          .sort((a, b) => (a.fc_week_no < b.fc_week_no ? 1 : -1)));
      }
      setPending((data) ? data.filter((value) => value.inq_res_quote_status === 'PENDING' && value.inq_disable !== 1 && ((value.inq_date) ? (Moment(value.inq_date).month() + 1 === (new Date().getMonth() + 1) && Moment(value.inq_date).year() === (new Date().getFullYear())) : true)).length : 0);
    }
  }, [mounted, data]);

  useEffect(() => {
    getOrders();
  }, [getOrders]);

  return (
    <Grid>
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
          <Card sx={{ height: 120 }}>
            <Grid
              sx={{
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'space-between',
                p: 2
              }}
            >
              <div>
                <Typography
                  color="textPrimary"
                  variant="h5"
                >
                  Forecast
                </Typography>
              </div>
              <Grid
                container
                direction="column"
                justifyContent="flex-start"
                alignItems="flex-end"
              >
                <Typography
                  color="info.main"
                  variant="h2"
                >
                  {(MonthlyList) ? MonthlyList.length : 0}
                  {/* (data) ? data.filter((value) => value.over_leadtime === true && value.inq_disable !== 1).length : 0 */}
                </Typography>
                <Typography
                  color="#FF4C03"
                  variant="h5"
                >
                  {/* (data) ? data.filter((value) => value.inq_status === 'waiting customer' && value.inq_disable !== 1).length : 0 */}
                </Typography>
              </Grid>
            </Grid>
          </Card>
        </Grid>
        <Grid
          item
          md={4}
          sm={6}
          xs={12}
        >
          <Card sx={{ height: 120 }}>
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'space-between',
                p: 2
              }}
            >
              <div>
                <Typography
                  color="textPrimary"
                  variant="h5"
                >
                  Waiting Sales
                </Typography>
              </div>
              <Grid
                container
                direction="column"
                justifyContent="flex-start"
                alignItems="flex-end"
              >
                <Typography
                  color="info.main"
                  variant="h2"
                >
                  {(data) ? data.filter((value) => value.inq_status === 'waiting sales' && value.inq_disable !== 1).length : 0}
                </Typography>
                <Typography
                  color="#FF4C03"
                  variant="h5"
                >
                  { (data) ? data.filter((value) => value.inq_status === 'waiting sales' && Number(value.over_leadtime) > 0 && value.inq_disable !== 1).length : 0 }
                </Typography>
              </Grid>
            </Box>
          </Card>
        </Grid>
        <Grid
          item
          md={4}
          sm={6}
          xs={12}
        >
          <Card sx={{ height: 120 }}>
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'space-between',
                p: 2
              }}
            >
              <div>
                <Typography
                  color="textPrimary"
                  variant="h5"
                >
                  Waiting Mktg
                </Typography>
              </div>
              <Grid
                container
                direction="column"
                justifyContent="flex-start"
                alignItems="flex-end"
              >
                <Typography
                  color="info.main"
                  variant="h2"
                >
                  {(data) ? data.filter((value) => value.inq_status === 'waiting marketing' && value.inq_disable !== 1).length : 0}
                  {/* (data) ? data.filter((value) => value.inq_res_quote_status === 'PENDING' && value.inq_disable !== 1).length : 0 */}
                </Typography>
                <Typography
                  color="#FF4C03"
                  variant="h5"
                >
                  { (data) ? data.filter((value) => value.inq_status === 'waiting marketing' && Number(value.over_leadtime) > 0 && value.inq_disable !== 1).length : 0 }
                </Typography>
              </Grid>
            </Box>
          </Card>
        </Grid>
      </Grid>
      <Grid
        container
        spacing={1}
        sx={{ py: 1 }}
      >
        <Grid
          item
          md={4}
          sm={6}
          xs={12}
        >
          <Card sx={{ height: 120 }}>
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'space-between',
                p: 2
              }}
            >
              <div>
                <Typography
                  color="textPrimary"
                  variant="h5"
                >
                  Inquiry (backlog)
                </Typography>
              </div>
              <Grid
                container
                direction="column"
                justifyContent="flex-start"
                alignItems="flex-end"
              >
                <Typography
                  color="info.main"
                  variant="h2"
                >
                  {(data) ? data.filter((inquiry) => (inquiry.inq_status !== 'close') && (inquiry.inq_disable !== 1)).length - pending : 0}
                </Typography>
                <Typography
                  color="#FF4C03"
                  variant="h5"
                >
                  {/* (data) ? data.filter((value) => value.inq_status === 'waiting customer' && value.inq_disable !== 1).length : 0 */}
                </Typography>
              </Grid>
            </Box>
          </Card>
        </Grid>
        <Grid
          item
          md={4}
          sm={6}
          xs={12}
        >
          <Card sx={{ height: 120 }}>
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'space-between',
                p: 2
              }}
            >
              <div>
                <Typography
                  color="textPrimary"
                  variant="h5"
                >
                  Waiting Quotation
                </Typography>
              </div>
              <Grid
                container
                direction="column"
                justifyContent="flex-start"
                alignItems="flex-end"
              >
                <Typography
                  color="info.main"
                  variant="h2"
                >
                  {(data) ? data.filter((value) => value.inq_status === 'waiting quotation' && value.inq_disable !== 1).length : 0}
                </Typography>
                <Typography
                  color="#FF4C03"
                  variant="h5"
                >
                  { (data) ? data.filter((value) => value.inq_status === 'waiting quotation' && Number(value.over_leadtime) > 0 && value.inq_disable !== 1).length : 0 }
                </Typography>
              </Grid>
            </Box>
          </Card>
        </Grid>
        <Grid
          item
          md={4}
          sm={6}
          xs={12}
        >
          <Card sx={{ height: 120 }}>
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'space-between',
                p: 2
              }}
            >
              <div>
                <Typography
                  color="textPrimary"
                  variant="h5"
                >
                  Waiting Customer
                </Typography>
              </div>
              <Grid
                container
                direction="column"
                justifyContent="flex-start"
                alignItems="flex-end"
              >
                <Typography
                  color="info.main"
                  variant="h2"
                >
                  {(data) ? data.filter((value) => value.inq_status === 'waiting customer' && value.inq_disable !== 1).length : 0}
                </Typography>
                <Typography
                  color="#FF4C03"
                  variant="h5"
                >
                  { (data) ? data.filter((value) => value.inq_status === 'waiting customer' && Number(value.over_leadtime) > 0 && value.inq_disable !== 1).length : 0 }
                </Typography>
              </Grid>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Grid>
  );
};

AnalyticsGeneralOverview.propTypes = {
  data: PropTypes.array.isRequired,
  MonthlyTables: PropTypes.array.isRequired
};

export default AnalyticsGeneralOverview;
