<script>
  import { Line } from 'vue-chartjs'
   
  export default {
    extends: Line,
    props: ['respiratoryRate'],
    mounted () {
      this.renderChart({
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
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