import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import instance from '../../store/instance';
import gtm from '../../lib/gtm';
import { CustomerEdit } from '../../components/dashboard/CustomerProfileDetails';
import { Skeleton } from '@material-ui/core';

const Account = () => {
  const [mounted, setMounted] = useState(true);
  const [Customer, setCustomer] = useState([]);
  const [Country, setCountry] = useState([]);
  const [Team, setTeam] = useState([]);
  const [City, setCity] = useState([]);
  const [Owner, setOwner] = useState([]);
  const [Contact, setContact] = useState([]);
  const { cusId } = useParams();
  const user = JSON.parse(window.localStorage.getItem('user'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(async () => {
    gtm.push({ event: 'page_view' });
    if (mounted) {
      await instance.get('/profile/customer')
        .then((res) => {
          setCustomer(res.data.filter((data) => data.cus_id === cusId));
        });
      await instance.get(`/user/owner/${cusId}`)
        .then((res) => {
          setOwner(res.data);
          console.log(res.data);
        });
      await instance.get(`contact?ct_refer_id=${cusId}`)
        .then((res) => {
          setContact(res.data
            .sort((a, b) => (a.ct_name.toUpperCase() > b.ct_name.toUpperCase() ? 1 : -1)));
        });
      await instance.get('/user/team')
        .then((res) => {
          if (user.user_role === 'dataAdmin' || user.user_role === 'management') {
            setTeam([{ user_id: 'BD Team',
              user_fullname: 'BD Team',
              user_team: 'BD Team',
              user_role: 'BD Team',
              user_disable: '0' }, { user_id: 'Marketing Team',
              user_fullname: 'Marketing Team',
              user_team: 'Marketing Team',
              user_role: 'Marketing Team',
              user_disable: '0' }, ...res.data
              .filter((data) => ((data.user_team && data.user_team !== 'BD' && data.user_team !== 'Marketing' && data.user_team !== 'Management') ? data.user_team : false))
              .sort((a, b) => (a.user_fullname.toUpperCase() > b.user_fullname.toUpperCase() ? 1 : -1))
              .map((val) => ({ user_id: val.user_id,
                user_fullname: `${val.user_fullname}`,
                user_team: `${val.user_team}`,
                user_role: `${val.user_role}`,
                user_disable: `${val.user_disable}` }))]);
          } else {
            setTeam(res.data
              .filter((data) => ((data.user_team && data.user_team !== 'BD' && data.user_team !== 'Marketing' && data.user_team !== 'Management') ? data.user_team : false))
              .sort((a, b) => (a.user_fullname.toUpperCase() > b.user_fullname.toUpperCase() ? 1 : -1))
              .map((val) => ({ user_id: val.user_id,
                user_fullname: `${val.user_fullname}`,
                user_team: `${val.user_team}`,
                user_role: `${val.user_role}`,
                user_disable: `${val.user_disable}` })));
          }
          /* if (user.user_role === 'marketingManager' || user.user_role === 'marketing' || user.user_role === 'management') {
            setTeam([{ user_id: 'BD Team',
              user_fullname: 'BD Team',
              user_team: 'BD Team',
              user_role: 'BD Team' }, { user_id: 'Marketing Team',
              user_fullname: 'Marketing Team',
              user_team: 'Marketing Team',
              user_role: 'Marketing Team' }, ...res.data
              .filter((data) => ((data.user_team && data.user_team !== 'BD' && data.user_team !== 'Marketing' && data.user_team !== 'Management') ? data.user_team : false))
              .sort((a, b) => (a.user_fullname.toUpperCase() > b.user_fullname.toUpperCase() ? 1 : -1))
              .map((val) => ({ user_id: val.user_id,
                user_fullname: `${val.user_fullname}`,
                user_team: `${val.user_team}`,
                user_role: `${val.user_role}` }))]);
          } else if (user.user_team === 'BD') {
            setTeam([{ user_id: 'BD Team',
              user_fullname: 'BD Team',
              user_team: 'BD Team',
              user_role: 'BD Team' }, ...res.data
              .filter((data) => ((data.user_team && data.user_team !== 'BD' && data.user_team !== 'Marketing' && data.user_team !== 'Management') ? data.user_team : false))
              .sort((a, b) => (a.user_fullname.toUpperCase() > b.user_fullname.toUpperCase() ? 1 : -1))
              .map((val) => ({ user_id: val.user_id,
                user_fullname: `${val.user_fullname}`,
                user_team: `${val.user_team}`,
                user_role: `${val.user_role}` }))]);
          } else if (user.user_team === 'Marketing') {
            setTeam([{ user_id: 'Marketing Team',
              user_fullname: 'Marketing Team',
              user_team: 'Marketing Team',
              user_role: 'Marketing Team' }, ...res.data
              .filter((data) => ((data.user_team && data.user_team !== 'BD' && data.user_team !== 'Marketing' && data.user_team !== 'Management') ? data.user_team : false))
              .sort((a, b) => (a.user_fullname.toUpperCase() > b.user_fullname.toUpperCase() ? 1 : -1))
              .map((val) => ({ user_id: val.user_id,
                user_fullname: `${val.user_fullname}`,
                user_team: `${val.user_team}`,
                user_role: `${val.user_role}` }))]);
          } else {
            setTeam(res.data
              .filter((data) => ((data.user_team && data.user_team !== 'BD' && data.user_team !== 'Marketing' && data.user_team !== 'Management') ? data.user_team : false))
              .sort((a, b) => (a.user_fullname.toUpperCase() > b.user_fullname.toUpperCase() ? 1 : -1))
              .map((val) => ({ user_id: val.user_id,
                user_fullname: `${val.user_fullname}`,
                user_team: `${val.user_team}`,
                user_role: `${val.user_role}` })));
          } */
        });
      await instance.get('/table/city')
        .then((res) => {
          setCity(res.data
            .sort((a, b) => (a.cc_city_name.toUpperCase() > b.cc_city_name.toUpperCase() ? 1 : -1))
            .map((val) => ({ id: val.cc_city_id, value: `${val.cc_city_name}`, country_name: `${val.cc_country_name}`, country_id: `${val.cc_country_id}` })));
          setCountry(res.data
            .sort((a, b) => (a.cc_country_name.toUpperCase() > b.cc_country_name.toUpperCase() ? 1 : -1))
            .map((val) => ({ id: val.cc_country_id, value: val.cc_country_name }))
            .filter((thing, index, self) => index === self.findIndex((t) => (
              t.id === thing.id && t.value === thing.value
            ))));
          /* console.log(Array.from(new Set(res.data
            .sort((a, b) => (a.cc_country_name.toUpperCase() > b.cc_country_name.toUpperCase() ? 1 : -1))
            .map((val) => ({ id: val.cc_country_id, value: val.cc_country_name }))))); */
        });
      setIsLoading(false);
    }
    if (Customer.length > 0) {
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
          <CustomerEdit
            sx={{ mt: 3, mr: 3 }}
            Customer={Customer}
            Country={Country}
            Contact={Contact}
            City={City}
            Team={Team}
            Owner={Owner}
          />
        )}
    </>
  );
};

export default Account;
