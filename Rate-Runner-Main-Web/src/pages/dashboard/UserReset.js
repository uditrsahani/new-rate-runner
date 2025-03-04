import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import instance from '../../store/instance';
import gtm from '../../lib/gtm';
import { UserReset } from '../../components/dashboard/UserDetails';

const Account = () => {
  const [mounted, setMounted] = useState(true);
  const [FormID, setFormID] = useState([]);
  const user = JSON.parse(window.localStorage.getItem('user'));
  const { userID } = useParams();
  const userCurrent = (userID) || user.user_id;

  useEffect(async () => {
    gtm.push({ event: 'page_view' });
    if (mounted) {
      await instance.get(`profile/sale/${userCurrent}`)
        .then((res) => {
          setFormID(res.data);
        });
    }
    if (FormID.length > 0) {
      setMounted(false);
    }
  }, []);

  return (
    <UserReset
      sx={{ mt: 3, mr: 3 }}
      FormID={FormID}
    />
  );
};

export default Account;
