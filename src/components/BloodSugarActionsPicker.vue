<template>
  <div id = "blood-sugar-actions-picker">
    <!-- time picker from element UI -->
    
    <div class = "picker-label">Time of action: </div>
    <div class="time-picker">
      <el-time-select v-model="timeValue"
        :picker-options="{
          start: '00:00',
          step: '00:30',
          end: '24:00'
        }"
        placeholder="Arbitrary time">
      </el-time-select>
    </div>
    
    <!-- food picker -->
    <div class = "food-picker">
      <div class = "picker-label">Foods: </div>
      <el-select v-model="foodValue" class = "picker-selector">
        <el-option v-for="item in $store.state.foods" :key="item.glyIndex" :label="item.name" :value="item.glyIndex">
        </el-option>
      </el-select>
    </div>
    <!-- add food button -->
    <div class = "picker-button">
      <el-button type = "primary"> Add Food </el-button>
    </div> 
    <!-- exercise picker -->
    <div class = "exercise-picker">
      <div class = "picker-label">Exercises: </div>
      <el-select v-model="exerciseValue" class = "picker-selector">
        <el-option v-for="option in $store.state.exercises" v-bind:value="option.exIndex">
          {{ option.name }}
        </el-option>
      </el-select>
    </div>
  <!-- add exercise -->
  <div class = "picker-button">
    <el-button type = "primary"> Add Exercsie </el-button>
  </div> 
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'

export default {
  name: 'blood-sugar-actions-picker',
  data () {
    return {
      foodValue: '',
      exerciseValue: '',
      timeValue: ''
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

  .time-picker {
    display: inline-block;
    margin-top: 20px;
    margin-bottom: 20px;
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