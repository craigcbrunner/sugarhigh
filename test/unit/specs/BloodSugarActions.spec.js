import Vue from 'vue'
import BloodSugarActions from '@/components/BloodSugarActions'

describe('BloodSugarActions.vue', () => {
  it('should render picker and chart', () => {
    const Constructor = Vue.extend(Hello)
    const vm = new Constructor().$mount()
    expect(vm.$el.querySelector('#blood-sugar-actions'))
      .to.exist
  })
})
