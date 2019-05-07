<script>
  import { Line } from 'vue-chartjs'
   
  export default {
    extends: Line,
    props: ['bodyTemperature', 'respiratoryRate', 'heartRate', 'bloodPressure'],
    mounted () {
      this.renderChart({
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      datasets: [
        {
          label: 'Body Temperature',
          backgroundColor: '#9C27B0',
          data: this.bodyTemperature
        },
        {
          label: 'Respiratory Rate',
          backgroundColor: '#2196F3',
          data: this.respiratoryRate
        },
        {
          label: 'Heart Rate',
          backgroundColor: '#009688',
          data: this.heartRate
        },
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