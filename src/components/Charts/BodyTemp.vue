<script>
  import { Line } from 'vue-chartjs'
   
  export default {
 extends: Line,
    props: ['bodyTemperature','dates'],
    mounted () {
      this.renderChart({
         labels: this.dates,
      datasets: [
        {
          label: 'Body Temperature',
          backgroundColor: '#9C27B0',
          data: this.bodyTemperature
        }
      ]
      }, {responsive: true, maintainAspectRatio: false})
    }
  }
</script>
