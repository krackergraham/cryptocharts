import axios from 'axios';

export const get = function (pool) {
  let poolReq;
  switch (params.pool) {
    case 'ahashpool':
      poolReq = ahashpool;
      break;
    case 'hashrefinery':
      poolReq = hashrefinery;
      break;
    case 'zpool':
      poolReq = zpool;
      break;
    default:
      poolReq = ahashpool;
  }
  return poolReq;
};

const checkData = function (res) {
  // console.log(res)

  if (res == null || res.data == null || typeof res.data === typeof String || res.status !== 200 || res.data === 'Loading...') return [];

  console.log('type:', typeof res.data);

  let data = typeof res.data !== typeof Object
    ? JSON.parse(res.data)
    : res.data;


  if (typeof data === typeof Array) {
    console.log(data.length)
    return data;
  }

  // console.log(typeof data)
  // console.log(data);

  return [];
}

export const getAll = function (id) {
  return new Promise((res, rej) => {
    axios
      .all([
        ahashpool(id),
        hashrefinery(id),
        zpool(id),
        zergpool(id)
      ])
      .then(axios.spread(function (ahash, hash, zpool, zerg) {
        // console.log(zpool.data);

        let ahashData = checkData(ahash);
        // let hashData = checkData(hash);
        // let zpoolData = checkData(zpool);
        // let zergData = checkData(zerg);

        res([
          ahashData,
          hashData,
          // zpoolData,
          // zerData
        ])
      }))
      .catch((err) => {
        rej(err);
      })
  })
};

export const ahashpool = function (id) {
  return axios.create({
    baseURL: 'https://www.ahashpool.com',
    timeout: 5000,
    headers: {
      'Content-Type': 'application/json',
    },
    responseType: 'json',
  }).get(`wallet_graph_earnings_results.php?wallet=${id}`)
};

// http://pool.hashrefinery.com/?address
export const hashrefinery = function (id) {
  return axios.create({
    baseURL: 'http://pool.hashrefinery.com',
    timeout: 5000,
    headers: {
      'Content-Type': 'application/json',
    },
    responseType: 'json',
  }).get(`site/graph_earnings_results?address=${id}`)
};

export const zpool = function (id) {
  return axios.create({
    baseURL: 'http://www.zpool.ca/',
    timeout: 5000,
    headers: {
      'Content-Type': 'application/json',
    },
    responseType: 'json',
  }).get(`site/graph_earnings_results?address=${id}`)
};

export const zergpool = function (id) {
  return axios.create({
    baseURL: 'http://www.zergpool.com/',
    timeout: 5000,
    headers: {
      'Content-Type': 'application/json',
    },
    responseType: 'json',
  }).get(`site/graph_earnings_results?address=${id}`)
};

