import axios from 'axios';

const api = axios.create({
    baseURL: 'http://10.186.250.250:3333'
})

export default api;