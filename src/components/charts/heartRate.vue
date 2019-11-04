<script>
  import { Line } from 'vue-chartjs'
   
  export default {
    extends: Line,
    props: ['heartRate','dates'],
    mounted () {
      this.renderChart({
      labels: this.dates,
      datasets: [
        {
          label: 'Heart Rate',
          backgroundColor: '#009688',
          data: this.heartRate
        },
      ]
      }, {responsive: true, maintainAspectRatio: false})
    }
  }
</script>