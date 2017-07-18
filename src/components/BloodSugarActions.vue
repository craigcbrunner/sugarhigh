<template>
  <div id = "blood-sugar-actions">
    <blood-sugar-chart class = "blood-sugar-chart"
    :options="{responsive: true, maintainAspectRatio: false}"
    :height="150"
    :chartData = "$store.getters.getBloodSugarGraphValues().bloodSugarGraphValues"
	>	
    </blood-sugar-chart>
    <div class="glycation-holder">
    	Glycation: {{$store.getters.getBloodSugarGraphValues().glycation}}
    </div>
    <blood-sugar-actions-picker class = "blood-sugar-picker"></blood-sugar-actions-picker>
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
	.blood-sugar-chart {
		width: 100%;
	}

	.glycation-holder {
		text-align: center;
		font-size: 30px;
	}
</style>