<template>
  <div>
    <canvas :id="'chart-'+title" width="400" height="400"></canvas> 
    <div style="display:none">{{stats}}</div>
  </div>
</template>

<script>
import Vue from 'vue'
import Chart from 'chart.js'

export default {
  name: 'doChart',
  props: ['title','labels', 'stats'],
  components: {
    
  },
  data:()=>({
    myChart:null,
    serverError:{},
    isLoading: false,
  }),
  computed:{

  },
  methods:{
    formatStats(){
      var ctx = document.getElementById('chart-'+this.title);
      let bgColors = []
      this.labels.forEach(label=> {        
        bgColors.push(this.getBGColor(label))
      });
      this.myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: this.labels,
          datasets: [{
            data: this.stats,
            backgroundColor: bgColors,
            borderWidth: 1,
          }]
        }
      });
    },
    updateStats(){
      this.myChart.data.datasets[0].data = this.stats
      this.myChart.update();
    },
    getBGColor(status){
      let colors ={
        "male": "#db2828",
        "female": "#8a0909",
        "unspecified": "#fbbd08",
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
    this.formatStats()
  },
  updated(){
    this.updateStats()
  }
}
</script>
<style scoped>
</style>

