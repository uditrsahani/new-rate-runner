import PropTypes from 'prop-types';
import {
  Card,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography
} from '@material-ui/core';
import Moment from 'moment';

const weekofyear = (day) => {
  if (day) {
    let tempWeek = 0;
    if (Moment(Moment(day).format('YYYY-MM-DD')).weekday() === 0) {
      tempWeek = ((Number(Moment(Moment(day).format('YYYY-MM-DD')).format('W')) + 1) % 52);
    } else {
      tempWeek = Number(Moment(Moment(day).format('YYYY-MM-DD')).format('W'));
    }
    return (tempWeek === 0) ? 52 : tempWeek;
  }
  return 0;
};

const CustomerContactDetails = (props) => {
  const { detail, MonthlyTables, ...other } = props;

  return (
    <Card {...other}>
      <CardHeader
        sx={{ ml: 2, mt: 1 }}
        title="Contact Details"
      />
      <Table
        sx={{ ml: 4, mb: 3, maxWidth: '95%' }}
        size="small"
      >
        <TableBody>
          <TableRow>
            <TableCell
              width={500}
              sx={{ borderBottom: 'none' }}
            >
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                Result
              </Typography>
            </TableCell>
            <TableCell sx={{ borderBottom: 'none' }}>
              <Typography
                color="textSecondary"
                variant="subtitle1"
              >
                {detail.inq_res_quote_status == null || detail.inq_res_quote_status === '' ? '-' : detail.inq_res_quote_status}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={{ borderBottom: 'none' }}>
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                Forecast Week No.
              </Typography>
            </TableCell>
            <TableCell sx={{ borderBottom: 'none' }}>
              <Typography
                color="textSecondary"
                variant="subtitle1"
              >
                {MonthlyTables[0] ? weekofyear(MonthlyTables[0].fc_cargo_readiness) : '-'}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={{ borderBottom: 'none' }}>
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                Actual Week No.
              </Typography>
            </TableCell>
            <TableCell sx={{ borderBottom: 'none' }}>
              <Typography
                color="textSecondary"
                variant="subtitle1"
              >
                {detail.inq_cargo_readiness == null || detail.inq_cargo_readiness === '' ? '-' : weekofyear(detail.inq_cargo_readiness)}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={{ borderBottom: 'none' }}>
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                Comment
              </Typography>
            </TableCell>
            <TableCell sx={{ borderBottom: 'none' }}>
              <Typography
                color="textSecondary"
                variant="subtitle1"
              >
                {detail.inq_res_comment == null || detail.inq_res_comment === '' ? '-' : detail.inq_res_comment}
              </Typography>
            </TableCell>
          </TableRow>
        </TableBody>
        <CardHeader title="IF Loss Cancel Please give information" />
        <TableRow>
          <TableCell sx={{ borderBottom: 'none' }}>
            <Typography
              color="textPrimary"
              variant="subtitle2"
            >
              Reason
            </Typography>
          </TableCell>
          <TableCell sx={{ borderBottom: 'none' }}>
            <Typography
              color="textSecondary"
              variant="subtitle1"
            >
              {detail.inq_res_reason == null || detail.inq_res_reason === '' ? '-' : detail.inq_res_reason}
            </Typography>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell sx={{ borderBottom: 'none' }}>
            <Typography
              color="textPrimary"
              variant="subtitle2"
            >
              Please describe
            </Typography>
          </TableCell>
          <TableCell sx={{ borderBottom: 'none' }}>
            <Typography
              color="textSecondary"
              variant="subtitle1"
            >
              {detail.inq_res_describe == null || detail.inq_res_describe === '' ? '-' : detail.inq_res_describe}
            </Typography>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell sx={{ borderBottom: 'none' }}>
            <Typography
              color="textPrimary"
              variant="subtitle2"
            >
              Competitor Name who WIN
            </Typography>
          </TableCell>
          <TableCell sx={{ borderBottom: 'none' }}>
            <Typography
              color="textSecondary"
              variant="subtitle1"
            >
              {detail.inq_res_ct_id_win == null || detail.inq_res_ct_id_win === '' ? '-' : detail.inq_res_ct_id_win}
            </Typography>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell sx={{ borderBottom: 'none' }}>
            <Typography
              color="textPrimary"
              variant="subtitle2"
            >
              Competitor Price (Freight)
            </Typography>
          </TableCell>
          <TableCell sx={{ borderBottom: 'none' }}>
            <Typography
              color="textSecondary"
              variant="subtitle1"
            >
              {detail.inq_res_ct_price == null || detail.inq_res_ct_price === '' ? '-' : detail.inq_res_ct_price}
            </Typography>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell sx={{ borderBottom: 'none' }}>
            <Typography
              color="textPrimary"
              variant="subtitle2"
            >
              Comment
            </Typography>
          </TableCell>
          <TableCell sx={{ borderBottom: 'none' }}>
            <Typography
              color="textSecondary"
              variant="subtitle1"
            >
              {detail.inq_res_loss_comment == null || detail.inq_res_loss_comment === '' ? '-' : detail.inq_res_loss_comment}
            </Typography>
          </TableCell>
        </TableRow>
      </Table>
    </Card>
  );
};

CustomerContactDetails.propTypes = {
  detail: PropTypes.object,
  MonthlyTables: PropTypes.object
};

export default CustomerContactDetails;
