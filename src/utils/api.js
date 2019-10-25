import axios from 'axios'

<<<<<<< HEAD
const base_url = 'http://127.0.0.1:8000';
=======
const base_url = 'http://his_backend.test';

// const base_url = 'http://127.0.0.1:8000';
>>>>>>> 1116581d76b8399c41da0e25038d6eecb08abfe7

const apiCall = ({url, data, method}) => new Promise((resolve, reject) => {
  console.log(url)
  url = base_url+url
  setTimeout(() => {
    try {
      
      axios.defaults.headers.common['Authorization'] = localStorage.getItem('user-token');
      if (method == 'GET') {
        axios.get(url, { crossdomain: true }).then((response) => {
          resolve(response.data)
        }).catch((error) => {
          reject(new Error(error))
        })
      } else if (method == 'POST'){
        axios.post(url,data).then((response) => {
          resolve(response.data)
        }).catch((error) => {
          reject(new Error(error))
        });
      } else if (method == 'PUT'){
        axios.put(url,data).then((response) => {
          resolve(response.data)
        }).catch((error) => {
          reject(new Error(error))
        });
      } else if (method == 'DELETE'){
        axios({ method: 'delete', url: url,data: null})
        .then((response) => {
          resolve(response.data)
        }).catch((error) => {
          reject(new Error(error))
        });
      }
    } catch (err) {
      reject(new Error(err))
    }
  }, 1000)
})

export default apiCall