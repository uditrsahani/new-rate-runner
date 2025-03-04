class TopCustomerInqApi {
  getTopCustomerInqApi() {
    const topCustomerInq = [
      {
        id: '5ece2c077e39da27658aa8a9',
        customer: '1',
        sales: '2',
        inqNo: '3',
        containerNo: '7',
        revenue: '4',
        gp: '5',
        ros: '6'
      }
    ];

    return Promise.resolve(topCustomerInq);
  }
}

export const topCustomerInqApi = new TopCustomerInqApi();
