<template>
  <div>
    <canvas :id="'chart-'+title" width="400" height="250"></canvas> 
    <div style="display:none">{{stats}}</div>
  </div>
</template>

<script>
import Vue from 'vue'
import Chart from 'chart.js'

export default {
  name: 'lineChart',
  props: ['title','categories', 'stats'],
  components: {
    
  },
  data:()=>({
    chartLabels: null,
    myChart:null,
    serverError:{},
    isLoading: false,
  }),
  computed:{

  },
  methods:{
    createChart(){
      var ctx = document.getElementById('chart-'+this.title);
      if(this.stats && this.categories && Object.keys(this.stats).length>0){
        let checkedDatasets = this.formatStats()
        this.myChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels:this.chartLabels,
            datasets:checkedDatasets
          }
        });
      }
      console.log("Stats Keys",Object.keys(this.stats[2]))
    },
    formatStats(){
      let datasets = []
      this.stats.forEach((element,index) => {
        datasets.push({
          label: '# of '+this.categories[index],
          data: Object.values(element),
          backgroundColor: this.getBGColor(this.categories[index]),
          borderWidth: 1,
        })
        if(!this.chartLabels || this.chartLabels.length<Object.keys(element).length){
          this.chartLabels = Object.keys(element)
        }
      });
      return datasets
    },
    updateStats(){
      this.myChart.data.datasets = this.formatStats()
      this.myChart.data.labels = Object.keys(this.stats[0]),
      this.myChart.update();
    },
    getBGColor(status){
      let colors ={
        "male": "rgba(138, 9, 9, 0.6)",
        "female": "rgba(219, 40, 40, 0.6)",
        "unspecified": "rgba(251, 189, 8, 0.6)",
        "approved": "#21ba45",
        "active": "#16cc41",
        "accepted": "#057720",
        "cancelled": "#111",
        "retired": "#2c3e53",
        "suspended": "#2c3e53",
        "total": "#010101",
        "closed": "#9acd32",
        "completed": "#2b9742",
        "resolved": "#2b9742",
      }
      let statusL = status.toLowerCase()
      let check = statusL.substr(0,statusL.indexOf(' '))
      if(colors[statusL]){
        return colors[statusL]
      }
      else if(colors[check]){
        return colors[check]
      }else{
        return '#f6f6f6'
      }
    }
  },
  mounted(){
    console.log("Creating Line chart ")
    this.createChart()
  },
  updated(){
    console.log("Updating Line chart ")
    this.updateStats()
  }
}
</script>
<style scoped>
</style>

