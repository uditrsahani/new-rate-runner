import PropTypes from 'prop-types';
import { useCallback, useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core';
import useMounted from '../../../hooks/useMounted';
import instance from '../../../store/instance';

const CustomerContactDetails = (props) => {
  const { detail, agentname, carrier, Agent, ...other } = props;
  const [offer, setOffer] = useState(0);
  const [agent, setAgent] = useState({ agent_name: '' });
  const mounted = useMounted();

  const getAgentDetail = useCallback(async () => {
    try {
      if (detail.aq_agent_id) {
        const url = `/profile/agent/${detail.aq_agent_id}`;
        await instance.get(url)
          .then((res) => {
            if (mounted.current) {
              // console.log('agent', res);
              setAgent(res.data);
            }
          });
      }
    } catch (err) {
      console.error(err);
    }
  }, [mounted]);

  const initialSetState = () => {
    let offerValue = 0;
    if (detail.inq_container_20) {
      offerValue += Number(detail.inq_container_20) * Number(detail.rate_freight_20);
    }
    if (detail.inq_container_40) {
      offerValue += Number(detail.inq_container_40) * Number(detail.rate_freight_40);
    }
    if (detail.inq_container_40hc) {
      offerValue += Number(detail.inq_container_40hc) * Number(detail.rate_freight_40hc);
    }
    if (detail.inq_container_cbm) {
      offerValue += Number(detail.inq_container_cbm) * Number(detail.rate_freight_cbm);
    }
    setOffer(offerValue);
  };

  useEffect(() => {
    getAgentDetail();
  }, [getAgentDetail]);

  useEffect(() => {
    initialSetState();
  }, [initialSetState]);

  return (
    <Card
      {...other}
    >
      <CardContent align="center">
        <Table
          sx={{ maxWidth: 800 }}
          size="small"
        >
          <TableHead>
            <TableRow>
              <TableCell
                colSpan={4}
                align="center"
              >
                <Typography
                  color="textPrimary"
                  variant="h6"
                >
                  System Offer
                </Typography>

              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell width={200}>
                <Typography
                  color="textPrimary"
                  variant="h6"
                >
                  Item
                </Typography>
              </TableCell>
              <TableCell
                align="right"
                width={200}
              >
                <Typography
                  color="textPrimary"
                  variant="h6"
                >
                  Carrier/Agent
                </Typography>
              </TableCell>
              <TableCell
                align="right"
                width={200}
              >
                <Typography
                  color="textPrimary"
                  variant="h6"
                >
                  Cost
                </Typography>
              </TableCell>
              <TableCell
                align="right"
                width={200}
              >
                <Typography
                  color="textPrimary"
                  variant="h6"
                >
                  Revenue
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>

                Freight
              </TableCell>
              <TableCell align="right">

                {(carrier) ? carrier.cr_name : '-'}
              </TableCell>
              <TableCell align="right">
                {(offer && Number(offer) !== 0) ? Number(offer).toLocaleString() : ''}
              </TableCell>
              <TableCell align="right">
                {(detail.inq_quate_freight_sq && Number(detail.inq_quate_freight_sq) !== 0) ? Number(detail.inq_quate_freight_sq).toLocaleString() : ''}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                Agent
              </TableCell>
              <TableCell align="right">
                {(agent) ? agent.agent_name : '-'}
              </TableCell>
              <TableCell />
              <TableCell />
            </TableRow>
            <TableRow>
              <TableCell>
                - Custom Per Shipment
              </TableCell>
              <TableCell />
              <TableCell align="right">
                {(detail.aq_cp_shpmt && Number(offer) !== 0) ? Number(detail.aq_cp_shpmt).toLocaleString() : ''}
              </TableCell>
              <TableCell align="right">
                {(detail.aq_sq_cp_shpmt && Number(detail.aq_sq_cp_shpmt) !== 0) ? Number(detail.aq_sq_cp_shpmt).toLocaleString() : ''}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                - Custom Per Container
              </TableCell>
              <TableCell />
              <TableCell align="right">
                {(detail.aq_cp_cntr && Number(detail.aq_cp_cntr) !== 0) ? Number(detail.aq_cp_cntr).toLocaleString() : ''}
              </TableCell>
              <TableCell align="right">
                {(detail.aq_sq_cp_cntr && Number(detail.aq_sq_cp_cntr) !== 0) ? Number(detail.aq_sq_cp_cntr).toLocaleString() : ''}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                - Delivery Per Shipment
              </TableCell>
              <TableCell />
              <TableCell align="right">
                {(detail.aq_dp_cntr && Number(detail.aq_dp_cntr) !== 0) ? Number(detail.aq_dp_cntr).toLocaleString() : ''}
              </TableCell>
              <TableCell align="right">
                {(detail.aq_sq_dp_cntr && Number(detail.aq_sq_dp_cntr) !== 0) ? Number(detail.aq_sq_dp_cntr).toLocaleString() : ''}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                - Delivery Per Container
              </TableCell>
              <TableCell />
              <TableCell align="right">
                {(detail.aq_dp_shpt && Number(detail.aq_dp_shpt) !== 0) ? Number(detail.aq_dp_shpt).toLocaleString() : ''}

              </TableCell>
              <TableCell align="right">
                {(detail.aq_sq_dp_shpt && Number(detail.aq_sq_dp_shpt) !== 0) ? Number(detail.aq_sq_dp_shpt).toLocaleString() : ''}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography
                  color="textPrimary"
                  variant="subtitle2"
                >
                  Summary Revenue
                </Typography>
              </TableCell>
              <TableCell />
              <TableCell align="right">
                {(Number(offer) + Number(detail.aq_cp_shpmt) + Number(detail.aq_cp_cntr) + Number(detail.aq_dp_cntr) + Number(detail.aq_dp_shpt)).toLocaleString()}
              </TableCell>
              <TableCell align="right">
                {(detail.inq_revenue && Number(detail.inq_revenue) !== 0) ? Number(detail.inq_revenue).toLocaleString() : ''}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography
                  color="textPrimary"
                  variant="subtitle2"
                >
                  GP
                </Typography>
              </TableCell>
              <TableCell />
              <TableCell />
              <TableCell align="right">
                {(detail.inq_gp && Number(detail.inq_gp) !== 0) ? Number(detail.inq_gp).toLocaleString() : ''}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography
                  color="textPrimary"
                  variant="subtitle2"
                >
                  ROS(%)
                </Typography>
              </TableCell>
              <TableCell />
              <TableCell />
              <TableCell align="right">
                {(detail.inq_revenue && Number(detail.inq_revenue) !== 0) ? `${(Number(detail.inq_gp / detail.inq_revenue) * 100).toFixed(2).toLocaleString()}%` : ''}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

CustomerContactDetails.propTypes = {
  detail: PropTypes.object,
  carrier: PropTypes.object,
  Agent: PropTypes.object,
  agentname: PropTypes.string
};

export default CustomerContactDetails;
