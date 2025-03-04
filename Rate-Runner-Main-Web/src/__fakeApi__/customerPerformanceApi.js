class CustomerPerformanceApi {
  getCustomerPerformance() {
    const customerPerformance = [
      {
        id: '5ece2c077e39da27658aa8a9',
        typeName: 'cust-key 1',
        customer: '10.00',
        inqNo: '10.00',
        sale: '10.00',
        team: '10.00',
        mode: '10.00',
        term: '10.00',
        pol: '10.00',
        pod: '10.00',
        country: '10.00',
        carrier: '10.00',
        commondity: '10.00',
        type: '10.00',
        type1: '10.00',
        type2: '10.00',
        type3: '10.00',
        CBM: '10.00',
        TEU: '10.00',
        revenue: '10.00',
        gp: '10.00',
        ros: '10.00',
        result: '10.00'
      }
    ];

    return Promise.resolve(customerPerformance);
  }
}

export const customerPerformanceApi = new CustomerPerformanceApi();
