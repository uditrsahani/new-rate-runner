class SaleForecastApi {
  getSaleForecastApi() {
    const saleForecast = [
      {
        id: '5ece2c077e39da27658aa8a9',
        forecast: {
          sales: 'Chaiyong',
          saleTeam: '',
          customer: 'Golden Grain',
          mode: 'Sea Import',
          pol: '',
          pod: '',
          country: '',
          type: 'DC',
          type1: '1',
          type2: '',
          type3: '',
          CBM: '',
          revenue: '55000',
          gp: '8000',
          rosPercent: '15',
          weekNo: '22'
        },
        actual: {
          inqNo: '2112345',
          type1: '1',
          type2: '',
          type3: '',
          CBM: '',
          revenue: '54661',
          gp: '8346',
          rosPercent: '15',
          weekNo: ''
        },
        diff: {
          revenue: '339',
          gp: '346',
        }
      }
    ];

    return Promise.resolve(saleForecast);
  }
}

export const saleForecastApi = new SaleForecastApi();
