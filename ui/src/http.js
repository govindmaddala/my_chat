import axios from "axios";
export const ENDPOINT = "https://govind-chat-app.onrender.com"
const http = axios.create({
    baseURL: `${ENDPOINT}/api`
})

export default http;
