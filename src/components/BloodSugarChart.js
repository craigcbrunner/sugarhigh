import { Line } from 'vue-chartjs'

// quickly create the labels for the chart
const labelNumbers = []
for (let i = 0; i < 24; i++) {
  labelNumbers[i] = `${i}:00`
}

export default Line.extend({
  props: ['chartData'],
  watch: {
    chartData () {
      this._chart.clear()
      this._chart.destroy()
      this.renderChart({
        labels: labelNumbers,
        datasets: [
          {
            label: 'BloodSugar',
            backgroundColor: '#f87979',
            data: this.chartData
          }
        ]
      })
    }
  },
  mounted () {
    this.renderChart({
      labels: labelNumbers,
      datasets: [
        {
          label: 'BloodSugar',
          backgroundColor: '#f87979',
          data: this.chartData
        }
      ]
    })
  }
})
