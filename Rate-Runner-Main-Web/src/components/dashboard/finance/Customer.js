import Chart from 'react-apexcharts';
import { Card, CardContent, CardHeader, Skeleton } from '@material-ui/core';
import { useEffect, useCallback, useState } from 'react';
import instance from '../../../store/instance';
import PropTypes from 'prop-types';

const Customer = (props) => {
  const { year } = props;
  const [Xlose] = useState([]);
  const [Xwin] = useState([]);
  const [Ybase] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getReport = useCallback(async () => {
    // console.log(view.toLowerCase(), startdate, enddate);
    let tempYear = 0;
    if (!year) {
      tempYear = new Date().getFullYear();
    } else {
      tempYear = year;
    }
    const start = `${tempYear}-01-01 00:00:00`;
    const end = `${tempYear}-12-31 23:59:59`;
    try {
      await instance.get(`/inquiry/report/top?group=customer&inq_status=close&inq_disable=0&inq_date_from=${start}&inq_date_to=${end}`)
        .then((res) => {
          console.log(year, res.data);

          const limit = 10;
          const tmpReport = [];

          res.data.sort((a, b) => (Number(a.win_gp_sum) < Number(b.win_gp_sum)))
            .map((val, index) => {
              if (index < limit) {
                tmpReport.push(val);
                Ybase.push(val.cus_name);
                Xwin.push(val.win_gp_sum);
                Xlose.push(val.loss_gp_sum);
              }
              return null;
            });
        });
      setIsLoading(false);
    } catch (err) {
      console.error(err.respones);
    }
  }, [year]);

  useEffect(() => {
    getReport();
  }, [year]);
  const chartOptions = {
    chart: {
      type: 'bar',
      height: 600
    },
    colors: [
      '#00B861',
      '#C70039'
    ],
    plotOptions: {
      bar: {
        horizontal: true,
        dataLabels: {
          position: 'top',
        }
      }
    },
    dataLabels: {
      enabled: true,
      offsetX: -10,
      style: {
        fontSize: '13px',
        colors: ['#fff']
      },
      formatter(value) {
        return Number(value).toLocaleString(navigator.language, { minimumFractionDigits: 0 });
      }
    },
    stroke: {
      show: true,
      width: 1,
      colors: ['#fff']
    },
    tooltip: {
      shared: true,
      intersect: false,
    },
    xaxis: {
      categories: Ybase
    }
  };

  const chartSeries = [
    {
      name: 'Win',
      data: Xwin
    },
    {
      name: 'Loss',
      data: Xlose
    }
  ];

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
          <Card {...props}>
            <CardHeader title="Top 10 Customer" />
            <CardContent>
              <Chart
                height="600"
                options={chartOptions}
                series={chartSeries}
                type="bar"
              />
            </CardContent>
          </Card>
        )}
    </>
  );
};

Customer.propTypes = {
  year: PropTypes.array.isRequired
};

export default Customer;
