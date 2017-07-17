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
        :clearable="false"
        placeholder="Arbitrary time">
      </el-time-select>
    </div>
    
    <!-- food picker -->
    <div class = "food-picker">
      <div class = "picker-label">Foods: </div>
      <el-select v-model="foodValue" class = "picker-selector">
        <el-option v-for="item in $store.state.foods" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
    </div>
    <!-- add food button -->
    <div class = "picker-button">
      <el-button type = "primary" @click="addFood"> Add Food </el-button>
    </div> 
    <!-- exercise picker -->
    <div class = "exercise-picker">
      <div class = "picker-label">Exercises: </div>
      <el-select v-model="exerciseValue" class = "picker-selector">
        <el-option v-for="item in $store.state.exercises" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
    </div>
  <!-- add exercise -->
  <div class = "picker-button">
    <el-button type = "primary" @click="addExercise"> Add Exercise </el-button>
  </div> 
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'blood-sugar-actions-picker',
  data () {
    return {
      foodValue: '',
      exerciseValue: '',
      timeValue: '00:00'
    }
  },
  methods: {
    addFood () {
      this.$store.dispatch('addFoodToTimeline', {id: this.foodValue, time: this.timeValue})
    },
    addExercise () {
      this.$store.dispatch('addExerciseToTimeline', {id: this.exerciseValue, time: this.timeValue})
    }
  },
  computed: mapGetters['getFoods'],
  beforeMount () {
    this.$store.dispatch('loadFoods')
    this.$store.dispatch('loadExercises')

    // when foods and exercises are loaded set our selects on the first one
    this.$store.watch((state) => state.foods, (obj) => {
      if (this.$store.state.foods.length > 0) {
        // foods loaded set default
        this.foodValue = this.$store.state.foods[0].id
      }
    })

    this.$store.watch((state) => state.exercises, (obj) => {
      if (this.$store.state.exercises.length > 0) {
        // foods loaded set default
        this.exerciseValue = this.$store.state.exercises[0].id
      }
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #blood-sugar-actions-picker {
    width: 500px;
    margin: auto;
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