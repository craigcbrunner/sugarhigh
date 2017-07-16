<template>
  <div class="sugarhigh">
    <blood-sugar-actions></blood-sugar-actions>
  </div>
</template>

<script>
import BloodSugarActions from './BloodSugarActions'

export default {
  name: 'sugarhigh',
  components: {
    'blood-sugar-actions': BloodSugarActions
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>