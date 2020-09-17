import axios from 'axios'

const api = axios.create({
    baseURL: 'https://aws-service-api.herokuapp.com',
})

export default api