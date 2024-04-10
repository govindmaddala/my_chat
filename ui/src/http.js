import axios from "axios";
export const ENDPOINT = "https://my-chat-8v36.onrender.com"
const http = axios.create({
    baseURL: `${ENDPOINT}/api`
})

export default http;