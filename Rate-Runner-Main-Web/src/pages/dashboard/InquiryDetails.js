import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import instance from '../../store/instance';
import { InquiryEdit } from '../../components/dashboard/inquiryDetail';
import Moment from 'moment';
import gtm from '../../lib/gtm';
import { Skeleton } from '@material-ui/core';

const Account = () => {
  const [mounted, setMounted] = useState(true);
  const [MonthlyTables, setMonthlyTables] = useState([]);
  const [Week, setWeek] = useState([]);
  const [Customer, setCustomer] = useState([]);
  const [Inquiry, setInquiry] = useState([]);
  const [Reinquiry, setReinquiry] = useState([]);
  const [POL, setPOL] = useState([]);
  const [POD, setPOD] = useState([]);
  const [carrier, setCarrier] = useState([]);
  const [Agent, setAgent] = useState([]);
  const [location, setLocation] = useState([]);
  const [locationTH, setLocationTH] = useState([]);
  const [RateTables, setRateTables] = useState([]);
  const [AgentQuote, setAgentQuote] = useState([]);
  const [Competitor, setCompetitor] = useState([]);
  const [InquiryRate, setInquiryRate] = useState([]);
  const { inqID } = useParams();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(async () => {
    gtm.push({ event: 'page_view' });
    if (mounted) {
      if (inqID) {
        await instance.get('/inquiry/'.concat(inqID))
          .then((res) => {
            setInquiry([res.data]);
          });
      }
      await instance.get('/inquiry?minimize=true')
        .then((res) => {
          setReinquiry(res.data
            .filter((data) => data.inq_uuid !== inqID)
            .sort((a, b) => (a.inq_no.toUpperCase() < b.inq_no.toUpperCase() ? 1 : -1)));
        });
      await instance.get('/forecast')
        .then((res) => {
          if (inqID !== '' && inqID) {
            setMonthlyTables(res.data
              .sort((a, b) => (a.fc_timestamp < b.fc_timestamp ? 1 : -1)));
          } else {
            setMonthlyTables(res.data
              .filter((data) => (data.fc_inq_uuid === '' || !data.fc_inq_uuid))
              .sort((a, b) => (a.fc_timestamp < b.fc_timestamp ? 1 : -1)));
          }
          const tmp2 = [];
          tmp2.push({ id: '0', value: '' });
          for (let i = 0; i < 5; i++) {
            tmp2.push({
              id: Number(Moment(`2021-${new Date().getMonth() + 1}-01`).format('W')) + i,
              value: Number(Moment(`2021-${new Date().getMonth() + 1}-01`).format('W')) + i
            });
          }
          setWeek(tmp2);
        });
      await instance.get('/profile/customer/owner')
        .then((res) => {
          setCustomer(res.data
            .sort((a, b) => (a.cus_name.toUpperCase() > b.cus_name.toUpperCase() ? 1 : -1))
            .map((val) => ({ id: val.cus_id, value: val.cus_name, type: val.cus_type })));
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
      await instance.get('/profile/competitor')
        .then((res) => {
          setCompetitor([{ id: '', value: '' }, ...res.data
            .sort((a, b) => (a.ct_name.toUpperCase() > b.ct_name.toUpperCase() ? 1 : -1))
            .map((val) => ({ id: val.ct_id, value: val.ct_name }))]);
        });
      await instance.get('/table/rate')
        .then((res) => {
          setRateTables(res.data);
          // console.log(res.data);
        });
      await instance.get('/agent/quote/')
        .then((res) => {
          setAgentQuote(res.data.filter((data) => (data.aq_inq_no === inqID))
            .sort((a, b) => (a.aq_inq_no.toUpperCase() > b.aq_inq_no.toUpperCase() ? 1 : -1)));
        });
      if (inqID && inqID !== '') {
        await instance.get(`/inquiry/${inqID}/rate`)
          .then((res2) => {
            setInquiryRate(res2.data);
          });
      }
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
          <InquiryEdit
            MonthlyTables={MonthlyTables}
            Customer={Customer}
            Inquiry={Inquiry}
            Reinquiry={Reinquiry}
            POL={POL}
            POD={POD}
            carrier={carrier}
            Agent={Agent}
            Week={Week}
            location={location}
            locationTH={locationTH}
            RateTables={RateTables}
            AgentQuote={AgentQuote}
            Competitor={Competitor}
            InquiryRate={InquiryRate}
          />
        )}
    </>
  );
};

export default Account;
