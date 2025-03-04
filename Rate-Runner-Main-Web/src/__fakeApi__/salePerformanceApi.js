class SalePerformanceApi {
  getSalePerformanceApi() {
    const salePerformances = [
      {
        id: '5ece2c077e39da27658aa8a9',
        team: 'BD',
        noInq: '34',
        percent: '10',
        win: '12',
        winPercent: '35',
        loss: '',
        lossPercent: '0',
        pending: '22',
        pendingPercent: '65',
        disable: '',
        disablePercent: ''
      },
      {
        id: '5ece2c077e39da27658aa8a9',
        team: 'CURRENT',
        noInq: '31',
        percent: '',
        win: '11',
        winPercent: '35',
        loss: '',
        lossPercent: '0',
        pending: '20',
        pendingPercent: '65',
        disable: '',
        disablePercent: ''
      },
      {
        id: '5ece2c077e39da27658aa8a9',
        team: 'SALE FORCE I',
        noInq: '58',
        percent: '18',
        win: '17',
        winPercent: '29',
        loss: '4',
        lossPercent: '7',
        pending: '37',
        pendingPercent: '64',
        disable: '',
        disablePercent: ''
      }
    ];

    return Promise.resolve(salePerformances);
  }
}

export const salePerformanceApi = new SalePerformanceApi();
