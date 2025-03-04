import numeral from 'numeral';
import Chart from 'react-apexcharts';
import { Box, Card, CardContent, CardHeader, TextField, Typography } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';

const data = {
  series: [
    {
      color: '#7783DB',
      category: 'Adam Zapel',
      data: 100000
    },
    {
      color: '#7BC67E',
      category: 'Barb E. Dahl',
      data: 90000
    },
    {
      color: '#FFB547',
      category: 'Jack Pott',
      data: 80000
    },
    {
      color: '#F06191',
      category: 'Jo King',
      data: 70000
    },
    {
      color: '#64B6F7',
      category: 'Mike Stand',
      data: 60000
    },
    {
      color: '#7783DB',
      category: 'Warren Peace',
      data: 50000
    },
    {
      color: '#7BC67E',
      category: 'Sonny Day',
      data: 40000
    },
    {
      color: '#FFB547',
      category: 'Ray Gunn',
      data: 30000
    },
    {
      color: '#F06191',
      category: 'Orson Carte',
      data: 20000
    },
    {
      color: '#64B6F7',
      category: 'Mona Lott',
      data: 10000
    }
  ]
};

const FinanceIncrementalSales = (props) => {
  const theme = useTheme();

  const chartOptions = {
    chart: {
      background: 'transparent',
      stacked: false,
      toolbar: {
        show: false
      }
    },
    colors: data.series.map((item) => item.color),
    dataLabels: {
      enabled: false
    },
    grid: {
      borderColor: theme.palette.divider,
      yaxis: {
        lines: {
          show: false
        }
      }
    },
    legend: {
      show: false
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '45',
        distributed: true
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
      categories: data.series.map((item) => item.category)
    },
    yaxis: {
      labels: {
        show: false
      }
    }
  };

  const chartSeries = [
    {
      data: data.series.map((item) => item.data),
      name: 'Sales'
    }
  ];

  return (
    <Card
      container
      direction="column"
      justifyContent="flex-start"
      alignItems="center"
      {...props}
    >
      <CardHeader title="Top 10" />
      <Box
        sx={{
          m: 1,
          ml: 2,
          mt: -1,
          maxWidth: '100%',
          width: 180
        }}
      >
        <TextField
          size="small"
          fullWidth
          name="Customer"
          select
          variant="outlined"
        />
      </Box>
      <CardContent>
        <Chart
          height="300"
          options={chartOptions}
          series={chartSeries}
          type="bar"
        />
        {data.series.map((item) => (
          <Box
            key={item.category}
            sx={{
              alignItems: 'center',
              display: 'flex',
              p: 1
            }}
          >
            <Box
              sx={{
                backgroundColor: item.color,
                borderRadius: '50%',
                height: 8,
                width: 8
              }}
            />
            <Typography
              color="textPrimary"
              sx={{ ml: 2 }}
              variant="subtitle2"
            >
              {item.category}
            </Typography>
          </Box>
        ))}

      </CardContent>
    </Card>
  );
};

export default FinanceIncrementalSales;
