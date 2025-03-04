/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import Moment from 'moment';
import instance from '../../../store/instance';
import {
  Card,
  CardContent,
  Box,
  Table,
  Grid,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core';

const CustomerContactDetails = (props) => {
  const { detail, Agent, carrier, RateAgent } = props;

  const downLoadFile = async (id, filename) => {
    const url = `agent/quote/${id}/file`;
    await instance.get(url, {
      method: 'GET',
      responseType: 'blob'
    })
      .then((res) => {
        const name = filename.split('.');
        const urlDownload = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = urlDownload;
        link.setAttribute('download', `${Date.now()}.${name[1]}`);
        document.body.appendChild(link);
        link.click();
        // const newWindow = window.open(link.click(), '_blank', 'noopener,noreferrer');
        // if (newWindow) newWindow.opener = null;
        // console.log(res);
      });
  };

  return (
    <Grid
      container
      spacing={2}
      sx={{ mt: -3 }}
    >
      <Grid
        item
        md={4}
        sm={4}
        xs={6}
      >
        <Card>
          <CardContent>
            <Box>
              <Table
                fullWidth
                size="small"
                sx={{ ml: -2, mr: -2 }}
              >
                <TableRow style={{ verticalAlign: 'middle', height: 30 }}>
                  <TableCell style={{ borderBottom: 'none', width: 40 }}>
                    <Typography
                      variant="subtitle2"
                    >
                      POL:
                    </Typography>
                  </TableCell>
                  <TableCell
                    style={{ borderBottom: 'none' }}
                    align="left"
                    colspan="2"
                  >
                    <Typography
                      style={{ width: 200 }}
                      variant="body2"
                    >
                      {detail.pol_port_name}
                    </Typography>
                  </TableCell>
                  <TableCell
                    style={{ borderBottom: 'none' }}
                    align="left"
                  />
                </TableRow>
                <TableRow style={{ verticalAlign: 'middle', height: 30 }}>
                  <TableCell style={{ borderBottom: 'none', width: 40 }}>
                    <Typography
                      variant="subtitle2"
                    >
                      POD:
                    </Typography>
                  </TableCell>
                  <TableCell
                    style={{ borderBottom: 'none' }}
                    align="left"
                    colspan="2"
                  >
                    <Typography
                      style={{ width: 200 }}
                      variant="body2"
                    >
                      {detail.pod_port_name}
                    </Typography>
                  </TableCell>
                  <TableCell
                    style={{ borderBottom: 'none' }}
                    align="left"
                  />
                </TableRow>
                <TableRow style={{ verticalAlign: 'middle', height: 30 }}>
                  <TableCell style={{ borderBottom: 'none', width: 40 }}>
                    <Typography
                      variant="subtitle2"
                    >
                      Carrier:
                    </Typography>
                  </TableCell>
                  <TableCell
                    style={{ borderBottom: 'none' }}
                    align="left"
                    colspan="2"
                  >
                    <Typography
                      style={{ width: 200 }}
                      variant="body2"
                    >
                      {(carrier && (detail.inq_uuid && detail.inq_uuid !== '')) ? carrier.cr_name : ''}
                    </Typography>
                  </TableCell>
                  <TableCell
                    style={{ borderBottom: 'none' }}
                    align="left"
                  />
                </TableRow>
                <TableRow style={{ verticalAlign: 'middle', height: 30 }}>
                  <TableCell style={{ borderBottom: 'none' }}>
                    <Typography
                      variant="subtitle2"
                    >
                      Agent:
                    </Typography>
                  </TableCell>
                  <TableCell style={{ borderBottom: 'none' }}>
                    <Typography
                      variant="body2"
                      colspan="3"
                    >
                      {(RateAgent && (detail.inq_uuid && detail.inq_uuid !== '')) ? RateAgent.agent_name : ''}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow style={{ verticalAlign: 'middle', height: 30 }}>
                  <TableCell style={{ borderBottom: 'none' }}>
                    <Typography
                      variant="subtitle2"
                    >
                      ETD:
                    </Typography>
                  </TableCell>
                  <TableCell
                    colspan="3"
                    style={{ borderBottom: 'none' }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ display: 'flex', flexWrap: 'wrap' }}
                    >
                      {
                        (detail.rate_sailing_bkk && detail.rate_sailing_bkk !== '') && (
                        <Grid sx={{ display: 'flex', flexWrap: 'wrap' }}>
                          <Grid sx={{ fontWeight: 'bold' }}>BKK:&nbsp;</Grid>
                          {detail.rate_sailing_bkk}
                          &nbsp;
                        </Grid>
                        )
                      }
                      {
                        (detail.rate_sailing_lcb && detail.rate_sailing_lcb !== '') && (
                        <Grid sx={{ display: 'flex', flexWrap: 'wrap' }}>
                          <Grid sx={{ fontWeight: 'bold' }}>LCB:&nbsp;</Grid>
                          {detail.rate_sailing_lcb}
                         &nbsp;
                        </Grid>
                        )
                      }
                      {
                        (detail.rate_sailing_other && detail.rate_sailing_other !== '') && (
                        <Grid sx={{ display: 'flex', flexWrap: 'wrap' }}>
                          <Grid sx={{ fontWeight: 'bold' }}>Other:&nbsp;</Grid>
                          {detail.rate_sailing_other}
                          &nbsp;
                        </Grid>
                        )
                      }
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow style={{ verticalAlign: 'middle', height: 30 }}>
                  <TableCell style={{ borderBottom: 'none' }}>
                    <Typography
                      variant="subtitle2"
                    >
                      T/T:
                    </Typography>
                  </TableCell>
                  <TableCell
                    style={{ borderBottom: 'none', display: 'flex', flexWrap: 'wrap' }}
                    colspan="3"
                  >
                    <Typography
                      variant="body2"
                    >
                      {detail.rate_tt}
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      sx={{ ml: 3 }}
                    >
                      Route:
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ ml: 3 }}
                    >
                      {detail.rate_route}
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      sx={{ ml: 3 }}
                    >
                      T/S Port:
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ ml: 3 }}
                    >
                      {detail.rate_ts_port}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow style={{ verticalAlign: 'middle', height: 30 }}>
                  <TableCell style={{ borderBottom: 'none' }}>
                    <Typography
                      variant="subtitle2"
                    >
                      Type:
                    </Typography>
                  </TableCell>
                  <TableCell
                    style={{ borderBottom: 'none' }}
                    colspan="3"
                  >
                    <Typography
                      variant="body2"
                    >
                      {detail.rate_type}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow style={{ verticalAlign: 'middle' }}>
                  <TableCell
                    style={{ borderBottom: 'none' }}
                    colspan="4"
                    align="left"
                  >
                    <Table
                      fullWidth
                      size="small"
                      sx={{ mt: -2 }}
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell />
                          <TableCell>
                            20`
                          </TableCell>
                          <TableCell>
                            40`
                          </TableCell>
                          <TableCell>
                            40` HC
                          </TableCell>
                          <TableCell>
                            CBM
                          </TableCell>
                          <TableCell>
                            SET
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell sx={{ maxWidth: 65 }}>
                            <Typography
                              color="textPrimary"
                              variant="subtitle2"
                              sx={{ ml: -0.5 }}
                            >
                              Freight:
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {detail.rate_freight_currency}
                            { detail.rate_freight_currency !== '' && <br />}
                            {(detail.rate_freight_20) ? Number(detail.rate_freight_20).toLocaleString() : ''}
                          </TableCell>
                          <TableCell>
                            {detail.rate_freight_currency}
                            { detail.rate_freight_currency !== '' && <br />}
                            {(detail.rate_freight_40) ? Number(detail.rate_freight_40).toLocaleString() : ''}
                          </TableCell>
                          <TableCell>
                            {detail.rate_freight_currency}
                            { detail.rate_freight_currency !== '' && <br />}
                            {(detail.rate_freight_40hc) ? Number(detail.rate_freight_40hc).toLocaleString() : ''}
                          </TableCell>
                          <TableCell>
                            {detail.rate_freight_currency}
                            { detail.rate_freight_currency !== '' && <br />}
                            {(detail.rate_freight_cbm) ? Number(detail.rate_freight_cbm).toLocaleString() : ''}
                          </TableCell>
                          <TableCell>
                            -
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ maxWidth: 65 }}>
                            <Typography
                              color="textPrimary"
                              variant="subtitle2"
                              sx={{ ml: -0.5 }}
                            >
                              ISPS:
                            </Typography>
                          </TableCell>
                          <TableCell>
                            -
                          </TableCell>
                          <TableCell>
                            {detail.rate_isps_currency}
                            { detail.rate_isps_currency !== '' && <br />}
                            {(detail.rate_isps_cp_cntr) ? Number(detail.rate_isps_cp_cntr).toLocaleString() : ''}
                          </TableCell>
                          <TableCell>
                            -
                          </TableCell>
                          <TableCell>
                            -
                          </TableCell>
                          <TableCell>
                            -
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ maxWidth: 65 }}>
                            <Typography
                              color="textPrimary"
                              variant="subtitle2"
                              sx={{ ml: -0.5 }}
                            >
                              AMS/ENS
                              /AFR:
                            </Typography>
                          </TableCell>
                          <TableCell>
                            -
                          </TableCell>
                          <TableCell>
                            -
                          </TableCell>
                          <TableCell>
                            -
                          </TableCell>
                          <TableCell>
                            -
                          </TableCell>
                          <TableCell>
                            {detail.rate_aea_currency}
                            { detail.rate_aea_currency !== '' && <br />}
                            {(detail.rate_aea_cp_shpmt) ? Number(detail.rate_aea_cp_shpmt).toLocaleString() : ''}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ maxWidth: 65 }}>
                            <Typography
                              color="textPrimary"
                              variant="subtitle2"
                              sx={{ ml: -0.5 }}
                            >
                              LSS:
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {detail.rate_lss_currency}
                            { detail.rate_lss_currency !== '' && <br />}
                            {(detail.rate_lss_20) ? Number(detail.rate_lss_20).toLocaleString() : ''}
                          </TableCell>
                          <TableCell>
                            {detail.rate_lss_currency}
                            { detail.rate_lss_currency !== '' && <br />}
                            {(detail.rate_lss_40) ? Number(detail.rate_lss_40).toLocaleString() : ''}
                          </TableCell>
                          <TableCell>
                            {detail.rate_lss_currency}
                            { detail.rate_lss_currency !== '' && <br />}
                            {(detail.rate_lss_40hc) ? Number(detail.rate_lss_40hc).toLocaleString() : ''}
                          </TableCell>
                          <TableCell>
                            -
                          </TableCell>
                          <TableCell>
                            -
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableCell>
                </TableRow>
                <TableRow style={{ verticalAlign: 'middle', height: 30 }}>
                  <TableCell style={{ borderBottom: 'none' }}>
                    <Typography
                      variant="subtitle2"
                    >
                      Remark:
                    </Typography>
                  </TableCell>
                  <TableCell
                    style={{ borderBottom: 'none' }}
                    colspan="3"
                  >
                    <Typography
                      sx={{ width: 300 }}
                      variant="body2"
                    >
                      {detail.rate_remark}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow style={{ verticalAlign: 'middle', height: 30 }}>
                  <TableCell style={{ borderBottom: 'none' }}>
                    <Typography
                      variant="subtitle2"
                    >
                      Carrier S/C:
                    </Typography>
                  </TableCell>
                  <TableCell
                    style={{ borderBottom: 'none' }}
                    colspan="3"
                  >
                    <Typography
                      sx={{ width: 300 }}
                      variant="body2"
                    >
                      {detail.rate_carrier_sc}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow style={{ verticalAlign: 'middle', height: 30 }}>
                  <TableCell style={{ borderBottom: 'none' }}>
                    <Typography
                      variant="subtitle2"
                    >
                      Validity:
                    </Typography>
                  </TableCell>
                  <TableCell
                    colspan="3"
                    style={{ borderBottom: 'none' }}
                  >
                    <Typography
                      sx={{ width: 300 }}
                      variant="body2"
                    >
                      {Moment(detail.rate_valid_from).format('DD/MM/YYYY')}
                      -
                      {Moment(detail.rate_expired_to).format('DD/MM/YYYY')}
                    </Typography>
                  </TableCell>
                </TableRow>
              </Table>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid
        item
        md={4}
        sm={4}
        xs={6}
      >
        <Card>
          <CardContent>
            <Box>
              <Table
                size="small"
                sx={{ ml: 1 }}
              >
                <TableBody>
                  <TableRow style={{ verticalAlign: 'middle', height: 30 }}>
                    <TableCell style={{ borderBottom: 'none', width: 220 }}>
                      <Typography
                        variant="subtitle2"
                      >
                        Agent:
                      </Typography>
                    </TableCell>
                    <TableCell
                      style={{ borderBottom: 'none' }}
                      align="left"
                    >
                      <Typography
                        variant="body2"
                      >
                        {Agent.agent_name}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow style={{ verticalAlign: 'middle', height: 30 }}>
                    <TableCell style={{ borderBottom: 'none' }}>
                      <Typography
                        variant="subtitle2"
                      >
                        Customs Per Shipment:
                      </Typography>
                    </TableCell>
                    <TableCell style={{ borderBottom: 'none' }}>
                      <Typography
                        variant="body2"
                      >
                        {detail.aq_currency_cp_shpmt}
                        {' '}
                        {(detail.aq_cp_shpmt) ? detail.aq_cp_shpmt.toLocaleString() : ''}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow style={{ verticalAlign: 'middle', height: 30 }}>
                    <TableCell style={{ borderBottom: 'none' }}>
                      <Typography
                        variant="subtitle2"
                      >
                        Customs Per Container:
                      </Typography>
                    </TableCell>
                    <TableCell style={{ borderBottom: 'none' }}>
                      <Typography
                        variant="body2"
                      >
                        {detail.aq_currency_cp_cntr}
                        {' '}
                        {(detail.aq_cp_cntr) ? detail.aq_cp_cntr.toLocaleString() : ''}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow style={{ verticalAlign: 'middle', height: 30 }}>
                    <TableCell style={{ borderBottom: 'none' }}>
                      <Typography
                        variant="subtitle2"
                      >
                        Delivery Per Shipment:
                      </Typography>
                    </TableCell>
                    <TableCell style={{ borderBottom: 'none' }}>
                      <Typography
                        variant="body2"
                      >
                        {detail.aq_currency_dp_shpt}
                        {' '}
                        {(detail.aq_dp_shpt) ? detail.aq_dp_shpt.toLocaleString() : ''}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow style={{ verticalAlign: 'middle', height: 30 }}>
                    <TableCell style={{ borderBottom: 'none' }}>
                      <Typography
                        variant="subtitle2"
                      >
                        Delivery Per Container:
                      </Typography>
                    </TableCell>
                    <TableCell style={{ borderBottom: 'none' }}>
                      <Typography
                        variant="body2"
                      >
                        {detail.aq_currency_dp_cntr}
                        {' '}
                        {(detail.aq_dp_cntr) ? detail.aq_dp_cntr.toLocaleString() : ''}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow style={{ verticalAlign: 'middle', height: 30 }}>
                    <TableCell style={{ borderBottom: 'none' }}>
                      <Typography
                        variant="subtitle2"
                      >
                        Email:
                      </Typography>
                    </TableCell>
                    <TableCell style={{ borderBottom: 'none' }}>
                      <Grid display={(detail.aq_filename && detail.aq_filename !== '') ? 'block' : 'none'}>
                        <MailOutlineIcon
                          fontSize="small"
                          onClick={() => {
                            downLoadFile(detail.aq_id, detail.aq_filename);
                          }}
                        />
                      </Grid>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

CustomerContactDetails.propTypes = {
  detail: PropTypes.object,
  Agent: PropTypes.object,
  RateAgent: PropTypes.object,
  carrier: PropTypes.object
};

export default CustomerContactDetails;
