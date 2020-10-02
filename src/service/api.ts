import axios from 'axios'
import 'dotenv/config'

const api = axios.create({
    baseURL: `URL`,
})

export default api