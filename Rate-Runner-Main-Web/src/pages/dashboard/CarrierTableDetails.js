import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import instance from '../../store/instance';
import gtm from '../../lib/gtm';
import { CarrierEdit } from '../../components/dashboard/CarrierTableDetails';
import { Skeleton } from '@material-ui/core';

const Account = () => {
  const [mounted, setMounted] = useState(true);
  const [Carrier, setCarrier] = useState([]);
  const [Country, setCountry] = useState([]);
  const [City, setCity] = useState([]);
  const [Contact, setContact] = useState([]);
  const { carrierId } = useParams();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(async () => {
    gtm.push({ event: 'page_view' });
    if (mounted) {
      await instance.get('/profile/Carrier')
        .then((res) => {
          setCarrier(res.data.filter((data) => data.cr_id === carrierId));
        });
      await instance.get(`contact?ct_refer_id=${carrierId}`)
        .then((res) => {
          setContact(res.data
            .sort((a, b) => (a.ct_name.toUpperCase() > b.ct_name.toUpperCase() ? 1 : -1)));
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
        });
      setIsLoading(false);
    }
    if (Carrier.length > 0) {
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
          <CarrierEdit
            sx={{ mt: 3, mr: 3 }}
            Carrier={Carrier}
            Country={Country}
            Contact={Contact}
            City={City}
          />
        )}
    </>
  );
};

export default Account;
