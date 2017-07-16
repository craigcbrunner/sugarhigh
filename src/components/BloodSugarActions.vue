<template>
  <div id = "blood-sugar-actions">
    <blood-sugar-actions-picker></blood-sugar-actions-picker>
  </div>
</template>

<script>
import BloodSugarActionsPicker from './BloodSugarActionsPicker'

export default {
  name: 'blood-sugar-actions',
  components: {
    'blood-sugar-actions-picker': BloodSugarActionsPicker
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>