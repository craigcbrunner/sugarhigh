import { Scatter } from 'vue-chartjs'

const bloodSugarName = 'BloodSugar'
const bloodSugarColor = '#f87979'
const foodName = 'Foods'
const foodColor = '#91a5ff'

const exerciseName = 'Exercise'
const exerciseColor = '#7fef9b'

// quickly create the labels for the chart
const labelNumbers = []
for (let i = 0; i < 24; i++) {
  labelNumbers[i] = `${i}:00`
}

export default Scatter.extend({
  props: ['chartData'],
  // rerender the chart when chart data is updated
  methods: {
    chartOptions () {
      return {
        tooltips: {
          callbacks: {
            label: ({ index, datasetIndex }, { datasets }) => {
              return datasets[datasetIndex]['data'][index].label
            }
          }
        },
        scales: {
          xAxes: [{
            display: true,
            ticks: {
              callback: (value, index, values) => {
                let minutes = '00'
                if (value % 1 > 0) {
                  minutes = '30'
                }
                return `${Math.floor(value)}:${minutes}`
              },
              labels: labelNumbers,
              beginAtZero: true,
              min: -0.1,
              max: 24,
              stepSize: 0.5
            }
          }]
        }
      }
    },

    chartDatasets () {
      return {
        labels: labelNumbers,
        datasets: [{
          label: foodName,
          pointStyle: 'star',
          pointRadius: 10,
          showLine: false,
          pointBackgroundColor: foodColor,
          pointBorderColor: foodColor,
          pointBorderWidth: 4,
          fill: false,
          backgroundColor: foodColor,
          data: this.$store.getters.getFoodGraphValues()
        },
        {
          label: exerciseName,
          pointStyle: 'star',
          pointRadius: 10,
          showLine: false,
          pointBackgroundColor: exerciseColor,
          pointBorderColor: exerciseColor,
          pointBorderWidth: 4,
          fill: false,
          backgroundColor: exerciseColor,
          data: this.$store.getters.getExerciseGraphValues()
        },
        {
          label: bloodSugarName,
          backgroundColor: bloodSugarColor,
          fill: true,
          data: this.chartData
        }]
      }
    }
  },
  watch: {
    chartData () {
      this._chart.clear()
      this._chart.destroy()
      this.renderChart(this.chartDatasets(), this.chartOptions())
    }
  },
  mounted () {
    this.renderChart(this.chartDatasets(), this.chartOptions())
  }
})
