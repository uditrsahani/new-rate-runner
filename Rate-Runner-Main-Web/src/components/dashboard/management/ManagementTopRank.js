import numeral from 'numeral';
import Chart from 'react-apexcharts';
import { Card, CardContent, CardHeader, Grid, Autocomplete, TextField, Typography } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';

const ManagementTopRank = (props) => {
  const theme = useTheme();
  const filterOption = [
    { text: 'Sales', value: 'Sales' },
    { text: 'Customer', value: 'Customer' },
    { text: 'Key Customer', value: 'Key Customer' },
    { text: 'Carrier', value: 'Carrier' }
  ];

  const chartOptions = {
    chart: {
      background: 'transparent',
      stacked: false,
      toolbar: {
        show: false
      }
    },
    colors: [
      '#7F94FF',
      '#6B7ED9',
      '#5B6BB8',
      '#45528D',
      '#323C67',
      '#2A3356'
    ],
    dataLabels: {
      enabled: true
    },
    grid: {
      borderColor: theme.palette.divider
    },
    plotOptions: {
      bar: {
        barHeight: '45',
        distributed: true,
        horizontal: true
      }
    },
    theme: {
      mode: theme.palette.mode
    },
    tooltip: {
      y: {
        formatter: (value) => numeral(value).format('$0,0.00')
      }
    },
    xaxis: {
      axisBorder: {
        color: theme.palette.divider,
        show: true
      },
      axisTicks: {
        color: theme.palette.divider,
        show: true
      },
      categories: [
        'Name1',
        'Name2',
        'Name3',
        'Name4',
        'Name5',
        'Name6'
      ]
    }
  };

  const chartSeries = [
    {
      name: 'Sales',
      data: [470, 440, 410, 380, 300, 187]
    }
  ];

  return (
    <Card {...props}>
      <CardHeader
        disableTypography
        title={(
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="left"
          >
            <Typography
              color="textPrimary"
              variant="h5"
            >
              TOP 10
            </Typography>
          </Grid>
        )}
      />
      <CardContent>
        <Grid
          container
          spacing={4}
        >
          <Grid
            item
            justifyContent="center"
            alignItems="center"
            xl={12}
            md={12}
            xs={12}
          >
            <Autocomplete
              autoHighlight
              getOptionLabel={(option) => option.text}
              options={filterOption}
              renderInput={(params) => (
                <TextField
                  fullWidth
                  label=""
                  name=""
                  variant="outlined"
                  {...params}
                />
              )}
            />
          </Grid>
        </Grid>
        <Chart
          height="350"
          options={chartOptions}
          series={chartSeries}
          type="bar"
        />
      </CardContent>
    </Card>
  );
};

export default ManagementTopRank;
