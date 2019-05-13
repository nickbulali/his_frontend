<script>
  import { Line } from 'vue-chartjs'
   
  export default {
    extends: Line,
    props: ['bloodPressure'],
    mounted () {
      this.renderChart({
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Blood Pressure',
          backgroundColor: '#CDDC39',
          data: this.heartRate
        },
      ]
      }, {responsive: true, maintainAspectRatio: false})
    }
  }
</script>