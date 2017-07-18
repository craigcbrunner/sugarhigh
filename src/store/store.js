import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const BLOOD_SUGAR_ACTION_TYPES = {
  FOOD: 'food',
  EXERCISE: 'exercise'
}

const BLOOD_SUGAR_BASELINE = 80
const BLOOD_SUGAR_GRAPH_STEP = 60
const BLOOD_SUGAR_FOOD_MOVEMENT_WINDOW_MINUTES = 120
const BLOOD_SUGAR_EXERCISE_MOVEMENT_WINDOW_MINUTES = 60
const HOUR_IN_MINUTES = 60

const state = {
  foods: null,
  exercises: null,
  sugarActionsTimeline: []
}

// helper function to convert our string times to convert our times to minutes
function convertTimeToMinutes (timeString) {
  let splitString = timeString.split(':')
  let hour = parseInt(splitString[0])
  let minutes = parseInt(splitString[1])
  return hour * HOUR_IN_MINUTES + minutes
}

function convertTimeToHours (timeString) {
  let splitString = timeString.split(':')
  let hour = parseInt(splitString[0])
  let minutes = parseInt(splitString[1])
  if (minutes > 0) {
    return hour + 0.5
  } else {
    return hour
  }
}

/* getter functions for views to request data */
const getters = {
  getFoodById: (state, getters) => id => {
    return state.foods.find(food => food.id === id)
  },
  getExerciseById: (state, getters) => id => {
    return state.exercises.find(exercise => exercise.id === id)
  },
  getFoodGraphValues: (state, getters) => () => {
    let foodGraphValues = []
    state.sugarActionsTimeline.forEach(el => {
      // const minTime = convertTimeToMinutes(el.time)
      if (el.type === BLOOD_SUGAR_ACTION_TYPES.FOOD) {
        foodGraphValues.push({
          x: convertTimeToHours(el.time),
          y: 0,
          label: state.foods.find(food => food.id === el.id).name
        })
      }
    })
    return foodGraphValues
  },
  getExerciseGraphValues: (state, getters) => () => {
    let exerciseGraphValues = []
    state.sugarActionsTimeline.forEach(el => {
      if (el.type === BLOOD_SUGAR_ACTION_TYPES.EXERCISE) {
        exerciseGraphValues.push({
          x: convertTimeToHours(el.time),
          y: 0,
          label: state.exercises.find(exercise => exercise.id === el.id).name
        })
      }
    })
    return exerciseGraphValues
  },
  getBloodSugarGraphValues: (state, getters) => graphStep => {
    // these constants should be constant to this function, unlike the ones above
    // which could theoretically be manipulated
    const MINUTES_IN_DAY = 1500

    // calculate blood sugar graph
    let bloodSugarGraphValues = []
    let currBloodSugarIncreases = []
    let currBloodSugarDecreases = []
    let minutesGoneBySinceStep = BLOOD_SUGAR_GRAPH_STEP
    let exercisesByTime = {}
    let foodsByTime = {}
    let currBloodSugar = BLOOD_SUGAR_BASELINE
    let currBaselineStep = 0
    let currGraphIndex = 0
    let glycation = 0

    // convert state array into state hash to help complexity of my algorithm
    state.sugarActionsTimeline.forEach(el => {
      const minTime = convertTimeToMinutes(el.time)
      if (el.type === BLOOD_SUGAR_ACTION_TYPES.FOOD) {
        // grab the food glycomic index by its id and set for the time
        // need to make this an array of arrays so we can have multiple foods at same time
        if (!foodsByTime[minTime]) {
          foodsByTime[minTime] = []
        }
        foodsByTime[minTime].push(state.foods.find(food => food.id === el.id).glyIndex)
      } else if (el.type === BLOOD_SUGAR_ACTION_TYPES.EXERCISE) {
        // grab the exercise glycomic index by its id and set for the time
        if (!exercisesByTime[minTime]) {
          exercisesByTime[minTime] = []
        }
        exercisesByTime[minTime].push(state.exercises.find(exercise => exercise.id === el.id).exIndex)
      }
    })

    for (let currMin = 0; currMin < MINUTES_IN_DAY; currMin++) {
      // if we hit an exercise we need to add it to our container of blood sugar decreases
      if (exercisesByTime[currMin]) {
        // reset the baseline movement when we get an action
        currBaselineStep = 0
        if (exercisesByTime[currMin].length > 0) {
          exercisesByTime[currMin].forEach(el => {
            // add the step amount (glyIndex / two hour window for linear) and time remaining
            currBloodSugarDecreases.push({
              stepAmount: el * 1.0 / BLOOD_SUGAR_EXERCISE_MOVEMENT_WINDOW_MINUTES,
              stepTimeRemaining: BLOOD_SUGAR_EXERCISE_MOVEMENT_WINDOW_MINUTES
            })
          })
        }
      }

      // if we hit a food we need to add it to our container of blood sugar decreases
      if (foodsByTime[currMin]) {
        // reset the baseline movement when we get an action
        currBaselineStep = 0
        if (foodsByTime[currMin].length > 0) {
          foodsByTime[currMin].forEach(el => {
            // add the step amount (glyIndex / two hour window for linear) and time remaining
            currBloodSugarIncreases.push({
              stepAmount: el * 1.0 / BLOOD_SUGAR_FOOD_MOVEMENT_WINDOW_MINUTES,
              stepTimeRemaining: BLOOD_SUGAR_FOOD_MOVEMENT_WINDOW_MINUTES
            })
          })
        }
      }

      // remove blood sugar for the decreases from exercise
      if (currBloodSugarDecreases.length > 0) {
        currBloodSugarDecreases.forEach((el, index, obj) => {
          currBloodSugar = currBloodSugar - el.stepAmount
          el.stepTimeRemaining = el.stepTimeRemaining - 1
          // if there is no time remaining on this remove it from our array
          if (el.stepTimeRemaining <= 0) {
            obj.splice(index, 1)
          }
        })
      }

      // add blood sugar for the increases from food
      if (currBloodSugarIncreases.length > 0) {
        currBloodSugarIncreases.forEach((el, index, obj) => {
          currBloodSugar = currBloodSugar + el.stepAmount
          el.stepTimeRemaining = el.stepTimeRemaining - 1
          // if there is no time remaining on this remove it from our array
          if (el.stepTimeRemaining <= 0) {
            obj.splice(index, 1)
          }
        })
      }

      // check if we haven't had any activity and get blood sugar back to baseline
      if (currBloodSugarIncreases.length === 0 && currBloodSugarDecreases.length === 0) {
        if (currBloodSugar > BLOOD_SUGAR_BASELINE) {
          currBaselineStep = (currBloodSugar - BLOOD_SUGAR_BASELINE) * -1.0 / BLOOD_SUGAR_FOOD_MOVEMENT_WINDOW_MINUTES
        } else if (currBloodSugar < BLOOD_SUGAR_FOOD_MOVEMENT_WINDOW_MINUTES) {
          currBaselineStep = (BLOOD_SUGAR_BASELINE - currBloodSugar) * 1.0 / BLOOD_SUGAR_FOOD_MOVEMENT_WINDOW_MINUTES
        }
      }

      // actually move towards baseline
      if (currBaselineStep !== 0) {
        currBloodSugar = currBloodSugar + currBaselineStep
        // handle the floating point rounding
        if (currBloodSugar < 81 && currBloodSugar > 79) {
          currBloodSugar = 80
        }
      }

      // I don't think there can be negative blood sugar, lets bottom out at 0
      if (currBloodSugar <= 0) {
        currBloodSugar = 0
      }

      // keep track of glycation
      if (currBloodSugar > 150) {
        glycation++
      }

      // create a graph point based on our step, so we don't create a graph point for every minute
      // and clog up chartjs
      if (minutesGoneBySinceStep >= BLOOD_SUGAR_GRAPH_STEP) {
        bloodSugarGraphValues[currGraphIndex] = {y: currBloodSugar, x: currGraphIndex}
        minutesGoneBySinceStep = 0
        currGraphIndex++
      } else {
        minutesGoneBySinceStep++
      }
    }
    return { bloodSugarGraphValues: bloodSugarGraphValues, glycation: glycation }
  }
}

