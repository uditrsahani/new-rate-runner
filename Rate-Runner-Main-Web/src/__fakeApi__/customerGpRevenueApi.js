class CustomerGpRevenueApi {
  getCustomerGpRevenue() {
    const customerGpRevenue = [
      {
        id: '5ece2c077e39da27658aa8a9',
        keyAC: 'cust-key 1',
        sumRevenue: '10.00',
        sumGP: '10.00',
        janRevenue: '10.00',
        janGP: '10.00',
        febRevenue: '10.00',
        febGP: '10.00',
        marRevenue: '10.00',
        marGP: '10.00',
        aprRevenue: '10.00',
        aprGP: '10.00',
        mayRevenue: '10.00',
        mayGP: '10.00',
        junRevenue: '10.00',
        junGP: '10.00',
        julRevenue: '10.00',
        julGP: '10.00',
        augRevenue: '10.00',
        augGP: '10.00',
        sepRevenue: '10.00',
        sepGP: '10.00',
        octRevenue: '10.00',
        octGP: '10.00',
        novRevenue: '10.00',
        novGP: '10.00',
        decRevenue: '10.00',
        decGP: '10.00',
      }
    ];

    return Promise.resolve(customerGpRevenue);
  }
}

export const customerGpRevenueApi = new CustomerGpRevenueApi();
