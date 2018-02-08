<template>
  <div>
    <h1 class="title">{{selected}} - {{dayAvg}} BTC/day</h1>
    <line-chart class="chart" :chart-data="dataCollection" :options="options" :height="650"/>
    <p class="hr-avg">{{hrAvg}} BTC/day last hr</p>
    <br>

    <div class="selector">
      <select title="pool" v-model="selected">
        <option v-for="option in pools" v-bind:key="option.value">
          {{ option.text }}
        </option>
      </select>
      <br>
      <!--<span>Selected: {{ selected }}</span>-->
      <input class="address-input" v-model="address" placeholder="BTC Address">
    </div>

  </div>
</template>


<script>
  import LineChart from '~/components/LineChart';

  export default {
    name: 'Charts',
    middleware: 'data',
    components: { 'line-chart': LineChart },
    data() {

      return {
        dayAvg: this.$store.getters.dayAvg,
        hrAvg: this.$store.getters.lastHrAvg,
        poolName: this.$store.getters.pool,
        address: '1LxPi1ke5byuU8XTb36EzkxxsJWwXN7cJF',
        selected: 'ZPool',
        pools: [
          { text: 'ZPool', value: 'zpool' },
          { text: 'AHashPool', value: 'ahashpool' },
          { text: 'HashRefinery', value: 'hashrefinery' }
        ],
        options: {
          responsive: true,
          maintainAspectRatio: false,
          title: {
            display: true,
            text: 'Earnings - 24hrs'
          },
          layout: {
            padding: {
              left: 20,
              right: 20,
              top: 20,
              bottom: 0
            },
          },
          scales: {
            xAxes: [{
              type: 'time',
              time: {
                unit: 'hour',
              },
            }],
            yAxes: [{
              id: 'A',
              position: 'left',
              scaleLabel: {
                display: true,
                labelString: 'BTC'
              },
              ticks: {
                // suggestedMax: .01,
                beginAtZero: true
              }
            },
              {
                id: 'B',
                position: 'right',
                scaleLabel: {
                  display: true,
                  labelString: 'BTC/day'
                },
                ticks: {
                  beginAtZero: true
                }
              }]
          }
        }
      };
    },
    computed:
      {
        dataCollection: function () {
          return {
            labels: this.$store.getters.timestamps,
            datasets: [
              {
                label: 'Balance',
                yAxisID: 'A',
                radius: 2,
                spanGaps: true,
                borderColor: 'rgba(0, 100, 255, 0.7)',
                backgroundColor: 'transparent',
                data: this.$store.getters.balance,
              },
              {
                label: 'Balance + Pending',
                yAxisID: 'A',
                radius: 2,
                spanGaps: true,
                borderColor: 'rgba(255, 60, 0, 0.5)',
                backgroundColor: 'transparent',
                data: this.$store.getters.pendingBal,
              },
              {
                label: 'Projected BTC/day Hr. Avg.',
                yAxisID: 'B',
                spanGaps: true,
                // steppedLine: true,
                radius: 2,
                borderColor: 'rgba(190, 60, 244, 0.5)',
                backgroundColor: 'transparent',
                data: this.$store.getters.hourAvg,
              },
              {
                label: 'Projected BTC/day',
                yAxisID: 'B',
                spanGaps: true,
                radius: 2,
                borderColor: 'rgba(50, 255, 0, 0.5)',
                backgroundColor: 'rgba(50, 255, 0, 0.1)',
                data: this.$store.getters.dataAvg,
              },
            ]
          }
        }
      }
  };

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .title {
    text-align: center;
    margin: 25px auto 10px;
  }

  .hr-avg {
    margin-top: 20px;
    text-align: center;
  }

  .selector {
    text-align: center;
  }

  .address-input {
    margin-top: 10px;
    min-width: 300px;
  }

</style>
