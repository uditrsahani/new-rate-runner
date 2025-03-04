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
  const [City, setCity] = useState([]);
  const [Contact, setContact] = useState([]);
  const { cusId } = useParams();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(async () => {
    gtm.push({ event: 'page_view' });
    if (mounted) {
      await instance.get('/profile/customer')
        .then((res) => {
          setCustomer(res.data.filter((data) => data.cus_id === cusId));
        });
      await instance.get(`contact?ct_refer_id=${cusId}`)
        .then((res) => {
          setContact(res.data
            .sort((a, b) => (a.ct_name.toUpperCase() > b.ct_name.toUpperCase() ? 1 : -1)));
        });
      await instance.get('/table/city')
        .then((res) => {
          setCity([{ id: '', value: '' }, ...res.data
            .sort((a, b) => (a.cc_city_name.toUpperCase() > b.cc_city_name.toUpperCase() ? 1 : -1))
            .map((val) => ({ id: val.cc_city_id, value: `${val.cc_city_name}` }))]);
          setCountry([{ id: '', value: '' }, ...res.data
            .sort((a, b) => (a.cc_country_name.toUpperCase() > b.cc_country_name.toUpperCase() ? 1 : -1))
            .map((val) => ({ id: val.cc_country_id, value: val.cc_country_name }))]);
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
          />
        )}
    </>
  );
};

export default Account;
