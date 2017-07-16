<template>
  <div id = "blood-sugar-actions-picker">
    <!-- food picker -->
    <div class = "food-picker">
      <div class = "picker-label">Foods: </div>
      <select class = "picker-selector">
        <option v-for="option in $store.state.foods" v-bind:value="option.glyIndex">
          {{ option.name }}
        </option>
      </select>
    </div>
    <!-- add food button -->
    <div class = "picker-button">
      <button class = "btn btn-success"> Add Food </button>
    </div> 
    <!-- exercise picker -->
    <div class = "exercise-picker">
      <div class = "picker-label">Exercises: </div>
      <select class = "picker-selector">
        <option v-for="option in $store.state.exercises" v-bind:value="option.exIndex">
          {{ option.name }}
        </option>
      </select>
    </div>
  <!-- add exercise -->
  <div class = "picker-button">
    <button class = "btn btn-success"> Add Exercise </button>
  </div> 
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'

export default {
  name: 'blood-sugar-actions-picker',
  data () {
    return {
      foods: this.$store.foods
    }
  },
  beforeMount () {
    this.$store.dispatch('loadFoods')
    this.$store.dispatch('loadExercises')
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #blood-sugar-actions-picker {
    margin-left: 20px;
    margin-top: 20px;
  }
  .picker-label {
    display: inline-block;
  }

  .picker-selector {
    display: inline-block;
  }

  .picker-button {
    margin-top: 20px;
    margin-bottom: 20px;
  }
</style>