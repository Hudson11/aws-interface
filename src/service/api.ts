import axios from 'axios'
import 'dotenv/config'

const api = axios.create({
    baseURL: process.env.REACT_APP_SERVICE,
})

export default api