/* mutations for synchronously commiting data to our state store */
const mutations = {
  addFoods (state, foods) {
    state.foods = foods
  },
  addExercises (state, exercises) {
    state.exercises = exercises
  },
  addToSugarActionTimeline (state, {type, id, time}) {
    state.sugarActionsTimeline.push({
      type,
      id,
      time
    })

    // when we get a sugar action keep the array sorted by time
    state.sugarActionsTimeline.sort((a, b) => {
      if (a.time < b.time) {
        return -1
      } else {
        return 1
      }
    })
  },
  reset (state) {
    state.sugarActionsTimeline = []
  }
}

/* actual actions for handling the asynchronous adding to state store */
const actions = {
  loadFoods ({commit}) {
    return new Promise((resolve, reject) => {
      // grab foods from the static JSON url
      fetch('static/foods.json').then((response) => {
        response.json().then((data) => {
          // once we have the json commit it with the mutation to the store
          commit('addFoods', data)
          // resolve the load foods promise
          resolve()
        })
      })
    })
  },

  loadExercises ({commit}) {
    return new Promise((resolve, reject) => {
      // grab foods from the static JSON url
      fetch('static/exercises.json').then((response) => {
        response.json().then((data) => {
          // once we have the json commit it with the mutation to the store
          commit('addExercises', data)
          // resolve the load foods promise
          resolve()
        })
      })
    })
  },

  addFoodToTimeline ({commit}, {id, time}) {
    return new Promise((resolve, reject) => {
      commit('addToSugarActionTimeline', {type: BLOOD_SUGAR_ACTION_TYPES.FOOD, id: id, time: time})
      resolve()
    })
  },

  addExerciseToTimeline ({commit}, {id, time}) {
    return new Promise((resolve, reject) => {
      commit('addToSugarActionTimeline', {type: BLOOD_SUGAR_ACTION_TYPES.EXERCISE, id: id, time: time})
      resolve()
    })
  },
  resetAll ({commit}) {
    return new Promise((resolve, reject) => {
      commit('reset')
      resolve()
    })
  }
}

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})
