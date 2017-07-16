import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  foods: null,
  exercises: null,
  sugarActionsTimeline: []
}

const TYPES = {
  FOOD: 'food',
  EXERCISE: 'exercise'
}
const getters = {
  getFoodById: (state, getters) => (id) => {
    return state.foods.find(food => food.id === id)
  },
  getExerciseById: (state, getters) => (id) => {
    return state.exercises.find(exercise => exercise.id === id)
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
      commit('addToSugarActionTimeline', {type: TYPES.FOOD, id: id, time: time})
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
