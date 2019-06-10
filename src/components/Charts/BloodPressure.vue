<script>
  import { Line } from 'vue-chartjs'
   
  export default {
    extends: Line,
    props: ['bloodPressure', 'dates'],
    mounted () {
      this.renderChart({
        labels: [this.dates],
      datasets: [
        {
          label: 'Blood Pressure',
          backgroundColor: '#CDDC39',
          data: this.bloodPressure
        },
      ]
      }, {responsive: true, maintainAspectRatio: false})
    }
  }
</script>