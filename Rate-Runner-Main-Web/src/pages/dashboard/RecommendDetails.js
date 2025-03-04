/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Moment from 'moment';
import { RecommendEdit } from '../../components/dashboard/RecommendDetails';
import gtm from '../../lib/gtm';
import instance from '../../store/instance';
import { Skeleton } from '@material-ui/core';

const Account = () => {
  const [mounted, setMounted] = useState(true);
  const [Inquiry, setInquiry] = useState([]);
  const [Customer, setCustomer] = useState([]);
  const [Sales, setSales] = useState([]);
  const [RateTables, setRateTables] = useState([]);
  const [AgentQuote, setAgentQuote] = useState([]);
  const [Agent, setAgent] = useState([]);
  const [Contact, setContact] = useState([]);
  const [MailHistory, setMailHistory] = useState([]);
  const [InquiryRate, setInquiryRate] = useState([]);
  const { recommendID } = useParams();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(async () => {
    gtm.push({ event: 'page_view' });
    if (mounted) {
      let customer;
      let Sale;
      let rateCusId;
      let ratePodId;
      let ratePolId;
      let cargoDate;
      let inqMode;
      let inqNo;
      let inqUUID;
      let agentID;
      let CTRNType;
      await instance.get(`/inquiry?inq_uuid=${recommendID}`)
        .then(async (res) => {
          setInquiry(res.data);
          customer = res.data[0].inq_cus_id;
          Sale = res.data[0].inq_user_id;
          rateCusId = res.data[0].inq_cus_id;
          ratePodId = res.data[0].inq_pod_id;
          ratePolId = res.data[0].inq_pol_id;
          cargoDate = res.data[0].inq_cargo_readiness;
          inqMode = res.data[0].inq_mode;
          inqNo = res.data[0].inq_no;
          inqUUID = res.data[0].inq_uuid;
          agentID = res.data[0].inq_agent_id;
          CTRNType = res.data[0].inq_type;
        });

      await instance.get('/profile/customer/')
        .then((res) => {
          setCustomer(res.data.filter((data) => data.cus_id === customer));
        });
      await instance.get('/profile/sale/')
        .then((res) => {
          setSales(res.data.filter((data) => data.user_id === Sale));
        });
      await instance.get('/profile/agent')
        .then((res) => {
          setAgent(res.data.sort((a, b) => (a.agent_name.toUpperCase() > b.agent_name.toUpperCase() ? 1 : -1))
            .map((val) => ({ id: val.agent_id, value: val.agent_name })));
        });
      await instance.get('contact?ct_refer_table=agent')
        .then((res) => {
          setContact(res.data
            .sort((a, b) => (a.ct_name.toUpperCase() > b.ct_name.toUpperCase() ? 1 : -1)));
        });
      await instance.get('/agent/quote/')
        .then((res) => {
          setAgentQuote(res.data.filter((data) => (data.aq_inq_no === inqUUID)));
        });
      await instance.get('/table/rate')
        .then(async (res) => {
          /* console.log('inqMode:', inqMode, 'ratePodId:', ratePodId, 'ratePolId:',
            ratePolId, 'cargoDate:', cargoDate, 'inqNo:', inqNo, 'customer:', customer); */
          const tmp = res.data.filter((data) => ((
            (
              (
                inqMode !== ''
                        && ratePodId !== ''
                        && ratePolId !== ''
                        && cargoDate !== ''
                        && CTRNType !== ''
              )
                && ((data.rate_inq_no === '' || !data.rate_inq_no) && (data.rate_cus_id === '' || !data.rate_cus_id))
                    && ((inqMode === 'Sea Import'
                        && data.pol_port_id === ratePolId
                        && ((Moment(cargoDate).format('YYYY-MM-DD')) <= (Moment(data.rate_valid_from).format('YYYY-MM-DD'))
                        || (Moment(cargoDate).format('YYYY-MM-DD')) <= (Moment(data.rate_expired_to).format('YYYY-MM-DD')))
                        && data.rate_type === CTRNType
                    )
                        || (inqMode === 'Sea Export'
                        && data.pod_port_id === ratePodId
                        && ((Moment(cargoDate).format('YYYY-MM-DD')) <= (Moment(data.rate_valid_from).format('YYYY-MM-DD'))
                        || (Moment(cargoDate).format('YYYY-MM-DD')) <= (Moment(data.rate_expired_to).format('YYYY-MM-DD')))
                        && data.rate_type === CTRNType
                        )
                        || (inqMode === 'Triangle'
                        && data.pod_port_id === ratePodId
                        && data.pol_port_id === ratePolId
                        && ((Moment(cargoDate).format('YYYY-MM-DD')) <= (Moment(data.rate_valid_from).format('YYYY-MM-DD'))
                        || (Moment(cargoDate).format('YYYY-MM-DD')) <= (Moment(data.rate_expired_to).format('YYYY-MM-DD')))
                        && data.rate_type === CTRNType
                        ))
            ) || (
              ((data.rate_inq_no && data.rate_inq_no !== '') ? data.rate_inq_no === inqNo : false)
            ) || (
              ((data.rate_cus_id && data.rate_cus_id !== '') ? data.rate_cus_id === customer : false)
                    && ((inqMode === 'Sea Import'
                    && data.pol_port_id === ratePolId
                    && ((Moment(cargoDate).format('YYYY-MM-DD')) <= (Moment(data.rate_valid_from).format('YYYY-MM-DD'))
                        || (Moment(cargoDate).format('YYYY-MM-DD')) <= (Moment(data.rate_expired_to).format('YYYY-MM-DD')))
                    && data.rate_type === CTRNType
                    )
                || (inqMode === 'Sea Export'
                    && data.pod_port_id === ratePodId
                    && ((Moment(cargoDate).format('YYYY-MM-DD')) <= (Moment(data.rate_valid_from).format('YYYY-MM-DD'))
                        || (Moment(cargoDate).format('YYYY-MM-DD')) <= (Moment(data.rate_expired_to).format('YYYY-MM-DD')))
                    && data.rate_type === CTRNType
                )
                || (inqMode === 'Triangle'
                    && data.pod_port_id === ratePodId
                    && data.pol_port_id === ratePolId
                    && ((Moment(cargoDate).format('YYYY-MM-DD')) <= (Moment(data.rate_valid_from).format('YYYY-MM-DD'))
                        || (Moment(cargoDate).format('YYYY-MM-DD')) <= (Moment(data.rate_expired_to).format('YYYY-MM-DD')))
                    && data.rate_type === CTRNType
                ))
            ))
          ));
          setRateTables(tmp);
          await instance.get(`/inquiry/${recommendID}/rate`)
            .then((res2) => {
              setInquiryRate(res2.data);
              tmp.map((data) => {
                res2.data.map((inqrate) => {
                  if (inqrate.rate_id === data.rate_id) {
                    if (data.rate_recommend === 'R') {
                      data.inqrate = 'Y';
                    }
                    data.rate_recommend = 'R';
                  }
                  return 0;
                });
                return 0;
              });
            });
        });

      await instance.get('/log/mail')
        .then((res) => {
          setMailHistory(res.data.filter((data) => (data.inq_uuid === inqUUID)));
        });
      setIsLoading(false);
    }

    if (Inquiry.length > 0) {
      setMounted(false);
    }
  }, [mounted]);

  // Usually query is done on backend with indexing solutions

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
          <RecommendEdit
            Inquiry={Inquiry}
            Customer={Customer}
            Sales={Sales}
            RateTables={RateTables}
            AgentQuote={AgentQuote}
            Agent={Agent}
            MailHistory={MailHistory}
            Contact={Contact}
            InquiryRate={InquiryRate}
          />
        )}
    </>
  );
};

export default Account;
