import axios from "axios"

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
})

// apiClient.interceptors.request.use(config => {
//     const token = localStorage.getItem('apiToken')
//     if (token) {
//         config.headers = {
//             ...config.headers,
//             'X-AUTH-TOKEN': token,
//         }
//     }
//     return config
//     }, error => {
//     return Promise.reject(error)
// })

export default apiClient