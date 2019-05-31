<script>
  import { Line } from 'vue-chartjs'
   
  export default {
    extends: Line,
    props: ['dataset'],
    mounted () {
      this.renderChart({
        labels: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '00'],
        options: {
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero: true
                  }
              }]
          }
        },
        datasets: [
          {
            label: '# Patients',
            backgroundColor: '#9C27B0',
            data: this.dataset
          }
        ]
        }, {responsive: true, maintainAspectRatio: false})
    }
  }
</script>