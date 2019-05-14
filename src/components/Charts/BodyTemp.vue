<script>
  import { Line } from 'vue-chartjs'
   
  export default {
    extends: Line,
    props: ['bodyTemperature'],
    mounted () {
      this.renderChart({
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
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