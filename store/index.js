import * as helper from '../utils/averageHelper';
import { ahashpool } from "../utils/request";

export const state = () => ({
  balance: [],
  pendingBal: [],
});

export const actions = {
  async GET_DATA({ commit }) {
    const { data } = await ahashpool.get();
    commit('SET_STARS', data)
  }
};

export const mutations = {
  SET_BALANCE(state, data) {
    state.balance = data
  },
  SET_PENDING_BALANCE(state, data) {
    state.pendingBal = data;
  },
  SET_POOL(state, pool) {
    state.pool = pool;
  }
};

export const getters = {
  pool(state) {
    return state.pool
  },
  timestamps(state) {
    if (state.balance.length <= 1) return [];
    return state.balance.map((d) => {
      let date = new Date(0);                                   // Epoch date in milliseconds
      date.setUTCMilliseconds(Date.parse(d[0]));                // Set milliseconds from supplied date string
      let offset = state.pool === 'ahashpool'
        ? date - (60000 * date.getTimezoneOffset())
        : date - (60000 * (date.getTimezoneOffset() - 300));
      date.setTime(offset);  // Subtract the equivalent hour offset for the timezone
      return date.toString();
    });
  },
  balance(state) {
    if (state.balance.length <= 1) return [];

    return state.balance.map((d) => {
      return d[1] > 0 ? d[1] : null
    });
  },
  pendingBal(state) {
    if (state.pendingBal.length <= 1) return [];

    return state.pendingBal.map((d, i) => {
      let val = d[1] + state.balance[i][1];
      return val > 0 ? val : null;
    });
  },
  /**
   * Avg over 15 min intervals
   * @param state
   * @returns {Array || null}
   */
  dataAvg(state) {
    if (state.balance.length < 1 || state.pendingBal.length < 1) return [];

    return state.balance.map((d, i) => {
      if (i > 0) {
        let f = helper.firstNonZeroIndex(state.balance, i - 1);
        let s = helper.firstNonZeroIndex(state.balance, i);

        let first = helper.getSummedBalanceArray(state.balance, state.pendingBal, f);
        let second = helper.getSummedBalanceArray(state.balance, state.pendingBal, s);

        return helper.averageProjected(first, second);
      }

      return null;
    })
  },
  /**
   * Avg over hour intervals
   * @param state
   * @returns {Array || null}
   */
  hourAvg(state) {
    if (state.balance.length <= 1) return [];
    let interval = 4;
    let half = interval / 2;

    return state.balance.map((d, i) => {
      if (((i + half) % interval === 0 || i === half) && i < state.balance.length - half) {
        let f = helper.lastNonZeroIndex(state.balance, i - half);
        let s = helper.firstNonZeroIndex(state.pendingBal, i + half);

        let first = helper.getSummedBalanceArray(state.balance, state.pendingBal, f);
        let sec = helper.getSummedBalanceArray(state.balance, state.pendingBal, s);

        return helper.averageProjected(first, sec)
      }
      return null;
    })
  },

  /**
   * Avg over the last 24hrs
   * @param state
   * @returns {Number}
   */
  dayAvg(state) {
    if (state.balance.length <= 1 || state.pendingBal.length <= 1) return 0;

    // Get most recent non-zero values
    let ind = helper.firstNonZeroIndex(state.balance);
    let last = helper.lastNonZeroIndex(state.balance);

    let first = helper.getSummedBalanceArray(state.balance, state.pendingBal, ind);
    let second = helper.getSummedBalanceArray(state.balance, state.pendingBal, last);

    return helper.averageProjected(first, second, true);
  },

  /**
   * Last hour projected average including pending balances
   * @param state
   * @returns {number}
   */
  lastHrAvg(state) {
    if (state.balance.length <= 1 || state.pendingBal.length <= 1) return 0;

    let ind = helper.lastNonZeroIndex(state.balance, 4);
    let last = helper.lastNonZeroIndex(state.balance);

    let first = helper.getSummedBalanceArray(state.balance, state.pendingBal, ind);
    let second = helper.getSummedBalanceArray(state.balance, state.pendingBal, last);

    return helper.averageProjected(first, second, true);
  }
};
