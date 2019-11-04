<script>
  import { Line } from 'vue-chartjs'
   
  export default {
    extends: Line,
    props: ['respiratoryRate','dates'],
    mounted () {
      this.renderChart({
          labels: this.dates,
      datasets: [
        {
          label: 'Respiratory Rate',
          backgroundColor: '#2196F3',
          data: this.respiratoryRate
        },
      ]
      }, {responsive: true, maintainAspectRatio: false})
    
    }
  }
</script>