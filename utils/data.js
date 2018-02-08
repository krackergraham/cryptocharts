import { ahashpool, hashrefinery, zpool } from '~/components/request';

const error = require("eslint/lib/logging").error;

export default function ({ store, redirect, params }) {

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
  return poolReq(params.id)
    .then((res) => {
      if (res == null || res.data == null || res.status !== 200 || res.data[0] == null) return;

      store.commit('SET_BALANCE', res.data[0]);
      store.commit('SET_PENDING_BALANCE', res.data[1]);
      store.commit('SET_POOL', params.pool);
    })
    .catch((err) => {
      error(err)
    })
}
