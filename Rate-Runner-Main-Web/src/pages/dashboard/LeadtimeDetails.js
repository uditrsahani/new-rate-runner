import { useState, useEffect } from 'react';
import instance from '../../store/instance';
import gtm from '../../lib/gtm';
import { LeadtimeEdit } from '../../components/dashboard/LeadtimeDetails';

const Account = () => {
  const [mounted, setMounted] = useState(true);
  const [leadtime, setLeadtime] = useState([]);

  useEffect(async () => {
    gtm.push({ event: 'page_view' });
    if (mounted) {
      await instance.get('/table/tat')
        .then((res) => {
          // console.log(res.data);
          setLeadtime(res.data);
        });
    }
    if (leadtime.length > 0) {
      setMounted(false);
    }
  }, []);

  return (
    <LeadtimeEdit
      sx={{ mt: 3, mr: 3 }}
      leadtime={leadtime}
    />
  );
};

export default Account;
