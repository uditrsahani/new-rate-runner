import instance from '../store/instance';

class InqStatusApi {
  async getInqList() {
    const inqList = await instance.get('/inquiry')
      .then((res) => {
        console.log();
        return Promise.resolve(res.data);
      })
      .catch((err) => {
        console.error(err.response);
      });
    return inqList;
  }

  async getCusList() {
    const cusList = await instance.get('/profile/customer')
      .then((res) => {
        console.log();
        return Promise.resolve(res.data);
      })
      .catch((err) => {
        console.error(err.response);
      });
    return cusList;
  }

  async getPortList() {
    const portList = await instance.get('/table/port?port_disable=0')
      .then((res) => {
        console.log();
        return Promise.resolve(res.data);
      })
      .catch((err) => {
        console.error(err.response);
      });
    return portList;
  }

  async getSalesList() {
    const saleList = await instance.get('/profile/sale?user_role=Sales')
      .then((res) => {
        console.log();
        return Promise.resolve(res.data);
      })
      .catch((err) => {
        console.error(err.response);
      });
    return saleList;
  }

  async searchInq(serCus, serInq, serPol, serPod, serSales) {
    let path = '/inquiry?inq_status=wating sales';
    if (serCus !== null) {
      path = `${path}&inq_cus_id=${serCus.cus_id}`;
    }
    if (serInq !== null) {
      path = `${path}&inq_uuid=${serInq.inq_uuid}`;
    }
    if (serPol !== null) {
      path = `${path}&inq_pol_id=${serPol.port_id}`;
    }
    if (serPod !== null) {
      path = `${path}&inq_pod_id=${serPod.port_id}`;
    }
    if (serSales !== null) {
      path = `${path}&inq_user_id=${serSales.cus_id}`;
    }
    const search = await instance.get(path)
      .then((res) => {
        console.log();
        return Promise.resolve(res.data);
      })
      .catch((err) => {
        console.error(err.response);
      });
    return search;
  }
  // async ForecastList() {
  //   const search = await instance.get(`/forecast?fc_cus_id=${cus_id}&month=${month}&year=${year}`)
  //     .then((res) => {
  //       console.log();
  //       return Promise.resolve(res.data);
  //     })
  //     .catch((err) => {
  //       console.error(err.response);
  //     });
  //   return search;
  // }
}

export const inqStatusApi = new InqStatusApi();
