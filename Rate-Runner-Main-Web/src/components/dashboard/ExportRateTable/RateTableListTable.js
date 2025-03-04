import { useState } from 'react';
import PropTypes from 'prop-types';
import Moment from 'moment';
import DatePicker from '@material-ui/lab/DatePicker';
import instance from '../../../store/instance';
import GetAppIcon from '@material-ui/icons/GetApp';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
// import SearchIcon from '../../../icons/Search';
import {
  Box,
  Button,
  Card,
  Grid,
  TextField,
  Typography
} from '@material-ui/core';

const RateTableListTable = (props) => {
  const { RateTables, POL, POD, carrier, ...other } = props;
  const user = JSON.parse(window.localStorage.getItem('user'));
  const [startdate, setStartDate] = useState(Moment(new Date()).format('YYYY-MM-DD'));
  const [enddate, setEndDate] = useState(Moment(new Date()).format('YYYY-MM-DD'));
  const [view, setView] = useState('Rate table');
  const [urlexport, setExport] = useState(`/table/rate/export?rate_disable=0&rate_date_from=${startdate}&rate_date_to=${enddate}`);

  const downLoadFile = async () => {
    // const url = `/table/rate/export?rate_disable=0&rate_date_from=${startdate}&rate_date_to=${enddate}`;

    let url = '';
    if (view === 'Rate table') {
      url = `/table/rate/export?rate_disable=0&rate_date_from=${startdate}&rate_date_to=${enddate}`;
    } else {
      url = urlexport;
    }

    await instance.get(url,
      {
        method: 'GET',
        responseType: 'blob'
      })
      .then((res) => {
        const urlDownload = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = urlDownload;
        link.setAttribute('download', `${Date.now()}.xlsx`);
        document.body.appendChild(link);
        link.click();
      });
  };

  return (
    <Card {...other}>
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <Grid
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexWrap: 'wrap',
            m: -1,
            p: 2
          }}
        >
          <Box
            sx={{
              m: 1,
              width: 220
            }}
          >
            <Typography
              variant="h6"
            >
              &nbsp;Select Data
            </Typography>
            <TextField
              size="small"
              fullWidth
              name="veiw"
              onChange={(val) => {
                setView(val.target.value);
                if (val.target.value === 'Rate table') {
                  setExport(`/table/rate/export?rate_disable=0&rate_date_from=${startdate}&rate_date_to=${enddate}`);
                } else if (val.target.value === 'City & Country') {
                  setExport('/table/city/export');
                } else if (val.target.value === 'Port') {
                  setExport('/table/port/export');
                } else if (val.target.value === 'Sales') {
                  setExport('/profile/sale/export');
                } else if (val.target.value === 'Agent') {
                  setExport('/profile/agent/export');
                } else if (val.target.value === 'Carrier') {
                  setExport('/profile/carrier/export');
                } else if (val.target.value === 'Customer') {
                  setExport('/profile/customer/export');
                } else if (val.target.value === 'Competitor') {
                  setExport('/profile/competitor/export');
                }
              }}
              select
              SelectProps={{ native: true }}
              variant="outlined"
            >
              {['Rate table',
                'City & Country',
                'Port',
                'Sales',
                'Agent',
                'Carrier',
                'Customer',
                'Competitor'
              ].map((obj) => (
                <option
                  key={obj}
                  value={obj}
                  selected={obj === view}
                >
                  {obj}
                </option>
              ))}
            </TextField>
          </Box>
          <Box
            sx={{
              m: 1,
              maxWidth: '100%',
              width: 220
            }}
            display={(view === 'Rate table') ? 'block' : 'none'}
          >
            <Typography
              variant="h6"
            >
              &nbsp;Rate Table Date
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                value={startdate}
                inputFormat="dd/MM/yyyy"
                name="inq_date"
                onChange={(date) => setStartDate(Moment(date).format('YYYY-MM-DD'))}
                renderInput={(params) => (
                  <TextField
                    size="small"
                    {...params}
                    helperText=""
                  />
                )}
              />
            </LocalizationProvider>
          </Box>
          <Box
            sx={{
              m: 1,
              maxWidth: '100%',
              width: 220
            }}
            display={(view === 'Rate table') ? 'block' : 'none'}
          >
            <Typography
              variant="h6"
            >
              &nbsp;To
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                value={enddate}
                inputFormat="dd/MM/yyyy"
                name="inq_date"
                onChange={(date) => setEndDate(Moment(date).format('YYYY-MM-DD'))}
                renderInput={(params) => (
                  <TextField
                    size="small"
                    {...params}
                    helperText=""
                  />
                )}
              />
            </LocalizationProvider>
          </Box>
        </Grid>
        <Grid
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            m: 3,
            mt: 5
          }}
        >
          <Grid item>
            <Box
              sx={{ m: -1 }}
              display={(user.user_role === 'management' || user.user_role === 'marketingManager') ? 'block' : 'none'}
            >
              <Button
                color="primary"
                startIcon={<GetAppIcon />}
                sx={{ m: 1 }}
                variant="contained"
                onClick={downLoadFile}
              >
                EXPORT
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
};

RateTableListTable.propTypes = {
  RateTables: PropTypes.array.isRequired,
  POL: PropTypes.array.isRequired,
  carrier: PropTypes.array.isRequired,
  POD: PropTypes.array.isRequired,
};

export default RateTableListTable;
