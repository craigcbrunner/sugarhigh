<template>
  <div id = "blood-sugar-actions">
    <blood-sugar-actions-picker></blood-sugar-actions-picker>
    <blood-sugar-chart></blood-sugar-chart>
  </div>
</template>

<script>
import BloodSugarActionsPicker from './BloodSugarActionsPicker'
import BloodSugarChart from './BloodSugarChart'

export default {
  name: 'blood-sugar-actions',
  components: {
    'blood-sugar-actions-picker': BloodSugarActionsPicker,
    'blood-sugar-chart': BloodSugarChart
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>