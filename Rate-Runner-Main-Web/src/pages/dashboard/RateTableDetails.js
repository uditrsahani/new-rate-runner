import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import instance from '../../store/instance';
import gtm from '../../lib/gtm';
import { RateTableEdit } from '../../components/dashboard/RateTable';
import { Skeleton } from '@material-ui/core';

const Account = () => {
  const [mounted, setMounted] = useState(true);
  const [RateTables, setRateTables] = useState([]);
  const [Customer, setCustomer] = useState([]);
  const [Inquiry, setInquiry] = useState([]);
  const [POL, setPOL] = useState([]);
  const [POD, setPOD] = useState([]);
  const [carrier, setCarrier] = useState([]);
  const [RateRoute, setRateRoute] = useState([]);
  const [RateTsPort, setRateTsPort] = useState([]);
  const [Agent, setAgent] = useState([]);
  const { rateId } = useParams();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(async () => {
    gtm.push({ event: 'page_view' });
    if (mounted) {
      await instance.get('/table/rate')
        .then((res) => {
          setRateTables(res.data.filter((data) => data.rate_id === rateId));
          const tmpRateRoute = Array.from(new Set(res.data.map((value) => (value.rate_route ? value.rate_route : ''))));
          const tmprRateRoute = [];
          tmpRateRoute.map((v) => tmprRateRoute.push({ text: v, value: v }));
          setRateRoute(tmprRateRoute);

          const tmpRateTsPort = Array.from(new Set(res.data.map((value) => (value.rate_ts_port ? value.rate_ts_port : ''))));
          const tmprRateTsPort = [];
          tmpRateTsPort.map((v) => tmprRateTsPort.push({ text: v, value: v }));
          setRateTsPort(tmprRateTsPort);
        });
      await instance.get('/profile/customer')
        .then((res) => {
          setCustomer(res.data
            .sort((a, b) => (a.cus_name.toUpperCase() > b.cus_name.toUpperCase() ? 1 : -1))
            .map((val) => ({ id: val.cus_id, value: val.cus_name })));
        });
      await instance.get('/table/port?port_disable=0')
        .then((res) => {
          setPOL(res.data
            .sort((a, b) => (a.port_name.toUpperCase() > b.port_name.toUpperCase() ? 1 : -1))
            .map((val) => ({ id: val.port_id, value: val.port_name }))
            .filter((thing, index, self) => index === self.findIndex((t) => (
              t.value === thing.value
            ))));
          setPOD(res.data
            .sort((a, b) => (a.port_name.toUpperCase() > b.port_name.toUpperCase() ? 1 : -1))
            .map((val) => ({ id: val.port_id, value: val.port_name }))
            .filter((thing, index, self) => index === self.findIndex((t) => (
              t.value === thing.value
            ))));
        });
      await instance.get('/inquiry?minimize=true')
        .then((res) => {
          setInquiry(res.data
            .sort((a, b) => (a.inq_no.toUpperCase() < b.inq_no.toUpperCase() ? 1 : -1))
            .map((val) => ({ id: val.inq_no, value: val.inq_no })));
        });
      await instance.get('/profile/agent')
        .then((res) => {
          setAgent(res.data
            .sort((a, b) => (a.agent_name.toUpperCase() > b.agent_name.toUpperCase() ? 1 : -1))
            .map((val) => ({ id: val.agent_id, value: val.agent_name })));
        });
      await instance.get('/profile/carrier')
        .then((res) => {
          setCarrier(res.data
            .sort((a, b) => (a.cr_name.toUpperCase() > b.cr_name.toUpperCase() ? 1 : -1))
            .map((val) => ({ id: val.cr_id, value: val.cr_name })));
        });
      setIsLoading(false);
    }
    if (RateTables.length > 0) {
      setMounted(false);
    }
  }, []);

  return (
    <>
      {isLoading
        ? (
          <Skeleton
            sx={{
              borderRadius: 1,
              pt: '99.76%',
              width: '100%',
              mt: 2
            }}
            variant="rectangular"
          />
        )
        : (
          <RateTableEdit
            RateTables={RateTables}
            Customer={Customer}
            Inquiry={Inquiry}
            POL={POL}
            POD={POD}
            carrier={carrier}
            RateRoute={RateRoute}
            RateTsPort={RateTsPort}
            Agent={Agent}
          />
        )}
    </>
  );
};

export default Account;
