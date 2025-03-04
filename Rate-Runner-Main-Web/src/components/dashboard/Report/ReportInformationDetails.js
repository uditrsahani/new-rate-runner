import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Card,
  CardHeader,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography
} from '@material-ui/core';
import Moment from 'moment';

const CustomerContactDetails = (props) => {
  const { detail, ...other } = props;
  console.log(detail);

  return (
    <Card {...other}>
      <CardHeader
        sx={{ ml: 2, mt: 1 }}
      />
      <Grid sx={{
        ml: 4,
        mt: -2,
        mb: 2,
        maxWidth: '100%',
        display: 'flex',
        flexWrap: 'wrap'
      }}
      >
        <Typography
          color="textPrimary"
          variant="h6"
        >
          Contact Details
        </Typography>
        <Box display={(detail.inq_disable === 1) ? 'block' : 'none'}>
          <Button
            sx={{
              ml: 2,
              mt: -0.5
            }}
            variant="contained"
            disabled
          >
            Disabled
          </Button>
        </Box>
      </Grid>
      <Table
        sx={{ ml: 4, mb: 3, maxWidth: '80%' }}
        size="small"
      >
        <TableBody>
          <TableRow>
            <TableCell sx={{ borderBottom: 'none' }}>
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                Inquiry No.
              </Typography>
            </TableCell>
            <TableCell
              sx={{ borderBottom: 'none' }}
              align="left"
            >
              <Typography
                color="textSecondary"
                variant="subtitle1"
              >
                {detail.inq_no == null ? '-' : detail.inq_no}
              </Typography>
            </TableCell>
            <TableCell sx={{ borderBottom: 'none' }}>
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                Inquiry Date
              </Typography>
            </TableCell>
            <TableCell sx={{ borderBottom: 'none' }}>
              <Typography
                color="textSecondary"
                variant="subtitle1"
              >
                {detail.inq_date == null ? '-' : Moment(detail.inq_date).format('DD/MM/YYYY')}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={{ borderBottom: 'none' }}>
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                Sales
              </Typography>
            </TableCell>
            <TableCell sx={{ borderBottom: 'none' }}>
              <Typography
                color="textSecondary"
                variant="subtitle1"
              >
                {detail.user_fullname == null ? '-' : detail.user_fullname}
              </Typography>
            </TableCell>
            <TableCell sx={{ borderBottom: 'none' }}>
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                Team
              </Typography>
            </TableCell>
            <TableCell sx={{ borderBottom: 'none' }}>
              <Typography
                color="textSecondary"
                variant="subtitle1"
              >
                {detail.user_team == null ? '-' : detail.user_team}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={{ borderBottom: 'none' }}>
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                Customer
              </Typography>
            </TableCell>
            <TableCell sx={{ borderBottom: 'none' }}>
              <Typography
                color="textSecondary"
                variant="subtitle1"
              >
                {detail.cus_name == null ? '-' : detail.cus_name}
              </Typography>
            </TableCell>
            <TableCell sx={{ borderBottom: 'none' }}>
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                Customer Type
              </Typography>
            </TableCell>
            <TableCell sx={{ borderBottom: 'none' }}>
              <Typography
                color="textSecondary"
                variant="subtitle1"
              >
                {detail.cus_type == null ? '-' : detail.cus_type}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={{ borderBottom: 'none' }}>
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                Mode
              </Typography>
            </TableCell>
            <TableCell sx={{ borderBottom: 'none' }}>
              <Typography
                color="textSecondary"
                variant="subtitle1"
              >
                {detail.inq_mode == null ? '-' : detail.inq_mode}
              </Typography>
            </TableCell>
            <TableCell sx={{ borderBottom: 'none' }}>
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                Incoterms
              </Typography>
            </TableCell>
            <TableCell sx={{ borderBottom: 'none' }}>
              <Typography
                color="textSecondary"
                variant="subtitle1"
              >
                {detail.inq_incoterms == null ? '-' : detail.inq_incoterms}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={{ borderBottom: 'none' }}>
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                Factory Location
              </Typography>
            </TableCell>
            <TableCell sx={{ borderBottom: 'none' }}>
              <Typography
                color="textSecondary"
                variant="subtitle1"
              >
                {(detail.inq_factory_location) ? '-' : detail.inq_factory_location}
              </Typography>
            </TableCell>
            <TableCell sx={{ borderBottom: 'none' }}>
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                Place Of Receipt
              </Typography>
            </TableCell>
            <TableCell sx={{ borderBottom: 'none' }}>
              <Typography
                color="textSecondary"
                variant="subtitle1"
              >
                {(detail.inq_place_of_receipt) ? '-' : detail.inq_place_of_receipt}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={{ borderBottom: 'none' }}>
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                POL
              </Typography>
            </TableCell>
            <TableCell sx={{ borderBottom: 'none' }}>
              <Typography
                color="textSecondary"
                variant="subtitle1"
              >
                {detail.pol_port_name == null ? '-' : detail.pol_port_name}
              </Typography>
            </TableCell>
            <TableCell sx={{ borderBottom: 'none' }}>
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                POD
              </Typography>
            </TableCell>
            <TableCell sx={{ borderBottom: 'none' }}>
              <Typography
                color="textSecondary"
                variant="subtitle1"
              >
                {detail.pod_port_name == null ? '-' : detail.pod_port_name}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={{ borderBottom: 'none' }}>
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                Final Destination
              </Typography>
            </TableCell>
            <TableCell sx={{ borderBottom: 'none' }}>
              <Typography
                color="textSecondary"
                variant="subtitle1"
              >
                {detail.inq_final_destination == null ? '-' : detail.inq_final_destination}
              </Typography>
            </TableCell>
            <TableCell sx={{ borderBottom: 'none' }}>
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                Commodity
              </Typography>
            </TableCell>
            <TableCell sx={{ borderBottom: 'none' }}>
              <Typography
                color="textSecondary"
                variant="subtitle1"
              >
                {detail.inq_commodity == null ? '-' : detail.inq_commodity}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={{ borderBottom: 'none' }}>
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                Type
              </Typography>
            </TableCell>
            <TableCell sx={{ borderBottom: 'none' }}>
              <Typography
                color="textSecondary"
                variant="subtitle1"
              >
                {detail.inq_type == null ? '-' : detail.inq_type}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={{ borderBottom: 'none' }}>
              <Typography
                color="textPrimary"
                variant="h6"
                sx={{ ml: -2 }}
              >
                Container
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={{ borderBottom: 'none' }}>
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                20&apos;
              </Typography>
            </TableCell>
            <TableCell sx={{ borderBottom: 'none' }}>
              <Typography
                color="textSecondary"
                variant="subtitle1"
              >
                {(!detail.inq_container_20 || Number(detail.inq_container_20) === 0) ? '' : Number(detail.inq_container_20).toLocaleString(navigator.language, { minimumFractionDigits: 0 })}
              </Typography>
            </TableCell>
            <TableCell sx={{ borderBottom: 'none' }}>
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                40&apos;
              </Typography>
            </TableCell>
            <TableCell sx={{ borderBottom: 'none' }}>
              <Typography
                color="textSecondary"
                variant="subtitle1"
              >
                {(!detail.inq_container_40 || Number(detail.inq_container_40) === 0) ? '' : Number(detail.inq_container_40).toLocaleString(navigator.language, { minimumFractionDigits: 0 })}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={{ borderBottom: 'none' }}>
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                40&apos;&nbsp;HC
              </Typography>
            </TableCell>
            <TableCell sx={{ borderBottom: 'none' }}>
              <Typography
                color="textSecondary"
                variant="subtitle1"
              >
                {(!detail.inq_container_40hc || Number(detail.inq_container_40hc) === 0) ? '' : Number(detail.inq_container_40hc).toLocaleString(navigator.language, { minimumFractionDigits: 0 })}
              </Typography>
            </TableCell>
            <TableCell sx={{ borderBottom: 'none' }}>
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                CBM
              </Typography>
            </TableCell>
            <TableCell sx={{ borderBottom: 'none' }}>
              <Typography
                color="textSecondary"
                variant="subtitle1"
              >
                {(!detail.inq_container_cbm || Number(detail.inq_container_cbm) === 0) ? '' : Number(detail.inq_container_cbm).toLocaleString(navigator.language, { minimumFractionDigits: 3 })}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={{ borderBottom: 'none' }}>
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                Special Container
              </Typography>
            </TableCell>
            <TableCell sx={{ borderBottom: 'none' }}>
              <Typography
                color="textSecondary"
                variant="subtitle1"
              >
                {detail.inq_special_container == null ? '-' : detail.inq_special_container}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={{ borderBottom: 'none' }}>
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                GW Per CNTR (Kg)
              </Typography>
            </TableCell>
            <TableCell sx={{ borderBottom: 'none' }}>
              <Typography
                color="textSecondary"
                variant="subtitle1"
              >
                {(!detail.inq_qw_per_cntr || Number(detail.inq_qw_per_cntr) === 0) ? '' : Number(detail.inq_qw_per_cntr).toLocaleString(navigator.language, { minimumFractionDigits: 2 })}
              </Typography>
            </TableCell>
            <TableCell sx={{ borderBottom: 'none' }}>
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                Cargo Readliness
              </Typography>
            </TableCell>
            <TableCell sx={{ borderBottom: 'none' }}>
              <Typography
                color="textSecondary"
                variant="subtitle1"
              >
                {detail.inq_cargo_readiness == null ? '' : Moment(detail.inq_cargo_readiness).format('DD/MM/YYYY')}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={{ borderBottom: 'none' }}>
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                Idea Rate Per Unit
              </Typography>
            </TableCell>
            <TableCell sx={{ borderBottom: 'none' }}>
              <Typography
                color="textSecondary"
                variant="subtitle1"
              >
                {(!detail.inq_idea_rate_per_unit || Number(detail.inq_idea_rate_per_unit) === 0) ? '' : Number(detail.inq_idea_rate_per_unit).toLocaleString(navigator.language, { minimumFractionDigits: 2 })}
              </Typography>
            </TableCell>
          </TableRow>
        </TableBody>
        <CardHeader
          title="Special Requirement"
          sx={{ ml: -2 }}
        />
        <TableRow>
          <TableCell sx={{ borderBottom: 'none' }}>
            <Typography
              color="textPrimary"
              variant="subtitle2"
            >
              Freetime
            </Typography>
          </TableCell>
          <TableCell sx={{ borderBottom: 'none' }}>
            <Typography
              color="textSecondary"
              variant="subtitle1"
            >
              {detail.inq_freetime == null || detail.inq_freetime === '' ? '-' : detail.inq_freetime}
            </Typography>
          </TableCell>
          <TableCell sx={{ borderBottom: 'none' }}>
            <Typography
              color="textPrimary"
              variant="subtitle2"
            >
              Competitor
            </Typography>
          </TableCell>
          <TableCell sx={{ borderBottom: 'none' }}>
            <Typography
              color="textSecondary"
              variant="subtitle1"
            >
              -
            </Typography>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell sx={{ borderBottom: 'none' }}>
            <Typography
              color="textPrimary"
              variant="subtitle2"
            >
              Current Carrier
            </Typography>
          </TableCell>
          <TableCell sx={{ borderBottom: 'none' }}>
            <Typography
              color="textSecondary"
              variant="subtitle1"
            >
              -
            </Typography>
          </TableCell>
          <TableCell sx={{ borderBottom: 'none' }}>
            <Typography
              color="textPrimary"
              variant="subtitle2"
            >
              Others/Comment
            </Typography>
          </TableCell>
          <TableCell sx={{ borderBottom: 'none' }}>
            <Typography
              color="textSecondary"
              variant="subtitle1"
            >
              {detail.inq_other == null ? '-' : detail.inq_other}
            </Typography>
          </TableCell>
        </TableRow>
      </Table>
    </Card>
  );
};

CustomerContactDetails.propTypes = {
  detail: PropTypes.object
};

export default CustomerContactDetails;
