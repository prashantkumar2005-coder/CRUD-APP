import axios from "axios"

const api = axios.create({
    baseURL: "https://crud-app-ipeo.onrender.com/"
})

export default api;