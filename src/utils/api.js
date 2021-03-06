import axios from 'axios'
const apiurl = process.env.VUE_APP_API_URL;
const apiCall = ({url, data, method}) => new Promise((resolve, reject) => {
  console.log(url)
  url = apiurl+url
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

export function get(url, params) {
    return axios({
        method: 'GET',
        url: url,
        params: params
    })
}

export function byMethod(method, url, data) {
    return axios({
        method: method,
        url: url,
        data: data
    })
}

export default apiCall

