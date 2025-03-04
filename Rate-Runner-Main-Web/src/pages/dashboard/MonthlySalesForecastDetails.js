import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import instance from '../../store/instance';
import gtm from '../../lib/gtm';
import { MonthlySalesForecastEdit } from '../../components/dashboard/MonthlySalesForecastDetails';
import Moment from 'moment';
import { Skeleton } from '@material-ui/core';

const Account = () => {
  const [mounted, setMounted] = useState(true);
  const [MonthlyTables, setMonthlyTables] = useState([]);
  const [MonthlyTablesAll, setMonthlyTablesAll] = useState([]);
  const [Week, setWeek] = useState([]);
  const [Customer, setCustomer] = useState([]);
  const [Inquiry, setInquiry] = useState([]);
  const [POL, setPOL] = useState([]);
  const [POD, setPOD] = useState([]);
  const [carrier, setCarrier] = useState([]);
  const [Agent, setAgent] = useState([]);
  const [location, setLocation] = useState([]);
  const [locationTH, setLocationTH] = useState([]);
  const { forecastID } = useParams();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(async () => {
    gtm.push({ event: 'page_view' });
    if (mounted) {
      await instance.get('/forecast')
        .then((res) => {
          // console.log(forecastID, mode);
          const result = res.data.filter((data) => data.fc_uuid === forecastID);
          setMonthlyTables(result);
          setMonthlyTablesAll(res.data
            .filter((data) => data.fc_uuid !== forecastID)
            .sort((a, b) => (a.fc_timestamp < b.fc_timestamp ? 1 : -1)));
          const tmp2 = [];
          let start = 1;
          if (result.length > 0) {
            start = result[0].fc_week_no;
          } else {
            start = Number(Moment(new Date()).format('W'));
          }
          for (let i = start; i < 53; i++) {
            tmp2.push({ id: i,
              value: i });
          }
          setWeek(tmp2);
        });
      await instance.get('/profile/customer/owner')
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
      await instance.get('/table/city')
        .then((res) => {
          setLocation([{ id: '', value: '' }, ...res.data
            .sort((a, b) => (a.cc_city_name.toUpperCase() > b.cc_city_name.toUpperCase() ? 1 : -1))
            .map((val) => ({ id: val.cc_city_id, value: `${val.cc_city_name}` }))]);
          setLocationTH([{ id: '', value: '' }, ...res.data
            .sort((a, b) => (a.cc_city_name.toUpperCase() > b.cc_city_name.toUpperCase() ? 1 : -1))
            .map((val) => ({ id: val.cc_city_id, value: `${val.cc_city_name}` }))]);
        });
      await instance.get('/inquiry')
        .then((res) => {
          setInquiry(res.data
            .sort((a, b) => (a.inq_no.toUpperCase() < b.inq_no.toUpperCase() ? 1 : -1)));
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
    if (MonthlyTables.length > 0) {
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
          <MonthlySalesForecastEdit
            MonthlyTables={MonthlyTables}
            Customer={Customer}
            Inquiry={Inquiry}
            POL={POL}
            POD={POD}
            carrier={carrier}
            Agent={Agent}
            MonthlyTablesAll={MonthlyTablesAll}
            Week={Week}
            location={location}
            locationTH={locationTH}
          />
        )}
    </>

  );
};

export default Account;
